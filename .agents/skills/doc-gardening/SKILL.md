---
name: doc-gardening
description: Verify alignment across schema.ts, prompt.md, examples.json, GLOSSARY.md, ARCHITECTURE.md, and QUALITY_SCORE.md.
---

# Skill: Documentation Gardening & Drift Repair

Execute this workflow to keep repository documentation 100% synchronized with `src/`.

## Verification Steps

1. **Automated Structural & Link Checks:**
   - Run `node scripts/check-docs.mjs` to verify `AGENTS.md` line count (`<= 100`), valid markdown links in `AGENTS.md` and `ARCHITECTURE.md`, and required metadata headers (`Status:`, `Owner:`, `Last Verified:`) across `docs/adr/` and `docs/specs/`.
2. **Prompt-to-Schema Property Alignment:**
   - Compare every backticked identifier in `src/components/*/prompt.md` against the keys of `PropsSchema.shape` in the corresponding `src/components/*/schema.ts` (enforced in `tests/catalog-contract.test.ts`). Remove or rename any stale property reference immediately.
3. **Glossary Consistency:**
   - Check recent docs and `prompt.md` files against [docs/GLOSSARY.md](../../../docs/GLOSSARY.md) to ensure canonical terms (`Surface`, `Component`, `Catalog Function`, `Data Model`, `Slice`, `Seam`) are used consistently.
4. **Refresh Quality Grades:**
   - Run `pnpm quality:score` to regenerate [docs/QUALITY_SCORE.md](../../../docs/QUALITY_SCORE.md) and commit any updated metrics in a small, focused PR.
