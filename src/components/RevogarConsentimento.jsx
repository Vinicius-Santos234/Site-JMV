"use client";

import { useState } from "react";

/**
 * Botão de revogar consentimento.
 *
 * A LGPD (art. 8º, §5º) exige que revogar seja tão fácil quanto consentir. Antes
 * desta tela, a política mandava o visitante "limpar os dados do site nas
 * configurações do navegador" — o consentimento era um clique, e a revogação era
 * um passeio pelas preferências do Chrome. Não era equivalente.
 *
 * Limpar a chave e disparar o mesmo evento que o banner escuta devolve o site ao
 * estado de "ainda não decidiu": o `ConditionalAnalytics` desmonta os scripts e
 * o banner reaparece.
 */
export default function RevogarConsentimento() {
  const [estado, setEstado] = useState("parado");

  function revogar() {
    try {
      localStorage.removeItem("lgpd-consent");
      window.dispatchEvent(new Event("lgpd-consent"));
      setEstado("feito");
    } catch {
      setEstado("erro");
    }
  }

  if (estado === "feito") {
    return (
      <p role="status">
        <strong>Consentimento revogado.</strong> Os cookies de análise foram
        desativados nesta navegação e o aviso voltará a aparecer para que você
        possa decidir de novo.
      </p>
    );
  }

  if (estado === "erro") {
    return (
      <p role="status">
        Não foi possível alterar a preferência porque o armazenamento local está
        bloqueado neste navegador. Nesse caso nenhum cookie de análise é usado.
      </p>
    );
  }

  return (
    <p>
      <button type="button" className="btn-primary" onClick={revogar}>
        Revogar meu consentimento
      </button>
    </p>
  );
}
