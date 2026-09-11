"use client";

import { useEffect } from "react";

/**
 * Rola até a âncora quando a home é aberta com hash (ex.: vindo de /portfolio
 * por "Solicitar orçamento" → /#contato) e limpa o hash da URL depois.
 */
export default function ScrollToHash() {
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
    try { history.replaceState(null, "", "/"); } catch { /* sandbox */ }
  }, []);

  return null;
}
