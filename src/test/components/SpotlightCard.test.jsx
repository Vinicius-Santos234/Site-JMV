import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import SpotlightCard from '@/components/SpotlightCard'

/* Por que este teste existe em vez de uma conferência no navegador:
   `requestAnimationFrame` não dispara em aba sem foco, e a aba da automação
   está sempre `hidden` — as custom properties nunca chegam a ser escritas lá,
   por mais que o efeito funcione para uma pessoa de verdade. Aqui a fila de
   frames é controlada, então dá para afirmar as duas coisas que importam:
   quantos frames 40 eventos agendam, e com que valor a escrita acontece.      */

function filaDeFrames() {
  const fila = []
  vi.stubGlobal('requestAnimationFrame', (cb) => fila.push(cb))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  return {
    get agendados() { return fila.length },
    rodar: () => fila.splice(0).forEach((cb) => cb(0)),
  }
}

// jsdom não implementa matchMedia. O componente trata ausência como "efeito
// ativo", então só precisa de stub nos testes que exercitam o desligamento.
function preferencias({ reduzMovimento = false, temHover = true }) {
  vi.stubGlobal('matchMedia', (q) => ({
    media: q,
    matches: q.includes('prefers-reduced-motion')
      ? reduzMovimento
      : q.includes('hover: hover')
        ? temHover
        : false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('SpotlightCard', () => {
  it('renderiza os filhos e mantém a classe recebida', () => {
    const { container } = render(
      <SpotlightCard className="service-card"><p>conteúdo</p></SpotlightCard>
    )
    const card = container.firstChild
    expect(card).toHaveClass('spotlight-card')
    expect(card).toHaveClass('service-card')
    expect(card).toHaveTextContent('conteúdo')
  })

  it('agrupa muitos mousemove em um único frame', () => {
    const frames = filaDeFrames()
    const { container } = render(<SpotlightCard><p>x</p></SpotlightCard>)
    const card = container.firstChild

    for (let i = 0; i < 40; i++) {
      fireEvent.mouseMove(card, { clientX: 100 + i, clientY: 200 + i })
    }

    // Sem a comporta seriam 40 leituras de geometria — que é o que força
    // layout — e 40 escritas. Com ela, uma de cada por frame.
    expect(frames.agendados).toBe(1)
  })

  it('escreve a posição do último evento recebido, não a do primeiro', () => {
    const frames = filaDeFrames()
    const { container } = render(<SpotlightCard><p>x</p></SpotlightCard>)
    const card = container.firstChild

    fireEvent.mouseMove(card, { clientX: 10, clientY: 20 })
    fireEvent.mouseMove(card, { clientX: 300, clientY: 400 })
    frames.rodar()

    // getBoundingClientRect em jsdom devolve zeros, então a posição relativa
    // ao card é o próprio clientX/clientY.
    expect(card.style.getPropertyValue('--spot-x')).toBe('300px')
    expect(card.style.getPropertyValue('--spot-y')).toBe('400px')
  })

  it('volta a agendar depois que o frame roda', () => {
    const frames = filaDeFrames()
    const { container } = render(<SpotlightCard><p>x</p></SpotlightCard>)
    const card = container.firstChild

    fireEvent.mouseMove(card, { clientX: 1, clientY: 1 })
    expect(frames.agendados).toBe(1)
    frames.rodar()

    // A comporta precisa reabrir, senão a luz congela no primeiro frame.
    fireEvent.mouseMove(card, { clientX: 2, clientY: 2 })
    expect(frames.agendados).toBe(1)
    frames.rodar()
    expect(card.style.getPropertyValue('--spot-x')).toBe('2px')
  })

  it('não faz trabalho nenhum com prefers-reduced-motion', () => {
    preferencias({ reduzMovimento: true })
    const frames = filaDeFrames()
    const { container } = render(<SpotlightCard><p>x</p></SpotlightCard>)
    const card = container.firstChild

    fireEvent.mouseMove(card, { clientX: 100, clientY: 200 })

    expect(frames.agendados).toBe(0)
    expect(card.style.getPropertyValue('--spot-x')).toBe('')
  })

  it('não faz trabalho nenhum onde não existe hover (celular)', () => {
    preferencias({ temHover: false })
    const frames = filaDeFrames()
    const { container } = render(<SpotlightCard><p>x</p></SpotlightCard>)
    const card = container.firstChild

    // Toque emite mousemove esparso; sem este guard o card acenderia num ponto
    // aleatório e ficaria aceso, porque nunca chega o "mouse saiu".
    fireEvent.mouseMove(card, { clientX: 100, clientY: 200 })

    expect(frames.agendados).toBe(0)
    expect(card.style.getPropertyValue('--spot-x')).toBe('')
  })

  it('cancela o frame pendente ao desmontar', () => {
    filaDeFrames()
    const { container, unmount } = render(<SpotlightCard><p>x</p></SpotlightCard>)

    fireEvent.mouseMove(container.firstChild, { clientX: 5, clientY: 5 })
    unmount()

    expect(cancelAnimationFrame).toHaveBeenCalled()
  })
})
