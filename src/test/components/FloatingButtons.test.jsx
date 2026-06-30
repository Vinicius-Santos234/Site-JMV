import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FloatingButtons from '@/components/FloatingButtons'

beforeEach(() => {
  Object.defineProperty(window, 'scrollY', { writable: true, value: 0 })
  window.scrollTo = vi.fn()
})

describe('FloatingButtons', () => {
  it('renderiza o botão de WhatsApp', () => {
    render(<FloatingButtons />)
    expect(screen.getByRole('link', { name: /falar pelo whatsapp/i })).toBeInTheDocument()
  })

  it('link do WhatsApp aponta para wa.me', () => {
    render(<FloatingButtons />)
    const link = screen.getByRole('link', { name: /falar pelo whatsapp/i })
    expect(link.href).toContain('wa.me')
  })

  it('link do WhatsApp abre em nova aba', () => {
    render(<FloatingButtons />)
    const link = screen.getByRole('link', { name: /falar pelo whatsapp/i })
    expect(link.target).toBe('_blank')
    expect(link.rel).toContain('noreferrer')
  })

  it('não exibe o botão "Voltar ao topo" quando scrollY é 0', () => {
    render(<FloatingButtons />)
    expect(screen.queryByRole('button', { name: /voltar ao topo/i })).not.toBeInTheDocument()
  })

  it('exibe o botão "Voltar ao topo" após scroll maior que 500px', () => {
    render(<FloatingButtons />)
    Object.defineProperty(window, 'scrollY', { writable: true, value: 600 })
    fireEvent.scroll(window)
    expect(screen.getByRole('button', { name: /voltar ao topo/i })).toBeInTheDocument()
  })

  it('chama window.scrollTo ao clicar no botão "Voltar ao topo"', () => {
    render(<FloatingButtons />)
    Object.defineProperty(window, 'scrollY', { writable: true, value: 600 })
    fireEvent.scroll(window)
    fireEvent.click(screen.getByRole('button', { name: /voltar ao topo/i }))
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('oculta o botão "Voltar ao topo" quando scroll volta a 0', () => {
    render(<FloatingButtons />)
    Object.defineProperty(window, 'scrollY', { writable: true, value: 600 })
    fireEvent.scroll(window)
    expect(screen.getByRole('button', { name: /voltar ao topo/i })).toBeInTheDocument()
    Object.defineProperty(window, 'scrollY', { writable: true, value: 0 })
    fireEvent.scroll(window)
    expect(screen.queryByRole('button', { name: /voltar ao topo/i })).not.toBeInTheDocument()
  })
})
