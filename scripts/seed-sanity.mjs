import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { SERVICES } from "../src/data/services.js";
import { STATS } from "../src/data/stats.js";
import { TESTIMONIALS } from "../src/data/testimonials.js";
import { FAQS } from "../src/data/faqs.js";
import { DIFFERENTIALS } from "../src/data/about.js";
import { QUALITY_ITEMS } from "../src/data/quality.js";
import { CNPJ, CTA_HIGHLIGHTS } from "../src/data/site.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const portfolioDir = resolve(rootDir, "src/assets/portfolio");
const clientsDir = resolve(rootDir, "src/assets/clients");

function readTokenFromEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const envPath = resolve(rootDir, file);
    if (!existsSync(envPath)) continue;
    const line = readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .find((l) => l.trim().startsWith("SANITY_WRITE_TOKEN="));
    if (line) {
      return line.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
  return undefined;
}

const token = process.env.SANITY_WRITE_TOKEN || readTokenFromEnvFiles();
if (!token) {
  console.error(
    "Faltou o token. Adicione ao .env ou .env.local na raiz:\n" +
      "  SANITY_WRITE_TOKEN=seu_token_de_editor\n" +
      "e rode: node scripts/seed-sanity.mjs"
  );
  process.exit(1);
}

const client = createClient({
  projectId: "b54yjbjl",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const assetCache = new Map();
async function uploadImage(dir, file) {
  if (assetCache.has(file)) return assetCache.get(file);
  const asset = await client.assets.upload("image", readFileSync(resolve(dir, file)), {
    filename: file,
  });
  const ref = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  assetCache.set(file, ref);
  return ref;
}

const PROJECTS = [
  { id: "project-e2g", title: "Etanol 2G", client: "Raízen", year: "2024", category: "Montagem Industrial", file: "e2g.webp", order: 1 },
  { id: "project-tubulacao", title: "Tubulação P11/P22", client: "Bunge", year: "2023", category: "Estruturas Metálicas", file: "tubulacao.webp", order: 2 },
  { id: "project-tanque", title: "Tanque de Armazenamento", client: "Cutrale", year: "2023", category: "Caldeiraria", file: "tanque.webp", order: 3 },
  { id: "project-evaporacao", title: "Sistema de Evaporação", client: "Ipiranga Agroindustrial", year: "2022", category: "Tubulações Industriais", file: "evaporacao.webp", order: 4 },
];

const CLIENTS = [
  { name: "Raízen", file: "raizenLogo.webp" },
  { name: "Bunge", file: "bungeLogo.webp" },
  { name: "Petrobras", file: "petrobrasLogo.webp" },
  { name: "Cutrale", file: "cutraleLogo.webp" },
  { name: "Ipiranga", file: "ipirangaLogo.webp" },
  { name: "Cofco", file: "cofcoLogo.webp" },
  { name: "Jalles Machado", file: "jallesmachadoLogo.webp" },
  { name: "Guarani", file: "guaraniLogo.webp" },
  { name: "Cerradinho", file: "cerradinhoLogo.webp" },
  { name: "Cerradão", file: "cerradaoLogo.webp" },
  { name: "Morrinhos", file: "morrinhosLogo.webp" },
  { name: "Planusi", file: "planusiLogo.webp" },
  { name: "Sebigas", file: "sebigasLogo.webp" },
  { name: "Usina Lins", file: "usinalinsLogo.webp" },
  { name: "Iacanga", file: "iacangaLogo.webp" },
];

const DIACRITICS = /[̀-ͯ]/g;
const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function run() {
  for (const p of PROJECTS) {
    process.stdout.write(`Projeto "${p.title}"… `);
    const image = await uploadImage(portfolioDir, p.file);
    await client.createOrReplace({
      _id: p.id,
      _type: "project",
      title: p.title,
      client: p.client,
      year: p.year,
      category: p.category,
      order: p.order,
      image,
    });
    console.log("ok");
  }

  for (const [i, s] of SERVICES.entries()) {
    await client.createOrReplace({
      _id: `service-${i + 1}`,
      _type: "service",
      title: s.title,
      description: s.description,
      iconName: s.icon,
      order: i + 1,
    });
  }
  console.log(`${SERVICES.length} serviços.`);

  for (const [i, s] of STATS.entries()) {
    await client.createOrReplace({
      _id: `stat-${i + 1}`,
      _type: "stat",
      number: s.number,
      label: s.label,
      order: i + 1,
    });
  }
  console.log(`${STATS.length} estatísticas.`);

  for (const [i, c] of CLIENTS.entries()) {
    process.stdout.write(`Cliente "${c.name}"… `);
    const logo = await uploadImage(clientsDir, c.file);
    await client.createOrReplace({
      _id: `client-${slug(c.name)}`,
      _type: "client",
      name: c.name,
      logo,
      order: i + 1,
    });
    console.log("ok");
  }
  console.log(`${CLIENTS.length} clientes.`);

  for (const [i, t] of TESTIMONIALS.entries()) {
    await client.createOrReplace({
      _id: `testimonial-${i + 1}`,
      _type: "testimonial",
      quote: t.quote,
      author: t.author,
      role: t.role,
      company: t.company,
      order: i + 1,
    });
  }
  console.log(`${TESTIMONIALS.length} depoimentos.`);

  for (const [i, f] of FAQS.entries()) {
    await client.createOrReplace({
      _id: `faq-${i + 1}`,
      _type: "faq",
      question: f.q,
      answer: f.a,
      order: i + 1,
    });
  }
  console.log(`${FAQS.length} FAQs.`);

  for (const [i, d] of DIFFERENTIALS.entries()) {
    await client.createOrReplace({
      _id: `differential-${i + 1}`,
      _type: "differential",
      title: d.title,
      text: d.text,
      iconName: d.icon,
      order: i + 1,
    });
  }
  console.log(`${DIFFERENTIALS.length} diferenciais.`);

  for (const [i, q] of QUALITY_ITEMS.entries()) {
    await client.createOrReplace({
      _id: `qualityItem-${i + 1}`,
      _type: "qualityItem",
      title: q.title,
      description: q.description,
      iconName: q.icon,
      order: i + 1,
    });
  }
  console.log(`${QUALITY_ITEMS.length} itens de qualidade.`);

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    cnpj: CNPJ,
    ctaHighlights: CTA_HIGHLIGHTS,
  });
  console.log("Configurações do site (singleton).");

  console.log('\nSeed concluído no dataset "production".');
}

run().catch((err) => {
  console.error("\nErro no seed:", err.message);
  process.exit(1);
});
