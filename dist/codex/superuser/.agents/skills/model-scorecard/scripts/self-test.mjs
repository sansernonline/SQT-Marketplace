// --self-test: log จำลองใน tmp 2 โปรเจกต์ → ตรวจตัวเลขในรายงาน การรวมโปรเจกต์ และว่าไม่เขียนลงโปรเจกต์ที่อ่าน
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { buildReport } from "./report.mjs";

const SCORECARD = join(dirname(fileURLToPath(import.meta.url)), "scorecard.mjs");
const PRICES = { checked: "test", source: "test", per_mtok: { sonnet: { input: 3, output: 15, cache_read: 0.3, cache_write: 3.75 }, opus: { input: 15, output: 75, cache_read: 1.5, cache_write: 18.75 } } };
const TOKENS = { input: 100, output: 1000, cacheRead: 5000, cacheCreate: 0 };

const at = (minute) => `2026-10-20T10:${String(minute).padStart(2, "0")}:00+07:00`;
const run = (minute, session, role, step, extra = {}) => ({ ts: at(minute), session, event: "run", role, model: "sonnet", lead_model: "claude-opus-5-5", step, tokens: TOKENS, duration_ms: 120000, ...extra });
const review = (minute, session, verdict, round) => run(minute, session, "superuser:reviewer", "review", { model: "opus", verdict, round });

function makeProject(root, name, days) {
  const log = join(root, name, ".claude", "superuser", "log");
  for (const [day, files] of Object.entries(days)) {
    mkdirSync(join(log, day), { recursive: true });
    for (const [file, content] of Object.entries(files)) writeFileSync(join(log, day, file), typeof content === "string" ? content : content.map((l) => JSON.stringify(l)).join("\n") + "\n");
  }
  return [name, log];
}

const spawnLine = { ts: at(5), session: "s9", event: "PostToolUse", agent: "main", model: null, tool: "Agent", target: "Fix bug in login", role: "software-company:developer", role_model: null, spawned_id: "x1" };
const oldDay = { "main.jsonl": [spawnLine, { ts: at(6), session: "s9", event: "UserPromptSubmit", model: "claude-opus-5-5", prompt: "ok" }], "tokens.json": JSON.stringify({ "software-company:developer": { input: 10, output: 20, cacheRead: 30, cacheCreate: 0 } }) };
const newDay = [
  run(0, "s1", "software-company:developer", "code"),
  { ...review(1, "s1", null, null), async: true, spawned_id: "r1", duration_ms: null },
  { ts: at(3), session: "s1", event: "result", spawned_id: "r1", verdict: "pass", round: 1 },
  { ts: at(4), session: "s1", event: "feedback", user_feedback: "accept" },
  run(10, "s2", "software-company:developer", "code"),
  review(11, "s2", "fail", 1),
  review(13, "s2", "pass", 2),
  { ts: at(14), session: "s2", event: "feedback", user_feedback: "reject" },
];

export async function selfTest() {
  const root = mkdtempSync(join(tmpdir(), "scorecard-"));
  const a = makeProject(root, "proj-a", { "2026-10-20": { "runs.jsonl": newDay }, "2026-10-19": oldDay });
  const b = makeProject(root, "proj-b", { "2026-10-20": { "runs.jsonl": [run(0, "s1", "software-company:developer", "code")] } });
  const report = buildReport([a], PRICES);
  const lines = (dir) => readdirSync(dir, { recursive: true }).sort().join();
  const before = lines(join(root, "proj-a"));
  const out = join(root, "out", "rollup.md");
  const cli = (...args) => spawnSync(process.execPath, [SCORECARD, ...args], { encoding: "utf8" });
  const rollup = cli("--rollup", join(root, "proj-a"), join(root, "proj-b"), "--out", out);
  const inside = cli("--rollup", join(root, "proj-a"), "--out", join(root, "proj-a", "r.md"));
  const relative = spawnSync(process.execPath, [SCORECARD, "--rollup", "./proj-a", "--out", "./PROJ-A/r.md"], { encoding: "utf8", cwd: root });
  const cases = [
    ["นับงานต่อ model × ขั้น", report.includes("| sonnet | code | 2 |")],
    ["ผ่านรอบแรก 1 ใน 2 (รอบ 2 ผูกกับงานเดิม)", report.includes("50% (1/2)")],
    ["รอบแก้เฉลี่ย 0.5 (1 รอบแก้ใน 2 งาน)", report.includes("| 0.5 |")],
    ["ผู้ใช้รับ 1 ปฏิเสธ 1 ผูกกับงานไม่ใช่ผู้ตรวจ", report.includes("| 1/1 |")],
    ["ค่าใช้จ่ายรวม 2 งาน = $0.03", report.includes("$0.03")],
    ["คะแนนความคุ้ม = 0.5 ÷ 0.0168 = 29.76", report.includes("29.76")],
    ["เวลาของงานเบื้องหลังได้จากเวลาผลส่งกลับ (2.0 นาที)", report.includes("| 2.0 นาที |")],
    ["วันเก่าไม่มี runs.jsonl → แถวหยาบ inherit + ป้าย", report.includes("| inherit (claude-opus-5-5) | code | 1 |") && report.includes("1 วันไม่มี runs.jsonl")],
    ["token ของวันเก่าเป็นค่าประมาณ (~)", report.includes("~")],
    ["ตัวอย่างน้อยกว่า 5 ติดป้ายทุกแถว", report.split("\n").filter((l) => l.startsWith("| ") && !l.startsWith("| model") && !l.includes("ตัวอย่างน้อย")).length === 0],
    ["ไม่มีราคา → ยังไม่มีราคา", buildReport([a], null).includes("ยังไม่มีราคา")],
    ["ข้อสังเกตครบ 3 ข้อ", (report.match(/^\d\. /gm) ?? []).length === 3],
    ["log ว่าง → บอกว่ายังไม่มีงาน", buildReport([["x", join(root, "none")]], PRICES).includes("ยังไม่มีงานลูกทีม")],
    ["รวม 2 โปรเจกต์: เขียนไฟล์ผลแล้ว มีชื่อทั้งคู่ งาน code ของ sonnet = 3", rollup.status === 0 && existsSync(out) && /proj-a: 2 วัน/.test(readOut(out)) && /proj-b: 1 วัน/.test(readOut(out)) && readOut(out).includes("| sonnet | code | 3 |")],
    ["รวมแล้วโปรเจกต์ที่อ่านไม่มีไฟล์เพิ่ม", lines(join(root, "proj-a")) === before],
    ["--out อยู่ในโปรเจกต์ที่อ่าน → ปฏิเสธ ไม่สร้างไฟล์", inside.status === 1 && !existsSync(join(root, "proj-a", "r.md"))],
    ["win32: path สัมพัทธ์ต่างตัวพิมพ์ (./proj-a กับ ./PROJ-A/r.md) → ปฏิเสธ", process.platform !== "win32" || relative.status === 1],
  ];
  rmSync(root, { recursive: true, force: true });
  let ok = 0;
  for (const [label, pass] of cases) { console.log(`  ${pass ? "✅" : "❌"} ${label}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}

const readOut = (file) => readFileSync(file, "utf8");
