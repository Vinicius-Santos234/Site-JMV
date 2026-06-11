import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle,
} from "lucide-react";

import FadeInSection from "../components/FadeInSection";

import { SERVICES } from "../data/contact";
import { INITIAL } from "../data/contact";

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCNPJ(value) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  function validate() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.empresa.trim()) e.empresa = "Empresa obrigatória";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "E-mail inválido";
    if (!form.telefone || form.telefone.replace(/\D/g, "").length < 10)
      e.telefone = "Telefone inválido";
    if (!form.servico) e.servico = "Selecione um serviço";
    if (!form.mensagem.trim() || form.mensagem.trim().length < 20)
      e.mensagem = "Descreva o projeto (mínimo 20 caracteres)";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    let formatted = value;
    if (name === "telefone") formatted = formatPhone(value);
    if (name === "cnpj") formatted = formatCNPJ(value);
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
    setSending(true);
    const subject = encodeURIComponent(
      `Solicitação de Orçamento – ${form.servico} | ${form.empresa}`
    );
    const body = encodeURIComponent(
      `Nome: ${form.nome}\nEmpresa: ${form.empresa}\nCNPJ: ${form.cnpj || "Não informado"}\nE-mail: ${form.email}\nTelefone: ${form.telefone}\nServiço: ${form.servico}\nPrazo desejado: ${form.prazo || "Não informado"}\n\nDescrição:\n${form.mensagem}`
    );
    window.location.href = `mailto:jpsantos@jmv.ind.br?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setForm(INITIAL);
    }, 800);
  }

  return (
    <FadeInSection>
      <section id="contato" className="contact-section">
        <div className="container">

          <div className="contact-info">
            <span className="section-subtitle">Contato</span>
            <h2 className="section-title">VAMOS CONVERSAR</h2>
            <p>
              Solicite um orçamento ou entre em contato com nossa equipe.
            </p>
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

          {submitted ? (
            <div className="contact-form contact-form--success">
              <CheckCircle size={48} />
              <p>Solicitação enviada!</p>
              <span>
                Seu cliente de e-mail foi aberto com os dados preenchidos.
                Em breve nossa equipe entrará em contato.
              </span>
              <button
                className="btn-primary"
                onClick={() => setSubmitted(false)}
              >
                Enviar nova solicitação
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <h3 className="form-title">Solicitar Orçamento</h3>

              <div className="form-row">
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

                <div className="form-group">
                  <label htmlFor="empresa">Empresa *</label>
                  <input
                    id="empresa"
                    name="empresa"
                    type="text"
                    placeholder="Nome da empresa"
                    value={form.empresa}
                    onChange={handleChange}
                    className={errors.empresa ? "input-error" : ""}
                  />
                  {errors.empresa && <span className="field-error">{errors.empresa}</span>}
                </div>
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cnpj">CNPJ</label>
                  <input
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={form.cnpj}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="servico">Tipo de serviço *</label>
                  <select
                    id="servico"
                    name="servico"
                    value={form.servico}
                    onChange={handleChange}
                    className={errors.servico ? "input-error" : ""}
                  >
                    <option value="">Selecione...</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.servico && <span className="field-error">{errors.servico}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prazo">Prazo desejado</label>
                <input
                  id="prazo"
                  name="prazo"
                  type="text"
                  placeholder="Ex: 30 dias, urgente, a definir..."
                  value={form.prazo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensagem">Descrição do projeto / serviço *</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows={5}
                  placeholder="Descreva o serviço, localidade, escopo, equipamentos envolvidos..."
                  value={form.mensagem}
                  onChange={handleChange}
                  className={errors.mensagem ? "input-error" : ""}
                />
                {errors.mensagem && <span className="field-error">{errors.mensagem}</span>}
              </div>

              <button
                type="submit"
                className="btn-primary form-submit"
                disabled={sending}
              >
                {sending ? "Enviando..." : (
                  <>
                    <Send size={16} />
                    Enviar solicitação
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </section>
    </FadeInSection>
  );
}
