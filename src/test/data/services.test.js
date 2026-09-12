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

  /* As normas do CMS são validadas pelo schema do Studio. Estas aqui não —
     src/data é o fallback, editado direto no arquivo, sem ninguém olhando.
     Os limites abaixo são os mesmos de studio/schemaTypes/service.js, e existem
     para o fallback não renderizar o que o CMS proibiria. */
  describe('normas (chips)', () => {
    it('cada serviço tem no máximo 3 normas', () => {
      SERVICES.forEach((service) => {
        expect((service.norms ?? []).length).toBeLessThanOrEqual(3)
      })
    })

    it('normas são strings não vazias', () => {
      SERVICES.forEach((service) => {
        (service.norms ?? []).forEach((norm) => {
          expect(typeof norm).toBe('string')
          expect(norm.trim()).not.toBe('')
        })
      })
    })

    it('normas cabem no chip sem corte (26 caracteres)', () => {
      SERVICES.forEach((service) => {
        (service.norms ?? []).forEach((norm) => {
          expect(norm.length).toBeLessThanOrEqual(26)
        })
      })
    })

    it('não repete norma dentro do mesmo serviço', () => {
      SERVICES.forEach((service) => {
        const norms = service.norms ?? []
        expect(new Set(norms).size).toBe(norms.length)
      })
    })
  })
})
