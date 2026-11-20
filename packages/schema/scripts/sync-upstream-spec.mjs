import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const vendorDir = path.resolve(__dirname, '../vendor/v1_0');
const examplesDir = path.join(vendorDir, 'basic_examples');
fs.mkdirSync(examplesDir, { recursive: true });

function fetchGithubFile(repoPath) {
  const raw = execSync(
    `gh api "repos/a2ui-project/a2ui/contents/${repoPath}?ref=main" --jq .content`,
    { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 },
  );
  return Buffer.from(raw.replace(/\s+/g, ''), 'base64').toString('utf8');
}

const specFiles = [
  ['specification/v1_0/json/catalog_definition.json', 'catalog_definition.json'],
  ['specification/v1_0/json/common_types.json', 'common_types.json'],
  ['specification/v1_0/json/agent_to_renderer.json', 'agent_to_renderer.json'],
  ['specification/v1_0/json/renderer_to_agent.json', 'renderer_to_agent.json'],
  ['catalogs/basic/v1/catalog.json', 'basic_catalog.json'],
];

for (const [remotePath, localName] of specFiles) {
  const dest = path.join(vendorDir, localName);
  const content = fetchGithubFile(remotePath);
  fs.writeFileSync(dest, content, 'utf8');
  console.log(`[sync] ${remotePath} -> vendor/v1_0/${localName}`);
}

const listJson = execSync(
  `gh api "repos/a2ui-project/a2ui/contents/catalogs/basic/v1/examples?ref=main" --jq '.[].name'`,
  { encoding: 'utf8' },
);
const exampleNames = listJson
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => s.endsWith('.json'));

for (const name of exampleNames) {
  const dest = path.join(examplesDir, name);
  const content = fetchGithubFile(`catalogs/basic/v1/examples/${name}`);
  fs.writeFileSync(dest, content, 'utf8');
}

console.log(`[sync] Synced ${exampleNames.length} upstream Basic Catalog v1.0 examples.`);
