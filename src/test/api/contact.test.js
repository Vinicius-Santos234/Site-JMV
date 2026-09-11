import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const mockSend = vi.hoisted(() => vi.fn())
vi.mock('resend', () => ({
  Resend: class {
    constructor() {
      this.emails = { send: mockSend }
    }
  },
}))

import * as route from '@/app/api/contact/route'

const HOST = 'site-jmv.vercel.app'

// O route handler do App Router recebe Request e devolve Response. O shim
// abaixo preserva a forma das asserções que já existiam no handler req/res.
function mockReq({ body = {}, ip, origin, host = HOST } = {}) {
  const headers = new Headers({ host, 'content-type': 'application/json' })
  if (origin) headers.set('origin', origin)
  if (ip) headers.set('x-forwarded-for', ip)
  return new Request(`https://${host}/api/contact`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
}

async function handler(request) {
  const res = await route.POST(request)
  return { statusCode: res.status, body: await res.json() }
}

const validBody = () => ({
  nome: 'João Silva',
  email: 'joao@example.com',
  telefone: '(16) 99999-9999',
  mensagem: 'Olá, preciso de um orçamento.',
})

describe('api/contact', () => {
  beforeEach(() => {
    mockSend.mockClear()
    mockSend.mockResolvedValue({ id: 'email_123' })
  })

  // No App Router quem devolve 405 é o framework, para todo método não
  // exportado — não há mais um `if (req.method !== 'POST')` para testar.
  // A garantia equivalente é a rota expor POST e só POST.
  it('expõe apenas POST (demais métodos caem no 405 do framework)', () => {
    expect(typeof route.POST).toBe('function')
    for (const m of ['GET', 'PUT', 'PATCH', 'DELETE', 'HEAD']) {
      expect(route[m]).toBeUndefined()
    }
  })

  it('bloqueia origem cross-origin com 403', async () => {
    const res = await handler(mockReq({ origin: 'https://malicioso.com', body: validBody() }))
    expect(res.statusCode).toBe(403)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('aceita requisição same-origin', async () => {
    const res = await handler(mockReq({ origin: `https://${HOST}`, ip: '10.0.0.5', body: validBody() }))
    expect(res.statusCode).toBe(200)
    expect(mockSend).toHaveBeenCalledTimes(1)
  })

  it('ignora envio quando o honeypot está preenchido (200 sem enviar)', async () => {
    const res = await handler(mockReq({ body: { ...validBody(), website: 'http://bot.com' } }))
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('retorna 400 quando faltam campos obrigatórios', async () => {
    const res = await handler(mockReq({ body: { nome: '', email: '', mensagem: '' } }))
    expect(res.statusCode).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('retorna 400 para e-mail inválido', async () => {
    const res = await handler(mockReq({ body: { ...validBody(), email: 'invalido' } }))
    expect(res.statusCode).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('retorna 400 quando um campo excede o tamanho permitido', async () => {
    const res = await handler(mockReq({ body: { ...validBody(), mensagem: 'x'.repeat(1001) } }))
    expect(res.statusCode).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('envia o e-mail com reply_to e responde 200 em caso de sucesso', async () => {
    const res = await handler(mockReq({ ip: '10.0.0.1', body: validBody() }))
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(mockSend).toHaveBeenCalledTimes(1)
    const payload = mockSend.mock.calls[0][0]
    expect(payload.reply_to).toBe('joao@example.com')
    expect(payload.to).toBe('jpsantos@jmv.ind.br')
  })

  it('sanitiza quebras de linha no assunto (anti-injeção de cabeçalho)', async () => {
    const body = { ...validBody(), nome: 'João\nBcc: alvo@spam.com' }
    const res = await handler(mockReq({ ip: '10.0.0.2', body }))
    expect(res.statusCode).toBe(200)
    const payload = mockSend.mock.calls[0][0]
    expect(payload.subject).not.toMatch(/[\r\n]/)
    expect(payload.subject).toBe('Contato via site — João Bcc: alvo@spam.com')
  })

  it('aplica rate limiting após exceder o limite por IP', async () => {
    const ip = '10.0.0.99'
    for (let i = 0; i < 5; i++) {
        const res = await handler(mockReq({ ip, body: validBody() }))
      expect(res.statusCode).toBe(200)
    }
    const res = await handler(mockReq({ ip, body: validBody() }))
    expect(res.statusCode).toBe(429)
  })

  it('retorna 500 quando o envio falha', async () => {
    mockSend.mockRejectedValueOnce(new Error('resend down'))
    const res = await handler(mockReq({ ip: '10.0.0.3', body: validBody() }))
    expect(res.statusCode).toBe(500)
  })
})

describe('api/contact — Turnstile', () => {
  beforeEach(() => {
    mockSend.mockClear()
    mockSend.mockResolvedValue({ id: 'email_123' })
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret') // ativa a verificação
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('bloqueia com 403 quando o token do Turnstile está ausente', async () => {
    const res = await handler(mockReq({ ip: '10.1.0.1', body: validBody() }))
    expect(res.statusCode).toBe(403)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('bloqueia com 403 quando o Turnstile rejeita o token', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({ success: false }) }))
    const res = await handler(mockReq({ ip: '10.1.0.2', body: { ...validBody(), turnstileToken: 'ruim' } }))
    expect(res.statusCode).toBe(403)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('envia quando o Turnstile valida o token', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({ success: true }) }))
    const res = await handler(mockReq({ ip: '10.1.0.3', body: { ...validBody(), turnstileToken: 'valido' } }))
    expect(res.statusCode).toBe(200)
    expect(mockSend).toHaveBeenCalledTimes(1)
  })
})
