import { BASE_URL, BASE_TITLE, BASE_DESC, BUSINESS_SCHEMA } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Providers from "@/components/Providers";
import ConditionalAnalytics from "@/components/ConditionalAnalytics";
import CookieBanner from "@/components/CookieBanner";
import "@/styles/base.css";

// A razão inteira da migração: isto sai no HTML, servido, antes de qualquer JS.
// `metadataBase` faz og:image/canonical relativos virarem absolutos.
export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: BASE_TITLE,
  description: BASE_DESC,
  authors: [{ name: "JMV Soluções Industriais" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/favicon-192.png", sizes: "192x192" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "JMV Soluções Industriais",
    locale: "pt_BR",
    title: "JMV Soluções Industriais | Engenharia e Fabricação",
    description:
      "Soluções industriais completas: montagem, caldeiraria, estruturas metálicas e manutenção. Fundada em 2013. Matão - SP.",
    images: [
      {
        url: "/logo.webp",
        type: "image/webp",
        alt: "Logo JMV Soluções Industriais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JMV Soluções Industriais | Engenharia e Fabricação",
    description:
      "Soluções industriais completas: montagem, caldeiraria, estruturas metálicas e manutenção. Fundada em 2013. Matão - SP.",
    images: ["/logo.webp"],
  },
  verification: {
    google: "JTCDVdSknx9keORdAW1VetTTWYtve9gOFpqzgico3aY",
  },
  other: {
    "geo.region": "BR-SP",
    "geo.placename": "Matão, São Paulo, Brasil",
    "geo.position": "-21.6027;-48.3657",
    ICBM: "-21.6027, -48.3657",
  },
};

export const viewport = {
  themeColor: "#0c1c30",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Fontes self-hosted: preload das críticas acima da dobra.
            Vieram da rodada de performance de 07/07 — não reintroduzir Google Fonts. */}
        <link rel="preload" as="font" type="font/woff2" href="/fonts/barlow-400.woff2" crossOrigin="" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/bebas-neue-400.woff2" crossOrigin="" />
        <JsonLd schema={BUSINESS_SCHEMA} />
      </head>
      <body>
        <noscript>
          Este site precisa de JavaScript para funcionar plenamente. Entre em
          contato pelo telefone (16) 99741-8402 ou pelo e-mail jpsantos@jmv.ind.br.
        </noscript>
        <Providers>{children}</Providers>
        <CookieBanner />
        <ConditionalAnalytics />
      </body>
    </html>
  );
}
