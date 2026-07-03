const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Verifica o token do Cloudflare Turnstile no servidor. Sem TURNSTILE_SECRET_KEY
// a verificacao e pulada (retorna true) e o formulario segue funcional.
export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // CAPTCHA desativado
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
