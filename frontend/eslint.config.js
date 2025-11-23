import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import { FlatCompat } from '@eslint/eslintrc'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Define the plugin object for ESLint to use.
  {
    plugins: {
      'react-hooks': reactHooks,
    },
  },
  // Now, apply the recommended rules from the plugin.
  ...compat.config(reactHooks.configs['recommended-latest']),
  // Project-specific overrides
  {
    ignores: ['dist'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]
