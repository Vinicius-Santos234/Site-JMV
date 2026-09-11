import { Resend } from "resend";
import { isRateLimited } from "@/lib/api/rate-limit";
import { verifyTurnstile } from "@/lib/api/turnstile-verify";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const ip = getClientIp(request);
  if (await isRateLimited(ip)) {
    return json({ error: "Muitas tentativas. Tente novamente mais tarde." }, 429);
  }

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return json({ error: "Falha na verificação de segurança" }, 403);
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      reply_to: email,
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

    return json({ ok: true }, 200);
  } catch (err) {
    console.error("[resend]", err);
    return json({ error: "Erro ao enviar mensagem" }, 500);
  }
}
