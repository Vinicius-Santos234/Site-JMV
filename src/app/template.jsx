"use client";

import { m } from "framer-motion";

/**
 * Transição de entrada entre rotas.
 *
 * ⚠️ NÃO usar `initial={{ opacity: 0 }}` aqui.
 *
 * Este componente envolve a ÁRVORE INTEIRA de toda rota. Com `initial` opaco, o
 * HTML servido sai como `<div style="opacity:0">…</div>` e a página fica
 * invisível até o Framer Motion hidratar — inclusive o herói e o elemento do
 * LCP. Foi o que aconteceu na migração: tirar o `FadeInSection` do Hero não
 * resolveu, porque este ancestral continuava escondendo tudo por cima. E se os
 * chunks falharem ao carregar, o visitante fica com uma página em branco.
 *
 * A saída é animar só o que JÁ ESTÁ VISÍVEL: começamos em `opacity: 1` e
 * deixamos a transição acontecer entre navegações, onde a página anterior já
 * está pintada e hidratada. O `key` por rota faz o `animate` disparar na troca;
 * na primeira carga não há nada a revelar, porque nada estava escondido.
 */
export default function Template({ children }) {
  return (
    <m.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
    >
      {children}
    </m.div>
  );
}
