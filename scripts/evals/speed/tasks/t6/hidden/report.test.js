import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
// ตรวจ report.md ด้วยกฎที่สคริปต์ตัดสินได้ · ความลื่นของภาษาไม่ได้ตรวจที่นี่
const md = existsSync("report.md") ? readFileSync("report.md", "utf8") : "";
const plain = md.replace(/[,\s]/g, "");
const section = (name) => (md.split(/^##\s+/m).find((s) => s.startsWith(name)) ?? "");
const firstPara = md.replace(/^#[^\n]*\n+/, "").split(/\n\s*\n/)[0] ?? "";

test("มีไฟล์ report.md", () => assert.ok(md.length > 0));
test("งบล่าสุด 1,250,000", () => assert.ok(plain.includes("1250000")));
test("ไม่ใส่งบเดิมที่ถูกแก้", () => assert.ok(!plain.includes("1100000")));
test("ย่อหน้าแรกมีงบและวันเปิด", () => assert.ok(/1,?250,?000|1\.25\s*ล้าน/.test(firstPara) && /15\s*(เดือน)?ธ(\.?ค|ันวาคม)|2026-12-15|15\/12/.test(firstPara)));
test("ยอดขายรวม 32,400", () => assert.ok(plain.includes("32400")));
test("พนักงาน 3 คน ไม่ใช่ 4", () => assert.ok(/3\s*คน/.test(section("ตัดสินใจแล้ว")) && !/4\s*คน/.test(section("ตัดสินใจแล้ว"))));
test("POS อยู่ในยังไม่ตัดสิน ไม่อยู่ในตัดสินใจแล้ว", () => {
  assert.ok(!/POS/i.test(section("ตัดสินใจแล้ว")));
  assert.ok(/POS/i.test(section("ยังไม่ตัดสิน")));
});
test("ตารางงานมีผู้รับผิดชอบครบ 4 คน", () => {
  const rows = section("งานที่ต้องทำ").split("\n").filter((l) => l.trim().startsWith("|"));
  for (const who of ["ธนา", "อร", "เก่ง", "มาลี"]) assert.ok(rows.some((r) => r.includes(who)), who);
});
test("ไม่เกิน 60 บรรทัด", () => assert.ok(md.trimEnd().split("\n").length <= 60));
test("ไม่มีอีโมจิ", () => assert.ok(!/\p{Extended_Pictographic}/u.test(md)));
