import { useQualityItems } from "../hooks/useContent";
import { iconByName } from "../lib/icons";
import FadeInSection from "../components/FadeInSection";
import "./Services.css";
import "./Quality.css";

export default function Quality() {
  const items = useQualityItems();

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
                <div key={item.id} className="quality-card service-card">
                  <div className="service-icon">
                    <Icon size={34} />
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </FadeInSection>
  );
}