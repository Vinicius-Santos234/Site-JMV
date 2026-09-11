import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const GA_ID = 'G-TESTE123'

describe('consentimento — revogação para a coleta de verdade', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', GA_ID)
    localStorage.clear()
    delete window[`ga-disable-${GA_ID}`]
  })
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  // O defeito que isto trava: a primeira versao apagava a chave e desmontava os
  // componentes, achando que isso parava o rastreamento. Nao parava — o script
  // do Google ja estava no <head> com window.gtag ativo, e os SDKs da Vercel
  // nao removem os proprios scripts.
  it('liga o ga-disable ao revogar', async () => {
    const { revogar } = await import('@/lib/consent')
    localStorage.setItem('lgpd-consent', 'accepted')

    expect(window[`ga-disable-${GA_ID}`]).toBeUndefined()
    revogar()
    expect(window[`ga-disable-${GA_ID}`]).toBe(true)
  })

  it('apaga a preferência e avisa quem estiver escutando', async () => {
    const { revogar, assinar } = await import('@/lib/consent')
    localStorage.setItem('lgpd-consent', 'accepted')

    const ouvinte = vi.fn()
    const cancelar = assinar(ouvinte)

    revogar()

    expect(localStorage.getItem('lgpd-consent')).toBeNull()
    expect(ouvinte).toHaveBeenCalled()
    cancelar()
  })

  it('aceitar também avisa — o banner depende disso para sumir', async () => {
    const { gravar, assinar, ler } = await import('@/lib/consent')
    const ouvinte = vi.fn()
    const cancelar = assinar(ouvinte)

    gravar('accepted')

    expect(ler()).toBe('accepted')
    expect(ouvinte).toHaveBeenCalled()
    cancelar()
  })

  it('não explode quando o localStorage está bloqueado', async () => {
    const { ler } = await import('@/lib/consent')
    const orig = Storage.prototype.getItem
    Storage.prototype.getItem = () => { throw new Error('bloqueado') }
    expect(ler()).toBeNull()
    Storage.prototype.getItem = orig
  })
})
