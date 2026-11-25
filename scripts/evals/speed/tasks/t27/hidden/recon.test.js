import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
// งานใหม่ (fresh) งานเงิน · กับดัก: จุลภาคหลักพัน · เครื่องหมายลบกับ debit/credit · 8,000.50 กับ 8000.05 · ดอกเบี้ย 1.27 ไม่มีในบัญชี
const exp = JSON.parse(readFileSync(new URL("./expected.json", import.meta.url), "utf8"));
let got = null; try { got = JSON.parse(readFileSync("recon.json", "utf8")); } catch { /* ไม่มีหรือพัง */ }
test("recon.json อ่านได้", () => assert.ok(got));
test("ไม่มีในบัญชี", () => assert.deepEqual(got?.missing_in_ledger, exp.missing_in_ledger));
test("ไม่มีในธนาคาร", () => assert.deepEqual(got?.missing_in_bank, exp.missing_in_bank));
test("ยอดไม่ตรง (สตางค์)", () => assert.deepEqual(got?.amount_mismatch?.map((x) => [x.ref, Math.round(x.bank), Math.round(x.ledger)]), exp.amount_mismatch.map((x) => [x.ref, x.bank, x.ledger])));
test("ยอดรวมธนาคาร", () => assert.equal(Math.round(got?.bank_total), exp.bank_total));
test("ยอดรวมบัญชี", () => assert.equal(Math.round(got?.ledger_total), exp.ledger_total));
