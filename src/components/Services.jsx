import { iconByName } from "../lib/icons";
import FadeInSection from "./FadeInSection";
import SpotlightCard from "./SpotlightCard";
import "./Services.css";

export default function Services({ services = [] }) {

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
            {services.map((service, index) => {
              const Icon = iconByName(service.icon);
              const norms = service.norms ?? [];

              return (
                <SpotlightCard key={service.id} className="service-card">
                  {/* Numeração decorativa: é ritmo de leitura, não conteúdo.
                      Fica fora da ordem do leitor de tela — quem navega por
                      cabeçalhos não ganha nada ouvindo "zero um barra barra"
                      antes de cada serviço. */}
                  <span className="service-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                    <i>//</i>
                  </span>

                  <div className="service-icon">
                    <Icon size={34} />
                  </div>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  {norms.length > 0 && (
                    <ul className="service-norms">
                      {/* Chave pela posição, e não pelo texto: nada garante
                          que as normas de um serviço sejam distintas — o
                          Studio agora valida `unique()`, mas isso não alcança
                          documento já gravado, e duas chaves `NR-35` iguais
                          fariam o React descartar um dos chips em silêncio.
                          A lista é estática por render e nunca reordena, então
                          o índice é chave estável aqui. */}
                      {norms.map((norm, i) => (
                        <li key={`${service.id}-${i}`} className="norm-chip">{norm}</li>
                      ))}
                    </ul>
                  )}
                </SpotlightCard>
              );
            })}
          </div>

        </div>
      </section>
    </FadeInSection>
  );
}
