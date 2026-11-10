#!/usr/bin/env node
// อัปเดตสำเนา skill ที่ผู้ใช้คัดลอกไปไว้ในโปรเจกต์ (Codex · Gemini CLI · Kimi) โดยไม่ทับของที่ผู้ใช้แก้เอง
//   node scripts/sync/update-skills.mjs --from dist/codex/superuser/.agents/skills --to <โปรเจกต์>/.agents/skills [--dry-run]
//   node scripts/sync/update-skills.mjs --self-test
//
// ทำงานด้วย manifest แฮชรายไฟล์ที่เก็บในปลายทาง (<to>/.sqt-manifest.json) ตอนคัดลอกครั้งก่อน:
//   ไฟล์ไม่มีในปลายทาง                 → คัดลอก
//   ปลายทางเท่าต้นฉบับ                  → ไม่ทำอะไร
//   ปลายทางเท่าที่เราคัดลอกไว้ครั้งก่อน   → ผู้ใช้ไม่ได้แก้ → เขียนทับเป็นรุ่นใหม่
//   ปลายทางต่างจากที่เราคัดลอกไว้        → ผู้ใช้แก้เอง → เก็บของผู้ใช้ไว้ แล้วรายงาน
//   ไม่มี manifest ครั้งก่อนและไฟล์ต่าง   → ถือเป็นของผู้ใช้ เก็บไว้
//   skill ที่เปลี่ยนชื่อ (prior-names.json: ชื่อเก่า → ชื่อใหม่) และไฟล์ที่ต้นฉบับเลิกมี
//                                       → ลบเฉพาะไฟล์ที่ผู้ใช้ไม่ได้แก้ · ที่แก้แล้วเก็บไว้และรายงาน
// เทียบแฮชหลังแปลง CRLF เป็น LF เพื่อไม่ให้เครื่อง Windows ดูเหมือนผู้ใช้แก้ทุกไฟล์
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync, rmdirSync, mkdtempSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

export const MANIFEST = '.sqt-manifest.json';
const HERE = dirname(fileURLToPath(import.meta.url));
const TEXT = /\.(md|mjs|js|json|py|toml|txt|yaml|yml|cmd|ps1|sh|svg|html|css)$/i;

const hashOf = (path) => {
  let buf = readFileSync(path);
  if (TEXT.test(path)) buf = Buffer.from(buf.toString('utf8').replace(/\r\n/g, '\n'));
  return createHash('sha256').update(buf).digest('hex');
};
function filesUnder(dir, base = dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) filesUnder(p, base, out);
    else if (e.name !== MANIFEST) out.push(relative(base, p).replace(/\\/g, '/'));
  }
  return out;
}
const pruneEmpty = (dir, stop) => {
  for (let d = dir; d !== stop && d.startsWith(stop) && existsSync(d) && !readdirSync(d).length; d = dirname(d)) rmdirSync(d);
};

// คืน { added, updated, unchanged, kept, removed, renamed } เป็นรายการ path · dryRun ไม่เขียนอะไร
export function updateSkills(from, to, { dryRun = false, priorNames = {} } = {}) {
  const src = filesUnder(from);
  if (!src.length) throw new Error(`ไม่พบไฟล์ใน ${from} — path ต้นฉบับผิด`);
  const mpath = join(to, MANIFEST);
  const prev = existsSync(mpath) ? (JSON.parse(readFileSync(mpath, 'utf8')).files ?? {}) : {};
  const next = {};
  const r = { added: [], updated: [], unchanged: [], kept: [], removed: [], renamed: [] };
  const put = (rel) => { if (dryRun) return; mkdirSync(dirname(join(to, rel)), { recursive: true }); writeFileSync(join(to, rel), readFileSync(join(from, rel))); };
  const drop = (rel) => { if (dryRun) return; rmSync(join(to, rel)); pruneEmpty(dirname(join(to, rel)), to); };

  for (const rel of src) {
    const want = hashOf(join(from, rel));
    const dest = join(to, rel);
    if (!existsSync(dest)) { put(rel); r.added.push(rel); next[rel] = want; continue; }
    const have = hashOf(dest);
    if (have === want) { r.unchanged.push(rel); next[rel] = want; }
    else if (prev[rel] && have === prev[rel]) { put(rel); r.updated.push(rel); next[rel] = want; }
    else { r.kept.push(rel); if (prev[rel]) next[rel] = prev[rel]; }
  }

  const inSource = new Set(src);
  for (const rel of Object.keys(prev)) {
    if (inSource.has(rel)) continue;
    const dest = join(to, rel);
    if (!existsSync(dest)) continue;
    const renamed = Object.keys(priorNames).some((old) => rel.startsWith(`${old}/`));
    if (hashOf(dest) === prev[rel]) { drop(rel); (renamed ? r.renamed : r.removed).push(rel); }
    else { r.kept.push(rel); next[rel] = prev[rel]; }   // ผู้ใช้แก้แล้ว: เก็บไว้ ครั้งหน้ายังถือเป็นของผู้ใช้
  }

  if (!dryRun) { mkdirSync(to, { recursive: true }); writeFileSync(mpath, JSON.stringify({ files: next }, null, 2) + '\n'); }
  return r;
}

function selfTest() {
  const t = mkdtempSync(join(tmpdir(), 'update-skills-selftest-'));
  const put = (p, s) => { mkdirSync(dirname(join(t, p)), { recursive: true }); writeFileSync(join(t, p), s); };
  const rd = (p) => readFileSync(join(t, p), 'utf8');
  const from = join(t, 'src'), to = join(t, 'dst');
  const run = (opts) => updateSkills(from, to, opts);
  // รุ่น 1
  put('src/a/SKILL.md', 'a v1\n'); put('src/b/SKILL.md', 'b v1\n'); put('src/old-name/SKILL.md', 'old v1\n'); put('src/gone/SKILL.md', 'gone v1\n'); put('src/edited/SKILL.md', 'e v1\n');
  const first = run();
  // ผู้ใช้แก้ edited · เก็บสำเนาของ old-name และ gone ไว้ไม่แก้
  put('dst/edited/SKILL.md', 'ผู้ใช้เติมกฎของตัวเอง\n');
  // รุ่น 2: a แก้ · b เหมือนเดิม · old-name เปลี่ยนเป็น new-name · gone เลิกมี · edited แก้ฝั่งเรา · มี skill ใหม่
  rmSync(from, { recursive: true });
  put('src/a/SKILL.md', 'a v2\n'); put('src/b/SKILL.md', 'b v1\n'); put('src/new-name/SKILL.md', 'old v1\n'); put('src/edited/SKILL.md', 'e v2\n'); put('src/fresh/SKILL.md', 'fresh\n');
  const dry = run({ dryRun: true, priorNames: { 'old-name': 'new-name' } });
  const dryOk = rd('dst/a/SKILL.md') === 'a v1\n' && existsSync(join(to, 'old-name'));
  const second = run({ priorNames: { 'old-name': 'new-name' } });
  const checks = [
    ['คัดลอกครั้งแรกครบ 5 ไฟล์ และเขียน manifest', first.added.length === 5 && existsSync(join(to, MANIFEST))],
    ['ไฟล์ที่ผู้ใช้ไม่ได้แก้ถูกเขียนทับเป็นรุ่นใหม่ · ที่เท่าเดิมไม่แตะ', rd('dst/a/SKILL.md') === 'a v2\n' && second.updated.join() === 'a/SKILL.md' && second.unchanged.join() === 'b/SKILL.md'],
    ['ไฟล์ที่ผู้ใช้แก้เองไม่ถูกทับ และรายงาน', rd('dst/edited/SKILL.md') === 'ผู้ใช้เติมกฎของตัวเอง\n' && second.kept.join() === 'edited/SKILL.md'],
    ['skill เปลี่ยนชื่อ: โฟลเดอร์เก่าหาย โฟลเดอร์ใหม่มา · skill ที่เลิกมีถูกลบ', !existsSync(join(to, 'old-name')) && rd('dst/new-name/SKILL.md') === 'old v1\n' && !existsSync(join(to, 'gone')) && second.renamed.join() === 'old-name/SKILL.md' && second.removed.join() === 'gone/SKILL.md'],
    ['--dry-run ไม่เขียนอะไร แต่รายงานเท่ากับของจริง', dryOk && dry.updated.join() === 'a/SKILL.md' && dry.removed.length === 1 && dry.renamed.length === 1],
  ];
  // ของที่ผู้ใช้แก้ในไฟล์ที่ต้นฉบับเลิกมี ต้องไม่ถูกลบ
  put('dst/new-name/SKILL.md', 'แก้เอง\n'); rmSync(join(from, 'new-name'), { recursive: true });
  const third = run();
  checks.push(['ไฟล์ที่ต้นฉบับเลิกมีแต่ผู้ใช้แก้แล้ว ถูกเก็บไว้', rd('dst/new-name/SKILL.md') === 'แก้เอง\n' && third.kept.includes('new-name/SKILL.md')]);
  // CRLF ฝั่งผู้ใช้ไม่นับว่าแก้
  put('dst/b/SKILL.md', 'b v1\r\n');
  checks.push(['CRLF อย่างเดียวไม่นับว่าผู้ใช้แก้', run().unchanged.includes('b/SKILL.md')]);
  let threw = false; try { updateSkills(join(t, 'ไม่มี'), to); } catch { threw = true; }
  checks.push(['ต้นฉบับว่างหรือ path ผิด = error ไม่ใช่ลบทุกอย่าง', threw && existsSync(join(to, 'a/SKILL.md'))]);
  rmSync(t, { recursive: true, force: true });
  let ok = 0;
  for (const [name, pass] of checks) { console.log(`  ${pass ? 'ผ่าน' : 'ล้ม'} ${name}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${checks.length} ผ่าน`);
  process.exit(ok === checks.length ? 0 : 1);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('/update-skills.mjs')) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) selfTest();
  const arg = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
  const from = arg('--from'), to = arg('--to');
  if (!from || !to) { console.error('ใช้: --from <โฟลเดอร์ skill ต้นฉบับ เช่น dist/codex/superuser/.agents/skills> --to <ปลายทาง> [--dry-run]'); process.exit(2); }
  const pn = join(HERE, 'prior-names.json');
  const priorNames = existsSync(pn) ? (JSON.parse(readFileSync(pn, 'utf8')).renamed ?? {}) : {};
  const dryRun = args.includes('--dry-run');
  const r = updateSkills(from, to, { dryRun, priorNames });
  const label = { added: 'เพิ่ม', updated: 'อัปเดต', unchanged: 'เท่าเดิม', renamed: 'ลบชื่อเก่า', removed: 'ลบของเลิกใช้', kept: 'เก็บของผู้ใช้ (แก้เอง ไม่ทับ)' };
  for (const [k, v] of Object.entries(r)) if (v.length && k !== 'unchanged') console.log(`${label[k]} ${v.length}\n${v.map((x) => `  ${x}`).join('\n')}`);
  console.log(`${dryRun ? '[dry-run] ' : ''}เท่าเดิม ${r.unchanged.length} ไฟล์`);
}
