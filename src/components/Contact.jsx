import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import FadeInSection from "../components/FadeInSection";

const COMPANY_EMAIL = "jpsantos@jmv.ind.br";

const EMPTY = { nome: "", email: "", telefone: "", mensagem: "" };

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "E-mail inválido";
    if (!form.telefone || form.telefone.replace(/\D/g, "").length < 10)
      e.telefone = "Telefone inválido";
    if (!form.mensagem.trim()) e.mensagem = "Mensagem obrigatória";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const formatted = name === "telefone" ? formatPhone(value) : value;
    setForm((prev) => ({ ...prev, [name]: formatted }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const subject = encodeURIComponent(`Contato via site - ${form.nome}`);
    const body = encodeURIComponent(
      `Nome: ${form.nome}\nE-mail: ${form.email}\nTelefone: ${form.telefone}\n\nMensagem:\n${form.mensagem}`
    );

    window.location.href = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <FadeInSection>
      <section id="contato" className="contact-section">
        <div className="container">

          <div className="contact-info">
            <span className="section-subtitle">Contato</span>
            <h2 className="section-title">VAMOS CONVERSAR</h2>
            <p>Solicite um orçamento ou entre em contato com nossa equipe.</p>
            <div className="contact-item">
              <Phone size={18} />
              <span>(16) 99741-8402</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>jpsantos@jmv.ind.br</span>
            </div>
            <div className="contact-item">
              <MapPin size={18} />
              <span>Rua São Lourenço, 2170, IV Centenário, Matão - SP</span>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <h3 className="form-title">Solicitar Orçamento</h3>

            <div className="form-group">
              <label htmlFor="nome">Nome completo *</label>
              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome"
                value={form.nome}
                onChange={handleChange}
                className={errors.nome ? "input-error" : ""}
              />
              {errors.nome && <span className="field-error">{errors.nome}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">E-mail *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone *</label>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  placeholder="(16) 99999-9999"
                  value={form.telefone}
                  onChange={handleChange}
                  className={errors.telefone ? "input-error" : ""}
                />
                {errors.telefone && <span className="field-error">{errors.telefone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mensagem">Mensagem *</label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={5}
                placeholder="Descreva o serviço, localidade, escopo..."
                value={form.mensagem}
                onChange={handleChange}
                className={errors.mensagem ? "input-error" : ""}
              />
              {errors.mensagem && <span className="field-error">{errors.mensagem}</span>}
            </div>

            <button type="submit" className="btn-primary form-submit">
              <Send size={16} />
              Enviar mensagem
            </button>
          </form>

        </div>
      </section>
    </FadeInSection>
  );
}
