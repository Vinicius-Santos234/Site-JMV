"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.webp";
import { LINKS } from "../data/navbar";
import { scrollToSection } from "../utils/scrollToSection";
import "./Navbar.css";

export default function Navbar({ isHome = false }) {
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const progressRef = useRef(null);

  /**
   * Encolher a navbar e preencher a barra de progresso saem do MESMO listener,
   * porque são a mesma pergunta ("onde estamos na página?") feita duas vezes.
   *
   * Duas decisões que não são estilo:
   *
   * 1. A barra é escrita direto no `style` do nó, não em estado. `scrollY` muda
   *    a cada frame; um `useState` aqui re-renderizaria a navbar inteira — e a
   *    lista de links com ela — dezenas de vezes por segundo. `setScrolled`
   *    pode ficar porque o React descarta o re-render quando o booleano não
   *    muda, o que é o caso em 99% dos frames.
   * 2. `requestAnimationFrame` como comporta: o evento de scroll dispara mais
   *    rápido que a taxa de pintura, e ler `scrollHeight` força o layout. Sem a
   *    comporta, é layout thrashing na thread principal durante toda a rolagem.
   */
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 50);

      const bar = progressRef.current;
      if (!bar) return;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = `scaleX(${ratio})`;
    };

    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", agendar, { passive: true });

    /* Rolar não é a única coisa que muda a fração lida da página — o
       DENOMINADOR também muda. Girar o celular, redimensionar a janela ou
       abrir uma resposta do FAQ altera `scrollHeight` sem gerar um único
       evento de scroll, e a barra ficaria mentindo até a pessoa rolar de novo.

       O ResizeObserver no body cobre o conteúdo que cresce; o `resize` cobre a
       viewport, que o observer não vê. `update` só escreve um `transform`, que
       não afeta layout — então observar o body não realimenta o observer. */
    window.addEventListener("resize", agendar, { passive: true });

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(agendar) : null;
    observer?.observe(document.body);

    update();

    return () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 992) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleNavLink = (hash) => (e) => {
    e.preventDefault();
    scrollToSection(hash);
    closeMenu();
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        <Image src={logo} alt="JMV Soluções Industriais" className="logo" width={512} height={167} priority />

        <div className={`nav-links${menuOpen ? " nav-links--open" : ""}`}>
          {LINKS.map(({ href, label }) => (
            isHome ? (
              <a
                key={href}
                href={href}
                className={activeSection === href.slice(1) ? "active" : ""}
                onClick={handleNavLink(href)}
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={`/${href}`}
                onClick={closeMenu}
              >
                {label}
              </Link>
            )
          ))}
        </div>

        {isHome ? (
          <a href="#contato" className="btn-primary" onClick={handleNavLink("#contato")}>
            Solicitar orçamento
          </a>
        ) : (
          <Link href="/#contato" className="btn-primary" onClick={closeMenu}>
            Solicitar orçamento
          </Link>
        )}

        <button
          className={`hamburger${menuOpen ? " hamburger--open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Decoração pura: o progresso já está visível na barra de rolagem do
            navegador, então anunciá-lo de novo só atrapalha quem usa leitor. */}
        <div className="navbar-progress" aria-hidden="true">
          <span ref={progressRef} className="navbar-progress-bar" />
        </div>
      </nav>

      {menuOpen && (
        <div className="nav-overlay" onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  );
}