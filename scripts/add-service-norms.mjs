/**
 * Preenche o campo `norms` dos serviços já existentes no Sanity.
 *
 * Por que não usar o seed-sanity.mjs: ele faz `createOrReplace`, que substitui
 * o documento inteiro pelo conteúdo de src/data. Qualquer texto ajustado no
 * Studio depois do seed original seria perdido. Aqui é `patch().set()` — toca
 * só em `norms` e não encosta em title, description, iconName ou order.
 *
 *   node scripts/add-service-norms.mjs          # mostra o que faria
 *   node scripts/add-service-norms.mjs --write  # grava
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { SERVICES } from "../src/data/services.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

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

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN || readTokenFromEnvFiles();

if (write && !token) {
  console.error(
    "Faltou o token. Adicione SANITY_WRITE_TOKEN=seu_token_de_editor ao .env.local"
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

/* ── LEITURA ────────────────────────────────────────────────────────────────
   Duas coisas que a query precisa fazer, e que a versão anterior não fazia:

   1. EXCLUIR RASCUNHOS. A perspectiva padrão desta apiVersion é `raw`, que com
      token autenticado devolve publicados E rascunhos. Um rascunho tem o mesmo
      `title` do publicado, então entraria no pareamento por título e poderia
      levar o patch para o documento errado — gravando numa versão que ninguém
      vê no site.
   2. TRAZER `_rev`, que é o que permite detectar edição concorrente na hora de
      gravar (ver ifRevisionId abaixo).                                        */
const docs = await client.fetch(
  `*[_type == "service" && !(_id in path("drafts.**"))]{ _id, _rev, title, norms }`
);

/* ── PAREAMENTO ─────────────────────────────────────────────────────────────
   Casa por TÍTULO e não pelo índice do array: os _id do seed (`service-1`…)
   seguem a ordem de src/data, mas a ordem no Studio é editável, e parear por
   posição escreveria as normas de Caldeiraria em Manutenção no dia em que
   alguém reordenar.

   Título, porém, não é chave — nada no schema impede dois serviços com o mesmo
   nome. Um Map simples guardaria só o último e descartaria a colisão em
   silêncio, então aqui a duplicata é ACUMULADA e vira erro logo abaixo: entre
   gravar no documento errado e não gravar, não gravar é a opção recuperável. */
const porTitulo = new Map();

for (const doc of docs) {
  if (typeof doc.title !== "string" || doc.title.trim() === "") {
    console.warn(`  !  ${doc._id}: sem título utilizável — ignorado`);
    continue;
  }
  const chave = doc.title.trim().toLowerCase();
  porTitulo.set(chave, [...(porTitulo.get(chave) ?? []), doc]);
}

const ambiguos = [...porTitulo.entries()].filter(([, ds]) => ds.length > 1);

if (ambiguos.length > 0) {
  console.error("\nTítulos duplicados no CMS — não dá para saber qual patchear:");
  for (const [titulo, ds] of ambiguos) {
    console.error(`  "${titulo}" → ${ds.map((d) => d._id).join(", ")}`);
  }
  console.error("\nResolva no Studio (renomeie ou remova) e rode de novo. Nada foi gravado.");
  process.exit(1);
}

/* ── MONTAGEM ───────────────────────────────────────────────────────────────  */
let aplicar = 0;
let semPar = 0;
let preservados = 0;

const tx = client.transaction();

for (const s of SERVICES) {
  const [doc] = porTitulo.get(s.title.trim().toLowerCase()) ?? [];

  if (!doc) {
    console.warn(`  ?  "${s.title}" não tem documento correspondente no CMS — pulando`);
    semPar++;
    continue;
  }

  // Só conta como "já preenchido" o que é utilizável: array com pelo menos uma
  // string não vazia. `norms` com tipo inesperado (objeto, número) não é
  // conteúdo que alguém escreveu para ver na tela — é lixo, e pode ser
  // substituído.
  const atual = Array.isArray(doc.norms)
    ? doc.norms.filter((n) => typeof n === "string" && n.trim() !== "")
    : [];

  if (atual.length > 0) {
    console.log(`  =  ${doc._id}  ${s.title}: já tem [${atual.join(", ")}] — preservado`);
    preservados++;
    continue;
  }

  console.log(`  +  ${doc._id}  ${s.title}: [${(s.norms ?? []).join(", ")}]`);

  // `ifRevisionId` fecha a janela entre o fetch acima e o commit abaixo: se
  // alguém preencher as normas pelo Studio nesse intervalo, o patch falha em
  // vez de apagar a edição — que é exatamente o que este script existe para
  // não fazer.
  tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set({ norms: s.norms ?? [] }));
  aplicar++;
}

/* ── RELATÓRIO E GRAVAÇÃO ───────────────────────────────────────────────────  */
function resumo() {
  const partes = [`${aplicar} a gravar`];
  if (preservados) partes.push(`${preservados} preservado(s)`);
  if (semPar) partes.push(`${semPar} sem par no CMS`);
  return partes.join(", ");
}

if (!write) {
  console.log(
    `\nSimulação: ${resumo()}.\n` +
      `Para gravar de verdade: node scripts/add-service-norms.mjs --write`
  );
  process.exit(semPar > 0 ? 1 : 0);
}

if (aplicar === 0) {
  console.log(`\nNada a fazer (${resumo()}).`);
  process.exit(semPar > 0 ? 1 : 0);
}

try {
  await tx.commit();
} catch (err) {
  // Conflito de revisão devolve 409: alguém mexeu no documento entre o fetch e
  // agora. A transação é atômica, então nada foi gravado e rodar de novo é
  // seguro — a releitura vai enxergar a edição da outra pessoa e preservá-la.
  if (err?.statusCode === 409) {
    console.error(
      "\nConflito: algum serviço foi editado no Studio depois da leitura.\n" +
        "Nada foi gravado. Rode de novo — a nova leitura preserva a edição."
    );
    process.exit(1);
  }
  console.error(`\nFalha ao gravar: ${err?.message ?? err}`);
  process.exit(1);
}

console.log(`\n${aplicar} serviço(s) atualizados (${resumo()}). A home revalida em até 1h.`);
process.exit(semPar > 0 ? 1 : 0);
