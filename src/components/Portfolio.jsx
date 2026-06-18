import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PROJECTS as projects } from "../data/portfolio";
import FadeInSection from "../components/FadeInSection";

const real = projects.filter((p) => p.image);

export default function Portfolio() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(null);

  function go(next) {
    setDir(next > current ? "right" : "left");
    setCurrent(next);
  }

  function prev() {
    go(current === 0 ? real.length - 1 : current - 1);
  }

  function next() {
    go(current === real.length - 1 ? 0 : current + 1);
  }

  const project = real[current];

  return (
    <FadeInSection>
      <section id="portfolio" className="section">
        <div className="container">
          <span className="section-subtitle">Projetos</span>
          <h2 className="section-title">OBRAS E PROJETOS REALIZADOS</h2>
          <p className="section-description">
            Participamos de projetos industriais de grande porte em diversos
            segmentos do mercado brasileiro.
          </p>

          <div className="slideshow">
            <button
              className="slideshow-btn slideshow-btn--prev"
              onClick={prev}
              aria-label="Projeto anterior"
            >
              <ChevronLeft size={28} />
            </button>

            <div className={`slideshow-track${dir ? ` slideshow-track--${dir}` : ""}`}>
              <div className="portfolio-card slideshow-card" key={current}>
                <img
                  src={project.image}
                  alt={`${project.title} — ${project.client}`}
                  className="portfolio-image"
                />
                <div className="portfolio-overlay slideshow-overlay">
                  <span className="portfolio-overlay-client">{project.client}</span>
                  <h3>{project.title}</h3>
                  <span className="portfolio-overlay-year">{project.year}</span>
                </div>
              </div>
            </div>

            <button
              className="slideshow-btn slideshow-btn--next"
              onClick={next}
              aria-label="Próximo projeto"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          <div className="slideshow-dots">
            {real.map((_, i) => (
              <button
                key={i}
                className={`slideshow-dot${i === current ? " slideshow-dot--active" : ""}`}
                onClick={() => go(i)}
                aria-label={`Ir para projeto ${i + 1}`}
              />
            ))}
          </div>

          <div className="portfolio-cta">
            <Link to="/portfolio" className="btn-secondary">
              Ver mais projetos
            </Link>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
