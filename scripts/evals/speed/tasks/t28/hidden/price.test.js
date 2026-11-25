import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
// domain ใหม่ (git merge) · ต้องรวมทั้ง 2 ฝั่ง
const src = readFileSync("src/price.js", "utf8");
const m = await import(new URL("../src/price.js", import.meta.url)).catch(() => ({}));
const f = (...a) => { try { return m.finalPrice(...a); } catch { return NaN; } };
test("ไม่มีเครื่องหมาย conflict", () => assert.ok(!/^(<{7}|={7}|>{7})/m.test(src)));
test("ไม่มี VAT ปัด 2 ตำแหน่ง", () => { assert.equal(f(100, 10), 90); assert.equal(f(19.99, 15), 16.99); });
test("VAT หลังส่วนลดและปัด", () => { assert.equal(f(100, 0, { vat: true }), 107); assert.equal(f(100, 10, { vat: true }), 96.3); });
test("ปัดหลัง VAT", () => assert.equal(f(1.05, 0, { vat: true }), 1.12));
