import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, spawn } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isStale, lockPath } from './test-lock.mjs';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'test-lock.mjs');
const run = (args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
const exitWith = (n) => ['node', '-e', `process.exit(${n})`];

test('lockPath uses tmpdir and name', () => {
  assert.equal(lockPath('x'), path.join(tmpdir(), 'sqt-test-lock-x.json'));
  assert.equal(lockPath(), path.join(tmpdir(), 'sqt-test-lock-default.json'));
});

test('isStale: dead pid, old lock, fresh live lock', () => {
  const now = Date.now();
  assert.equal(isStale({ pid: 1, at: now }, now, () => false), true);
  assert.equal(isStale({ pid: 1, at: now - 7 * 3600e3 }, now, () => true), true);
  assert.equal(isStale({ pid: 1, at: now - 1000 }, now, () => true), false);
});

test('runs the command, passes its exit code and removes the lock', () => {
  const name = `t-exit-${process.pid}`;
  const r = run(['--name', name, '--', ...exitWith(3)]);
  assert.equal(r.status, 3);
  assert.equal(existsSync(lockPath(name)), false);
});

test('takes a stale lock whose pid is dead', () => {
  const name = `t-stale-${process.pid}`;
  writeFileSync(lockPath(name), JSON.stringify({ pid: 99999999, at: Date.now(), cmd: 'x' }));
  const r = run(['--name', name, '--', ...exitWith(0)]);
  assert.equal(r.status, 0);
  assert.equal(existsSync(lockPath(name)), false);
});

test('exits 2 when a live lock outlasts --wait', () => {
  const name = `t-live-${process.pid}`;
  writeFileSync(lockPath(name), JSON.stringify({ pid: process.pid, at: Date.now(), cmd: 'x' }));
  try {
    const r = run(['--name', name, '--wait', '1', '--', ...exitWith(0)]);
    assert.equal(r.status, 2);
    assert.match(r.stdout, /Waiting/);
    assert.equal(existsSync(lockPath(name)), true);
  } finally {
    rmSync(lockPath(name), { force: true });
  }
});

test('no command is a usage error', () => {
  assert.equal(run(['--name', 'x']).status, 2);
});

test('passes arguments intact without a shell', () => {
  const r = run(['--name', `t-args-${process.pid}`, '--', 'node', '-e', "console.log(1, 'a b')"]);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), '1 a b');
});

test('rejects a lock name with unsafe characters', () => {
  assert.equal(run(['--name', '../x', '--', ...exitWith(0)]).status, 2);
  assert.equal(run(['--name', 'a b', '--', ...exitWith(0)]).status, 2);
});

test('two waiters on a stale lock never run at the same time', async () => {
  const name = `t-race-${process.pid}`;
  const log = path.join(tmpdir(), `sqt-race-${process.pid}.log`);
  rmSync(log, { force: true });
  writeFileSync(lockPath(name), JSON.stringify({ pid: 99999999, at: Date.now(), cmd: 'x' }));
  const code = `const f=require('fs');f.appendFileSync(${JSON.stringify(log)},'s');setTimeout(()=>f.appendFileSync(${JSON.stringify(log)},'e'),600)`;
  const go = () => new Promise((res) => {
    const c = spawn(process.execPath, [script, '--name', name, '--', 'node', '-e', code], { stdio: 'ignore' });
    c.on('close', res);
  });
  try {
    await Promise.all([go(), go()]);
    assert.equal(readFileSync(log, 'utf8'), 'sese');
  } finally {
    rmSync(log, { force: true });
    rmSync(lockPath(name), { force: true });
  }
});

test('runs npm (a .cmd shim on Windows) and a one-string command line', () => {
  const npm = spawnSync(process.execPath, [script, '--name', `t-npm-${process.pid}`, '--', 'npm', '--version'], { encoding: 'utf8' });
  assert.equal(npm.status, 0, npm.stderr);
  assert.match(npm.stdout, /\d+\.\d+\.\d+/);
  const line = spawnSync(process.execPath, [script, '--name', `t-line-${process.pid}`, '--', 'node -e process.exit(3)'], { encoding: 'utf8' });
  assert.equal(line.status, 3);
});
