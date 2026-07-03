import { useEffect, useRef } from "react";
import {
  TURNSTILE_SITE_KEY,
  TURNSTILE_SCRIPT_SRC,
  isTurnstileConfigured,
} from "../lib/turnstile";

function loadScript() {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
    const existing = document.querySelector(
      `script[src="${TURNSTILE_SCRIPT_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Widget invisível do Cloudflare Turnstile. Chama `onVerify(token)` quando o
 * desafio é resolvido e `onExpire()` quando o token expira ou falha.
 * Passe callbacks estáveis (setState ou useCallback) e uma `key` que muda para
 * forçar um token novo (single-use).
 */
export default function TurnstileWidget({ onVerify, onExpire }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isTurnstileConfigured) return;
    let cancelled = false;
    let widgetId;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: "interaction-only", // some da tela salvo se exigir interação
          callback: (token) => onVerify?.(token),
          "expired-callback": () => onExpire?.(),
          "error-callback": () => onExpire?.(),
        });
      })
      .catch(() => onExpire?.());

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          // widget já removido — ignora
        }
      }
    };
  }, [onVerify, onExpire]);

  if (!isTurnstileConfigured) return null;
  return <div ref={containerRef} className="cf-turnstile-widget" />;
}
