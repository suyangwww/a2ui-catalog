import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { Catalog } from '@a2ui/web_core';
import { luminaCoreCatalog } from './registry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const VENDOR_DIR = path.join(REPO_ROOT, 'packages/schema/vendor/v1_0');

export function compileLuminaCatalogJson(options?: { writeFiles?: boolean }): {
  componentCount: number;
  functionCount: number;
  protocolVersion: string;
} {
  const rawCatalog = luminaCoreCatalog.toJson();
  const jsonStr = JSON.stringify(rawCatalog, null, 2) + '\n';

  const ajv = new Ajv2020({ strict: false, allErrors: true });
  addFormats(ajv);

  const commonTypes = JSON.parse(
    fs.readFileSync(path.join(VENDOR_DIR, 'common_types.json'), 'utf8'),
  );
  const catalogDef = JSON.parse(
    fs.readFileSync(path.join(VENDOR_DIR, 'catalog_definition.json'), 'utf8'),
  );

  ajv.addSchema(commonTypes, 'common_types.json');
  const validateCatalog = ajv.compile(catalogDef);
  const valid = validateCatalog(rawCatalog);
  if (!valid) {
    throw new Error(
      `[compiler] catalog.json failed Draft 2020-12 validation:\n${JSON.stringify(validateCatalog.errors, null, 2)}`,
    );
  }

  const loaded = Catalog.fromJson(rawCatalog);

  if (options?.writeFiles !== false) {
    const distOut = path.join(REPO_ROOT, 'dist/catalog.json');
    const schemaOut = path.join(REPO_ROOT, 'packages/schema/catalog.json');
    fs.mkdirSync(path.dirname(distOut), { recursive: true });
    fs.writeFileSync(distOut, jsonStr, 'utf8');
    fs.writeFileSync(schemaOut, jsonStr, 'utf8');
  }

  return {
    componentCount: loaded.components.size,
    functionCount: loaded.functions.size,
    protocolVersion: loaded.protocolVersion,
  };
}

const invokedDirectly =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  const stats = compileLuminaCatalogJson({ writeFiles: true });
  console.log(
    `[compiler] Built & validated dist/catalog.json and packages/schema/catalog.json (${stats.componentCount} components, ${stats.functionCount} functions, protocolVersion=${stats.protocolVersion}).`,
  );
}
