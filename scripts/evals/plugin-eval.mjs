#!/usr/bin/env node
// รัน `claude plugin eval` กับ plugin ของ repo นี้ให้วัดได้จริง
// eval โหลด plugin ที่มี dependencies ไม่ขึ้นทั้งตัว (dependency-unsatisfied) รอบมี plugin จึงเป็น Claude เปล่า
// เสีย 35.39 ดอลลาร์ก่อนรู้ (2026-10-26) · สคริปต์นี้ทำสำเนาที่ลบ dependencies แล้วลอง 1 เคส trigger ก่อนรันทั้งชุด
//   node scripts/evals/plugin-eval.mjs <plugin> [--only <regex ชื่อเคส>] [--no-probe] [อาร์กิวเมนต์อื่นส่งต่อให้ claude plugin eval]
//   ตัวอย่าง: node scripts/evals/plugin-eval.mjs personal-life --only "^(flood-prep|estate-and-will)-" --max-cost-usd 5 -j 4
//   --only ใช้แทน --case ที่ไม่รับปีกกา · skill กลางของ superuser จะไม่อยู่ในรอบนั้น
import { cpSync, rmSync, readFileSync, writeFileSync, readdirSync, existsSync, mkdtempSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const args = process.argv.slice(2);
const plugin = args.shift();
const take = (flag) => { const i = args.indexOf(flag); return i < 0 ? null : args.splice(i, 2)[1] ?? ""; };
const only = take("--only");
// --only ที่ไม่มีค่าจะกลายเป็นรันทั้งชุดเงียบ ๆ และเสียเงิน จึงหยุดก่อน
if (only === "" || only?.startsWith("--")) { console.error("--only ต้องตามด้วย regex ชื่อเคส"); process.exit(2); }
const probe = !args.includes("--no-probe");
const rest = args.filter((a) => a !== "--no-probe");
const source = join(ROOT, "plugins", plugin ?? "");
if (!plugin || !existsSync(join(source, ".claude-plugin", "plugin.json"))) {
  console.error(`ไม่เจอ plugins/${plugin ?? "<plugin>"} · ใช้: node scripts/evals/plugin-eval.mjs <plugin> [--only <regex>] [--no-probe] [...]`);
  process.exit(2);
}

// สำเนาไร้ dependencies · ผลเก่าใน evals/results ไม่ติดไป · --only เหลือเฉพาะเคสที่ตรง
const copy = join(mkdtempSync(join(tmpdir(), "plugin-eval-")), plugin);
cpSync(source, copy, { recursive: true, filter: (p) => !p.replace(/\\/g, "/").includes("/evals/results") });
const manifest = join(copy, ".claude-plugin", "plugin.json");
const data = JSON.parse(readFileSync(manifest, "utf8"));
delete data.dependencies;
writeFileSync(manifest, JSON.stringify(data, null, 2));
const evalsDir = join(copy, "evals");
if (!existsSync(evalsDir)) { console.error(`plugins/${plugin} ไม่มีโฟลเดอร์ evals/`); process.exit(2); }
const cases = readdirSync(evalsDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
for (const c of cases) if (only && !new RegExp(only).test(c)) rmSync(join(evalsDir, c), { recursive: true, force: true });
const kept = cases.filter((c) => !only || new RegExp(only).test(c));
if (!kept.length) { console.error(`--only "${only}" ไม่ตรงเคสไหนเลย`); process.exit(2); }
console.log(`สำเนา: ${copy} · เคส ${kept.length}: ${kept.join(" ")}`);

// เรียก claude ตรง ไม่ผ่าน shell · path ชั่วคราวที่มีช่องว่างและ regex ใน --only จึงไม่ถูกตัด
const evalRun = (extra) => spawnSync("claude", ["plugin", "eval", copy, "--trust-plugin", "--no-publish", ...extra], { stdio: "inherit" }).status;

// ลอง 1 เคส trigger ก่อน: skill ต้องถูกเปิด ไม่งั้นทั้งชุดจะวัดอะไรไม่ได้
const trigger = kept.find((c) => c.endsWith("-trigger"));
if (probe && trigger) {
  const out = join(dirname(copy), "probe.json");
  evalRun(["--case", trigger, "--runs", "1", "--ablation", "none", "--max-cost-usd", "1", "--json", out]);
  const result = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")).cases?.[0] : null;
  // ดูจากชนิด grader ไม่ใช่ withOnly เพราะ --ablation none ทำให้ withOnly เป็น false (เจอตอนทดสอบ 2026-10-26)
  const toolGraders = new Set((result?.graders ?? []).filter((g) => g.type === "tool_used").map((g) => g.name));
  const opened = result?.arms?.with?.[0]?.graders?.some((g) => toolGraders.has(g.name) && g.passed);
  if (!opened) { console.error(`ลอง ${trigger} แล้ว skill ไม่ถูกเปิด · หยุดก่อนเสียเงินทั้งชุด · ดู trace ด้วย --keep-temp`); process.exit(1); }
  console.log(`ลอง ${trigger}: skill ถูกเปิด · รันทั้งชุดต่อ`);
}
process.exit(evalRun(rest) ?? 1);
