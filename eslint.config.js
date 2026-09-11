import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.next', 'studio']),
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      // reactRefresh.configs.vite saiu junto com o Vite: o Fast Refresh agora é
      // do Next, e a regra reclamaria de todo arquivo que exporta `metadata`.
    ],
    languageOptions: {
      // Server Components e route handlers rodam em Node; componentes de
      // cliente, no navegador. Os dois conjuntos de globais valem no projeto.
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ['src/app/api/**/*.js', 'src/proxy.js', 'src/lib/api/**/*.js', 'scripts/**/*.{js,mjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
