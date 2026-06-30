# JMV Engenharia e Construções — Site Institucional

Site institucional da **JMV Engenharia e Construções**, empresa especializada em montagem industrial, caldeiraria, estruturas metálicas, manutenção industrial e soluções para o setor sucroenergético e petroquímico.

🌐 **[site-jmv.vercel.app](https://site-jmv.vercel.app)**

---

## Stack

| Camada | Tecnologia |
|---|---|
| UI | React 19 + Vite 8 |
| Roteamento | React Router DOM 7 |
| Animações | Framer Motion 12 |
| Ícones | Lucide React |
| Testes | Vitest 4 + Testing Library |
| Linting | ESLint 10 |
| Deploy | Vercel |
| E-mail | Resend (Vercel Serverless Function) |
| Analytics | Vercel Analytics + Speed Insights |

---

## Funcionalidades

- Landing page responsiva (mobile, tablet, desktop)
- Hero com animações de entrada
- Apresentação institucional e diferenciais
- Seção de serviços com cards
- Slideshow de portfólio de projetos
- Página de portfólio completo com filtro por categoria
- Carrossel de clientes parceiros
- Políticas de qualidade
- FAQ com accordion
- Formulário de contato com validação e envio por API
- Banner de consentimento de cookies (LGPD)
- Botão flutuante do WhatsApp
- Botão de voltar ao topo
- Animações ao rolar a página (FadeInSection)
- SEO: meta tags, Open Graph, Twitter Card, JSON-LD
- Página 404 personalizada
- Política de Privacidade

---

## Estrutura do Projeto

```
jmv-site/
├── api/
│   └── contact.js           # Serverless Function — envio de e-mail via Resend
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   └── optimize-images.js   # Script de otimização de imagens com Sharp
├── src/
│   ├── assets/              # Imagens e logos (WebP)
│   ├── components/          # Componentes React
│   ├── data/                # Dados estáticos dos componentes
│   ├── hooks/               # Hooks customizados (useSEO, usePageTracking, useCountUp)
│   ├── pages/               # Páginas (PortfolioPage, PrivacidadePage, NotFoundPage)
│   ├── styles/              # CSS global
│   ├── test/                # Testes (Vitest + Testing Library)
│   └── utils/               # Utilitários (scrollToSection, genId)
├── .env.example             # Variáveis de ambiente necessárias
├── .github/workflows/ci.yml # Pipeline de CI
├── vercel.json              # Configuração de deploy
└── vite.config.js
```

---

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com base no `.env.example`:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX   # Google Analytics (opcional)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx # Necessário para o formulário de contato
```

---

## Instalação e Execução

**Pré-requisitos:** Node.js 22+

```bash
# Clonar o repositório
git clone https://github.com/Vinicius-Santos234/Site-JMV.git
cd Site-JMV

# Instalar dependências
npm install

# Criar arquivo de variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves

# Iniciar servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173`.

---

## Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build local
npm run lint         # Verificação de lint
npm run test         # Testes em modo watch
npm run test:run     # Testes em modo CI (sem watch)
npm run test:coverage # Relatório de cobertura
```

---

## Testes

O projeto conta com **94 testes** distribuídos em 18 arquivos, cobrindo componentes, hooks, páginas e utilitários.

```bash
npm run test:run
```

Áreas cobertas:

- Componentes: `Contact`, `CookieBanner`, `FAQ`, `FadeInSection`, `FloatingButtons`, `Portfolio`, `Quality`, `Services`, `Stats`, `Testimonials`
- Hooks: `useSEO`, `usePageTracking`, `useCountUp`
- Páginas: `NotFoundPage`, `PortfolioPage`, `PrivacidadePage`
- Dados: `services`, `stats`

---

## CI/CD

O pipeline roda automaticamente no GitHub Actions a cada push ou Pull Request para `main`:

1. **Lint** — ESLint
2. **Testes** — Vitest
3. **Build** — Vite

O deploy em produção é feito automaticamente pela Vercel após o merge na branch `main`.

---

## Contato

**JMV Engenharia e Construções**
(16) 99741-8402 · jpsantos@jmv.ind.br
Matão — SP

---

## Autor

Desenvolvido por **Vinicius Santos**.

O código-fonte está disponível sob a licença [MIT](./LICENSE). A identidade visual, conteúdo e imagens são de propriedade da JMV Engenharia e Construções.
