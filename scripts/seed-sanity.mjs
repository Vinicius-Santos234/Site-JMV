import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const assetsDir = resolve(rootDir, "src/assets/portfolio");

// Procura SANITY_WRITE_TOKEN em .env.local (prioridade) e depois em .env.
function readTokenFromEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const envPath = resolve(rootDir, file);
    if (!existsSync(envPath)) continue;
    const line = readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .find((l) => l.trim().startsWith("SANITY_WRITE_TOKEN="));
    if (line) {
      // Remove aspas envolventes (o `vercel env pull` grava valores entre aspas).
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

const PROJECTS = [
  { id: "project-e2g", title: "Etanol 2G", client: "Raízen", year: "2024", category: "Montagem Industrial", file: "e2g.webp", order: 1 },
  { id: "project-tubulacao", title: "Tubulação P11/P22", client: "Bunge", year: "2023", category: "Estruturas Metálicas", file: "tubulacao.webp", order: 2 },
  { id: "project-tanque", title: "Tanque de Armazenamento", client: "Cutrale", year: "2023", category: "Caldeiraria", file: "tanque.webp", order: 3 },
  { id: "project-evaporacao", title: "Sistema de Evaporação", client: "Ipiranga Agroindustrial", year: "2022", category: "Tubulações Industriais", file: "evaporacao.webp", order: 4 },
];

for (const p of PROJECTS) {
  const filePath = resolve(assetsDir, p.file);
  process.stdout.write(`Subindo imagem de "${p.title}"… `);
  const asset = await client.assets.upload("image", readFileSync(filePath), {
    filename: p.file,
  });

  await client.createOrReplace({
    _id: p.id,
    _type: "project",
    title: p.title,
    client: p.client,
    year: p.year,
    category: p.category,
    order: p.order,
    image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
  });
  console.log("ok");
}

console.log(`\n${PROJECTS.length} projetos criados/atualizados no dataset "production".`);
