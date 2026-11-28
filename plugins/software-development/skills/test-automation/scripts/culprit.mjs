#!/usr/bin/env node
// Find the first commit that breaks a test command, without touching your working tree.
// Usage: node culprit.mjs --good <commit> [--bad <commit>] --test "<command>" [--setup "<command>"] [--root <dir>]
// --setup runs in the temp worktree after each checkout, before the test (e.g. "npm ci").
// Node repos usually need it, because the temp worktree has no node_modules.
// Exit: 0 found · 1 not found · 2 usage or input error.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function parseBisect(output) {
  const m = /^([0-9a-f]{7,40}) is the first bad commit/m.exec(output);
  if (!m) return null;
  const rest = output.slice(m.index + m[0].length);
  const s = /^ {4}(\S.*)$/m.exec(rest);
  return { sha: m[1], subject: s ? s[1].trim() : '' };
}

export function cardIdFrom(subject) {
  const m = /\b[A-Z]{1,3}-\d+\b/.exec(subject || '');
  return m ? m[0] : null;
}

function git(args, cwd) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return { code: r.status ?? 1, out: (r.stdout || '') + (r.stderr || ''), stdout: r.stdout || '' };
}

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--good' || a === '--bad' || a === '--test' || a === '--root' || a === '--setup') o[a.slice(2)] = argv[++i];
  }
  return o;
}

function runTest(command, cwd) {
  return spawnSync(command, { cwd, shell: true, stdio: 'ignore' }).status;
}

function fail(msg, code = 2) {
  console.error(msg);
  return code;
}

export async function main(argv) {
  const o = parseArgs(argv);
  if (!o.good || !o.test) return fail('Usage: culprit.mjs --good <commit> [--bad <commit>] --test "<command>" [--setup "<command>"] [--root <dir>]');
  let root = o.root;
  if (!root) {
    const r = git(['rev-parse', '--show-toplevel'], process.cwd());
    root = r.code === 0 ? r.stdout.trim() : process.cwd();
  }
  root = path.resolve(root);
  const bad = o.bad || 'HEAD';
  const sha = (ref) => {
    const r = git(['rev-parse', '--verify', `${ref}^{commit}`], root);
    return r.code === 0 ? r.stdout.trim() : null;
  };
  const goodSha = sha(o.good);
  const badSha = sha(bad);
  if (!goodSha) return fail(`Not a commit: ${o.good}`);
  if (!badSha) return fail(`Not a commit: ${bad}`);

  const tmp = mkdtempSync(path.join(tmpdir(), 'sqt-culprit-'));
  const wt = path.join(tmp, 'wt');
  let added = false;
  try {
    const add = git(['worktree', 'add', '--detach', wt, badSha], root);
    if (add.code !== 0) return fail(`Cannot create temp worktree: ${add.out.trim()}`);
    added = true;

    const checkout = (ref) => {
      const c = git(['checkout', '--detach', ref], wt);
      return c.code === 0 ? null : `git checkout ${ref} failed: ${c.out.trim()}`;
    };
    const setup = () => (o.setup && runTest(o.setup, wt) !== 0 ? `The setup command failed: ${o.setup}` : null);
    let err = checkout(goodSha) || setup();
    if (err) return fail(err);
    if (runTest(o.test, wt) !== 0) return fail('The test command does not pass at the good commit.');
    err = checkout(badSha) || setup();
    if (err) return fail(err);
    if (runTest(o.test, wt) === 0) return fail('The test command does not fail at the bad commit.');

    // A runner script keeps the quoting of the command safe on Windows and Linux.
    const runner = path.join(tmp, 'run.mjs').replace(/\\/g, '/');
    writeFileSync(runner, "import { spawnSync } from 'node:child_process';\n" +
      "const setup = process.env.SQT_CULPRIT_SETUP;\n" +
      "if (setup && spawnSync(setup, { shell: true, stdio: 'ignore' }).status !== 0) process.exit(125);\n" +
      "const r = spawnSync(process.env.SQT_CULPRIT_CMD, { shell: true, stdio: 'ignore' });\n" +
      'process.exit(r.status === 125 ? 125 : r.status === 0 ? 0 : 1);\n');
    const start = git(['bisect', 'start', badSha, goodSha], wt);
    if (start.code !== 0) return fail(`git bisect start failed: ${start.out.trim()}`);
    const r = spawnSync('git', ['bisect', 'run', process.execPath.replace(/\\/g, '/'), runner], {
      cwd: wt, encoding: 'utf8', env: { ...process.env, SQT_CULPRIT_CMD: o.test, SQT_CULPRIT_SETUP: o.setup || '' },
    });
    const found = parseBisect((r.stdout || '') + (r.stderr || ''));
    if (!found) return fail('Bisect did not find a first bad commit.', 1);
    let subject = found.subject;
    if (!subject) subject = git(['log', '-1', '--format=%s', found.sha], wt).stdout.trim();
    console.log(`first bad: ${found.sha} ${subject}`);
    const id = cardIdFrom(subject);
    if (id) console.log(`card: ${id}`);
    return 0;
  } finally {
    if (added) {
      git(['bisect', 'reset'], wt);
      git(['worktree', 'remove', '--force', wt], root);
    }
    git(['worktree', 'prune'], root);
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).then((c) => process.exit(c));
}
