import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";
import FadeInSection from "../components/FadeInSection";
import "./Contact.css";

const EMPTY = { nome: "", email: "", telefone: "", mensagem: "", website: "", consentimento: false };

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function Contact() {
  const [form, setForm]         = useState(EMPTY);
  const [errors, setErrors]     = useState({});
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [sendError, setSendError] = useState(false);

  function validate() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "E-mail inválido";
    if (!form.telefone || form.telefone.replace(/\D/g, "").length < 10)
      e.telefone = "Telefone inválido";
    if (!form.mensagem.trim()) e.mensagem = "Mensagem obrigatória";
    if (!form.consentimento) e.consentimento = "É necessário aceitar a Política de Privacidade";
    return e;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const nextValue =
      type === "checkbox" ? checked : name === "telefone" ? formatPhone(value) : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Honeypot: bots preenchem campos ocultos; humanos não veem este campo
    if (form.website) return;

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSending(true);
    setSendError(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome:      form.nome,
          email:     form.email,
          telefone:  form.telefone,
          mensagem:  form.mensagem,
          website:   form.website,
        }),
      });

      if (!res.ok) throw new Error("server");

      setSent(true);
      setForm(EMPTY);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <FadeInSection>
      <section id="contato" className="contact-section">
        <div className="container">

          <div className="contact-info">
            <span className="section-subtitle">Contato</span>
            <h2 className="section-title">VAMOS CONVERSAR</h2>
            <p>Solicite um orçamento ou entre em contato com nossa equipe.</p>
            <address className="contact-address">
              <div className="contact-item">
                <Phone size={18} />
                <a href="tel:+5516997418402">(16) 99741-8402</a>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <a href="mailto:jpsantos@jmv.ind.br">jpsantos@jmv.ind.br</a>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <span>Rua São Lourenço, 2170, IV Centenário, Matão - SP</span>
              </div>
            </address>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {/* Honeypot — visualmente oculto; bots preenchem, humanos não */}
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
            />
            <h3 className="form-title">Solicitar Orçamento</h3>

            {sent ? (
              <div className="form-success">
                <CheckCircle size={32} />
                <p>Mensagem enviada com sucesso!</p>
                <small>Retornaremos em até 24 horas úteis.</small>
              </div>
            ) : (
              <>
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
                    maxLength={100}
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
                      maxLength={150}
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
                      maxLength={20}
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
                    maxLength={1000}
                    className={errors.mensagem ? "input-error" : ""}
                  />
                  {errors.mensagem && <span className="field-error">{errors.mensagem}</span>}
                </div>

                <div className="form-consent">
                  <label className="consent-label">
                    <input
                      type="checkbox"
                      name="consentimento"
                      checked={form.consentimento}
                      onChange={handleChange}
                    />
                    <span>
                      Li e concordo com a{" "}
                      <a href="/privacidade" target="_blank" rel="noopener noreferrer">
                        Política de Privacidade
                      </a>{" "}
                      e autorizo o contato com meus dados.
                    </span>
                  </label>
                  {errors.consentimento && (
                    <span className="field-error">{errors.consentimento}</span>
                  )}
                </div>

                {sendError && (
                  <p className="field-error">
                    Não foi possível enviar. Tente diretamente pelo e-mail{" "}
                    <a href="mailto:jpsantos@jmv.ind.br">jpsantos@jmv.ind.br</a>.
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-primary form-submit"
                  disabled={sending}
                >
                  <Send size={16} />
                  {sending ? "Enviando..." : "Enviar mensagem"}
                </button>
              </>
            )}
          </form>

        </div>
      </section>
    </FadeInSection>
  );
}
