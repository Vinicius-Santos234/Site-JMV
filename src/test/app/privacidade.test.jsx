import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import PrivacidadePage from '@/app/privacidade/page'

vi.mock('framer-motion', () => ({
  m: { div: ({ children, ...p }) => <div {...p}>{children}</div> },
}))

// A página virou Server Component async e busca o CNPJ. O conteúdo é mockado
// para o teste não depender de rede nem do "server-only".
vi.mock('@/lib/content', () => ({
  getContent: async () => ({ cnpj: '00.000.000/0001-00' }),
}))

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe = vi.fn()
    disconnect = vi.fn()
  })
})

async function renderPage() {
  return render(await PrivacidadePage())
}

describe('PrivacidadePage', () => {
  it('exibe o título "POLÍTICA DE PRIVACIDADE"', async () => {
    await renderPage()
    expect(screen.getByText('POLÍTICA DE PRIVACIDADE')).toBeInTheDocument()
  })

  it('exibe link para voltar ao site', async () => {
    await renderPage()
    expect(screen.getByRole('link', { name: /voltar ao site/i })).toBeInTheDocument()
  })

  it('exibe a seção "Quem somos"', async () => {
    await renderPage()
    expect(screen.getByText(/1\. Quem somos/i)).toBeInTheDocument()
  })

  // Afirmar sobre o NUMERO da secao quebra toda vez que a politica ganha um
  // item no meio — foi o que aconteceu ao incluir operadores e transferencia
  // internacional. O que importa e o assunto estar la, nao a posicao dele.
  it('exibe as seções obrigatórias da política', async () => {
    await renderPage()
    for (const assunto of [
      /Quais dados coletamos/i,
      /Com quem seus dados são compartilhados/i,
      /Transferência internacional/i,
      /Base legal/i,
      /Cookies/i,
      /Seus direitos/i,
      /Retenção de dados/i,
      /Segurança/i,
    ]) {
      expect(screen.getByRole('heading', { name: assunto })).toBeInTheDocument()
    }
  })

  // Os operadores que de fato recebem dados precisam estar nomeados: foi a
  // lacuna encontrada na revisao de 11/09 (Resend e Cloudflare tratavam dados
  // sem constar na politica).
  it('nomeia os operadores que recebem dados', async () => {
    await renderPage()
    for (const operador of ['Vercel', 'Resend', 'Cloudflare', 'Google']) {
      expect(screen.getAllByText(new RegExp(operador)).length).toBeGreaterThan(0)
    }
  })

  it('oferece revogação de consentimento com um clique', async () => {
    await renderPage()
    expect(
      screen.getByRole('button', { name: /revogar meu consentimento/i })
    ).toBeInTheDocument()
  })

  it('exibe menção à LGPD', async () => {
    await renderPage()
    expect(screen.getByText(/13\.709\/2018/)).toBeInTheDocument()
  })
})
