/**
 * Consentimento LGPD — um lugar só.
 *
 * Estava espalhado por três arquivos que precisavam concordar entre si, e não
 * concordavam: o banner escrevia a chave mas não escutava mudanças, e a
 * revogação desmontava componentes achando que isso parava a coleta. Não para.
 */

export const CHAVE = "lgpd-consent";
export const EVENTO = "lgpd-consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function ler() {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    console.warn("[ERR_STORAGE] localStorage indisponível — analytics desativado.");
    return null;
  }
}

export function gravar(valor) {
  try {
    localStorage.setItem(CHAVE, valor);
  } catch { /* inacessível — o site funciona sem */ }
  avisar();
}

/**
 * Desliga o Google Analytics de verdade.
 *
 * Desmontar o componente React NÃO para a coleta: `loadGA` injeta um <script>
 * no <head> e define `window.gtag`, e nada disso é desfeito na desmontagem — a
 * flag `__gaLoaded` só impede carregar de novo. Os SDKs da Vercel são iguais:
 * conferido, ZERO chamadas de remoção neles.
 *
 * `ga-disable-<ID>` é o mecanismo documentado pelo Google para interromper o
 * envio sem remover a tag.
 */
export function desativarGA() {
  if (!GA_ID) return;
  try {
    window[`ga-disable-${GA_ID}`] = true;
  } catch { /* ambiente sem window */ }
}

export function avisar() {
  try {
    window.dispatchEvent(new Event(EVENTO));
  } catch { /* ambiente sem window */ }
}

/**
 * Revoga e RECARREGA a página.
 *
 * O recarregamento não é preguiça: é a única forma de garantir que os três
 * rastreadores parem. `ga-disable` resolve o Google; para os SDKs da Vercel,
 * que não removem os próprios scripts, só uma carga nova limpa de fato — e a
 * página recarregada não traz analytics nenhum, porque sem consentimento eles
 * nem são montados (verificado no HTML servido).
 */
export function revogar() {
  desativarGA();
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    return false;
  }
  avisar();
  return true;
}

/** Assina mudanças de consentimento (para useSyncExternalStore). */
export function assinar(aoMudar) {
  window.addEventListener(EVENTO, aoMudar);
  window.addEventListener("storage", aoMudar);
  return () => {
    window.removeEventListener(EVENTO, aoMudar);
    window.removeEventListener("storage", aoMudar);
  };
}
