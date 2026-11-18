import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
// คำตอบถูกคือ 9 คน · นับบรรทัดดิบได้ 15 · ไม่จัดรูปอีเมลก่อนนับได้ 13
const txt = existsSync("answer.txt") ? readFileSync("answer.txt", "utf8").trim() : "";
test("มี answer.txt", () => assert.ok(txt.length > 0));
test("ตอบ 9", () => assert.equal(txt, "9"));
test("ไม่ตอบ 15 (นับบรรทัด)", () => assert.notEqual(txt, "15"));
