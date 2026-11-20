import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const errors = [];

function fail(msg) {
  errors.push(msg);
}

// 1. Check AGENTS.md line count <= 100
const agentsPath = path.join(ROOT, 'AGENTS.md');
if (!fs.existsSync(agentsPath)) {
  fail('REMEDIATION: Missing root AGENTS.md file.');
} else {
  const lines = fs.readFileSync(agentsPath, 'utf8').split('\n');
  // Ignore single trailing newline
  const count = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
  if (count > 100) {
    fail(
      `REMEDIATION: AGENTS.md is ${count} lines (max 100). Move detailed guidance into ARCHITECTURE.md, docs/, or .agents/skills/.`,
    );
  }
}

// 2. Verify relative markdown links in README.md, AGENTS.md, and ARCHITECTURE.md exist on disk
for (const docFile of ['README.md', 'AGENTS.md', 'ARCHITECTURE.md']) {
  const full = path.join(ROOT, docFile);
  if (!fs.existsSync(full)) {
    fail(`REMEDIATION: Missing root documentation file '${docFile}'.`);
    continue;
  }
  const content = fs.readFileSync(full, 'utf8');
  const linkRegex = /\[[^\]]+\]\(([^)#]+)(?:#[^)]*)?\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const target = match[1].trim();
    if (target.startsWith('file://')) {
      fail(
        `REMEDIATION: Replace machine-local '${target}' link in ${docFile} with a repo-relative path.`,
      );
      continue;
    }
    if (
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('mailto:')
    ) {
      continue;
    }
    const resolved = path.resolve(path.dirname(full), target);
    if (!fs.existsSync(resolved)) {
      fail(
        `REMEDIATION: Broken link '${target}' in ${docFile}. Update the path or create the missing target.`,
      );
    }
  }
}

// 3. Verify required headers in docs/adr/*.md and docs/specs/*.md
for (const sub of ['docs/adr', 'docs/specs']) {
  const dir = path.join(ROOT, sub);
  if (!fs.existsSync(dir)) {
    fail(`REMEDIATION: Missing required directory '${sub}'.`);
    continue;
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  if (files.length === 0) {
    fail(`REMEDIATION: '${sub}' must contain at least one markdown record.`);
  }
  for (const file of files) {
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    for (const header of ['Status:', 'Owner:', 'Last Verified:']) {
      if (!text.includes(header)) {
        fail(
          `REMEDIATION: '${sub}/${file}' is missing required metadata header '${header}'. Add Status:, Owner:, and Last Verified: near the top of the document.`,
        );
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Doc integrity check failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('[check-docs] OK: AGENTS.md <= 100 lines, all doc links valid, ADR & Spec headers verified.');
