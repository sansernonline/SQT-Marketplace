// --self-test: log จำลองใน tmp 2 โปรเจกต์ → ตรวจตัวเลขในรายงาน การรวมโปรเจกต์ และว่าไม่เขียนลงโปรเจกต์ที่อ่าน
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { buildReport, aggregate } from "./report.mjs";
import { collectProject } from "./collect.mjs";
import { distributionSection, simultaneousGroups, wilson } from "./distribution.mjs";
import { pertByStep, bestOdds, pickOnce, contenders, seeded, betaDraw } from "./choose.mjs";

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
  { ts: at(3), session: "s1", event: "result", spawned_id: "r1", verdict: "pass", round: 1, high: 0, mid: 1, low: 2 },
  { ts: at(4), session: "s1", event: "feedback", user_feedback: "accept" },
  run(10, "s2", "software-company:developer", "code"),
  review(11, "s2", "fail", 1),
  review(13, "s2", "pass", 2),
  { ts: at(14), session: "s2", event: "feedback", user_feedback: "reject" },
  run(20, "s3", "general-purpose", "research", { async: true, tool_use_id: "tu3", tokens: null, duration_ms: null, estimate_tokens: 20000 }),
  { ts: at(25), session: "s3", event: "result", tool_use_id: "tu3", total_tokens: 30000 },
];

const sec = (second, session, extra = {}) => ({ ts: `2026-10-20T10:00:${String(second).padStart(2, "0")}+07:00`, session, event: "run", step: "code", model: "sonnet", effort: null, ...extra });
const spread = (gap) => simultaneousGroups([sec(0, "s1"), sec(gap, "s1")]);
const dist = (runs, expects) => distributionSection(runs, expects).join("\n");

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
  const pert = pertByStep([10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => ({ step: "code", total_tokens: n * 1000 })))[0];
  const odds = bestOdds([{ model: "good", a: 21, b: 3, cost: 1 }, { model: "bad", a: 3, b: 21, cost: 1 }]);
  const cheap = bestOdds([{ model: "pricey", a: 9, b: 3, cost: 10 }, { model: "cheap", a: 8, b: 4, cost: 1 }]);
  const draws = Array.from({ length: 4000 }, ((r) => () => betaDraw(3, 7, r))(seeded(7)));
  const c = makeProject(root, "proj-c", { "2026-10-20": { "runs.jsonl": [...newDay, { ...run(30, "s4", "software-company:developer", "code"), model: "opus" }, review(31, "s4", "fail", 1)] } });
  const mixed = aggregate(collectProject(c[1], "proj-c").runs, PRICES);
  const withUntried = contenders(mixed, "code", PRICES, ["haiku"]);
  const r1 = collectProject(a[1], "proj-a").runs.find((r) => r.spawned_id === "r1");
  const cases = [
    ["result ส่ง high · mid · low ของผู้ตรวจไปที่งาน", r1?.high === 0 && r1?.mid === 1 && r1?.low === 2],
    ["PERT: เร็ว P10 10k · กลาง P50 50k · ช้า P90 90k · ค่าคาด (10+200+90)÷6 = 50k · ± (90−10)÷2.56 = 31.25k", pert.o === 10000 && pert.m === 50000 && pert.p === 90000 && pert.mean === 50000 && pert.sd === 31250],
    ["Beta(3,7) สุ่ม 4000 ครั้ง เฉลี่ยใกล้ 0.3", Math.abs(draws.reduce((s, x) => s + x, 0) / draws.length - 0.3) < 0.02],
    ["Thompson: ผ่าน 20/22 ชนะ 2/22 เกิน 95%", odds.rows[0].model === "good" && odds.rows[0].pBest > 0.95],
    ["Thompson หารราคา: ผ่านพอ ๆ กันแต่ถูกกว่า 10 เท่า ชนะ", cheap.rows[0].model === "cheap"],
    ["--pick คืนชื่อ model ที่อยู่ในรายการ", ["good", "bad"].includes(pickOnce(odds.rows, seeded(3)))],
    ["ผู้ท้าชิงขั้น code: sonnet + opus จากผลตรวจ + haiku ที่ยังไม่เคยใช้ได้ Beta(1,1)", withUntried.length === 3 && withUntried.some((c) => c.model === "haiku" && c.a === 1 && c.b === 1)],
    ["รายงานมีหัวข้อขนาดจาก PERT และ model ต่อขั้น", report.includes("## ขนาดชิ้นงานจากงานเก่า") && report.includes("## model ต่อขั้น")],
    ["นับงานต่อ model × ขั้น", report.includes("| sonnet | code | 2 |")],
    ["ผ่านรอบแรก 1 ใน 2 (รอบ 2 ผูกกับงานเดิม)", report.includes("50% (1/2)")],
    ["รอบแก้เฉลี่ย 0.5 (1 รอบแก้ใน 2 งาน)", report.includes("| 0.5 |")],
    ["ผู้ใช้รับ 1 ปฏิเสธ 1 ผูกกับงานไม่ใช่ผู้ตรวจ", report.includes("| 1/1 |")],
    ["ค่าใช้จ่ายรวม 2 งาน = $0.03", report.includes("$0.03")],
    ["คะแนนความคุ้ม = 0.5 ÷ 0.0168 = 29.76", report.includes("29.76")],
    ["เวลาของงานเบื้องหลังได้จากเวลาผลส่งกลับ (2.0 นาที)", report.includes("| 2.0 นาที |")],
    ["วันเก่าไม่มี runs.jsonl → แถวหยาบ inherit + ป้าย", report.includes("| inherit (claude-opus-5-5) | code | 1 |") && report.includes("1 วันไม่มี runs.jsonl")],
    ["token ของวันเก่าเป็นค่าประมาณ (~)", report.includes("~")],
    ["ตัวอย่างน้อยกว่า 5 ติดป้ายทุกแถว", report.split("## การแจกงาน")[0].split("\n").filter((l) => l.startsWith("| ") && !/^\| (model|ขั้น) \|/.test(l) && !l.includes("ตัวอย่างน้อย")).length === 0],
    ["ขนาดจริงต่อประเมิน: งานเบื้องหลังได้ token จาก tool_use_id · k = 0.6 + 0.4 × 1.5 = 1.20", report.includes("| research | 1 | 1.20 |")],
    ["ไม่มีบรรทัดขนาดในใบสั่งงาน → บอกว่ายังไม่มี", buildReport([b], PRICES).includes("ยังไม่มีงานที่ใบสั่งงานมีบรรทัด")],
    ["ไม่มีราคา → ยังไม่มีราคา", buildReport([a], null).includes("ยังไม่มีราคา")],
    ["ข้อสังเกตครบ 3 ข้อ", (report.match(/^\d\. /gm) ?? []).length === 3],
    ["log ว่าง → บอกว่ายังไม่มีงาน", buildReport([["x", join(root, "none")]], PRICES).includes("ยังไม่มีงานลูกทีม")],
    ["รวม 2 โปรเจกต์: เขียนไฟล์ผลแล้ว มีชื่อทั้งคู่ งาน code ของ sonnet = 3", rollup.status === 0 && existsSync(out) && /proj-a: 2 วัน/.test(readOut(out)) && /proj-b: 1 วัน/.test(readOut(out)) && readOut(out).includes("| sonnet | code | 3 |")],
    ["รวมแล้วโปรเจกต์ที่อ่านไม่มีไฟล์เพิ่ม", lines(join(root, "proj-a")) === before],
    ["--out อยู่ในโปรเจกต์ที่อ่าน → ปฏิเสธ ไม่สร้างไฟล์", inside.status === 1 && !existsSync(join(root, "proj-a", "r.md"))],
    ["win32: path สัมพัทธ์ต่างตัวพิมพ์ (./proj-a กับ ./PROJ-A/r.md) → ปฏิเสธ", process.platform !== "win32" || relative.status === 1],
  ];
  const team = [sec(0, "s1", { brief_sections: 5 }), sec(1, "s1", { brief_sections: 4, effort: "high" }), sec(2, "s1", { model: "inherit", brief_sections: 3 }), sec(3, "s1"),
    sec(30, "s1", { step: "review" }), sec(31, "s1", { step: "review" })];
  const reviewResults = [{ round: 1, verdict: "pass" }, { round: 1, verdict: null }, { round: 2, verdict: "pass" }];
  const normal = dist(team, { reviewResults, expects: [{ ts: "2026-10-20T09:59:00+07:00", session: "s1", workers: 2 }] });
  const noBrief = dist(team.map(({ brief_sections, ...r }) => r));
  const [lo, hi] = wilson(9, 27);
  cases.push(
    ["การแจกงาน ค่าปกติ: ระบุ model 83% · effort 17% · พร้อมกันมากสุด 4 · ใบสั่ง 0.80 · ผ่านรอบแรก 1/2 · verdict ว่าง 1/3 · จริง ÷ คาด 2.00",
      ["83% (5/6)", "17% (1/6)", "| 4 |", "0.80", "50% (1/2)", "1/3", "| 2.00 |"].every((t) => normal.includes(t))],
    ["การแจกงาน log ว่าง → บอกว่ายังไม่มีงานให้นับ", dist([]).includes("ยังไม่มีงานลูกทีมให้นับ")],
    ["การแจกงาน ไม่มีช่อง brief_sections → วัดไม่ได้ ไม่ใช่ 0%", noBrief.includes("วัดไม่ได้ — ต้องมีช่อง brief_sections")],
    ["การแจกงาน ts ห่าง 5 วินาทีนับพร้อมกัน · ห่าง 6 วินาทีไม่นับ", Math.max(...spread(5)) === 2 && Math.max(...spread(6)) === 1],
    ["การแจกงาน ts 0,4,8,12,16 ไม่ต่อเป็นสายชุดเดียว (ชุดใหญ่สุด ≤ 2)", Math.max(...simultaneousGroups([0, 4, 8, 12, 16].map((t) => sec(t, "s1")))) <= 2],
    ["การแจกงาน ลูกทีม ÷ ความกว้าง: 4 ตัวพร้อมกัน ÷ กว้าง 4 = 1.00 · อยู่ในช่วง 1/1", dist(team, { expects: [{ ts: "2026-10-20T09:59:00+07:00", session: "s1", workers: 4, width: 4 }] }).includes("1.00 · 100% (1/1)")],
    ["การแจกงาน ไม่มี expect → ยังไม่มีบรรทัด คาด: · ไม่มีกว้างสุด → บอกว่ายังไม่มี", dist(team).includes("| คาดแม่นแค่ไหน | ยังไม่มีบรรทัด คาด: |") && normal.includes("ยังไม่มีบรรทัด คาด: ที่มีกว้างสุด")],
    ["Wilson 95% ของ 9/27 = 19%–52%", Math.round(lo * 100) === 19 && Math.round(hi * 100) === 52],
  );
  rmSync(root, { recursive: true, force: true });
  let ok = 0;
  for (const [label, pass] of cases) { console.log(`  ${pass ? "✅" : "❌"} ${label}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}

const readOut = (file) => readFileSync(file, "utf8");
