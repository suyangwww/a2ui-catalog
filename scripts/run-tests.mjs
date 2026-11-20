import { execSync } from 'node:child_process';

const steps = [
  'pnpm exec vitest run',
  'pnpm --filter @a2ui-catalog/core test',
  'pnpm --filter @a2ui-catalog/schema test',
  'pnpm --filter @a2ui-catalog/react test',
  'pnpm --filter @a2ui-catalog/agent test',
];

for (const cmd of steps) {
  execSync(cmd, { stdio: 'inherit' });
}
