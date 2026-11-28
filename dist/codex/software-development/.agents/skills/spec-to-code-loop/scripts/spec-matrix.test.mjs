import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { collectIds, matrix, globToRegExp, isTestFile, DEFAULT_ID } from './spec-matrix.mjs';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'spec-matrix.mjs');
const re = new RegExp(DEFAULT_ID);

test('collectIds keeps unique ids with first line', () => {
  const r = collectIds('intro\nAC-1 and FR-2.3\nAC-1 again\nXX-9', re);
  assert.deepEqual(r, [{ id: 'AC-1', line: 2 }, { id: 'FR-2.3', line: 2 }]);
});

test('matrix finds whole-word matches, missing and orphan', () => {
  const r = matrix(
    [{ id: 'AC-1', spec: 's:1' }, { id: 'AC-2', spec: 's:2' }],
    [{ file: 'a.test.js', text: 'it("AC-1 works"); AC-12 AC-9' }],
  );
  assert.deepEqual(r.rows[0].tests, ['a.test.js']);
  assert.deepEqual(r.missing, ['AC-2']);
  assert.deepEqual(r.orphan.sort(), ['AC-12', 'AC-9']);
});

test('glob and test-file rule', () => {
  assert.ok(globToRegExp('docs/**/*.md').test('docs/a.md'));
  assert.ok(globToRegExp('docs/**/*.md').test('docs/x/y/a.md'));
  assert.ok(!globToRegExp('docs/*.md').test('docs/x/a.md'));
  assert.ok(isTestFile('src/a.test.ts') && isTestFile('tests/x.js') && isTestFile('a/test_b.py'));
  assert.ok(!isTestFile('src/a.js'));
});

function run(dir, args) {
  return spawnSync(process.execPath, [script, '--root', dir, ...args], { encoding: 'utf8' });
}

test('CLI exits 1 on missing id, 0 when covered, 2 on usage error', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'specm-'));
  try {
    fs.writeFileSync(path.join(dir, 'spec.md'), '# Spec\n- AC-1 one\n- AC-2 two\n');
    fs.mkdirSync(path.join(dir, 'tests'));
    fs.writeFileSync(path.join(dir, 'tests', 'a.js'), '// AC-1\n');
    let r = run(dir, ['--spec', '*.md']);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /missing: 1/);
    assert.match(r.stdout, /orphan: 0/);
    assert.match(r.stdout, /\| AC-2 \| spec\.md:3 \| - \|/);
    fs.writeFileSync(path.join(dir, 'tests', 'b.test.js'), '// AC-2 AC-7\n');
    r = run(dir, ['--spec', '*.md', '--json']);
    assert.equal(r.status, 0);
    const j = JSON.parse(r.stdout);
    assert.deepEqual(j.missing, []);
    assert.deepEqual(j.orphan, ['AC-7']);
    assert.equal(run(dir, []).status, 2);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('CLI exits 2 when the spec has no ids', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'specm-none-'));
  try {
    fs.writeFileSync(path.join(dir, 'spec.md'), '# Spec\nno ids here\n');
    const r = run(dir, ['--spec', '*.md']);
    assert.equal(r.status, 2);
    assert.match(r.stderr, /no ids found in spec — check --spec and --id/);
    assert.equal(run(dir, ['--spec', '*.md', '--id', 'ZZ-\d+']).status, 2);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
