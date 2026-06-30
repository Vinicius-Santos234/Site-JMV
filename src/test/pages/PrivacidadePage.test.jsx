import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PrivacidadePage from '@/pages/PrivacidadePage'

vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...p }) => <div {...p}>{children}</div> },
}))

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe = vi.fn()
    disconnect = vi.fn()
  })
})

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/privacidade']}>
      <PrivacidadePage />
    </MemoryRouter>
  )
}

describe('PrivacidadePage', () => {
  it('exibe o título "POLÍTICA DE PRIVACIDADE"', () => {
    renderPage()
    expect(screen.getByText('POLÍTICA DE PRIVACIDADE')).toBeInTheDocument()
  })

  it('exibe link para voltar ao site', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /voltar ao site/i })).toBeInTheDocument()
  })

  it('exibe a seção "Quem somos"', () => {
    renderPage()
    expect(screen.getByText(/1\. Quem somos/i)).toBeInTheDocument()
  })

  it('exibe as 10 seções da política', () => {
    renderPage()
    expect(screen.getByText(/2\. Quais dados coletamos/i)).toBeInTheDocument()
    expect(screen.getByText(/4\. Base legal/i)).toBeInTheDocument()
    expect(screen.getByText(/8\. Segurança/i)).toBeInTheDocument()
  })

  it('exibe menção à LGPD', () => {
    renderPage()
    expect(screen.getByText(/13\.709\/2018/)).toBeInTheDocument()
  })
})
