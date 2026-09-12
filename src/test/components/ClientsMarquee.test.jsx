import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClientsMarquee from '@/components/ClientsMarquee'

const CLIENTES = [
  { id: 1, name: 'Raízen', logo: '/raizen.webp' },
  { id: 2, name: 'Bunge', logo: '/bunge.webp' },
  { id: 3, name: 'Petrobras', logo: '/petrobras.webp' },
]

describe('ClientsMarquee', () => {
  it('renderiza um logo nomeado por cliente', () => {
    render(<ClientsMarquee clients={CLIENTES} />)
    CLIENTES.forEach((c) => {
      expect(screen.getByAltText(`Logo ${c.name}`)).toBeInTheDocument()
    })
  })

  it('duplica a lista no DOM para a emenda da esteira fechar', () => {
    const { container } = render(<ClientsMarquee clients={CLIENTES} />)
    // 2N no DOM...
    expect(container.querySelectorAll('.client-card')).toHaveLength(CLIENTES.length * 2)
    // ...mas N clones, que é o que a animação de -50% assume.
    expect(
      container.querySelectorAll('.client-card[data-marquee-clone="true"]')
    ).toHaveLength(CLIENTES.length)
  })

  it('esconde os clones do leitor de tela', () => {
    render(<ClientsMarquee clients={CLIENTES} />)
    // Se os clones vazassem, cada cliente seria anunciado duas vezes.
    CLIENTES.forEach((c) => {
      expect(screen.getAllByAltText(`Logo ${c.name}`)).toHaveLength(1)
    })
  })

  /* ── WCAG 2.2.2 ──────────────────────────────────────────────────────────
     Movimento automático com mais de 5s precisa de um mecanismo de pausa que
     não dependa de hover. Estes três testes existem para que remover o botão
     quebre a suíte, e não só a acessibilidade — hover e `animation-play-state`
     não são observáveis em jsdom, então o botão é a única parte do mecanismo
     que dá para afirmar aqui.                                                */

  it('oferece um controle de pausa alcançável por teclado', async () => {
    render(<ClientsMarquee clients={CLIENTES} />)

    const botao = screen.getByRole('button', { name: /pausar rolagem/i })
    expect(botao).toHaveAttribute('type', 'button')

    await userEvent.tab()
    expect(botao).toHaveFocus()
  })

  it('alterna entre pausar e retomar, refletindo em aria-pressed', async () => {
    render(<ClientsMarquee clients={CLIENTES} />)

    const botao = screen.getByRole('button', { name: /pausar rolagem/i })
    expect(botao).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(botao)
    expect(screen.getByRole('button', { name: /retomar rolagem/i }))
      .toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(screen.getByRole('button', { name: /retomar rolagem/i }))
    expect(screen.getByRole('button', { name: /pausar rolagem/i }))
      .toHaveAttribute('aria-pressed', 'false')
  })

  it('marca a esteira como pausada e mantém o controle fora dela', async () => {
    const { container } = render(<ClientsMarquee clients={CLIENTES} />)
    const marquee = container.querySelector('.clients-marquee')

    expect(marquee).not.toHaveClass('clients-marquee--pausado')

    await userEvent.click(screen.getByRole('button', { name: /pausar rolagem/i }))
    expect(marquee).toHaveClass('clients-marquee--pausado')

    // O botão precisa ficar FORA de .clients-marquee: dentro, o :hover do CSS
    // pausaria ao aproximar o cursor e "retomar" não retomaria nada enquanto o
    // mouse não saísse.
    expect(within(marquee).queryByRole('button')).toBeNull()
  })
})
