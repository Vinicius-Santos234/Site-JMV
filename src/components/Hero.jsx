import Image from "next/image";
import "./Hero.css";

/**
 * O Hero nao entra em FadeInSection, de proposito.
 *
 * O `whileInView` do Framer Motion comeca em `opacity: 0` e so revela depois de
 * hidratar. Para conteudo abaixo da dobra isso sai de graca; aqui custava caro:
 * a imagem do soldador e o elemento do LCP, e a decomposicao em producao dava
 * 72ms de TTFB + 66ms de espera + 130ms de download — e 2774ms de "element
 * render delay". A imagem chegava em ~270ms e ficava invisivel ~2,8s esperando
 * o JS. Envolver o que ja esta na tela numa animacao de entrada por rolagem
 * anula o ganho de servir HTML pronto.
 */
export default function Hero() {
  return (
    <>
      <section id="hero" className="hero">
        <div className="container hero-layout">
          <div className="hero-content">
            <span className="hero-tag">
              Engenharia • Fabricação • Soluções Industriais • Caldeiraria
            </span>

            {/* A animação de entrada vem do `slideHero` em Hero.css, e não do
                Framer Motion: os dois faziam exatamente a mesma coisa neste
                mesmo elemento (opacity 0→1, y 40→0, 1s) e brigavam pelo
                `transform`. Em CSS ela começa na primeira pintura, sem esperar
                a hidratação — e sem ela o Hero deixa de precisar de JS. */}
            <h1>SOLUÇÕES INDUSTRIAIS</h1>

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
    </>
  );
}