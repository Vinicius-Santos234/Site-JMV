import { CLIENTS } from "../data/clients";
import FadeInSection from "../components/FadeInSection";

export default function Clients() {
  return (
    <FadeInSection>
      <section
        id="clientes"
        className="section"
        style={{ background: "#f4f7fb" }}
      >
        <div className="container">

          <span className="section-subtitle">
            Clientes
          </span>

          <h2 className="section-title">
            EMPRESAS QUE CONFIAM EM NÓS
          </h2>

          <div className="clients-grid">
            {CLIENTS.map((client) => (
              <div
                key={client.id}
                className="client-card"
              >
                <img
                  src={client.logo}
                  alt={`Logo ${client.name}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

        </div>
      </section>
    </FadeInSection>
  );
}