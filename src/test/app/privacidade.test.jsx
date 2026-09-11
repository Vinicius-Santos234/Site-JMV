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

  it('exibe as 10 seções da política', async () => {
    await renderPage()
    expect(screen.getByText(/2\. Quais dados coletamos/i)).toBeInTheDocument()
    expect(screen.getByText(/4\. Base legal/i)).toBeInTheDocument()
    expect(screen.getByText(/8\. Segurança/i)).toBeInTheDocument()
  })

  it('exibe menção à LGPD', async () => {
    await renderPage()
    expect(screen.getByText(/13\.709\/2018/)).toBeInTheDocument()
  })
})
