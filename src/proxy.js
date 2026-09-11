// Peneira de user-agent na fronteira de rede. No Next 16 o `middleware` virou
// `proxy` e passou a rodar no runtime Node por padrão (não mais Edge) — aqui
// não muda nada, porque a checagem é só string de header.
export const config = {
  // So rotas navegaveis passam por aqui. Ficam de fora:
  //
  //   _next/*, _vercel/*  - assets do build; nao faz sentido peneirar cada chunk.
  //   qualquer caminho com extensao (.webp, .ico, .txt, .xml, .woff2...)
  //
  // A segunda exclusao conserta um bug real: o otimizador de imagem do Next
  // busca o arquivo de origem (`/welder.webp`) numa requisicao interna **sem
  // user-agent**, e a regra de "sem UA = bloqueia" respondia 403. O otimizador
  // recebia text/plain em vez de imagem e devolvia 400 - a imagem do heroi nao
  // aparecia em `next start`. Nao acontecia no Vite porque nao havia otimizador
  // no meio, e nao aparece na Vercel porque la a otimizacao roda na borda, fora
  // desta cadeia. Ou seja: quebrava so no local.
  //
  // Peneirar asset estatico nunca foi o objetivo - o alvo sao scanners batendo
  // em paginas e endpoints, e esses seguem cobertos (inclusive /api/*).
  matcher: ['/((?!_next|_vercel|.*\\.[a-zA-Z0-9]+$).*)'],
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
