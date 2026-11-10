// --self-test: argument · วันที่ · การอ่าน log และการกันเขียนทับ · รันได้ทั้ง `node log-to-md.test.mjs` และ `node log-to-md.mjs --self-test`
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseArgs, readRows, toMarkdown } from "./log-to-md.mjs";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "log-to-md.mjs");
const run = (cwd, ...args) => {
  try { return { code: 0, out: execFileSync(process.execPath, [SCRIPT, ...args], { cwd, encoding: "utf8", stdio: "pipe" }) }; }
  catch (e) { return { code: e.status, out: String(e.stderr) }; }
};

const CASES = {
  "ไม่ใส่อะไรได้วันนี้": () => assert.equal(parseArgs([], "2026-10-28").day, "2026-10-28"),
  "รับวันที่ agent และ --out": () => assert.deepEqual(parseArgs(["2026-10-06", "--agent=dev", "--out"]), { day: "2026-10-06", only: "dev", out: true, force: false }),
  "argument แปลกถูกปฏิเสธ": () => assert.throws(() => parseArgs(["--bogus"]), /ไม่รู้จัก "--bogus"/),
  "วันที่ผิดรูปถูกปฏิเสธ": () => assert.throws(() => parseArgs(["2026-1-6"]), /ไม่รู้จัก/),
  "วันที่ไม่มีจริงถูกปฏิเสธ": () => assert.throws(() => parseArgs(["2026-02-30"]), /ไม่มีจริง/),
  "--force ต้องคู่กับ --out": () => assert.throws(() => parseArgs(["--force"]), /--out/),
  "อ่าน log หลายไฟล์ เรียงตามเวลา กรอง agent ได้"() {
    const dir = mkdtempSync(join(tmpdir(), "log-to-md-"));
    try {
      mkdirSync(join(dir, "2026-10-06"));
      writeFileSync(join(dir, "2026-10-06", "dev.jsonl"), '{"ts":"2026-10-06T10:00:02","agent":"dev","event":"tool","ok":true}\nไม่ใช่ JSON\n');
      writeFileSync(join(dir, "2026-10-06", "main.jsonl"), '{"ts":"2026-10-06T10:00:01","agent":"main","event":"review","result":"ผ่าน"}\n');
      assert.deepEqual(readRows(dir, "2026-10-06").map((r) => r.agent), ["main", "dev"]);
      assert.equal(readRows(dir, "2026-10-06", "dev").length, 1);
      assert.equal(readRows(dir, "2026-10-07"), null);
      assert.match(toMarkdown(readRows(dir, "2026-10-06"), "2026-10-06"), /2 รายการ · ล้มเหลว 0 · ผู้ใช้แก้ 0 · รอบตรวจ 1/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  },
  "--out ไม่เขียนทับไฟล์เดิมถ้าไม่ใส่ --force"() {
    const root = mkdtempSync(join(tmpdir(), "log-to-md-"));
    try {
      const log = join(root, ".claude", "superuser", "log");
      mkdirSync(join(log, "2026-10-06"), { recursive: true });
      writeFileSync(join(log, "2026-10-06", "main.jsonl"), '{"ts":"2026-10-06T10:00:01","agent":"main"}\n');
      writeFileSync(join(log, "2026-10-06.md"), "ของเดิม");
      const r = run(root, "2026-10-06", "--out");
      assert.equal(r.code, 1);
      assert.match(r.out, /--force/);
      assert.equal(readFileSync(join(log, "2026-10-06.md"), "utf8"), "ของเดิม");
      assert.equal(run(root, "2026-10-06", "--out", "--force").code, 0);
      assert.match(readFileSync(join(log, "2026-10-06.md"), "utf8"), /# SuperUser log/);
      assert.equal(run(root, "--bogus").code, 1, "argument แปลกจากบรรทัดคำสั่งต้อง exit 1");
    } finally { rmSync(root, { recursive: true, force: true }); }
  },
};

export function selfTest() {
  let failed = 0;
  for (const [name, fn] of Object.entries(CASES)) {
    try { fn(); console.log(`ผ่าน  ${name}`); } catch (e) { failed++; console.log(`ไม่ผ่าน ${name}\n  ${e.message}`); }
  }
  console.log(`self-test ${Object.keys(CASES).length - failed}/${Object.keys(CASES).length} ผ่าน`);
  if (failed) process.exitCode = 1;
}

if (process.argv[1]?.endsWith("log-to-md.test.mjs")) selfTest();
