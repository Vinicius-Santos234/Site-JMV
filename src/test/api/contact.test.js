import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockSend = vi.hoisted(() => vi.fn())
vi.mock('resend', () => ({
  Resend: class {
    constructor() {
      this.emails = { send: mockSend }
    }
  },
}))

import handler from '../../../api/contact.js'

const HOST = 'site-jmv.vercel.app'

function mockReq({ method = 'POST', body = {}, ip, origin, host = HOST } = {}) {
  const headers = { host }
  if (origin) headers.origin = origin
  if (ip) headers['x-forwarded-for'] = ip
  return { method, headers, body, socket: { remoteAddress: ip ?? '127.0.0.1' } }
}

function mockRes() {
  const res = { statusCode: null, body: null }
  res.status = (c) => { res.statusCode = c; return res }
  res.json = (b) => { res.body = b; return res }
  return res
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

  it('rejeita métodos diferentes de POST com 405', async () => {
    const res = mockRes()
    await handler(mockReq({ method: 'GET' }), res)
    expect(res.statusCode).toBe(405)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('bloqueia origem cross-origin com 403', async () => {
    const res = mockRes()
    await handler(mockReq({ origin: 'https://malicioso.com', body: validBody() }), res)
    expect(res.statusCode).toBe(403)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('aceita requisição same-origin', async () => {
    const res = mockRes()
    await handler(mockReq({ origin: `https://${HOST}`, ip: '10.0.0.5', body: validBody() }), res)
    expect(res.statusCode).toBe(200)
    expect(mockSend).toHaveBeenCalledTimes(1)
  })

  it('ignora envio quando o honeypot está preenchido (200 sem enviar)', async () => {
    const res = mockRes()
    await handler(mockReq({ body: { ...validBody(), website: 'http://bot.com' } }), res)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('retorna 400 quando faltam campos obrigatórios', async () => {
    const res = mockRes()
    await handler(mockReq({ body: { nome: '', email: '', mensagem: '' } }), res)
    expect(res.statusCode).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('retorna 400 para e-mail inválido', async () => {
    const res = mockRes()
    await handler(mockReq({ body: { ...validBody(), email: 'invalido' } }), res)
    expect(res.statusCode).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('retorna 400 quando um campo excede o tamanho permitido', async () => {
    const res = mockRes()
    await handler(mockReq({ body: { ...validBody(), mensagem: 'x'.repeat(1001) } }), res)
    expect(res.statusCode).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('envia o e-mail com reply_to e responde 200 em caso de sucesso', async () => {
    const res = mockRes()
    await handler(mockReq({ ip: '10.0.0.1', body: validBody() }), res)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(mockSend).toHaveBeenCalledTimes(1)
    const payload = mockSend.mock.calls[0][0]
    expect(payload.reply_to).toBe('joao@example.com')
    expect(payload.to).toBe('jpsantos@jmv.ind.br')
  })

  it('sanitiza quebras de linha no assunto (anti-injeção de cabeçalho)', async () => {
    const res = mockRes()
    const body = { ...validBody(), nome: 'João\nBcc: alvo@spam.com' }
    await handler(mockReq({ ip: '10.0.0.2', body }), res)
    expect(res.statusCode).toBe(200)
    const payload = mockSend.mock.calls[0][0]
    expect(payload.subject).not.toMatch(/[\r\n]/)
    expect(payload.subject).toBe('Contato via site — João Bcc: alvo@spam.com')
  })

  it('aplica rate limiting após exceder o limite por IP', async () => {
    const ip = '10.0.0.99'
    for (let i = 0; i < 5; i++) {
      const res = mockRes()
      await handler(mockReq({ ip, body: validBody() }), res)
      expect(res.statusCode).toBe(200)
    }
    const res = mockRes()
    await handler(mockReq({ ip, body: validBody() }), res)
    expect(res.statusCode).toBe(429)
  })

  it('retorna 500 quando o envio falha', async () => {
    mockSend.mockRejectedValueOnce(new Error('resend down'))
    const res = mockRes()
    await handler(mockReq({ ip: '10.0.0.3', body: validBody() }), res)
    expect(res.statusCode).toBe(500)
  })
})
