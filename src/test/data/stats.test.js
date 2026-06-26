import { describe, it, expect } from 'vitest'
import { STATS } from '@/data/stats'

describe('STATS', () => {
  it('deve conter 4 estatísticas', () => {
    expect(STATS).toHaveLength(4)
  })

  it('cada stat deve ter id, number e label', () => {
    STATS.forEach((stat) => {
      expect(stat).toHaveProperty('id')
      expect(stat).toHaveProperty('number')
      expect(stat).toHaveProperty('label')
    })
  })

  it('o número de anos deve refletir o ano atual', () => {
    const anosStat = STATS.find((s) => s.label === 'Anos')
    const anosEsperados = new Date().getFullYear() - 2013
    expect(anosStat.number).toBe(`${anosEsperados}+`)
  })

  it('labels não devem estar vazios', () => {
    STATS.forEach((stat) => {
      expect(stat.label.trim()).not.toBe('')
    })
  })
})
