import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseBisect, cardIdFrom, resolveFound } from './culprit.mjs';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'culprit.mjs');
const sha40 = 'a'.repeat(40);

test('parseBisect reads sha and subject', () => {
  const out = `running\n${sha40} is the first bad commit\ncommit ${sha40}\nAuthor: a <a@b>\nDate:   now\n\n    T-03 break it\n\n v.txt | 2 +-\n`;
  assert.deepEqual(parseBisect(out), { sha: sha40, subject: 'T-03 break it' });
  assert.equal(parseBisect('nothing'), null);
});

test('cardIdFrom', () => {
  assert.equal(cardIdFrom('fix F-3 now'), 'F-3');
  assert.equal(cardIdFrom('T-01: add'), 'T-01');
  assert.equal(cardIdFrom('no id here'), null);
});

const git = (cwd, ...a) => spawnSync('git', a, { cwd, encoding: 'utf8' });

function makeRepo() {
  const dir = mkdtempSync(path.join(tmpdir(), 'sqt-culprit-test-'));
  git(dir, 'init', '-q');
  git(dir, 'config', 'user.name', 't');
  git(dir, 'config', 'user.email', 't@t');
  git(dir, 'config', 'commit.gpgsign', 'false');
  const vals = ['good', 'good', 'bad', 'bad', 'bad'];
  const subjects = ['T-00 start', 'T-01 add', 'T-02 break', 'T-03 more', 'T-04 more'];
  vals.forEach((v, i) => {
    writeFileSync(path.join(dir, 'v.txt'), v + '\n');
    writeFileSync(path.join(dir, 'n.txt'), i + '\n');
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', subjects[i]);
  });
  return dir;
}

const cmd = `node -e "process.exit(require('fs').readFileSync('v.txt','utf8').trim()==='bad'?1:0)"`;

test('finds the first bad commit and leaves the working tree alone', () => {
  const dir = makeRepo();
  try {
    const good = git(dir, 'rev-parse', 'HEAD~4').stdout.trim();
    const expected = git(dir, 'rev-parse', 'HEAD~2').stdout.trim();
    writeFileSync(path.join(dir, 'scratch.txt'), 'mine\n');
    const before = git(dir, 'status', '--porcelain').stdout;
    const headBefore = git(dir, 'rev-parse', 'HEAD').stdout;
    const r = spawnSync(process.execPath, [script, '--good', good, '--test', cmd, '--root', dir], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, new RegExp(`first bad: ${expected} T-02 break`));
    assert.match(r.stdout, /card: T-02/);
    assert.equal(git(dir, 'status', '--porcelain').stdout, before);
    assert.equal(git(dir, 'rev-parse', 'HEAD').stdout, headBefore);
    assert.equal(git(dir, 'worktree', 'list').stdout.trim().split('\n').length, 1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('exits 2 when the command fails at the good commit', () => {
  const dir = makeRepo();
  try {
    const bad = git(dir, 'rev-parse', 'HEAD').stdout.trim();
    const r = spawnSync(process.execPath, [script, '--good', bad, '--test', cmd, '--root', dir], { encoding: 'utf8' });
    assert.equal(r.status, 2);
    assert.match(r.stderr, /good commit/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('missing --good is a usage error', () => {
  assert.equal(spawnSync(process.execPath, [script, '--test', 'x'], { encoding: 'utf8' }).status, 2);
});

test('--setup runs in the worktree before the test', () => {
  const dir = makeRepo();
  try {
    const good = git(dir, 'rev-parse', 'HEAD~4').stdout.trim();
    const expected = git(dir, 'rev-parse', 'HEAD~2').stdout.trim();
    // Passes only if setup created ready.txt (untracked, so checkout keeps it).
    const t = `node -e "process.exit(require('fs').existsSync('ready.txt')&&require('fs').readFileSync('v.txt','utf8').trim()!=='bad'?0:1)"`;
    const noSetup = spawnSync(process.execPath, [script, '--good', good, '--test', t, '--root', dir], { encoding: 'utf8' });
    assert.equal(noSetup.status, 2);
    const setup = `node -e "require('fs').writeFileSync('ready.txt','1')"`;
    const r = spawnSync(process.execPath, [script, '--good', good, '--test', t, '--setup', setup, '--root', dir], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, new RegExp(`first bad: ${expected}`));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('a test exiting 125 is skipped, not counted as bad', () => {
  const dir = makeRepo();
  try {
    const good = git(dir, 'rev-parse', 'HEAD~4').stdout.trim();
    const expected = git(dir, 'rev-parse', 'HEAD~2').stdout.trim();
    // n.txt = 3 is untestable (125); the others follow v.txt.
    const t = `node -e "const f=require('fs');if(f.readFileSync('n.txt','utf8').trim()==='3')process.exit(125);process.exit(f.readFileSync('v.txt','utf8').trim()==='bad'?1:0)"`;
    const r = spawnSync(process.execPath, [script, '--good', good, '--test', t, '--root', dir], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, new RegExp(`first bad: ${expected}`));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('resolveFound: message, ref fallback only after exit 0, missing ref', () => {
  const msg = 'abc1234 is the first bad commit\ncommit abc1234\n\n    T-02 break it\n';
  assert.equal(resolveFound(msg, 0, () => 'zzz').sha, 'abc1234');
  assert.equal(resolveFound('bisect found something', 0, () => 'def5678\n').sha, 'def5678');
  assert.equal(resolveFound('error', 3, () => 'def5678'), null);
  assert.equal(resolveFound('done', 0, () => ''), null);
});

test('cardIdFrom ignores look-alikes when the card list is known', () => {
  assert.equal(cardIdFrom('fix UTF-8 for T-02'), 'UTF-8');
  assert.equal(cardIdFrom('fix UTF-8 for T-02', new Set(['T-02'])), 'T-02');
  assert.equal(cardIdFrom('ISO-8601 dates', new Set(['T-02'])), null);
});
