/**
 * <script type="application/ld+json"> renderizado no HTML servido, nao injetado
 * por JS depois do render — que era como o schema saia no Vite.
 *
 * O escape de `<` NAO e decorativo. `JSON.stringify` escapa aspas, mas nao
 * escapa `<`, e o conteudo deste bloco vem do Sanity (FAQs e textos que o
 * cliente edita). Uma resposta contendo `</scr` + `ipt><scr` + `ipt>...` sairia
 * do bloco e injetaria JavaScript na pagina. Substituir por `\u003c` mantem o
 * JSON valido — o parser JSON desfaz a sequencia — e impede o parser HTML de
 * enxergar uma tag. E a orientacao do proprio Next para JSON-LD.
 *
 * CUIDADO AO EDITAR: sao DUAS barras invertidas no literal. Com uma so,
 * "\u003c" vira o proprio caractere `<` e o replace troca `<` por `<` — um
 * no-op silencioso, que foi exatamente o erro cometido na primeira escrita
 * deste arquivo e que so o teste denunciou.
 */
const MENOR_QUE_ESCAPADO = "\\u003c";

function escaparParaHtml(schema) {
  return JSON.stringify(schema).replace(/</g, MENOR_QUE_ESCAPADO);
}

export default function JsonLd({ schema }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escaparParaHtml(schema) }}
    />
  );
}
