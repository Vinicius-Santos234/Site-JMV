import "server-only";

import { sanityClient, isSanityConfigured, urlFor } from "./sanity";

import { SERVICES } from "../data/services";
import { STATS } from "../data/stats";
import { CLIENTS } from "../data/clients";
import { TESTIMONIALS } from "../data/testimonials";
import { FAQS } from "../data/faqs";
import { DIFFERENTIALS } from "../data/about";
import { QUALITY_ITEMS } from "../data/quality";
import { CNPJ, CTA_HIGHLIGHTS } from "../data/site";
import { ALL_PROJECTS } from "../data/portfolio-full";

// Quanto tempo o conteúdo do CMS fica em cache antes de ser rebuscado.
// O pai edita no Studio e vê no ar em até 1h, sem redeploy.
export const revalidate = 3600;

// As 9 queries GROQ que saíam do navegador (uma por hook) viram UMA só, no
// servidor. Era uma pendência anotada na migração do CMS de 08/07.
const QUERY = `{
  "services":     *[_type == "service"]      | order(order asc) { _id, iconName, title, description, norms },
  "stats":        *[_type == "stat"]         | order(order asc) { _id, number, label },
  "clients":      *[_type == "client"]       | order(order asc) { _id, name, logo },
  "testimonials": *[_type == "testimonial"]  | order(order asc) { _id, quote, author, role, company },
  "faqs":         *[_type == "faq"]          | order(order asc) { _id, question, answer },
  "differentials":*[_type == "differential"] | order(order asc) { _id, iconName, title, text },
  "qualityItems": *[_type == "qualityItem"]  | order(order asc) { _id, iconName, title, description },
  "projects":     *[_type == "project"]      | order(order asc, year desc) { _id, title, client, year, category, image },
  "settings":     *[_type == "siteSettings"][0] { cnpj, ctaHighlights }
}`;

const PLACEHOLDERS = ALL_PROJECTS.filter((p) => p.placeholder);
const LOCAL_REAL   = ALL_PROJECTS.filter((p) => !p.placeholder);

const FALLBACK = {
  services:      SERVICES,
  stats:         STATS,
  clients:       CLIENTS,
  testimonials:  TESTIMONIALS,
  faqs:          FAQS,
  differentials: DIFFERENTIALS,
  qualityItems:  QUALITY_ITEMS,
  projects:      [...LOCAL_REAL, ...PLACEHOLDERS],
  cnpj:          CNPJ,
  ctaHighlights: CTA_HIGHLIGHTS,
};

// Guarda de lista vazia: tipo ainda não populado no CMS mantém o fallback
// local. É o que impediu a produção de quebrar antes do seed, em 07/2026.
function orFallback(docs, fallback, map) {
  if (!Array.isArray(docs) || docs.length === 0) return fallback;
  return docs.map(map);
}

function mapProject(doc) {
  return {
    id:       doc._id,
    title:    doc.title,
    client:   doc.client,
    year:     doc.year,
    category: doc.category,
    image:    doc.image ? urlFor(doc.image).width(1200).auto("format").url() : "",
    placeholder: false,
  };
}

/**
 * Busca todo o conteúdo do site no servidor, com fallback local automático.
 * Sem `SANITY_PROJECT_ID`, ou se a query falhar, devolve os dados de src/data.
 */
export async function getContent() {
  if (!isSanityConfigured) return FALLBACK;

  let res;
  try {
    res = await sanityClient.fetch(QUERY, {}, { next: { revalidate } });
  } catch (err) {
    console.error("[ERR_SANITY] Falha ao buscar conteúdo, usando fallback local:", err?.message);
    return FALLBACK;
  }
  if (!res) return FALLBACK;

  // A TRANSFORMACAO tambem precisa estar protegida, nao so o fetch. `urlFor()`
  // lanca com referencia de imagem malformada, e como isso acontecia depois do
  // try/catch, o erro escapava e derrubava o build ou a renderizacao das tres
  // paginas — em vez de cair no fallback local, que e o comportamento esperado.
  try {
    return transformar(res);
  } catch (err) {
    console.error("[ERR_SANITY] Conteúdo do CMS ilegível, usando fallback local:", err?.message);
    return FALLBACK;
  }
}

function transformar(res) {
  const projetosDoCms = orFallback(res.projects, null, mapProject);

  return {
    // `norms` é opcional no Studio: serviço sem normas preenchidas renderiza o
    // card sem a régua de chips, em vez de quebrar no `.map` do componente.
    //
    // O filtro não é paranoia: `Array.isArray` sozinho aprova um array de
    // objetos, e um `{_type: ...}` chegaria até `<li>{norm}</li>`, onde React
    // lança "Objects are not valid as a React child" e derruba a home inteira.
    // O CMS não tem como produzir isso hoje, mas o schema pode mudar e a
    // renderização do site não é o lugar de descobrir. Strings vazias também
    // caem aqui — virariam um chip em branco, que é pior que nenhum chip.
    services: orFallback(res.services, FALLBACK.services, (d) => ({
      id: d._id, icon: d.iconName, title: d.title, description: d.description,
      norms: Array.isArray(d.norms)
        ? d.norms
            .filter((n) => typeof n === "string" && n.trim() !== "")
            .map((n) => n.trim())
        : [],
    })),
    stats: orFallback(res.stats, FALLBACK.stats, (d) => ({
      id: d._id, number: d.number, label: d.label,
    })),
    clients: orFallback(res.clients, FALLBACK.clients, (d) => ({
      id: d._id,
      name: d.name,
      logo: d.logo ? urlFor(d.logo).width(400).auto("format").url() : "",
    })),
    testimonials: orFallback(res.testimonials, FALLBACK.testimonials, (d) => ({
      id: d._id, quote: d.quote, author: d.author, role: d.role, company: d.company,
    })),
    faqs: orFallback(res.faqs, FALLBACK.faqs, (d) => ({ q: d.question, a: d.answer })),
    differentials: orFallback(res.differentials, FALLBACK.differentials, (d) => ({
      id: d._id, icon: d.iconName, title: d.title, text: d.text,
    })),
    qualityItems: orFallback(res.qualityItems, FALLBACK.qualityItems, (d) => ({
      id: d._id, icon: d.iconName, title: d.title, description: d.description,
    })),
    // Placeholders "Em breve" são preenchimento visual, não conteúdo de CMS —
    // entram sempre, depois dos projetos reais.
    projects: [...(projetosDoCms ?? LOCAL_REAL), ...PLACEHOLDERS],
    cnpj: res.settings?.cnpj || FALLBACK.cnpj,
    ctaHighlights:
      res.settings?.ctaHighlights?.length
        ? res.settings.ctaHighlights
        : FALLBACK.ctaHighlights,
  };
}
