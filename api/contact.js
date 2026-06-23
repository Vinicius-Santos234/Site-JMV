import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const TO      = 'viniciusgsantos234@gmail.com';
const FROM    = 'Formulário JMV <onboarding@resend.dev>';
// Após verificar o domínio jmv.ind.br no Resend, troque FROM por:
// 'Formulário JMV <contato@jmv.ind.br>'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, email, telefone, mensagem } = req.body ?? {};

  if (!nome?.trim() || !email?.trim() || !mensagem?.trim()) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido' });
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      reply_to: email,
      subject: `Contato via site — ${nome}`,
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
