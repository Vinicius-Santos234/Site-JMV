import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FadeInSection from '@/components/FadeInSection'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

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
})
