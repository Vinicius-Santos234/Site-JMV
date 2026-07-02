import { LINKS } from "./navbar";

const FOOTER_LABELS = { "#sobre": "Sobre nós" };

export const NAV_LINKS = LINKS.map(({ href, label }) => ({
  href,
  label: FOOTER_LABELS[href] ?? label,
}));


export const CNPJ = "15.568.755/0001-64";

export const SERVICES = [
  "Montagem Industrial",
  "Estruturas Metálicas",
  "Tubulações Industriais",
  "Caldeiraria",
  "Manutenção Industrial",
  "SSMA",
];