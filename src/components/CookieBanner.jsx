import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("lgpd-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("lgpd-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("lgpd-consent", "declined");
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