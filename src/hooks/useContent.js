import { useState, useEffect } from "react";
import { sanityClient, isSanityConfigured, urlFor } from "../lib/sanity";

import { SERVICES } from "../data/services";
import { STATS } from "../data/stats";
import { CLIENTS } from "../data/clients";
import { TESTIMONIALS } from "../data/testimonials";
import { FAQS } from "../data/faqs";
import { DIFFERENTIALS } from "../data/about";
import { QUALITY_ITEMS } from "../data/quality";
import { CNPJ, CTA_HIGHLIGHTS } from "../data/site";

function useSanityData(query, transform, fallback) {
  const [data, setData] = useState(fallback);

  useEffect(() => {
    if (!isSanityConfigured) return;
    let active = true;

    sanityClient
      .fetch(query)
      .then((res) => {
        if (!active || res == null) return;
        if (Array.isArray(res) && res.length === 0) return;
        setData(transform(res));
      })
      .catch(() => {
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data;
}

export function useServices() {
  return useSanityData(
    `*[_type == "service"] | order(order asc) { _id, iconName, title, description }`,
    (docs) =>
      docs.map((d) => ({
        id: d._id,
        icon: d.iconName,
        title: d.title,
        description: d.description,
      })),
    SERVICES
  );
}

export function useStats() {
  return useSanityData(
    `*[_type == "stat"] | order(order asc) { _id, number, label }`,
    (docs) => docs.map((d) => ({ id: d._id, number: d.number, label: d.label })),
    STATS
  );
}

export function useClients() {
  return useSanityData(
    `*[_type == "client"] | order(order asc) { _id, name, logo }`,
    (docs) =>
      docs.map((d) => ({
        id: d._id,
        name: d.name,
        logo: d.logo ? urlFor(d.logo).width(400).auto("format").url() : "",
      })),
    CLIENTS
  );
}

export function useTestimonials() {
  return useSanityData(
    `*[_type == "testimonial"] | order(order asc) { _id, quote, author, role, company }`,
    (docs) =>
      docs.map((d) => ({
        id: d._id,
        quote: d.quote,
        author: d.author,
        role: d.role,
        company: d.company,
      })),
    TESTIMONIALS
  );
}

export function useFaqs() {
  return useSanityData(
    `*[_type == "faq"] | order(order asc) { _id, question, answer }`,
    (docs) => docs.map((d) => ({ q: d.question, a: d.answer })),
    FAQS
  );
}

export function useDifferentials() {
  return useSanityData(
    `*[_type == "differential"] | order(order asc) { _id, iconName, title, text }`,
    (docs) =>
      docs.map((d) => ({
        id: d._id,
        icon: d.iconName,
        title: d.title,
        text: d.text,
      })),
    DIFFERENTIALS
  );
}

export function useQualityItems() {
  return useSanityData(
    `*[_type == "qualityItem"] | order(order asc) { _id, iconName, title, description }`,
    (docs) =>
      docs.map((d) => ({
        id: d._id,
        icon: d.iconName,
        title: d.title,
        description: d.description,
      })),
    QUALITY_ITEMS
  );
}

const SETTINGS_FALLBACK = { cnpj: CNPJ, ctaHighlights: CTA_HIGHLIGHTS };

export function useSiteSettings() {
  return useSanityData(
    `*[_type == "siteSettings"][0] { cnpj, ctaHighlights }`,
    (doc) => ({
      cnpj: doc.cnpj || CNPJ,
      ctaHighlights:
        doc.ctaHighlights && doc.ctaHighlights.length
          ? doc.ctaHighlights
          : CTA_HIGHLIGHTS,
    }),
    SETTINGS_FALLBACK
  );
}
