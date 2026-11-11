#!/usr/bin/env node
/**
 * วัดตัวแยกขนาดงานของ hook (looksSmall · looksBig) กับชุดข้อความที่คนติดป้ายไว้
 * ใช้: node scripts/evals/classify/run.mjs <ชุด.jsonl> [--all]
 * แต่ละบรรทัด {"text": "...", "label": "small|medium|big", "ctx": false} · ค่าตั้งต้นวัดเฉพาะ ctx=false (ข้อความที่อ่านเข้าใจได้ในตัว) · --all วัดทุกข้อ
 * ชุดข้อความจริงของผู้ใช้ไม่อยู่ใน git (มีคำขอส่วนตัว) · เก็บที่ .claude/superuser/ ของโฟลเดอร์หลัก
 */
import { readFileSync } from "node:fs";
import { looksSmall, looksBig } from "../../../plugins/superuser/hooks/superuser-hook.mjs";

const [file, flag] = process.argv.slice(2);
if (!file) { console.error("ใช้: node scripts/evals/classify/run.mjs <ชุด.jsonl> [--all]"); process.exit(2); }
const rows = readFileSync(file, "utf8").trim().split("\n").map((l) => JSON.parse(l)).filter((r) => flag === "--all" || !r.ctx);
const size = (t) => (looksSmall(t) ? "small" : looksBig(t) ? "big" : "medium");
const labels = ["small", "medium", "big"], m = {};
let hit = 0;
for (const r of rows) {
  const got = size(r.text);
  m[`${r.label}>${got}`] = (m[`${r.label}>${got}`] ?? 0) + 1;
  if (got === r.label) hit++; else console.log(`ป้าย ${r.label} · ได้ ${got} · ${r.text.replace(/\s+/g, " ").slice(0, 110)}`);
}
console.log(`\nตรง ${hit}/${rows.length} (${Math.round((100 * hit) / rows.length)}%)\nป้าย\ได้  ${labels.join("  ")}`);
for (const a of labels) console.log(`${a.padEnd(8)} ${labels.map((b) => String(m[`${a}>${b}`] ?? 0).padStart(5)).join(" ")}`);
// งานใหญ่ที่หลุดเป็นเล็กหรือกลางแพงที่สุด (ไม่มีหัวหน้า ไม่มีผู้ตรวจ) · exit 1 เมื่อมี
const missBig = rows.filter((r) => r.label === "big" && size(r.text) !== "big").length;
console.log(`งานใหญ่ที่หลุด ${missBig}`);
process.exit(missBig ? 1 : 0);
