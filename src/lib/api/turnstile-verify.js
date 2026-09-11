const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Sem o segredo o CAPTCHA se desligava — em QUALQUER ambiente. Isso transforma
  // um erro de configuracao em desativacao silenciosa de uma defesa: exatamente
  // o modo de falha que derrubou o rate limiting por semanas neste projeto.
  // Em producao, ausencia de segredo passa a ser erro, nao modo degradado.
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[turnstile] TURNSTILE_SECRET_KEY ausente em producao — recusando o " +
        "envio. Configure a variavel ou remova a verificacao conscientemente."
      );
      return false;
    }
    return true; // dev/teste: segue sem CAPTCHA, de proposito
  }

  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.append('remoteip', ip);

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('[turnstile] falha ao verificar:', err);
    return false;
  }
}
