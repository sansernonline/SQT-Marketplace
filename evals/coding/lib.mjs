// lib.mjs — ตัวช่วยที่ check.mjs ของทุกงานใช้ร่วมกัน
import { spawn } from "node:child_process";
import { cpSync, mkdtempSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

export const WIN = process.platform === "win32";
export const PY = WIN ? "python" : "python3";

// Windows ต้องผ่าน cmd.exe จึงจะเจอ npm.cmd · claude.cmd · แต่ cmd ต่อ argument ด้วยช่องว่างเฉย ๆ → ห่อด้วย "" เองเมื่อมีช่องว่างหรือตัวพิเศษ
// ข้อความยาวหรือหลายบรรทัด (prompt) ห้ามส่งเป็น argument ให้ส่งทาง opts.input (stdin) แทน
// argument ที่มี " หรือ % ห้ามใช้บน Windows (cmd แปลความเอง) → ส่งทาง stdin หรือไฟล์แทน
const quote = (a) => (/[\s"&|<>^()%!]/.test(a) ? `"${String(a).replace(/"/g, '\\"')}"` : a);

/** รันคำสั่ง คืน { code, out, err, ms } · ไม่ throw · opts.input = ข้อความที่ส่งเข้า stdin */
export function run(cmd, argv, opts = {}) {
  return new Promise((done) => {
    const t0 = Date.now();
    const { input, ...rest } = opts;
    const p = spawn(cmd, WIN ? argv.map(quote) : argv, { ...rest, shell: WIN, stdio: [input == null ? "ignore" : "pipe", "pipe", "pipe"], env: { ...process.env, ...(opts.env ?? {}) } });
    if (input != null) { p.stdin.on("error", () => {}); p.stdin.end(input); }
    let out = "", err = "";
    p.stdout.on("data", (d) => (out += d)); p.stderr.on("data", (d) => (err += d));
    p.on("error", (e) => done({ code: -1, out, err: err + String(e), ms: Date.now() - t0 }));
    p.on("close", (code) => done({ code, out, err, ms: Date.now() - t0 }));
  });
}

/** คัดลอกงานไปโฟลเดอร์ชั่วคราว แล้ววาง hidden/ ทับที่ปลายทาง (ค่าเริ่ม = ราก) · node_modules คัดลอกด้วยถ้ามี เพื่อไม่ต้องลงใหม่ */
export function prepare(dir, hiddenDir, into = "") {
  const tmp = mkdtempSync(join(tmpdir(), "coding-eval-"));
  // bin/ obj/ คือผล build ของ .NET · ข้ามเฉพาะที่อยู่นอก node_modules (ใน node_modules มี bin ของ tsc · esbuild)
  cpSync(dir, tmp, { recursive: true, filter: (s) => {
    const rel = s.slice(dir.length);
    return !/[\\/](\.git|\.claude|_to_delete)([\\/]|$)/.test(rel) && (/node_modules/.test(rel) || !/[\\/](bin|obj)([\\/]|$)/.test(rel));
  } });
  if (hiddenDir && existsSync(hiddenDir)) cpSync(hiddenDir, join(tmp, into), { recursive: true });
  return tmp;
}

export function cleanup(tmp) { try { rmSync(tmp, { recursive: true, force: true }); } catch { /* ช่างมัน */ } }

/** ลง package ของ Node ถ้ายังไม่มี node_modules */
export async function npmInstall(dir) {
  if (existsSync(join(dir, "node_modules"))) return { code: 0, out: "", err: "" };
  return run("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error"], { cwd: dir });
}

export function parsePytest(out) {
  const n = (re) => Number(re.exec(out)?.[1] ?? 0);
  const pass = n(/(\d+) passed/), fail = n(/(\d+) failed/) + n(/(\d+) errors?/);
  return { pass, total: pass + fail };
}

export function parseNodeTest(out) {
  const pass = Number(/# pass (\d+)/.exec(out)?.[1] ?? 0), fail = Number(/# fail (\d+)/.exec(out)?.[1] ?? 0);
  return { pass, total: pass + fail };
}

/** ผลของ dotnet test: "Passed!  - Failed: 0, Passed: 6, Skipped: 0, Total: 6" หรือ "Failed!  - Failed: 2, Passed: 4, ..." */
export function parseDotnet(out) {
  const m = /Failed:\s*(\d+),\s*Passed:\s*(\d+),\s*Skipped:\s*(\d+),\s*Total:\s*(\d+)/.exec(out);
  return m ? { pass: Number(m[2]), total: Number(m[4]) } : { pass: 0, total: 0 };
}

/** ใช้ท้าย check.mjs: `node check.mjs <dir>` พิมพ์ผลเป็น JSON */
export async function cli(meta, check) {
  if (!process.argv[1] || !meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop())) return;
  const dir = process.argv[2];
  if (!dir) { console.error("ใช้: node check.mjs <โฟลเดอร์งาน>"); process.exit(2); }
  const r = await check(dir);
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.pass === r.total && r.total > 0 && r.clean ? 0 : 1);
}
