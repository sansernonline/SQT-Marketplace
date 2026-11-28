#!/usr/bin/env node
// Checks that every scenario id in the spec appears in at least one test file.
// Usage: spec-matrix --spec <glob>[,<glob>] [--tests <glob>[,<glob>]] [--id <regex>] [--json] [--root <dir>]
// Exit: 0 all covered · 1 an id is missing · 2 usage error.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const DEFAULT_ID = String.raw`\b(?:AC|SC|FR|US|NFR)-\d+(?:\.\d+)*\b`;
const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.venv']);
const TEST_RES = [
  /(^|\/)(test|tests|__tests__)\//,
  /\.(test|spec)\.[^./]+$/,
  /_test\.[^./]+$/,
  /(^|\/)test_[^/]+\.py$/,
];

export function isTestFile(p) {
  return TEST_RES.some((r) => r.test(p));
}

export function globToRegExp(glob) {
  let out = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        i++;
        if (glob[i + 1] === '/') {
          i++;
          out += '(?:.*/)?';
        } else out += '.*';
      } else out += '[^/]*';
    } else if (c === '?') out += '[^/]';
    else out += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${out}$`);
}

// Returns unique ids with the line number of the first occurrence: [{ id, line }]
export function collectIds(text, re) {
  const flags = re.flags.includes('g') ? re.flags : re.flags + 'g';
  const g = new RegExp(re.source, flags);
  const seen = new Map();
  text.split(/\r?\n/).forEach((lineText, i) => {
    for (const m of lineText.matchAll(g)) if (!seen.has(m[0])) seen.set(m[0], i + 1);
  });
  return [...seen].map(([id, line]) => ({ id, line }));
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasWord = (text, id) => new RegExp(`(?<![\\w-])${esc(id)}(?![\\w-]|\\.\\d)`).test(text);

// specIds: [{ id, spec }] (spec = "file:line") · testFiles: [{ file, text }]
export function matrix(specIds, testFiles, re = new RegExp(DEFAULT_ID)) {
  const rows = specIds.map(({ id, spec }) => ({
    id,
    spec,
    tests: testFiles.filter((t) => hasWord(t.text, id)).map((t) => t.file),
  }));
  const missing = rows.filter((r) => r.tests.length === 0).map((r) => r.id);
  const known = new Set(specIds.map((s) => s.id));
  const orphan = [
    ...new Set(testFiles.flatMap((t) => collectIds(t.text, re).map((x) => x.id))),
  ].filter((id) => !known.has(id));
  return { rows, missing, orphan };
}

function walk(root, dir = '', out = []) {
  for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP.has(e.name)) walk(root, dir ? `${dir}/${e.name}` : e.name, out);
    } else if (e.isFile()) out.push(dir ? `${dir}/${e.name}` : e.name);
  }
  return out;
}

function findRoot(arg) {
  if (arg) return path.resolve(arg);
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return process.cwd();
  }
}

function parseArgs(argv) {
  const o = { json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') o.json = true;
    else if (['--spec', '--tests', '--id', '--root'].includes(a)) {
      if (i + 1 >= argv.length) throw new Error(`${a} needs a value`);
      o[a.slice(2)] = argv[++i];
    } else throw new Error(`Unknown argument: ${a}`);
  }
  if (!o.spec) throw new Error('--spec is required');
  return o;
}

export function main(argv) {
  let o;
  let re;
  try {
    o = parseArgs(argv);
    re = new RegExp(o.id ?? DEFAULT_ID);
  } catch (e) {
    console.error(`${e.message}\nUsage: spec-matrix --spec <glob>[,<glob>] [--tests <glob>[,<glob>]] [--id <regex>] [--json]`);
    return 2;
  }
  const root = findRoot(o.root);
  const all = walk(root);
  const pick = (globs) => {
    const rs = globs.split(',').map((g) => globToRegExp(g.trim()));
    return all.filter((f) => rs.some((r) => r.test(f)));
  };
  const specFiles = pick(o.spec);
  if (specFiles.length === 0) {
    console.error('No spec files matched.');
    return 2;
  }
  const testPaths = o.tests ? pick(o.tests) : all.filter(isTestFile);
  const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
  const specIds = [];
  const seen = new Set();
  for (const f of specFiles)
    for (const { id, line } of collectIds(read(f), re))
      if (!seen.has(id)) {
        seen.add(id);
        specIds.push({ id, spec: `${f}:${line}` });
      }
  if (specIds.length === 0) {
    console.error('no ids found in spec — check --spec and --id');
    return 2;
  }
  const res = matrix(specIds, testPaths.map((f) => ({ file: f, text: read(f) })), re);
  if (o.json) console.log(JSON.stringify(res, null, 2));
  else {
    console.log('| id | spec | tests |\n|---|---|---|');
    for (const r of res.rows) console.log(`| ${r.id} | ${r.spec} | ${r.tests.join(', ') || '-'} |`);
    console.log(`missing: ${res.missing.length}`);
    console.log(`orphan: ${res.orphan.length}`);
  }
  return res.missing.length > 0 ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main(process.argv.slice(2));
}
