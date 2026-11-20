import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { Catalog, MessageProcessor } from '@a2ui/web_core';
import { A2uiGenerator, CatalogConfig, DirectJsonFormatFactory } from '@a2ui/agent';
import {
  LUMINA_V1_CATALOG_ID,
  luminaCoreCatalog,
  processLuminaMessages,
} from '@a2ui-catalog/core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '..');
const vendorDir = path.join(pkgRoot, 'vendor/v1_0');
const catalogPath = path.join(pkgRoot, 'catalog.json');

describe('@a2ui-catalog/schema A2UI v1.0 Conformance', () => {
  it('validates catalog.json against A2UI v1.0 catalog_definition.json', () => {
    const catalogJson = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const commonTypes = JSON.parse(fs.readFileSync(path.join(vendorDir, 'common_types.json'), 'utf8'));
    const catalogDef = JSON.parse(fs.readFileSync(path.join(vendorDir, 'catalog_definition.json'), 'utf8'));

    const ajv = new Ajv2020({ strict: false, allErrors: true });
    addFormats(ajv);
    ajv.addSchema(commonTypes, 'common_types.json');

    const validate = ajv.compile(catalogDef);
    const valid = validate(catalogJson);
    expect(validate.errors ?? []).toEqual([]);
    expect(valid).toBe(true);
    expect(catalogJson.protocolVersion).toBe('1.0');
    expect(Object.keys(catalogJson.components)).toHaveLength(49);
    expect(Object.keys(catalogJson.functions)).toHaveLength(24);
  });

  it('loads into @a2ui/agent A2uiGenerator and compiles LLM system prompt cleanly', () => {
    const catalogJson = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const catalog = Catalog.fromJson(catalogJson);
    const generator = new A2uiGenerator(
      [new CatalogConfig(catalog)],
      undefined,
      new DirectJsonFormatFactory(),
    );
    const processor = generator.createProcessor({
      '1.0': { supportedCatalogIds: [LUMINA_V1_CATALOG_ID] },
    });
    expect(processor.promptSnippet).toContain('ApprovalCard');
    expect(processor.promptSnippet).toContain('ThoughtTrace');
    expect(processor.promptSnippet).toContain('ComparisonMatrix');
    expect(processor.promptSnippet).toContain('SplitLedger');
    expect(processor.promptSnippet).toContain('AnnotatedDiagram');
    expect(processor.promptSnippet).toContain('formatCompactNumber');
    expect(processor.promptSnippet).toContain('compoundGrowth');
  });

  it('processes all upstream Basic Catalog v1.0 golden examples without validation errors', () => {
    const examplesDir = path.join(vendorDir, 'basic_examples');
    const files = fs.readdirSync(examplesDir).filter((f) => f.endsWith('.json'));
    expect(files.length).toBeGreaterThanOrEqual(35);

    for (const file of files) {
      const raw = JSON.parse(fs.readFileSync(path.join(examplesDir, file), 'utf8'));
      const rawMsgs = Array.isArray(raw) ? raw : Array.isArray(raw.messages) ? raw.messages : [raw];
      const proc = new MessageProcessor([luminaCoreCatalog]);
      expect(
        () => processLuminaMessages(proc, rawMsgs, { remapBasicCatalogToLumina: true }),
        `Failed on upstream example ${file}`,
      ).not.toThrow();
    }
  });
});
