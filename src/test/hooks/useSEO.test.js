import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSEO, BASE_URL } from '@/hooks/useSEO'

function addMeta(attr, val) {
  const el = document.createElement('meta')
  el.setAttribute(attr, val)
  document.head.appendChild(el)
}

beforeEach(() => {
  document.title = 'Título anterior'
  addMeta('name', 'description')
  addMeta('property', 'og:title')
  addMeta('property', 'og:description')
  addMeta('property', 'og:url')
  addMeta('name', 'twitter:title')
  addMeta('name', 'twitter:description')
  const link = document.createElement('link')
  link.rel = 'canonical'
  document.head.appendChild(link)
})

afterEach(() => {
  document.head.innerHTML = ''
})

describe('useSEO', () => {
  it('atualiza document.title com o título fornecido', () => {
    renderHook(() => useSEO({ title: 'Título Teste' }))
    expect(document.title).toBe('Título Teste')
  })

  it('atualiza a meta description', () => {
    renderHook(() => useSEO({ description: 'Descrição de teste' }))
    expect(document.querySelector('meta[name="description"]').content).toBe('Descrição de teste')
  })

  it('atualiza og:title', () => {
    renderHook(() => useSEO({ title: 'OG Título' }))
    expect(document.querySelector('meta[property="og:title"]').content).toBe('OG Título')
  })

  it('restaura document.title ao desmontar', () => {
    const { unmount } = renderHook(() => useSEO({ title: 'Título Teste' }))
    unmount()
    expect(document.title).toBe('Título anterior')
  })

  it('restaura a meta description ao desmontar', () => {
    document.querySelector('meta[name="description"]').setAttribute('content', 'Descrição original')
    const { unmount } = renderHook(() => useSEO({ description: 'Nova descrição' }))
    expect(document.querySelector('meta[name="description"]').content).toBe('Nova descrição')
    unmount()
    expect(document.querySelector('meta[name="description"]').content).toBe('Descrição original')
  })

  it('usa BASE_URL como canonical padrão', () => {
    renderHook(() => useSEO({}))
    const canonical = document.querySelector('link[rel="canonical"]')
    expect(canonical.href).toContain(BASE_URL)
  })

  it('injeta script LD+JSON quando schema é fornecido', () => {
    const schema = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Teste' }
    const { unmount } = renderHook(() => useSEO({ schema }))
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts.length).toBeGreaterThan(0)
    unmount()
    expect(document.head.querySelectorAll('script[type="application/ld+json"]').length).toBe(0)
  })
})
