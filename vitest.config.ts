import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: [
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
      'src/components/**/*.test.ts',
      'src/components/**/*.test.tsx',
      'src/functions/**/*.test.ts',
    ],
  },
});
