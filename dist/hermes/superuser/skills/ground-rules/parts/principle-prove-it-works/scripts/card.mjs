#!/usr/bin/env node
// Work cards with computed status: a card is done only when its done_when commands pass, it stayed in scope and it is not oversized.
// Usage: node card.mjs <start|verify|review|abandon|status|next|stats> [<id>] [options] [--root <dir>] [--state <dir>]
// Files live in <state>/{cards,evidence,evidence/reviews,config.json}; <state> defaults to <root>/.claude/superuser (--state <dir> changes it). Git and done_when commands run in <root>. Exit 0 ok · 1 check failed · 2 usage or input error.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const KINDS = ['spec-mismatch', 'missing-test', 'out-of-scope', 'docs', 'quality', 'security', 'other'];
const DEFAULT_CAPS = { S: [100, 200], M: [300, 600], L: [800, 1600] };
const BOOL_FLAGS = new Set(['restart', 'parallel']);

class CliError extends Error {
  constructor(message, code) { super(message); this.code = code; }
}
const die = (message, code = 2) => { throw new CliError(message, code); };

// ---------- pure helpers (exported for tests) ----------

const COMMENT_KEYS = new Set(['size', 'depends', 'touch', 'dont_touch', 'scenarios', 'id']);
const unquote = s => (s.length > 1 && /^["']/.test(s) && s.at(-1) === s[0]) ? s.slice(1, -1) : s;

export function parseCard(text) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const out = {};
  if (lines[0].trim() !== '---') return out;
  let key = null;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---') break;
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && key !== null && Array.isArray(out[key])) { out[key].push(unquote(item[1].trim())); continue; }
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m) continue;
    key = m[1];
    const v = (COMMENT_KEYS.has(key) ? m[2].replace(/(^|\s)#.*$/, '') : m[2]).trim();
    if (v === '') out[key] = [];
    else if (v.startsWith('[') && v.endsWith(']')) out[key] = v.slice(1, -1).split(',').map(s => unquote(s.trim())).filter(Boolean);
    else out[key] = unquote(v);
  }
  return out;
}

export function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*' && glob[i + 1] === '*') {
      if (glob[i + 2] === '/') { re += '(?:.*/)?'; i += 2; } else { re += '.*'; i += 1; }
    } else if (c === '*') re += '[^/]*';
    else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`);
}

const TEST_RES = [/(^|\/)(test|tests|__tests__)\//, /\.(test|spec)\.[^./]+$/, /_test\.[^./]+$/, /(^|\/)test_[^/]+\.py$/];
export const isTestFile = path => TEST_RES.some(re => re.test(path));

export function capsFor(size, config) {
  const table = { ...DEFAULT_CAPS, ...(config?.card_caps || {}) };
  return table[size] || table.M;
}

export function statusOf(evidence) {
  if (!evidence) return 'todo';
  if (evidence.abandoned) return 'abandoned';
  if (!evidence.verified) return 'doing';
  return evidence.verified.pass && !evidence.reviewFailed ? 'done' : 'failed';
}

const literalPrefix = g => g.slice(0, g.search(/[*?]/) === -1 ? g.length : g.search(/[*?]/));
export function globsOverlap(a, b) {
  const x = literalPrefix(a), y = literalPrefix(b);
  return x.startsWith(y) || y.startsWith(x);
}

const byId = (a, b) => a.id.localeCompare(b.id, 'en', { numeric: true });
const list = v => Array.isArray(v) ? v : (v ? [v] : []);

export function pickParallel(cards) {
  const picked = [];
  for (const card of [...cards].sort(byId)) {
    const t = list(card.touch);
    const clash = picked.some(p => {
      const u = list(p.touch);
      return !t.length || !u.length || t.some(a => u.some(b => globsOverlap(a, b)));
    });
    if (!clash) picked.push(card);
  }
  return picked;
}

// ---------- files ----------

const sha1 = buf => createHash('sha1').update(buf).digest('hex');
const readJson = file => existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
const writeJson = (file, data) => {
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
};
const evidencePath = (state, id) => join(state, 'evidence', `${id}.json`);
const reviewsPath = (state, id) => join(state, 'evidence', 'reviews', `${id}.json`);

function checkId(id) {
  if (!id || !/^[A-Za-z0-9._-]+$/.test(id) || id.startsWith('.')) die('Give a card id like T-01.');
  return id;
}

function loadCard(state, id) {
  checkId(id);
  const file = join(state, 'cards', `${id}.md`);
  if (!existsSync(file)) die(`No card file: ${file}`);
  const card = parseCard(readFileSync(file, 'utf8'));
  if (card.id !== id) die(`Card id "${card.id}" does not match file name ${id}.md`);
  return card;
}

function loadAll(state) {
  const dir = join(state, 'cards');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
    const card = loadCard(state, f.slice(0, -3));
    return { ...card, id: card.id, evidence: readJson(evidencePath(state, card.id)) };
  }).sort(byId);
}

// ---------- git ----------

function git(root, args) {
  const r = spawnSync('git', ['-c', 'core.quotepath=false', ...args], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28 });
  return r.status === 0 ? r.stdout : null;
}
const gitLines = out => (out || '').split('\n').map(s => s.replace(/\r$/, '')).filter(Boolean);

function fileHash(root, path) {
  const full = join(root, path);
  return existsSync(full) ? sha1(readFileSync(full)) : 'deleted';
}

function findRoot(flagRoot) {
  if (flagRoot) return resolve(flagRoot);
  const top = git(process.cwd(), ['rev-parse', '--show-toplevel']);
  return top ? resolve(top.trim()) : process.cwd();
}

// ---------- commands ----------

function statusMap(state) {
  return Object.fromEntries(loadAll(state).map(c => [c.id, statusOf(c.evidence)]));
}

function cmdStart(root, state, id, flags) {
  const card = loadCard(state, id);
  const statuses = statusMap(state);
  const notDone = list(card.depends).filter(d => statuses[d] !== 'done');
  if (notDone.length) die(`Cannot start ${id}: not done yet: ${notDone.join(', ')}`, 1);
  const old = readJson(evidencePath(state, id));
  if (old && statusOf(old) !== 'abandoned' && !flags.restart) die(`${id} already has evidence (${statusOf(old)}). Use --restart to start again.`, 1);
  const commit = git(root, ['rev-parse', 'HEAD'])?.trim() || null;
  const dirty = {};
  if (commit) {
    const names = new Set([
      ...gitLines(git(root, ['diff', '--name-only', '--no-renames', '--relative', 'HEAD'])),
      ...gitLines(git(root, ['ls-files', '--others', '--exclude-standard'])),
    ]);
    for (const n of names) dirty[n] = fileHash(root, n);
  }
  writeJson(evidencePath(state, id), { id, attempts: 0, started: { at: new Date().toISOString(), commit, dirty } });
  console.log(`Started ${id} at ${commit ? commit.slice(0, 7) : 'no git'} with ${Object.keys(dirty).length} files already changed.`);
  return 0;
}

const countLines = text => text === '' ? 0 : text.split('\n').length - (text.endsWith('\n') ? 1 : 0);

function runCommand(root, cmd, timeoutSec) {
  const t0 = Date.now();
  const r = spawnSync(cmd, { shell: true, cwd: root, encoding: 'utf8', timeout: timeoutSec * 1000, maxBuffer: 1 << 28 });
  const text = `${r.stdout || ''}${r.stderr || ''}`;
  return { cmd, exit: r.status ?? -1, ms: Date.now() - t0, tail: text.slice(-2000), timedOut: r.error?.code === 'ETIMEDOUT' };
}

function cmdVerify(root, state, id, flags) {
  const card = loadCard(state, id);
  const ev = readJson(evidencePath(state, id));
  if (!ev?.started) die(`${id} was not started. Run: card start ${id}`);
  const timeout = flags.timeout === undefined ? 600 : Number(flags.timeout);
  if (!(timeout > 0)) die('--timeout must be a number of seconds.');
  ev.attempts += 1;

  const reasons = [];
  if (!list(card.done_when).length) reasons.push('no done_when commands');
  const commands = list(card.done_when).map(cmd => {
    const r = runCommand(root, cmd, timeout);
    if (r.exit !== 0) reasons.push(r.timedOut ? `command timed out after ${timeout}s: ${cmd}` : `command failed (exit ${r.exit}): ${cmd}`);
    return { cmd: r.cmd, exit: r.exit, ms: r.ms, tail: r.tail };
  });

  const config = readJson(join(state, 'config.json'));
  const [capCode, capTest] = capsFor(card.size || 'M', config);
  const lines = { code: 0, test: 0, capCode, capTest, warn: false };
  let changed = [], outOfScope = [], forbidden = [];

  if (!ev.started.commit) {
    reasons.push('warning: not a git repo, scope not checked');
  } else {
    const start = ev.started.commit;
    const untracked = new Set(gitLines(git(root, ['ls-files', '--others', '--exclude-standard'])));
    const names = new Set([...gitLines(git(root, ['diff', '--name-only', '--no-renames', '--relative', start])), ...untracked]);
    changed = [...names]
      .filter(n => !n.startsWith('.claude/superuser/'))
      .filter(n => !(n in ev.started.dirty && ev.started.dirty[n] === fileHash(root, n)))
      .sort();
    const touch = list(card.touch).map(globToRegExp);
    const noTouch = list(card.dont_touch).map(globToRegExp);
    if (touch.length) outOfScope = changed.filter(f => !touch.some(re => re.test(f)));
    forbidden = changed.filter(f => noTouch.some(re => re.test(f)));

    const added = {};
    for (const l of gitLines(git(root, ['diff', '--numstat', '--no-renames', '--relative', start]))) {
      const [a, d, ...p] = l.split('\t');
      added[p.join('\t')] = (Number(a) || 0) + (Number(d) || 0);
    }
    for (const f of changed) {
      const n = untracked.has(f) ? countLines(readFileSync(join(root, f), 'utf8')) : (added[f] || 0);
      lines[isTestFile(f) ? 'test' : 'code'] += n;
    }
    for (const [what, n, cap] of [['code', lines.code, capCode], ['test', lines.test, capTest]]) {
      if (n > cap) {
        lines.warn = true;
        reasons.push(n > 2 * cap ? `${what} lines ${n} are over twice the cap ${cap}: split the card` : `warning: ${what} lines ${n} are over the cap ${cap}`);
      }
    }
    if (outOfScope.length) reasons.push(`files outside touch: ${outOfScope.join(', ')}`);
    if (forbidden.length) reasons.push(`files in dont_touch: ${forbidden.join(', ')}`);
  }

  const pass = commands.length > 0 && commands.every(c => c.exit === 0) && !outOfScope.length && !forbidden.length
    && lines.code <= 2 * capCode && lines.test <= 2 * capTest;
  ev.verified = { at: new Date().toISOString(), pass, commands, changed, outOfScope, forbidden, lines, reasons };
  if (pass) delete ev.reviewFailed;
  writeJson(evidencePath(state, id), ev);

  console.log(`${id}: ${pass ? 'PASS' : 'FAIL'} · attempt ${ev.attempts} · ${commands.length} commands · ${changed.length} files changed · lines code ${lines.code}/${capCode} test ${lines.test}/${capTest}`);
  for (const r of reasons) console.log(`- ${r}`);
  return pass ? 0 : 1;
}

function cmdReview(state, id, result, flags) {
  checkId(id);
  if (result !== 'pass' && result !== 'fail') die('Usage: card review <id> pass|fail [--kind a,b] [--note text]');
  const kinds = flags.kind ? String(flags.kind).split(',').map(s => s.trim()).filter(Boolean) : [];
  const bad = kinds.filter(k => !KINDS.includes(k));
  if (bad.length) die(`Unknown kind: ${bad.join(', ')}. Allowed: ${KINDS.join(', ')}`);
  const ev = readJson(evidencePath(state, id));
  if (!ev?.verified?.pass) die(`${id} has no passing verify. Run: card verify ${id}`, 1);
  const reviews = readJson(reviewsPath(state, id)) || [];
  const round = reviews.length + 1;
  reviews.push({ round, at: new Date().toISOString(), result, kinds, note: flags.note || '' });
  writeJson(reviewsPath(state, id), reviews);
  if (result === 'fail') { ev.reviewFailed = round; writeJson(evidencePath(state, id), ev); }
  console.log(`${id}: review round ${round} ${result}`);
  return 0;
}

function cmdAbandon(state, id, flags) {
  checkId(id);
  if (!flags.reason) die('Usage: card abandon <id> --reason <text>');
  const ev = readJson(evidencePath(state, id)) || { id, attempts: 0 };
  ev.abandoned = { at: new Date().toISOString(), reason: String(flags.reason) };
  writeJson(evidencePath(state, id), ev);
  console.log(`${id}: abandoned`);
  return 0;
}

function statusTable(state) {
  const cards = loadAll(state);
  const rows = ['| id | title | status | attempts | review rounds | last verify |', '|---|---|---|---|---|---|'];
  const count = {};
  for (const c of cards) {
    const status = statusOf(c.evidence);
    count[status] = (count[status] || 0) + 1;
    const v = c.evidence?.verified;
    const rounds = (readJson(reviewsPath(state, c.id)) || []).length;
    rows.push(`| ${c.id} | ${String(c.title || '').replace(/\|/g, '\\|')} | ${status} | ${c.evidence?.attempts ?? 0} | ${rounds} | ${v ? `${v.pass ? 'pass' : 'fail'} ${v.at}` : '-'} |`);
  }
  const parts = ['todo', 'doing', 'done', 'failed', 'abandoned'].map(s => `${s} ${count[s] || 0}`);
  rows.push('', `total: ${cards.length} · ${parts.join(' · ')}`);
  return rows.join('\n') + '\n';
}

function cmdStatus(root, state, flags) {
  const table = statusTable(state);
  if (flags.check) {
    const file = resolve(root, String(flags.check));
    if (!existsSync(file) || readFileSync(file, 'utf8') !== table) { console.log(`${file} is out of date. Run: card status --write ${flags.check}`); return 1; }
    console.log(`${file} is up to date.`);
    return 0;
  }
  if (flags.write) writeFileSync(resolve(root, String(flags.write)), table);
  process.stdout.write(table);
  return 0;
}

function cmdNext(state, flags) {
  const all = loadAll(state);
  const statuses = Object.fromEntries(all.map(c => [c.id, statusOf(c.evidence)]));
  const ready = all.filter(c => statuses[c.id] === 'todo' && list(c.depends).every(d => statuses[d] === 'done'));
  if (!ready.length) { console.log('No card is ready.'); return 0; }
  for (const c of flags.parallel ? pickParallel(ready) : ready.slice(0, 1)) console.log(`${c.id} ${c.title || ''}`.trim());
  return 0;
}

function cmdStats(state) {
  const dir = join(state, 'evidence', 'reviews');
  const files = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.json')) : [];
  let rounds = 0, fails = 0;
  const kinds = {};
  for (const f of files) {
    for (const r of readJson(join(dir, f)) || []) {
      rounds += 1;
      if (r.result === 'fail') fails += 1;
      for (const k of r.kinds || []) kinds[k] = (kinds[k] || 0) + 1;
    }
  }
  console.log(`rounds: ${rounds} · fails: ${fails}`);
  for (const [k, n] of Object.entries(kinds).sort((a, b) => b[1] - a[1])) console.log(`${k}: ${n}`);
  return 0;
}

function parseArgs(argv) {
  const pos = [], flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { pos.push(a); continue; }
    const k = a.slice(2);
    if (BOOL_FLAGS.has(k)) flags[k] = true;
    else if (i + 1 < argv.length) flags[k] = argv[++i];
    else die(`Option --${k} needs a value.`);
  }
  return { pos, flags };
}

const USAGE = 'Usage: node card.mjs <start|verify|review|abandon|status|next|stats> [<id>] [options] [--root <dir>] [--state <dir>]';

export function main(argv) {
  try {
    if (!argv.length || argv.includes('--help')) { console.log(USAGE); return argv.length ? 0 : 2; }
    const { pos, flags } = parseArgs(argv);
    const [cmd, id, extra] = pos;
    const root = findRoot(flags.root);
    const state = flags.state ? resolve(flags.state) : join(root, '.claude', 'superuser');
    switch (cmd) {
      case 'start': return cmdStart(root, state, id, flags);
      case 'verify': return cmdVerify(root, state, id, flags);
      case 'review': return cmdReview(state, id, extra, flags);
      case 'abandon': return cmdAbandon(state, id, flags);
      case 'status': return cmdStatus(root, state, flags);
      case 'next': return cmdNext(state, flags);
      case 'stats': return cmdStats(state);
      default: die(USAGE);
    }
  } catch (e) {
    if (e instanceof CliError) { console.error(e.message); return e.code; }
    throw e;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main(process.argv.slice(2));
}
