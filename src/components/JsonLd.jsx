/**
 * <script type="application/ld+json"> renderizado no HTML servido, não injetado
 * por JS depois do render — que era como o schema saía no Vite.
 */
export default function JsonLd({ schema }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
