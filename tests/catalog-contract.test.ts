import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { catalogRegistry } from '../src/catalog/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');
const FUNCTIONS_DIR = path.resolve(__dirname, '../src/functions');

describe('A2UI Catalog Structural & Cross-Artifact Contract', () => {
  const componentDirs = fs
    .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const functionDirs = fs
    .readdirSync(FUNCTIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  it('registers all 49 component slice directories in src/catalog/registry.ts', () => {
    expect(componentDirs).toHaveLength(49);
    const registeredSlugs = new Set(catalogRegistry.listComponentSlugs());
    for (const dir of componentDirs) {
      expect(
        registeredSlugs.has(dir),
        `REMEDIATION: Component folder 'src/components/${dir}' is not registered in 'src/catalog/registry.ts'. Register it or remove the orphaned folder.`,
      ).toBe(true);
    }
  });

  it('registers all function slice directories in src/catalog/registry.ts', () => {
    const registeredFnSlugs = new Set(catalogRegistry.listFunctionSlugs());
    for (const dir of functionDirs) {
      expect(
        registeredFnSlugs.has(dir),
        `REMEDIATION: Function folder 'src/functions/${dir}' is not registered in 'src/catalog/registry.ts'.`,
      ).toBe(true);
    }
  });

  for (const dir of componentDirs) {
    describe(`component slice: ${dir}`, () => {
      const slicePath = path.join(COMPONENTS_DIR, dir);

      it('contains all required vertical slice artifacts', () => {
        for (const required of [
          'index.ts',
          'schema.ts',
          'prompt.md',
          'examples.json',
          'renderer.tsx',
          `${dir}.test.tsx`,
        ]) {
          expect(
            fs.existsSync(path.join(slicePath, required)),
            `REMEDIATION: Missing '${required}' in 'src/components/${dir}/'. See .agents/skills/add-component/SKILL.md.`,
          ).toBe(true);
        }
      });

      it('validates every fixture in examples.json against its Zod propsSchema', () => {
        const entry = catalogRegistry.getComponentBySlug(dir);
        expect(entry, `Missing registry entry for slug '${dir}'`).toBeDefined();
        if (!entry) return;

        const examples = JSON.parse(
          fs.readFileSync(path.join(slicePath, 'examples.json'), 'utf8'),
        ) as Array<{ title?: string; props?: unknown }>;

        expect(Array.isArray(examples) && examples.length > 0).toBe(true);

        for (const [idx, example] of examples.entries()) {
          const parsed = entry.propsSchema.safeParse(example.props);
          expect(
            parsed.success,
            `REMEDIATION: Example #${idx} in 'src/components/${dir}/examples.json' failed schema validation: ${
              parsed.success ? '' : JSON.stringify(parsed.error.issues)
            }`,
          ).toBe(true);
        }
      });

      it('keeps prompt.md concise (<1500 chars) and aligned with schema property names', () => {
        const entry = catalogRegistry.getComponentBySlug(dir);
        expect(entry).toBeDefined();
        if (!entry) return;

        const prompt = fs.readFileSync(path.join(slicePath, 'prompt.md'), 'utf8').trim();
        expect(prompt.length).toBeGreaterThan(20);
        expect(
          prompt.length,
          `REMEDIATION: 'src/components/${dir}/prompt.md' is ${prompt.length} chars (max 1500). Trim verbose prose to protect agent context budgets.`,
        ).toBeLessThan(1500);

        const shapeKeys = new Set(Object.keys(entry.schemaKeys));
        const propsLine = prompt
          .split('\n')
          .find((line) => line.startsWith('Props:'));
        expect(
          Boolean(propsLine),
          `REMEDIATION: Include a 'Props:' line in 'src/components/${dir}/prompt.md' listing supported properties.`,
        ).toBe(true);

        if (propsLine) {
          const mentioned = Array.from(propsLine.matchAll(/`([a-zA-Z0-9_@]+)`/g)).map(
            (m) => m[1]!,
          );
          for (const prop of mentioned) {
            if (prop.startsWith('@')) continue;
            expect(
              shapeKeys.has(prop),
              `REMEDIATION: 'src/components/${dir}/prompt.md' mentions property '${prop}' which does not exist in 'src/components/${dir}/schema.ts'. Run .agents/skills/doc-gardening/SKILL.md.`,
            ).toBe(true);
          }
        }
      });
    });
  }

  for (const dir of functionDirs) {
    describe(`function slice: ${dir}`, () => {
      const slicePath = path.join(FUNCTIONS_DIR, dir);

      it('contains index.ts, schema.ts, and seam unit test', () => {
        for (const required of ['index.ts', 'schema.ts', `${dir}.test.ts`]) {
          expect(
            fs.existsSync(path.join(slicePath, required)),
            `REMEDIATION: Missing '${required}' in 'src/functions/${dir}/'.`,
          ).toBe(true);
        }
      });
    });
  }
});
