// test ที่ซ่อนไว้: migration 002 บน order 200,000 ใบ
import { describe, before, after, test } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { seed } from "../seed.mjs";
import { runMigrationFile } from "../run-migration.mjs";

const ORDERS = 200_000;
const MAX_ROWS_PER_TX = 10_000;
const FILE = new URL("../migrations/002_region_code.sql", import.meta.url);

/** สภาพตาราง orders ณ ตอนนี้: จำนวนแถวต่อ xmin (transaction ที่เขียนแถวล่าสุด), CHECK constraint, NOT NULL */
async function snapshot(db) {
  const xmins = new Map();
  for (const r of (await db.query("SELECT xmin::text AS x, count(*)::int AS n FROM orders GROUP BY 1")).rows) xmins.set(r.x, r.n);
  const checks = new Map();
  for (const r of (await db.query(`
      SELECT conname, convalidated, pg_get_constraintdef(oid) AS def
      FROM pg_constraint WHERE conrelid = 'orders'::regclass AND contype = 'c'`)).rows) checks.set(r.conname, r);
  const col = await db.query(`
      SELECT attnotnull FROM pg_attribute
      WHERE attrelid = 'orders'::regclass AND attname = 'region_code' AND NOT attisdropped`);
  return { xmins, checks, notnull: col.rows.length ? col.rows[0].attnotnull : null };
}

const hasValidatedNotNullCheck = (checks) =>
  [...checks.values()].some((c) => c.convalidated && /^CHECK \(+region_code IS NOT NULL\)+$/i.test(c.def));

/** รัน migration พร้อมจดทุกคำสั่ง */
async function instrumentedRun(db, log) {
  let last = null;
  return runMigrationFile(db, FILE, {
    before: async () => { last = last ?? (await snapshot(db)); },
    after: async (stmt, result) => {
      const now = await snapshot(db);
      const text = stmt.sql.replace(/\s+/g, " ").slice(0, 120);
      let written = 0;
      for (const [x, n] of now.xmins) if (!last.xmins.has(x)) written = Math.max(written, n);
      log.maxWritten = Math.max(log.maxWritten, written);
      if (written > MAX_ROWS_PER_TX) log.bigWrites.push(`${written} แถว: ${text}`);
      if (/^\s*update\b/i.test(stmt.sql) && result.affectedRows > MAX_ROWS_PER_TX) log.bigWrites.push(`UPDATE ${result.affectedRows} แถว: ${text}`);
      for (const [name, c] of now.checks) {
        if (!last.checks.has(name) && c.convalidated) log.lockRules.push(`เพิ่ม CHECK ${name} แบบตรวจทั้งตารางทันที: ${text}`);
      }
      if (last.notnull === false && now.notnull === true && !hasValidatedNotNullCheck(last.checks)) {
        log.lockRules.push(`SET NOT NULL โดยยังไม่มี CHECK (region_code IS NOT NULL) ที่ VALIDATE แล้ว: ${text}`);
      }
      log.executions++;
      last = now;
    },
  });
}

describe("migration 002_region_code บน order 200,000 ใบ", () => {
  const db = new PGlite();
  const log = { maxWritten: 0, bigWrites: [], lockRules: [], executions: 0 };
  const runs = [];

  before(async () => {
    await seed(db, ORDERS);
    for (let i = 0; i < 2; i++) {
      const t0 = Date.now();
      try {
        await instrumentedRun(db, log);
        runs.push({ ok: true, ms: Date.now() - t0 });
      } catch (e) {
        runs.push({ ok: false, error: String(e.message ?? e), ms: Date.now() - t0 });
      }
    }
    const out = process.env.EVAL_METRICS_FILE;
    if (out) {
      writeFileSync(out, JSON.stringify({
        max_rows_per_tx: log.maxWritten, executions: log.executions,
        migrate_ms: runs[0]?.ms ?? null, rerun_ms: runs[1]?.ms ?? null,
      }));
    }
  });

  after(async () => { await db.close(); });

  test("รันครั้งแรกไม่ error", () => {
    assert.ok(runs[0]?.ok, runs[0]?.error);
  });

  test("region_code เป็น NOT NULL และค่าถูกทุกแถว", async () => {
    const col = await db.query(
      "SELECT is_nullable FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'region_code'");
    assert.equal(col.rows[0]?.is_nullable, "NO");
    const map = new Map((await db.query("SELECT province, region_code FROM province_regions")).rows.map((r) => [r.province, r.region_code]));
    const region = new Map((await db.query("SELECT id, province FROM customers")).rows.map((r) => [r.id, map.get(r.province) ?? "UNK"]));
    const orders = (await db.query("SELECT customer_id, region_code FROM orders")).rows;
    assert.equal(orders.length, ORDERS);
    const wrong = orders.filter((o) => o.region_code !== region.get(o.customer_id)).length;
    assert.equal(wrong, 0, `ค่าผิด ${wrong} แถว`);
  });

  test("order ใหม่ที่ไม่มี region_code ต้องบันทึกไม่ได้", async () => {
    await assert.rejects(db.query(
      "INSERT INTO orders (id, customer_id, created_at, total) VALUES (900000001, 1, now(), 10)"));
  });

  test("รันซ้ำได้ ไม่ error และค่าไม่เปลี่ยน", async () => {
    assert.ok(runs[1]?.ok, runs[1]?.error);
    const n = await db.query("SELECT count(*)::int AS n FROM orders WHERE region_code IS NULL");
    assert.equal(n.rows[0].n, 0);
  });

  test(`ไม่มีคำสั่งไหนเขียนแถวใน orders เกิน ${MAX_ROWS_PER_TX} แถวในครั้งเดียว`, () => {
    assert.deepEqual(log.bigWrites.slice(0, 3), []);
  });

  test("CHECK ใหม่ไม่ตรวจทั้งตารางตอนเพิ่ม และ SET NOT NULL หลังมี CHECK ที่ VALIDATE แล้ว", () => {
    assert.deepEqual(log.lockRules.slice(0, 3), []);
  });
});
