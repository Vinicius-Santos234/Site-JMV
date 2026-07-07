import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PortfolioPage from '@/pages/PortfolioPage'

vi.mock('framer-motion', () => ({
  m: { div: ({ children, ...p }) => <div {...p}>{children}</div> },
}))

vi.mock('@/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [
      { id: 1, placeholder: false, category: 'Caldeiraria', image: '/a.jpg', title: 'Projeto Alpha', client: 'Cliente A', year: 2023 },
      { id: 2, placeholder: false, category: 'Montagem',   image: '/b.jpg', title: 'Projeto Beta',  client: 'Cliente B', year: 2022 },
      { id: 3, placeholder: true,  category: 'Em breve' },
    ],
    loading: false,
    error: null,
  }),
}))

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe = vi.fn()
    disconnect = vi.fn()
  })
})

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/portfolio']}>
      <PortfolioPage />
    </MemoryRouter>
  )
}

describe('PortfolioPage', () => {
  it('exibe o título "PROJETOS"', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'PROJETOS' })).toBeInTheDocument()
  })

  it('renderiza os filtros de categoria', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Caldeiraria' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Montagem' })).toBeInTheDocument()
  })

  it('filtro "Todos" não exibe placeholders', () => {
    renderPage()
    expect(screen.queryByText('Em breve')).not.toBeInTheDocument()
  })

  it('exibe projetos reais no filtro "Todos"', () => {
    renderPage()
    expect(screen.getByText('Projeto Alpha')).toBeInTheDocument()
    expect(screen.getByText('Projeto Beta')).toBeInTheDocument()
  })

  it('filtro por categoria exibe apenas projetos daquela categoria', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: 'Caldeiraria' }))
    expect(screen.getByText('Projeto Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Projeto Beta')).not.toBeInTheDocument()
  })

  it('exibe link para voltar ao site', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /voltar ao site/i })).toBeInTheDocument()
  })
})
