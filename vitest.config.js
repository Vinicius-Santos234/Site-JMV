import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// O Vitest continua usando o pipeline do Vite para transformar JSX — só o
// build de produção é que passou a ser o do Next.
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.jsx"],
    env: {
      // Zera o Sanity nos testes: sem isso o .env.local local vaza e os testes
      // passam a depender do ambiente. Lição de 03/07.
      SANITY_PROJECT_ID: "",
      SANITY_DATASET: "",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules/", "src/test/", ".next/"],
    },
  },
});
