#!/usr/bin/env node
// ให้ skill เป็นต้นฉบับเดียว: ไฟล์แม่แบบ (README · prompt · เอกสาร) ดึงหัวข้อจาก skill มาวางตาม marker
//   node scripts/sync/sync-includes.mjs          → เขียนเนื้อหัวข้อทับระหว่าง marker ทุกไฟล์
//   node scripts/sync/sync-includes.mjs --check  → ตรวจอย่างเดียว · ไม่ตรงหรือหาหัวข้อไม่เจอ → exit 1
//   node scripts/sync/sync-includes.mjs --self-test
//
// marker (ต้องอยู่ต้นบรรทัด นอกบล็อกโค้ด):
//   <!-- include: plugins/superuser/skills/commit-log/SKILL.md#หัวข้อที่ต้องการ -->
//   ...เนื้อที่สคริปต์เขียนให้ · อย่าแก้ตรงนี้ แก้ที่ skill...
//   <!-- /include -->
// หัวข้อ = ข้อความของบรรทัด # ... ตรงตัว (ไม่นับ # และช่องว่างหน้าหลัง) · เนื้อ = ใต้หัวข้อนั้นจนถึงหัวข้อระดับเท่ากันหรือสูงกว่าถัดไป ไม่รวมบรรทัดหัวข้อ
// ตัวอย่างวิธีเขียนด้านบนอยู่ในบล็อกโค้ดหรือ `backtick` ใน README จึงไม่ถูกนับเป็น marker
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const SKIP_DIRS = new Set(['dist', '_to_delete', 'node_modules', '.git', '.claude']);
const OPEN = /^<!-- include: (\S+?)#(.+?) -->$/;
const CLOSE = /^<!-- \/include -->$/;

function mdFiles(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) mdFiles(p, out);
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

// เนื้อใต้หัวข้อ · คืน null ถ้าไม่เจอ
export function section(text, heading) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  let fence = false, level = 0, from = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) { fence = !fence; continue; }
    if (fence) continue;
    const m = lines[i].match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    if (from < 0) { if (m[2] === heading) { from = i + 1; level = m[1].length; } }
    else if (m[1].length <= level) return lines.slice(from, i).join('\n').trim();
  }
  return from < 0 ? null : lines.slice(from).join('\n').trim();
}

// แทนที่ทุก marker ในข้อความ · คืน { text, problems, count }
export function expand(text, readSource) {
  const nl = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const out = [], problems = [];
  let fence = false, count = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) fence = !fence;
    const m = !fence && lines[i].match(OPEN);
    if (!m) { out.push(lines[i]); continue; }
    let j = i + 1;
    while (j < lines.length && !CLOSE.test(lines[j])) j++;
    if (j >= lines.length) { problems.push(`บรรทัด ${i + 1} · marker include ไม่มี <!-- /include --> ปิด`); out.push(lines[i]); continue; }
    count++;
    const src = readSource(m[1]);
    const body = src === null ? null : section(src, m[2]);
    out.push(lines[i]);
    if (body === null) {
      problems.push(`บรรทัด ${i + 1} · ${src === null ? `ไม่มีไฟล์ ${m[1]}` : `ไม่พบหัวข้อ "${m[2]}" ใน ${m[1]}`}`);
      out.push(...lines.slice(i + 1, j));
    } else out.push(...(body ? body.split('\n') : []));
    out.push(lines[j]);
    i = j;
  }
  return { text: out.join(nl), problems, count };
}

// คืน { problems, writes, count } · writes = [[path, ข้อความใหม่]] เฉพาะไฟล์ที่เนื้อเปลี่ยน
export function plan(root) {
  const problems = [], writes = [];
  let count = 0;
  const readSource = (rel) => { const p = join(root, rel); return existsSync(p) ? readFileSync(p, 'utf8') : null; };
  for (const f of mdFiles(root)) {
    const original = readFileSync(f, 'utf8');
    if (!original.includes('<!-- include:')) continue;
    const rel = relative(root, f).replace(/\\/g, '/');
    const r = expand(original, readSource);
    count += r.count;
    for (const p of r.problems) problems.push(`${rel}:${p.replace(/^บรรทัด /, '')}`);
    if (r.text !== original && !r.problems.length) { problems.push(`${rel} · เนื้อที่ดึงมาไม่ตรงกับต้นฉบับ`); writes.push([f, r.text]); }
  }
  return { problems, writes, count };
}

function selfTest() {
  const src = '# ชื่อ\nintro\n## ข้อ A\nแถว 1\n\n### ย่อย\nย่อยในข้อ A\n## ข้อ B\n```\n## ไม่ใช่หัวข้อ\n```\nแถว B\n';
  const read = (p) => (p === 's.md' ? src : null);
  const marker = (h, mid = 'เก่า') => `ก่อน\n<!-- include: s.md#${h} -->\n${mid}\n<!-- /include -->\nหลัง\n`;
  const a = expand(marker('ข้อ A'), read);
  const b = expand(marker('ข้อ B').replace(/\n/g, '\r\n'), read);
  const checks = [
    ['ดึงหัวข้อมาแทนที่ รวมหัวข้อย่อย หยุดที่หัวข้อระดับเท่ากัน', a.text === 'ก่อน\n<!-- include: s.md#ข้อ A -->\nแถว 1\n\n### ย่อย\nย่อยในข้อ A\n<!-- /include -->\nหลัง\n' && a.count === 1 && !a.problems.length],
    ['หัวข้อสุดท้ายรวมบล็อกโค้ดที่มี ## · คง CRLF', b.text.includes('```\r\n## ไม่ใช่หัวข้อ\r\n```\r\nแถว B') && !b.text.replace(/\r\n/g, '').includes('\n')],
    ['รันซ้ำแล้วเนื้อไม่เปลี่ยน (ไม่ต่างจากครั้งแรก)', expand(a.text, read).text === a.text],
    ['หัวข้อหาย · ไฟล์หาย · marker ไม่ปิด โดนจับ', expand(marker('ไม่มี'), read).problems.length === 1 && expand(marker('x').replace('s.md', 'z.md'), read).problems.length === 1 && expand('<!-- include: s.md#ข้อ A -->\nx\n', read).problems.length === 1],
    ['ตัวอย่าง marker ในบล็อกโค้ดไม่ถูกนับ', expand('```\n<!-- include: s.md#ข้อ A -->\nx\n<!-- /include -->\n```\n', read).count === 0],
  ];
  // ทั้งโฟลเดอร์: --check ล้มเมื่อเนื้อไม่ตรง และผ่านหลังเขียน
  const t = mkdtempSync(join(tmpdir(), 'includes-selftest-'));
  mkdirSync(join(t, 'docs'), { recursive: true });
  writeFileSync(join(t, 's.md'), src); writeFileSync(join(t, 'docs', 'a.md'), marker('ข้อ A'));
  const before = plan(t);
  for (const [f, text] of before.writes) writeFileSync(f, text);
  const after = plan(t);
  rmSync(t, { recursive: true, force: true });
  checks.push(['plan() จับไฟล์ที่เนื้อเก่า แล้วผ่านหลังเขียนทับ', before.problems.length === 1 && before.count === 1 && after.problems.length === 0 && after.count === 1]);
  let ok = 0;
  for (const [name, pass] of checks) { console.log(`  ${pass ? 'ผ่าน' : 'ล้ม'} ${name}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${checks.length} ผ่าน`);
  process.exit(ok === checks.length ? 0 : 1);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('/sync-includes.mjs')) {
  if (process.argv.includes('--self-test')) selfTest();
  const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
  const check = process.argv.includes('--check');
  const { problems, writes, count } = plan(root);
  for (const p of problems) console.log(`  ${check ? '✗' : '→'} ${p}`);
  const broken = problems.length - writes.length;   // ปัญหาที่เขียนทับแก้ไม่ได้ (หัวข้อหาย ไฟล์หาย marker ไม่ปิด)
  if (check) {
    console.log(problems.length ? `\n${problems.length} จุดไม่ตรง · รัน node scripts/sync/sync-includes.mjs` : `marker include ตรงต้นฉบับทั้ง ${count} จุด`);
    process.exit(problems.length ? 1 : 0);
  }
  for (const [f, text] of writes) writeFileSync(f, text);
  console.log(`เขียน ${writes.length} ไฟล์ · marker ทั้งหมด ${count} จุด${broken ? ` · ติด ${broken} จุด (ดูข้างบน)` : ''}`);
  process.exit(broken ? 1 : 0);
}
