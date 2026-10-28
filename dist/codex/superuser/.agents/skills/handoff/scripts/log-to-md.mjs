#!/usr/bin/env node
// รวม .claude/superuser/log/<วันที่>/<agent>.jsonl ทุกไฟล์ เรียงตามเวลา เป็นตาราง Markdown ให้คนอ่านย้อนหลัง
//   node log-to-md.mjs                 → log วันนี้ ของโปรเจกต์ในโฟลเดอร์ปัจจุบัน
//   node log-to-md.mjs 2026-10-06      → log วันที่ระบุ
//   node log-to-md.mjs 2026-10-06 --agent=developer → เฉพาะ agent ตัวเดียว
//   node log-to-md.mjs 2026-10-06 --out → เขียนเป็น .claude/superuser/log/2026-10-06.md แทนพิมพ์ออกจอ · มีไฟล์อยู่แล้วต้องเติม --force
//   node log-to-md.mjs --self-test
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const USAGE = "ใช้: node log-to-md.mjs [YYYY-MM-DD] [--agent=<ชื่อ>] [--out [--force]] | --self-test";

// argument ที่ไม่รู้จักต้องล้ม ไม่ใช่เงียบแล้วได้ log วันนี้ (เคยเกิด: --bogus ได้ตารางวันนี้ exit 0)
export function parseArgs(args, today = new Date().toLocaleDateString("sv-SE")) {
  const opts = { day: today, only: undefined, out: false, force: false };
  for (const a of args) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(a)) {
      const d = new Date(`${a}T00:00:00Z`);
      if (isNaN(d) || !d.toISOString().startsWith(a)) throw new Error(`วันที่ ${a} ไม่มีจริง · ใช้รูป YYYY-MM-DD เช่น 2026-10-06`);
      opts.day = a;
    } else if (a.startsWith("--agent=") && a.length > 8) opts.only = a.slice(8);
    else if (a === "--out") opts.out = true;
    else if (a === "--force") opts.force = true;
    else throw new Error(`ไม่รู้จัก "${a}" · วันที่ต้องเป็น YYYY-MM-DD · ${USAGE}`);
  }
  if (opts.force && !opts.out) throw new Error(`--force ใช้คู่กับ --out เท่านั้น · ${USAGE}`);
  return opts;
}

// ไฟล์ของวันนั้น: 1 ไฟล์ต่อ agent ใน <วันที่>/ · ไฟล์รวมแบบเก่า <วันที่>.jsonl ก็อ่านด้วย
export function readRows(logDir, day, only) {
  const dayDir = join(logDir, day);
  const sources = [
    ...(existsSync(dayDir) ? readdirSync(dayDir).filter((n) => n.endsWith(".jsonl")).map((n) => join(dayDir, n)) : []),
    ...(existsSync(join(logDir, `${day}.jsonl`)) ? [join(logDir, `${day}.jsonl`)] : []),
  ];
  if (!sources.length) return null;
  return sources.flatMap((file) => readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean).map((line) => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean))
    .filter((r) => !only || r.agent === only)
    .sort((a, b) => String(a.ts).localeCompare(String(b.ts)));
}

const cell = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const mark = (ok) => (ok === true ? "✓" : ok === false ? "✗" : "");

// agent พร้อม id ย่อ · แถวส่งงานบอกบทบาทที่ถูกเรียก · แถว review บอกผลตรวจ
const who = (r) => `${cell(r.agent)}${r.id ? ` · ${cell(r.id)}` : ""}`;
const what = (r) => {
  if (r.event === "review") return `ตรวจ ${cell(r.task)} รอบ ${cell(r.round)} โดย ${cell(r.by)}${r.by_id ? ` · ${cell(r.by_id)}` : ""} → ${cell(r.result)} · สูง ${cell(r.high)} กลาง ${cell(r.mid)} ต่ำ ${cell(r.low)}`;
  const spawn = r.role ? `→ ${cell(r.role)}${r.role_model ? ` (${cell(r.role_model)})` : ""}${r.spawned_id ? ` · ${cell(r.spawned_id)}` : ""} · ` : "";
  return `${r.correction ? "⚠ แก้ · " : ""}${spawn}${cell(r.target || r.prompt || r.source)}`;
};
const reviewOk = (r) => (r.event === "review" ? r.result === "ผ่าน" : r.ok);

export function toMarkdown(rows, day, only) {
  const reviews = rows.filter((r) => r.event === "review");
  return [
    `# SuperUser log · ${day}${only ? ` · ${only}` : ""}`,
    "",
    `${rows.length} รายการ · ล้มเหลว ${rows.filter((r) => r.ok === false).length} · ผู้ใช้แก้ ${rows.filter((r) => r.correction).length} · รอบตรวจ ${reviews.length} (ไม่ผ่าน ${reviews.filter((r) => r.result !== "ผ่าน").length})`,
    "",
    "| เวลา | session | agent | โมเดล | เหตุการณ์ | เครื่องมือ | เป้าหมาย | ผล |",
    "|---|---|---|---|---|---|---|---|",
    ...rows.map((r) => `| ${cell(r.ts?.slice(11, 19))} | ${cell(r.session)} | ${who(r)} | ${cell(r.model)} | ${cell(r.event)} | ${cell(r.tool)} | ${what(r)} | ${mark(reviewOk(r))} |`),
    "",
  ].join("\n");
}

function main(args) {
  if (args.includes("--self-test")) return import("./log-to-md.test.mjs").then((t) => t.selfTest());
  let opts;
  try { opts = parseArgs(args); } catch (e) { return fail(e.message); }
  // .claude/superuser/ คือที่ใหม่ · .superuser/ คือที่เดิมของโปรเจกต์เก่า
  const teamDir = [join(".claude", "superuser"), ".superuser"].map((rel) => join(process.cwd(), rel)).find(existsSync) ?? join(process.cwd(), ".claude", "superuser");
  const logDir = join(teamDir, "log");
  const rows = readRows(logDir, opts.day, opts.only);
  if (!rows) return fail(`ไม่พบ log ของ ${opts.day} ใน ${logDir}`);
  const md = toMarkdown(rows, opts.day, opts.only);
  if (!opts.out) return process.stdout.write(md);
  const target = join(logDir, `${opts.day}.md`);
  if (existsSync(target) && !opts.force) return fail(`${target} มีอยู่แล้ว · เติม --force ถ้าจะเขียนทับ หรือดูบนจอโดยไม่ใส่ --out`);
  writeFileSync(target, md);
  console.log(`เขียน ${target}`);
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (process.argv[1]?.endsWith("log-to-md.mjs")) main(process.argv.slice(2));
