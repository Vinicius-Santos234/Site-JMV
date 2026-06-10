import { Link } from "react-router-dom";
import { PROJECTS as projects } from "../data/portfolio";
import FadeInSection from "../components/FadeInSection";

export default function Portfolio() {
  return (
    <FadeInSection>
      <section id="portfolio" className="section">
        <div className="container">
          <span className="section-subtitle">Projetos</span>

          <h2 className="section-title">
            OBRAS E PROJETOS REALIZADOS
          </h2>

          <p className="section-description">
            Participamos de projetos industriais de grande porte em
            diversos segmentos do mercado brasileiro.
          </p>

          <div className="portfolio-grid">
            {projects.map((project, index) => (
              <div className="portfolio-card" key={project.id ?? index}>
                <img
                  src={project.image}
                  alt={`${project.title} — ${project.client}`}
                  className="portfolio-image"
                  loading="lazy"
                />
                <div className="portfolio-overlay">
                  <span className="portfolio-overlay-client">
                    {project.client}
                  </span>
                  <h3>{project.title}</h3>
                  <span className="portfolio-overlay-year">{project.year}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="portfolio-cta">
            <Link to="/portfolio" className="btn-secondary">
              Ver todos os projetos
            </Link>
          </div>

        </div>
      </section>
    </FadeInSection>
  );
}