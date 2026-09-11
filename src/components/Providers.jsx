"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/**
 * Fronteira de cliente para o Framer Motion. `domAnimation` carrega só as
 * features usadas — foi o que derrubou o chunk de 132 para 86 KB em 07/07.
 * Os filhos continuam sendo Server Components: passam por aqui já renderizados.
 */
export default function Providers({ children }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
