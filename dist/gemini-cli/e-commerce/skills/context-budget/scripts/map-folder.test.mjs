import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = join(dirname(fileURLToPath(import.meta.url)), 'map-folder.mjs');
const run = (dir, ...a) => spawnSync('node', [script, dir, ...a], { encoding: 'utf8' });

function fixture() {
  const d = mkdtempSync(join(tmpdir(), 'map-'));
  const w = (p, c) => { mkdirSync(dirname(join(d, p)), { recursive: true }); writeFileSync(join(d, p), c); };
  w('src/a.mjs', "// Entry point\nimport { b } from '../lib/b.js';\nconst c = require('./c');\n");
  w('src/c.js', 'x\n');
  w('lib/b.js', 'y\n');
  w('lib/util.py', 'from .b import x\nfrom ..src import y\n');
  w('README.md', 'text\n# Title here\n');
  w('package.json', JSON.stringify({ description: 'D'.repeat(100) }));
  w('node_modules/x/i.js', '// skip\n');
  return d;
}

test('rows, roles, uses, mermaid, skipped folders', () => {
  const d = fixture();
  const r = run(d, '--stdout');
  assert.equal(r.status, 0);
  const o = r.stdout;
  assert.match(o, /Files: 6/);
  assert.match(o, /Regenerate: `node /);
  assert.match(o, /\| src\/a\.mjs \| Entry point \| lib\/b\.js, src\/c \|/);
  assert.match(o, /\| README\.md \| Title here \|/);
  assert.match(o, /D{79}… \|/);
  assert.ok(!o.includes('node_modules/x'));
  assert.match(o, /graph LR/);
  assert.match(o, /\["src"\]/);
});

test('over --max lists folders with counts only', () => {
  const r = run(fixture(), '--stdout', '--max', '2');
  assert.match(r.stdout, /\| Folder \| Files \|/);
  assert.match(r.stdout, /\| src \| 2 \|/);
  assert.ok(!r.stdout.includes('Entry point'));
});

test('writes default out file', () => {
  const d = fixture();
  assert.equal(run(d).status, 0);
  assert.ok(existsSync(join(d, 'docs/FILE-MAP.md')));
  assert.match(readFileSync(join(d, 'docs/FILE-MAP.md'), 'utf8'), /# File map/);
});
