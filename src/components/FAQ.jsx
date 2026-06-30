import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import FadeInSection from "./FadeInSection";
import { FAQS, FAQ_SCHEMA } from "../data/faqs";

export default function FAQ() {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(FAQ_SCHEMA);
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  return (
    <FadeInSection>
      <section className="section faq-section">

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
