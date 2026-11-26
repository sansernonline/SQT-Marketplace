#!/usr/bin/env node
// ตรวจชื่อไฟล์เอกสารตาม ../SKILL.md หัวข้อ 2–4 แล้วเสนอชื่อที่ถูก · ผิดแล้ว exit 1
//   node doc-name-check.mjs <ไฟล์...>                          ตรวจ
//   node doc-name-check.mjs <ไฟล์...> --plan renames.json      เขียนแผนเปลี่ยนชื่อ [{from,to}] (to = ชื่อใหม่ โฟลเดอร์เดิม) ไม่แตะไฟล์ (แก้แผนได้ก่อนลงมือ)
//   node doc-name-check.mjs --plan renames.json --apply        เปลี่ยนชื่อตามแผน · ไม่แตะไฟล์ APPROVED · ไม่ทับไฟล์ที่มีอยู่
//   node doc-name-check.mjs --self-test
// ตรวจไม่ได้: ชื่อคนในชื่อไฟล์ · ภาษาของเนื้อหา · ไฟล์ที่ได้รับมาต้องคงชื่อเดิม (อย่าใส่ไฟล์ใน ref/ เข้าแผน)
import { existsSync, readFileSync, writeFileSync, renameSync, statSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

const EXPORT = /^([A-Z0-9]+)-([A-Z0-9]+)((?:-[a-z0-9]+)*)-v(\d+)\.(\d+)-(DRAFT|REVIEW|APPROVED)(-\d{4}-\d{2}-\d{2})?$/;
const EXPORT_EXT = [".docx", ".pdf", ".pptx", ".xlsx"]; // ไฟล์ส่งออกตามหัวข้อ 1 · md ตรวจอีกแบบ
// ชื่อที่เครื่องมือหรือ repo คาดหวัง (SKILL.md ของ skill · ไฟล์ทีมของ superuser · BUILD-PLAN.md · index.md ของเว็บเอกสาร)
const MD_KNOWN = ["README", "CHANGELOG", "LICENSE", "CONTRIBUTING", "SECURITY", "CODE_OF_CONDUCT", "THIRD-PARTY-NOTICES", "AGENTS", "CLAUDE", "GEMINI", "KIMI",
  "SKILL", "BUILD-PLAN", "CONTEXT", "TEAM", "TASK", "HISTORY", "IMPROVEMENTS", "index"];
const STATUSES = ["DRAFT", "REVIEW", "APPROVED"];
const DROP = /^(final\d*|new|copy|latest|edit(ed)?)$/i; // คำที่ SKILL.md หัวข้อ 7 บอกว่าไม่ช่วยบอกฉบับ

const validDate = (s) => { const d = new Date(`${s}T00:00:00Z`); return !isNaN(d) && d.toISOString().startsWith(s); };

export function checkName(file) {
  const ext = extname(file).toLowerCase(), stem = basename(file, extname(file));
  if (ext === ".md") {
    if (MD_KNOWN.includes(stem)) return { ok: true };
    const problems = [];
    if (!/^[a-z0-9]+(-[a-z0-9]+)+$/.test(stem)) problems.push("markdown ใช้ <ประเภท>-<เรื่อง>.md ตัวเล็ก ขีดกลาง หรือ YYYY-MM-DD-<เรื่อง>.md สำหรับบันทึกประชุม");
    if (/-v\d/.test(stem)) problems.push("ไฟล์ที่ git เก็บประวัติให้ไม่ใส่เวอร์ชันในชื่อ");
    const date = stem.match(/^(\d{4}-\d{2}-\d{2})-/)?.[1];
    if (date && !validDate(date)) problems.push(`วันที่ ${date} ไม่มีจริง`);
    const fixed = stem.toLowerCase().replace(/-v\d+(\.\d+)?/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return { ok: !problems.length, problems, suggest: problems.length && fixed.includes("-") ? `${fixed}.md` : null };
  }
  if (!EXPORT_EXT.includes(ext)) return { ok: true, skipped: true };
  const m = stem.match(EXPORT);
  const date = m?.[7]?.slice(1);
  if (m && (!date || validDate(date))) return { ok: true, status: m[6] };
  const problems = [m ? `วันที่ ${date} ไม่มีจริง` : "ต้องเป็น <โปรเจกต์>-<ประเภท>[-<เรื่อง>]-v<M.m>-<DRAFT|REVIEW|APPROVED>[-YYYY-MM-DD] เช่น ACME-QUOTE-v1.2-APPROVED.docx"];
  return { ok: false, problems, suggest: suggest(stem, ext) };
}

// เดาชื่อที่ถูกจากชิ้นส่วนเดิม · ไม่มีเวอร์ชัน → v0.1 · ไม่มีสถานะ → DRAFT (ไม่เดาว่า APPROVED) · มีภาษาไทยหรือชิ้นไม่พอ → null ให้คนตั้งเอง
export function suggest(stem, ext) {
  let date = "", version = "", status = "";
  let rest = stem
    .replace(/(\d{4})-(\d{2})-(\d{2})/, (_, y, mo, d) => { date = `${y}-${mo}-${d}`; return " "; })
    .replace(/(\d{2})[-.](\d{2})[-.](\d{4})/, (_, d, mo, y) => { date = `${y}-${mo}-${d}`; return " "; });
  const parts = [];
  for (const t of rest.split(/[\s_-]+/).filter(Boolean)) {
    const v = t.match(/^v(\d+)(?:\.(\d+))?$/i) || t.match(/^(\d+)\.(\d+)$/);
    if (v) version = `v${v[1]}.${v[2] ?? 0}`;
    else if (STATUSES.includes(t.toUpperCase())) status = t.toUpperCase();
    else if (!DROP.test(t)) parts.push(t);
  }
  if (parts.length < 2 || parts.some((p) => /[^\x00-\x7F]/.test(p))) return null;
  const [proj, type, ...topic] = parts;
  return [proj.toUpperCase(), type.toUpperCase(), ...topic.map((t) => t.toLowerCase()), version || "v0.1", status || "DRAFT", ...(date ? [date] : [])].join("-") + ext;
}

const sameFile = (a, b) => { const x = statSync(a, { bigint: true }), y = statSync(b, { bigint: true }); return x.ino === y.ino && x.dev === y.dev; };

export function applyPlan(plan) {
  return plan.map(({ from, to }) => {
    if (/(^|[-_ ])APPROVED([-_ .]|$)/i.test(basename(from))) return `ข้าม ${from}: APPROVED ห้ามแก้ไฟล์เดิม · ขึ้นเวอร์ชันใหม่เป็น DRAFT แทน`;
    if (!existsSync(from)) return `ข้าม ${from}: ไม่พบไฟล์`;
    const target = join(dirname(from), basename(to));
    if (from === target) return null;
    if (existsSync(target) && !sameFile(from, target)) return `ข้าม ${from}: ${target} มีอยู่แล้ว · เลือกชื่ออื่นในแผน`;
    if (existsSync(target)) { // ต่างแค่ตัวพิมพ์บนระบบไฟล์ที่ไม่แยกตัวพิมพ์ (Windows · macOS) → ผ่านชื่อชั่วคราว
      const tmp = `${from}.rename-${process.pid}`;
      renameSync(from, tmp); renameSync(tmp, target);
    } else renameSync(from, target);
    return null;
  }).filter(Boolean);
}

function main(argv) {
  if (argv.includes("--self-test")) return import("./doc-name-check.test.mjs").then((t) => t.selfTest());
  const p = argv.indexOf("--plan");
  const planFile = p >= 0 ? argv[p + 1] : null;
  const files = argv.filter((a, i) => !a.startsWith("--") && (p < 0 || i !== p + 1));
  if (argv.includes("--apply")) {
    if (!planFile || !existsSync(planFile)) return fail("ใช้: node doc-name-check.mjs --plan renames.json --apply · สร้างแผนก่อนด้วย <ไฟล์...> --plan renames.json");
    const plan = JSON.parse(readFileSync(planFile, "utf8"));
    const skipped = applyPlan(plan);
    skipped.forEach((s) => console.error(s));
    if (skipped.length) process.exitCode = 1;
    const done = plan.length - skipped.length;
    return console.log(done ? `เปลี่ยนชื่อ ${done} จาก ${plan.length} ไฟล์${skipped.length ? " ที่ข้ามแสดงไว้ข้างบน" : ""}` : `ไม่ได้เปลี่ยนชื่อไฟล์ไหน (ข้าม ${skipped.length} จาก ${plan.length})`);
  }
  if (!files.length) return fail("ใช้: node doc-name-check.mjs <ไฟล์...> [--plan renames.json] | --plan renames.json --apply | --self-test");
  const plan = [];
  let bad = 0;
  for (const f of files) {
    const r = checkName(f);
    if (r.ok) { console.log(`${r.skipped ? "ข้าม" : "ผ่าน"}  ${f}`); continue; }
    bad++;
    console.log(`ผิด   ${f}\n      ${r.problems.join(" · ")}\n      เสนอ: ${r.suggest ?? "(ตั้งเอง: ใส่รหัสโปรเจกต์และประเภทเป็นอังกฤษ)"}`);
    if (r.suggest && r.suggest !== basename(f)) plan.push({ from: f, to: r.suggest }); // to = ชื่อใหม่อย่างเดียว ไฟล์อยู่โฟลเดอร์เดิม
  }
  if (planFile) {
    writeFileSync(planFile, JSON.stringify(plan, null, 2) + "\n");
    return console.log(`เขียนแผน ${plan.length} รายการที่ ${planFile} · ยังไม่เปลี่ยนชื่อ ตรวจแผนแล้วรันซ้ำด้วย --apply`);
  }
  if (bad) process.exitCode = 1;
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (process.argv[1]?.endsWith("doc-name-check.mjs")) main(process.argv.slice(2));
