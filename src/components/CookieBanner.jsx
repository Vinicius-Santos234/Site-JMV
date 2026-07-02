import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import "./CookieBanner.css";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("lgpd-consent");
      if (!consent) {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      console.warn("[ERR_STORAGE] localStorage indisponível — banner de cookies desativado.");
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem("lgpd-consent", "accepted"); } catch { /* inacessível */ }
    window.dispatchEvent(new Event("lgpd-consent"));
    setVisible(false);
  };

  const decline = () => {
    try { localStorage.setItem("lgpd-consent", "declined"); } catch { /* inacessível */ }
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
          <a href="/privacidade" target="_blank" rel="noreferrer">
            Política de Privacidade
          </a>{" "}
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