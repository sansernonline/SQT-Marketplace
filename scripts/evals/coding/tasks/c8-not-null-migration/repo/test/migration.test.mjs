import { test } from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { seed } from "../seed.mjs";
import { runMigration, runMigrationFile, splitStatements } from "../run-migration.mjs";

const FILE = new URL("../migrations/002_region_code.sql", import.meta.url);

test("splitStatements แยกคำสั่งและอ่าน --@repeat", () => {
  const s = splitStatements("SELECT ';';\n--@repeat\nUPDATE t SET a = 1;\nDO $$ BEGIN PERFORM 1; END $$;");
  assert.deepEqual(s.map((x) => x.repeat), [false, true, false]);
  assert.equal(s[0].sql, "SELECT ';'");
});

test("--@repeat รันซ้ำจนไม่มีแถวถูกแก้", async () => {
  const db = new PGlite();
  await db.exec("CREATE TABLE t (id int, done bool DEFAULT false); INSERT INTO t SELECT generate_series(1, 25);");
  const r = await runMigration(db, "--@repeat\nUPDATE t SET done = true WHERE id IN (SELECT id FROM t WHERE NOT done LIMIT 10);");
  assert.equal(r.executions, 4);
  await db.close();
});

test("migration 002 ใส่ region_code ให้ทุก order", async () => {
  const db = new PGlite();
  await seed(db, 2000);
  await runMigrationFile(db, FILE);
  const col = await db.query(
    "SELECT is_nullable FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'region_code'");
  assert.equal(col.rows[0].is_nullable, "NO");
  const wrong = await db.query(`
    SELECT count(*)::int AS n
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    LEFT JOIN province_regions m ON m.province = c.province
    WHERE o.region_code IS DISTINCT FROM COALESCE(m.region_code, 'UNK')`);
  assert.equal(wrong.rows[0].n, 0);
  await db.close();
});
