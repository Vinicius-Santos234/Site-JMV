import Image from "next/image";
import FadeInSection from "./FadeInSection";
import "./Clients.css";

export default function Clients({ clients = [] }) {

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
            {clients.map((client) => (
              <div
                key={client.id}
                className="client-card"
              >
                <Image
                  src={client.logo}
                  alt={`Logo ${client.name}`}
                  width={400}
                  height={200}
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