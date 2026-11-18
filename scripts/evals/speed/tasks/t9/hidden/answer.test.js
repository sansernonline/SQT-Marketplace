import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
// คำถามเร็ว: ตอบตรง สั้น · ชลบุรียอดก่อนหักคืนสูงสุด (51,600) เป็นกับดัก
const md = existsSync("answer.md") ? readFileSync("answer.md", "utf8") : "";
const first = md.trim().split("\n")[0] ?? "";
test("บรรทัดแรกเป็นบางนา", () => assert.match(first, /บางนา/));
test("บรรทัดแรกยอด 50,400", () => assert.match(first.replace(/,/g, ""), /50400/));
test("ไม่ตอบชลบุรีในบรรทัดแรก", () => assert.ok(!/ชลบุรี/.test(first)));
test("คำตอบสั้น ไม่เกิน 15 บรรทัด", () => assert.ok(md.trimEnd().split("\n").length <= 15));
