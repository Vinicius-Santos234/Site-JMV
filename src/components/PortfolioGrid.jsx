"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";

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
      <Image
        src={project.image}
        alt={`${project.title} — ${project.client}`}
        className="portfolio-image"
        width={1200}
        height={800}
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

/**
 * Grade filtrável do /portfolio. É client por causa do filtro; os projetos
 * chegam prontos do servidor, já com as URLs de imagem do Sanity resolvidas.
 */
export default function PortfolioGrid({ projects = [] }) {
  const [active, setActive] = useState("Todos");

  const reais = projects.filter((p) => !p.placeholder);
  const CATEGORIES = ["Todos", ...new Set(reais.map((p) => p.category))];

  const visible =
    active === "Todos" ? reais : reais.filter((p) => p.category === active);

  return (
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
  );
}
