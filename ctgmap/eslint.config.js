import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
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
    plugins: { react },
    rules: {
      // Marks components referenced in JSX as "used". Base no-unused-vars does
      // not parse JSX, so without this the pattern below has to exempt every
      // PascalCase name and unused component imports slip through unnoticed.
      'react/jsx-uses-vars': 'error',
      // With jsx-uses-vars active, only SCREAMING_CASE constants need exempting.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z][A-Z0-9_]*$' }],
    },
  },
])
