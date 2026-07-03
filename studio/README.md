# JMV Studio — CMS de conteúdo (Sanity)

Este é o **painel de administração de conteúdo** do site da JMV. É por aqui que
os **projetos do portfólio** são adicionados, editados e removidos — **sem mexer
em código e sem precisar de um novo deploy do site**.

## Para que serve

O site (React/Vite) é "burro" quanto a conteúdo: ele não guarda a lista de
projetos. Essa lista vive no Sanity (este Studio) e o site a busca quando
carrega. Assim, quem cuida da empresa consegue manter o portfólio sozinho.

```
┌─────────────┐   publica    ┌──────────────┐   lê ao carregar   ┌──────────┐
│   Studio    │ ───────────► │   Sanity     │ ─────────────────► │   Site   │
│ (edição)    │              │  (dataset)   │   @sanity/client   │ portfólio│
└─────────────┘              └──────────────┘                    └──────────┘
```

> **Rede de segurança:** se o Sanity estiver indisponível ou vazio, o site cai
> automaticamente numa cópia local dos projetos (`src/data/portfolio-full.js`).
> O portfólio nunca fica em branco.

## Como editar o portfólio (uso do dia a dia)

1. Acesse **[jmv.sanity.studio](https://jmv.sanity.studio)**.
2. Faça login com a conta autorizada.
3. Abra **Projeto (Portfólio)** e clique em **+** para adicionar, ou em um item
   para editar.
4. Preencha os campos e **Publish**. Em segundos o site já reflete a mudança
   (sem novo deploy).

### Campos de um projeto

| Campo | O que é |
|-------|---------|
| **Título** | Nome do projeto (ex.: "Etanol 2G") |
| **Cliente** | Empresa cliente (ex.: "Raízen") |
| **Ano** | Ano de execução |
| **Categoria** | Tipo de serviço (lista fixa: montagem, estruturas, tubulações, caldeiraria, manutenção) |
| **Imagem** | Foto do projeto (o Sanity otimiza e serve via CDN) |
| **Ordem** | Menor número aparece primeiro no portfólio |

> Adicionar projetos reais aqui é o caminho para substituir os cards
> "Em breve" que ainda aparecem no site.

---

## Referência técnica

Informações para quem for mexer no código do CMS.

- **Projeto Sanity:** JMV Site — `projectId: b54yjbjl`, dataset `production`
  (público, somente leitura no site). O `projectId` não é secreto e está fixo em
  `sanity.config.js` / `sanity.cli.js`.
- **Schema:** `schemaTypes/project.js` define o tipo `project`; registrado em
  `schemaTypes/index.js`.
- **Leitura no site:** `src/lib/sanity.js` (client) + `src/hooks/useProjects.js`
  (query GROQ, com o fallback local).

### Rodar / publicar o Studio

```bash
cd studio
npm install       # primeira vez
npm run dev       # localhost:3333, para desenvolver o schema
npm run deploy    # publica a versão em https://jmv.sanity.studio
```

### Popular/atualizar via script

`scripts/seed-sanity.mjs` (na raiz do site) sobe imagens e cria os projetos em
lote, de forma idempotente. Requer um token **Editor** (criado em
`sanity.io/manage → API → Tokens`) na linha `SANITY_WRITE_TOKEN=...` do `.env`
ou `.env.local`. Uso alternativo à edição manual pelo Studio.

### Adicionar novas coleções ao CMS

Para trazer outras seções (`services`, `testimonials`, `faqs`…) para o Sanity:
crie um novo schema em `schemaTypes/`, registre em `schemaTypes/index.js` e
crie o hook de leitura correspondente no site (espelhando `useProjects`).
