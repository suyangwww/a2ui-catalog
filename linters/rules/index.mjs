/**
 * Custom Agent-First ESLint rules for `a2ui-catalog` with explicit REMEDIATION hints.
 */
export const luminaEslintPlugin = {
  meta: {
    name: 'eslint-plugin-lumina',
    version: '1.0.0',
  },
  rules: {
    'no-unsafe-type-cast': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow TypeScript `as` type assertions in production src/ modules.',
        },
        messages: {
          noAsCast:
            'REMEDIATION: Do not use `as` type assertions in production code. Parse untrusted values with a Zod schema or use runtime type guards from `src/primitives/value-readers.ts`. See AGENTS.md.',
        },
        schema: [],
      },
      create(context) {
        return {
          TSAsExpression(node) {
            if (
              node.typeAnnotation?.type === 'TSTypeReference' &&
              node.typeAnnotation.typeName?.type === 'Identifier' &&
              node.typeAnnotation.typeName.name === 'const'
            ) {
              return;
            }
            context.report({ node, messageId: 'noAsCast' });
          },
        };
      },
    },
    'narrow-slice-seam': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow `export *` barrel leaks in slice index.ts Seams.',
        },
        messages: {
          noExportAll:
            'REMEDIATION: Slice `index.ts` Seams must stay narrow and explicit. Export only the `defineCatalogComponent` / `defineCatalogFunction` descriptor and public `Props` type instead of `export *`. See ARCHITECTURE.md.',
        },
        schema: [],
      },
      create(context) {
        return {
          ExportAllDeclaration(node) {
            context.report({ node, messageId: 'noExportAll' });
          },
        };
      },
    },
  },
};
