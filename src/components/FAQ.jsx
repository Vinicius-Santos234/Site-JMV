import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeInSection from "./FadeInSection";

const FAQS = [
  {
    q: "Quais serviços a JMV Engenharia oferece?",
    a: "Oferecemos montagem industrial, caldeiraria, estruturas metálicas, tubulações industriais, manutenção industrial e serviços de SSMA (Saúde, Segurança e Meio Ambiente).",
  },
  {
    q: "Em quais regiões a JMV Engenharia atua?",
    a: "Atendemos clientes em todo o território nacional, com sede em Matão - SP, no coração do polo sucroenergético paulista.",
  },
  {
    q: "Há quanto tempo a JMV está no mercado?",
    a: `A JMV Engenharia e Construções foi fundada em 2013 e acumula mais de ${new Date().getFullYear() - 2013} anos de experiência na execução de projetos industriais de grande porte.`,
  },
  {
    q: "Quais setores industriais a JMV atende?",
    a: "Atuamos principalmente nos setores sucroenergético (usinas de açúcar e etanol) e petroquímico, além de outros segmentos da indústria de processo que demandam montagem industrial de precisão.",
  },
  {
    q: "Como solicitar um orçamento da JMV Engenharia?",
    a: "Entre em contato pelo telefone (16) 99741-8402, pelo e-mail jpsantos@jmv.ind.br ou pelo formulário neste site. Nossa equipe responde em até 24 horas úteis.",
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <FadeInSection>
      <section className="section faq-section">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
        />

        <div className="container">
          <span className="section-subtitle">Dúvidas Frequentes</span>
          <h2 className="section-title">PERGUNTAS FREQUENTES</h2>

          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`faq-item${open === i ? " faq-item--open" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={20} className="faq-chevron" />
                </button>
                <div className="faq-answer" aria-hidden={open !== i}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
