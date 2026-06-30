import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.webp";
import { LINKS } from "../data/navbar";
import { scrollToSection } from "../utils/scrollToSection";

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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

  const location = useLocation();
  const isHome = location.pathname === "/";

  const closeMenu = () => setMenuOpen(false);

  const handleNavLink = (hash) => (e) => {
    e.preventDefault();
    scrollToSection(hash);
    closeMenu();
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        <img src={logo} alt="JMV Engenharia" className="logo" />

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
                to={`/${href}`}
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
          <Link to="/#contato" className="btn-primary" onClick={closeMenu}>
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
      </nav>

      {menuOpen && (
        <div className="nav-overlay" onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  );
}