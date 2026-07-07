import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Quality from '@/components/Quality'
import { QUALITY_ITEMS } from '@/data/quality'

vi.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

describe('Quality', () => {
  it('renderiza o título "COMPROMISSO COM QUALIDADE"', () => {
    render(<Quality />)
    expect(screen.getByText('COMPROMISSO COM QUALIDADE')).toBeInTheDocument()
  })

  it('renderiza o subtítulo "Excelência"', () => {
    render(<Quality />)
    expect(screen.getByText('Excelência')).toBeInTheDocument()
  })

  it('renderiza o título de cada item de qualidade', () => {
    render(<Quality />)
    QUALITY_ITEMS.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument()
    })
  })

  it('renderiza a descrição de cada item de qualidade', () => {
    render(<Quality />)
    QUALITY_ITEMS.forEach((item) => {
      expect(screen.getByText(item.description)).toBeInTheDocument()
    })
  })

  it('renderiza 3 cards de qualidade', () => {
    const { container } = render(<Quality />)
    expect(container.querySelectorAll('.quality-card')).toHaveLength(3)
  })
})
