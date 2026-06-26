import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCountUp } from '@/hooks/useCountUp'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = vi.fn()
      disconnect = vi.fn()
    }
  )
})

describe('useCountUp', () => {
  it('deve retornar um ref e o valor inicial 0 para entrada numérica', () => {
    const { result } = renderHook(() => useCountUp('100'))
    const [ref, value] = result.current
    expect(ref).toBeDefined()
    expect(value).toBe('0')
  })

  it('deve retornar o valor bruto quando a entrada não é numérica', () => {
    const { result } = renderHook(() => useCountUp('N/A'))
    const [ref, value] = result.current
    expect(ref).toBeDefined()
    expect(value).toBe('N/A')
  })

  it('deve preservar o sufixo "+" no valor retornado', () => {
    const { result } = renderHook(() => useCountUp('12+'))
    const [, value] = result.current
    expect(value).toMatch(/^\d+\+$/)
  })

  it('deve aceitar duração customizada sem erros', () => {
    expect(() => renderHook(() => useCountUp('50', 500))).not.toThrow()
  })
})
