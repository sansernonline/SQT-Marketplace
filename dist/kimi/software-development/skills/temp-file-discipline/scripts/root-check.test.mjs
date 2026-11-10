// --self-test: สร้างโปรเจกต์ปลอมใน os.tmpdir() แล้วลบทิ้งเมื่อจบ · รันได้ทั้ง `node root-check.test.mjs` และ `node root-check.mjs --self-test`
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { strays, codeFolderName } from "./root-check.mjs";

function project(entries, gitignore) {
  const dir = join(mkdtempSync(join(tmpdir(), "root-check-")), "Lumio - Light Meter");
  mkdirSync(dir);
  for (const e of entries) e.endsWith("/") ? mkdirSync(join(dir, e)) : writeFileSync(join(dir, e), "");
  if (gitignore) writeFileSync(join(dir, ".gitignore"), gitignore);
  return dir;
}

const dirs = [];
const make = (...a) => { const d = project(...a); dirs.push(d); return d; };

const CASES = {
  "ชื่อโฟลเดอร์โค้ดจากชื่อโปรเจกต์": () => assert.equal(codeFolderName("x/Lumio - Light Meter"), "lumio-light-meter"),
  "รากสะอาดผ่าน": () => assert.deepEqual(strays(make(["docs/", "ref/", "_to_delete/", "lumio-light-meter/", ".git/", "CLAUDE.md"])), []),
  "ไฟล์ชั่วคราวที่รากถูกจับ": () => assert.deepEqual(strays(make(["docs/", "out.log", "render-check/"])).sort(), ["out.log", "render-check/"]),
  "--allow เพิ่มชื่อได้": () => assert.deepEqual(strays(make(["README.md", "x.tmp"]), ["README.md"]), ["x.tmp"]),
  ".gitignore ระดับรากถูกยกเว้น": () => assert.deepEqual(strays(make(["node_modules/", "a.log", "b.txt"], "/node_modules/\n*.log\n# c\n!keep.log\nsrc/build\n")), ["b.txt"]),
  ".cache ไม่นับเป็น dotfile": () => assert.deepEqual(strays(make([".cache/", ".github/"])), [".cache/"]),
};

export function selfTest() {
  let failed = 0;
  for (const [name, fn] of Object.entries(CASES)) {
    try { fn(); console.log(`ผ่าน  ${name}`); } catch (e) { failed++; console.log(`ไม่ผ่าน ${name}\n  ${e.message}`); }
  }
  for (const d of dirs) rmSync(join(d, ".."), { recursive: true, force: true });
  console.log(`self-test ${Object.keys(CASES).length - failed}/${Object.keys(CASES).length} ผ่าน`);
  if (failed) process.exitCode = 1;
}

if (process.argv[1]?.endsWith("root-check.test.mjs")) selfTest();
