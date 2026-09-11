"use client";

import { m } from "framer-motion";
import Image from "next/image";
import FadeInSection from "./FadeInSection";
import "./Hero.css";

export default function Hero() {
  return (
    <FadeInSection>
      <section id="hero" className="hero">
        <div className="container hero-layout">
          <div className="hero-content">
            <span className="hero-tag">
              Engenharia • Fabricação • Soluções Industriais • Caldeiraria
            </span>

            <m.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              SOLUÇÕES INDUSTRIAIS
            </m.h1>

            <p>
              Mais de uma década entregando projetos industriais de grande porte
              para os principais grupos do setor sucroenergético e petroquímico.
            </p>

            <div className="hero-buttons">
              <a
                href="#contato"
                className="btn-primary"
                aria-label="Ir para seção de contato e solicitar orçamento"
              >
                Solicitar orçamento
              </a>
              <a
                href="#portfolio"
                className="btn-secondary"
                aria-label="Ir para seção de projetos realizados"
              >
                Ver projetos
              </a>
            </div>
          </div>
        </div>

        <div className="hero-image-side">
          {/* Imagem do LCP. `priority` emite o preload que antes estava escrito
              à mão no index.html — vem da rodada de performance de 07/07. */}
          <Image
            src="/welder.webp"
            alt="Soldador trabalhando em obra industrial"
            className="welder-img"
            width={900}
            height={756}
            priority
          />

          <div className="weld-glow"></div>
          <div className="spark spark-1"></div>
          <div className="spark spark-2"></div>
          <div className="spark spark-3"></div>
          <div className="spark spark-4"></div>
        </div>

      </section>
    </FadeInSection>
  );
}