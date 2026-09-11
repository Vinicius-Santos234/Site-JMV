/**
 * Rede de segurança do rate limiting — NÃO é o mecanismo principal.
 *
 * Quem limita de verdade é uma regra do Vercel Firewall, na borda:
 *
 *     contato-rate-limit — 5 req / 600s por IP, em POST /api/contact
 *     (rule_contato_rate_limit_Y5gSW8)
 *
 * A borda bloqueia antes de a requisição chegar aqui, então o tráfego abusivo
 * não gasta invocação de função nem cota do Resend. Conferir com
 * `vercel firewall rules list`.
 *
 * ── Por que isto existe mesmo assim ─────────────────────────────────────────
 * Até 09/2026 o limite era `@upstash/ratelimit` + Vercel KV. O banco do Upstash
 * foi REMOVIDO POR INATIVIDADE (o site tem pouco tráfego), e o código caiu no
 * fallback em memória — que em serverless é por instância, ou seja, quase nada.
 * Nada quebrou: o site seguiu funcionando e simplesmente parou de proteger, em
 * silêncio, por semanas.
 *
 * A lição virou este arquivo. O contador em memória continua aqui como
 * **canário**: em operação normal ele nunca dispara, porque a borda já barrou
 * antes. Se ele disparar, é sinal de que a regra do firewall não pegou — e aí
 * o log GRITA, em vez de degradar calado como da última vez.
 */

const MAX = 5;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_IPS = 10_000;

const hits = new Map();

/**
 * Remove IPs cuja janela ja expirou. Sem isto o Map so crescia: a filtragem
 * antiga expirava os timestamps do IP consultado, mas nunca removia a CHAVE —
 * uma instancia de vida longa acumulava memoria proporcional ao total historico
 * de IPs, incluindo os que nem chegaram a enviar nada.
 */
function limpar(now) {
  for (const [chave, marcas] of hits) {
    if (marcas.length === 0 || now - marcas[marcas.length - 1] >= WINDOW_MS) {
      hits.delete(chave);
    }
  }
}

export function isRateLimited(ip) {
  const now = Date.now();

  // Teto rigido: se a limpeza nao deu conta (rajada de IPs distintos dentro da
  // mesma janela), zera. Preferimos perder a contagem a crescer sem limite —
  // isto e rede de seguranca, nao o mecanismo principal.
  if (hits.size >= MAX_IPS) {
    limpar(now);
    if (hits.size >= MAX_IPS) hits.clear();
  }

  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX) {
    hits.set(ip, timestamps);
    console.error(
      `[rate-limit] CANARIO DISPARADO para ${ip}: ${MAX} envios na janela ` +
      `chegaram ate a funcao. A regra 'contato-rate-limit' do Vercel Firewall ` +
      `deveria ter barrado na borda — conferir com 'vercel firewall rules list'.`
    );
    return true;
  }

  timestamps.push(now);
  hits.set(ip, timestamps);
  return false;
}
