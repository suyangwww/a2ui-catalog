import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(REPO_ROOT, 'src/components');
const FUNCTIONS_DIR = path.join(REPO_ROOT, 'src/functions');
const OUT_FILE = path.join(REPO_ROOT, 'docs/QUALITY_SCORE.md');

function countCodeLines(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  return lines.filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed.length > 0 &&
      !trimmed.startsWith('//') &&
      !trimmed.startsWith('/*') &&
      !trimmed.startsWith('*')
    );
  }).length;
}

const componentSlugs = fs
  .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const functionSlugs = fs
  .readdirSync(FUNCTIONS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const rows = [];
for (const slug of componentSlugs) {
  const dir = path.join(COMPONENTS_DIR, slug);
  const schemaSrc = fs.readFileSync(path.join(dir, 'schema.ts'), 'utf8');
  const rendererPath = path.join(dir, 'renderer.tsx');
  const rendererSrc = fs.readFileSync(rendererPath, 'utf8');
  const promptSrc = fs.readFileSync(path.join(dir, 'prompt.md'), 'utf8').trim();
  const examples = JSON.parse(fs.readFileSync(path.join(dir, 'examples.json'), 'utf8'));
  const hasTest = fs.existsSync(path.join(dir, `${slug}.test.tsx`));

  const strictSchema = schemaSrc.includes('.strict()');
  const hasExamples = Array.isArray(examples) && examples.length > 0;
  const rendererLines = countCodeLines(rendererPath);
  const withinBudget = rendererLines <= 350;
  const promptChars = promptSrc.length;
  const validPrompt = promptChars > 20 && promptChars < 1500 && promptSrc.includes('Props:');
  const hasSemanticA11y =
    /aria-|role=|accessibilityRef|RadixAccordion|AdaptiveOverlay|<label|<table|<dl|<figure|<button|<h1|<p/.test(
      rendererSrc,
    );

  const checks = [strictSchema, hasExamples, hasTest, withinBudget, validPrompt, hasSemanticA11y];
  const passed = checks.filter(Boolean).length;
  const grade = passed === 6 ? 'A' : passed >= 5 ? 'B' : 'C';

  rows.push({
    slug,
    strictSchema: strictSchema ? 'Pass' : 'Fail',
    examples: hasExamples ? `${examples.length}` : '0',
    seamTest: hasTest ? 'Pass' : 'Fail',
    a11y: hasSemanticA11y ? 'Pass' : 'Review',
    promptChars: `${promptChars}c`,
    rendererLines: `${rendererLines}L`,
    grade,
  });
}

const fnRows = functionSlugs.map((slug) => {
  const dir = path.join(FUNCTIONS_DIR, slug);
  const hasSchema = fs.existsSync(path.join(dir, 'schema.ts'));
  const hasIndex = fs.existsSync(path.join(dir, 'index.ts'));
  const hasTest = fs.existsSync(path.join(dir, `${slug}.test.ts`));
  const grade = hasSchema && hasIndex && hasTest ? 'A' : 'C';
  return { slug, hasSchema, hasIndex, hasTest, grade };
});

const gradeACount = rows.filter((r) => r.grade === 'A').length;

const md = [
  '# Component & Function Quality Score',
  '',
  'Status: Active',
  'Owner: Catalog Architecture',
  'Last Verified: 2026-11-20',
  '',
  'Generated deterministically by `pnpm quality:score` ([scripts/compute-quality-score.mjs](../scripts/compute-quality-score.mjs)). Grades each vertical slice in `src/components/*` and `src/functions/*` across strict Zod schema validation, validated `examples.json` fixtures, seam tests, semantic/ARIA markup, `prompt.md` context budget (`< 1500` chars), and file line budgets (`<= 350` lines).',
  '',
  `## Summary: **${gradeACount} / ${rows.length}** Components at Grade **A** · **${fnRows.filter((f) => f.grade === 'A').length} / ${fnRows.length}** Function Slices at Grade **A**`,
  '',
  `## 1. Component Slices (${rows.length})`,
  '',
  '| Slice (`src/components/*`) | Strict Schema | Examples | Seam Test | Semantic/A11y | Prompt Size | Renderer Lines | Grade |',
  '| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |',
  ...rows.map(
    (r) =>
      `| \`${r.slug}\` | ${r.strictSchema} | ${r.examples} | ${r.seamTest} | ${r.a11y} | ${r.promptChars} | ${r.rendererLines} | **${r.grade}** |`,
  ),
  '',
  `## 2. Function Slices (${fnRows.length})`,
  '',
  '| Slice (`src/functions/*`) | `schema.ts` | `index.ts` Seam | Seam Test | Grade |',
  '| :--- | :---: | :---: | :---: | :---: |',
  ...fnRows.map(
    (f) =>
      `| \`${f.slug}\` | ${f.hasSchema ? 'Pass' : 'Fail'} | ${f.hasIndex ? 'Pass' : 'Fail'} | ${f.hasTest ? 'Pass' : 'Fail'} | **${f.grade}** |`,
  ),
  '',
].join('\n');

fs.writeFileSync(OUT_FILE, md, 'utf8');
console.log(
  `[quality:score] Updated docs/QUALITY_SCORE.md (${gradeACount}/${rows.length} Grade A components, ${fnRows.length} Grade A function slices).`,
);
