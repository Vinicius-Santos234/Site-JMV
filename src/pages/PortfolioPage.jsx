import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingButtons from "../components/FloatingButtons";
import { useSEO, BASE_URL } from "../hooks/useSEO";
import "../components/Portfolio.css";
import "./PortfolioPage.css";

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Portfólio", item: `${BASE_URL}/portfolio` },
  ],
};

function ProjectCard({ project }) {
  if (project.placeholder) {
    return (
      <div className="portfolio-card portfolio-card--placeholder">
        <div className="portfolio-placeholder-inner">
          <Clock size={32} />
          <span>{project.category}</span>
          <small>Em breve</small>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-card">
      <img
        src={project.image}
        alt={`${project.title} — ${project.client}`}
        className="portfolio-image"
        loading="lazy"
      />
      <div className="portfolio-overlay">
        <span className="portfolio-overlay-client">{project.client}</span>
        <h3>{project.title}</h3>
        <span className="portfolio-overlay-year">{project.year}</span>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  useSEO({
    title: "Portfólio de Projetos | JMV Engenharia e Construções",
    description:
      "Conheça os projetos industriais realizados pela JMV Engenharia: montagem, caldeiraria, estruturas metálicas e mais. Clientes como Raízen, Bunge, Petrobras e Cutrale.",
    canonical: `${BASE_URL}/portfolio`,
    schema: BREADCRUMB_SCHEMA,
  });

  const { projects } = useProjects();
  const [active, setActive] = useState("Todos");

  const CATEGORIES = [
    "Todos",
    ...new Set(projects.filter((p) => !p.placeholder).map((p) => p.category)),
  ];

  const visible =
    active === "Todos"
      ? projects.filter((p) => !p.placeholder)
      : projects.filter((p) => !p.placeholder && p.category === active);

  return (
    <>
      <Navbar />

      <header className="portfolio-page-header">
        <div className="container">
          <Link to="/" className="portfolio-back-link">
            <ArrowLeft size={18} />
            Voltar ao site
          </Link>

          <span className="section-subtitle">Portfólio</span>
          <h1 className="section-title">PROJETOS</h1>
          <p className="section-description">
            Conheça os projetos industriais realizados pela JMV Engenharia
            ao longo de mais de {new Date().getFullYear() - 2013} anos de atuação no mercado.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">

          <div className="portfolio-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`portfolio-filter-btn${active === cat ? " portfolio-filter-btn--active" : ""}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="portfolio-grid">
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </>
  );
}
