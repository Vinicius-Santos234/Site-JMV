import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Services from '@/components/Services'
import { SERVICES } from '@/data/services'

vi.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

describe('Services', () => {
  it('renderiza a seção com id "servicos"', () => {
    const { container } = render(<Services services={SERVICES} />)
    expect(container.querySelector('#servicos')).toBeInTheDocument()
  })

  it('renderiza o título principal', () => {
    render(<Services services={SERVICES} />)
    expect(screen.getByText('SOLUÇÕES INDUSTRIAIS COMPLETAS')).toBeInTheDocument()
  })

  it('renderiza o subtítulo "Serviços"', () => {
    render(<Services services={SERVICES} />)
    expect(screen.getByText('Serviços')).toBeInTheDocument()
  })

  it('renderiza o título de cada serviço', () => {
    render(<Services services={SERVICES} />)
    SERVICES.forEach((service) => {
      expect(screen.getByText(service.title)).toBeInTheDocument()
    })
  })

  it('renderiza a descrição de cada serviço', () => {
    render(<Services services={SERVICES} />)
    SERVICES.forEach((service) => {
      expect(screen.getByText(service.description)).toBeInTheDocument()
    })
  })

  it('renderiza 6 cards de serviço', () => {
    const { container } = render(<Services services={SERVICES} />)
    expect(container.querySelectorAll('.service-card')).toHaveLength(6)
  })
})
