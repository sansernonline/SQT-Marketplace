// run-migration.mjs — รันไฟล์ migration ทีละคำสั่ง แต่ละคำสั่ง commit เอง (autocommit)
//
// ในไฟล์ .sql ใส่บรรทัด `--@repeat` ไว้ก่อนคำสั่งใด = รันคำสั่งนั้นซ้ำจนไม่มีแถวถูกแก้ (affectedRows = 0)
// ใช้กับการอัปเดตทีละชุด
//
// ใช้: node run-migration.mjs <โฟลเดอร์ข้อมูล PGlite> <ไฟล์ .sql>
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { PGlite } from "@electric-sql/pglite";

const MAX_REPEAT = 10000;

/** แยกข้อความ SQL เป็นคำสั่ง คืน [{ sql, repeat }] · รู้จัก '...', "...", $tag$...$tag$ และคอมเมนต์สองแบบ (ขีดคู่ กับ แบบบล็อก) */
export function splitStatements(text) {
  const out = [];
  let buf = "", repeat = false, i = 0;
  const push = () => {
    const sql = buf.trim();
    if (sql) out.push({ sql, repeat });
    buf = ""; repeat = false;
  };
  while (i < text.length) {
    const c = text[i], rest = text.slice(i);
    if (rest.startsWith("--")) {
      const end = text.indexOf("\n", i);
      const line = text.slice(i, end === -1 ? text.length : end);
      if (line.trim() === "--@repeat") repeat = true;
      i = end === -1 ? text.length : end + 1;
      buf += "\n";
    } else if (rest.startsWith("/*")) {
      const end = text.indexOf("*/", i + 2);
      i = end === -1 ? text.length : end + 2;
      buf += " ";
    } else if (c === "'" || c === '"') {
      let j = i + 1;
      while (j < text.length && !(text[j] === c && text[j + 1] !== c)) j += text[j] === c ? 2 : 1;
      buf += text.slice(i, j + 1); i = j + 1;
    } else if (c === "$" && /^\$[A-Za-z_]*\$/.test(rest)) {
      const tag = /^\$[A-Za-z_]*\$/.exec(rest)[0];
      const end = text.indexOf(tag, i + tag.length);
      const stop = end === -1 ? text.length : end + tag.length;
      buf += text.slice(i, stop); i = stop;
    } else if (c === ";") {
      push(); i++;
    } else {
      buf += c; i++;
    }
  }
  push();
  return out;
}

/**
 * รันข้อความ migration บน db (PGlite) ทีละคำสั่ง
 * hooks.before(stmt) และ hooks.after(stmt, result) ถูกเรียกรอบทุกครั้งที่รันคำสั่ง (รวมรอบที่ repeat)
 * คืน { statements, executions, warnings }
 */
export async function runMigration(db, sqlText, hooks = {}) {
  const statements = splitStatements(sqlText);
  const warnings = [];
  const onNotice = (m) => { if (m.severity === "WARNING") warnings.push(m.message); };
  let executions = 0;
  for (const stmt of statements) {
    for (let round = 1; ; round++) {
      if (round > MAX_REPEAT) throw new Error(`--@repeat เกิน ${MAX_REPEAT} รอบ: ${stmt.sql.slice(0, 80)}`);
      await hooks.before?.(stmt);
      const result = await db.query(stmt.sql, [], { onNotice });
      executions++;
      await hooks.after?.(stmt, result);
      if (!stmt.repeat || !result.affectedRows) break;
    }
  }
  return { statements: statements.length, executions, warnings };
}

export async function runMigrationFile(db, file, hooks) {
  return runMigration(db, readFileSync(file, "utf8"), hooks);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [dataDir, file] = process.argv.slice(2);
  if (!dataDir || !file) { console.error("ใช้: node run-migration.mjs <โฟลเดอร์ข้อมูล> <ไฟล์ .sql>"); process.exit(2); }
  const db = new PGlite(dataDir);
  const r = await runMigrationFile(db, file);
  console.log(`รันแล้ว ${r.statements} คำสั่ง (${r.executions} ครั้ง)`);
  for (const w of r.warnings) console.log("WARNING:", w);
  await db.close();
}
