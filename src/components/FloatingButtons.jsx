import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="28"
      height="28"
      fill="white"
      aria-hidden="true"
    >
      <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.471 2.023 7.774L0 32l8.463-2.001A15.93 15.93 0 0 0 16 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.25a13.21 13.21 0 0 1-6.738-1.843l-.483-.287-4.997 1.181 1.24-4.862-.315-.499A13.188 13.188 0 0 1 2.75 16C2.75 8.682 8.682 2.75 16 2.75S29.25 8.682 29.25 16 23.318 29.25 16 29.25zm7.27-9.773c-.398-.199-2.353-1.161-2.718-1.294-.365-.133-.631-.199-.897.199-.266.398-1.03 1.294-1.263 1.56-.232.266-.465.299-.863.1-.398-.199-1.681-.62-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.175-.811.18-.178.398-.465.597-.698.199-.232.266-.398.398-.664.133-.266.066-.498-.033-.697-.1-.199-.897-2.163-1.23-2.96-.323-.778-.651-.673-.897-.685l-.764-.013c-.266 0-.697.1-1.062.498-.365.398-1.395 1.362-1.395 3.32s1.428 3.85 1.627 4.116c.199.266 2.808 4.286 6.804 6.013.951.41 1.693.655 2.272.838.954.303 1.823.26 2.51.158.766-.114 2.353-.962 2.685-1.89.332-.929.332-1.725.232-1.891-.1-.166-.365-.266-.764-.465z" />
    </svg>
  );
}

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <a
        href="https://wa.me/5516997418402?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento."
        target="_blank"
        rel="noreferrer"
        className="whatsapp-button"
        aria-label="Falar pelo WhatsApp"
      >
        <WhatsAppIcon />
      </a>

      {showTop && (
        <button
          className="top-button"
          onClick={scrollTop}
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}