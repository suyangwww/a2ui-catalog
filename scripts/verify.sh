#!/usr/bin/env bash
set -euo pipefail

echo "==> 1/5 Typecheck"
pnpm typecheck

echo "==> 2/5 Lint & architectural boundaries"
pnpm lint

echo "==> 3/5 Doc & AGENTS.md integrity"
node scripts/check-docs.mjs

echo "==> 4/5 Unit, boundary & A2UI contract tests"
pnpm test --run

echo "==> 5/5 Catalog schema compilation check"
pnpm build:catalog
