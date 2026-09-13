"use client";

import { useEffect, useRef, useState } from "react";
import "./FadeInSection.css";

/**
 * Revelação por rolagem que NÃO é pré-requisito para o conteúdo existir.
 *
 * O template.jsx já registra a lição no nível da rota: `initial` opaco vai
 * para o HTML SERVIDO, e o que sai do servidor invisível só aparece quando o
 * JavaScript chega. Este componente cometia o mesmo erro um andar abaixo —
 * `initial={{ opacity: 0, y: 60 }}` no `whileInView` do Framer Motion fazia
 * DEZ blocos da home saírem como `style="opacity:0;transform:translateY(60px)"`
 * (conferido no HTML de produção). Tudo abaixo do herói dependia de hidratar.
 *
 * Dois atrasos se somavam no celular, e juntos são o "a seção demora para
 * aparecer quando chego nela":
 *
 *   1. hidratar o Framer Motion antes de qualquer revelação poder acontecer;
 *   2. `amount: 0.2`, que exige 20% da SEÇÃO dentro da tela. Seção alta em
 *      tela pequena só cumpre isso depois de centenas de pixels de rolagem —
 *      ou seja, já estava na seção e ainda não tinha nada.
 *
 * Agora o padrão é visível, e esconder é decisão do cliente:
 *
 *   - sem JS, com JS lento ou sem IntersectionObserver, nada some;
 *   - só é escondido o que está ABAIXO da dobra na hora da montagem, porque
 *     esconder o que já está sendo lido seria trocar a espera por um piscar;
 *   - o limiar virou distância em pixels e com folga: a revelação começa
 *     antes de a seção chegar à tela, e não depende da altura dela;
 *   - com `prefers-reduced-motion`, não há fase escondida nenhuma.
 */
export default function FadeInSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const [estado, setEstado] = useState("visivel");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // A leitura tem de ser aqui, antes de esconder: depois de `--oculto` o
    // elemento continua ocupando o mesmo lugar, mas a decisão já teria sido
    // tomada com a tela em outro ponto se isso rodasse mais tarde.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setEstado("oculto");

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setEstado("revelado");
        observador.disconnect();
      },
      // Margem POSITIVA embaixo: a revelação dispara com a seção ainda 250px
      // abaixo da tela, e não quando ela encosta. Assim os 0,8s de animação
      // correm enquanto o visitante ainda está rolando até lá e a seção chega
      // pronta — que é o oposto do que acontecia antes, com a animação só
      // começando depois de 20% da seção já estar à vista.
      { rootMargin: "0px 0px 250px 0px" }
    );

    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-in fade-in--${estado}`}
      style={delay ? { "--fade-in-atraso": `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
