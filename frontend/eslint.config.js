import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  // Convert legacy/shareable configs (which may declare `plugins` as arrays)
  // into the flat-config format using FlatCompat.
  ...compat.extends(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    reactHooks.configs['recommended-latest']
  ),
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
