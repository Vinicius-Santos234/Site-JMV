import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Stats from '@/components/Stats'
import { STATS } from '@/data/stats'

vi.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = vi.fn()
      disconnect = vi.fn()
    }
  )
})

describe('Stats', () => {
  it('renderiza a seção com classe "stats"', () => {
    const { container } = render(<Stats stats={STATS} />)
    expect(container.querySelector('.stats')).toBeInTheDocument()
  })

  it('renderiza os rótulos de todos os itens', () => {
    render(<Stats stats={STATS} />)
    expect(screen.getByText('Anos')).toBeInTheDocument()
    expect(screen.getByText('Projetos')).toBeInTheDocument()
    expect(screen.getByText('Clientes')).toBeInTheDocument()
    expect(screen.getByText('Estados')).toBeInTheDocument()
  })

  it('renderiza 4 itens de estatística', () => {
    const { container } = render(<Stats stats={STATS} />)
    const items = container.querySelectorAll('.stats > div')
    expect(items).toHaveLength(4)
  })
})
