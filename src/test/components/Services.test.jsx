import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Services from '@/components/Services'
import { SERVICES } from '@/data/services'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

describe('Services', () => {
  it('renderiza a seção com id "servicos"', () => {
    const { container } = render(<Services />)
    expect(container.querySelector('#servicos')).toBeInTheDocument()
  })

  it('renderiza o título principal', () => {
    render(<Services />)
    expect(screen.getByText('SOLUÇÕES INDUSTRIAIS COMPLETAS')).toBeInTheDocument()
  })

  it('renderiza o subtítulo "Serviços"', () => {
    render(<Services />)
    expect(screen.getByText('Serviços')).toBeInTheDocument()
  })

  it('renderiza o título de cada serviço', () => {
    render(<Services />)
    SERVICES.forEach((service) => {
      expect(screen.getByText(service.title)).toBeInTheDocument()
    })
  })

  it('renderiza a descrição de cada serviço', () => {
    render(<Services />)
    SERVICES.forEach((service) => {
      expect(screen.getByText(service.description)).toBeInTheDocument()
    })
  })

  it('renderiza 6 cards de serviço', () => {
    const { container } = render(<Services />)
    expect(container.querySelectorAll('.service-card')).toHaveLength(6)
  })
})
