# JMV Studio — CMS de conteúdo (Sanity)

Studio do Sanity que gerencia o **portfólio** do site JMV. O site (React/Vite)
lê o conteúdo publicado aqui via `@sanity/client`.

> Se o dataset estiver vazio, o site cai automaticamente nos dados locais de
> `src/data/portfolio-full.js` (fallback).

## Estado atual (já configurado)

- ✅ Projeto Sanity **JMV Site** — `projectId: b54yjbjl`
- ✅ Dataset `production` criado (público)
- ✅ `projectId` fixado em `sanity.config.js` e `sanity.cli.js` (não é secreto)
- ✅ 4 projetos reais populados (via `scripts/seed-sanity.mjs`)
- ✅ `.env` do site aponta para o Sanity (`VITE_SANITY_PROJECT_ID` / `VITE_SANITY_DATASET`)

## O que falta

### 1. Publicar o Studio (para edição sem código)

```bash
cd studio
npm install   # se ainda não instalou
npm run deploy
```

Escolha um hostname (ex.: `jmv`) → o painel fica em `https://jmv.sanity.studio`.

### 2. Produção na Vercel

Garanta que estas variáveis estão no projeto da Vercel (Project Settings →
Environment Variables) e **refaça o deploy** para elas valerem:

```
VITE_SANITY_PROJECT_ID=b54yjbjl
VITE_SANITY_DATASET=production
```

> Não coloque o `SANITY_WRITE_TOKEN` na Vercel — o site só faz leitura.

## Re-popular / atualizar os projetos (opcional)

O script `scripts/seed-sanity.mjs` (na raiz do site) sobe as imagens e cria os
projetos. É idempotente. Precisa de um token **Editor** (criado em
`sanity.io/manage → API → Tokens`) na linha `SANITY_WRITE_TOKEN=...` do `.env`:

```
node scripts/seed-sanity.mjs
```

## Migrações futuras

Para migrar as próximas coleções (`services`, `testimonials`, `faqs`…), crie um
novo schema em `schemaTypes/` e registre-o em `schemaTypes/index.js`.
