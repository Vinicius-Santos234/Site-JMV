import { iconByName } from "../lib/icons";
import FadeInSection from "./FadeInSection";
import SpotlightCard from "./SpotlightCard";
import "./Services.css";
import "./Quality.css";

export default function Quality({ items = [] }) {

  return (
    <FadeInSection>
      <section className="section quality-section">
        <div className="container">

          <span className="section-subtitle">
            Excelência
          </span>

          <h2 className="section-title">
            COMPROMISSO COM QUALIDADE
          </h2>

          <div className="quality-grid">
            {items.map((item) => {
              const Icon = iconByName(item.icon);

              return (
                <SpotlightCard key={item.id} className="quality-card service-card">
                  {/* Cantoneiras de mira. Decoração pura — fora da árvore de
                      acessibilidade. Aqui não cabe a numeração `01 //` dos
                      Serviços: aquilo comunica sequência, e Segurança,
                      Qualidade e Sustentabilidade são pilares paralelos, não
                      etapas de um processo. */}
                  <span className="card-crosshairs card-crosshairs--top" aria-hidden="true" />
                  <span className="card-crosshairs card-crosshairs--bottom" aria-hidden="true" />

                  <div className="service-icon">
                    <Icon size={34} />
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </SpotlightCard>
              );
            })}
          </div>

        </div>
      </section>
    </FadeInSection>
  );
}