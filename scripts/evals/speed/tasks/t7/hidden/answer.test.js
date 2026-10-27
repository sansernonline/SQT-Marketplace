import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
// คำตอบถูก = 2,000 + (2,000 × 20% × 2 เดือน) = 2,800 จากประกาศฉบับปี 2569 ที่ยกเลิกฉบับ 2567
const md = existsSync("answer.md") ? readFileSync("answer.md", "utf8") : "";
const plain = md.replace(/,/g, "");
const firstLine = md.split("\n").find((l) => l.trim()) ?? "";

test("มีไฟล์ answer.md", () => assert.ok(md.length > 0));
test("บรรทัดแรกเป็นยอดรวม 2,800", () => assert.ok(/2,?800/.test(firstLine)));
test("ค่าต่ออายุ 2,000 และค่าปรับ 800", () => assert.ok(/\b2000\b/.test(plain) && /\b800\b/.test(plain)));
test("อ้างประกาศฉบับปี 2569", () => assert.ok(md.includes("official-2026")));
test("บอกว่าฉบับ 2567 (1,500) ถูกยกเลิก", () => assert.ok(/1,?500/.test(md) && /ยกเลิก|ฉบับเก่า|เก่ากว่า|ใช้ไม่ได้แล้ว|แทนที่/.test(md)));
