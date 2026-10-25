// clean-check.mjs — รัน migration 002 สองรอบบนข้อมูลเล็ก พิมพ์ error และ WARNING เป็น JSON
import { PGlite } from "@electric-sql/pglite";
import { seed } from "./seed.mjs";
import { runMigrationFile } from "./run-migration.mjs";

const db = new PGlite();
await seed(db, 5000);
const problems = [];
for (const round of [1, 2]) {
  try {
    const r = await runMigrationFile(db, new URL("./migrations/002_region_code.sql", import.meta.url));
    for (const w of r.warnings) problems.push(`รอบ ${round} WARNING: ${w}`);
  } catch (e) {
    problems.push(`รอบ ${round} error: ${e.message ?? e}`);
  }
}
await db.close();
console.log(JSON.stringify({ problems }));
