import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import FadeInSection from '@/components/FadeInSection'

/**
 * Instala um IntersectionObserver de mentira e devolve o gatilho para simular
 * a entrada na tela. Sem isso o componente cai no caminho "ambiente não tem
 * IntersectionObserver" e nunca esconde nada — que é justamente o
 * comportamento verificado no primeiro teste.
 */
function instalarObserver() {
  const instancias = []
  class FakeIO {
    constructor(cb) {
      this.cb = cb
      this.disconnect = vi.fn()
      instancias.push(this)
    }
    observe() {}
  }
  vi.stubGlobal('IntersectionObserver', FakeIO)
  return {
    entrarNaTela: () =>
      act(() => instancias.forEach((i) => i.cb([{ isIntersecting: true }]))),
  }
}

function posicionarEm(topo) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top: topo, bottom: topo + 400, left: 0, right: 0, width: 0, height: 400,
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('FadeInSection', () => {
  it('renderiza os filhos corretamente', () => {
    render(
      <FadeInSection>
        <p>Conteúdo interno</p>
      </FadeInSection>
    )
    expect(screen.getByText('Conteúdo interno')).toBeInTheDocument()
  })

  it('renderiza múltiplos filhos', () => {
    render(
      <FadeInSection>
        <span>Filho 1</span>
        <span>Filho 2</span>
      </FadeInSection>
    )
    expect(screen.getByText('Filho 1')).toBeInTheDocument()
    expect(screen.getByText('Filho 2')).toBeInTheDocument()
  })

  it('aceita prop delay sem quebrar', () => {
    expect(() =>
      render(
        <FadeInSection delay={0.3}>
          <p>Texto</p>
        </FadeInSection>
      )
    ).not.toThrow()
  })

  // Este é o defeito que motivou a reescrita: a versão anterior entregava o
  // conteúdo com `opacity: 0` já no HTML do servidor, e ele só aparecia depois
  // de hidratar. O padrão tem de ser visível.
  it('começa visível, sem depender de JavaScript nenhum ter rodado', () => {
    const { container } = render(
      <FadeInSection>
        <p>Conteúdo interno</p>
      </FadeInSection>
    )
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('fade-in--visivel')
    expect(wrapper).not.toHaveClass('fade-in--oculto')
    expect(wrapper.getAttribute('style')).toBeNull()
  })

  it('não esconde um bloco que já está na tela', () => {
    instalarObserver()
    posicionarEm(100) // acima da dobra (innerHeight do jsdom é 768)

    const { container } = render(
      <FadeInSection>
        <p>Já visível</p>
      </FadeInSection>
    )
    expect(container.firstChild).toHaveClass('fade-in--visivel')
  })

  it('esconde o bloco abaixo da dobra e revela quando ele entra na tela', () => {
    const { entrarNaTela } = instalarObserver()
    posicionarEm(3000)

    const { container } = render(
      <FadeInSection>
        <p>Lá embaixo</p>
      </FadeInSection>
    )
    expect(container.firstChild).toHaveClass('fade-in--oculto')

    entrarNaTela()
    expect(container.firstChild).toHaveClass('fade-in--revelado')
  })

  it('não esconde nada quando o visitante pediu menos movimento', () => {
    instalarObserver()
    posicionarEm(3000)
    // jsdom nao implementa matchMedia — por isso o componente chama com `?.`
    vi.stubGlobal('matchMedia', () => ({ matches: true }))

    const { container } = render(
      <FadeInSection>
        <p>Sem movimento</p>
      </FadeInSection>
    )
    expect(container.firstChild).toHaveClass('fade-in--visivel')
  })
})
