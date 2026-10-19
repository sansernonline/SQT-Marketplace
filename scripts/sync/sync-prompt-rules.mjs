#!/usr/bin/env node
// เขียนบล็อกกฎร่วม <!-- rules:begin --> ... <!-- rules:end --> ในทุกไฟล์ prompt/software-company/*.md ให้ตรงกับ RULES
//   node scripts/sync/sync-prompt-rules.mjs          → เขียนทับบล็อกในทุกไฟล์
//   node scripts/sync/sync-prompt-rules.mjs --check  → ตรวจอย่างเดียว · ไม่ตรงออกด้วยรหัส 1
// ต้นฉบับคือ RULES ในไฟล์นี้ที่เดียว · กฎเฉพาะไฟล์วางไว้นอกบล็อก (ใต้ rules:end)
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const PROMPT_DIR = "prompt/software-company";
export const RULES = "**กฎการทำงาน (agent ต้องทำตาม):** เปิด skill `superuser` ก่อนเริ่ม แล้วทำตาม playbook ที่ฉบับนั้นระบุ (ไม่ระบุ → `project-docs`) · กฎร่วม (ถามแบบเลือกคำตอบครั้งเดียว ทุกตัวเลือกมีหลักฐาน · ทำจบรอบเดียว · ตัดสินใจเอง · รายงานสถานะ) อยู่ใน skill `superuser` และ playbook ที่เดียว · ข้อที่ต้องตัดสิน: ใช้ค่าตั้งต้นของเจ้าของใน `~/.claude/superuser-style.md` ก่อน ไม่มี → ค้นแล้วโหวต 3 agent ตาม skill `superuser` หัวข้อ 6 · ถามผู้ใช้เฉพาะข้อที่โหวตแทนไม่ได้ และตัวแนะนำบอกผลโหวต · ตัดสินใจเอง (พร้อมผลโหวต) และสถานะลง `docs/BUILD-PLAN.md` (ยังไม่มี → สร้าง) · ไฟล์ทำงานของ SuperUser (`CONTEXT.md` · `IMPROVEMENTS.md` · log) อยู่ใต้ `.claude/superuser/` ตาม `project-doc-set` ข้อ 1 ไม่วางที่รากโปรเจกต์ · ใช้ skill และ agent ของ plugin `software-company` เท่านั้น (ไม่ใช้ตัวชื่อซ้ำของ plugin อื่น) · เปิด skill ไม่ได้ → อ่าน `skills/<ชื่อ>/SKILL.md` ของ plugin · ไม่มี agent → ใช้ agent ทั่วไปพร้อมเปิด `agents/<ชื่อ>.md` · หาไม่เจอทั้ง 2 ทาง → ข้ามชิ้นนั้น ทำส่วนอื่นให้จบ แล้วรายงานว่าติด · ไม่มี `reviewer` หรือ `brainstormer` (plugin เวอร์ชันเก่า) → `general-purpose` ตัวใหม่ทำหน้าที่เดียวกัน (ตรวจอย่างเดียว ไม่แก้ · เสนอ 2–3 ทาง) · ไม่มี `learning-reviewer` → ข้ามรอบเรียนรู้แล้วจดไว้\n\n**วนจนเสร็จ (agent loop):** ทุกฉบับวน ทำ → ตรวจ → แก้ → ตรวจซ้ำ จนผ่านทุกข้อที่ฉบับนั้นต้องมี · ตรวจด้วยหลักฐานจริง (เปิดไฟล์ · รันคำสั่ง · เทียบแหล่ง) ไม่ใช่คำบอกของตัวที่ทำ · รอบตรวจใช้ `reviewer` ตัวใหม่ทุกรอบ · ไม่ผ่าน → แก้ที่ต้นเหตุแล้วตรวจซ้ำทั้งข้อเดิมและจุดที่แก้ · เหลือแค่ข้อระดับต่ำ → ปิดได้แล้วลงรายงาน · ครบ 5 รอบยังไม่ผ่าน → ติดป้าย `ติด` ทำส่วนอื่นให้จบ แล้วรายงานข้อที่เหลือ · รายละเอียดอยู่ใน skill `superuser` กฎข้อ 2";
const BLOCK = /<!-- rules:begin -->\n[\s\S]*?\n<!-- rules:end -->/;
const WANT = `<!-- rules:begin -->\n${RULES}\n<!-- rules:end -->`;

// คืนรายการปัญหา และข้อความใหม่ของแต่ละไฟล์ (ใช้ร่วมกับ validate-marketplace.mjs)
export function plan(root) {
  const dir = join(root, PROMPT_DIR);
  const targets = readdirSync(dir).filter((f) => f.startsWith("prompt-") && f.endsWith(".md"));
  const problems = [];
  const writes = [];
  for (const f of targets) {
    const original = readFileSync(join(dir, f), "utf8");
    const text = original.replace(/\r\n/g, "\n");
    if (!BLOCK.test(text)) { problems.push(`${PROMPT_DIR}/${f} ไม่มีบล็อก rules:begin/end — ใส่ marker ครั้งแรกด้วยมือ`); continue; }
    const next = text.replace(BLOCK, () => WANT);
    if (next === text) continue;
    problems.push(`${PROMPT_DIR}/${f} บล็อกกฎร่วมไม่ตรงกับ RULES`);
    writes.push([join(dir, f), original.includes("\r\n") ? next.replace(/\n/g, "\r\n") : next]);
  }
  return { targets, problems, writes };
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/sync-prompt-rules.mjs")) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const check = process.argv.includes("--check");
  const { targets, problems, writes } = plan(root);
  for (const line of problems) console.log(`  ${check ? "✗" : "→"} ${line}`);
  const missing = problems.filter((line) => line.includes("ไม่มีบล็อก"));
  if (check) {
    console.log(problems.length ? `\n${problems.length} จุดไม่ตรง · รัน node scripts/sync/sync-prompt-rules.mjs` : `บล็อกกฎร่วมตรงกันทั้ง ${targets.length} ไฟล์`);
    process.exit(problems.length ? 1 : 0);
  }
  for (const [file, text] of writes) writeFileSync(file, text);
  console.log(`\nเขียน ${writes.length} ไฟล์ · ${targets.length} ไฟล์${missing.length ? ` · ยังขาด marker ${missing.length} จุด` : ""}`);
  process.exit(missing.length ? 1 : 0);
}
