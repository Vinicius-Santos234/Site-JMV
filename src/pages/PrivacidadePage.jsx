import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSEO } from "../hooks/useSEO";
import "./PrivacidadePage.css";

export default function PrivacidadePage() {
  useSEO({
    title: "Política de Privacidade | JMV Engenharia e Construções",
    description:
      "Política de privacidade da JMV Engenharia e Construções. Saiba como tratamos seus dados pessoais em conformidade com a LGPD.",
    canonical: "https://site-jmv.vercel.app/privacidade",
  });

  return (
    <>
      <Navbar />

      <header className="portfolio-page-header">
        <div className="container">
          <Link to="/" className="portfolio-back-link">
            <ArrowLeft size={18} />
            Voltar ao site
          </Link>
          <span className="section-subtitle">Legal</span>
          <h1 className="section-title">POLÍTICA DE PRIVACIDADE</h1>
          <p className="section-description">
            Última atualização: junho de 2026
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container privacidade-content">

          <h2>1. Quem somos</h2>
          <p>
            JMV Engenharia e Construções, com sede na Rua São Lourenço, 2170,
            IV Centenário, Matão — SP, é a controladora dos dados pessoais
            coletados neste site.
          </p>

          <h2>2. Quais dados coletamos</h2>
          <p>Coletamos apenas os dados que você nos fornece voluntariamente:</p>
          <ul>
            <li><strong>Formulário de contato:</strong> nome, e-mail, telefone e mensagem.</li>
            <li><strong>Dados de navegação (com consentimento):</strong> páginas visitadas, tempo de sessão e origem do acesso, via Google Analytics e Vercel Analytics.</li>
          </ul>

          <h2>3. Como usamos seus dados</h2>
          <ul>
            <li>Responder às suas solicitações de orçamento e contato.</li>
            <li>Melhorar a experiência de navegação no site (somente com consentimento).</li>
            <li>Não vendemos, alugamos nem compartilhamos seus dados com terceiros para fins comerciais.</li>
          </ul>

          <h2>4. Base legal (LGPD)</h2>
          <p>
            O tratamento dos seus dados é fundamentado nas seguintes bases legais
            da Lei nº 13.709/2018 (LGPD):
          </p>
          <ul>
            <li><strong>Consentimento</strong> (art. 7º, I) — para cookies de análise.</li>
            <li><strong>Legítimo interesse</strong> (art. 7º, IX) — para responder suas mensagens.</li>
          </ul>

          <h2>5. Cookies</h2>
          <p>
            Utilizamos cookies de análise (Google Analytics e Vercel Analytics)
            somente após o seu consentimento explícito via banner de cookies.
            Você pode revogar esse consentimento a qualquer momento limpando os
            dados do site nas configurações do seu navegador.
          </p>

          <h2>6. Seus direitos</h2>
          <p>
            Conforme a LGPD, você tem o direito de:
          </p>
          <ul>
            <li>Confirmar a existência de tratamento dos seus dados.</li>
            <li>Acessar, corrigir ou solicitar a exclusão dos seus dados.</li>
            <li>Revogar o consentimento a qualquer momento.</li>
            <li>Solicitar portabilidade dos dados.</li>
          </ul>
          <p>
            Para exercer seus direitos, entre em contato pelo e-mail:{" "}
            <a href="mailto:jpsantos@jmv.ind.br">jpsantos@jmv.ind.br</a>.
          </p>

          <h2>7. Retenção de dados</h2>
          <p>
            Os dados do formulário de contato são mantidos pelo tempo necessário
            para atender à sua solicitação. Dados de análise são retidos conforme
            as políticas do Google Analytics (padrão: 14 meses).
          </p>

          <h2>8. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados,
            incluindo HTTPS, headers de segurança (HSTS, CSP, X-Frame-Options)
            e não armazenamos dados sensíveis em nossos servidores.
          </p>

          <h2>9. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta política periodicamente. A data de última
            atualização estará sempre indicada no topo desta página.
          </p>

          <h2>10. Contato</h2>
          <p>
            Dúvidas sobre esta política:{" "}
            <a href="mailto:jpsantos@jmv.ind.br">jpsantos@jmv.ind.br</a> |{" "}
            <a href="tel:+5516997418402">(16) 99741-8402</a>
          </p>

        </div>
      </section>

      <Footer />
    </>
  );
}
