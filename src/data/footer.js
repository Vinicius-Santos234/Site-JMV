import { LINKS } from "./navbar";

const FOOTER_LABELS = { "#sobre": "Sobre nós" };

export const NAV_LINKS = LINKS.map(({ href, label }) => ({
  href,
  label: FOOTER_LABELS[href] ?? label,
}));

export const SERVICES = [
  "Montagem Industrial",
  "Estruturas Metálicas",
  "Tubulações Industriais",
  "Caldeiraria",
  "Manutenção Industrial",
  "SSMA",
];