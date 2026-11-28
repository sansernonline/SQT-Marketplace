import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { capsFor, globToRegExp, globsOverlap, isTestFile, parseCard, pickParallel, statusOf } from './card.mjs';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'card.mjs');

// ---------- pure functions ----------

test('parseCard reads scalars, inline lists, block lists, comments and unknown keys', () => {
  const c = parseCard([
    '---', 'id: T-01', 'title: Sign-in error', 'size: M    # S | M | L', 'depends: [T-00]',
    'touch: [src/auth/**, test/auth/**]', 'extra: kept', 'done_when:', '  - npm test -- auth', '  - node tools/check.mjs',
    '---', 'body'].join('\r\n'));
  assert.equal(c.id, 'T-01');
  assert.equal(c.size, 'M');
  assert.deepEqual(c.depends, ['T-00']);
  assert.deepEqual(c.touch, ['src/auth/**', 'test/auth/**']);
  assert.deepEqual(c.done_when, ['npm test -- auth', 'node tools/check.mjs']);
  assert.equal(c.extra, 'kept');
});

test('globToRegExp: ** any depth including zero, * and ? stay inside one folder', () => {
  assert.ok(globToRegExp('src/**').test('src/a/b.js'));
  assert.ok(globToRegExp('src/**/x.js').test('src/x.js'));
  assert.ok(globToRegExp('src/**/x.js').test('src/a/b/x.js'));
  assert.ok(globToRegExp('src/*.js').test('src/a.js'));
  assert.ok(!globToRegExp('src/*.js').test('src/a/b.js'));
  assert.ok(globToRegExp('a?.js').test('ab.js'));
  assert.ok(!globToRegExp('a?.js').test('a/.js'));
  assert.ok(!globToRegExp('a.js').test('axjs'));
});

test('isTestFile follows the test-file rule', () => {
  for (const p of ['test/a.js', 'src/__tests__/a.js', 'a.test.mjs', 'a.spec.ts', 'x_test.go', 'pkg/test_a.py'])
    assert.ok(isTestFile(p), p);
  for (const p of ['src/a.js', 'src/contest/a.js', 'latest.js', 'src/test_a.js'])
    assert.ok(!isTestFile(p), p);
});

test('capsFor uses defaults, M for missing size, and card_caps overrides', () => {
  assert.deepEqual(capsFor('S'), [100, 200]);
  assert.deepEqual(capsFor(undefined), [300, 600]);
  assert.deepEqual(capsFor('L', {}), [800, 1600]);
  assert.deepEqual(capsFor('S', { card_caps: { S: [5, 6] } }), [5, 6]);
  assert.deepEqual(capsFor('M', { card_caps: { S: [5, 6] } }), [300, 600]);
});

test('statusOf computes status from evidence', () => {
  assert.equal(statusOf(null), 'todo');
  assert.equal(statusOf({ started: {} }), 'doing');
  assert.equal(statusOf({ started: {}, verified: { pass: true } }), 'done');
  assert.equal(statusOf({ started: {}, verified: { pass: false } }), 'failed');
  assert.equal(statusOf({ started: {}, verified: { pass: true }, reviewFailed: 1 }), 'failed');
  assert.equal(statusOf({ started: {}, verified: { pass: true }, abandoned: { at: 'x' } }), 'abandoned');
});

test('globsOverlap compares the literal part before the first wildcard', () => {
  assert.ok(globsOverlap('src/auth/**', 'src/**'));
  assert.ok(globsOverlap('src/**', 'src/auth/**'));
  assert.ok(!globsOverlap('src/a/**', 'src/b/**'));
  assert.ok(globsOverlap('docs/a.md', 'docs/a.md'));
});

test('pickParallel picks a greedy set in id order; no touch overlaps everything', () => {
  const cards = [
    { id: 'T-03', touch: ['src/b/**'] },
    { id: 'T-01', touch: ['src/a/**'] },
    { id: 'T-02', touch: ['src/**'] },
    { id: 'T-04', touch: [] },
  ];
  assert.deepEqual(pickParallel(cards).map(c => c.id), ['T-01', 'T-03']);
  assert.deepEqual(pickParallel([{ id: 'A-1' }, { id: 'A-2', touch: ['x/**'] }]).map(c => c.id), ['A-1']);
});

// ---------- end to end in a temp git repo ----------

function sh(cwd, cmd, args) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  assert.equal(r.status, 0, `${cmd} ${args.join(' ')}: ${r.stderr}`);
}

function makeRepo() {
  const root = mkdtempSync(join(tmpdir(), 'card-test-'));
  sh(root, 'git', ['init', '-q']);
  sh(root, 'git', ['config', 'user.name', 'T']);
  sh(root, 'git', ['config', 'user.email', 't@example.com']);
  sh(root, 'git', ['config', 'commit.gpgsign', 'false']);
  for (const f of ['src/a.js', 'src/crypto/k.js', 'test/a.test.js', 'other/o.js']) {
    mkdirSync(dirname(join(root, f)), { recursive: true });
    writeFileSync(join(root, f), 'line\n');
  }
  sh(root, 'git', ['add', '-A']);
  sh(root, 'git', ['commit', '-q', '-m', 'init']);
  return root;
}

function card(root, id, fm) {
  const dir = join(root, '.claude', 'superuser', 'cards');
  mkdirSync(dir, { recursive: true });
  const lines = { id, title: `Card ${id}`, ...fm };
  const body = Object.entries(lines).map(([k, v]) => `${k}: ${v}`).join('\n');
  writeFileSync(join(dir, `${id}.md`), `---\n${body}\ndone_when:\n  - node -e "process.exit(0)"\n---\nBody\n`);
}

function run(root, ...args) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args, '--root', root], { encoding: 'utf8' });
  return { code: r.status, out: r.stdout + r.stderr };
}

const evidence = (root, id) => JSON.parse(readFileSync(join(root, '.claude', 'superuser', 'evidence', `${id}.json`), 'utf8'));

test('verify passes after editing a touched file, then review pass makes it done', () => {
  const root = makeRepo();
  try {
    card(root, 'T-01', { touch: '[src/**, test/**]', dont_touch: '[src/crypto/**]' });
    assert.equal(run(root, 'start', 'T-01').code, 0);
    writeFileSync(join(root, 'src/a.js'), 'line\nmore\n');
    const v = run(root, 'verify', 'T-01');
    assert.equal(v.code, 0, v.out);
    const ev = evidence(root, 'T-01');
    assert.equal(ev.attempts, 1);
    assert.deepEqual(ev.verified.changed, ['src/a.js']);
    assert.equal(ev.verified.lines.code, 1);
    assert.equal(run(root, 'review', 'T-01', 'pass').code, 0);
    assert.match(run(root, 'status').out, /\| T-01 \| Card T-01 \| done \| 1 \| 1 \|/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('verify fails for dont_touch and out-of-scope files', () => {
  const root = makeRepo();
  try {
    card(root, 'T-01', { touch: '[src/**]', dont_touch: '[src/crypto/**]' });
    run(root, 'start', 'T-01');
    writeFileSync(join(root, 'src/crypto/k.js'), 'changed\n');
    writeFileSync(join(root, 'other/new.js'), 'x\n');
    const v = run(root, 'verify', 'T-01');
    assert.equal(v.code, 1);
    const ev = evidence(root, 'T-01').verified;
    assert.deepEqual(ev.forbidden, ['src/crypto/k.js']);
    assert.deepEqual(ev.outOfScope, ['other/new.js']);
    assert.equal(ev.pass, false);
    assert.equal(run(root, 'review', 'T-01', 'pass').code, 1);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('files already dirty at start are ignored while unchanged', () => {
  const root = makeRepo();
  try {
    writeFileSync(join(root, 'other/o.js'), 'dirty before\n');
    card(root, 'T-01', { touch: '[src/**]' });
    run(root, 'start', 'T-01');
    assert.equal(run(root, 'verify', 'T-01').code, 0);
    writeFileSync(join(root, 'other/o.js'), 'dirty again\n');
    assert.equal(run(root, 'verify', 'T-01').code, 1);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('over the cap warns, over 2x the cap fails (untracked files count as added)', () => {
  const root = makeRepo();
  try {
    mkdirSync(join(root, '.claude', 'superuser'), { recursive: true });
    writeFileSync(join(root, '.claude', 'superuser', 'config.json'), JSON.stringify({ card_caps: { M: [5, 10] } }));
    card(root, 'T-01', {});
    run(root, 'start', 'T-01');
    writeFileSync(join(root, 'src/big.js'), 'x\n'.repeat(7));
    const warn = run(root, 'verify', 'T-01');
    assert.equal(warn.code, 0, warn.out);
    const ev = evidence(root, 'T-01').verified;
    assert.equal(ev.lines.warn, true);
    assert.match(ev.reasons[0], /^warning:/);
    writeFileSync(join(root, 'src/big.js'), 'x\n'.repeat(11));
    const over = run(root, 'verify', 'T-01');
    assert.equal(over.code, 1);
    assert.equal(evidence(root, 'T-01').attempts, 2);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('review fail makes the card failed; a passing verify clears it', () => {
  const root = makeRepo();
  try {
    card(root, 'T-01', {});
    run(root, 'start', 'T-01');
    assert.equal(run(root, 'verify', 'T-01').code, 0);
    assert.equal(run(root, 'review', 'T-01', 'fail', '--kind', 'missing-test,docs', '--note', 'add a test').code, 0);
    assert.equal(evidence(root, 'T-01').reviewFailed, 1);
    assert.match(run(root, 'status').out, /\| T-01 \| Card T-01 \| failed \|/);
    assert.equal(run(root, 'review', 'T-01', 'fail', '--kind', 'bogus').code, 2);
    const stats = run(root, 'stats').out;
    assert.match(stats, /rounds: 1 · fails: 1/);
    assert.match(stats, /missing-test: 1/);
    assert.equal(run(root, 'verify', 'T-01').code, 0);
    assert.equal(evidence(root, 'T-01').reviewFailed, undefined);
    assert.match(run(root, 'status').out, /\| done \|/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('start checks depends, refuses a second start, and allows --restart or restart after abandon', () => {
  const root = makeRepo();
  try {
    card(root, 'T-00', { touch: '[y/**]' });
    card(root, 'T-01', { depends: '[T-00]' });
    card(root, 'T-02', { touch: '[x/**]' });
    const blocked = run(root, 'start', 'T-01');
    assert.equal(blocked.code, 1);
    assert.match(blocked.out, /T-00/);
    assert.equal(run(root, 'next').out.trim(), 'T-00 Card T-00');
    assert.match(run(root, 'next', '--parallel').out, /T-00[\s\S]*T-02/);
    run(root, 'start', 'T-00');
    assert.equal(run(root, 'start', 'T-00').code, 1);
    assert.equal(run(root, 'start', 'T-00', '--restart').code, 0);
    run(root, 'verify', 'T-00');
    assert.equal(run(root, 'start', 'T-01').code, 0);
    assert.equal(run(root, 'abandon', 'T-01').code, 2);
    assert.equal(run(root, 'abandon', 'T-01', '--reason', 'no longer needed').code, 0);
    assert.match(run(root, 'status').out, /\| T-01 \| Card T-01 \| abandoned \|/);
    assert.equal(run(root, 'start', 'T-01').code, 0);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('status --write and --check; input errors exit 2', () => {
  const root = makeRepo();
  try {
    card(root, 'T-01', {});
    const file = join(root, 'STATUS.md');
    assert.equal(run(root, 'status', '--check', file).code, 1);
    assert.equal(run(root, 'status', '--write', file).code, 0);
    assert.equal(run(root, 'status', '--check', file).code, 0);
    assert.match(readFileSync(file, 'utf8'), /\| id \| title \| status \| attempts \| review rounds \| last verify \|/);
    run(root, 'start', 'T-01');
    assert.equal(run(root, 'status', '--check', file).code, 1);
    assert.equal(run(root, 'verify', 'T-09').code, 2);
    assert.equal(run(root, 'start', '../x').code, 2);
    assert.equal(run(root, 'bogus').code, 2);
    card(root, 'T-05', { id: 'T-06' });
    assert.equal(run(root, 'start', 'T-05').code, 2);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('without git: verify skips scope checks and adds a warning', () => {
  const root = mkdtempSync(join(tmpdir(), 'card-nogit-'));
  try {
    card(root, 'T-01', { touch: '[src/**]' });
    assert.equal(run(root, 'start', 'T-01').code, 0);
    assert.equal(evidence(root, 'T-01').started.commit, null);
    assert.equal(run(root, 'verify', 'T-01').code, 0);
    assert.deepEqual(evidence(root, 'T-01').verified.reasons, ['warning: not a git repo, scope not checked']);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

// ---------- verify engine fixes ----------

function rawCard(state, id, front) {
  const dir = join(state, 'cards');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${id}.md`), `---\nid: ${id}\ntitle: Card ${id}\n${front}\n---\nBody\n`);
}
const cardsDir = root => join(root, '.claude', 'superuser');

test('parseCard accepts unindented block items; # comment rules per key', () => {
  const c = parseCard(['---', 'id: T-01 # note', 'title: Fix #12 login bug', 'touch: [a/**] # c', 'done_when:', '- npm test', '- node x.mjs', '---'].join('\n'));
  assert.deepEqual(c.done_when, ['npm test', 'node x.mjs']);
  assert.equal(c.title, 'Fix #12 login bug');
  assert.equal(c.id, 'T-01');
  assert.deepEqual(c.touch, ['a/**']);
});

test('verify fails when the card has no done_when commands', () => {
  const root = makeRepo();
  try {
    rawCard(cardsDir(root), 'T-01', 'size: M');
    run(root, 'start', 'T-01');
    const v = run(root, 'verify', 'T-01');
    assert.equal(v.code, 1);
    assert.ok(evidence(root, 'T-01').verified.reasons.includes('no done_when commands'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('verify fails when a done_when command exits 1 or times out', () => {
  const root = makeRepo();
  try {
    rawCard(cardsDir(root), 'T-01', 'done_when:\n- node -e "process.exit(1)"');
    run(root, 'start', 'T-01');
    const v = run(root, 'verify', 'T-01');
    assert.equal(v.code, 1);
    assert.match(evidence(root, 'T-01').verified.reasons[0], /command failed \(exit 1\)/);
    rawCard(cardsDir(root), 'T-02', 'done_when:\n- node -e "setTimeout(()=>{},3000)"');
    run(root, 'start', 'T-02');
    const t = run(root, 'verify', 'T-02', '--timeout', '1');
    assert.equal(t.code, 1);
    assert.match(evidence(root, 'T-02').verified.reasons[0], /timed out/);
  } finally {
    // the timed-out command may still hold the folder for a moment on Windows
    for (let i = 0; i < 20; i++) {
      try { rmSync(root, { recursive: true, force: true }); break; } catch { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250); }
    }
  }
});

test('git mv out of a dont_touch folder is caught', () => {
  const root = makeRepo();
  try {
    card(root, 'T-01', { dont_touch: '[src/crypto/**]' });
    run(root, 'start', 'T-01');
    sh(root, 'git', ['mv', 'src/crypto/k.js', 'other/k.js']);
    assert.equal(run(root, 'verify', 'T-01').code, 1);
    assert.ok(evidence(root, 'T-01').verified.forbidden.includes('src/crypto/k.js'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('status --write and --check resolve relative paths against root, not cwd', () => {
  const root = makeRepo();
  try {
    card(root, 'T-01', {});
    assert.equal(run(root, 'status', '--write', 'S.md').code, 0);
    assert.equal(run(root, 'status', '--check', 'S.md').code, 0);
    assert.ok(readFileSync(join(root, 'S.md'), 'utf8').includes('| T-01 |'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('--state keeps cards and evidence in another folder while git runs in root', () => {
  const root = makeRepo();
  const main = mkdtempSync(join(tmpdir(), 'card-state-'));
  const state = join(main, '.claude', 'superuser');
  try {
    rawCard(state, 'T-01', 'touch: [src/**]\ndone_when:\n- node -e "process.exit(0)"');
    const go = (...a) => run(root, ...a, '--state', state);
    assert.equal(go('start', 'T-01').code, 0);
    writeFileSync(join(root, 'src/a.js'), 'line\nmore\n');
    assert.equal(go('verify', 'T-01').code, 0);
    const ev = JSON.parse(readFileSync(join(state, 'evidence', 'T-01.json'), 'utf8'));
    assert.deepEqual(ev.verified.changed, ['src/a.js']);
    assert.equal(go('review', 'T-01', 'pass').code, 0);
    assert.match(go('status').out, /\| T-01 \| Card T-01 \| done \|/);
    assert.equal(run(root, 'verify', 'T-01').code, 2);
  } finally { rmSync(root, { recursive: true, force: true }); rmSync(main, { recursive: true, force: true }); }
});

test('status --write creates a missing folder', () => {
  const root = makeRepo();
  try {
    card(root, 'T-01', {});
    assert.equal(run(root, 'status', '--write', 'docs/plan/STATE.md').code, 0);
    assert.ok(readFileSync(join(root, 'docs', 'plan', 'STATE.md'), 'utf8').includes('| T-01 |'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('without --root, the nearest folder holding .claude/superuser is the root (monorepo sub-project)', () => {
  const root = makeRepo();
  try {
    const sub = join(root, 'apps', 'web');
    card(sub, 'W-01', {});
    const r = spawnSync(process.execPath, [SCRIPT, 'status'], { cwd: join(sub), encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /\| W-01 \|/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('the home folder is never taken as the project even when ~/.claude/superuser exists', () => {
  const home = mkdtempSync(join(tmpdir(), 'card-home-'));
  try {
    card(home, 'H-01', {});
    const proj = join(home, 'proj');
    mkdirSync(proj);
    sh(proj, 'git', ['init', '-q']);
    const env = { ...process.env, HOME: home, USERPROFILE: home };
    const r = spawnSync(process.execPath, [SCRIPT, 'status'], { cwd: proj, encoding: 'utf8', env });
    assert.equal(r.status, 0, r.stderr);
    assert.doesNotMatch(r.stdout, /H-01/);
  } finally { rmSync(home, { recursive: true, force: true }); }
});
