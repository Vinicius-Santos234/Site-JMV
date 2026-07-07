import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contact from '@/components/Contact'

vi.mock('framer-motion', () => ({
  m: { div: ({ children, ...p }) => <div {...p}>{children}</div> },
}))

// Isola os testes do CAPTCHA: força "desativado" independentemente do .env
// local (senão, ter VITE_TURNSTILE_SITE_KEY no .env.local quebraria o submit).
vi.mock('@/lib/turnstile', () => ({
  isTurnstileConfigured: false,
  TURNSTILE_SITE_KEY: undefined,
  TURNSTILE_SCRIPT_SRC: 'https://challenges.cloudflare.com/turnstile/v0/api.js',
}))

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.restoreAllMocks()
})

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText(/nome completo/i), 'João Silva')
  await userEvent.type(screen.getByLabelText(/e-mail/i),        'joao@teste.com')
  await userEvent.type(screen.getByLabelText(/telefone/i),      '16999999999')
  await userEvent.type(screen.getByLabelText(/mensagem/i),      'Preciso de um orçamento')
  await userEvent.click(screen.getByRole('checkbox'))
}

describe('Contact — validação', () => {
  it('exibe erros ao submeter formulário vazio', async () => {
    render(<Contact />)
    await userEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }))
    expect(screen.getByText('Nome obrigatório')).toBeInTheDocument()
    expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    expect(screen.getByText('Mensagem obrigatória')).toBeInTheDocument()
  })

  it('não chama fetch quando há erros de validação', async () => {
    render(<Contact />)
    await userEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }))
    expect(fetch).not.toHaveBeenCalled()
  })

  it('limpa o erro do campo ao corrigir o valor', async () => {
    render(<Contact />)
    await userEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }))
    expect(screen.getByText('Nome obrigatório')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText(/nome completo/i), 'João')
    expect(screen.queryByText('Nome obrigatório')).not.toBeInTheDocument()
  })

  it('exige o consentimento LGPD antes de enviar', async () => {
    fetch.mockResolvedValueOnce({ ok: true })
    render(<Contact />)
    await userEvent.type(screen.getByLabelText(/nome completo/i), 'João Silva')
    await userEvent.type(screen.getByLabelText(/e-mail/i),        'joao@teste.com')
    await userEvent.type(screen.getByLabelText(/telefone/i),      '16999999999')
    await userEvent.type(screen.getByLabelText(/mensagem/i),      'Preciso de um orçamento')
    // sem marcar o checkbox de consentimento
    await userEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }))
    expect(screen.getByText(/aceitar a política de privacidade/i)).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe('Contact — submit', () => {
  it('exibe mensagem de sucesso após envio bem-sucedido', async () => {
    fetch.mockResolvedValueOnce({ ok: true })
    render(<Contact />)
    await fillValidForm()
    await userEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }))
    await waitFor(() =>
      expect(screen.getByText(/mensagem enviada com sucesso/i)).toBeInTheDocument()
    )
  })

  it('exibe mensagem de erro quando o servidor falha', async () => {
    fetch.mockResolvedValueOnce({ ok: false })
    render(<Contact />)
    await fillValidForm()
    await userEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }))
    await waitFor(() =>
      expect(screen.getByText(/não foi possível enviar/i)).toBeInTheDocument()
    )
  })

  it('exibe mensagem de erro quando fetch lança exceção', async () => {
    fetch.mockRejectedValueOnce(new Error('network'))
    render(<Contact />)
    await fillValidForm()
    await userEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }))
    await waitFor(() =>
      expect(screen.getByText(/não foi possível enviar/i)).toBeInTheDocument()
    )
  })
})
