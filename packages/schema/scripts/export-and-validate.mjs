import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { Catalog } from '@a2ui/web_core';
import { luminaCoreCatalog } from '@a2ui-catalog/core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '..');
const vendorDir = path.join(pkgRoot, 'vendor/v1_0');
const catalogOutPath = path.join(pkgRoot, 'catalog.json');

const rawCatalog = luminaCoreCatalog.toJson();
const jsonStr = JSON.stringify(rawCatalog, null, 2) + '\n';
fs.writeFileSync(catalogOutPath, jsonStr, 'utf8');

// Validate generated catalog.json against upstream A2UI v1.0 catalog_definition.json
const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);

const commonTypes = JSON.parse(fs.readFileSync(path.join(vendorDir, 'common_types.json'), 'utf8'));
const catalogDef = JSON.parse(fs.readFileSync(path.join(vendorDir, 'catalog_definition.json'), 'utf8'));

ajv.addSchema(commonTypes, 'common_types.json');

const validateCatalog = ajv.compile(catalogDef);
const ok = validateCatalog(rawCatalog);
if (!ok) {
  console.error('[schema] catalog.json failed validation against catalog_definition.json:');
  console.error(JSON.stringify(validateCatalog.errors, null, 2));
  process.exit(1);
}

// Verify roundtrip via Catalog.fromJson()
const loaded = Catalog.fromJson(rawCatalog);
console.log(
  `[schema] Exported and validated catalog.json (${loaded.components.size} components, ${loaded.functions.size} functions, protocolVersion=${loaded.protocolVersion}).`,
);
