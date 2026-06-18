import FadeInSection from "../components/FadeInSection";
import { DIFFERENTIALS } from "../data/about";

export default function About() {
  return (
    <FadeInSection>
      <section id="sobre" className="section about-section">
        <div className="container">

          <span className="section-subtitle">Sobre Nós</span>

          <h2 className="section-title">QUEM SOMOS</h2>

          <div className="about-layout">
            <div className="about-text">
              <p className="section-description">
                A JMV Engenharia atua em construção e montagem industrial,
                fornecendo soluções completas para implantação, modernização
                e manutenção de plantas industriais.
              </p>
              <p className="section-description">
                Nossa experiência abrange estruturas metálicas, caldeiraria,
                tubulações industriais, tanques, manutenção industrial e obras
                civis especializadas — sempre com rigor técnico e compromisso
                com prazos.
              </p>
            </div>

            <div className="about-differentials">
              {DIFFERENTIALS.map(({ id, icon: Icon, title, text }) => (
                <div key={id} className="about-differential-item">
                  <div className="about-differential-icon">
                    <Icon size={20} />
                  </div>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </FadeInSection>
  );
}