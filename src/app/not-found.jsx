import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./NotFoundPage.css";

// Além do visual, isto conserta o soft 404 medido em 11/09: no Vite toda rota
// inexistente respondia HTTP 200 com o HTML da home, e virava página indexável.
// O not-found do App Router responde 404 de verdade.
export const metadata = {
  title: "Página não encontrada | JMV Soluções Industriais",
  description: "A página que você procura não existe ou foi movida.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Navbar />

      <section className="not-found-section">
        <div className="container not-found-inner">
          <AlertCircle size={56} className="not-found-icon" />
          <h1>404</h1>
          <p>A página que você procura não existe ou foi movida.</p>
          <Link href="/" className="btn-primary">
            <ArrowLeft size={16} />
            Voltar ao início
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
