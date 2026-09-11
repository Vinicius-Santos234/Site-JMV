/** @type {import('next').NextConfig} */

// CSP herdado do vercel.json. Regra da casa: toda integração de terceiro nova
// tem que entrar aqui junto — senão funciona local e quebra só em produção.
//
// ⚠️ REGRESSÃO CONSCIENTE: `'unsafe-inline'` em script-src NÃO existia no Vite.
// O App Router injeta o payload RSC em <script> inline (self.__next_f.push).
// Sem 'unsafe-inline', nonce ou hash, a página não hidrata. As alternativas:
//   - nonce por requisição (via middleware): força renderização DINÂMICA em
//     toda página, que é exatamente o que esta migração veio evitar;
//   - hash: o conteúdo do script inline muda a cada build, inviável.
// Aceito aqui porque o site é institucional — sem login, sem sessão, sem
// conteúdo de terceiros renderizado. Se um dia houver área logada, trocar
// por nonce e pagar o custo do dinâmico.
//
// `'unsafe-eval'` e o websocket entram SÓ em desenvolvimento. O React em modo
// dev usa eval() para remontar stack traces, e o Turbopack fala por WebSocket
// para o hot reload — sem isso o console enche de "eval() is not supported in
// this environment". Em produção nenhum dos dois aparece: como diz a própria
// mensagem do React, "React will never use eval() in production mode".
const DEV = process.env.NODE_ENV === "development";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${DEV ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://va.vercel-scripts.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob: https:",
  `connect-src 'self'${DEV ? " ws: http://localhost:*" : ""} https://vitals.vercel-insights.com https://www.google-analytics.com https://*.sanity.io https://challenges.cloudflare.com`,
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ") + ";";

const SECURITY_HEADERS = [
  { key: "X-Frame-Options",          value: "DENY" },
  { key: "X-Content-Type-Options",   value: "nosniff" },
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Content-Security-Policy",  value: CSP },
];

const nextConfig = {
  // A pasta acima (Desktop/JMV) tem um package.json solto e fica fora do repo;
  // sem isto o Turbopack sobe demais procurando a raiz e avisa a cada build.
  turbopack: {
    root: import.meta.dirname,
  },

  images: {
    // Logos de cliente e fotos de portfólio vêm da CDN do Sanity
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "**.apicdn.sanity.io" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      { source: "/(.*)", headers: SECURITY_HEADERS },
      {
        source: "/fonts/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
