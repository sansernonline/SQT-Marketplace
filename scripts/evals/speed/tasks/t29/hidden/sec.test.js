import { test } from "node:test"; import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path"; import { tmpdir } from "node:os";
// domain ใหม่ (แก้ช่องโหว่) · path traversal · SQL injection · XSS
const m = await import(new URL("../src/handlers.mjs", import.meta.url)).catch(() => ({}));
const dir = mkdtempSync(join(tmpdir(), "t29-")), root = join(dir, "files");
mkdirSync(join(root, "sub"), { recursive: true }); writeFileSync(join(root, "note.txt"), "hello"); writeFileSync(join(root, "sub", "a.txt"), "a"); writeFileSync(join(dir, "secret.txt"), "SECRET");
const tryRead = (n) => { try { return m.readUserFile(root, n); } catch { return null; } };
test("อ่านไฟล์ปกติได้ รวมโฟลเดอร์ย่อย", () => { assert.equal(tryRead("note.txt"), "hello"); assert.equal(tryRead("sub/a.txt"), "a"); });
test("กัน ../ และ path เต็ม", () => { assert.equal(tryRead("../secret.txt"), null); assert.equal(tryRead(join(dir, "secret.txt")), null); assert.equal(tryRead("sub/../../secret.txt"), null); });
test("SQL ใช้ placeholder ไม่ต่อสตริง", () => {
  const q = m.buildUserQuery?.("x' OR '1'='1");
  assert.ok(q && !q.sql.includes("OR '1'='1") && q.sql.includes("?")); assert.deepEqual(q.params, ["x' OR '1'='1"]);
});
test("greeting escape HTML แต่ชื่อปกติเหมือนเดิม", () => {
  assert.equal(m.greeting?.("สมชาย"), "<p>สวัสดี สมชาย</p>");
  const h = m.greeting?.('<script>alert(1)</script>"'); assert.ok(h && !h.includes("<script>") && h.includes("&lt;script&gt;"));
});
