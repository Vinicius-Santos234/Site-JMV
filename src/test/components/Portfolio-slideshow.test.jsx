import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Portfolio from '@/components/Portfolio'

const PROJETOS = [
  { id: 1, placeholder: false, category: 'Caldeiraria', image: '/a.jpg', title: 'Projeto Alpha', client: 'Cliente A', year: 2023 },
  { id: 2, placeholder: false, category: 'Montagem',   image: '/b.jpg', title: 'Projeto Beta',  client: 'Cliente B', year: 2022 },
  { id: 3, placeholder: false, category: 'Estruturas', image: '/c.jpg', title: 'Projeto Gamma', client: 'Cliente C', year: 2021 },
  { id: 4, placeholder: true,  category: 'Em breve' },
]

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe = vi.fn()
    disconnect = vi.fn()
  })
})

function renderSlideshow() {
  return render(
    <Portfolio projects={PROJETOS} />
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

/**
 * Achado da revisão cruzada do Codex (13/09/2026).
 *
 * O timer que limpa `dir` vivia num efeito com dependência `[dir]`. Duas trocas
 * seguidas na MESMA direção gravam o mesmo valor — React descarta a atualização
 * idêntica, o efeito não re-roda, e o timer da primeira troca continua correndo:
 * ele limpa `dir` no meio da animação da segunda, que salta para o repouso.
 *
 * Só aparece com duas trocas na mesma direção dentro de 400ms, e nenhuma
 * asserção de texto pega — por isso o teste olha a classe de animação.
 */
describe('Portfolio — a animação não pode ser cortada por timer antigo', () => {
  it('mantém a classe de entrada pelos 400ms do SEGUNDO avanço', () => {
    vi.useFakeTimers()
    const { container } = render(<Portfolio projects={PROJETOS} />)

    const proximo = screen.getByRole('button', { name: /próximo projeto/i })

    // fireEvent e não userEvent: userEvent agenda no relógio real e trava sob
    // fake timers, que é exatamente o relógio que este teste precisa controlar.
    act(() => { fireEvent.click(proximo) })
    act(() => { vi.advanceTimersByTime(300) })

    act(() => { fireEvent.click(proximo) })
    // 150ms depois do segundo clique: a animação dele tem 400ms, então ainda
    // deve estar correndo. É aqui que o timer órfão do primeiro clique batia.
    act(() => { vi.advanceTimersByTime(150) })

    expect(container.querySelector('.slideshow-card--ativo'))
      .toHaveClass('slideshow-card--entra-right')

    // e some sozinha quando os 400ms dela realmente terminam
    act(() => { vi.advanceTimersByTime(300) })
    expect(container.querySelector('.slideshow-card--ativo'))
      .not.toHaveClass('slideshow-card--entra-right')

    vi.useRealTimers()
  })
})
