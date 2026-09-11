import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import JsonLd from '@/components/JsonLd'

// O fechamento de script e montado por concatenacao para nao encerrar ESTE
// arquivo quando ele for servido/lido por ferramentas.
const FECHA = '</scr' + 'ipt>'
const ABRE = '<scr' + 'ipt>'

describe('JsonLd — escape de conteudo vindo do CMS', () => {
  it('nao deixa `<` cru escapar para o HTML', () => {
    const { container } = render(
      <JsonLd schema={{ nome: FECHA + ABRE + 'alert(1)' + FECHA }} />
    )
    const html = container.querySelector('script').innerHTML
    expect(html).not.toContain(FECHA)
    expect(html).not.toContain(ABRE)
    expect(html).not.toContain('<')
    // a sequencia literal barra-u-0-0-3-c, nao o caractere que ela representa
    expect(html).toContain(String.fromCharCode(92) + 'u003c')
  })

  it('o JSON continua valido e com o valor original', () => {
    const schema = { nome: FECHA + '<img src=x onerror=alert(1)>' }
    const { container } = render(<JsonLd schema={schema} />)
    expect(JSON.parse(container.querySelector('script').innerHTML)).toEqual(schema)
  })

  it('nao cria um segundo script no DOM', () => {
    const { container } = render(
      <JsonLd schema={{ a: FECHA + ABRE + 'x' + FECHA }} />
    )
    expect(container.querySelectorAll('script')).toHaveLength(1)
  })
})
