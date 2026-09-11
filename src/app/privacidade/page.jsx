import { getContent } from "@/lib/content";
import { socialMetadata } from "@/lib/seo";
import Navbar        from "@/components/Navbar";
import Footer        from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import BackLink      from "@/components/BackLink";
import RevogarConsentimento from "@/components/RevogarConsentimento";
import "@/styles/page-header.css";
import "./PrivacidadePage.css";

export const metadata = {
  title: "Política de Privacidade | JMV Soluções Industriais",
  description:
    "Política de privacidade da JMV Soluções Industriais. Saiba como tratamos seus dados pessoais em conformidade com a LGPD.",
  alternates: { canonical: "/privacidade" },
  ...socialMetadata({
    url: "/privacidade",
    title: "Política de Privacidade | JMV Soluções Industriais",
    description:
      "Como a JMV Soluções Industriais trata seus dados pessoais, em conformidade com a LGPD.",
  }),
};

export const revalidate = 3600;

export default async function PrivacidadePage() {
  const { cnpj } = await getContent();

  return (
    <ErrorBoundary>
      <Navbar />

      <header className="portfolio-page-header">
        <div className="container">
          <BackLink />
          <span className="section-subtitle">Legal</span>
          <h1 className="section-title">POLÍTICA DE PRIVACIDADE</h1>
          <p className="section-description">
            Última atualização: setembro de 2026
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container privacidade-content">

          <h2>1. Quem somos</h2>
          <p>
            JMV Soluções Industriais, com sede na Rua São Lourenço, 2170,
            IV Centenário, Matão — SP, é a controladora dos dados pessoais
            coletados neste site.
          </p>

          <h2>2. Quais dados coletamos</h2>
          <p>Coletamos apenas os dados que você nos fornece voluntariamente:</p>
          <ul>
            <li><strong>Formulário de contato:</strong> nome, e-mail, telefone e mensagem.</li>
            <li><strong>Dados de navegação (com consentimento):</strong> páginas visitadas, tempo de sessão e origem do acesso, via Google Analytics, Vercel Analytics e Vercel Speed Insights.</li>
            <li><strong>Dados técnicos de acesso:</strong> endereço IP e identificação do navegador, tratados automaticamente pela hospedagem para entregar as páginas, aplicar limite de envios no formulário e barrar acessos automatizados abusivos. Não são usados para criar perfil nem para publicidade.</li>
          </ul>

          <h2>3. Como usamos seus dados</h2>
          <ul>
            <li>Responder às suas solicitações de orçamento e contato.</li>
            <li>Melhorar a experiência de navegação no site (somente com consentimento).</li>
            <li>Não vendemos, alugamos nem compartilhamos seus dados com terceiros para fins comerciais.</li>
          </ul>

          <h2>4. Com quem seus dados são compartilhados</h2>
          <p>
            Não vendemos nem alugamos seus dados. Para o site funcionar,
            contamos com prestadores de serviço que atuam como operadores,
            tratando dados apenas conforme nossas instruções:
          </p>
          <ul>
            <li><strong>Vercel</strong> — hospedagem do site e proteção contra abuso. Recebe dados técnicos de acesso (IP, navegador).</li>
            <li><strong>Resend</strong> — entrega dos e-mails gerados pelo formulário. Recebe o nome, e-mail, telefone e a mensagem que você enviar.</li>
            <li><strong>Cloudflare</strong> — verificação antibot (Turnstile) na seção de contato. Recebe dados técnicos do seu navegador para distinguir pessoas de robôs.</li>
            <li><strong>Google</strong> e <strong>Vercel</strong> — métricas de navegação, <em>somente</em> se você aceitar os cookies de análise.</li>
            <li><strong>Sanity</strong> — sistema que armazena o conteúdo editorial do site. Não recebe dados pessoais de visitantes.</li>
          </ul>

          <h2>5. Transferência internacional de dados</h2>
          <p>
            Os prestadores acima operam servidores fora do Brasil. Portanto, ao
            enviar o formulário ou consentir com os cookies de análise, seus
            dados podem ser transferidos e processados no exterior, nos termos
            do art. 33 da LGPD. Escolhemos fornecedores que oferecem cláusulas
            contratuais e medidas de segurança compatíveis com a legislação
            brasileira.
          </p>

          <h2>6. Base legal (LGPD)</h2>
          <p>
            O tratamento dos seus dados é fundamentado nas seguintes bases legais
            da Lei nº 13.709/2018 (LGPD):
          </p>
          <ul>
            <li><strong>Consentimento</strong> (art. 7º, I) — para cookies de análise.</li>
            <li><strong>Legítimo interesse</strong> (art. 7º, IX) — para responder suas mensagens.</li>
          </ul>

          <h2>7. Cookies</h2>
          <p>
            Utilizamos cookies de análise (Google Analytics e Vercel Analytics)
            somente após o seu consentimento explícito via banner de cookies.
            Você pode revogar esse consentimento a qualquer momento, com um
            clique, no botão abaixo — os cookies de análise param de ser usados
            imediatamente e o aviso volta a aparecer.
          </p>
          <RevogarConsentimento />

          <h2>8. Seus direitos</h2>
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

          <h2>9. Retenção de dados</h2>
          <p>
            Os dados do formulário de contato são mantidos pelo tempo necessário
            para atender à sua solicitação. Dados de análise são retidos conforme
            as políticas do Google Analytics (padrão: 14 meses).
          </p>

          <h2>10. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados,
            incluindo HTTPS, headers de segurança (HSTS, CSP, X-Frame-Options)
            e não armazenamos dados sensíveis em nossos servidores.
          </p>

          <h2>11. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta política periodicamente. A data de última
            atualização estará sempre indicada no topo desta página.
          </p>

          <h2>12. Contato</h2>
          <p>
            Dúvidas sobre esta política:{" "}
            <a href="mailto:jpsantos@jmv.ind.br">jpsantos@jmv.ind.br</a> |{" "}
            <a href="tel:+5516997418402">(16) 99741-8402</a>
          </p>

        </div>
      </section>

      <Footer cnpj={cnpj} />
    </ErrorBoundary>
  );
}
