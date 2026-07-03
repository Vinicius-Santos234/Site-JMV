import { Resend } from 'resend';
import { isRateLimited } from './_rate-limit.js';
import { verifyTurnstile } from './_turnstile.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const TO      = 'jpsantos@jmv.ind.br';
const FROM    = 'Formulário JMV <onboarding@resend.dev>';
// Após verificar o domínio jmv.ind.br no Resend, troque FROM por:
// 'Formulário JMV <contato@jmv.ind.br>'


const LIMITS = {
  nome:     100,
  email:    150,
  telefone: 20,
  mensagem: 1000,
};


function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress ?? 'unknown';
}


function sanitizeHeader(value) {
  return String(value).replace(/[\r\n]+/g, ' ').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  

  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
        return res.status(403).json({ error: 'Origem não permitida' });
      }
    } catch {
      return res.status(403).json({ error: 'Origem inválida' });
    }
  }

  const { nome, email, telefone, mensagem, website, turnstileToken } = req.body ?? {};

 
  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!nome?.trim() || !email?.trim() || !mensagem?.trim()) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  if (
    nome.length > LIMITS.nome ||
    email.length > LIMITS.email ||
    (telefone && telefone.length > LIMITS.telefone) ||
    mensagem.length > LIMITS.mensagem
  ) {
    return res.status(400).json({ error: 'Campo excede o tamanho permitido' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido' });
  }

  const ip = getClientIp(req);
  if (await isRateLimited(ip)) {
    return res.status(429).json({ error: 'Muitas tentativas. Tente novamente mais tarde.' });
  }

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return res.status(403).json({ error: 'Falha na verificação de segurança' });
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
        `Telefone:  ${telefone || 'Não informado'}`,
        '',
        'Mensagem:',
        mensagem,
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[resend]', err);
    return res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
}
