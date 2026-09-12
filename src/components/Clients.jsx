import FadeInSection from "./FadeInSection";
import ClientsMarquee from "./ClientsMarquee";
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

        </div>

        {/* A esteira sai do `.container` de propósito: precisa sangrar até as
            bordas da viewport para a rolagem não parecer começar e terminar
            dentro de uma caixa. É client component porque o controle de pausa
            precisa de estado — ver ClientsMarquee.jsx. */}
        <ClientsMarquee clients={clients} />

      </section>
    </FadeInSection>
  );
}
