# Spec 0001: A2UI Lumina v1.0 Component & Function Catalog

Status: Active
Owner: Catalog Team
Last Verified: 2026-11-20

## Summary

Defines the normative contract for the **49 A2UI v1.0 Components** (18 Basic Catalog v1.0 superset primitives + 31 agentic & intelligent UI primitives) and **24 Catalog Functions** (14 Basic v1.0 + 10 Lumina reactive & formatting functions) implemented across `src/components/*` and `src/functions/*`.

## Normative References

- **Visual, Motion & Multi-Platform Design:** [docs/DESIGN.md](../DESIGN.md)
- **Full Property & Function Schemas:** [docs/COMPONENT_CATALOG_SPEC.md](../COMPONENT_CATALOG_SPEC.md)
- **Plain-English Usage Playbook:** [docs/PLAYBOOK.md](../PLAYBOOK.md)
- **Platform Extension Guide (Angular, Flutter, SwiftUI, Compose):** [docs/PLATFORM_EXTENSION_GUIDE.md](../PLATFORM_EXTENSION_GUIDE.md)

## Acceptance Invariants

1. Compiled `dist/catalog.json` and `packages/schema/catalog.json` pass Ajv Draft 2020-12 validation against upstream A2UI v1.0 `catalog_definition.json`.
2. All 43 upstream Basic Catalog v1.0 golden examples parse and render cleanly.
3. Every Component Slice in `src/components/<slug>/` passes `tests/catalog-contract.test.ts` and `tests/preview-smoke.spec.ts`.
