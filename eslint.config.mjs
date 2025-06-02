import { FlatCompat } from '@eslint/eslintrc';
import pluginQuery from '@tanstack/eslint-plugin-query';
import perfectionist from 'eslint-plugin-perfectionist';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'plugin:prettier/recommended',
      'plugin:jsx-a11y/recommended'
    ],
    plugins: ['project-structure', 'perfectionist', 'prettier', 'jsx-a11y'],
    rules: {
      'project-structure/independent-modules': 'error',
      ...perfectionist.configs['recommended-natural'].rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      'import/order': 'off',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'perfectionist/sort-imports': [
        'error',
        {
          customGroups: [
            {
              elementNamePattern: ['^react$', '^react-.+'],
              groupName: 'react',
              selector: 'import'
            },
            {
              elementNamePattern: ['^next$', '^next-.+'],
              groupName: 'next',
              selector: 'import'
            }
          ],
          groups: [
            ['react', 'next'],
            'type-import',
            ['value-builtin', 'value-external'],
            'type-internal',
            'value-internal',
            ['type-parent', 'type-sibling', 'type-index'],
            ['value-parent', 'value-sibling', 'value-index'],
            'ts-equals-import',
            'unknown'
          ],
          internalPattern: ['^@/.+', '^~/.+'],
          newlinesBetween: 'always',
          order: 'asc',
          type: 'natural'
        }
      ],
      'project-structure/independent-modules': 'error',
      'sort-imports': 'off'
    },
    settings: {
      'project-structure/independent-modules-config-path':
        'independentModules.jsonc',
      ...perfectionist.configs['recommended-natural'].settings
    }
  }),
  ...pluginQuery.configs['flat/recommended']
];

export default eslintConfig;
