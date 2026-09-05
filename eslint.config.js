import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Browser persistence is best-effort in this app; empty catch blocks are
      // intentional so unavailable localStorage does not break the study UI.
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Initial localStorage hydration is an intentional one-time effect. The
      // app has no server-rendering path, so the extra initial render is bounded.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
