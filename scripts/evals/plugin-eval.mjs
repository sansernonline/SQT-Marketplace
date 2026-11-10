#!/usr/bin/env node
// รัน `claude plugin eval` กับ plugin ของ repo นี้ให้วัดได้จริง
// eval โหลด plugin ที่มี dependencies ไม่ขึ้นทั้งตัว (dependency-unsatisfied) รอบมี plugin จึงเป็น Claude เปล่า
// เสีย 35.39 ดอลลาร์ก่อนรู้ (2026-10-26) · สคริปต์นี้ทำสำเนาที่ลบ dependencies แล้วลอง 1 เคส trigger ก่อนรันทั้งชุด
//   node scripts/evals/plugin-eval.mjs <plugin> [--only <regex ชื่อเคส>] [--no-probe] [--no-scaffold] [อาร์กิวเมนต์อื่นส่งต่อให้ claude plugin eval]
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
const noScaffold = args.includes("--no-scaffold");   // ของตัวรันนี้ ไม่ส่งต่อ: claude plugin eval ไม่ได้ระบุ flag นี้ในเอกสาร
const rest = args.filter((a) => a !== "--no-probe" && a !== "--no-scaffold");
const source = join(ROOT, "plugins", plugin ?? "");
if (!plugin || !existsSync(join(source, ".claude-plugin", "plugin.json"))) {
  console.error(`ไม่เจอ plugins/${plugin ?? "<plugin>"} · ใช้: node scripts/evals/plugin-eval.mjs <plugin> [--only <regex>] [--no-probe] [--no-scaffold] [...]`);
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

// เคสที่มี scaffold_script ต้องรันด้วย --scaffold ไม่งั้นโฟลเดอร์ที่รันว่างและเคสตก 0 ทั้ง 2 แขน (no-ai-look 2026-11-09)
// สคริปต์อยู่ใน plugins/ ของ repo นี้และผ่าน PR แล้ว จึงเปิดให้เอง · ไม่อยากรัน → ส่ง --no-scaffold
const scaffolded = kept.filter((c) => /^\s*scaffold_script:/m.test(readFileSync(join(evalsDir, c, "case.yaml"), "utf8")));
if (scaffolded.length && !rest.includes("--scaffold") && !noScaffold) {
  rest.push("--scaffold");
  console.log(`เปิด --scaffold ให้ ${scaffolded.length} เคส: ${scaffolded.join(" ")}`);
}

// เครื่องมือที่ claude plugin eval กันไว้ต้องให้ด้วย --allow-tools แม้เคสใส่ไว้ใน allowed_tools แล้ว
// --allow-tools เป็นของทั้งรัน ไม่ใช่ต่อเคส: รันรวมหลายเคส เคสที่ไม่ได้ขอก็ได้เครื่องมือเหล่านี้ด้วย · อยากแยกให้รันเคสที่ขอด้วย --only
// ไม่ส่ง → agent ตอบว่าเปิดเว็บหรือเขียนไฟล์ไม่ได้ (design-references ตกทุกรอบ eval 2026-11-09 · ส่งแล้วค้นเว็บได้จริง)
const GATED = /^(Bash|Write|Edit|MultiEdit|NotebookEdit|WebFetch|WebSearch|mcp__\S+)$/;
export const gatedTools = (yamlTexts) => [...new Set(yamlTexts.flatMap((y) => {
  const m = y.match(/^\s*allowed_tools:\s*\[([^\]]*)\]/m);
  return m ? m[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")) : [];
}).filter((t) => GATED.test(t)))];
const gated = gatedTools(kept.map((c) => readFileSync(join(evalsDir, c, "case.yaml"), "utf8")));
if (gated.length && !rest.includes("--allow-tools")) {
  rest.push("--allow-tools", ...gated);
  console.log(`ให้เครื่องมือที่ถูกกันไว้ตาม allowed_tools ของเคส: ${gated.join(" ")}`);
}

// เรียก claude ตรง ไม่ผ่าน shell · path ชั่วคราวที่มีช่องว่างและ regex ใน --only จึงไม่ถูกตัด
const evalRun = (extra) => spawnSync("claude", ["plugin", "eval", copy, "--trust-plugin", "--no-publish", ...extra], { stdio: "inherit" }).status;

// ลอง 1 เคส trigger ก่อน: skill ต้องถูกเปิด ไม่งั้นทั้งชุดจะวัดอะไรไม่ได้
// ข้าม -no-trigger ที่ลงท้ายเหมือนกัน: เคสนั้นผ่านเมื่อ skill ไม่ถูกเปิด การลองจึงไม่ได้วัดอะไร (เจอ 2026-11-09)
const trigger = kept.find((c) => c.endsWith("-trigger") && !c.endsWith("-no-trigger"));
if (probe && trigger) {
  const out = join(dirname(copy), "probe.json");
  evalRun(["--case", trigger, "--runs", "1", "--ablation", "none", "--max-cost-usd", "1", "--json", out, ...(gated.length ? ["--allow-tools", ...gated] : [])]);
  const result = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")).cases?.[0] : null;
  // ดูจากชนิด grader ไม่ใช่ withOnly เพราะ --ablation none ทำให้ withOnly เป็น false (เจอตอนทดสอบ 2026-10-26)
  const toolGraders = new Set((result?.graders ?? []).filter((g) => g.type === "tool_used").map((g) => g.name));
  const opened = result?.arms?.with?.[0]?.graders?.some((g) => toolGraders.has(g.name) && g.passed);
  if (!opened) { console.error(`ลอง ${trigger} แล้ว skill ไม่ถูกเปิด · หยุดก่อนเสียเงินทั้งชุด · ดู trace ด้วย --keep-temp`); process.exit(1); }
  console.log(`ลอง ${trigger}: skill ถูกเปิด · รันทั้งชุดต่อ`);
}
process.exit(evalRun(rest) ?? 1);
