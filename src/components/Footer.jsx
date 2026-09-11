import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import logo from "../assets/logo.webp";

import { NAV_LINKS, SERVICES } from "../data/footer";
import { ANOS_DE_CASA } from "../lib/seo";
import "./Footer.css";

function NavLink({ href, isHome, children }) {
  if (isHome) {
    return <a href={href}>{children}</a>;
  }
  return <Link href={`/${href}`}>{children}</Link>;
}

export default function Footer({ isHome = false, cnpj = "" }) {

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">

          <div className="footer-brand">
            <Image src={logo} alt="JMV Soluções Industriais" className="footer-logo" width={512} height={167} />
            <p className="footer-tagline">
              Excelência técnica em montagem e manutenção industrial há mais de {ANOS_DE_CASA} anos.
            </p>
            {cnpj && <p className="footer-cnpj">CNPJ: {cnpj}</p>}
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Navegação</h4>
            <ul>
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <NavLink href={href} isHome={isHome}>{label}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Serviços</h4>
            <ul>
              {SERVICES.map((s) => (
                <li key={s}>
                  <NavLink href="#servicos" isHome={isHome}>{s}</NavLink>
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
            <NavLink href="#contato" isHome={isHome}>
              <span className="footer-cta-link">
                Solicitar orçamento <ArrowUpRight size={14} />
              </span>
            </NavLink>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {new Date().getFullYear()} JMV Soluções Industriais. Todos os direitos reservados.</span>
          <span>Matão — São Paulo — Brasil</span>
          {/* A política precisa ser alcançável de QUALQUER página. Até 09/2026 o
              único caminho era o formulário da home, então quem entrasse direto
              em /portfolio não tinha como chegar nela. */}
          <Link href="/privacidade" className="footer-privacidade-link">
            Política de Privacidade
          </Link>
          <span>Desenvolvido por Vinicius Santos</span>
        </div>
      </div>
    </footer>
  );
}
