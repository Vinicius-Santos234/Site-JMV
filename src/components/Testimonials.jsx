import { Quote } from "lucide-react";
import { useTestimonials } from "../hooks/useContent";
import FadeInSection from "../components/FadeInSection";
import "./Testimonials.css";

export default function Testimonials() {
  const testimonials = useTestimonials();

  return (
    <FadeInSection>
      <section className="section testimonials-section">
        <div className="container">

          <span className="section-subtitle">Depoimentos</span>

          <h2 className="section-title">O QUE NOSSOS CLIENTES DIZEM</h2>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
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