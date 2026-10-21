#!/usr/bin/env node
// ตั้งงบรายการ skill ใน ~/.claude/settings.json ให้พอกับ plugin ทั้งชุด
//   node scripts/install/set-skill-budget.mjs          → ตั้ง skillListingBudgetFraction = 0.02 (2% ของ context)
//   node scripts/install/set-skill-budget.mjs 0.03     → ตั้งค่าอื่น
// เหตุผล: ค่าเริ่มต้น 1% → ติดตั้ง 12 plugin แล้วรายการยาวเกินงบ Claude Code ตัดคำอธิบาย skill ทิ้ง โมเดลจึงไม่รู้ว่าตัวไหนใช้เมื่อไหร่
// (debug log: "Skill listing over budget: … descriptions will be truncated") · สำรองไฟล์เดิมก่อนเขียน · ค่าที่ตั้งไว้สูงกว่าแล้วไม่ลดลง
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const want = Number(process.argv[2] ?? "0.02");
if (!(want > 0 && want <= 0.1)) { console.error("ค่าต้องอยู่ระหว่าง 0 ถึง 0.1"); process.exit(1); }
const dir = process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude");
const file = join(dir, "settings.json");
mkdirSync(dir, { recursive: true });
let settings = {};
if (existsSync(file)) {
  try { settings = JSON.parse(readFileSync(file, "utf8")); } catch { console.error(`อ่าน ${file} ไม่ได้ (JSON พัง) — ไม่แตะไฟล์`); process.exit(1); }
}
if ((settings.skillListingBudgetFraction ?? 0) >= want) { console.log(`งบรายการ skill = ${settings.skillListingBudgetFraction} อยู่แล้ว ไม่ต้องแก้`); process.exit(0); }
if (existsSync(file)) copyFileSync(file, `${file}.bak-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}`);
settings.skillListingBudgetFraction = want;
writeFileSync(file, JSON.stringify(settings, null, 2) + "\n");
console.log(`ตั้งงบรายการ skill = ${want} ใน ${file}`);
