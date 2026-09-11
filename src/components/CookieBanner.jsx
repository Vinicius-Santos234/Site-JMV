"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { ler, gravar, assinar } from "@/lib/consent";
import "./CookieBanner.css";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  // Antes isto lia o armazenamento SÓ na montagem. Como o banner vive no layout
  // raiz, ele não remonta em navegação client-side — então revogar o
  // consentimento em /privacidade não o trazia de volta, e a política prometia
  // que traria. Agora ele acompanha a preferência.
  useEffect(() => {
    let timer;

    const avaliar = () => {
      clearTimeout(timer);
      if (ler()) {
        setVisible(false);
      } else {
        timer = setTimeout(() => setVisible(true), 1200);
      }
    };

    avaliar();
    const cancelar = assinar(avaliar);
    return () => {
      clearTimeout(timer);
      cancelar();
    };
  }, []);

  const accept = () => {
    gravar("accepted");
    setVisible(false);
  };

  const decline = () => {
    gravar("declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Aviso de cookies">
      <div className="cookie-banner-content">
        <Cookie size={22} className="cookie-icon" />
        <p>
          Utilizamos cookies para melhorar sua experiência. Ao continuar
          navegando, você concorda com nossa{" "}
          <Link href="/privacidade">
            Política de Privacidade
          </Link>{" "}
          em conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong>.
        </p>
      </div>

      <div className="cookie-buttons">
        <button className="cookie-btn-decline" onClick={decline}>
          Recusar
        </button>
        <button className="cookie-btn-accept btn-primary" onClick={accept}>
          Aceitar cookies
        </button>
      </div>
    </div>
  );
}