#!/usr/bin/env node
// รากโปรเจกต์ต้องไม่มีไฟล์ชั่วคราว (../SKILL.md · กฎกลางหัวข้อ "ไฟล์และ git") · ลงรายการของที่รากที่อยู่นอกรายการอนุญาต แล้ว exit 1
//   node root-check.mjs [โฟลเดอร์ราก]            ค่าเริ่ม = โฟลเดอร์ปัจจุบัน
//   node root-check.mjs . --allow README.md,LICENSE  เพิ่มชื่อที่โปรเจกต์นี้ยกเว้นไว้ (ประกาศใน README ของโปรเจกต์)
//   node root-check.mjs --self-test
// ไม่ย้ายหรือลบอะไร · ของที่เจอ ถ้าเป็นของที่ agent สร้างเองให้ย้ายเข้า _to_delete/ ถ้าไม่แน่ใจให้ถามผู้ใช้
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";

// รายการตามกฎกลาง: ref docs mockup assets qa _to_delete .claude + โฟลเดอร์โค้ด · ไฟล์คำสั่งของ agent อยู่ที่รากได้
const ALLOWED = ["ref", "docs", "mockup", "assets", "qa", "_to_delete", ".claude", "CLAUDE.md", "AGENTS.md"];

// โฟลเดอร์โค้ดชื่อเดียวกับโปรเจกต์ ตัวเล็กคั่นด้วย - : "Lumio - Light Meter" → "lumio-light-meter"
export const codeFolderName = (dir) => basename(resolve(dir)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// .gitignore แบบง่าย: เฉพาะแพตเทิร์นที่ไม่มี / ตรงกลาง · รองรับ * และ ? · ไม่รองรับ ! (นับเป็นไม่ถูกยกเว้น)
export function gitignoreMatchers(dir) {
  const file = join(dir, ".gitignore");
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8").split(/\r?\n/).map((l) => l.trim().replace(/^\//, "").replace(/\/$/, ""))
    .filter((p) => p && !p.startsWith("#") && !p.startsWith("!") && !p.includes("/"))
    .map((p) => new RegExp(`^${p.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".")}$`));
}

export function strays(dir, extra = []) {
  const allowed = new Set([...ALLOWED, codeFolderName(dir), ...extra]);
  const ignored = gitignoreMatchers(dir);
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => !e.name.startsWith(".") || e.name === ".cache") // dotfile เป็นของเครื่องมือ (.git .gitignore .github) · .cache ห้ามใช้เป็นที่ชั่วคราว
    .filter((e) => !allowed.has(e.name) && !ignored.some((re) => re.test(e.name)))
    .map((e) => (e.isDirectory() ? `${e.name}/` : e.name));
}

function main(argv) {
  if (argv.includes("--self-test")) return import("./root-check.test.mjs").then((t) => t.selfTest());
  const i = argv.indexOf("--allow");
  const extra = i >= 0 ? (argv[i + 1] ?? "").split(",").filter(Boolean) : [];
  const dir = argv.find((a, n) => !a.startsWith("--") && n !== i + 1) ?? ".";
  if (!existsSync(dir)) return fail(`ไม่พบโฟลเดอร์ ${dir} · ใส่พาธรากโปรเจกต์`);
  const found = strays(dir, extra);
  if (!found.length) return console.log(`ผ่าน · รากของ ${resolve(dir)} ไม่มีของนอกรายการ`);
  fail(`ที่รากมี ${found.length} รายการนอกรายการอนุญาต (โฟลเดอร์โค้ดที่รับได้: ${codeFolderName(dir)}/)\n${found.map((f) => `- ${f}`).join("\n")}\nของชั่วคราว → ย้ายเข้า _to_delete/ · ของที่โปรเจกต์ตั้งใจวาง → --allow <ชื่อ> และประกาศใน README`);
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (process.argv[1]?.endsWith("root-check.mjs")) main(process.argv.slice(2));
