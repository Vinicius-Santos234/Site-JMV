import { CheckCircle2 } from "lucide-react";
import FadeInSection from "../components/FadeInSection";
import { DIFFERENTIALS } from "../data/cta";
import { scrollToSection } from "../utils/scrollToSection";
import "./CTA.css";

export default function CTA() {
  const handleScroll = (e) => {
    e.preventDefault();
    scrollToSection("#contato");
  };

  return (
    <FadeInSection>
      <section className="cta">
        <div className="cta-inner container">
          <div className="cta-text">
            <span className="cta-tag">Vamos trabalhar juntos</span>
            <h2>Pronto para o próximo projeto?</h2>
            <p>
              Entre em contato e descubra como a JMV Engenharia pode transformar
              sua operação industrial com segurança, precisão e qualidade.
            </p>
            <div className="cta-actions">
              <a href="#contato" className="btn-primary" onClick={handleScroll}>
                Solicitar orçamento
              </a>
              <a
                href="https://wa.me/5516997418402?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento."
                target="_blank"
                rel="noreferrer"
                className="btn-secondary cta-whatsapp"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <ul className="cta-list">
            {DIFFERENTIALS.map((item) => (
              <li key={item}>
                <CheckCircle2 size={22} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </FadeInSection>
  );
}
