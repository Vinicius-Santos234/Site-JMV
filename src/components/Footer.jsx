import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import logo from "../assets/logo.png";

import { NAV_LINKS } from "../data/footer";
import { SERVICES } from "../data/footer";

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  function navHref(hash) {
    return isHome ? hash : `/${hash}`;
  }

  function NavLink({ href, children }) {
    if (isHome) {
      return <a href={href}>{children}</a>;
    }
    return <Link to={`/${href}`}>{children}</Link>;
  }

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">

          <div className="footer-brand">
            <img src={logo} alt="JMV Engenharia" className="footer-logo" />
            <p className="footer-tagline">
              Excelência técnica em montagem e manutenção industrial há mais de 13 anos.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Navegação</h4>
            <ul>
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <NavLink href={href}>{label}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Serviços</h4>
            <ul>
              {SERVICES.map((s) => (
                <li key={s}>
                  <NavLink href="#servicos">{s}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Contato</h4>
            <ul className="footer-contact-list">
              <li>
                <Phone size={15} />
                <a href="tel:+5516997418402">(16) 99741-8402</a>
              </li>
              <li>
                <Mail size={15} />
                <a href="mailto:jpsantos@jmv.ind.br">jpsantos@jmv.ind.br</a>
              </li>
              <li>
                <MapPin size={15} />
                <span>Rua São Lourenço, 2170<br />IV Centenário — Matão, SP</span>
              </li>
            </ul>
            <NavLink href="#contato">
              <span className="footer-cta-link">
                Solicitar orçamento <ArrowUpRight size={14} />
              </span>
            </NavLink>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {new Date().getFullYear()} JMV Engenharia e Construções. Todos os direitos reservados.</span>
          <span>Matão — São Paulo — Brasil</span>
        </div>
      </div>
    </footer>
  );
}
