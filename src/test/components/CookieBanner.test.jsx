import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CookieBanner from '@/components/CookieBanner'

beforeEach(() => localStorage.clear())
afterEach(() => { vi.useRealTimers(); localStorage.clear() })

// Avança o timer de 1200ms e garante que o banner aparece
function showBanner() {
  vi.useFakeTimers()
  render(<CookieBanner />)
  act(() => vi.advanceTimersByTime(1200))
  vi.useRealTimers() // restaura antes de qualquer userEvent
}

describe('CookieBanner', () => {
  it('não exibe o banner imediatamente (timer de 1200ms)', () => {
    vi.useFakeTimers()
    render(<CookieBanner />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exibe o banner após 1200ms quando não há consentimento salvo', () => {
    vi.useFakeTimers()
    render(<CookieBanner />)
    act(() => vi.advanceTimersByTime(1200))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('não exibe o banner se consentimento já foi dado', () => {
    localStorage.setItem('lgpd-consent', 'accepted')
    vi.useFakeTimers()
    render(<CookieBanner />)
    act(() => vi.advanceTimersByTime(1200))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('aceitar cookies salva "accepted" no localStorage e oculta o banner', async () => {
    showBanner()
    await userEvent.click(screen.getByRole('button', { name: /aceitar cookies/i }))
    expect(localStorage.getItem('lgpd-consent')).toBe('accepted')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('aceitar dispara o evento "lgpd-consent" na window', async () => {
    const handler = vi.fn()
    window.addEventListener('lgpd-consent', handler)
    showBanner()
    await userEvent.click(screen.getByRole('button', { name: /aceitar cookies/i }))
    expect(handler).toHaveBeenCalledTimes(1)
    window.removeEventListener('lgpd-consent', handler)
  })

  it('recusar cookies salva "declined" no localStorage e oculta o banner', async () => {
    showBanner()
    await userEvent.click(screen.getByRole('button', { name: /recusar/i }))
    expect(localStorage.getItem('lgpd-consent')).toBe('declined')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
