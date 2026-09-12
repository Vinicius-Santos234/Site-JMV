# JMV Soluções Industriais — site institucional

Site institucional em **Next.js 16 (App Router)**, hospedado na Vercel, com
conteúdo editável pelo cliente via **Sanity**. O `README.md` conta a história do
projeto e as decisões; este arquivo é operacional — o que você precisa saber
para mexer aqui sem quebrar nada.

## Comandos

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção (gera as 3 rotas estáticas)
npm run lint         # eslint
npm run test:run     # vitest, uma passada
npm run test:coverage
```

Antes de dar qualquer coisa por pronta: `npm run lint && npm run test:run && npm run build`.
Os três precisam passar — e leia a seção **O que o build local não prova**, porque
passar nos três já foi insuficiente aqui mais de uma vez.

## Arquitetura em uma página

- `src/app/` — App Router. `page.jsx` é a home e faz **uma** busca no servidor
  (`getContent()`) que alimenta a página inteira. `revalidate = 3600`.
- `src/components/` — um `.jsx` e um `.css` por componente, co-localizados.
- `src/data/` — **fallback local**, não fonte de verdade. Ver abaixo.
- `src/lib/content.js` — a busca única no Sanity, com fallback e guarda de erro.
- `src/proxy.js` — middleware (headers de segurança, CSP, bloqueio de scanner).
- `studio/` — schemas do Sanity Studio.
- `scripts/` — seed e patches do CMS.

### 🔴 `src/data/` é o plano B, não a fonte

`getContent()` busca no Sanity e cai em `src/data/*` **apenas** se a busca
falhar ou vier vazia. Com o CMS configurado e respondendo — que é o caso em
produção e no dev local — o fallback nunca roda.

Consequência prática, que já custou tempo: **acrescentar um campo em
`src/data/` não faz ele aparecer na tela.** Ele também precisa existir nos
documentos do CMS.

Ao adicionar um campo novo a um tipo que vem do CMS, são quatro lugares:

1. `studio/schemaTypes/<tipo>.js` — o campo no Studio
2. `src/lib/content.js` — na query GROQ **e** no `transform`, com valor padrão
3. `src/data/<tipo>.js` — o fallback
4. **os documentos existentes no CMS** — via script de patch (ver abaixo)

Esquecer o item 4 produz uma tela sem erro nenhum e sem o campo.

### Escrever no CMS

- `scripts/seed-sanity.mjs` usa `createOrReplace` — **destrutivo**. Substitui o
  documento inteiro e apaga o que o cliente editou no Studio. Só para popular
  do zero.
- `scripts/add-service-norms.mjs` é o modelo para mudanças pontuais:
  `patch().set()` num campo só, pareando por título com detecção de ambiguidade,
  excluindo rascunhos (`!(_id in path("drafts.**"))`) e com
  `ifRevisionId(_rev)` contra edição concorrente. Roda em simulação por padrão;
  `--write` grava.

Copie esse padrão para qualquer script novo que escreva no CMS. Os três detalhes
não são zelo: sem o filtro de rascunho o patch pode acertar uma versão que
ninguém vê; sem `ifRevisionId` ele apaga a edição de quem mexeu no Studio no
intervalo entre a leitura e a gravação.

## CSS — as armadilhas já pagas

CSS é escrito à mão, sem framework, um arquivo por componente. `Services.css`
carrega a base de card **compartilhada com Qualidade** (`.service-card`,
`.service-icon`, `.spotlight-card`, `.card-crosshairs`), por isso `Quality.jsx`
também o importa. Mexer lá afeta as duas seções.

Três defeitos reais deste projeto, todos de cascata, todos invisíveis a teste:

1. **Empate de especificidade resolvido por ordem.** Um
   `@media (max-width: 768px) { .nav-links { display: none } }` redundante vinha
   *depois* de `.nav-links--open { display: flex }`. As duas valem `(0,1,0)`;
   media query **não** adiciona especificidade. O menu mobile ficou quebrado dois
   meses. Há um comentário de aviso em `Navbar.css` — não remova.
2. **Atalho apaga longhand.** `border-color` num `:hover` regrava os quatro
   lados, inclusive os `transparent` que formavam o "L" das cantoneiras. Regra de
   estado que muda **um aspecto** de propriedade composta deve mexer numa
   *custom property*, nunca no atalho.
3. **Camada translúcida sobre texto derruba contraste.** O spotlight dos cards
   é um `::after` com `inset: 0`, e pseudo-elemento posicionado pinta **depois**
   do conteúdo em fluxo. Cobrindo o texto, levava os chips de 4,70:1 para 3,61:1.
   Por isso `.spotlight-card > *` tem `position: relative; z-index: 1`.

> Ao mexer em qualquer hover de card, recalcule o contraste. O mínimo é
> **4,5:1** (WCAG AA), e a queda só existe enquanto o cursor está lá — some
> exatamente quando você tenta conferir parado.

## Animação e acessibilidade

`src/styles/base.css` tem a regra global de `prefers-reduced-motion`:
`animation-duration: 0.01ms` + `animation-iteration-count: 1`.

**Ela não para a animação — roda o ciclo inteiro num instante e congela no
último keyframe.** Para entrada (`fadeIn`) isso é perfeito, porque o fim é o
repouso. Para qualquer animação cujo último keyframe **não** seja um estado de
repouso válido, é desastre.

> Teste antes de adicionar animação: **congele no último keyframe. A tela está
> correta?** Se não, ela precisa do próprio bloco `@media (prefers-reduced-motion: reduce)`.

Reprovam no teste e já precisaram de bloco próprio: a esteira de clientes
(`Clients.css`, termina em `translateX(-50%)`, metade dos logos fora da tela).
Reprovariam também carrosséis e todo `alternate` infinito.

Outras regras que valem para elementos novos:

- **Movimento automático com mais de 5s precisa de controle de pausa**
  (WCAG 2.2.2) alcançável por teclado e toque. `:hover` não conta — não existe
  em celular nem para quem navega por Tab. Modelo:
  `ClientsMarquee.jsx` + `.clients-marquee-toggle`.
- Decoração fica fora da árvore de acessibilidade: `aria-hidden="true"` e
  `alt=""`. Vale para numeração `01 //`, cantoneiras, clones da esteira e a
  barra de progresso da navbar.
- Controle que recebe foco precisa de `:focus-visible` visível.

## Performance — onde o JS não pode entrar

O Hero é o elemento de **LCP**. Duas regras que vieram de perda medida:

- **Nada de animação de entrada no Hero.** Ele fica fora do `FadeInSection` de
  propósito; `whileInView` começa em `opacity: 0` e só revela depois de hidratar
  — chegou a esconder a imagem do LCP por ~2,8s. O comentário no topo de
  `Hero.jsx` explica; não o remova.
- **Evento que dispara por frame não toca em estado do React.** `mousemove` e
  `scroll` escrevem direto no `style` do nó, por ref:
  - `SpotlightCard.jsx` — duas CSS vars, sem estado
  - `Navbar.jsx` — `scaleX` por ref, com `requestAnimationFrame` como comporta,
    porque ler `scrollHeight` força layout
  - prefira `transform`/`opacity` a `width`/`top`: composição, não re-medição

## O que o build local **não** prova

Lição de 11/09/2026, quando `lint` + `test` + `build` passaram e cinco defeitos
apareceram depois do merge. Os três rodam **com o seu `.env.local` no lugar** e
**sem olhar a configuração do host**. Eles provam que compila no seu ambiente.

Não são cobertos por nenhum dos três:

| Ambiente | O que só quebra lá |
|---|---|
| CI | build **sem segredo** — módulo de rota é avaliado no build, não na requisição |
| Painel da Vercel | configuração que não mora no repositório (Framework Preset, env, firewall) |
| `next dev` | o otimizador de imagem passa pelo `proxy.js`, a Vercel otimiza na borda |
| Navegador real | media query (jsdom não aplica), hover, foco, e o **celular** |

Teste em aparelho real já achou aqui o que migração, revisão cruzada, auditoria
e três rodadas de Lighthouse não pegaram.

## Convenções

- **Português brasileiro** em texto de interface, comentários e mensagens de
  commit. Identificadores de código em inglês quando for a convenção do
  ecossistema (`useState`, `className`), em português quando for domínio.
- Comentário explica **por que**, não o quê. Vários comentários deste repositório
  registram defeito já pago — se um parecer óbvio, leia antes de apagar.
- Componente é server component por padrão. `"use client"` só quando precisa de
  estado, efeito ou evento — e então isole o mínimo possível num componente
  próprio (ver `Clients.jsx` → `ClientsMarquee.jsx`).
- Segredo nunca no repositório. `.env.local` local, painel da Vercel em produção.
- **Degradação graciosa é boa para feature e péssima para defesa.** Já aconteceu
  três vezes aqui: rate limiting, CAPTCHA e envio de e-mail se desligando em
  silêncio. Recurso que degrada some da tela e alguém percebe; defesa que degrada
  continua respondendo `200`.

## Variáveis de ambiente

`SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_WRITE_TOKEN` (só para scripts),
`RESEND_API_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`,
`NEXT_PUBLIC_GA_MEASUREMENT_ID`. Ver `.env.example`.

Sem `SANITY_PROJECT_ID` o site usa o fallback de `src/data/` — o que é útil para
desenvolver offline, e é exatamente o que torna o item 4 da lista de campo novo
fácil de esquecer.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
