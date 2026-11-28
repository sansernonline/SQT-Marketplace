#!/usr/bin/env node
// Usage: lane.mjs add <card-id> [--base-port 4100] [--db-prefix test] | list | remove <card-id> [--root <dir>]
// One git worktree per card, with its own port and test database. Registry: <root>/.claude/superuser/lanes.json
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function nextPort(registry, base) {
  const used = new Set(Object.values(registry).map((l) => l.port));
  let k = 1;
  while (used.has(base + k)) k++;
  return base + k;
}

export function dbName(prefix, id) {
  return `${prefix}_${String(id).toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
}

function git(cwd, args) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return { code: r.status ?? 1, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

function parseArgs(argv) {
  const pos = [];
  const opt = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) opt[argv[i].slice(2)] = argv[++i];
    else pos.push(argv[i]);
  }
  return { pos, opt };
}

function findRoot(opt) {
  if (opt.root) return path.resolve(opt.root);
  const r = git(process.cwd(), ['rev-parse', '--show-toplevel']);
  return r.code === 0 && r.out ? path.resolve(r.out) : process.cwd();
}

function main(argv) {
  const { pos, opt } = parseArgs(argv);
  const [cmd, id] = pos;
  if (!['add', 'list', 'remove'].includes(cmd) || (cmd !== 'list' && !id)) {
    console.error('Usage: lane.mjs add <card-id> | list | remove <card-id>');
    return 2;
  }
  const root = findRoot(opt);
  const regFile = path.join(root, '.claude', 'superuser', 'lanes.json');
  const registry = fs.existsSync(regFile) ? JSON.parse(fs.readFileSync(regFile, 'utf8')) : {};
  const save = () => {
    fs.mkdirSync(path.dirname(regFile), { recursive: true });
    fs.writeFileSync(regFile, JSON.stringify(registry, null, 2) + '\n');
  };

  if (cmd === 'list') {
    console.log('| id | branch | port | db | path | exists |');
    console.log('|---|---|---|---|---|---|');
    for (const [k, l] of Object.entries(registry)) {
      console.log(`| ${k} | ${l.branch} | ${l.port} | ${l.db} | ${l.path} | ${fs.existsSync(l.path) ? 'yes' : 'no'} |`);
    }
    return 0;
  }

  if (cmd === 'add') {
    if (registry[id]) {
      console.error(`Lane ${id} is already registered.`);
      return 1;
    }
    const base = opt['base-port'] === undefined ? 4100 : Number(opt['base-port']);
    if (!Number.isInteger(base)) {
      console.error('--base-port must be a number.');
      return 2;
    }
    const lane = {
      path: path.join(path.dirname(root), `${path.basename(root)}-lane-${id}`),
      branch: `lane/${id}`,
      port: nextPort(registry, base),
      db: dbName(opt['db-prefix'] ?? 'test', id),
    };
    const r = git(root, ['worktree', 'add', '-b', lane.branch, lane.path, 'HEAD']);
    if (r.code !== 0) {
      console.error(`git could not add the worktree: ${r.err}`);
      return 1;
    }
    fs.writeFileSync(path.join(lane.path, '.env.lane'), `PORT=${lane.port}\nTEST_DB_NAME=${lane.db}\nLANE_ID=${id}\n`);
    // Keep .env.lane out of `git add -A` (the exclude file is shared by all worktrees).
    const ex = git(lane.path, ['rev-parse', '--git-path', 'info/exclude']);
    if (ex.code === 0 && ex.out) {
      const exFile = path.resolve(lane.path, ex.out);
      fs.mkdirSync(path.dirname(exFile), { recursive: true });
      const current = fs.existsSync(exFile) ? fs.readFileSync(exFile, 'utf8') : '';
      if (!/^\.env\.lane$/m.test(current)) fs.appendFileSync(exFile, `${current && !current.endsWith('\n') ? '\n' : ''}.env.lane\n`);
    }
    registry[id] = lane;
    save();
    console.log(`Lane ${id}: ${lane.path} port ${lane.port} db ${lane.db}`);
    return 0;
  }

  // remove
  const lane = registry[id];
  if (!lane) {
    console.error(`Lane ${id} is not registered.`);
    return 1;
  }
  if (!fs.existsSync(lane.path)) {
    git(root, ['worktree', 'prune']);
    delete registry[id];
    save();
    console.log(`Lane ${id}: folder was already gone. Pruned and dropped from the registry.`);
    return 0;
  }
  const r = git(root, ['worktree', 'remove', lane.path]);
  if (r.code !== 0) {
    console.error(`git refused to remove the worktree (changes inside?): ${r.err}`);
    return 1;
  }
  const b = git(root, ['branch', '-d', lane.branch]);
  delete registry[id];
  save();
  console.log(`Removed lane ${id}.${b.code === 0 ? '' : ` Branch ${lane.branch} kept (not merged).`}`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
