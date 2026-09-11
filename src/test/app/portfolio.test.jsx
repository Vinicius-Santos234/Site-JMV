import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import PortfolioPage from '@/app/portfolio/page'

vi.mock('framer-motion', () => ({
  m: { div: ({ children, ...p }) => <div {...p}>{children}</div> },
}))

// A página é Server Component async e busca o conteúdo. Mockar mantém o teste
// sem rede e sem depender do "server-only".
vi.mock('@/lib/content', () => ({
  getContent: async () => ({
    projects: [
      { id: 1, placeholder: false, category: 'Caldeiraria', image: '/a.jpg', title: 'Projeto Alpha', client: 'Cliente A', year: 2023 },
      { id: 2, placeholder: true, category: 'Em breve' },
    ],
    cnpj: '00.000.000/0001-00',
  }),
}))

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe = vi.fn()
    disconnect = vi.fn()
  })
})

const renderPage = async () => render(await PortfolioPage())

describe('/portfolio — página', () => {
  it('exibe o título "PROJETOS"', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { name: 'PROJETOS' })).toBeInTheDocument()
  })

  it('exibe link para voltar ao site', async () => {
    await renderPage()
    expect(screen.getByRole('link', { name: /voltar ao site/i })).toBeInTheDocument()
  })

  it('renderiza os projetos vindos do conteúdo', async () => {
    await renderPage()
    expect(screen.getByText('Projeto Alpha')).toBeInTheDocument()
  })

  // O motivo da migração, travado por teste: a rota declara metadata própria.
  it('declara metadata própria, com canonical de /portfolio', async () => {
    const { metadata } = await import('@/app/portfolio/page')
    expect(metadata.title).toMatch(/Portfólio/i)
    expect(metadata.alternates.canonical).toBe('/portfolio')
    expect(metadata.openGraph.url).toBe('/portfolio')
  })
})
