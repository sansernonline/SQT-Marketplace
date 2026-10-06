#!/usr/bin/env node
// แปลง .a-team/log/<วันที่>.jsonl เป็นตาราง Markdown ให้คนอ่านย้อนหลัง
//   node log-to-md.mjs                 → log วันนี้ ของโปรเจกต์ในโฟลเดอร์ปัจจุบัน
//   node log-to-md.mjs 2026-10-06      → log วันที่ระบุ
//   node log-to-md.mjs 2026-10-06 --out → เขียนเป็น .a-team/log/2026-10-06.md แทนพิมพ์ออกจอ
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const day = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) ?? new Date().toLocaleDateString("sv-SE");
const logDir = join(process.cwd(), ".a-team", "log");
const source = join(logDir, `${day}.jsonl`);

if (!existsSync(source)) {
  console.error(`ไม่พบ ${source}`);
  process.exit(1);
}

const cell = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const mark = (ok) => (ok === true ? "✓" : ok === false ? "✗" : "");

const rows = readFileSync(source, "utf8").split(/\r?\n/).filter(Boolean).map((line) => {
  try { return JSON.parse(line); } catch { return null; }
}).filter(Boolean);

const lines = [
  `# A-Team log · ${day}`,
  "",
  `${rows.length} รายการ · ล้มเหลว ${rows.filter((r) => r.ok === false).length}`,
  "",
  "| เวลา | session | agent | โมเดล | เหตุการณ์ | เครื่องมือ | เป้าหมาย | ผล |",
  "|---|---|---|---|---|---|---|---|",
  ...rows.map((r) => `| ${cell(r.ts?.slice(11, 19))} | ${cell(r.session)} | ${cell(r.agent)} | ${cell(r.model)} | ${cell(r.event)} | ${cell(r.tool)} | ${cell(r.target || r.prompt || r.source)} | ${mark(r.ok)} |`),
  "",
];

if (args.includes("--out")) {
  writeFileSync(join(logDir, `${day}.md`), lines.join("\n"));
  console.log(`เขียน ${join(logDir, `${day}.md`)}`);
} else {
  process.stdout.write(lines.join("\n"));
}
