import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { extractRefs, checkRefs } from './docs-truth.mjs';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'docs-truth.mjs');

test('extractRefs finds paths and scripts in inline code only', () => {
  const md = [
    'See `src/a.js` and `npm run build`.',
    '```',
    '`src/ignored.js` npm run nope',
    '```',
    '`https://x.com/a.html` `<dir>/x` `src/*.js` `two words.md` `plain`',
    '`pnpm test` `yarn lint` `README.md` `docs/guide.md`',
  ].join('\n');
  assert.deepEqual(extractRefs(md), [
    { line: 1, kind: 'path', value: 'src/a.js' },
    { line: 1, kind: 'script', value: 'build' },
    { line: 6, kind: 'script', value: 'test' },
    { line: 6, kind: 'script', value: 'lint' },
    { line: 6, kind: 'path', value: 'docs/guide.md' },
  ]);
});

test('checkRefs returns the missing refs', () => {
  const refs = [
    { line: 1, kind: 'path', value: 'a.js' },
    { line: 2, kind: 'path', value: 'b.js' },
    { line: 3, kind: 'script', value: 'build' },
    { line: 4, kind: 'script', value: 'nope' },
  ];
  const out = checkRefs(refs, { exists: (p) => p === 'a.js', scripts: { build: 'x' } });
  assert.deepEqual(out.map((r) => r.line), [2, 4]);
});

test('extractRefs skips values that are not real paths', () => {
  const skip = ['~/x/y.md', '/abs/p.md', '@scope/pkg.js', '$HOME/a.md', 'http-x/a.md', 'httpfoo/b.md', '-f/a.md',
    'a/…/b.md', 'a/.../b.md', 'a/b:c.md', 'a b/c.md', 'SKILL.md', 'guide.md', 'ground-rules/simplify', 'owner/repo'];
  const md = skip.map((v) => `\`${v}\``).join(' ');
  assert.deepEqual(extractRefs(md), []);
  // still kept: dotted part, or more than one slash
  assert.deepEqual(extractRefs('`a/b.md` `a/b/c` `src/`').map((r) => r.value), ['a/b.md', 'a/b/c']);
});

function run(dir, ...args) {
  return spawnSync(process.execPath, [script, '--root', dir, ...args], { encoding: 'utf8' });
}

test('CLI exits 1 on missing path and script, 0 when all exist', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-truth-'));
  try {
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ scripts: { build: 'x' } }));
    fs.writeFileSync(path.join(dir, 'README.md'), 'Run `npm run test` then open `src/missing.js`.\n');
    let r = run(dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /README\.md:1 · src\/missing\.js · missing/);
    assert.match(r.stdout, /test · missing/);
    assert.match(r.stdout, /missing: 2/);

    fs.mkdirSync(path.join(dir, 'src'));
    fs.writeFileSync(path.join(dir, 'src', 'missing.js'), '');
    fs.writeFileSync(path.join(dir, 'README.md'), 'Run `npm run build` then open `src/missing.js`.\n');
    r = run(dir);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /missing: 0/);

    assert.equal(run(dir, 'nofile.md').status, 2);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('--ignore skips matching paths and needs a value', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-truth-ign-'));
  try {
    fs.writeFileSync(path.join(dir, 'README.md'), '`gen/out/a.js` `src/x.js` `other/y/z.js`\n');
    let r = run(dir);
    assert.match(r.stdout, /missing: 3/);
    r = run(dir, '--ignore', 'gen/**,other/*/z.js');
    assert.match(r.stdout, /missing: 1/);
    assert.match(r.stdout, /src\/x\.js/);
    assert.equal(run(dir, '--ignore').status, 2);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
