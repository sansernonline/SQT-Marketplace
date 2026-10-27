#!/usr/bin/env node
/**
 * run-models.mjs — เทียบ model ต่อขั้นของทีม agent: ขั้น × model → คะแนน · เวลา · รอบคุย · token · ค่าใช้จ่าย · ความคุ้ม
 *
 *   node scripts/evals/models/run-models.mjs --verify      ตรวจว่าทุกงานและตัวให้คะแนนพร้อม (ฟรี ไม่เรียก model)
 *   node scripts/evals/models/run-models.mjs --plan        ตารางงาน + ประมาณค่าใช้จ่าย + ชุดที่อยู่ในงบ (ฟรี)
 *   node scripts/evals/models/run-models.mjs --run [--steps code,review] [--models claude-haiku-5-5,...] [--skip model:step,...]
 *        [--effort medium|none|low|high|...] [--budget-total 20]
 *
 * ขั้น: code = speed t1 · code-quality = coding c5 · review = review-recall r1 r2 r3 · plan = งานวางแผนใน plan-task.mjs
 * ไม่ใส่ --run ตัวรันจะไม่เรียก claude เลย กันเผลอเสียเงิน · รันจากถูกไปแพง หยุดเมื่อใช้ครบ --budget-total
 * ทุกรอบรัน `claude -p --model <model>` ในโฟลเดอร์ชั่วคราวนอก repo โดยไม่โหลด plugin (วัดตัว model ไม่ใช่ทีม)
 * ข้อยกเว้น: ขั้น review รันผ่าน run-review-recall.mjs ซึ่งโหลด plugin superuser และ agent superuser:reviewer (วัดทีมรีวิว ไม่ใช่ model เปล่า)
 * เพดานต่อช่อง = max(ประมาณของ model นั้น × 2, $0.50) · ผลไม่ครบ → ยอดใช้สะสมนับเท่าเพดาน · ก่อนเริ่มช่องเช็ก ใช้แล้ว + เพดาน ไม่เกินงบรวม
 * ผลรายรอบ → _to_delete/models/ · สรุปต่อท้าย scripts/evals/models/RESULTS.md
 */
import { execFileSync } from "node:child_process";
import { appendFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { run, prepare, cleanup, parseNodeTest } from "../coding/lib.mjs";
import { PLAN_PROMPT, scorePlan, selfTest } from "./plan-task.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const EVALS = resolve(HERE, "..");
const ROOT = resolve(EVALS, "..", "..");
const OUT = join(ROOT, "_to_delete", "models");
const WORK = join(tmpdir(), "sqt-models-bench");
const T1 = join(EVALS, "speed", "tasks", "t1");
const C5 = join(EVALS, "coding", "tasks", "c5-csv-import");
const RUN_CODING = join(EVALS, "coding", "run-coding.mjs");
const RUN_REVIEW = join(EVALS, "review-recall", "run-review-recall.mjs");
const REVIEW_CASES = "r1,r2,r3";

const args = Object.fromEntries(process.argv.slice(2).join(" ").split(/\s*--/).filter(Boolean).map((p) => {
  const [k, ...v] = p.trim().split(/\s+/); return [k, v.join(" ") || true];
}));
const PRICES = JSON.parse(readFileSync(join(ROOT, "plugins", "superuser", "skills", "model-scorecard", "references", "prices.json"), "utf8")).per_mtok;
const csv = (v) => (v && v !== true ? String(v).split(",").filter(Boolean) : []);
const MODELS = (csv(args.models).length ? csv(args.models) : Object.keys(PRICES)).sort((a, b) => PRICES[a]?.output - PRICES[b]?.output);
const EFFORT = args.effort ?? "medium";
const CAP_MARGIN = 2;
const CAP_MIN = 0.5;
const BUDGET_TOTAL = Number(args["budget-total"] ?? 20);
const SKIP = csv(args.skip);
const ALLOWED = ["Read", "Edit", "Write", "Glob", "Grep", "Skill", "TodoWrite",
  ...["npm", "npx", "node", "python", "python3", "pytest", "git", "ls", "cat", "cd", "mkdir", "cp", "grep", "head", "tail", "echo"].map((c) => `Bash(${c} *)`)];
const CODE_PROMPT = "ทำงานตาม TASK.md ในโฟลเดอร์นี้ให้เสร็จจนส่งมอบได้ · ผมไม่อยู่ ห้ามถามกลางทาง ตัดสินใจเองแล้วจดไว้ · จบแล้วสรุปสั้น ๆ ว่าทำอะไรไปและผ่าน test อะไร";
const GITIGNORE = "node_modules/\n__pycache__/\n.pytest_cache/\n*.db\n*.db-journal\n.claude/\n";

const text = (p) => readFileSync(p, "utf8");
const usd = (x) => `$${x.toFixed(2)}`;
const avg = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;

// ---- ประมาณค่าใช้จ่าย ----
const fileText = (p) => (existsSync(p) ? text(p) : "");
const t1Costs = () => [...fileText(join(EVALS, "speed", "RESULTS.md")).matchAll(/^\| t1 \| (?:old|new) \| \d+ \| [\d.]+ \| ([\d.]+) \|/gm)].map((m) => Number(m[1]));
const c5Costs = () => fileText(join(EVALS, "coding", "RESULTS.md")).split("\n").filter((l) => /\bc5 /.test(l) && l.includes("$"))
  .flatMap((l) => [...l.matchAll(/\$(\d+\.\d+)/g)].map((m) => Number(m[1])));

// สัดส่วน token ต่อประเภทในงาน agent (สมมุติ: อ่านจาก cache เป็นส่วนใหญ่) · ถ่วงราคาต่อล้าน token ของแต่ละ model เป็นราคาเฉลี่ยตัวเดียว
const MIX = { input: 0.02, output: 0.05, cache_read: 0.85, cache_write: 0.08 };
const blended = (m) => Object.entries(MIX).reduce((s, [k, w]) => s + w * PRICES[m][k], 0);

/** calls = จำนวนครั้งเรียก claude · measured = $ ต่อครั้งจากผลเก่า (บน sonnet) · assumed = ค่าสมมุติเมื่อไม่มีผลเก่า */
const STEPS = {
  code: { what: "speed t1 (แก้บั๊กวันที่ไทย)", calls: 1, measured: t1Costs, assumed: 0.5 },
  "code-quality": { what: "coding c5 (นำเข้า CSV)", calls: 1, measured: c5Costs, assumed: 1.5 },
  review: { what: `review-recall ${REVIEW_CASES}`, calls: 3, measured: () => [], assumed: 0.3 },
  plan: { what: "แตกงานจาก spec สั้น", calls: 1, measured: () => [], assumed: 0.05 },
};
const stepList = csv(args.steps).length ? csv(args.steps) : Object.keys(STEPS);

function estimate(step, model) {
  const s = STEPS[step], old = s.measured();
  const base = old.length ? avg(old) : s.assumed;
  return { usd: (base * s.calls * blended(model)) / blended("claude-sonnet-5-5"), from: old.length ? `ผลเก่า ${old.length} รอบ` : "สมมุติ" };
}

/** เพดาน $ ต่อช่อง: ประมาณของ model นั้น × CAP_MARGIN แต่ไม่ต่ำกว่า CAP_MIN · ต่อครั้งเรียก = หารจำนวนครั้ง */
const capPerCell = (step, model) => Math.max(estimate(step, model).usd * CAP_MARGIN, CAP_MIN);
const capPerCall = (step, model) => capPerCell(step, model) / STEPS[step].calls;

const cells = () => MODELS.flatMap((model) => stepList.map((step) => ({ model, step })))
  .filter((c) => STEPS[c.step] && PRICES[c.model] && !SKIP.includes(`${c.model}:${c.step}`));

function printPlan() {
  const all = cells().map((c) => ({ ...c, ...estimate(c.step, c.model), cap: capPerCell(c.step, c.model) }));
  const total = all.reduce((s, c) => s + c.usd, 0);
  console.log("| ขั้น | งาน | model | ครั้งที่เรียก | ประมาณ ($) | เพดานช่อง ($) | ฐาน |\n|---|---|---|---|---|---|---|");
  for (const c of all) console.log(`| ${c.step} | ${STEPS[c.step].what} | ${c.model} | ${STEPS[c.step].calls} | ${usd(c.usd)} | ${usd(c.cap)} | ${c.from} |`);
  console.log(`\nรวมประมาณ ${usd(total)} · งบ ${usd(BUDGET_TOTAL)} · ${total <= BUDGET_TOTAL ? "อยู่ในงบ" : "เกินงบ"}`);
  console.log(`เพดานช่อง = max(ประมาณ × ${CAP_MARGIN}, ${usd(CAP_MIN)}) · ตัวรันข้ามช่องที่เหลืองบไม่พอเพดาน จึงไม่เกินงบรวม`);
  console.log("วิธีประมาณ: $ ต่อครั้งบน sonnet (เฉลี่ยจาก speed/RESULTS.md ช่อง t1 และ coding/RESULTS.md บรรทัด c5 · review กับ plan ยังไม่เคยวัด ใช้ค่าสมมุติ)");
  console.log(`× ราคาเฉลี่ยถ่วงของ model ÷ ของ sonnet จาก prices.json (สัดส่วน token สมมุติ ${Object.entries(MIX).map(([k, w]) => `${k} ${w * 100}%`).join(" · ")}) · ผลเก่าไม่เก็บ token จึงประมาณจาก $ · ผิดได้เป็นเท่าตัว`);
  recommendSet(all, total);
}

/** ตัดช่องที่แพงสุดทีละช่องจนเหลือไม่เกิน 80% ของงบ (เผื่อประมาณพลาด) แล้วพิมพ์คำสั่ง --skip */
function recommendSet(all, total) {
  const limit = BUDGET_TOTAL * 0.8;
  const left = [...all].sort((a, b) => b.usd - a.usd);
  const dropped = [];
  let sum = total;
  while (sum > limit && left.length) { const c = left.shift(); dropped.push(c); sum -= c.usd; }
  if (!dropped.length) return console.log(`ชุดแนะนำ: รันทั้งหมด (${usd(total)} ไม่เกิน ${usd(limit)} ซึ่งเป็น 80% ของงบ)`);
  console.log(`\nชุดแนะนำ: ตัดช่องที่แพงสุดออก เหลือ ${usd(sum)} ไม่เกิน ${usd(limit)} (80% ของงบ)`);
  console.log(`node scripts/evals/models/run-models.mjs --run --skip ${dropped.map((c) => `${c.model}:${c.step}`).join(",")}`);
}

// ---- รันแต่ละช่อง ----
const claudeArgs = (model, cap, extra) => ["-p", "--model", model, ...(EFFORT === "none" ? [] : ["--effort", EFFORT]), "--setting-sources", "project",
  "--strict-mcp-config", "--output-format", "json", "--max-budget-usd", String(cap), ...extra];

/** เรียก claude -p (prompt ทาง stdin) ใน cwd คืนตัวเลขที่วัดได้ + ข้อความตอบ · ผลไม่ครบ → นับ $ เท่าเพดาน (isCharged) เพราะอาจเสียจริงถึงเพดาน */
async function ask(model, cwd, prompt, cap, extra = []) {
  const t0 = Date.now();
  const r = await run("claude", claudeArgs(model, cap, extra), { cwd, input: prompt });
  let j = {}; try { j = JSON.parse(r.out); } catch { /* claude ล้ม → ดู stderr ในไฟล์ผล */ }
  const isComplete = r.code === 0 && typeof j.total_cost_usd === "number";
  // โดนตัดที่เพดานกลางงาน (subtype error_max_budget_usd) หรือ claude บอกว่าผิดพลาด → ติดป้าย ผลช่องนี้ไม่ใช่ฝีมือ model
  const isCut = j.subtype === "error_max_budget_usd" || j.is_error === true;
  const u = j.usage ?? {};
  const tokens = ["input_tokens", "output_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"].reduce((s, k) => s + (u[k] ?? 0), 0);
  return { wall: Math.round((Date.now() - t0) / 1000), turns: j.num_turns ?? null, tokens, cost: isComplete ? j.total_cost_usd : Math.max(j.total_cost_usd ?? 0, cap), isCharged: !isComplete, isCut, result: j.result ?? "", stderr: r.err.slice(-1000) };
}

function freshDir(name) {
  const d = join(WORK, name);
  rmSync(d, { recursive: true, force: true });
  mkdirSync(d, { recursive: true });
  return d;
}

function startGit(dir) {
  writeFileSync(join(dir, ".gitignore"), GITIGNORE);
  for (const a of [["init", "-q"], ["add", "-A"], ["-c", "user.name=bench", "-c", "user.email=bench@local", "commit", "-qm", "start"]]) execFileSync("git", a, { cwd: dir });
}

const editTools = ["--permission-mode", "acceptEdits", "--allowedTools", ...ALLOWED];

async function runCode(model) {
  const work = freshDir(`code-${model}`);
  cpSync(join(T1, "repo"), work, { recursive: true });
  cpSync(join(T1, "TASK.md"), join(work, "TASK.md"));
  const a = await ask(model, work, CODE_PROMPT, capPerCall("code", model), editTools);
  const check = prepare(work, join(T1, "hidden"), "hidden");
  const { pass, total } = parseNodeTest((await run("node", ["--test", join("hidden", "hidden.test.js")], { cwd: check })).out);
  cleanup(check);
  return { ...a, score: total ? (10 * pass) / total : 0, note: `test ซ่อน ${pass}/${total}` };
}

/** ให้คะแนนด้วย run-coding.mjs --score (ไม่มีผู้ตัดสิน เต็ม 8 → ปรับเป็นเต็ม 10) */
async function runCodeQuality(model) {
  const work = freshDir(`code-quality-${model}`);
  cpSync(join(C5, "repo"), work, { recursive: true });
  cpSync(join(C5, "TASK.md"), join(work, "TASK.md"));
  startGit(work);
  const a = await ask(model, work, CODE_PROMPT, capPerCall("code-quality", model), editTools);
  const r = await run("node", [RUN_CODING, "--score", work, "--tasks", "c5", "--no-judge"], { cwd: ROOT });
  let s = null; try { s = JSON.parse(r.out.slice(r.out.indexOf("{"), r.out.lastIndexOf("}") + 1)); } catch { /* ให้คะแนนไม่ได้ → 0 */ }
  return { ...a, score: s ? (s.total * 10) / 8 : 0, note: s ? `test ซ่อน ${s.hidden} · diff ×${s.diffRatio}` : `ให้คะแนนไม่ได้: ${r.err.slice(-200)}` };
}

/** ให้ตัวรันเดิมทำเอง (ส่ง --model --effort ต่อ) แล้วอ่านผลรายเคสที่มันเขียนไว้ · ตัวรันเดิมไม่เก็บ token */
async function runReview(model) {
  const label = `models-${model}`;
  const cap = capPerCall("review", model);
  const argv = [RUN_REVIEW, "--run", "--cases", REVIEW_CASES, "--model", model, "--budget", String(cap), "--parallel", "1", "--label", label];
  if (EFFORT !== "none") argv.push("--effort", EFFORT);
  const dir = join(ROOT, "_to_delete", "review-recall", label);
  rmSync(dir, { recursive: true, force: true });
  const t0 = Date.now();
  await run("node", argv, { cwd: ROOT });
  const rs = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(text(join(dir, f)))) : [];
  const sum = (k) => rs.reduce((s, r) => s + (r[k] ?? 0), 0);
  const planted = sum("planted");
  const caseCount = REVIEW_CASES.split(",").length;
  // ตัวรันเดิมเขียน cost เป็น 0 เมื่อ claude ล้ม และเขียนไฟล์ผลเสมอ → เคสที่ cost ไม่เป็นบวกหรือ status ไม่ใช่ success นับเพดาน
  const broken = (r) => !(r.cost > 0) || (r.status && r.status !== "success");
  const cost = rs.reduce((t, r) => t + (broken(r) ? Math.max(r.cost ?? 0, cap) : r.cost), 0) + (caseCount - rs.length) * cap;
  return { wall: Math.round((Date.now() - t0) / 1000), turns: sum("turns"), tokens: null, cost, isCharged: rs.length < caseCount || rs.some(broken), score: planted ? (10 * sum("found")) / planted : 0,
    note: `เจอ ${sum("found")}/${planted} · ${rs.length}/${caseCount} เคสรันได้` };
}

async function runPlan(model) {
  const a = await ask(model, freshDir(`plan-${model}`), PLAN_PROMPT, capPerCall("plan", model), ["--tools", ""]);
  const s = scorePlan(a.result);
  return { ...a, score: s.score, note: s.checks.filter((c) => !c.points).map((c) => `ตก: ${c.name}`).join(" · ") || "ผ่านครบ" };
}

const RUNNERS = { code: runCode, "code-quality": runCodeQuality, review: runReview, plan: runPlan };

async function paidRun() {
  const problems = await check();
  if (problems.length) { console.error(`ยังไม่พร้อม ไม่รัน\n${problems.join("\n")}`); process.exit(1); }
  mkdirSync(OUT, { recursive: true });
  const todo = cells(), rows = [];
  let spent = 0;
  console.log(`เริ่ม ${todo.length} ช่อง · effort ${EFFORT} · งบรวม ${usd(BUDGET_TOTAL)}`);
  for (const { model, step } of todo) {
    // เช็กกับเพดานของช่องนี้ด้วย ไม่งั้นช่องสุดท้ายเริ่มได้ตอนใช้ไป $19.9 แล้วเกินงบที่ผู้ใช้อนุมัติไปเท่าเพดานของช่อง
    const cap = capPerCell(step, model);
    if (spent + cap > BUDGET_TOTAL) { console.log(`เหลืองบ ${usd(BUDGET_TOTAL - spent)} ไม่พอเพดานช่อง ${usd(cap)} · ข้าม ${model}:${step}`); rows.push({ model, step, skipped: true }); continue; }
    const r = { model, step, ...(await RUNNERS[step](model)) };
    if (r.isCharged) r.note += " · ผลไม่ครบ นับ $ ตามเพดาน";
    if (r.isCut) r.note += " · ถูกตัดที่เพดานกลางงาน คะแนนนี้ไม่ใช่ฝีมือ model";
    spent += r.cost;
    rows.push(r);
    writeFileSync(join(OUT, `${step}-${model}.json`), JSON.stringify(r, null, 2));
    console.log(`${step.padEnd(12)} ${model.padEnd(18)} ${r.score.toFixed(1)}/10 · ${r.wall}s · ${usd(r.cost)} · ${r.note} · สะสม ${usd(spent)}`);
    // --max-budget-usd ของ claude เป็นเพดานแบบอ่อน (ตัดระหว่างรอบคุย) ยอดจริงเกินเพดานได้ → หยุดทันทีที่ยอดรวมแตะงบ
    if (spent >= BUDGET_TOTAL) { console.log(`ยอดรวม ${usd(spent)} ถึงงบ ${usd(BUDGET_TOTAL)} แล้ว หยุดช่องที่เหลือ`); break; }
  }
  report(rows, spent);
}

// ---- สรุปผล ----
const value = (r) => (r.cost > 0 ? r.score / r.cost : 0);

/** คะแนนอยู่ในระยะ 1 จากสูงสุดของขั้น แล้วเลือกตัวที่คุ้มสุด (คะแนน ÷ $) */
function recommend(rs) {
  const top = Math.max(...rs.map((r) => r.score));
  const pick = rs.filter((r) => r.score >= top - 1 && r.cost > 0).sort((a, b) => value(b) - value(a))[0] ?? rs.find((r) => r.score === top);
  return `${pick.model} (${pick.score.toFixed(1)}/10 · ${usd(pick.cost)}${top > pick.score ? ` · สูงสุดของขั้นคือ ${top.toFixed(1)}` : ""})`;
}

function report(rows, spent) {
  const done = rows.filter((r) => !r.skipped);
  const lines = [`\n## ${new Date().toISOString().slice(0, 16).replace("T", " ")} · effort ${EFFORT} · ใช้ ${usd(spent)} จากงบ ${usd(BUDGET_TOTAL)} · 1 รอบต่อช่อง (ดูแนวโน้มเท่านั้น)\n`];
  const steps = stepList.filter((s) => done.some((r) => r.step === s));
  for (const step of steps) {
    lines.push(`### ${step} · ${STEPS[step].what}\n`, "| model | คะแนน (10) | เวลา (วินาที) | รอบคุย | token | $ | ความคุ้ม (คะแนน ÷ $) | หมายเหตุ |", "|---|---|---|---|---|---|---|---|");
    for (const r of done.filter((x) => x.step === step)) lines.push(`| ${r.model} | ${r.score.toFixed(1)} | ${r.wall} | ${r.turns ?? "—"} | ${r.tokens ?? "—"} | ${usd(r.cost)} | ${r.cost > 0 ? value(r).toFixed(1) : "—"} | ${r.note} |`);
    lines.push("");
  }
  lines.push("### สรุป: แต่ละขั้นควรใช้ model ไหน\n", "| ขั้น | ควรใช้ |", "|---|---|", ...steps.map((s) => `| ${s} | ${recommend(done.filter((r) => r.step === s))} |`));
  lines.push("", "เกณฑ์: คะแนนอยู่ในระยะ 1 จากสูงสุดของขั้นนั้น แล้วเลือกตัวที่คะแนน ÷ $ สูงสุด");
  const skipped = rows.filter((r) => r.skipped).map((r) => `${r.model}:${r.step}`);
  if (skipped.length) lines.push(`ข้ามเพราะถึงงบ: ${skipped.join(", ")}`);
  const file = join(HERE, "RESULTS.md");
  if (!existsSync(file)) writeFileSync(file, "# ผลเทียบ model ต่อขั้น\n\nสร้างโดย `scripts/evals/models/run-models.mjs` · ใหม่สุดอยู่ล่างสุด\n");
  appendFileSync(file, lines.join("\n") + "\n");
  console.log(lines.join("\n"));
}

// ---- ตรวจความพร้อม (ฟรี) ----
async function check() {
  const problems = [];
  const bad = (msg) => problems.push(`- ${msg}`);
  if ((await run("claude", ["--version"])).code !== 0) bad("ไม่พบคำสั่ง claude");
  for (const m of csv(args.models)) if (!PRICES[m]) bad(`${m} ไม่มีใน prices.json`);
  for (const s of stepList) if (!STEPS[s]) bad(`ไม่รู้จักขั้น ${s} (มี ${Object.keys(STEPS).join(", ")})`);
  for (const f of ["TASK.md", "repo", "hidden/hidden.test.js"]) if (!existsSync(join(T1, f))) bad(`ไม่พบ speed/tasks/t1/${f}`);
  if (!problems.length) {
    const tmp = prepare(join(T1, "repo"), join(T1, "hidden"), "hidden");
    const t = parseNodeTest((await run("node", ["--test", join("hidden", "hidden.test.js")], { cwd: tmp })).out);
    cleanup(tmp);
    if (!(t.total > 0 && t.pass < t.total)) bad(`t1: โค้ดตั้งต้นต้องตก test ที่ซ่อน แต่ได้ ${t.pass}/${t.total}`);
  }
  if ((await run("node", [RUN_CODING, "--verify", "--tasks", "c5"], { cwd: ROOT })).code !== 0) bad("coding c5: --verify ไม่ผ่าน (รัน node scripts/evals/coding/run-coding.mjs --verify --tasks c5 ดูเหตุ)");
  if ((await run("node", [RUN_REVIEW, "--verify", "--cases", REVIEW_CASES], { cwd: ROOT })).code !== 0) bad(`review-recall: --verify --cases ${REVIEW_CASES} ไม่ผ่าน`);
  return [...problems, ...selfTest().map((m) => `- ${m}`)];
}

async function verify() {
  const problems = await check();
  console.log("| ส่วน | ตรวจอะไร |\n|---|---|");
  console.log("| claude · prices.json | มีคำสั่ง claude · ทุก model ที่เลือกมีราคา |\n| code (t1) | มี repo · TASK.md · test ซ่อน และโค้ดตั้งต้นตก test |");
  console.log("| code-quality (c5) | `run-coding.mjs --verify --tasks c5` ผ่าน |\n| review (r1 r2 r3) | `run-review-recall.mjs --verify --cases r1,r2,r3` ผ่าน |\n| plan | ตัวให้คะแนน: แผนดีได้ 10 · แผนเสียได้ไม่เกิน 2 |");
  console.log(problems.length ? `\nใช้ไม่ได้ ${problems.length} จุด\n${problems.join("\n")}` : `\nพร้อมรัน · ${cells().length} ช่อง · ดูค่าใช้จ่ายด้วย --plan · รันจริงด้วย --run (เสียเงิน)`);
  process.exit(problems.length ? 1 : 0);
}

mkdirSync(WORK, { recursive: true });
if (args.verify) await verify();
else if (args.plan) printPlan();
else if (args.run) await paidRun();
else { console.error("ใส่ --verify (ฟรี) · --plan (ฟรี) · หรือ --run (เรียก claude จริง เสียเงิน) · วิธีใช้อยู่ใน scripts/evals/models/README.md"); process.exit(1); }
