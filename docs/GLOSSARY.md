# Glossary of Canonical A2UI & Catalog Terms

Status: Active
Owner: Catalog Architecture
Last Verified: 2026-11-19

Use these exact terms across code, schemas, `prompt.md` files, tests, and documentation. Do **not** invent synonyms such as "widget", "block", "element", or "cardlet" for A2UI primitives.

| Term | Definition |
| :--- | :--- |
| **Wire Message** | A single A2UI v1.0 JSON envelope (`"version": "1.0"`) containing exactly one command: `createSurface`, `updateComponents`, `updateDataModel`, or `deleteSurface`. |
| **Surface** | A named, stateful UI tree (`surfaceId`) backed by a reactive JSON Pointer **Data Model** and bound to a `catalogId`. |
| **Catalog** | A versioned collection (`protocolVersion: "1.0"`) of **Components** and **Catalog Functions** identified by a canonical URI (`LUMINA_V1_CATALOG_ID`). |
| **Component** | A declarative UI building block registered in `src/components/<slug>/` and instantiated in a Surface via `{ "id": "...", "component": "<Id>", ...props }`. |
| **Catalog Function** | A pure formatter, validator, or client side-effect handler registered in `src/functions/<slug>/` and invoked via `{ "@call": "<name>", "args": { ... } }`. |
| **Data Model** | Per-surface reactive JSON state read and mutated via JSON Pointer paths (`{ "@path": "/seats" }`). |
| **Dynamic Value** | An A2UI v1.0 property value that accepts a literal, a `{ "@path": "..." }` binding, or a `{ "@call": "..." }` expression (`DynamicString`, `DynamicNumber`, `DynamicBoolean`, `DynamicStringList`). |
| **Check Rule** | A client-side validation rule in `@checks` (`{ "condition": DynamicBoolean, "message": "..." }`) that gates interactive Components such as `Button` and `ApprovalCard`. |
| **Composition Rule** | Explicit declaration (`allowedChildren`) of whether a Component is a leaf (`'none'`), single-slot container (`'single'`), multi-child layout (`'multiple'`), or slot-named host (`string[]`). |
| **Slice** | A self-contained vertical directory under `src/components/<slug>/` or `src/functions/<slug>/` co-locating schema, prompt, examples, renderer/implementation, seam tests, and `index.ts`. |
| **Seam** | The narrow public `index.ts` boundary of a Slice. All cross-module imports and black-box unit tests target the Seam, never internal slice files. |
