import { getContent } from "@/lib/content";
import { BREADCRUMB_PORTFOLIO, ANOS_DE_CASA, socialMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

import Navbar          from "@/components/Navbar";
import Footer          from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ErrorBoundary   from "@/components/ErrorBoundary";
import PortfolioGrid   from "@/components/PortfolioGrid";
import BackLink        from "@/components/BackLink";

import "@/styles/page-header.css";
import "@/components/Portfolio.css";
import "./PortfolioPage.css";

// Isto é o achado de 11/09 consertado: título, descrição e canonical próprios,
// no HTML servido. Antes as três rotas devolviam o mesmo arquivo.
export const metadata = {
  title: "Portfólio de Projetos | JMV Soluções Industriais",
  description:
    "Conheça os projetos industriais realizados pela JMV Soluções Industriais: montagem, caldeiraria, estruturas metálicas e mais. Clientes como Raízen, Bunge, Petrobras e Cutrale.",
  alternates: { canonical: "/portfolio" },
  ...socialMetadata({
    url: "/portfolio",
    title: "Portfólio de Projetos | JMV Soluções Industriais",
    description:
      "Projetos industriais realizados pela JMV Soluções Industriais: montagem, caldeiraria, estruturas metálicas e tubulações.",
  }),
};

export const revalidate = 3600;

export default async function PortfolioPage() {
  const { projects, cnpj } = await getContent();

  return (
    <ErrorBoundary>
      <JsonLd schema={BREADCRUMB_PORTFOLIO} />
      <Navbar />

      <header className="portfolio-page-header">
        <div className="container">
          <BackLink />

          <span className="section-subtitle">Portfólio</span>
          <h1 className="section-title">PROJETOS</h1>
          <p className="section-description">
            Conheça os projetos industriais realizados pela JMV Soluções Industriais
            ao longo de mais de {ANOS_DE_CASA} anos de atuação no mercado.
          </p>
        </div>
      </header>

      <PortfolioGrid projects={projects} />

      <Footer cnpj={cnpj} />
      <FloatingButtons />
    </ErrorBoundary>
  );
}
