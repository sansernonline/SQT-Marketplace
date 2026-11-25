#!/usr/bin/env node
// Writes a project map (folders, files, role line, relative imports) so workers read it instead of exploring.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve, relative, posix } from 'node:path';

const SKIP = new Set(['node_modules', '.git', 'dist', '_to_delete', '.venv']);
const CODE = new Set(['.js', '.mjs', '.ts', '.tsx', '.py']);
const TEXT = new Set([...CODE, '.md', '.json', '.sh', '.yml', '.yaml', '.toml', '.css', '.html']);
const ext = (f) => { const i = f.lastIndexOf('.'); return i < 0 ? '' : f.slice(i).toLowerCase(); };

const args = process.argv.slice(2);
let dir = '.', out = 'docs/FILE-MAP.md', max = 400, stdout = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') out = args[++i];
  else if (args[i] === '--max') max = Number(args[++i]);
  else if (args[i] === '--stdout') stdout = true;
  else dir = args[i];
}
const root = resolve(dir);

function listFiles() {
  try {
    const o = execFileSync('git', ['-C', root, 'ls-files'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 28 });
    return o.split('\n').filter(Boolean);
  } catch {
    const res = [];
    const walk = (d) => {
      for (const e of readdirSync(join(root, d), { withFileTypes: true })) {
        if (SKIP.has(e.name)) continue;
        const p = d ? `${d}/${e.name}` : e.name;
        if (e.isDirectory()) walk(p); else if (e.isFile()) res.push(p);
      }
    };
    walk('');
    return res;
  }
}

const trim = (s) => { s = s.replace(/\s+/g, ' ').trim(); return s.length > 80 ? s.slice(0, 79) + '…' : s; };

function role(p, text) {
  const e = ext(p);
  if (p.split('/').pop() === 'package.json') {
    try { return trim(String(JSON.parse(text).description ?? '')); } catch { return ''; }
  }
  if (e === '.md') { const m = text.match(/^#{1,6}\s+(.+)$/m); return m ? trim(m[1]) : ''; }
  if (!CODE.has(e) && e !== '.sh') return '';
  const lines = text.split('\n');
  let l = lines[0] ?? '';
  if (l.startsWith('#!')) l = lines[1] ?? '';
  const m = l.match(/^\s*(?:\/\/|#)\s?(.*)$/);
  return m ? trim(m[1]) : '';
}

function uses(p, text) {
  const e = ext(p);
  if (!CODE.has(e)) return [];
  const specs = [];
  if (e === '.py') {
    for (const m of text.matchAll(/^\s*from\s+(\.+)([\w.]*)\s+import/gm)) {
      const up = m[1].length - 1;
      specs.push((up ? '../'.repeat(up) : './') + m[2].replace(/\./g, '/'));
    }
  } else {
    for (const m of text.matchAll(/(?:from|import|require)\s*\(?\s*['"](\.[^'"]*)['"]/g)) specs.push(m[1]);
  }
  const d = posix.dirname(p);
  return [...new Set(specs.map((s) => posix.normalize(posix.join(d, s)).replace(/\/$/, '')))];
}

const files = listFiles().sort();
const folderOf = (p) => posix.dirname(p);
const cell = (s) => s.replace(/\|/g, '\\|');
const date = new Date().toISOString().slice(0, 10);
const cmd = `node ${relative(process.cwd(), process.argv[1]).replace(/\\/g, '/')} ${dir} --out ${out} --max ${max}`;
const L = [
  '# File map', '',
  `Generated: ${date} · Files: ${files.length}`, '',
  `Regenerate: \`${cmd}\``, '',
];

const byFolder = new Map();
for (const f of files) {
  const k = folderOf(f);
  if (!byFolder.has(k)) byFolder.set(k, []);
  byFolder.get(k).push(f);
}

if (files.length > max) {
  L.push(`More than ${max} files, so only folders are listed.`, '', '| Folder | Files |', '| --- | --- |');
  for (const [k, v] of byFolder) L.push(`| ${cell(k)} | ${v.length} |`);
} else {
  const edges = new Set();
  for (const [k, v] of byFolder) {
    L.push(`## ${k}`, '', '| Path | Role | Uses |', '| --- | --- | --- |');
    for (const f of v) {
      let text = '';
      if (TEXT.has(ext(f))) { try { text = readFileSync(join(root, f), 'utf8'); } catch { /* unreadable */ } }
      const u = uses(f, text);
      for (const t of u) { const tf = folderOf(t); if (tf !== k) edges.add(`${k}\t${tf}`); }
      L.push(`| ${cell(f)} | ${cell(role(f, text))} | ${cell(u.join(', '))} |`);
    }
    L.push('');
  }
  const ids = new Map();
  const lines = [];
  for (const e of edges) {
    const [a, b] = e.split('\t');
    const n = new Set([...ids.keys(), a, b]);
    if (n.size > 30) continue;
    for (const x of [a, b]) if (!ids.has(x)) ids.set(x, `n${ids.size}`);
    lines.push(`  ${ids.get(a)} --> ${ids.get(b)}`);
  }
  L.push('## Folder imports', '', '```mermaid', 'graph LR');
  for (const [name, id] of ids) L.push(`  ${id}["${name.replace(/"/g, '\\"')}"]`);
  L.push(...lines, '```');
}

const result = L.join('\n') + '\n';
if (stdout) process.stdout.write(result);
else {
  const target = resolve(root, out);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, result);
  console.log(`Wrote ${target} (${files.length} files)`);
}
