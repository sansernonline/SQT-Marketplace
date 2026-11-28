#!/usr/bin/env node
// Usage: merge-queue.mjs <card-id>... --check "<command>" [--into <branch>] [--root <dir>]
// Merges lane/<id> branches one by one; runs the check after each; rolls back a merge whose check fails. Never pushes.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function planQueue(ids) {
  return [...new Set(ids)];
}

function git(cwd, args) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return { code: r.status ?? 1, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

function main(argv) {
  const ids = [];
  const opt = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) opt[argv[i].slice(2)] = argv[++i];
    else ids.push(argv[i]);
  }
  if (!ids.length || !opt.check) {
    console.error('Usage: merge-queue.mjs <card-id>... --check "<command>" [--into <branch>]');
    return 2;
  }
  let root;
  if (opt.root) root = path.resolve(opt.root);
  else {
    const r = git(process.cwd(), ['rev-parse', '--show-toplevel']);
    root = r.code === 0 && r.out ? path.resolve(r.out) : process.cwd();
  }
  // Lane registry and card evidence live under .claude/superuser/, so they do not count as dirty.
  if (git(root, ['status', '--porcelain', '-uall', '--', '.', ':(exclude).claude/superuser']).out !== '') {
    console.error('Working tree is not clean. Commit or stash first.');
    return 2;
  }
  const branchName = git(root, ['rev-parse', '--abbrev-ref', 'HEAD']).out;
  // detached HEAD reports the name `HEAD`; restore by commit instead
  const original = branchName === 'HEAD' ? git(root, ['rev-parse', 'HEAD']).out : branchName;
  if (opt.into) {
    const c = git(root, ['checkout', opt.into]);
    if (c.code !== 0) {
      console.error(`Cannot switch to ${opt.into}: ${c.err}`);
      return 2;
    }
  }

  const plan = planQueue(ids);
  const results = [];
  for (const id of plan) {
    const before = git(root, ['rev-parse', 'HEAD']).out;
    const m = git(root, ['merge', '--no-ff', '--no-edit', `lane/${id}`]);
    if (m.code !== 0) {
      if (git(root, ['rev-parse', '-q', '--verify', 'MERGE_HEAD']).code === 0) {
        git(root, ['merge', '--abort']);
        results.push([id, 'conflict', '']);
      } else {
        results.push([id, 'merge failed', (m.err || m.out).split('\n')[0]]);
      }
      break;
    }
    const mergeSha = git(root, ['rev-parse', 'HEAD']).out;
    const c = spawnSync(opt.check, { cwd: root, shell: true, stdio: 'inherit' });
    if ((c.status ?? 1) !== 0) {
      let note = `check exit ${c.status ?? 1}`;
      let result = 'rolled back';
      if (mergeSha !== before) {
        // --keep (not --hard): uncommitted edits the clean check let through (.claude/superuser/) survive;
        // if one sits in a file the merge touched, git refuses instead of overwriting it.
        if (git(root, ['rev-parse', 'HEAD']).out !== mergeSha) {
          result = 'rollback failed';
          note += ', HEAD moved during the check, not reset';
        } else if (git(root, ['reset', '--keep', before]).code !== 0) {
          result = 'rollback failed';
          note += `, git refused (uncommitted edits in merged files) — the merge is still in place; undo by hand: git reset --keep ${before}`;
        }
      }
      results.push([id, result, note]);
      break;
    }
    results.push([id, 'merged', '']);
  }

  if (opt.into) git(root, ['checkout', original]);

  console.log('| id | result | note |');
  console.log('|---|---|---|');
  for (const [id, res, note] of results) console.log(`| ${id} | ${res} | ${note} |`);
  return results.length === plan.length && results.every((r) => r[1] === 'merged') ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
