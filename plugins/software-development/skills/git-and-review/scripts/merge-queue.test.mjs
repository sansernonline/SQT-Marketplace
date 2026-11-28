import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { planQueue } from './merge-queue.mjs';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'merge-queue.mjs');
const OK = 'node -e "process.exit(0)"';
const FAIL = 'node -e "process.exit(1)"';

function sh(cwd, ...args) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim();
}
function makeRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mq-test-'));
  sh(root, 'init');
  sh(root, 'config', 'user.name', 't');
  sh(root, 'config', 'user.email', 't@t');
  sh(root, 'config', 'commit.gpgsign', 'false');
  fs.writeFileSync(path.join(root, 'a.txt'), 'a\n');
  sh(root, 'add', '.');
  sh(root, 'commit', '-m', 'init');
  return { root, main: sh(root, 'rev-parse', '--abbrev-ref', 'HEAD') };
}
function makeLane(root, main, id, file, content) {
  sh(root, 'checkout', '-b', `lane/${id}`);
  fs.writeFileSync(path.join(root, file), content);
  sh(root, 'add', '.');
  sh(root, 'commit', '-m', `work ${id}`);
  sh(root, 'checkout', main);
}
const run = (root, ...args) => spawnSync('node', [script, ...args, '--root', root], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

test('planQueue dedupes and keeps order', () => {
  assert.deepEqual(planQueue(['b', 'a', 'b', 'c', 'a']), ['b', 'a', 'c']);
});

test('queue merges a good lane', () => {
  const { root, main } = makeRepo();
  try {
    makeLane(root, main, 'T-01', 'b.txt', 'b\n');
    const r = run(root, 'T-01', '--check', OK);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /T-01 \| merged/);
    assert.ok(fs.existsSync(path.join(root, 'b.txt')));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('a lane whose check fails is rolled back', () => {
  const { root, main } = makeRepo();
  try {
    makeLane(root, main, 'T-02', 'bad.txt', 'x\n');
    const before = sh(root, 'rev-parse', 'HEAD');
    const r = run(root, 'T-02', '--check', FAIL);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /rolled back/);
    assert.equal(sh(root, 'rev-parse', 'HEAD'), before);
    assert.equal(fs.existsSync(path.join(root, 'bad.txt')), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('a conflict is aborted and the queue stops', () => {
  const { root, main } = makeRepo();
  try {
    makeLane(root, main, 'T-03', 'a.txt', 'one\n');
    makeLane(root, main, 'T-04', 'a.txt', 'two\n');
    const r = run(root, 'T-03', 'T-04', '--check', OK);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /T-03 \| merged/);
    assert.match(r.stdout, /T-04 \| conflict/);
    assert.equal(sh(root, 'status', '--porcelain'), '');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('a dirty tree exits 2', () => {
  const { root, main } = makeRepo();
  try {
    makeLane(root, main, 'T-05', 'c.txt', 'c\n');
    fs.writeFileSync(path.join(root, 'a.txt'), 'dirty\n');
    assert.equal(run(root, 'T-05', '--check', OK).status, 2);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('files under .claude/superuser/ do not make the tree dirty', () => {
  const { root, main } = makeRepo();
  try {
    makeLane(root, main, 'T-06', 'd.txt', 'd\n');
    fs.mkdirSync(path.join(root, '.claude', 'superuser'), { recursive: true });
    fs.writeFileSync(path.join(root, '.claude', 'superuser', 'lanes.json'), '{}\n');
    const r = run(root, 'T-06', '--check', OK);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /T-06 \| merged/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('a check printing over 1 MB and exiting 0 is merged', () => {
  const { root, main } = makeRepo();
  try {
    makeLane(root, main, 'T-07', 'e.txt', 'e\n');
    const big = 'node -e "process.stdout.write(String(1).repeat(2000000))"';
    const r = run(root, 'T-07', '--check', big);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /T-07 \| merged/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('a missing branch is not called a conflict', () => {
  const { root } = makeRepo();
  try {
    const r = run(root, 'T-99', '--check', OK);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /T-99 \| merge failed/);
    assert.doesNotMatch(r.stdout, /conflict/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('--into switches back to the original branch', () => {
  const { root, main } = makeRepo();
  try {
    makeLane(root, main, 'T-08', 'f.txt', 'f\n');
    sh(root, 'checkout', '-b', 'target');
    sh(root, 'checkout', main);
    const r = run(root, 'T-08', '--check', OK, '--into', 'target');
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.equal(sh(root, 'rev-parse', '--abbrev-ref', 'HEAD'), main);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
