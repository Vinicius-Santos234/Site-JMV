import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FAQ from '@/components/FAQ'
import { FAQS } from '@/data/faqs'

vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...p }) => <div {...p}>{children}</div> },
}))

describe('FAQ — renderização', () => {
  it('renderiza todas as perguntas', () => {
    render(<FAQ />)
    FAQS.forEach((faq) => {
      expect(screen.getByText(faq.q)).toBeInTheDocument()
    })
  })

  it('nenhum item está aberto inicialmente', () => {
    render(<FAQ />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('aria-expanded', 'false')
    })
  })
})

describe('FAQ — accordion', () => {
  it('abre um item ao clicar na pergunta', async () => {
    render(<FAQ />)
    const firstButton = screen.getAllByRole('button')[0]
    await userEvent.click(firstButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('fecha o item ao clicar novamente', async () => {
    render(<FAQ />)
    const firstButton = screen.getAllByRole('button')[0]
    await userEvent.click(firstButton)
    await userEvent.click(firstButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('exibe a resposta quando o item está aberto', async () => {
    render(<FAQ />)
    await userEvent.click(screen.getAllByRole('button')[0])
    expect(screen.getByText(FAQS[0].a)).toBeInTheDocument()
  })

  it('abrir um item fecha o anterior', async () => {
    render(<FAQ />)
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(buttons[1])
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true')
  })
})
