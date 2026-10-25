// c3-angular-signup-form — ตรวจช่องเบอร์มือถือไทยในฟอร์มสมัครสมาชิก
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { existsSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync } from "node:fs";
import { prepare, cleanup, npmInstall, run, parseNodeTest, cli } from "../../lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ANY = /:\s*any\b|\bas\s+any\b|[<,]\s*any\b/;

function tsFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return tsFiles(p);
    return /\.tsx?$/.test(name) ? [p] : [];
  });
}

// คัดลอก node_modules ทั้งก้อนช้า
// ถ้างานมี node_modules อยู่แล้ว ให้ชี้ไปที่ของเดิมแทน (junction ใช้ได้บน Windows โดยไม่ต้องเป็น admin) · ถ้าไม่มีก็ลงใหม่
async function linkOrInstall(dir, tmp) {
  const own = join(resolve(dir), "node_modules");
  rmSync(join(tmp, "node_modules"), { recursive: true, force: true });
  if (existsSync(own)) { symlinkSync(own, join(tmp, "node_modules"), "junction"); return { code: 0, err: "" }; }
  return npmInstall(tmp);
}

export async function check(dir) {
  const tmp = prepare(dir, join(HERE, "hidden"));
  try {
    const inst = await linkOrInstall(dir, tmp);
    if (inst.code !== 0) return { pass: 0, total: 1, clean: false, cleanNote: "npm install ล้ม: " + inst.err.slice(0, 300), metrics: {} };

    const t = await run("node", ["--import", "tsx", "--test", "--test-reporter=tap", "test/hidden-phone.test.ts"], { cwd: tmp });
    const { pass, total } = parseNodeTest(t.out);

    const tsc = await run("node", [join("node_modules", "typescript", "bin", "tsc"), "--noEmit", "-p", "tsconfig.json"], { cwd: tmp });
    const tscErrors = (tsc.out.match(/error TS\d+/g) ?? []).length + (tsc.code !== 0 && !/error TS/.test(tsc.out) ? 1 : 0);

    const anyLines = tsFiles(join(tmp, "src")).flatMap((f) =>
      readFileSync(f, "utf8").split(/\r?\n/).filter((line) => ANY.test(line)).map((line) => line.trim()));

    const notes = [];
    if (tscErrors > 0) notes.push(`tsc มี error ${tscErrors} จุด`);
    if (anyLines.length > 0) notes.push(`ยังใช้ any ใน src ${anyLines.length} บรรทัด`);

    return {
      pass, total,
      clean: notes.length === 0,
      cleanNote: notes.join(" · "),
      metrics: { tsc_errors: tscErrors, explicit_any: anyLines.length, test_ms: t.ms },
    };
  } finally {
    cleanup(tmp);
  }
}

cli(import.meta, check);
