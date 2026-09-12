"use client";

import { useEffect, useRef } from "react";

/**
 * Card com luz radial azul que segue o cursor.
 *
 * O gradiente vive inteiro no CSS (`.spotlight-card::after`); o JS só escreve
 * duas custom properties de posição direto no style do nó. Nada de estado:
 * `mousemove` dispara a cada frame e um `useState` aqui re-renderizaria a
 * árvore inteira de Serviços/Qualidade a cada pixel percorrido.
 *
 * A comporta de `requestAnimationFrame` não existe pelas duas escritas de
 * custom property — essas são baratas. Existe pelo `getBoundingClientRect`:
 * ler geometria força o navegador a resolver layout pendente, e `mousemove`
 * chega mais rápido que a taxa de pintura. Sem a comporta, é uma medição de
 * layout por evento; com ela, uma por frame, que é o máximo que a tela
 * consegue mostrar de qualquer jeito.
 */
export default function SpotlightCard({ className = "", children, ...rest }) {
  const ref = useRef(null);
  const frame = useRef(0);
  const cursor = useRef({ x: 0, y: 0 });
  const consultas = useRef(null);

  // As MediaQueryList ficam guardadas, não o booleano: `.matches` é lido ao
  // vivo e continua barato, então trocar a preferência no sistema passa a
  // valer na hora, sem recarregar a página.
  function desligado() {
    if (!consultas.current) {
      if (typeof window === "undefined" || !window.matchMedia) return false;
      consultas.current = {
        reduzMovimento: window.matchMedia("(prefers-reduced-motion: reduce)"),
        temHover: window.matchMedia("(hover: hover)"),
      };
    }
    const { reduzMovimento, temHover } = consultas.current;
    // Quem pediu menos movimento não deve ganhar uma luz perseguindo o cursor.
    // E `(hover: none)` — celular, tablet — só emite mousemove em toques
    // esparsos, que acenderiam o card num ponto aleatório e o deixariam aceso.
    return reduzMovimento.matches || !temHover.matches;
  }

  function handleMouseMove(e) {
    if (desligado()) return;

    // Guarda as coordenadas do evento e sai. A leitura de geometria e a
    // escrita acontecem no frame, uma vez só, com o último valor recebido.
    cursor.current.x = e.clientX;
    cursor.current.y = e.clientY;

    if (frame.current) return;

    frame.current = requestAnimationFrame(() => {
      frame.current = 0;

      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${cursor.current.x - rect.left}px`);
      el.style.setProperty("--spot-y", `${cursor.current.y - rect.top}px`);
    });
  }

  // Frame pendente na hora de desmontar dispararia sobre um ref já nulo. O
  // early-return acima cobre, mas cancelar é o que não deixa o callback nem
  // ser agendado para depois do fim do componente.
  useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`spotlight-card ${className}`.trim()}
      onMouseMove={handleMouseMove}
      {...rest}
    >
      {children}
    </div>
  );
}
