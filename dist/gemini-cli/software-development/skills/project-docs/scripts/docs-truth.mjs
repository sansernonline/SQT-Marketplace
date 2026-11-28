#!/usr/bin/env node
// docs-truth: check that paths and npm scripts named in inline code in agent docs exist.
// Usage: node docs-truth.mjs [--root <dir>] [--ignore <glob>[,<glob>]] [<file>...]
// Default files: CLAUDE.md, AGENTS.md, README.md, .claude/CLAUDE.md, docs/INDEX.md (those that exist).
// Exit 0 ok · 1 something missing · 2 usage or input error.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const DEFAULT_FILES = ['CLAUDE.md', 'AGENTS.md', 'README.md', '.claude/CLAUDE.md', 'docs/INDEX.md'];
// pnpm/yarn built-ins (install, add, dlx...) are not package.json scripts, so they are never reported
const PM_BUILTINS = "add|audit|create|dlx|exec|i|info|init|install|link|outdated|pack|publish|remove|rm|run|up|update|upgrade|why|workspace";
const pmScript = (pm) => new RegExp(`^${pm} (?:run )?(?!(?:${PM_BUILTINS})(?:\\s|$))(\\S+)`);
const SCRIPT_RES = [/^npm run (\S+)/, pmScript('pnpm'), pmScript('yarn')];

export function isPath(s) {
  if (!s || /\s/.test(s)) return false;
  if (/^[~/@$-]/.test(s) || s.startsWith('http')) return false;
  if (s.includes('…') || s.includes('...') || s.includes(':')) return false;
  if (/[<*{]/.test(s)) return false;
  if (!s.includes('/')) return false; // bare names like SKILL.md are generic
  const parts = s.split('/');
  if (parts.length === 2 && !parts[0].includes('.') && !parts[1].includes('.')) return false; // owner/repo, skill/name
  return true;
}

export function globToRegExp(glob) {
  let out = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        i++;
        if (glob[i + 1] === '/') { i++; out += '(?:.*/)?'; } else out += '.*';
      } else out += '[^/]*';
    } else if (c === '?') out += '[^/]';
    else out += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${out}$`);
}

export function extractRefs(markdown) {
  const refs = [];
  let fence = null;
  const lines = String(markdown).split(/\r?\n/);
  lines.forEach((text, i) => {
    const m = /^\s*(```+|~~~+)/.exec(text);
    if (fence) {
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length) fence = null;
      return;
    }
    if (m) { fence = m[1]; return; }
    for (const span of text.matchAll(/`([^`]+)`/g)) {
      const code = span[1].trim();
      let script = null;
      for (const re of SCRIPT_RES) {
        const r = re.exec(code);
        if (r) { script = r[1]; break; }
      }
      if (script) refs.push({ line: i + 1, kind: 'script', value: script });
      else if (isPath(code)) refs.push({ line: i + 1, kind: 'path', value: code });
    }
  });
  return refs;
}

// Returns the refs that are missing. `scripts` may be an array, a Set, or the package.json scripts object.
export function checkRefs(refs, { exists, scripts } = {}) {
  const names = scripts instanceof Set ? scripts
    : Array.isArray(scripts) ? new Set(scripts)
    : new Set(Object.keys(scripts || {}));
  return refs.filter((r) => (r.kind === 'script' ? !names.has(r.value) : !exists(r.value)));
}

function findRoot(args) {
  if (args.root) return path.resolve(args.root);
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return process.cwd();
  }
}

export function main(argv) {
  const args = { root: null, files: [], ignore: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root') {
      if (i + 1 >= argv.length) { console.error('Usage: --root needs a folder'); return 2; }
      args.root = argv[++i];
    } else if (argv[i] === '--ignore') {
      if (i + 1 >= argv.length) { console.error('Usage: --ignore needs a glob'); return 2; }
      args.ignore.push(...argv[++i].split(',').map((g) => g.trim()).filter(Boolean));
    } else if (argv[i].startsWith('--')) {
      console.error(`Unknown option: ${argv[i]}`); return 2;
    } else args.files.push(argv[i]);
  }
  const root = findRoot(args);
  let files = args.files.map((f) => path.resolve(root, f));
  if (!files.length) files = DEFAULT_FILES.map((f) => path.join(root, f)).filter((f) => fs.existsSync(f));
  for (const f of files) {
    if (!fs.existsSync(f)) { console.error(`File not found: ${f}`); return 2; }
  }
  let scripts = {};
  const pkg = path.join(root, 'package.json');
  if (fs.existsSync(pkg)) {
    try { scripts = JSON.parse(fs.readFileSync(pkg, 'utf8')).scripts || {}; }
    catch { console.error('Cannot parse package.json'); return 2; }
  }
  const ignoreRes = args.ignore.map(globToRegExp);
  let total = 0;
  for (const f of files) {
    const dir = path.dirname(f);
    const exists = (v) => fs.existsSync(path.resolve(root, v)) || fs.existsSync(path.resolve(dir, v));
    const rel = path.relative(root, f).split(path.sep).join('/');
    const refs = extractRefs(fs.readFileSync(f, 'utf8'))
      .filter((r) => r.kind !== 'path' || !ignoreRes.some((re) => re.test(r.value)));
    for (const r of checkRefs(refs, { exists, scripts })) {
      console.log(`${rel}:${r.line} · ${r.kind === 'script' ? 'script ' : ''}${r.value} · missing`);
      total++;
    }
  }
  console.log(`missing: ${total}`);
  return total ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
