import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFoundPage from '@/app/not-found'

vi.mock('framer-motion', () => ({
  m: { div: ({ children, ...p }) => <div {...p}>{children}</div> },
}))

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe = vi.fn()
    disconnect = vi.fn()
  })
})

function renderPage() {
  return render(
    <NotFoundPage />
    )
}

describe('NotFoundPage', () => {
  it('exibe o código 404', () => {
    renderPage()
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('exibe mensagem de página não encontrada', () => {
    renderPage()
    expect(screen.getByText(/não existe ou foi movida/i)).toBeInTheDocument()
  })

  it('exibe link para voltar ao início', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /voltar ao início/i })).toBeInTheDocument()
  })

  it('link de volta aponta para a raiz', () => {
    renderPage()
    const link = screen.getByRole('link', { name: /voltar ao início/i })
    expect(link.getAttribute('href')).toBe('/')
  })
})
