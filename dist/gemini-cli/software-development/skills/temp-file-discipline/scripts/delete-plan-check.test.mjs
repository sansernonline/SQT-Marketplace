// --self-test: โปรเจกต์ปลอมใน os.tmpdir() · ตรวจว่าพาธนอก _to_delete/ ถูกปฏิเสธ และไม่มีอะไรถูกลบ
// รันได้ทั้ง `node delete-plan-check.test.mjs` และ `node delete-plan-check.mjs --self-test`
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkPlan } from "./delete-plan-check.mjs";

const root = mkdtempSync(join(tmpdir(), "delete-plan-"));
const td = join(root, "_to_delete");
mkdirSync(join(td, "render-check"), { recursive: true });
mkdirSync(join(td, "keep-me"));
mkdirSync(join(root, "docs"));
writeFileSync(join(td, "out.log"), "");
writeFileSync(join(root, "docs", "report.docx"), "");

const plan = (text, name = "delete-plan.txt", dir = td) => { const f = join(dir, name); writeFileSync(f, text); return checkPlan(f); };

const CASES = {
  "แผนในขอบเขตผ่าน และบอกรายการเก็บ"() {
    const r = plan("# ลบ\n_to_delete/render-check\n_to_delete/out.log\n\n");
    assert.deepEqual(r.errors, []);
    assert.deepEqual(r.remove.map((x) => x.kind), ["โฟลเดอร์", "ไฟล์"]);
    assert.deepEqual(r.keep, ["keep-me"]);
  },
  "พาธนอก _to_delete/ ถูกปฏิเสธ": () => assert.equal(plan("docs/report.docx").errors.length, 1),
  "หนีด้วย .. ถูกปฏิเสธ": () => assert.equal(plan("_to_delete/../docs").errors.length, 1),
  "พาธเต็มนอกโปรเจกต์ถูกปฏิเสธ": () => assert.equal(plan(tmpdir()).errors.length, 1),
  "ลบทั้ง _to_delete/ ถูกปฏิเสธ (ให้ลงทีละรายการ)": () => assert.equal(plan("_to_delete").errors.length, 1),
  "แผนที่ไม่ได้อยู่ใน _to_delete/ ถูกปฏิเสธ": () => assert.equal(plan("_to_delete/out.log", "plan.txt", root).errors.length, 1),
  "ลิงก์ใน _to_delete/ ที่ชี้ออกไปข้างนอกถูกปฏิเสธ"() {
    try { symlinkSync(join(root, "docs"), join(td, "link"), "junction"); } catch { return console.log("  (ข้าม: เครื่องนี้สร้างลิงก์ไม่ได้)"); }
    assert.equal(plan("_to_delete/link").errors.length, 1);
  },
  "สคริปต์ไม่ลบอะไรเอง": () => assert.ok(existsSync(join(td, "render-check")) && existsSync(join(root, "docs", "report.docx"))),
};

export function selfTest() {
  let failed = 0;
  for (const [name, fn] of Object.entries(CASES)) {
    try { fn(); console.log(`ผ่าน  ${name}`); } catch (e) { failed++; console.log(`ไม่ผ่าน ${name}\n  ${e.message}`); }
  }
  rmSync(root, { recursive: true, force: true });
  console.log(`self-test ${Object.keys(CASES).length - failed}/${Object.keys(CASES).length} ผ่าน`);
  if (failed) process.exitCode = 1;
}

if (process.argv[1]?.endsWith("delete-plan-check.test.mjs")) selfTest();
