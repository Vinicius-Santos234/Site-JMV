import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mocks globais do Next. Ficam aqui em vez de repetidos em cada arquivo: são
// detalhe de framework, não o que cada teste quer afirmar.

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={typeof href === "string" ? href : "#"} {...props}>{children}</a>
  ),
}));

// next/image não roda o otimizador em jsdom: vira <img> com o src resolvido.
// As props só do Next (priority, fill, loader…) são descartadas de propósito —
// se vazarem para o DOM, o React avisa de atributo desconhecido.
const PROPS_SO_DO_NEXT = new Set([
  "priority", "fill", "loader", "quality", "placeholder",
  "blurDataURL", "unoptimized", "sizes", "onLoadingComplete",
]);

vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }) => {
    const props = Object.fromEntries(
      Object.entries(rest).filter(([k]) => !PROPS_SO_DO_NEXT.has(k))
    );
    const resolved = typeof src === "object" && src !== null ? (src.src ?? "") : src;
    return <img src={resolved} alt={alt} {...props} />;
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
