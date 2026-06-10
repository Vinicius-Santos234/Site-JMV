import {
  Phone,
  Mail,
  MapPin,
  Construction,
} from "lucide-react";

import FadeInSection from "../components/FadeInSection";

export default function Contact() {
  return (
    <FadeInSection>
      <section id="contato" className="contact-section">
        <div className="container">

          <div className="contact-info">

            <span className="section-subtitle">
              Contato
            </span>

            <h2 className="section-title">
              VAMOS CONVERSAR
            </h2>

            <p>
              Solicite um orçamento ou entre em
              contato com nossa equipe.
            </p>

            <div className="contact-item">
              <Phone size={18} />
              <span>(16) 99741-8402</span>
            </div>

            <div className="contact-item">
              <Mail size={18} />
              <span>jpsantos@jmv.ind.br</span>
            </div>

            <div className="contact-item">
              <MapPin size={18} />
              <span>
                Rua São Lourenço, 2170, IV Centenário, Matão - SP
              </span>
            </div>

          </div>

          <div className="contact-form contact-form--placeholder">
            <Construction size={32} />
            <p>Formulário em construção</p>
            <span>
              Em breve você poderá solicitar orçamentos diretamente por aqui.
              Por enquanto, entre em contato pelos canais ao lado.
            </span>
          </div>

        </div>
      </section>
    </FadeInSection>
  );
}