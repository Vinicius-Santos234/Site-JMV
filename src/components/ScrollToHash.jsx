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

    // `/#%` fazia querySelector lancar SyntaxError, e como este componente vive
    // dentro do ErrorBoundary da home, a pagina inteira virava tela de erro.
    // Buscar por ID em vez de interpretar o fragmento como seletor CSS.
    let id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      id = hash.slice(1); // percent-encoding invalido: usa como veio
    }
    if (!id) return;

    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
    try { history.replaceState(null, "", "/"); } catch { /* sandbox */ }
  }, []);

  return null;
}
