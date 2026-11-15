// --self-test: ชื่อถูก ชื่อผิด และการเปลี่ยนชื่อในโฟลเดอร์ชั่วคราว (รวมชื่อที่ต่างแค่ตัวพิมพ์)
// รันได้ทั้ง `node doc-name-check.test.mjs` และ `node doc-name-check.mjs --self-test`
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, existsSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkName, applyPlan } from "./doc-name-check.mjs";

const GOOD = [
  "ACME-QUOTE-v1.2-APPROVED.docx", "ACME-REPORT-sales-v0.3-DRAFT.docx", "ACME-QUOTE-v1.2-APPROVED-2026-09-25.docx",
  "IPORT-SRS-v2.10-REVIEW.pdf", "X1-DECK-q3-plan-v1.0-DRAFT.pptx", "docs/guide-onboarding.md",
  "docs/meetings/2026-09-25-kickoff.md", "README.md", "skills/x/SKILL.md", "docs/BUILD-PLAN.md", "site/index.md", ".claude/superuser/CONTEXT.md",
];
// [ชื่อผิด, ชื่อที่ควรเสนอ (null = ตั้งเองเพราะชิ้นไม่พอหรือเป็นไทย)]
const BAD = [
  ["final.docx", null],
  ["ใบเสนอราคา แก้แล้ว.docx", null],
  ["acme-quote-v1.2-approved.docx", "ACME-QUOTE-v1.2-APPROVED.docx"],
  ["ACME_REPORT_sales_v1_final.docx", "ACME-REPORT-sales-v1.0-DRAFT.docx"],
  ["ACME-QUOTE-1.2-DRAFT-25-09-2026.docx", "ACME-QUOTE-v1.2-DRAFT-2026-09-25.docx"],
  ["ACME-QUOTE-v1.2-DRAFT-2026-02-30.docx", "ACME-QUOTE-v1.2-DRAFT-2026-02-30.docx"],
  ["ACME QUOTE.pdf", "ACME-QUOTE-v0.1-DRAFT.pdf"],
  ["docs/Spec-v2.md", null],
];

const CASES = {
  "ชื่อถูกทุกชื่อผ่าน"() {
    for (const n of GOOD) assert.ok(checkName(n).ok, `ควรผ่าน: ${n} → ${checkName(n).problems}`);
  },
  "ชื่อผิดทุกชื่อถูกจับ และเสนอชื่อตามคาด"() {
    for (const [n, want] of BAD) {
      const r = checkName(n);
      assert.ok(!r.ok, `ควรผิด: ${n}`);
      if (want !== null || !n.endsWith(".md")) assert.equal(r.suggest, want, `ชื่อเสนอของ ${n}`);
    }
  },
  "md มีเวอร์ชันในชื่อเสนอชื่อไม่มีเวอร์ชัน": () => assert.equal(checkName("docs/Spec-guide-v2.md").suggest, "spec-guide.md"),
  "ไฟล์ที่ไม่ใช่เอกสารข้าม": () => assert.ok(checkName("logo.png").skipped),
  "apply เปลี่ยนชื่อ แต่ไม่แตะ APPROVED และไม่ทับไฟล์ที่มีอยู่"() {
    const dir = mkdtempSync(join(tmpdir(), "doc-name-"));
    try {
      for (const n of ["acme quote.docx", "ACME-QUOTE-v1.0-APPROVED copy.docx", "acme-report.docx", "ACME-REPORT-v0.1-DRAFT.docx"]) writeFileSync(join(dir, n), "");
      const skipped = applyPlan([
        { from: join(dir, "acme quote.docx"), to: "ACME-QUOTE-v0.1-DRAFT.docx" },
        { from: join(dir, "ACME-QUOTE-v1.0-APPROVED copy.docx"), to: "ACME-QUOTE-v1.0-APPROVED.docx" },
        { from: join(dir, "acme-report.docx"), to: "ACME-REPORT-v0.1-DRAFT.docx" },
      ]);
      assert.ok(existsSync(join(dir, "ACME-QUOTE-v0.1-DRAFT.docx")), "ไฟล์แรกต้องถูกเปลี่ยนชื่อ");
      assert.ok(existsSync(join(dir, "ACME-QUOTE-v1.0-APPROVED copy.docx")), "APPROVED ต้องไม่ถูกแตะ");
      assert.ok(existsSync(join(dir, "acme-report.docx")), "ชื่อปลายทางมีอยู่แล้ว ต้องไม่ทับ");
      assert.equal(skipped.length, 2);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  },
  "ชื่อที่ต่างแค่ตัวพิมพ์เปลี่ยนได้ (Windows ไม่แยกตัวพิมพ์)"() {
    const dir = mkdtempSync(join(tmpdir(), "doc-name-case-"));
    try {
      writeFileSync(join(dir, "acme-QUOTE-v0.1-DRAFT.docx"), "x");
      const skipped = applyPlan([{ from: join(dir, "acme-QUOTE-v0.1-DRAFT.docx"), to: "ACME-QUOTE-v0.1-DRAFT.docx" }]);
      assert.deepEqual(skipped, []);
      assert.deepEqual(readdirSync(dir), ["ACME-QUOTE-v0.1-DRAFT.docx"]);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  },
};

export function selfTest() {
  let failed = 0;
  for (const [name, fn] of Object.entries(CASES)) {
    try { fn(); console.log(`ผ่าน  ${name}`); } catch (e) { failed++; console.log(`ไม่ผ่าน ${name}\n  ${e.message}`); }
  }
  console.log(`self-test ${Object.keys(CASES).length - failed}/${Object.keys(CASES).length} ผ่าน (ชื่อถูก ${GOOD.length} ชื่อผิด ${BAD.length})`);
  if (failed) process.exitCode = 1;
}

if (process.argv[1]?.endsWith("doc-name-check.test.mjs")) selfTest();
