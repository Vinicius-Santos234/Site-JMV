"use client";

import { m } from "framer-motion";

/**
 * Transição de entrada entre rotas. O `template.jsx` remonta a cada navegação,
 * que é o que faz a animação disparar.
 *
 * Simplificação consciente na migração: o Vite tinha AnimatePresence com
 * animação de SAÍDA (`exit`) também. No App Router isso exige segurar a rota
 * antiga montada enquanto a nova carrega, e nunca fica confiável. Ficou só a
 * entrada — é o que o visitante percebe, e some a parte frágil.
 */
export default function Template({ children }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
    >
      {children}
    </m.div>
  );
}
