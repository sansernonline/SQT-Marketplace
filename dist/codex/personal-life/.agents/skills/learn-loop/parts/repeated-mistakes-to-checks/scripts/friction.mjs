#!/usr/bin/env node
// friction: turn rows of the improvements queue into card drafts.
// Usage: friction list [--file <path>] [--root <dir>]
//        friction draft [--min <n>] [--out <dir>] [--file <path>] [--root <dir>]
//        friction close <n> carded <card-id> | dropped <reason> [--file <path>] [--root <dir>]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const splitLine = (line) => line.replace(/\r$/, '').split('|');
const cellsOf = (line) => splitLine(line).slice(1, -1).map((c) => c.trim());

// Rows of the first Markdown table that has a header cell named "รวมแล้ว".
// Each row: header name -> cell text, plus `_line` (0-based line index in the file).
export function parseTable(text) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    if (!/^\s*\|/.test(lines[i])) continue;
    const header = cellsOf(lines[i]);
    if (!header.includes('รวมแล้ว')) continue;
    if (!/^\s*\|[\s:|-]+\|?\s*$/.test(lines[i + 1].replace(/\r$/, ''))) continue;
    const rows = [];
    for (let j = i + 2; j < lines.length && /^\s*\|/.test(lines[j]); j++) {
      const cells = cellsOf(lines[j]);
      const row = { _line: j };
      header.forEach((h, k) => { row[h] = cells[k] ?? ''; });
      rows.push(row);
    }
    return rows;
  }
  return [];
}

export function openRows(rows) {
  return rows.filter((r) => r['รวมแล้ว'] === 'ยัง' && !(r['ควรรวมไหม'] ?? '').startsWith('ไม่รวม'));
}

const countOf = (row) => parseInt(row['ครั้ง'], 10) || 0;

export function draftCard(row, n) {
  const quote = Object.keys(row)
    .filter((k) => k !== '_line')
    .map((k) => `> ${k}: ${row[k]}`)
    .join('\n');
  return [
    '---',
    `id: F-${n}`,
    `title: ${row['เรื่อง']}`,
    'size: S',
    'touch: []',
    'done_when:',
    '  - echo "TODO: write the check that proves this is fixed" && exit 1',
    '---',
    '',
    'Draft from the improvements queue. Row:',
    '',
    quote,
    '',
  ].join('\n');
}

// n is 1-based among ALL data rows (open or closed), so it never shifts when a row is closed.
// action: "carded" (value = card id) or "dropped" (value = reason).
export function closeRow(text, n, action, value, date) {
  const lines = text.split('\n');
  const headerIdx = lines.findIndex((l, i) => i < lines.length - 1 && /^\s*\|/.test(l) && cellsOf(l).includes('รวมแล้ว'));
  if (headerIdx < 0) throw new Error('no queue table found');
  const header = cellsOf(lines[headerIdx]);
  const all = parseTable(text);
  const target = all[n - 1];
  if (!target) throw new Error(`no row ${n}`);
  if (!openRows([target]).length) throw new Error(`row ${n} is already closed`);
  let col;
  let newCell;
  if (action === 'carded') {
    col = header.indexOf('รวมแล้ว');
    newCell = `แล้ว ${date} (${value})`;
  } else if (action === 'dropped') {
    col = header.indexOf('ควรรวมไหม');
    newCell = `ไม่รวม (${value})`;
  } else {
    throw new Error(`unknown action ${action}`);
  }
  const line = lines[target._line];
  const cr = line.endsWith('\r') ? '\r' : '';
  const parts = line.replace(/\r$/, '').split('|');
  parts[col + 1] = ` ${newCell} `;
  lines[target._line] = parts.join('|') + cr;
  return lines.join('\n');
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
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return process.cwd();
  }
}

function fail(msg) {
  console.error(msg);
  process.exit(2);
}

function main(argv) {
  const { pos, opt } = parseArgs(argv);
  const cmd = pos[0];
  if (!['list', 'draft', 'close'].includes(cmd)) fail('Usage: friction list | draft | close <n> carded <card-id>|dropped <reason>');
  const root = findRoot(opt);
  let file = opt.file;
  if (!file) {
    const local = path.join(root, '.claude', 'superuser', 'IMPROVEMENTS.md');
    file = fs.existsSync(local) ? local : path.join(os.homedir(), '.claude', 'superuser', 'IMPROVEMENTS.md');
  }
  if (!fs.existsSync(file)) fail(`Queue file not found: ${file}`);
  const text = fs.readFileSync(file, 'utf8');
  const all = parseTable(text);
  const open = openRows(all);

  if (cmd === 'list') {
    open.forEach((r) => console.log(`${all.indexOf(r) + 1}. [ครั้ง ${countOf(r)}] ${r['เรื่อง']}`));
    console.log(`open: ${open.length}`);
    return;
  }

  if (cmd === 'draft') {
    const min = opt.min === undefined ? 2 : Number(opt.min);
    if (Number.isNaN(min)) fail('--min must be a number');
    const out = path.resolve(opt.out || path.join(root, '.claude', 'superuser', 'cards'));
    fs.mkdirSync(out, { recursive: true });
    open.forEach((r) => {
      if (countOf(r) < min) return;
      const k = all.indexOf(r) + 1;
      const target = path.join(out, `F-${k}.md`);
      if (fs.existsSync(target)) {
        console.log(`skip F-${k}.md (already exists)`);
        return;
      }
      fs.writeFileSync(target, draftCard(r, k));
      console.log(`wrote ${target}`);
    });
    return;
  }

  const n = Number(pos[1]);
  const action = pos[2];
  const value = pos.slice(3).join(' ');
  if (!Number.isInteger(n) || n < 1 || !['carded', 'dropped'].includes(action) || !value) {
    fail('Usage: friction close <n> carded <card-id>|dropped <reason>');
  }
  if (all[n - 1] && !open.includes(all[n - 1])) {
    console.error(`row ${n} is already closed`);
    process.exit(1);
  }
  const date = new Date().toLocaleDateString('sv-SE');
  let next;
  try {
    next = closeRow(text, n, action, value, date);
  } catch (e) {
    fail(e.message);
  }
  fs.writeFileSync(file, next);
  console.log(`closed row ${n} (${action})`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
