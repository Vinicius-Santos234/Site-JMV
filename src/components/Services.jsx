import { SERVICES } from "../data/services";
import FadeInSection from "../components/FadeInSection";

export default function Services() {
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
            {SERVICES.map((service) => {
              const Icon = service.icon;

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