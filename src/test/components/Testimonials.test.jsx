import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Testimonials from '@/components/Testimonials'
import { TESTIMONIALS } from '@/data/testimonials'

vi.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

describe('Testimonials', () => {
  it('renderiza o título "O QUE NOSSOS CLIENTES DIZEM"', () => {
    render(<Testimonials />)
    expect(screen.getByText('O QUE NOSSOS CLIENTES DIZEM')).toBeInTheDocument()
  })

  it('renderiza o subtítulo "Depoimentos"', () => {
    render(<Testimonials />)
    expect(screen.getByText('Depoimentos')).toBeInTheDocument()
  })

  it('renderiza o nome de cada autor', () => {
    render(<Testimonials />)
    TESTIMONIALS.forEach((t) => {
      expect(screen.getByText(t.author)).toBeInTheDocument()
    })
  })

  it('renderiza o texto de cada depoimento', () => {
    render(<Testimonials />)
    TESTIMONIALS.forEach((t) => {
      expect(screen.getByText(t.quote)).toBeInTheDocument()
    })
  })

  it('renderiza cargo e empresa de cada autor', () => {
    render(<Testimonials />)
    TESTIMONIALS.forEach((t) => {
      expect(screen.getByText(`${t.role} · ${t.company}`)).toBeInTheDocument()
    })
  })

  it('renderiza 3 cards de depoimento', () => {
    const { container } = render(<Testimonials />)
    expect(container.querySelectorAll('.testimonial-card')).toHaveLength(3)
  })

  it('exibe a inicial do nome em cada avatar', () => {
    render(<Testimonials />)
    TESTIMONIALS.forEach((t) => {
      expect(screen.getByText(t.author.charAt(0))).toBeInTheDocument()
    })
  })
})
