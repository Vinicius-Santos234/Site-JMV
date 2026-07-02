import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />

      <section className="not-found-section">
        <div className="container not-found-inner">
          <AlertCircle size={56} className="not-found-icon" />
          <h1>404</h1>
          <p>A página que você procura não existe ou foi movida.</p>
          <Link to="/" className="btn-primary">
            <ArrowLeft size={16} />
            Voltar ao início
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
