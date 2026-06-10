import { BrowserRouter, Routes, Route } from "react-router-dom";

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

import PortfolioPage   from "./pages/PortfolioPage";

function Home() {
  return (
    <>
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
      </Routes>
    </BrowserRouter>
  );
}