/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-external-deep-imports-into-components',
      severity: 'error',
      comment:
        "REMEDIATION: External modules cannot import internal files of a component slice. Import exclusively from 'src/components/<slug>/index.ts' (or '.js') or extract shared utilities to 'src/protocol/' or 'src/primitives/'. See ARCHITECTURE.md.",
      from: { path: '^src/(?!components/)' },
      to: { path: '^src/components/[^/]+/(?!index\\.ts$)' },
    },
    {
      name: 'no-sibling-deep-imports-between-components',
      severity: 'error',
      comment:
        "REMEDIATION: Sibling component slices cannot import each other's internal files. Import only from 'src/components/<slug>/index.ts' (or '.js'). See ARCHITECTURE.md.",
      from: { path: '^src/components/([^/]+)/' },
      to: {
        path: '^src/components/',
        pathNot: ['^src/components/$1/', '^src/components/[^/]+/index\\.ts$'],
      },
    },
    {
      name: 'no-external-deep-imports-into-functions',
      severity: 'error',
      comment:
        "REMEDIATION: External modules cannot import internal files of a function slice. Import exclusively from 'src/functions/<slug>/index.ts' (or '.js'). See ARCHITECTURE.md.",
      from: { path: '^src/(?!functions/)' },
      to: { path: '^src/functions/[^/]+/(?!index\\.ts$)' },
    },
    {
      name: 'no-sibling-deep-imports-between-functions',
      severity: 'error',
      comment:
        "REMEDIATION: Sibling function slices cannot import each other's internal files. Import only from 'src/functions/<slug>/index.ts' (or '.js'). See ARCHITECTURE.md.",
      from: { path: '^src/functions/([^/]+)/' },
      to: {
        path: '^src/functions/',
        pathNot: ['^src/functions/$1/', '^src/functions/[^/]+/index\\.ts$'],
      },
    },
    {
      name: 'protocol-must-stay-pure',
      severity: 'error',
      comment:
        "REMEDIATION: Layer 0 ('src/protocol') cannot import from primitives, components, functions, catalog, preview, or React. Keep protocol types dependency-free. See ARCHITECTURE.md.",
      from: { path: '^src/protocol/' },
      to: {
        path: '^(src/(primitives|components|functions|catalog|preview)/|node_modules/.*react)',
      },
    },
    {
      name: 'primitives-cannot-import-upper-layers',
      severity: 'error',
      comment:
        "REMEDIATION: Layer 0.5 ('src/primitives') may only import from 'src/protocol' or external UI packages, never from components, functions, catalog, or preview. See ARCHITECTURE.md.",
      from: { path: '^src/primitives/' },
      to: { path: '^src/(components|functions|catalog|preview)/' },
    },
    {
      name: 'components-cannot-import-catalog-or-preview',
      severity: 'error',
      comment:
        "REMEDIATION: Layer 1 ('src/components') cannot import Layer 2 ('src/catalog') or Layer 3 ('src/preview'). Inject dependencies via props/protocol types instead. See ARCHITECTURE.md.",
      from: { path: '^src/components/' },
      to: { path: '^src/(catalog|preview)/' },
    },
    {
      name: 'functions-cannot-import-ui-or-upper-layers',
      severity: 'error',
      comment:
        "REMEDIATION: Layer 1 ('src/functions') cannot import primitives, components, catalog, or preview. Keep catalog functions framework-independent. See ARCHITECTURE.md.",
      from: { path: '^src/functions/' },
      to: { path: '^src/(primitives|components|catalog|preview)/' },
    },
    {
      name: 'catalog-cannot-import-preview',
      severity: 'error',
      comment:
        "REMEDIATION: Layer 2 ('src/catalog') cannot import Layer 3 ('src/preview'). See ARCHITECTURE.md.",
      from: { path: '^src/catalog/' },
      to: { path: '^src/preview/' },
    },
    {
      name: 'no-circular-dependencies',
      severity: 'error',
      comment:
        "REMEDIATION: Circular dependency detected. Break the cycle by extracting shared types into 'src/protocol/index.ts' or 'src/primitives/index.ts'. See ARCHITECTURE.md.",
      from: { path: '^src/' },
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
  },
};
