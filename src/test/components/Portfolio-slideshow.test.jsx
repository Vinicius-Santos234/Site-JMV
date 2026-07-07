import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Portfolio from '@/components/Portfolio'

vi.mock('framer-motion', () => ({
  m: { div: ({ children, ...p }) => <div {...p}>{children}</div> },
}))

vi.mock('@/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [
      { id: 1, placeholder: false, category: 'Caldeiraria', image: '/a.jpg', title: 'Projeto Alpha', client: 'Cliente A', year: 2023 },
      { id: 2, placeholder: false, category: 'Montagem',   image: '/b.jpg', title: 'Projeto Beta',  client: 'Cliente B', year: 2022 },
      { id: 3, placeholder: false, category: 'Estruturas', image: '/c.jpg', title: 'Projeto Gamma', client: 'Cliente C', year: 2021 },
      { id: 4, placeholder: true,  category: 'Em breve' },
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

function renderSlideshow() {
  return render(
    <MemoryRouter>
      <Portfolio />
    </MemoryRouter>
  )
}

describe('Portfolio — slideshow', () => {
  it('exibe o primeiro projeto inicialmente', () => {
    renderSlideshow()
    expect(screen.getByRole('status')).toHaveTextContent('Projeto 1 de 3')
  })

  it('avança para o próximo projeto ao clicar em "Próximo"', async () => {
    renderSlideshow()
    await userEvent.click(screen.getByRole('button', { name: /próximo projeto/i }))
    expect(screen.getByRole('status')).toHaveTextContent('Projeto 2 de 3')
  })

  it('volta ao projeto anterior ao clicar em "Anterior"', async () => {
    renderSlideshow()
    await userEvent.click(screen.getByRole('button', { name: /próximo projeto/i }))
    await userEvent.click(screen.getByRole('button', { name: /projeto anterior/i }))
    expect(screen.getByRole('status')).toHaveTextContent('Projeto 1 de 3')
  })

  it('vai para o último projeto ao clicar em "Anterior" no primeiro', async () => {
    renderSlideshow()
    await userEvent.click(screen.getByRole('button', { name: /projeto anterior/i }))
    expect(screen.getByRole('status')).toHaveTextContent('Projeto 3 de 3')
  })

  it('volta ao primeiro ao clicar em "Próximo" no último', async () => {
    renderSlideshow()
    for (let i = 0; i < 3; i++) {
      await userEvent.click(screen.getByRole('button', { name: /próximo projeto/i }))
    }
    expect(screen.getByRole('status')).toHaveTextContent('Projeto 1 de 3')
  })

  it('renderiza os dots de navegação para cada projeto real', () => {
    renderSlideshow()
    const dots = screen.getAllByRole('button', { name: /ir para projeto/i })
    expect(dots).toHaveLength(3)
  })

  it('navega ao clicar em um dot específico', async () => {
    renderSlideshow()
    await userEvent.click(screen.getByRole('button', { name: 'Ir para projeto 3' }))
    expect(screen.getByRole('status')).toHaveTextContent('Projeto 3 de 3')
  })

  it('não exibe projetos placeholder nos dots', () => {
    renderSlideshow()
    const dots = screen.getAllByRole('button', { name: /ir para projeto/i })
    expect(dots).toHaveLength(3) // 3 reais, 1 placeholder ignorado
  })
})
