@AGENTS.md

<!--
  Este arquivo é só um ponteiro, de propósito.

  Todas as instruções do projeto vivem em AGENTS.md, que é o formato lido por
  vários agentes (Claude Code, Codex e outros). Duplicar o conteúdo aqui criaria
  duas fontes que divergem na primeira edição feita em uma só.

  A linha `@AGENTS.md` acima é uma importação do Claude Code: o conteúdo de
  AGENTS.md entra no contexto como se estivesse escrito aqui.

  Nota sobre o gerador do Next: `next dev` cria e mantém estes dois arquivos
  (node_modules/next/dist/server/lib/generate-agent-files.js). Enquanto AGENTS.md
  contiver os marcadores `<!-- BEGIN:nextjs-agent-rules -->` / `<!-- END:... -->`,
  o gerador atualiza APENAS o trecho entre eles e trata este CLAUDE.md como
  `skipped` — ou seja, nada aqui nem fora daqueles marcadores é sobrescrito.
  Não remova os marcadores de AGENTS.md: sem eles o Next volta a mexer nos dois
  arquivos, e o bloco é recriado a cada `next dev` de qualquer forma.

  Para desligar o gerador de vez: `agentRules: false` em next.config.mjs.
-->
