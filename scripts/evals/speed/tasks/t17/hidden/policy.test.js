import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
// ตรวจ policy.md ด้วยกฎที่สคริปต์ตัดสินได้ · ความลื่นของภาษาไม่ได้ตรวจที่นี่
const md = existsSync("policy.md") ? readFileSync("policy.md", "utf8") : "";
const section = (name) => (md.split(/^##\s+/m).find((s) => s.startsWith(name)) ?? "");
const decided = ["สิทธิ์วันลา", "การขอลา", "วันลาสะสม"].map(section).join("\n");
const undecided = section("ยังไม่ตัดสิน");

test("มีไฟล์และหัวเรื่อง", () => assert.ok(/^#\s+นโยบายลาพักร้อน/m.test(md)));
test("มีครบ 4 หัวข้อ", () => { for (const h of ["สิทธิ์วันลา", "การขอลา", "วันลาสะสม", "ยังไม่ตัดสิน"]) assert.ok(section(h).length > 0, h); });
test("ครบ 1 ปี 12 วัน ครบ 5 ปี 15 วัน", () => {
  const s = section("สิทธิ์วันลา");
  assert.ok(/1\s*ปี[^\n]*12\s*วัน/.test(s)); assert.ok(/5\s*ปี[^\n]*15\s*วัน/.test(s));
});
test("ไม่มีตัวเลขสิทธิ์เดิม 10 วัน", () => assert.ok(!/(?<!\d)10\s*วัน/.test(decided)));
test("ยกยอดไม่เกิน 6 วัน ไม่ใช่ 5", () => {
  const s = section("วันลาสะสม");
  assert.ok(/6\s*วัน/.test(s)); assert.ok(!/(?<!\d)5\s*วัน/.test(s));
});
test("ผู้อำนวยการอนุมัติเมื่อเกิน 7 วัน ไม่ใช่ 5", () => {
  const s = section("การขอลา");
  assert.ok(/เกิน\s*7\s*วัน/.test(s)); assert.ok(!/เกิน\s*5\s*วัน/.test(s));
});
test("แจ้งล่วงหน้า 7 วันทำการ", () => assert.ok(/ล่วงหน้า[^\n]*7\s*วัน/.test(section("การขอลา"))));
test("ทดลองงานลาพักร้อนไม่ได้", () => assert.ok(/ทดลองงาน/.test(section("สิทธิ์วันลา"))));
test("เรื่องที่ยังไม่ตัดสินอยู่ในหัวข้อยังไม่ตัดสินครบ", () => {
  for (const k of ["ปิด", "ครึ่งวัน", "ชดเชย"]) assert.ok(undecided.includes(k), k);
});
test("เรื่องที่ยังไม่ตัดสินไม่หลุดไปเป็นนโยบาย", () => {
  assert.ok(!/ครึ่งวัน|ชดเชย|ปิดบริษัท|ปีใหม่/.test(decided));
});
test("ข้อเสนอ 18 วันไม่ถูกเขียนเป็นสิทธิ์", () => assert.ok(!/18\s*วัน/.test(decided)));
test("ไม่เกิน 50 บรรทัด", () => assert.ok(md.trimEnd().split("\n").length <= 50));
test("ไม่มีอีโมจิ", () => assert.ok(!/\p{Extended_Pictographic}/u.test(md)));
