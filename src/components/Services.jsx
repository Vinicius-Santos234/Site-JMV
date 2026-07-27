import { useServices } from "../hooks/useContent";
import { iconByName } from "../lib/icons";
import FadeInSection from "../components/FadeInSection";
import "./Services.css";

export default function Services() {
  const services = useServices();

  return (
    <FadeInSection>
      <section id="servicos" className="section services-section">
        <div className="container">

          <span className="section-subtitle">
            Serviços
          </span>

          <h2 className="section-title">
            SOLUÇÕES INDUSTRIAIS COMPLETAS
          </h2>

          <p className="section-description">
            Atuamos em todas as etapas de projetos industriais,
            oferecendo serviços especializados para garantir
            segurança, qualidade e produtividade.
          </p>

          <div className="services-grid">
            {services.map((service) => {
              const Icon = iconByName(service.icon);

              return (
                <div key={service.id} className="service-card">
                  <div className="service-icon">
                    <Icon size={34} />
                  </div>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </FadeInSection>
  );
}