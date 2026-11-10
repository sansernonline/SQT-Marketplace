#!/usr/bin/env node
// ตรวจแผนลบก่อน rm (../SKILL.md "ตอนจบงาน") · ทุกพาธในแผนต้องอยู่ใต้ _to_delete/ · สคริปต์นี้ไม่ลบอะไรเอง
//   node delete-plan-check.mjs _to_delete/delete-plan.txt
//   node delete-plan-check.mjs --self-test
// แผน: 1 พาธต่อบรรทัด นับจากรากโปรเจกต์ (เช่น _to_delete/render-check) · บรรทัดว่างและ # ข้าม
// ผ่าน → พิมพ์รายการลบกับรายการเก็บให้เทียบ แล้วจึงลบตามรายการ · พาธหลุดออกนอก _to_delete/ แม้ 1 บรรทัด → exit 1
import { readFileSync, existsSync, realpathSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, resolve, relative, isAbsolute } from "node:path";

const inside = (child, parent) => { const r = relative(parent, child); return r && !r.startsWith("..") && !isAbsolute(r); };

export function checkPlan(planFile) {
  const toDelete = dirname(resolve(planFile));
  if (basename(toDelete) !== "_to_delete") return { errors: [`แผนต้องอยู่ใน _to_delete/ โดยตรง · ได้ ${toDelete} · ย้ายไฟล์แผนไปที่ <รากโปรเจกต์>/_to_delete/delete-plan.txt`], remove: [], keep: [] };
  const root = dirname(toDelete), base = realpathSync.native(toDelete);
  const lines = readFileSync(planFile, "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
  const errors = [], remove = [];
  for (const line of lines) {
    const full = resolve(root, line);
    // ตามลิงก์ (symlink · junction) ไปที่จริงด้วย กันลิงก์ใน _to_delete/ ชี้ออกไปข้างนอก
    if (!inside(full, toDelete) || (existsSync(full) && !inside(realpathSync.native(full), base))) errors.push(`${line}: อยู่นอก _to_delete/ · ย้ายเข้า _to_delete/ ก่อน หรือเอาออกจากแผน`);
    else remove.push({ path: line, kind: !existsSync(full) ? "ไม่พบ" : statSync(full).isDirectory() ? "โฟลเดอร์" : "ไฟล์", full });
  }
  // รายการเก็บ: ของชั้นบนสุดใน _to_delete/ ที่ไม่อยู่ในแผน (ไม่นับไฟล์แผนเอง)
  const keep = readdirSync(toDelete).filter((n) => n !== basename(planFile))
    .filter((n) => !remove.some((r) => r.full === resolve(toDelete, n)));
  return { errors, remove, keep };
}

function main(argv) {
  if (argv.includes("--self-test")) return import("./delete-plan-check.test.mjs").then((t) => t.selfTest());
  const plan = argv.find((a) => !a.startsWith("--"));
  if (!plan || !existsSync(plan)) return fail("ใช้: node delete-plan-check.mjs <รากโปรเจกต์>/_to_delete/delete-plan.txt · เขียนแผน 1 พาธต่อบรรทัดก่อน");
  const { errors, remove, keep } = checkPlan(plan);
  console.log(`ลบ ${remove.length} รายการ\n${remove.map((r) => `  ${r.path} (${r.kind})`).join("\n")}`);
  console.log(`เก็บไว้ใน _to_delete/ ${keep.length} รายการ\n${keep.map((k) => `  ${k}`).join("\n")}`);
  if (errors.length) return fail(`ไม่ผ่าน ${errors.length} ข้อ ห้ามลบตามแผนนี้\n${errors.map((e) => `- ${e}`).join("\n")}`);
  console.log("ผ่าน · ทุกพาธอยู่ใต้ _to_delete/ · ลบตามรายการ \"ลบ\" ได้ (สคริปต์นี้ไม่ลบเอง)");
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (process.argv[1]?.endsWith("delete-plan-check.mjs")) main(process.argv.slice(2));
