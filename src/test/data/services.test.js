import { describe, it, expect } from 'vitest'
import { SERVICES } from '@/data/services'

describe('SERVICES', () => {
  it('deve conter 6 serviços', () => {
    expect(SERVICES).toHaveLength(6)
  })

  it('cada serviço deve ter id, icon, title e description', () => {
    SERVICES.forEach((service) => {
      expect(service).toHaveProperty('id')
      expect(service).toHaveProperty('icon')
      expect(service).toHaveProperty('title')
      expect(service).toHaveProperty('description')
    })
  })

  it('os ids devem ser únicos', () => {
    const ids = SERVICES.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('title e description não devem estar vazios', () => {
    SERVICES.forEach((service) => {
      expect(service.title.trim()).not.toBe('')
      expect(service.description.trim()).not.toBe('')
    })
  })
})
