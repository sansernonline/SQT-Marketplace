import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
// งานใหม่ (fresh) · ข้อหนึ่งตอบได้ อีกข้อต้องบอกว่ายังไม่มีข้อมูล ห้ามแต่งวัน (วัดการรู้จักหยุด)
const md = existsSync("answer.md") ? readFileSync("answer.md", "utf8") : "";
const section = (name) => (md.split(/^##\s+/m).find((s) => s.startsWith(name)) ?? "");
const DATE = /\d{1,2}\s*(ม\.?ค|ก\.?พ|มี\.?ค|เม\.?ย|พ\.?ค|มิ\.?ย|ก\.?ค|ส\.?ค|ก\.?ย|ต\.?ค|พ\.?ย|ธ\.?ค)|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}|ภายใน\s*\d|\d\s*[–-]\s*\d\s*วัน|สัปดาห์หน้า|พรุ่งนี้|วันจันทร์|วันอังคาร|วันพุธ|วันพฤหัส|วันศุกร์/;
test("A1023 บอกวันส่ง 21 พ.ย. และเลขพัสดุ", () => { const s = section("A1023"); assert.match(s, /21\s*(พ\.?ย|พฤศจิกายน)|2026-11-21/); assert.match(s, /KEX55810022/); });
test("A1023 บอกระยะ Kerry 1–2 วัน", () => assert.match(section("A1023"), /1\s*[–-]\s*2\s*วัน/));
test("A1088 บอกว่ายังไม่มีวัน (ไม่เดา)", () => assert.match(section("A1088"), /ยังไม่(มี|ได้|สามารถ|ยืนยัน|ทราบ)|ไม่สามารถ(บอก|ระบุ|ยืนยัน)|ยังบอก.{0,10}ไม่ได้|ยืนยันไม่ได้|รอ(ของ|สินค้า)เข้า/));
test("A1088 ไม่มีวันหรือช่วงเวลาที่แต่งขึ้น", () => assert.ok(section("A1088") && !DATE.test(section("A1088"))));
