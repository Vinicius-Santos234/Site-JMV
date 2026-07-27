const YEARS = new Date().getFullYear() - 2013;

export const FAQS = [
  {
    q: "Quais serviços a JMV Soluções Industriais oferece?",
    a: "Oferecemos montagem industrial, caldeiraria, estruturas metálicas, tubulações industriais, manutenção industrial e serviços de SSMA (Saúde, Segurança e Meio Ambiente).",
  },
  {
    q: "Em quais regiões a JMV Soluções Industriais atua?",
    a: "Atendemos clientes em todo o território nacional, com sede em Matão - SP, no coração do polo sucroenergético paulista.",
  },
  {
    q: "Há quanto tempo a JMV está no mercado?",
    a: `A JMV Soluções Industriais foi fundada em 2013 e acumula mais de ${YEARS} anos de experiência na execução de projetos industriais de grande porte.`,
  },
  {
    q: "Quais setores industriais a JMV atende?",
    a: "Atuamos principalmente nos setores sucroenergético (usinas de açúcar e etanol) e petroquímico, além de outros segmentos da indústria de processo que demandam montagem industrial de precisão.",
  },
  {
    q: "Como solicitar um orçamento da JMV Soluções Industriais?",
    a: "Entre em contato pelo telefone (16) 99741-8402, pelo e-mail jpsantos@jmv.ind.br ou pelo formulário neste site. Nossa equipe responde em até 24 horas úteis.",
  },
  {
    q: "A JMV Soluções Industriais trabalha com ligas especiais como P11 e P22?",
    a: "Sim. Nossa equipe é especializada na montagem de tubulações com ligas especiais como P11 e P22, aplicadas em linhas de alta pressão e alta temperatura em processos industriais exigentes.",
  },
];

export function buildFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}
