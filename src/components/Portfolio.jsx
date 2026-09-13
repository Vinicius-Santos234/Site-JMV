"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FadeInSection from "./FadeInSection";
import "./Portfolio.css";

export default function Portfolio({ projects = [] }) {
  const real = projects.filter((p) => !p.placeholder);

  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(null);

  useEffect(() => {
    if (!dir) return;
    const id = setTimeout(() => setDir(null), 400);
    return () => clearTimeout(id);
  }, [dir]);

  // A direção vem de quem chamou, e não de comparar os índices: na volta da
  // última para a primeira o índice DIMINUI, embora o movimento seja de
  // avanço. Deduzir pelo número invertia a animação exatamente nas duas
  // passagens de volta do ciclo.
  function go(proximo, direcao) {
    if (proximo === current) return;
    setDir(direcao ?? (proximo > current ? "right" : "left"));
    setCurrent(proximo);
  }

  function prev() {
    go(current === 0 ? real.length - 1 : current - 1, "left");
  }

  function next() {
    go(current === real.length - 1 ? 0 : current + 1, "right");
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

          {!project ? (
            <p className="section-description" role="status" aria-live="polite">
              Carregando projetos…
            </p>
          ) : (
          <>
          <div className="slideshow">
            <button
              className="slideshow-btn slideshow-btn--prev"
              onClick={prev}
              aria-label="Projeto anterior"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Todos os slides ficam montados, empilhados na mesma célula de
                grade — ver .slideshow-track no CSS.

                Antes havia UM card com `key={current}`, e a chave trocando a
                cada avanço fazia o React destruir e recriar o <img>. O
                elemento novo nascia vazio (`complete: false`,
                `naturalWidth: 0` medidos logo apos o clique), então o card
                ficava sem imagem nenhuma por um instante e a troca piscava —
                mesmo com o arquivo já em cache, porque o que se perde na
                recriação é a decodificação, não o download.

                Mantendo os elementos vivos, cada imagem é decodificada uma vez
                só e toda troca posterior é instantânea, inclusive o salto
                pelos pontinhos. */}
            <div className="slideshow-track">
              {real.map((p, i) => {
                const ativo = i === current;
                return (
                  <div
                    key={p.id}
                    className={
                      "portfolio-card slideshow-card" +
                      (ativo ? " slideshow-card--ativo" : "") +
                      (ativo && dir ? ` slideshow-card--entra-${dir}` : "")
                    }
                    aria-hidden={ativo ? undefined : true}
                  >
                    <Image
                      src={p.image}
                      alt={`${p.title} — ${p.client}`}
                      className="portfolio-image"
                      width={1200}
                      height={800}
                      // Os slides de bastidor baixam junto, mas em prioridade
                      // baixa: adiantar a próxima troca não pode custar atraso
                      // na imagem que a pessoa está olhando agora.
                      fetchPriority={ativo ? "auto" : "low"}
                    />
                    <div className="portfolio-overlay slideshow-overlay">
                      <span className="portfolio-overlay-client">{p.client}</span>
                      <h3>{p.title}</h3>
                      <span className="portfolio-overlay-year">{p.year}</span>
                    </div>
                  </div>
                );
              })}
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

          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            Projeto {current + 1} de {real.length}: {project.title} — {project.client}
          </div>
          </>
          )}

          <div className="portfolio-cta">
            <Link href="/portfolio" className="btn-secondary">
              Ver mais projetos
            </Link>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
