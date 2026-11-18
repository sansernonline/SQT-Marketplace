import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
// งานเล็ก: แก้ 3 บรรทัดยอด ห้ามแตะบรรทัดอื่น ห้ามจัดรูปใหม่
const md = existsSync("quotation.md") ? readFileSync("quotation.md", "utf8") : "";
const orig = readFileSync(new URL("./original.md.txt", import.meta.url), "utf8");
const isTotal = (l) => /^(รวม|ภาษี)/.test(l.trim());
const line = (re) => md.split("\n").find((l) => re.test(l)) ?? "";
test("รวมก่อนภาษี 13,000", () => assert.match(line(/^รวมก่อนภาษี/), /13,?000/));
test("VAT 910", () => assert.match(line(/^ภาษีมูลค่าเพิ่ม/), /910/));
test("รวมทั้งสิ้น 13,910", () => assert.match(line(/^รวมทั้งสิ้น/), /13,?910/));
test("ไม่เหลือยอดผิด", () => assert.ok(!/12,?600|13,?482|\b882\b/.test(md)));
test("บรรทัดอื่นไม่ถูกแตะ", () => {
  const keep = (s) => s.trimEnd().split("\n").filter((l) => !isTotal(l));
  assert.deepEqual(keep(md), keep(orig));
});
