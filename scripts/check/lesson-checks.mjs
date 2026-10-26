/**
 * lesson-checks.mjs — ตัวตรวจจากบทเรียนของทีม 8 ข้อ (ใช้จาก validate-marketplace.mjs)
 *   1. plugin ที่ติดตั้งในเครื่องเก่ากว่า repo        → warning
 *   2. eval -regression ที่ยังไม่เคยเห็น agent พลาดจริง → error (ต้องชื่อ -guard)
 *   3. ข้อความอ้างว่าทดสอบ/วัดจริง ต้องมีวันที่ในบรรทัดเดียวกัน → warning (จับจากคำ จึงมีบรรทัดตัวอย่างหลุดมาได้)
 *   4. prompt-*.md ต้องมีบรรทัด "ทดสอบจริง: <วันที่ · ฉบับ>" หรือ "ยังไม่ได้ทดสอบจริง" → error
 *   5. SKILL.md ใหญ่เกิน 20,000 ไบต์ → warning บรรทัดเดียว
 *   6. ตาราง "การตัดสินใจ" ใน .claude/superuser/CONTEXT.md เกิน 20 แถว → warning
 *   7. ไฟล์ .md มีตัว CR ดิบที่ไม่ตามด้วย LF → error
 *   8. ข้อเท็จจริงที่หมดอายุตามปฏิทิน (scripts/check/expiry.json) เลยวันแล้วหรือเหลือไม่ถึง 30 วัน → warning · ไฟล์ที่อ้างไม่มี หรือไม่มีข้อความที่แถวอ้าง → error
 *   9. ตัวชี้ `<plugin>:<ชื่อ>` ต้องมี skill หรือ agent ชื่อนั้นใน plugin นั้นจริง → error
 *  10. CHANGELOG: หัวรุ่นเรียงจากใหม่ไปเก่า · Unreleased อยู่บนสุดเท่านั้น · รุ่นบนสุดตรงกับ plugin.json → error
 *  11. ไอคอน ✅ ❌ ⚠ ในเนื้อหา (human-writing ห้าม) · ในโค้ดและ backtick ได้ เพราะอ้างผลที่สคริปต์พิมพ์ → error
 * ทุกฟังก์ชันรับข้อความเข้าและคืนรายการปัญหา (ข้อความ หรือ {at, msg} ของข้อ 3) ไม่อ่านไฟล์เอง (ยกเว้น installedOlder ที่รับ path)
 */
import { readFileSync, existsSync } from 'node:fs';

const ver = (v) => String(v).split(/[.-]/).map((x) => parseInt(x, 10) || 0);
export const isOlder = (a, b) => {
  const [x, y] = [ver(a), ver(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) < (y[i] ?? 0);
  return false;
};

// 1. installedFile = installed_plugins.json · repoVersions = { ชื่อ plugin: รุ่นใน repo } · ไม่มีไฟล์ → เงียบ
export function installedOlder(installedFile, repoVersions, marketplace = 'sqt-marketplace') {
  if (!existsSync(installedFile)) return [];
  let plugins;
  try { plugins = JSON.parse(readFileSync(installedFile, 'utf8')).plugins ?? {}; } catch { return []; }
  const out = [];
  for (const [key, entries] of Object.entries(plugins)) {
    const [name, mp] = key.split('@');
    if (mp !== marketplace || !repoVersions[name]) continue;
    for (const e of [].concat(entries)) {
      if (e?.version && isOlder(e.version, repoVersions[name]))
        out.push(`plugin "${name}" ในเครื่องนี้เป็นรุ่น ${e.version} แต่ repo เป็น ${repoVersions[name]} — เครื่องยังใช้ของเก่า รัน claude plugin update ${name}@${marketplace} ก่อนทดสอบอะไรกับเครื่องนี้`);
    }
  }
  return out;
}

// 2. case.yaml ของ eval ชื่อ *-regression ที่เขียนว่ายังไม่เคยเห็นจริง (และไม่มีบรรทัดที่บอกว่าเห็นจริง)
const NEVER_SEEN = /ยังไม่เคย(?:เห็น|พลาด)|ยังไม่ได้เห็น|not observed|never (?:seen|observed)/i;
const SEEN = /(?<!ยังไม่เคย)(?<!ยังไม่ได้)(?:เห็นจริง|พลาดจริง|observed failure)/;
export function regressionNeverSeen(caseName, text) {
  if (!/-regression$/.test(caseName)) return [];
  const header = text.split('\n').filter((l) => /^\s*(?:#|description:)/.test(l)).join('\n');
  if (NEVER_SEEN.test(header) && !SEEN.test(header))
    return [`เคส "${caseName}" เขียนว่ายังไม่เคยเห็น agent พลาดจริง — -regression ใช้กับอาการที่ agent พลาดจริงในรอบแดง (ลงวันที่) เท่านั้น · รอบแดงที่ผ่านแล้วต้องชื่อ -guard (เปลี่ยนชื่อโฟลเดอร์และทุกที่ที่อ้าง)`];
  return [];
};

// 3. บรรทัดที่อ้างว่าทดสอบ/วัด/ตรวจจริง ต้องมีวันที่ · ข้ามบรรทัดที่เป็นกฎ ป้าย ช่องติ๊ก หรือแถวตัวอย่าง (ไม่ใช่การอ้างผลของ repo นี้)
const CLAIM = /ทดสอบจริง|วัดจริง|ตรวจจริง|รันจริง|รันทดสอบแล้ว|ทดสอบแล้ว|\b(?:tested|verified) (?:on|with|locally|against)\b|\bmeasured (?:on|at|in) /i;
const DATE = /\d{4}-\d{2}-\d{2}/;
const NOT_A_CLAIM = /^\s*- \[[ x]\]|^\s*\|[^|]*\|\s*(?:เสร็จ|ผ่าน)\s*\||`(?:ตรวจจริง|ทดสอบจริง)`|ต้อง|ห้าม|อย่า|ก่อน|เมื่อ|ถ้า|ทุก(?:คำสั่ง|ตัวอย่าง|ข้อ)|ไม่|เว้นแต่|^\*\*ทดสอบจริง\*\*|\bmust\b|\bnever\b|\bshould\b|\bbefore\b|\bunless\b|\bnot\b|\bwithout\b|\bif\b|\bwhen\b|^\s*(?:>|❌)|"Testing/i;
export function undatedClaims(text) {
  const out = [];
  text.split('\n').forEach((line, i) => {
    if (CLAIM.test(line) && !DATE.test(line) && !NOT_A_CLAIM.test(line))
      out.push({ at: i + 1, msg: `อ้างว่าทดสอบ/วัด/ตรวจจริงแต่ไม่มีวันที่ (YYYY-MM-DD) ในบรรทัดเดียวกัน: ${line.trim().slice(0, 90)}` });
  });
  return out;
}

// 4. prompt-*.md ต้องบอกสถานะการทดสอบจริง
export function promptTestLine(text) {
  return /^(?:ทดสอบจริง: \S.*|ยังไม่ได้ทดสอบจริง.*)$/m.test(text) ? []
    : [`ไม่มีบรรทัด "ทดสอบจริง: <วันที่ · ฉบับ>" หรือ "ยังไม่ได้ทดสอบจริง" ใต้หัวข้อ`];
}

// 5. SKILL.md ใหญ่ · หลังบีบ context Claude Code แนบ skill กลับแค่ราว 5,000 token แรก (code.claude.com/docs/en/skills ตรวจ 2026-10-25) · sizes = [{ rel, bytes }] · เตือนบรรทัดเดียว
export function bigSkills(sizes, limit = 20000) {
  const big = sizes.filter((s) => s.bytes > limit).sort((a, b) => b.bytes - a.bytes);
  return big.length ? [`SKILL.md เกิน ${limit} ไบต์ ${big.length} ไฟล์ (ใหญ่สุด: ${big.slice(0, 3).map((s) => `${s.rel} ${s.bytes}`).join(' · ')}) · หลังบีบ context กฎท้ายไฟล์อาจหาย ให้กฎที่ห้ามข้ามอยู่ต้นไฟล์`] : [];
}

// 6. ตาราง "การตัดสินใจ" ใน CONTEXT.md เก็บ 20 แถวล่าสุด (decision-log บรรทัด 14) · เกิน → ย้ายแถวเก่าไป HISTORY.md
export function decisionRows(text, cap = 20) {
  const sec = text.split(/\r?\n## /).find((s) => s.startsWith('การตัดสินใจ'));
  if (!sec) return [];
  const rows = sec.split(/\r?\n/).filter((l) => l.startsWith('|') && !/^\|[\s:|-]+\|\s*$/.test(l)).length - 1;
  return rows > cap ? [`ตาราง "การตัดสินใจ" มี ${rows} แถว เกิน ${cap} · ย้ายแถวเก่าไป HISTORY.md`] : [];
}

// 7. CR ดิบกลางบรรทัด · บทเรียน 2026-10-25: ส่งข้อความผ่าน heredoc แล้ว `\r` ในข้อความกลายเป็นตัว CR จริง ข้อความหายไปเงียบ ๆ
export function loneCR(text) {
  const out = [];
  text.split('\n').forEach((line, i) => {
    if (line.replace(/\r$/, '').includes('\r')) out.push({ at: i + 1, msg: 'มีตัว CR ดิบกลางบรรทัด (มักมาจาก heredoc ที่ตีความ \\r) — แก้ด้วยเครื่องมือแก้ไฟล์ ไม่ส่งผ่าน heredoc' });
  });
  return out;
}

// 8. ข้อเท็จจริงที่หมดอายุตามปฏิทิน · entries = [{ date: 'YYYY-MM-DD', file, what, quote }] · today = 'YYYY-MM-DD'
//    read(file) คืนข้อความของไฟล์ หรือ null ถ้าไม่มี · quote ต้องพบในไฟล์ (บทเรียน 2026-10-26: 4 แถวอ้างรอบตรวจที่ไฟล์ไม่ได้เขียน)
//    คืน { warns, errors } · เลยวัน = ต้องตรวจแหล่งใหม่แล้วแก้ไฟล์ แล้วลบหรือเลื่อนแถว
// วันที่ตามเวลาเครื่อง แบบ YYYY-MM-DD · ไม่ใช้ toISOString() เพราะเป็น UTC (ไทยหลังเที่ยงคืนจะได้วันก่อนหน้า)
export const localToday = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function expiredFacts(entries, today, read, soonDays = 30) {
  const day = (s) => Date.parse(`${s}T00:00:00Z`) / 86400000;
  const warns = [], errors = [];
  for (const e of entries) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date ?? '') || !e.file || !e.what || !e.quote) { errors.push(`แถวไม่ครบ (ต้องมี date แบบ YYYY-MM-DD · file · what · quote): ${JSON.stringify(e)}`); continue; }
    const text = read(e.file);
    if (text === null) { errors.push(`${e.file} ไม่มีแล้ว — แก้ path หรือลบแถว "${e.what}"`); continue; }
    if (!text.includes(e.quote)) { errors.push(`${e.file} ไม่มีข้อความ "${e.quote}" ที่แถว "${e.what}" อ้าง — แถวต้องพูดเท่าที่ไฟล์เขียน แก้แถวหรือแก้ไฟล์`); continue; }
    const left = day(e.date) - day(today);
    if (left < 0) warns.push(`${e.file}: ${e.what} หมดแล้วเมื่อ ${e.date} — ตรวจแหล่งทางการใหม่ แก้ไฟล์ แล้วลบหรือเลื่อนแถวใน expiry.json`);
    else if (left <= soonDays) warns.push(`${e.file}: ${e.what} หมด ${e.date} (อีก ${left} วัน) — เตรียมตรวจแหล่งใหม่`);
  }
  return { warns, errors };
}

// 9. ตัวชี้ข้าม plugin · บทเรียน 2026-10-23: ย้าย skill ข้าม plugin แล้วแทนชื่อทั้ง repo ทำให้ตัวชี้ชี้ plugin ผิด
//    plugins = ชื่อ plugin ของเรา · has(plugin, name) บอกว่ามี skill หรือ agent ชื่อนั้นไหม · ข้ามเครื่องหมายบล็อกใน HTML comment
export function badPluginRefs(text, plugins, has) {
  const plain = text.replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ' '));
  const re = new RegExp(`(^|[^A-Za-z0-9/_.-])(${plugins.map((p) => p.replace(/-/g, '\\-')).join('|')}):([a-z0-9][a-z0-9-]*)`, 'g');
  const out = [];
  plain.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(re)) if (!has(m[2], m[3])) out.push({ at: i + 1, msg: `\`${m[2]}:${m[3]}\` ไม่มี skill หรือ agent ชื่อนี้ใน plugin ${m[2]} — ย้ายไป plugin อื่นแล้วหรือพิมพ์ผิด` });
  });
  return out;
}

// 11. ไอคอนในเนื้อหา · เก็บกวาดแล้ว 2026-10-26 (superuser 72 จุด · plugin อื่นราว 1,900 บรรทัด) ตัวนี้กันไม่ให้กลับมา
export function iconLines(text) {
  const out = [];
  let fence = false;
  text.split('\n').forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return; }
    if (!fence && /[✅❌⚠]/.test(line.replace(/`[^`]*`/g, ''))) out.push({ at: i + 1, msg: 'มีไอคอน ✅ ❌ ⚠ ในเนื้อหา — human-writing ห้าม ใช้คำแทน (ผิด: / ถูก: · ตารางใช่/ไม่ใช้ ✓ ✗)' });
  });
  return out;
}

// 10. ลำดับหัวรุ่นใน CHANGELOG · หัวที่ไม่ใช่รุ่น (เช่น "ประวัติจาก …") ข้าม
export function changelogOrder(text, version) {
  const heads = [...text.matchAll(/^## (Unreleased|\d+\.\d+\.\d+)\b/gm)].map((m) => m[1]);
  const out = [];
  const u = heads.indexOf('Unreleased');
  if (u > 0 || heads.lastIndexOf('Unreleased') !== u) out.push('หัว "Unreleased" ต้องอยู่บนสุดและมีที่เดียว');
  const vers = heads.filter((h) => h !== 'Unreleased');
  for (let i = 1; i < vers.length; i++) if (!isOlder(vers[i], vers[i - 1])) out.push(`หัวรุ่น ${vers[i]} อยู่ใต้ ${vers[i - 1]} แต่ไม่ได้เก่ากว่า — เรียงใหม่จากใหม่ไปเก่า`);
  if (version && vers[0] && vers[0] !== version) out.push(`หัวรุ่นบนสุด ${vers[0]} ไม่ตรงกับ plugin.json ${version}`);
  return out;
}
