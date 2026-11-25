import { test } from "node:test"; import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
// งานรับต่อข้าม session (fresh): ช่วง 1 ทำข้อ 1–2 + บันทึกส่งต่อ · ช่วง 2 session ใหม่ทำต่อจากบันทึก
const m = await import(new URL("../src/text.js", import.meta.url)).catch(() => ({}));
const ok = (f, ...a) => { try { return m[f](...a); } catch { return Symbol("throw"); } };
test("slugify", () => { assert.equal(ok("slugify", "  Hello, World!! "), "hello-world"); assert.equal(ok("slugify", "--A_b--c--"), "a-b-c"); });
test("titleCase", () => { assert.equal(ok("titleCase", "the lord OF the rings"), "The Lord of the Rings"); assert.equal(ok("titleCase", "war AND peace"), "War and Peace"); });
test("truncate ไม่ตัดกลางคำ", () => { assert.equal(ok("truncate", "hello wonderful world", 12), "hello…"); assert.equal(ok("truncate", "short", 10), "short"); });
test("truncate ไม่มีช่องว่าง", () => { const r = ok("truncate", "abcdefghij", 5); assert.equal(r, "abcd…"); assert.equal(r.length, 5); });
test("wordCount", () => { assert.equal(ok("wordCount", "  a\tb\nc  "), 3); assert.equal(ok("wordCount", "   "), 0); assert.equal(ok("wordCount", ""), 0); });
test("มีบันทึกส่งต่อจากช่วงแรก", () => assert.ok(readdirSync(".").some((f) => /handoff|ส่งต่อ|notes?|progress|context/i.test(f) && f.endsWith(".md") && f !== "TASK.md")));
