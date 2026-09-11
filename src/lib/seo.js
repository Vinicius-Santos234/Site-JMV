export const BASE_URL = "https://site-jmv.vercel.app";

export const ANOS_DE_CASA = new Date().getFullYear() - 2013;

export const BASE_TITLE =
  "JMV Soluções Industriais | Montagem Industrial em Matão - SP";

export const BASE_DESC =
  `Especialistas em montagem industrial, estruturas metálicas, caldeiraria e tubulações. ` +
  `Mais de ${ANOS_DE_CASA} anos atendendo os setores sucroenergético e petroquímico. Matão - SP.`;

export const BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": `${BASE_URL}/#business`,
  name: "JMV Soluções Industriais",
  description:
    "Especialistas em montagem industrial, estruturas metálicas, caldeiraria e tubulações industriais. Atuando desde 2013 nos setores sucroenergético e petroquímico.",
  slogan: "Soluções industriais completas com rigor técnico e compromisso com prazos",
  url: BASE_URL,
  telephone: "+55-16-99741-8402",
  email: "jpsantos@jmv.ind.br",
  foundingDate: "2013",
  image: `${BASE_URL}/logo.webp`,
  logo: `${BASE_URL}/logo.webp`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua São Lourenço, 2170",
    addressLocality: "Matão",
    addressRegion: "SP",
    postalCode: "15997-000",
    addressCountry: "BR",
  },
  geo: { "@type": "GeoCoordinates", latitude: -21.6027, longitude: -48.3657 },
  areaServed: { "@type": "State", name: "São Paulo" },
};

export const BREADCRUMB_PORTFOLIO = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Portfólio", item: `${BASE_URL}/portfolio` },
  ],
};

export function buildFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/**
 * Metadata de Open Graph/Twitter para uma rota interna.
 *
 * O Next NAO mescla `openGraph`/`twitter` campo a campo: o objeto da pagina
 * SUBSTITUI o do layout inteiro. Declarar so `title` e `description` numa rota
 * apagava o `og:image` herdado — foi o que aconteceu com /portfolio e
 * /privacidade, justamente no site cuja migracao existiu para consertar cartao
 * de link. Este helper reconstroi os campos comuns em toda rota.
 */
export function socialMetadata({ url, title, description }) {
  const imagem = {
    url: "/logo.webp",
    type: "image/webp",
    alt: "Logo JMV Soluções Industriais",
  };

  return {
    openGraph: {
      type: "website",
      siteName: "JMV Soluções Industriais",
      locale: "pt_BR",
      url,
      title,
      description,
      images: [imagem],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.webp"],
    },
  };
}
