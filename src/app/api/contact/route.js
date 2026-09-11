import { Resend } from "resend";
import { isRateLimited } from "@/lib/api/rate-limit";
import { verifyTurnstile } from "@/lib/api/turnstile-verify";

// O construtor do Resend explode se a chave estiver ausente, e no App Router
// este módulo é avaliado durante o build ("Collecting page data") — não só a
// cada requisição, como era na serverless function do Vite. Instanciar aqui
// fora derrubava o build em qualquer ambiente sem o segredo, como a CI.
// Preguiçoso: a chave só é exigida quando alguém de fato envia o formulário.
let resendClient = null;
function getResend() {
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

const TO   = "jpsantos@jmv.ind.br";
const FROM = "Formulário JMV <onboarding@resend.dev>";
// Após verificar o domínio jmv.ind.br no Resend, troque FROM por:
// 'Formulário JMV <contato@jmv.ind.br>'

const LIMITS = {
  nome:     100,
  email:    150,
  telefone: 20,
  mensagem: 1000,
};

function json(body, status) {
  return Response.json(body, { status });
}

function getClientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function sanitizeHeader(value) {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request) {
  // Checagem de origem agnóstica ao domínio: compara com o host da requisição,
  // então continua valendo quando o jmv.ind.br finalmente entrar no ar.
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get("host")) {
        return json({ error: "Origem não permitida" }, 403);
      }
    } catch {
      return json({ error: "Origem inválida" }, 403);
    }
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Corpo inválido" }, 400);
  }

  const { nome, email, telefone, mensagem, website, turnstileToken } = body ?? {};

  // Sem isto, `{"nome": 123}` fazia `.trim()` lancar TypeError FORA do try, e a
  // rota devolvia 500 antes de chegar ao rate limit ou ao CAPTCHA. Um cliente
  // podia repetir isso a vontade sem consumir o contador.
  const textos = { nome, email, telefone, mensagem };
  for (const [campo, valor] of Object.entries(textos)) {
    if (valor !== undefined && valor !== null && typeof valor !== "string") {
      return json({ error: `Campo '${campo}' deve ser texto` }, 400);
    }
  }

  // Honeypot: campo escondido preenchido = bot. Responde 200 para não ensinar.
  if (website) {
    return json({ ok: true }, 200);
  }

  if (!nome?.trim() || !email?.trim() || !mensagem?.trim()) {
    return json({ error: "Campos obrigatórios ausentes" }, 400);
  }

  if (
    nome.length > LIMITS.nome ||
    email.length > LIMITS.email ||
    (telefone && telefone.length > LIMITS.telefone) ||
    mensagem.length > LIMITS.mensagem
  ) {
    return json({ error: "Campo excede o tamanho permitido" }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "E-mail inválido" }, 400);
  }

  // Rede de segurança. Quem limita de verdade é a regra `contato-rate-limit`
  // do Vercel Firewall, na borda — isto aqui só dispara se ela falhar, e nesse
  // caso o módulo grita no log. Ver src/lib/api/rate-limit.js.
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return json({ error: "Muitas tentativas. Tente novamente mais tarde." }, 429);
  }

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return json({ error: "Falha na verificação de segurança" }, 403);
  }

  try {
    const { data, error } = await getResend().emails.send({
      from: FROM,
      to: TO,
      // camelCase — o SDK e quem converte para `reply_to` no HTTP. Passar
      // `reply_to` aqui faz o SDK DESCARTAR o campo em silencio, e quem recebe
      // o orcamento acaba respondendo ao remetente do formulario em vez de
      // responder ao interessado.
      replyTo: email,
      subject: sanitizeHeader(`Contato via site — ${nome}`),
      text: [
        `Nome:      ${nome}`,
        `E-mail:    ${email}`,
        `Telefone:  ${telefone || "Não informado"}`,
        "",
        "Mensagem:",
        mensagem,
      ].join("\n"),
    });

    // O SDK NAO lanca em erro de API: devolve `{ data, error }`. Sem esta
    // checagem, chave invalida ou remetente restrito viravam "enviado com
    // sucesso" para o visitante, e o orcamento se perdia sem deixar rastro.
    if (error) {
      console.error("[resend] envio recusado:", error);
      return json({ error: "Erro ao enviar mensagem" }, 502);
    }

    if (!data?.id) {
      console.error("[resend] resposta sem id de e-mail:", data);
      return json({ error: "Erro ao enviar mensagem" }, 502);
    }

    return json({ ok: true }, 200);
  } catch (err) {
    console.error("[resend]", err);
    return json({ error: "Erro ao enviar mensagem" }, 500);
  }
}
