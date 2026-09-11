import { getContent } from "@/lib/content";
import { buildFaqSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

import Navbar          from "@/components/Navbar";
import Hero            from "@/components/Hero";
import Stats           from "@/components/Stats";
import About           from "@/components/About";
import Services        from "@/components/Services";
import Quality         from "@/components/Quality";
import Portfolio       from "@/components/Portfolio";
import Testimonials    from "@/components/Testimonials";
import Clients         from "@/components/Clients";
import CTA             from "@/components/CTA";
import FAQ             from "@/components/FAQ";
import Contact         from "@/components/Contact";
import Footer          from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ErrorBoundary   from "@/components/ErrorBoundary";
import ScrollToHash    from "@/components/ScrollToHash";

export const revalidate = 3600;

export default async function Home() {
  // Uma busca no servidor alimenta a página inteira. O conteúdo do CMS já sai
  // no HTML — antes eram 9 queries GROQ saindo do navegador depois do render.
  const c = await getContent();

  return (
    <ErrorBoundary>
      <JsonLd schema={buildFaqSchema(c.faqs)} />
      <ScrollToHash />
      <Navbar isHome />
      <Hero />
      <Stats stats={c.stats} />
      <About differentials={c.differentials} />
      <Services services={c.services} />
      <Quality items={c.qualityItems} />
      <Portfolio projects={c.projects} />
      <Testimonials testimonials={c.testimonials} />
      <Clients clients={c.clients} />
      <CTA highlights={c.ctaHighlights} />
      <FAQ faqs={c.faqs} />
      <Contact />
      <Footer isHome cnpj={c.cnpj} />
      <FloatingButtons />
    </ErrorBoundary>
  );
}
