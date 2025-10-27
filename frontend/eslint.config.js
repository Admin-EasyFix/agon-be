import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // reactHooks.configs['recommended-latest'] is a single config object, not an iterable.
  // It should be included directly without the spread operator.
  reactHooks.configs['recommended-latest'],
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
