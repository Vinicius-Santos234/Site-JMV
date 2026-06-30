import { useEffect } from "react";

export const BASE_URL   = "https://site-jmv.vercel.app";
const BASE_TITLE = "JMV Engenharia e Construções | Soluções Industriais em Matão - SP";
const BASE_DESC  = `Especialistas em montagem industrial, estruturas metálicas, caldeiraria e tubulações. Mais de ${new Date().getFullYear() - 2013} anos atendendo os setores sucroenergético e petroquímico. Matão - SP.`;

function swapMeta(selector, attr, next) {
  const el = document.querySelector(selector);
  const prev = el?.getAttribute(attr) ?? "";
  if (el) el.setAttribute(attr, next);
  return prev;
}

export function useSEO({ title = BASE_TITLE, description = BASE_DESC, canonical, schema } = {}) {
  useEffect(() => {
    const resolvedCanonical = canonical ?? BASE_URL + "/";

    const prevTitle      = document.title;
    document.title       = title;

    const prevDesc       = swapMeta('meta[name="description"]',         "content", description);
    const prevOgTitle    = swapMeta('meta[property="og:title"]',        "content", title);
    const prevOgDesc     = swapMeta('meta[property="og:description"]',  "content", description);
    const prevOgUrl      = swapMeta('meta[property="og:url"]',          "content", resolvedCanonical);
    const prevTwTitle    = swapMeta('meta[name="twitter:title"]',       "content", title);
    const prevTwDesc     = swapMeta('meta[name="twitter:description"]', "content", description);
    const prevCanonical  = swapMeta('link[rel="canonical"]',            "href",    resolvedCanonical);

    return () => {
      document.title = prevTitle;
      swapMeta('meta[name="description"]',         "content", prevDesc);
      swapMeta('meta[property="og:title"]',        "content", prevOgTitle);
      swapMeta('meta[property="og:description"]',  "content", prevOgDesc);
      swapMeta('meta[property="og:url"]',          "content", prevOgUrl);
      swapMeta('meta[name="twitter:title"]',       "content", prevTwTitle);
      swapMeta('meta[name="twitter:description"]', "content", prevTwDesc);
      swapMeta('link[rel="canonical"]',            "href",    prevCanonical);
    };
  }, [title, description, canonical]);

  useEffect(() => {
    if (!schema) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, [schema]);
}
