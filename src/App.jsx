import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { usePageTracking } from "./hooks/usePageTracking";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import Navbar          from "./components/Navbar";
import Hero            from "./components/Hero";
import Stats           from "./components/Stats";
import About           from "./components/About";
import Services        from "./components/Services";
import Quality         from "./components/Quality";
import Portfolio       from "./components/Portfolio";
import Testimonials    from "./components/Testimonials";
import Clients         from "./components/Clients";
import CTA             from "./components/CTA";
import Contact         from "./components/Contact";
import Footer          from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import CookieBanner    from "./components/CookieBanner";
import ErrorBoundary   from "./components/ErrorBoundary";

import PortfolioPage   from "./pages/PortfolioPage";
import PrivacidadePage from "./pages/PrivacidadePage";
import NotFoundPage    from "./pages/NotFoundPage";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

function safeGetConsent() {
  try {
    return localStorage.getItem("lgpd-consent");
  } catch {
    console.warn("[ERR_STORAGE] localStorage indisponível — analytics desativado.");
    return null;
  }
}

function loadGA() {
  if (!GA_ID || window.__gaLoaded) return;
  window.__gaLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
}

function ConditionalAnalytics() {
  const [consent, setConsent] = useState(() => safeGetConsent());

  useEffect(() => {
    const onConsent = () => setConsent(safeGetConsent());
    window.addEventListener("lgpd-consent", onConsent);
    return () => window.removeEventListener("lgpd-consent", onConsent);
  }, []);

  useEffect(() => {
    if (consent === "accepted") loadGA();
  }, [consent]);

  if (consent !== "accepted") return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

function PageTracker() {
  usePageTracking();
  return null;
}

function ScrollToHash() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      try { history.replaceState(null, "", "/"); } catch { /* sandbox */ }
    }
  }, [hash]);
  return null;
}

const pageTransition = {
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0  },
  exit:       { opacity: 0, y: -12 },
  transition: { duration: 0.22, ease: "easeInOut" },
};

function PageWrapper({ children }) {
  return <motion.div {...pageTransition}>{children}</motion.div>;
}

function Home() {
  return (
    <>
      <ScrollToHash />
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Services />
      <Quality />
      <Portfolio />
      <Testimonials />
      <Clients />
      <CTA />
      <Contact />
      <Footer />
      <FloatingButtons />
      <CookieBanner />
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"            element={<ErrorBoundary><PageWrapper><Home /></PageWrapper></ErrorBoundary>} />
        <Route path="/portfolio"   element={<ErrorBoundary><PageWrapper><PortfolioPage /></PageWrapper></ErrorBoundary>} />
        <Route path="/privacidade" element={<ErrorBoundary><PageWrapper><PrivacidadePage /></PageWrapper></ErrorBoundary>} />
        <Route path="*"            element={<ErrorBoundary><PageWrapper><NotFoundPage /></PageWrapper></ErrorBoundary>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PageTracker />
      <AnimatedRoutes />
      <ConditionalAnalytics />
    </BrowserRouter>
  );
}
