"use client";

import { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

function ClientLogo({ client, clone = false }) {
  return (
    <div
      className="client-card"
      data-marquee-clone={clone ? "true" : undefined}
      aria-hidden={clone ? "true" : undefined}
    >
      <Image
        src={client.logo}
        alt={clone ? "" : `Logo ${client.name}`}
        width={400}
        height={200}
        loading="lazy"
      />
    </div>
  );
}

/**
 * Esteira contínua de logos, com pausa de verdade.
 *
 * A pausa no `:hover` sozinha não basta: WCAG 2.2.2 exige um mecanismo para
 * parar movimento automático que dura mais de 5s, e hover não existe para quem
 * navega por teclado nem para quem está no celular. Daí o botão — ele é o
 * mecanismo; o hover continua como conveniência de quem tem cursor.
 *
 * O botão fica FORA de `.clients-marquee` de propósito. Dentro, passar o mouse
 * nele acionaria a pausa por hover, e clicar em "retomar" não retomaria nada
 * enquanto o cursor não saísse — o controle pareceria quebrado justamente para
 * quem o está usando.
 */
export default function ClientsMarquee({ clients = [] }) {
  const [pausado, setPausado] = useState(false);

  return (
    <div className="clients-marquee-wrap">
      <div
        className={`clients-marquee${pausado ? " clients-marquee--pausado" : ""}`}
      >
        {/* Duas cópias como irmãs diretas, e a animação anda exatamente -50%:
            quando o ciclo termina, a cópia está no pixel onde o original
            começou e o reinício é invisível.

            Por isso o espaçamento entre logos é `margin-right` no card, e não
            `gap` na trilha: com `gap`, 2N itens têm 2N-1 vãos, as duas metades
            ficam com larguras diferentes e a volta dá um salto de meio vão. */}
        <div className="clients-track">
          {clients.map((client) => (
            <ClientLogo key={client.id} client={client} />
          ))}
          {clients.map((client) => (
            <ClientLogo key={`clone-${client.id}`} client={client} clone />
          ))}
        </div>
      </div>

      <button
        type="button"
        className="clients-marquee-toggle"
        onClick={() => setPausado((p) => !p)}
        aria-pressed={pausado}
      >
        {pausado ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
        {/* Texto de verdade, não só `aria-label`: é o nome acessível do
            controle e também o que um leitor vidente lê para entender o ícone. */}
        <span>{pausado ? "Retomar rolagem" : "Pausar rolagem"}</span>
      </button>
    </div>
  );
}
