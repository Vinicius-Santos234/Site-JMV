"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FadeInSection from "./FadeInSection";
import "./Portfolio.css";

// Teto de slides na home. A /portfolio continua mostrando todos: aqui o limite
// existe porque os slides ficam montados para não piscar na troca, e sem teto o
// custo de imagem cresceria junto com o portfólio, que vai crescer.
const MAX_SLIDES = 6;

/** Índices que ficam montados: o slide atual e um vizinho de cada lado. */
function janela(indice, total) {
  if (total === 0) return [];
  return [indice, (indice + 1) % total, (indice - 1 + total) % total];
}

export default function Portfolio({ projects = [] }) {
  // Lidera com o que foi cadastrado por último, para a home mudar sozinha a
  // cada projeto novo no Studio, sem ninguém reordenar nada.
  //
  // `createdAt` só existe no conteúdo do CMS — o fallback de src/data não tem
  // data de inserção. Sem ela, a ordem recebida já é a escolhida no Studio
  // (`order asc`), e cortar os primeiros é o comportamento certo.
  const slides = useMemo(() => {
    const reais = projects.filter((p) => !p.placeholder);
    const temData = reais.some((p) => p.createdAt);
    const ordenados = temData
      ? [...reais].sort((a, b) =>
          String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""))
        )
      : reais;
    return ordenados.slice(0, MAX_SLIDES);
  }, [projects]);

  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(null);

  // Montados ACUMULAM e nunca saem. É o que mantém a troca sem piscada depois
  // da primeira visita: o vizinho já está decodificado quando chega a vez, e
  // voltar a um slide visitado não recarrega nada. O salto por um pontinho
  // distante ainda carrega na hora — mas aí é a primeira exibição da imagem,
  // não a recarga de uma que já estava na tela, que era o defeito de origem.
  const [montados, setMontados] = useState(() => new Set(janela(0, slides.length)));

  // `current` entra na dependência junto com `dir`, e não é redundância:
  // duas trocas seguidas na MESMA direção gravam o mesmo valor em `dir`, o
  // React descarta a atualização idêntica e o efeito não re-rodava. O timer da
  // primeira troca seguia correndo e limpava `dir` no meio da animação da
  // segunda, que saltava para o repouso. Como `current` muda em toda troca
  // (o `go` sai cedo quando o índice é o mesmo), ele é o que garante o
  // reinício do relógio a cada slide.
  useEffect(() => {
    if (!dir) return;
    const id = setTimeout(() => setDir(null), 400);
    return () => clearTimeout(id);
  }, [dir, current]);

  // A direção vem de quem chamou, e não de comparar os índices: na volta da
  // última para a primeira o índice DIMINUI, embora o movimento seja de
  // avanço. Deduzir pelo número invertia a animação exatamente nas duas
  // passagens de volta do ciclo.
  function go(proximo, direcao) {
    if (proximo === current) return;
    setDir(direcao ?? (proximo > current ? "right" : "left"));
    setCurrent(proximo);
    setMontados((antes) => {
      const novo = new Set(antes);
      janela(proximo, slides.length).forEach((i) => novo.add(i));
      return novo;
    });
  }

  function prev() {
    go(current === 0 ? slides.length - 1 : current - 1, "left");
  }

  function next() {
    go(current === slides.length - 1 ? 0 : current + 1, "right");
  }

  const project = slides[current];

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

            {/* Os slides montados ficam empilhados na mesma célula de grade —
                ver .slideshow-track no CSS.

                Antes havia UM card com `key={current}`, e a chave trocando a
                cada avanço fazia o React destruir e recriar o <img>. O
                elemento novo nascia vazio (`complete: false`,
                `naturalWidth: 0` medidos logo apos o clique), então o card
                ficava sem imagem nenhuma por um instante e a troca piscava —
                mesmo com o arquivo já em cache, porque o que se perde na
                recriação é a decodificação, não o download.

                Mantendo vivos os elementos já montados, cada imagem é
                decodificada uma vez só e a troca para um vizinho é
                instantânea. Quem decide quais existem é `montados`, logo
                acima: janela de vizinhos que só cresce. */}
            <div className="slideshow-track">
              {slides.map((p, i) => {
                if (!montados.has(i)) return null;
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
            {slides.map((_, i) => (
              <button
                key={i}
                className={`slideshow-dot${i === current ? " slideshow-dot--active" : ""}`}
                onClick={() => go(i)}
                aria-label={`Ir para projeto ${i + 1}`}
              />
            ))}
          </div>

          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            Projeto {current + 1} de {slides.length}: {project.title} — {project.client}
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
