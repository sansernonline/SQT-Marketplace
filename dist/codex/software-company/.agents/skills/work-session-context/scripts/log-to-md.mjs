#!/usr/bin/env node
// รวม .superuser/log/<วันที่>/<agent>.jsonl ทุกไฟล์ เรียงตามเวลา เป็นตาราง Markdown ให้คนอ่านย้อนหลัง
//   node log-to-md.mjs 2026-10-06 --agent=developer → เฉพาะ agent ตัวเดียว
//   node log-to-md.mjs                 → log วันนี้ ของโปรเจกต์ในโฟลเดอร์ปัจจุบัน
//   node log-to-md.mjs 2026-10-06      → log วันที่ระบุ
//   node log-to-md.mjs 2026-10-06 --out → เขียนเป็น .superuser/log/2026-10-06.md แทนพิมพ์ออกจอ
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const day = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) ?? new Date().toLocaleDateString("sv-SE");
const only = args.find((a) => a.startsWith("--agent="))?.slice(8);
const logDir = join(process.cwd(), ".superuser", "log");
const dayDir = join(logDir, day);

// ไฟล์ของวันนั้น: 1 ไฟล์ต่อ agent ใน <วันที่>/ · ไฟล์รวมแบบเก่า <วันที่>.jsonl ก็อ่านด้วย
const sources = [
  ...(existsSync(dayDir) ? readdirSync(dayDir).filter((n) => n.endsWith(".jsonl")).map((n) => join(dayDir, n)) : []),
  ...(existsSync(join(logDir, `${day}.jsonl`)) ? [join(logDir, `${day}.jsonl`)] : []),
];
if (!sources.length) {
  console.error(`ไม่พบ log ของ ${day} ใน ${logDir}`);
  process.exit(1);
}

const cell = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const mark = (ok) => (ok === true ? "✓" : ok === false ? "✗" : "");

const rows = sources.flatMap((file) => readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean).map((line) => {
  try { return JSON.parse(line); } catch { return null; }
}).filter(Boolean))
  .filter((r) => !only || r.agent === only)
  .sort((a, b) => String(a.ts).localeCompare(String(b.ts)));

const lines = [
  `# SuperUser log · ${day}${only ? ` · ${only}` : ""}`,
  "",
  `${rows.length} รายการ · ล้มเหลว ${rows.filter((r) => r.ok === false).length} · ผู้ใช้แก้ ${rows.filter((r) => r.correction).length}`,
  "",
  "| เวลา | session | agent | โมเดล | เหตุการณ์ | เครื่องมือ | เป้าหมาย | ผล |",
  "|---|---|---|---|---|---|---|---|",
  ...rows.map((r) => `| ${cell(r.ts?.slice(11, 19))} | ${cell(r.session)} | ${cell(r.agent)} | ${cell(r.model)} | ${cell(r.event)} | ${cell(r.tool)} | ${r.correction ? "⚠ แก้ · " : ""}${cell(r.target || r.prompt || r.source)} | ${mark(r.ok)} |`),
  "",
];

if (args.includes("--out")) {
  writeFileSync(join(logDir, `${day}.md`), lines.join("\n"));
  console.log(`เขียน ${join(logDir, `${day}.md`)}`);
} else {
  process.stdout.write(lines.join("\n"));
}
