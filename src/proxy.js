// Peneira de user-agent na fronteira de rede. No Next 16 o `middleware` virou
// `proxy` e passou a rodar no runtime Node por padrão (não mais Edge) — aqui
// não muda nada, porque a checagem é só string de header.
export const config = {
  // _next/* entrou no negativo: no App Router os assets do build passam por
  // aqui, e não faz sentido rodar a peneira de user-agent em cada chunk.
  matcher: ['/((?!_next|_vercel|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)'],
};

const BLOCKED_UA_PATTERNS = [
  'sqlmap',
  'havij',
  'pangolin',
  'nikto',
  'acunetix',
  'nessus',
  'openvas',
  'w3af',
  'appscan',
  'burpsuite',
  'vega/',
  'masscan',
  'zgrab',
  'nmap',
  'zmap',
  'dirbuster',
  'gobuster',
  'ffuf',
  'wfuzz',
  'hydra',
  'medusa',
  'thc-hydra',
];

export default function proxy(request) {
  const ua = (request.headers.get('user-agent') ?? '').toLowerCase().trim();

  if (!ua) {
    return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
  }

  if (BLOCKED_UA_PATTERNS.some((pattern) => ua.includes(pattern))) {
    return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
  }

  return undefined;
}
