#!/usr/bin/env node
/**
 * content-checks.mjs — ตัวตรวจเนื้อหาไฟล์ 3 ข้อ (ใช้จาก validate-marketplace.mjs)
 *   1. skillTestDocs   · ใต้ skills/ ห้ามมี CREATION-LOG.md · pressure-test*.md · test-*.md ที่รากโฟลเดอร์ skill (references/ และ assets/ มี test-*.md ของเนื้อหาจริงได้ เช่น test-case-template)
 *                        agent ที่โหลด skill อ่านข้อความสถานการณ์ทดสอบเป็นคำสั่งจริง · ย้ายไป plugins/<plugin>/evals/
 *   2. internalTerms   · คำภายในของ skill (Phase N · Criterion N · UAT) ห้ามโผล่ในไฟล์ที่ส่งมอบ: โค้ด เทสต์ README ราก และข้อความ commit
 *                        รายการคำอยู่ใน scripts/check/internal-terms.json (แก้ที่นั่น ไม่แก้ในสคริปต์)
 *   3. invisibleChars  · อักขระล่องหนใน markdown นอกบล็อกโค้ดและ `inline code` ที่ลินเตอร์ markdown มองไม่เห็น
 *                        error: ตัวควบคุมทิศทาง (bidi) · BOM กลางไฟล์ · ตัวคั่นบรรทัด U+2028/2029
 *                        warning: zero-width · NBSP · soft hyphen (ตั้งใจใส่ในคำไทยได้ แต่ควรรู้ว่ามี)
 * ทุกฟังก์ชันรับข้อความเข้าและคืนรายการปัญหา {at, msg} ไม่อ่านไฟล์เอง
 *
 * ตรวจข้อความ commit (ให้ hook เรียก):
 *   node scripts/check/content-checks.mjs --commit-msg .git/COMMIT_EDITMSG     พบคำภายใน → exit 1
 *   node scripts/check/content-checks.mjs --self-test
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

// 1. relPaths = path แบบ / ที่ขึ้นต้นจากราก repo
const TEST_DOC = /^plugins\/[^/]+\/skills\/(?:[^/]+\/test-[^/]*\.md|.+\/(?:CREATION-LOG|pressure-test[^/]*)\.md)$/i;
export function skillTestDocs(relPaths) {
  return relPaths.filter((p) => TEST_DOC.test(p)).map((p) =>
    `${p} · agent ที่โหลด skill นี้จะอ่านสถานการณ์ทดสอบในไฟล์เป็นคำสั่งจริง · ย้ายไป plugins/<plugin>/evals/ (นอก skills/) หรือลบ`);
}

// 2. cfg = เนื้อ internal-terms.json { terms: [{ pattern, why }], codeExts, readmes, allow: [regex ของ path] }
export function loadTerms(path = join(HERE, 'internal-terms.json')) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
export function internalTermScope(rel, cfg) {
  if (cfg.allow.some((a) => new RegExp(a).test(rel))) return false;
  if (/(^|\/)(node_modules|dist|_to_delete)\//.test(rel)) return false;
  return cfg.readmes.includes(rel) || cfg.codeExts.some((x) => rel.endsWith(x));
}
export function internalTerms(text, cfg) {
  const out = [];
  const res = cfg.terms.map((t) => [new RegExp(t.pattern), t]);
  text.split('\n').forEach((line, i) => {
    for (const [re, t] of res) {
      const m = line.match(re);
      if (m) out.push({ at: i + 1, msg: `คำภายใน "${m[0]}" โผล่ในไฟล์ที่ส่งมอบ — ${t.why}` });
    }
  });
  return out;
}

// 3. ซ่อนโค้ดทั้งบล็อกและ inline code ด้วยช่องว่าง (คงตำแหน่งบรรทัด) แล้วหาอักขระล่องหนในที่เหลือ
const INVISIBLE = [
  { re: /[\u202A-\u202E\u2066-\u2069]/, level: 'error', what: 'ตัวควบคุมทิศทางข้อความ (bidi) — ซ่อนข้อความจริงหรือสลับลำดับที่ตาเห็นได้' },
  { re: /[\u2028\u2029]/, level: 'error', what: 'ตัวคั่นบรรทัด/ย่อหน้า Unicode — editor ส่วนใหญ่ไม่เห็นว่าขึ้นบรรทัดใหม่' },
  { re: /[\u200B-\u200D\u2060]/, level: 'warn', what: 'zero-width character — มองไม่เห็นแต่ทำให้ค้นหาและเทียบชื่อไม่ตรง' },
  { re: /\u00A0/, level: 'warn', what: 'NBSP (เว้นวรรคที่ไม่ใช่ช่องว่างจริง) — แยกคำและ YAML อ่านเพี้ยน' },
  { re: /\u00AD/, level: 'warn', what: 'soft hyphen — มองไม่เห็นแต่ค้นหาไม่เจอ' },
];
const hex = (ch) => 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
export function invisibleChars(text) {
  const out = [];
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  let fence = false;
  lines.forEach((raw, i) => {
    if (/^\s*(```|~~~)/.test(raw)) { fence = !fence; return; }
    if (fence) return;
    const line = raw.replace(/`[^`\n]*`/g, (s) => ' '.repeat(s.length));
    for (const { re, level, what } of INVISIBLE) {
      const m = line.match(new RegExp(re.source, 'g'));
      if (m) out.push({ at: i + 1, level, msg: `${hex(m[0])} × ${m.length} · ${what}` });
    }
    // BOM: ต้นไฟล์ได้ (บางเครื่องมือใส่) · กลางไฟล์ไม่ได้
    if (/\uFEFF/.test(i === 0 ? line.slice(1) : line))
      out.push({ at: i + 1, level: 'error', msg: 'U+FEFF (BOM) กลางไฟล์ — ต้นไฟล์ได้ กลางไฟล์เกิดจากต่อไฟล์ผิดวิธี' });
  });
  return out;
}

// ---------------------------------------------------------------- self-test
function selfTest() {
  const cfg = { terms: [{ pattern: '\\bPhase \\d+\\b', why: 'x' }, { pattern: '\\bUAT\\b', why: 'y' }], codeExts: ['.mjs', '.py'], readmes: ['README.md'], allow: ['^plugins/p/skills/s/scripts/ok\\.py$'] };
  const checks = [
    ['ไฟล์ทดสอบใต้ skills/ โดนจับ · evals/ และ SKILL.md ไม่โดน',
      skillTestDocs(['plugins/a/skills/x/CREATION-LOG.md', 'plugins/a/skills/x/test-academic.md', 'plugins/a/skills/x/pressure-test-1.md',
        'plugins/a/evals/x/test-1.md', 'plugins/a/skills/x/SKILL.md', 'plugins/a/skills/x/references/test-data-strategies.md', 'plugins/a/skills/x/assets/test-case.md']).length === 3],
    ['คำภายในในโค้ดโดนจับ · allow list · ที่ไม่ใช่โค้ด ไม่อยู่ในขอบเขต',
      internalTerms('// Phase 2: เช็ก\nconst a = 1; // UAT', cfg).length === 2 && internalTerms('ใช้ตัวแปร phase2 และ Phases', cfg).length === 0
      && internalTermScope('scripts/a.mjs', cfg) && internalTermScope('README.md', cfg) && !internalTermScope('plugins/p/skills/s/scripts/ok.py', cfg)
      && !internalTermScope('docs/a.md', cfg) && !internalTermScope('dist/x/a.mjs', cfg)],
    ['อักขระล่องหนนอกโค้ดโดนจับ (error: bidi LS BOM กลางไฟล์ · warn: zero-width NBSP) · ในบล็อกโค้ดและ inline code ไม่โดน · BOM ต้นไฟล์ผ่าน',
      (() => {
        const r = invisibleChars('ปกติ\u202Eซ่อน\nบรรทัด\u2028สอง\nคำ\u200Bไทย a\u00A0b\n```\nz\u200Bw \u202E\n```\nมี `a\u200Bb` ในโค้ด\nก\uFEFFข');
        const lv = r.map((x) => `${x.at}${x.level[0]}`).join(',');
        return lv === '1e,2e,3w,3w,8e' && invisibleChars('\uFEFFหัวเรื่อง\nปกติ').length === 0 && invisibleChars('Phase 2 ปกติ ไทยล้วน\n').length === 0;
      })()],
  ];
  let ok = 0;
  for (const [name, pass] of checks) { console.log(`  ${pass ? 'ผ่าน' : 'ล้ม'} ${name}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${checks.length} ผ่าน`);
  process.exit(ok === checks.length ? 0 : 1);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('/content-checks.mjs')) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) selfTest();
  const i = args.indexOf('--commit-msg');
  if (i >= 0) {
    const text = readFileSync(args[i + 1], 'utf8').split('\n').filter((l) => !l.startsWith('#')).join('\n');
    const hits = internalTerms(text, loadTerms());
    for (const h of hits) console.log(`  commit บรรทัด ${h.at}: ${h.msg}`);
    process.exit(hits.length ? 1 : 0);
  }
  console.error('ใช้: --self-test หรือ --commit-msg <ไฟล์ข้อความ commit>');
  process.exit(2);
}
