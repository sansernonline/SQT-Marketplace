// --self-test: ข้อความ commit ที่รู้ผลแน่ ข้อละ 1 กฎ · รันได้ทั้ง `node commit-msg-check.test.mjs` และ `node commit-msg-check.mjs --self-test`
import assert from "node:assert/strict";
import { check } from "./commit-msg-check.mjs";

const passes = (msg) => assert.deepEqual(check(msg), [], `ควรผ่าน: ${msg}`);
const breaks = (msg, word) => assert.ok(check(msg).some((b) => b.includes(word)), `ควรผิดเรื่อง "${word}": ${msg} → ${check(msg).join(" | ")}`);

const CASES = {
  "ไทยพร้อม scope ผ่าน": () => passes("feat(auth): เพิ่มล็อกอินด้วย LINE"),
  "อังกฤษไม่มี scope ผ่าน": () => passes("chore: update npm packages"),
  "breaking พร้อม footer ผ่าน": () => passes("feat(api)!: drop v1 endpoints\n\nBREAKING CHANGE: v1 ถูกลบ"),
  "body และ footer ผู้ร่วมเขียนผ่าน": () => passes("fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว\n\nเดิมเทียบด้วย < แทน <=\n\nCo-Authored-By: A <a@b.c>"),
  "revert ยาวได้": () => passes("revert: feat(auth): add user authentication with LINE and Google and Facebook"),
  "merge ที่ git เขียนเองข้าม": () => passes("Merge pull request #45 from x/y"),
  "type นอกรายการ": () => breaks("feature(auth): add login", "type"),
  "ไม่มี type": () => breaks("แก้ล็อกอิน", "ผิดรูป"),
  "scope misc": () => breaks("fix(misc): tidy things", "misc"),
  "subject เกิน 50": () => breaks(`docs: ${"ก".repeat(51)}`, "เกิน 50"),
  "ไทยมีวรรณยุกต์ 50 ตัวที่เห็นไม่เกิน": () => passes(`docs: ${"กี่".repeat(25)}`),
  "จุดท้าย": () => breaks("fix(login): resolve timeout.", "จุด"),
  "ขึ้นต้นตัวใหญ่": () => breaks("feat(auth): Add login", "ตัวเล็ก"),
  "รูปอดีต": () => breaks("feat(auth): added login", "รูปคำสั่ง"),
  "need ไม่ใช่รูปอดีต": () => passes("docs: need list for setup"),
  "WIP": () => breaks("feat(auth): WIP login", "ต้องห้าม"),
  "fix bug": () => breaks("fix: fix bug", "ต้องห้าม"),
  "รายชื่อไฟล์": () => breaks("fix: items.js and stock.js", "รายชื่อไฟล์"),
  "ไม่เว้นบรรทัดก่อน body": () => breaks("fix(a): b\nเหตุผล", "บรรทัดว่าง"),
  "body ยาวเกิน 3 บรรทัด": () => breaks("fix(a): b\n\n1\n2\n3\n4", "เกิน 3"),
  "body กว้างเกิน 72": () => breaks(`fix(a): b\n\n${"x".repeat(73)}`, "72"),
  "! ไม่มี footer ผ่าน (footer ไม่บังคับ)": () => passes("feat(api)!: drop v1"),
  "Revert ที่ git เขียนเองข้าม": () => passes("Revert \"feat(auth): add login with LINE and Google and Facebook accounts\"\n\nThis reverts commit abc1234."),
  "red และ shared ไม่ใช่รูปอดีต": () => { passes("fix(ui): red border on error"); passes("refactor: shared config for tests"); },
};

export function selfTest() {
  let failed = 0;
  for (const [name, fn] of Object.entries(CASES)) {
    try { fn(); console.log(`ผ่าน  ${name}`); } catch (e) { failed++; console.log(`ไม่ผ่าน ${name}\n  ${e.message}`); }
  }
  console.log(`self-test ${Object.keys(CASES).length - failed}/${Object.keys(CASES).length} ผ่าน`);
  if (failed) process.exitCode = 1;
}

if (process.argv[1]?.endsWith("commit-msg-check.test.mjs")) selfTest();
