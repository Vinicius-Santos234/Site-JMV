"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeInSection from "./FadeInSection";
import "./FAQ.css";

// O JSON-LD do FAQPage saiu daqui: era injetado por JS depois do render, e
// agora sai no HTML, montado na página a partir da mesma lista exibida.
export default function FAQ({ faqs = [] }) {
  const [open, setOpen] = useState(null);

  return (
    <FadeInSection>
      <section className="section faq-section">

        <div className="container">
          <span className="section-subtitle">Dúvidas Frequentes</span>
          <h2 className="section-title">PERGUNTAS FREQUENTES</h2>

          <div className="faq-list">
            {faqs.map((faq, i) => (
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
