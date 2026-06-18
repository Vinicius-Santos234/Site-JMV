// Vercel Edge Middleware — roda antes de qualquer requisição chegar nos assets.
// Bloqueia ferramentas ofensivas, scanners e UAs vazios.

export const config = {
  matcher: ['/((?!_vercel|favicon\\.ico|robots\\.txt).*)'],
};

const BLOCKED_UA_PATTERNS = [
  // Ferramentas de ataque / injeção
  'sqlmap',
  'havij',
  'pangolin',
  // Scanners de vulnerabilidade
  'nikto',
  'acunetix',
  'nessus',
  'openvas',
  'w3af',
  'appscan',
  'burpsuite',
  'vega/',
  // Scanners de rede / força bruta
  'masscan',
  'zgrab',
  'nmap',
  'zmap',
  // Brute force de diretórios
  'dirbuster',
  'gobuster',
  'ffuf',
  'wfuzz',
  // Brute force de credenciais
  'hydra',
  'medusa',
  'thc-hydra',
];

export default function middleware(request) {
  const ua = (request.headers.get('user-agent') ?? '').toLowerCase().trim();

  // Bloqueia UA vazio — nenhum browser legítimo omite o User-Agent
  if (!ua) {
    return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
  }

  // Bloqueia UAs de ferramentas ofensivas conhecidas
  if (BLOCKED_UA_PATTERNS.some((pattern) => ua.includes(pattern))) {
    return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
  }

  // Deixa a requisição prosseguir normalmente
  return undefined;
}
