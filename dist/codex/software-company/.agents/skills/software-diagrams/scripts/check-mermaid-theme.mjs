#!/usr/bin/env node
/**
 * check-mermaid-theme.mjs — ทุกบล็อก ```mermaid ต้องขึ้นต้นด้วยบรรทัดธีม %%{init
 *
 * ใช้:
 *   node check-mermaid-theme.mjs docs                 ไล่ทุกไฟล์ .md ในโฟลเดอร์ (ข้าม node_modules · .git · _to_delete)
 *   node check-mermaid-theme.mjs docs/srs.md README.md
 *   node check-mermaid-theme.mjs --self-test          พิสูจน์ว่าตัวตรวจยังจับได้
 *
 * exit 0 = ทุกบล็อกมีธีม · exit 1 = พบบล็อกที่ไม่มี (บอก ไฟล์:บรรทัด) หรือไม่พบบล็อก mermaid เลย
 * ไม่ใช้ dependency ภายนอก
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const SKIP = new Set(['node_modules', '.git', '_to_delete', 'dist']);

/** คืนรายการ { line, first } ของบล็อกที่บรรทัดแรก (ไม่นับบรรทัดว่าง) ไม่ใช่ %%{init */
export function findBadBlocks(text) {
  const lines = text.split(/\r?\n/);
  const bad = [];
  let blocks = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*(```|~~~)\s*mermaid\b/.test(lines[i])) continue;
    blocks++;
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    const first = (lines[j] ?? '').trim();
    if (!first.startsWith('%%{init')) bad.push({ line: i + 1, first: first.slice(0, 40) });
    while (j < lines.length && !/^\s*(```|~~~)\s*$/.test(lines[j])) j++;   // ข้ามไปท้ายบล็อก
    i = j;
  }
  return { blocks, bad };
}

function walk(p) {
  if (statSync(p).isFile()) return p.endsWith('.md') ? [p] : [];
  return readdirSync(p).filter((n) => !SKIP.has(n)).flatMap((n) => walk(join(p, n)));
}

function selfTest() {
  const good = '```mermaid\n%%{init: {"theme":"base"}}%%\nflowchart LR\n  A --> B\n```\n';
  const bad = 'ข้อความ\n\n```mermaid\nflowchart LR\n  A --> B\n```\n';
  const blank = '```mermaid\n\n%%{init: {}}%%\nsequenceDiagram\n```\n';
  const cases = [
    ['บล็อกมีธีมผ่าน', findBadBlocks(good).bad.length === 0],
    ['บล็อกไม่มีธีมถูกจับที่บรรทัด 3', findBadBlocks(bad).bad[0]?.line === 3],
    ['บรรทัดว่างก่อน %%{init ยังนับว่ามีธีม', findBadBlocks(blank).bad.length === 0],
    ['นับบล็อกได้ 2 จาก 2', findBadBlocks(good + bad).blocks === 2],
  ];
  for (const [name, ok] of cases) console.log(`${ok ? '✓' : '✗'} ${name}`);
  const fail = cases.filter((c) => !c[1]).length;
  console.log(fail ? `✗ self-test ไม่ผ่าน ${fail}/${cases.length}` : `✓ self-test ผ่าน ${cases.length}/${cases.length}`);
  process.exit(fail ? 1 : 0);
}

const args = process.argv.slice(2);
if (args[0] === '--self-test') selfTest();
if (!args.length || args.includes('--help')) {
  console.log(readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0].replace(/^#!.*\n\/\*\*?/, ''));
  process.exit(args.length ? 0 : 1);
}

let total = 0;
const errors = [];
for (const a of args) {
  if (!existsSync(a)) { console.error('ไม่พบ: ' + a); process.exit(1); }
  for (const file of walk(a)) {
    const { blocks, bad } = findBadBlocks(readFileSync(file, 'utf8'));
    total += blocks;
    for (const b of bad) errors.push(`${relative(process.cwd(), file)}:${b.line} ไม่มีบรรทัดธีม %%{init — บรรทัดแรกคือ "${b.first}"`);
  }
}

// ตรวจศูนย์รายการ = path ผิด ไม่ใช่ผ่าน
if (total === 0) { console.error('✗ ไม่พบบล็อก mermaid เลย — path ถูกไหม'); process.exit(1); }
if (errors.length) {
  console.error(`✗ ไม่ผ่าน — ${errors.length} จาก ${total} บล็อกไม่มีธีม (บรรทัดธีมอยู่ใน software-diagrams/assets/mermaid-theme.md)`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log(`✓ ผ่าน — ${total} บล็อก mermaid มีบรรทัดธีมครบ`);
