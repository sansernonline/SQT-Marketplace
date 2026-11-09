#!/usr/bin/env node
/**
 * run-dispatch.mjs — วัดว่าหัวหน้าทีมแจกงานถูกไหม: ลูกทีมกี่ตัว · model ระดับไหน · แบ่งคลื่น · บรรทัดคาด
 *
 *   node scripts/evals/dispatch/run-dispatch.mjs --verify            ฟรี: เคสครบ และเฉลยตรงกับ plan.mjs ที่รันจริง
 *   node scripts/evals/dispatch/run-dispatch.mjs --plan              ฟรี: ประมาณค่าใช้จ่าย
 *   node scripts/evals/dispatch/run-dispatch.mjs --run [--runs 1] [--budget-total 2]  (3 รอบใช้ --budget-total 5) [--model claude-sonnet-5-5|none]
 *   node scripts/evals/dispatch/run-dispatch.mjs --score <runs.json>  ให้คะแนนใหม่จากผลเดิม ไม่เรียก claude
 *
 * 2 แขนต่อเคส: มี plugin superuser (--plugin-dir) กับไม่มี plugin · ทั้งคู่ใช้ --setting-sources project จึงไม่โหลด plugin ที่ติดตั้งในเครื่อง
 * ให้ตอบเป็น JSON แผนอย่างเดียว ไม่ลงมือ · --max-turns 8 · เครื่องมือมีแค่ Skill กับ Read (ให้แขน plugin เปิด skill ได้)
 * อ่านผลแบบ stream-json เพื่อนับว่าเปิด Skill กี่ครั้งต่อรอบ
 * ก่อนเรียกทุกครั้งเช็กว่า ใช้แล้ว + เพดานครั้งนั้น ไม่เกิน --budget-total · ผลไม่ครบนับ $ เท่าเพดาน
 * ผลรายรอบ → _to_delete/dispatch/<เวลา>/ · สรุปต่อท้าย scripts/evals/dispatch/RESULTS.md
 */
import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { run } from "../coding/lib.mjs";
import { WAVE_MAX, parsePlan, scoreRun, summarizeArm, armTable, tierFromTags, TAGS } from "./score.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
const OUT = join(ROOT, "_to_delete", "dispatch");
const WORK = join(tmpdir(), "sqt-dispatch");
const PLUGIN = join(ROOT, "plugins", "superuser");
const PLAN_MJS = join(PLUGIN, "skills", "parallel-split-and-merge", "scripts", "plan.mjs");
// เคสสาขาอื่นใส่ "plugin": "<ชื่อ>" → โหลด plugin สาขานั้นคู่กับ superuser ให้หัวหน้าเห็นลูกทีมและ playbook ของสาขา (เหมือนใช้งานจริง)
export const pluginDirs = (c) => [PLUGIN, ...(c.plugin ? [join(ROOT, "plugins", c.plugin)] : [])];
const CASE_COUNT = 10;
const TIERS = ["ใหญ่", "กลาง", "เล็ก"];
const ARMS = { plugin: "มี plugin", none: "ไม่มี plugin" };

const args = Object.fromEntries(process.argv.slice(2).join(" ").split(/\s*--/).filter(Boolean).map((p) => {
  const [k, ...v] = p.trim().split(/\s+/); return [k, v.join(" ") || true];
}));
const RUNS = Number(args.runs ?? 1);
const BUDGET_TOTAL = Number(args["budget-total"] ?? 2); // 1 รอบ × 2 แขน ใช้จริง $1.48 (2026-11-08)
const MODEL = args.model ?? "claude-sonnet-5-5";
const PRICES = JSON.parse(readFileSync(join(PLUGIN, "skills", "model-scorecard", "references", "prices.json"), "utf8")).per_mtok;

// $ ต่อครั้งบน sonnet · วัดจริงรอบแรก 2026-11-08 (1 รอบคุย ไม่เปิด skill): มี plugin $0.065 · ไม่มี plugin $0.05
// สมมุติเพิ่มตอนเปิด skill: SKILL.md ของ superuser ราว 12k token เขียน cache ใหม่ + อีก 2–3 รอบคุย ≈ +$0.075 · ไม่มี plugin อาจลองเปิดแล้วไม่เจอ +1 รอบคุย
const SONNET_COST = { plugin: 0.14, none: 0.06 };
const CAP_MARGIN = 2;
const CAP_MIN = 0.1;

const SUFFIX = `

---
ตอนนี้ยังไม่ต้องลงมือ ไม่ต้องแก้ไฟล์ ไม่ต้องถามกลับ · ถ้ามี skill ที่เกี่ยวกับการวางแผนแจกงาน ให้เปิดอ่านก่อนตอบ
ตอบเป็น JSON ก้อนเดียวในรูปนี้ ไม่มีข้อความอื่น:
{"size": "เล็ก|กลาง|ใหญ่", "workers_parallel_max": <จำนวนผู้ช่วย (subagent) ที่ทำงานพร้อมกันมากสุด · ทำเองทั้งหมดใส่ 0>, "waves": [["ชื่อชิ้น", ...], ...], "pieces": [{"name": "ชื่อชิ้น", "model": "opus|sonnet|haiku", "effort": "low|medium|high", "depends_on": ["ชื่อชิ้น"]}], "review_rounds": <จำนวนรอบตรวจ>, "expect_line": "คาด: ขนาด <เล็ก/กลาง/ใหญ่> · ลูกทีม <N> · รอบตรวจ <N> · ระดับ <เล็ก/กลาง/ใหญ่>"}
pieces = เฉพาะชิ้นที่ส่งให้ผู้ช่วยทำ (ชิ้นที่ทำเองไม่ต้องใส่) · waves = ชื่อชิ้นที่ส่งออกพร้อมกันในแต่ละรอบ ตามลำดับ`;

const usd = (x) => `$${x.toFixed(2)}`;
const stamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

function loadCases() {
  const dir = join(HERE, "cases");
  const only = args.only ? new RegExp(args.only) : null; // --only "^d7" รันเฉพาะเคสที่ชื่อไฟล์ตรง
  return readdirSync(dir).filter((f) => f.endsWith(".json") && (!only || only.test(f))).sort()
    .map((f) => ({ file: f, ...JSON.parse(readFileSync(join(dir, f), "utf8")) }))
    // ชิ้นที่มี tags แต่ไม่มี tier → คำนวณระดับเฉลยจากป้าย (มีทั้งคู่ --verify ตรวจว่าตรงกัน)
    .map((c) => ({ ...c, graph: { ...c.graph, tasks: c.graph.tasks.map((t) => ({ ...t, tier: t.tier ?? (t.tags ? tierFromTags(t.tags, c.risky) : undefined), tierGiven: t.tier })) } }));
}

// ---- ประมาณค่าใช้จ่าย ----
const priceRatio = MODEL === "none" ? 1 : (PRICES[MODEL]?.output ?? PRICES["claude-sonnet-5-5"].output) / PRICES["claude-sonnet-5-5"].output;
const estimate = (arm) => SONNET_COST[arm] * priceRatio;
const capPerCall = (arm) => Math.max(estimate(arm) * CAP_MARGIN, CAP_MIN);

function printPlan() {
  const n = loadCases().length;
  const perRun = n * (estimate("plugin") + estimate("none"));
  const total = perRun * RUNS;
  console.log(`| แขน | ครั้งที่เรียก | ประมาณต่อครั้ง | เพดานต่อครั้ง | รวมประมาณ |\n|---|---|---|---|---|`);
  for (const arm of Object.keys(ARMS)) console.log(`| ${ARMS[arm]} | ${n * RUNS} | ${usd(estimate(arm))} | ${usd(capPerCall(arm))} | ${usd(estimate(arm) * n * RUNS)} |`);
  console.log(`\nmodel ${MODEL} · ${n} เคส × ${RUNS} รอบ × 2 แขน · รวมประมาณ ${usd(total)} · งบ ${usd(BUDGET_TOTAL)} · ${total <= BUDGET_TOTAL ? "อยู่ในงบ" : "เกินงบ"}`);
  if (total > BUDGET_TOTAL) console.log(`งบนี้พอราว ${Math.floor(BUDGET_TOTAL / perRun)} รอบเต็ม → ใส่ --runs ${Math.max(1, Math.floor(BUDGET_TOTAL / perRun))} หรือเพิ่ม --budget-total ${Math.ceil(total)} · ไม่เปลี่ยน ตัวรันจะหยุดเมื่อเงินไม่พอเพดานครั้งถัดไป`);
  console.log("วิธีประมาณ: $ ต่อครั้งบน sonnet (วัดจริง 1 รอบคุย: มี plugin $0.065 · ไม่มี $0.05 · บวกค่าสมมุติของการเปิด skill จน --max-turns 8 เป็น $0.14 และ $0.06) × ราคา output ของ model ÷ ของ sonnet (prices.json) · ผิดได้เป็นเท่าตัว");
}

// ---- รันจริง ----
const QUOTA = /hit your .*limit|usage limit reached|requires usage credits/i;

function freshDir(name) {
  const d = join(WORK, name);
  rmSync(d, { recursive: true, force: true });
  mkdirSync(d, { recursive: true });
  return d;
}

/** อ่าน stream-json ของ claude -p: ข้อความ result ตัวท้าย + ชื่อ skill ที่เรียกผ่านเครื่องมือ Skill (แบบเดียวกับ triggers/) */
function readStream(out) {
  let result = {};
  const skills = [];
  for (const line of out.split("\n")) {
    let m; try { m = JSON.parse(line); } catch { continue; }
    if (m.type === "result") result = m;
    for (const b of m.message?.content ?? []) if (b.type === "tool_use" && b.name === "Skill") skills.push(b.input?.skill ?? "?");
  }
  return { result, skills };
}

/** เรียก claude -p 1 ครั้งในโฟลเดอร์ว่างนอก repo · ผลไม่ครบ → นับ $ เท่าเพดาน เพราะอาจเสียจริงถึงเพดาน */
async function ask(c, arm, cap) {
  const argv = ["-p", ...(MODEL === "none" ? [] : ["--model", MODEL]), ...(arm === "plugin" ? pluginDirs(c).flatMap((d) => ["--plugin-dir", d]) : []),
    "--setting-sources", "project", "--strict-mcp-config", "--tools", "Skill,Read", "--max-turns", "8",
    "--output-format", "stream-json", "--verbose", "--max-budget-usd", String(cap)];
  const r = await run("claude", argv, { cwd: freshDir(`${c.id}-${arm}`), input: c.prompt + SUFFIX });
  const { result: j, skills } = readStream(r.out);
  const isQuota = QUOTA.test(String(j.result ?? r.err));
  const isComplete = r.code === 0 && typeof j.total_cost_usd === "number";
  const cost = isQuota ? 0 : isComplete ? j.total_cost_usd : Math.max(j.total_cost_usd ?? 0, cap);
  return { answer: j.result ?? "", turns: j.num_turns ?? null, skills, cost, subtype: j.subtype ?? null, isQuota, stderr: r.err.slice(-1000) };
}

/** รอบใหม่มีรายชื่อ skill จาก stream · ผลเก่าที่ไม่มี ใช้ รอบคุย > 1 เป็นตัวแทน (เครื่องมือมีแค่ Skill กับ Read) */
const skillOpened = (r) => (Array.isArray(r.skills) ? r.skills.length > 0 : r.turns > 1);

async function paidRun() {
  const problems = await check();
  if (problems.length) { console.error(`ยังไม่พร้อม ไม่รัน\n${problems.join("\n")}`); process.exit(1); }
  const cases = loadCases();
  const dir = join(OUT, stamp().replace(/[: ]/g, "-"));
  mkdirSync(dir, { recursive: true });
  const rows = [];
  let spent = 0;
  console.log(`เริ่ม ${cases.length} เคส × ${RUNS} รอบ × 2 แขน · model ${MODEL} · งบรวม ${usd(BUDGET_TOTAL)}`);
  // วนรอบนอกสุด แขนในสุด: งบหมดกลางทาง 2 แขนยังได้จำนวนรอบใกล้กัน
  run: for (let n = 1; n <= RUNS; n++) for (const c of cases) for (const arm of Object.keys(ARMS)) {
    const cap = capPerCall(arm);
    if (spent + cap > BUDGET_TOTAL) { console.log(`เหลืองบ ${usd(BUDGET_TOTAL - spent)} ไม่พอเพดาน ${usd(cap)} · หยุดที่ ${c.id} ${arm} รอบ ${n}`); break run; }
    const r = { case: c.id, arm, n, risky: c.risky, ...(await ask(c, arm, cap)) };
    if (r.isQuota) { console.log("โควตาบัญชีหมด หยุดรัน · รันซ้ำทีหลัง"); break run; }
    spent += r.cost;
    rows.push(r);
    writeFileSync(join(dir, `${c.id}-${arm}-${n}.json`), JSON.stringify(r, null, 2));
    const s = scoreRun(c, r.answer);
    console.log(`${c.id.padEnd(14)} ${arm.padEnd(6)} รอบ ${n} · ลูกทีม ${parsePlan(r.answer)?.workers_parallel_max ?? "พัง"}/${c.expected.workers} · ${s.ratio_ok ? "ตรง" : "ไม่ตรง"} · skill ${r.skills.join(",") || "–"} · ${usd(r.cost)} · สะสม ${usd(spent)}`);
  }
  writeFileSync(join(dir, "runs.json"), JSON.stringify(rows, null, 2));
  const md = summaryMarkdown(rows, cases, `${stamp()} · model ${MODEL} · ${RUNS} รอบ${args.only ? ` · เฉพาะ --only ${args.only}` : ""} · ใช้ ${usd(spent)} จากงบ ${usd(BUDGET_TOTAL)}`);
  const file = join(HERE, "RESULTS.md");
  if (!existsSync(file)) writeFileSync(file, "# ผลวัดการแจกงานของหัวหน้าทีม\n\nสร้างโดย `scripts/evals/dispatch/run-dispatch.mjs` · ใหม่สุดอยู่ล่างสุด\n");
  appendFileSync(file, md);
  console.log(md);
  console.log(`ผลรายรอบ: ${dir}`);
}

// ---- สรุปผล ----
function summaryMarkdown(rows, cases, title) {
  const byId = new Map(cases.map((c) => [c.id, c]));
  const known = rows.filter((r) => byId.has(r.case));
  const scored = known.map((r) => ({ ...r, skill_opened: skillOpened(r), score: scoreRun(byId.get(r.case), r.answer) }));
  const arm = (a) => summarizeArm(scored.filter((r) => r.arm === a));
  const answered = (id, a) => scored.filter((r) => r.case === id && r.arm === a).map((r) => parsePlan(r.answer)?.workers_parallel_max ?? "พัง").join(" · ") || "–";
  return [
    `\n## ${title}\n`, armTable(arm("plugin"), arm("none")), "",
    "| เคส | ลูกทีมเฉลย | มี plugin ตอบ | ไม่มี plugin ตอบ |", "|---|---|---|---|",
    ...cases.map((c) => `| ${c.id} ${c.title} | ${c.expected.workers} | ${answered(c.id, "plugin")} | ${answered(c.id, "none")} |`), "",
  ].join("\n");
}

function rescore(file) {
  if (!existsSync(file)) { console.error(`ไม่พบไฟล์ ${file}`); process.exit(1); }
  const rows = JSON.parse(readFileSync(file, "utf8"));
  console.log(summaryMarkdown(rows, loadCases(), `ให้คะแนนใหม่ ${stamp()} · จาก ${file}`));
}

// ---- ตรวจความพร้อม (ฟรี) ----
/** รัน plan.mjs จริงกับกราฟเฉลย · --log ชี้โฟลเดอร์ที่ไม่มี จะได้ไม่เอาค่า k จาก log ของเครื่องมาปรับขนาด */
function analyse(c) {
  const dir = join(OUT, "verify");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${c.id}.json`);
  writeFileSync(file, JSON.stringify(c.graph));
  return JSON.parse(execFileSync("node", [PLAN_MJS, file, "--json", "--log", join(dir, "no-log")], { encoding: "utf8" }));
}

/** ขนาดตาม SKILL.md หัวข้อ 2: เล็ก = 1 ชิ้น ≤ 50k · ใหญ่ = เกิน 8 ชิ้น หรือสายวิกฤตยาวเกิน 4 ชิ้น · ที่เหลือ กลาง */
function sizeOf(a) {
  if (a.tasks.length === 1 && a.total <= 50) return "เล็ก";
  return a.tasks.length > WAVE_MAX || a.cp.length > 4 ? "ใหญ่" : "กลาง";
}

function checkCase(c) {
  const bad = [];
  for (const k of ["id", "title", "prompt", "risky", "expected", "graph"]) if (c[k] === undefined) bad.push(`ไม่มีช่อง ${k}`);
  if (bad.length) return { bad };
  if (`${c.id}.json` !== c.file) bad.push(`id ${c.id} ไม่ตรงชื่อไฟล์`);
  if (c.plugin && !existsSync(join(ROOT, "plugins", c.plugin, ".claude-plugin", "plugin.json"))) bad.push(`ไม่มี plugin ${c.plugin}`);
  if (/superuser|ลูกทีม/i.test(c.prompt)) bad.push("prompt เอ่ยคำว่า superuser หรือลูกทีม");
  const tiers = c.graph.tasks.map((t) => t.tier);
  if (!tiers.every((t) => TIERS.includes(t))) bad.push(`tier ต้องเป็น ${TIERS.join("/")}`);
  if (c.risky && tiers.includes("เล็ก")) bad.push("งานเสี่ยงใช้ระดับเล็กไม่ได้");
  for (const t of c.graph.tasks.filter((x) => x.tags)) {
    const odd = t.tags.filter((g) => !TAGS.includes(g));
    if (odd.length) bad.push(`${t.id}: ป้ายไม่รู้จัก ${odd.join(",")}`);
    if (t.tierGiven && t.tierGiven !== tierFromTags(t.tags, c.risky)) bad.push(`${t.id}: tier ${t.tierGiven} ไม่ตรงกับป้าย (${tierFromTags(t.tags, c.risky)})`);
  }
  let a;
  try { a = analyse(c); } catch (e) { return { bad: [...bad, `plan.mjs ไม่รับกราฟ: ${String(e.stderr ?? e.message).trim()}`] }; }
  const size = sizeOf(a);
  const workers = size === "เล็ก" ? 0 : Math.min(a.width, WAVE_MAX);
  if (size !== c.expected.size) bad.push(`ขนาดเฉลย ${c.expected.size} แต่กราฟได้ ${size}`);
  if (workers !== c.expected.workers) bad.push(`ลูกทีมเฉลย ${c.expected.workers} แต่กราฟได้ ${workers}`);
  if (c.accept_workers && !c.accept_workers.includes(workers)) bad.push(`accept_workers ต้องมี ${workers} ที่กราฟได้`);
  if (size !== "เล็ก" && a.team !== workers) bad.push(`plan.mjs แนะนำลูกทีม ${a.team} ไม่ใช่ ${workers} (ขนานแล้วเร็วขึ้นไม่พอ)`);
  return { bad, a, size };
}

async function check() {
  const problems = [];
  if ((await run("claude", ["--version"])).code !== 0) problems.push("- ไม่พบคำสั่ง claude");
  const cases = loadCases();
  // --only รันบางเคส จึงไม่ตรวจจำนวนเคสและเคสงานเสี่ยงของทั้งชุด · ผลรอบนี้เทียบกับรอบเต็มไม่ได้
  if (!args.only && cases.length !== CASE_COUNT) problems.push(`- ต้องมี ${CASE_COUNT} เคส แต่มี ${cases.length}`);
  if (!args.only && !cases.some((c) => c.risky)) problems.push("- ไม่มีเคสงานเสี่ยง");
  if (!cases.length) problems.push("- --only ไม่ตรงเคสไหนเลย");
  for (const c of cases) for (const b of checkCase(c).bad) problems.push(`- ${c.file}: ${b}`);
  return problems;
}

async function verify() {
  console.log("| เคส | กว้าง (plan.mjs) | ลูกทีมเฉลย | ขนาด | เสี่ยง | ผล |\n|---|---|---|---|---|---|");
  for (const c of loadCases()) {
    const r = checkCase(c);
    console.log(`| ${c.id} | ${r.a?.width ?? "–"} | ${c.expected?.workers ?? "–"} | ${r.size ?? "–"} | ${c.risky ? "ใช่" : "–"} | ${r.bad.length ? r.bad.join(" · ") : "ผ่าน"} |`);
  }
  const problems = await check();
  console.log(problems.length ? `\nใช้ไม่ได้ ${problems.length} จุด\n${problems.join("\n")}` : `\nพร้อมรัน · ดูค่าใช้จ่ายด้วย --plan · รันจริงด้วย --run (เสียเงิน)`);
  process.exit(problems.length ? 1 : 0);
}

if (args.verify) await verify();
else if (args.plan) printPlan();
else if (args.run) await paidRun();
else if (typeof args.score === "string") rescore(resolve(args.score));
else { console.error("ใส่ --verify (ฟรี) · --plan (ฟรี) · --score <runs.json> (ฟรี) · หรือ --run (เรียก claude จริง เสียเงิน) · วิธีใช้อยู่ใน scripts/evals/dispatch/README.md"); process.exit(1); }
