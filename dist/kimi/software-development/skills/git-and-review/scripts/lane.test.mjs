import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nextPort, dbName } from './lane.mjs';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'lane.mjs');

function sh(cwd, ...args) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim();
}
function makeRepo() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'lane-test-'));
  const root = path.join(base, 'proj');
  fs.mkdirSync(root);
  sh(root, 'init');
  sh(root, 'config', 'user.name', 't');
  sh(root, 'config', 'user.email', 't@t');
  sh(root, 'config', 'commit.gpgsign', 'false');
  fs.writeFileSync(path.join(root, 'a.txt'), 'a\n');
  sh(root, 'add', '.');
  sh(root, 'commit', '-m', 'init');
  return { base, root };
}
const lane = (root, ...args) => spawnSync('node', [script, ...args, '--root', root], { encoding: 'utf8' });
const readReg = (root) => JSON.parse(fs.readFileSync(path.join(root, '.claude', 'superuser', 'lanes.json'), 'utf8'));

test('nextPort picks the lowest free port above base', () => {
  assert.equal(nextPort({}, 4100), 4101);
  assert.equal(nextPort({ a: { port: 4101 }, b: { port: 4103 } }, 4100), 4102);
});

test('dbName lowercases and replaces non-alphanumerics', () => {
  assert.equal(dbName('test', 'T-01'), 'test_t_01');
});

test('two lanes get different ports, list shows them, remove cleans up', () => {
  const { base, root } = makeRepo();
  try {
    assert.equal(lane(root, 'add', 'T-01').status, 0);
    assert.equal(lane(root, 'add', 'T-02').status, 0);
    assert.equal(lane(root, 'add', 'T-01').status, 1);
    const reg = readReg(root);
    assert.notEqual(reg['T-01'].port, reg['T-02'].port);
    assert.equal(reg['T-01'].port, 4101);
    assert.equal(reg['T-01'].db, 'test_t_01');
    const env = fs.readFileSync(path.join(reg['T-02'].path, '.env.lane'), 'utf8');
    assert.match(env, /PORT=4102/);
    assert.match(env, /TEST_DB_NAME=test_t_02/);
    assert.match(env, /LANE_ID=T-02/);
    const list = lane(root, 'list').stdout;
    assert.match(list, /T-01/);
    assert.match(list, /yes/);
    assert.equal(lane(root, 'remove', 'T-01').status, 0);
    assert.equal(fs.existsSync(reg['T-01'].path), false);
    assert.equal(sh(root, 'branch', '--list', 'lane/T-01'), '');
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('remove exits 1 when the worktree has changes', () => {
  const { base, root } = makeRepo();
  try {
    lane(root, 'add', 'T-03');
    const reg = readReg(root);
    fs.writeFileSync(path.join(reg['T-03'].path, 'a.txt'), 'changed\n');
    assert.equal(lane(root, 'remove', 'T-03').status, 1);
    assert.equal(fs.readFileSync(path.join(reg['T-03'].path, 'a.txt'), 'utf8'), 'changed\n');
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('.env.lane is not committed by git add -A', () => {
  const { base, root } = makeRepo();
  try {
    lane(root, 'add', 'T-04');
    const p = readReg(root)['T-04'].path;
    fs.writeFileSync(path.join(p, 'new.txt'), 'n\n');
    sh(p, 'add', '-A');
    sh(p, 'commit', '-m', 'work');
    assert.equal(sh(p, 'ls-files').split('\n').includes('.env.lane'), false);
    assert.ok(sh(p, 'ls-files').includes('new.txt'));
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('remove with the folder already gone prunes and exits 0', () => {
  const { base, root } = makeRepo();
  try {
    lane(root, 'add', 'T-05');
    const p = readReg(root)['T-05'].path;
    fs.rmSync(p, { recursive: true, force: true });
    assert.equal(lane(root, 'remove', 'T-05').status, 0);
    assert.equal(readReg(root)['T-05'], undefined);
    assert.equal(sh(root, 'worktree', 'list').includes('lane-T-05'), false);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});
