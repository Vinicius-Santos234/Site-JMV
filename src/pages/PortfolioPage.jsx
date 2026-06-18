import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { ALL_PROJECTS } from "../data/portfolio-full";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingButtons from "../components/FloatingButtons";

function ProjectCard({ project }) {
  if (project.placeholder) {
    return (
      <div className="portfolio-card portfolio-card--placeholder">
        <div className="portfolio-placeholder-inner">
          <Clock size={32} />
          <span>Em breve</span>
        </div>
        <div className="portfolio-overlay portfolio-overlay--placeholder">
          <span className="portfolio-overlay-client">{project.category}</span>
          <h3>{project.title}</h3>
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
            ao longo de mais de 13 anos de atuação no mercado.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="portfolio-grid">
            {ALL_PROJECTS.map((project) => (
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