// อ่าน log ของโปรเจกต์ (อ่านอย่างเดียว) → รายการงานลูกทีม (run) พร้อมผลตรวจและคำของผู้ใช้
// วันที่มี runs.jsonl ใช้ไฟล์นั้น · วันเก่าที่ไม่มี ใช้ main.jsonl + tokens.json แบบหยาบ (ไม่มีข้อมูลผล)
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DAY = /^\d{4}-\d{2}-\d{2}$/;

export function readJson(file, fallback) {
  try { return JSON.parse(readFileSync(file, "utf8")); } catch { return fallback; }
}

export function readLines(file) {
  try {
    return readFileSync(file, "utf8").split("\n").filter(Boolean).flatMap((l) => { try { return [JSON.parse(l)]; } catch { return []; } });
  } catch { return []; }
}

// กฎเดียวกับ hooks/step-rules.json (hook จัดขั้นตอนจด · ที่นี่จัดขั้นให้วันที่ยังไม่มี runs.jsonl)
export function classifyStep(role, description, rules) {
  const text = `${role ?? ""} ${description ?? ""}`;
  const hit = (rules.rules ?? []).find((r) => new RegExp(r.pattern, "i").test(text));
  return hit?.step ?? rules.default ?? "other";
}

const stepRules = () => readJson(join(HERE, "..", "..", "..", "hooks", "step-rules.json"), { default: "other", rules: [] });

function mostCommon(values) {
  const count = new Map();
  for (const v of values.filter(Boolean)) count.set(v, (count.get(v) ?? 0) + 1);
  return [...count].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function fromMain(entries, rules) {
  return entries.filter((e) => e.event === "PostToolUse" && e.role).map((e) => ({
    ts: e.ts, session: e.session, role: e.role, model: e.role_model ?? "inherit", lead_model: e.model,
    step: classifyStep(e.role, e.target, rules), spawned_id: e.spawned_id ?? null, tokens: null, duration_ms: null, verdict: null,
  }));
}

function applyResult(run, result) {
  run.verdict = result.verdict ?? run.verdict;
  run.round = result.round ?? run.round;
  run.total_tokens = result.total_tokens ?? run.total_tokens;
  if (run.duration_ms == null) run.duration_ms = Date.parse(result.ts) - Date.parse(run.ts);
}

function fromRunsFile(lines) {
  const runs = [], byId = new Map(), byTool = new Map();
  for (const l of lines) {
    if (l.event === "run") {
      runs.push({ ...l });
      if (l.spawned_id) byId.set(l.spawned_id, runs.at(-1));
      if (l.tool_use_id) byTool.set(l.tool_use_id, runs.at(-1));
    } else if (l.event === "result" && (byId.has(l.spawned_id) || byTool.has(l.tool_use_id))) {
      applyResult(byId.get(l.spawned_id) ?? byTool.get(l.tool_use_id), l);
    } else if (l.event === "feedback") {
      const last = runs.findLast((r) => r.session === l.session && r.step !== "review");
      if (last) (last.feedback ??= []).push(l.user_feedback);
    }
  }
  return runs;
}

// token ที่ log ไม่ได้จดต่องาน: เอายอดของ agent ชนิดนั้นในวัน หักของที่จดไว้ แล้วหารเท่ากันให้งานที่ไม่มี
function fillTokens(runs, dayTokens) {
  const keys = ["input", "output", "cacheRead", "cacheCreate"];
  for (const role of new Set(runs.map((r) => r.role))) {
    const mine = runs.filter((r) => r.role === role), total = dayTokens[role];
    const lacking = mine.filter((r) => !r.tokens);
    if (!total || !lacking.length) continue;
    const share = Object.fromEntries(keys.map((k) => [k, Math.max(0, (total[k] ?? 0) - mine.reduce((s, r) => s + (r.tokens?.[k] ?? 0), 0)) / lacking.length]));
    for (const r of lacking) { r.tokens = { ...share }; r.tokensEstimated = true; }
  }
}

function collectDay(dayDir, day, project, rules) {
  const lines = readLines(join(dayDir, "runs.jsonl"));
  const main = readLines(join(dayDir, "main.jsonl"));
  const runs = lines.length ? fromRunsFile(lines) : fromMain(main, rules);
  const leadModel = mostCommon(main.map((e) => e.model));
  for (const r of runs) Object.assign(r, { project, day, rough: !lines.length, lead_model: r.lead_model ?? leadModel, reviews: [], feedback: r.feedback ?? [] });
  fillTokens(runs, readJson(join(dayDir, "tokens.json"), {}));
  return { runs, rough: !lines.length };
}

// ผู้ตรวจ → งานล่าสุดก่อนหน้าใน session เดียวกัน · ตรวจรอบที่ 2 ขึ้นไป → งานเดียวกับรอบแรกที่ผูกไว้ · เป็นการประมาณ ไม่ใช่ข้อมูลที่ log จดตรง ๆ
function linkReviews(runs) {
  const prev = {}, linked = {};
  for (const r of [...runs].sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts))) {
    if (r.step !== "review") { prev[r.session] = r; continue; }
    if (!r.verdict) continue;
    const target = r.round > 1 && linked[r.session] ? linked[r.session] : prev[r.session];
    if (!target) continue;
    target.reviews.push(r.verdict);
    if (!(r.round > 1)) linked[r.session] = target;
  }
}

export function collectProject(logDir, project) {
  const rules = stepRules();
  let days = [];
  try { days = readdirSync(logDir).filter((n) => DAY.test(n)).sort(); } catch { return { runs: [], days: [] }; }
  const parts = days.map((d) => ({ day: d, ...collectDay(join(logDir, d), d, project, rules) }));
  const runs = parts.flatMap((p) => p.runs);
  linkReviews(runs);
  return { runs, days: parts.map((p) => ({ day: p.day, rough: p.rough, runs: p.runs.length })) };
}
