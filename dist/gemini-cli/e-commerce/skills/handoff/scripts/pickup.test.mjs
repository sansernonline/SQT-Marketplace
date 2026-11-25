import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { buildCard, draftCard, archive, countClosed } from "./pickup.mjs";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "pickup.mjs");
const tmp = () => mkdtempSync(join(tmpdir(), "pickup-"));

// รูปร่างเหมือน CONTEXT.md จริง: 16 ข้อ · ปิด/เสร็จ/(เดิม) ปนกัน (เนื้อหาสมมติ)
function fixture() {
  const items = [];
  for (let i = 1; i <= 16; i++) {
    if (i % 4 === 0) items.push(`- **(ปิด 2026-11-0${i % 9}) ข้อ ${i}:** จบแล้ว\n  - รายละเอียดของข้อ ${i}`);
    else if (i % 4 === 1 && i > 8) items.push(`- (เดิม) ข้อ ${i} ของรอบก่อน`);
    else if (i === 6) items.push(`- **งาน ข้อ ${i} (เสร็จ):** เสร็จแล้ว`);
    else items.push(`- **ข้อ ${i} (กำลังทำ):** ยังไม่ปิด ต่อไป: ทำต่อ (ไม่ปิดงานนี้ในเนื้อความ)`);
  }
  return `## ความคืบหน้า\n- **ปิด:** แถวนี้ไม่ใช่ของ รับงานต่อ\n\n## รับงานต่อ\n${items.join("\n")}\n\n## ไฟล์อื่น\n- **เสร็จ** ต้องไม่โดนแตะ\n`;
}

test("buildCard: รูปแบบการ์ด + ตัดไฟล์เกิน 15", () => {
  const files = Array.from({ length: 17 }, (_, i) => `f${i}.js`);
  const c = buildCard({ date: "2026-11-25", branch: "main", files, lastCommit: "fix x" });
  assert.match(c, /^- \*\*2026-11-25 main \(กำลังทำ\):\*\* f0\.js, /);
  assert.ok(c.includes("f14.js, +2 more"));
  assert.ok(!c.includes("f15.js"));
  assert.ok(c.endsWith(" · last commit: fix x · ต่อไป: (รอยืนยัน)"));
});

test("buildCard/draftCard: ไม่ใช่ git → ไม่ใช่ git", () => {
  assert.ok(buildCard({ date: "d", branch: "-", files: null, lastCommit: "" }).includes("ไม่ใช่ git"));
  const d = tmp();
  try {
    const out = spawnSync("node", [SCRIPT, "draft", "--root", d], { encoding: "utf8" }).stdout;
    // tmp อาจอยู่ใต้ repo ของเครื่อง จึงตรวจแค่รูปแบบเมื่อไม่ใช่ git
    assert.match(out, /^- \*\*\d{4}-\d{2}-\d{2} .+ \(กำลังทำ\):\*\* /);
    assert.ok(typeof draftCard(d) === "string");
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("archive: ย้ายข้อที่ปิด · ส่วนอื่นไม่แตะ · รันซ้ำไม่ย้ายเพิ่ม", () => {
  const d = tmp();
  try {
    const ctx = join(d, "CONTEXT.md");
    const src = fixture();
    writeFileSync(ctx, src);
    assert.equal(countClosed(src), 7);
    const r1 = spawnSync("node", [SCRIPT, "archive", "--context", ctx], { encoding: "utf8" });
    assert.equal(r1.stdout.trim(), "ย้าย 7 รายการ · เหลือ 9 รายการ");
    const after = readFileSync(ctx, "utf8");
    assert.ok(after.startsWith("## ความคืบหน้า\n- **ปิด:** แถวนี้ไม่ใช่ของ รับงานต่อ"));
    assert.ok(after.endsWith("## ไฟล์อื่น\n- **เสร็จ** ต้องไม่โดนแตะ\n"));
    assert.ok(!after.includes("รายละเอียดของข้อ 4"));
    assert.ok(after.includes("ข้อ 1 (กำลังทำ)"));
    const arch = readFileSync(join(d, "CONTEXT-archive.md"), "utf8");
    assert.match(arch, /^## \d{4}-\d{2}-\d{2}\n- \*\*\(ปิด/);
    assert.ok(arch.includes("  - รายละเอียดของข้อ 4"));
    assert.ok(arch.includes("- (เดิม) ข้อ 9"));
    const r2 = spawnSync("node", [SCRIPT, "archive", "--context", ctx], { encoding: "utf8" });
    assert.equal(r2.stdout.trim(), "ย้าย 0 รายการ · เหลือ 9 รายการ");
    assert.equal(readFileSync(ctx, "utf8"), after);
    assert.equal(readFileSync(join(d, "CONTEXT-archive.md"), "utf8"), arch);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("countClosed: ปิดบางส่วน · ยังไม่เสร็จ · ยังไม่ปิด ไม่นับว่าปิด", () => {
  const src = "## รับงานต่อ\n- **(ปิดบางส่วน 2026-11-18):** a\n- **งาน x (ยังไม่เสร็จ):** b\n- **งาน y ยังไม่ปิด:** c\n- **งาน z (เสร็จ):** d\n\n## ไฟล์อื่น\n";
  assert.equal(countClosed(src), 1);
});

test("countClosed: ปิด/เสร็จ กลางประโยค หรือมี ติด/ทำอยู่ ยังเปิด (เคสจาก reviewer)", () => {
  const open = ["**แก้ hook ให้เสร็จก่อนวันศุกร์ (ทำอยู่):**", "**รอปิดงานกับลูกค้า**", "**ต้องทำให้เสร็จ**", "**เสร็จแล้วรอ merge (ติด)**", "**ปิด PR ของ x (ทำอยู่)**"];
  const src = `## รับงานต่อ\n${open.map((h) => `- ${h} x`).join("\n")}\n- **งาน a (ปิด · A 6):** y\n- **งาน b (เสร็จ 2026-11-23):** z\n`;
  assert.equal(countClosed(src), 2);
});

test("archive: archive() ต่อท้ายใต้หัววันที่เดิมไม่ซ้ำหัว", () => {
  const d = tmp();
  try {
    const ctx = join(d, "CONTEXT.md");
    writeFileSync(ctx, "## รับงานต่อ\n- **(ปิด) a**\n- **b**\n");
    archive(ctx, "2026-11-25");
    writeFileSync(ctx, "## รับงานต่อ\n- **(เสร็จ) c**\n- **b**\n");
    archive(ctx, "2026-11-25");
    const arch = readFileSync(join(d, "CONTEXT-archive.md"), "utf8");
    assert.equal(arch, "## 2026-11-25\n- **(ปิด) a**\n- **(เสร็จ) c**\n");
  } finally { rmSync(d, { recursive: true, force: true }); }
});
