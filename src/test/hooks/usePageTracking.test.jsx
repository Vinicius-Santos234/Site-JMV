import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { usePageTracking } from '@/hooks/usePageTracking'

afterEach(() => {
  delete window.gtag
})

describe('usePageTracking', () => {
  it('não lança erro quando gtag não está definido', () => {
    expect(() =>
      renderHook(() => usePageTracking(), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })
    ).not.toThrow()
  })

  it('chama gtag com page_view para o pathname atual', () => {
    window.gtag = vi.fn()
    renderHook(() => usePageTracking(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/portfolio']}>{children}</MemoryRouter>
      ),
    })
    expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_path: '/portfolio',
    })
  })

  it('não chama gtag quando window.gtag não é uma função', () => {
    window.gtag = 'não é função'
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      renderHook(() => usePageTracking(), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })
    ).not.toThrow()
    spy.mockRestore()
  })
})
