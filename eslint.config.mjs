import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { luminaEslintPlugin } from './linters/rules/index.mjs';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      lumina: luminaEslintPlugin,
    },
    rules: {
      'max-lines': ['error', { max: 350, skipBlankLines: true, skipComments: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    plugins: {
      lumina: luminaEslintPlugin,
    },
    rules: {
      'lumina/no-unsafe-type-cast': 'error',
    },
  },
  {
    files: ['src/components/*/index.ts', 'src/functions/*/index.ts'],
    plugins: {
      lumina: luminaEslintPlugin,
    },
    rules: {
      'lumina/narrow-slice-seam': 'error',
    },
  },
);
