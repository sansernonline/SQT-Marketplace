import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { DatabaseSync } from "node:sqlite"; // Node 22.13 ขึ้นไป
// domain ใหม่ (SQL) · กับดัก: คืนเงิน · ยกเลิก · วันขอบ 30 ก.ย. และ 1 ต.ค. · มิ.ย. · ยอดเท่ากันเรียงตามชื่อ
const sql = existsSync("query.sql") ? readFileSync("query.sql", "utf8") : "";
let rows = null, err = null;
try { const db = new DatabaseSync("shop.db", { readOnly: true }); rows = db.prepare(sql.trim().replace(/;\s*$/, "")).all(); } catch (e) { err = e.message; }
// อร = 5,000 − 3,000 (คืน) + 2,000 (30 ก.ย.) = 4,000 · ธนา ไม่นับ 1 ต.ค. · เก่ง ไม่นับ มิ.ย. และยกเลิก · ยอดเท่ากันเรียงตาม name แบบ SQLite (ธ ก่อน ม)
const want = [{ name: "ธนา", net: 4500 }, { name: "มาลี", net: 4500 }, { name: "อร", net: 4000 }];
test("รันได้", () => assert.ok(rows, err ?? "ไม่มี query.sql"));
test("คืน 3 แถว", () => assert.equal(rows?.length, 3));
test("คอลัมน์ name และ net", () => assert.deepEqual(Object.keys(rows?.[0] ?? {}), ["name", "net"]));
test("ยอดถูกและเรียงถูก (รวมเท่ากันเรียงตามชื่อ)", () => assert.deepEqual(rows?.map((r) => [r.name, Number(r.net)]), want.map((r) => [r.name, r.net])));
