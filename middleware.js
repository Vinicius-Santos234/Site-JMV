export const config = {
  matcher: ['/((?!_vercel|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)'],
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

export default function middleware(request) {
  const ua = (request.headers.get('user-agent') ?? '').toLowerCase().trim();

  if (!ua) {
    return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
  }

  if (BLOCKED_UA_PATTERNS.some((pattern) => ua.includes(pattern))) {
    return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
  }

  return undefined;
}
