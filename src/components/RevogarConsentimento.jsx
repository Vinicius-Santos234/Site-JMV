"use client";

import { useState } from "react";
import { revogar } from "@/lib/consent";

/**
 * Botão de revogar consentimento.
 *
 * A LGPD (art. 8º, §5º) exige que revogar seja tão fácil quanto consentir.
 * Antes desta tela a política mandava "limpar os dados do site nas
 * configurações do navegador" — consentir era um clique, revogar era um passeio
 * pelas preferências do Chrome.
 *
 * ⚠️ A primeira versão deste botão apagava a chave e desmontava os componentes
 * de analytics, o que NÃO parava a coleta: o script do Google já estava no
 * <head> com `window.gtag` ativo, e os SDKs da Vercel não removem os próprios
 * scripts (conferido: zero chamadas de remoção). O botão dizia "revogado" e o
 * rastreamento continuava — a interface afirmando algo que o código não
 * cumpria, que é exatamente o defeito que esta política veio consertar.
 *
 * Agora: `ga-disable` corta o Google na hora, e a página recarrega para garantir
 * que o resto caia junto. Sem consentimento, a página nova não monta analytics
 * nenhum.
 */
export default function RevogarConsentimento() {
  const [estado, setEstado] = useState("parado");

  function aoClicar() {
    if (!revogar()) {
      setEstado("erro");
      return;
    }
    setEstado("feito");
    // Um instante para a confirmação ser lida antes de a página recarregar.
    setTimeout(() => {
      try { window.location.reload(); } catch { /* sandbox */ }
    }, 1500);
  }

  if (estado === "feito") {
    return (
      <p role="status">
        <strong>Consentimento revogado.</strong> Os cookies de análise foram
        desativados e a página será recarregada para encerrar qualquer coleta em
        andamento. O aviso voltará a aparecer para que você possa decidir de novo.
      </p>
    );
  }

  if (estado === "erro") {
    return (
      <p role="status">
        Não foi possível alterar a preferência porque o armazenamento local está
        bloqueado neste navegador. Nesse caso, nenhum cookie de análise é usado.
      </p>
    );
  }

  return (
    <p>
      <button type="button" className="btn-primary" onClick={aoClicar}>
        Revogar meu consentimento
      </button>
    </p>
  );
}
