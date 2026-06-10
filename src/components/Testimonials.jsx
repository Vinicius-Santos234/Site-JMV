import { Quote } from "lucide-react";
import { TESTIMONIALS } from "../data/testimonials";
import FadeInSection from "../components/FadeInSection";

export default function Testimonials() {
  return (
    <FadeInSection>
      <section className="section testimonials-section">
        <div className="container">

          <span className="section-subtitle">Depoimentos</span>

          <h2 className="section-title">O QUE NOSSOS CLIENTES DIZEM</h2>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="testimonial-card">
                <Quote size={32} className="testimonial-quote-icon" />

                <p className="testimonial-text">{t.quote}</p>

                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <strong>{t.author}</strong>
                    <span>{t.role} · {t.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </FadeInSection>
  );
}