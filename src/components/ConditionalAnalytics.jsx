"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ler, assinar } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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

// O consentimento é estado de fora do React (localStorage + um evento), e no
// servidor não existe. `useSyncExternalStore` é feito para isso: o snapshot do
// servidor é `null`, então o HTML sai sem analytics e a hidratação não briga.
export default function ConditionalAnalytics() {
  const consent = useSyncExternalStore(assinar, ler, () => null);
  const pathname = usePathname();

  useEffect(() => {
    if (consent === "accepted") loadGA();
  }, [consent]);

  // page_view manual: o GA é configurado com send_page_view: false para que a
  // navegação client-side também conte.
  useEffect(() => {
    if (consent !== "accepted") return;
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", { page_path: pathname });
  }, [consent, pathname]);

  if (consent !== "accepted") return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
