import { FlatCompat } from '@eslint/eslintrc'
import perfectionist from 'eslint-plugin-perfectionist'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'plugin:prettier/recommended',
      'plugin:jsx-a11y/recommended',
    ],
    plugins: ['project-structure', 'perfectionist', 'prettier', 'jsx-a11y'],
    rules: {
      'project-structure/independent-modules': 'error',
      ...perfectionist.configs['recommended-natural'].rules,
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'always',
          endOfLine: 'auto',
          plugins: ['prettier-plugin-tailwindcss'],
          printWidth: 80,
          semi: false,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'all',
        },
        {
          usePrettierrc: false,
        },
      ],
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      'project-structure/independent-modules-config-path':
        'independentModules.jsonc',
      ...perfectionist.configs['recommended-natural'].settings,
    },
  }),
]

export default eslintConfig
