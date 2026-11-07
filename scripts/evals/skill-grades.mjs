#!/usr/bin/env node
// ชั้น 1–2 ของ docs/SKILL-SCORECARD.md: ให้ระดับต่อ skill จากผลรันจริง ด้วยสูตรใน speed/stats.mjs · ไม่เรียก claude ไม่เสียเงิน
//   node scripts/evals/skill-grades.mjs                                   อ่าน plugins/<p>/evals/results/*/aggregate-result.json และ _to_delete/eval-<p>*.json ทุกไฟล์
//   node scripts/evals/skill-grades.mjs --results <ไฟล์ .json หรือโฟลเดอร์>  ผลจาก `claude plugin eval --json` (ใส่ซ้ำได้หลายชุด)
//   ผ่าน plugin-eval.mjs ต้องส่ง `--json _to_delete/eval-<plugin>.json` เพราะมันรันบนสำเนาชั่วคราว ผลไม่ลง plugins/<p>/evals/results/
//   node scripts/evals/skill-grades.mjs --triggers _to_delete/triggers/current   รวม recall จากชุด scripts/evals/triggers (ไฟล์ <id>-<n>.json)
//   ตัวเลือก: --plugin <ชื่อ> · --md <ไฟล์> · --threshold 0.8 (รอบผ่านเมื่อคะแนน ≥ ค่านี้) · --k 3 (pass^k) · --self-test
// ระดับ (SKILL-SCORECARD หัวข้อ 4): B = recall ≥ 0.90 · false trigger ≤ 0.10 · ผ่านแขนมี skill ≥ 0.80 ที่ ≥ 3 รอบ
//   A* = B และขอบล่างของ uplift > 0 ที่ ≥ 10 รอบต่อแขน (* = ยังต้องใช้จริง 30 วันโดยไม่มีผู้ใช้แก้เรื่องเดิมซ้ำ จึงเป็น A เต็ม)
// รูปแบบ JSON ระดับรอบและ grader ไม่อยู่ในเอกสารทางการ (ตรวจ 2026-11-07) จึงอ่านแบบยืดหยุ่น: run.score ถ้ามี ไม่มีคิดจาก graders[].passed ถ่วง weight
import { readdirSync, readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { wilson, diffCI, passHatK } from "./speed/stats.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const RULE = { recall: 0.9, falseTrigger: 0.1, pass: 0.8, minRuns: 3, upliftRuns: 10 }; // เกณฑ์ตาม SKILL-SCORECARD หัวข้อ 4

// ---------- อ่านผล ----------

/** อ่าน JSON · ไฟล์เสียหรือเขียนไม่ครบ (eval ถูกหยุดกลางคัน) คืน null พร้อมแจ้ง ไม่ล้มทั้งโปรแกรม */
const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch (e) { console.error(`อ่านไม่ได้ ข้าม: ${p} (${e.message})`); return null; } };
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

/** ไฟล์ aggregate-result.json ทุกไฟล์ใต้ path (ไฟล์เดียวหรือโฟลเดอร์) */
export function findResultFiles(paths) {
  const out = [];
  const walk = (p) => {
    if (!existsSync(p)) return;
    if (!isDir(p)) { if (p.endsWith(".json")) out.push(p); return; }
    for (const f of readdirSync(p)) walk(join(p, f));
  };
  for (const p of paths) walk(p);
  return out;
}

/** คะแนนรอบ 0–1: run.score ถ้ามี · ไม่มีคิดจาก grader ที่นับคะแนน (scored !== false) ถ่วง weight */
export function runScore(run) {
  if (typeof run.score === "number") return run.score;
  if (run.error && !run.graders?.length) return 0;
  const scored = (run.graders ?? []).filter((g) => g.scored !== false);
  if (!scored.length) return null;
  const weight = (g) => g.weight ?? 1;
  const passed = (g) => g.passed === true || g.pass === true || (typeof g.score === "number" && g.score >= 1);
  return scored.reduce((s, g) => s + (passed(g) ? weight(g) : 0), 0) / scored.reduce((s, g) => s + weight(g), 0);
}

/** รอบนี้เปิด skill ไหม: grader ชนิด tool_used (นิยามอยู่ที่เคส) ผ่าน · ไม่มีนิยาม → ใช้ว่ารอบผ่าน */
export function skillOpened(run, caseDef, threshold) {
  const toolGraders = new Set((caseDef.graders ?? []).filter((g) => g.type === "tool_used").map((g) => g.name));
  if (toolGraders.size) return (run.graders ?? []).some((g) => toolGraders.has(g.name) && (g.passed === true || g.pass === true));
  const s = runScore(run);
  return s !== null && s >= threshold;
}

/** ชื่อเคส → skill กับชนิด (trigger · no-trigger · behaviour) ตามท้ายชื่อแบบ evals/README.md ของแต่ละ plugin */
export function caseKind(name) {
  if (/-(no-trigger|negative)(-[\w-]+)?$/.test(name)) return { skill: name.replace(/-(trigger-)?(no-trigger|negative)(-[\w-]+)?$/, ""), kind: "no-trigger" };
  if (/-trigger(-[\w-]+)?$/.test(name)) return { skill: name.replace(/-trigger(-[\w-]+)?$/, ""), kind: "trigger" };
  return { skill: name.replace(/-(behaviou?r|guard|regression)(-[\w-]+)?$/, ""), kind: "behaviour" };
}

// ---------- รวมต่อ skill ----------

const blank = () => ({ trigger: { c: 0, n: 0 }, noTrigger: { c: 0, n: 0 }, with: { c: 0, n: 0 }, without: { c: 0, n: 0 }, cost: 0, costRuns: 0 });

/** รวมรอบจากไฟล์ผล eval ลงตารางต่อ skill · plugin มาจาก path ของไฟล์ (plugins/<plugin>/evals/results/...) หรือ "?" */
export function tallyEval(result, acc, { threshold, plugin = "?" } = {}) {
  for (const c of result.cases ?? []) {
    const { skill, kind } = caseKind(c.name);
    const key = `${plugin}/${skill}`;
    const s = (acc[key] ??= blank());
    for (const [arm, runs] of Object.entries(c.arms ?? {})) {
      for (const run of runs ?? []) {
        if (!run) continue; // รอบที่ถูกหยุดก่อนเขียนผลเป็น null ได้
        const score = runScore(run);
        if (score === null) continue;
        const pass = score >= threshold;
        if (arm === "with") {
          if (kind === "trigger") { s.trigger.n++; if (skillOpened(run, c, threshold)) s.trigger.c++; }
          else if (kind === "no-trigger") { s.noTrigger.n++; if (!pass) s.noTrigger.c++; } // เคสเขียนให้ผ่าน = ไม่เปิด · ไม่ผ่าน = เปิดผิด
          else { s.with.n++; if (pass) s.with.c++; }
          const cost = run.costUsd ?? run.cost_usd ?? run.total_cost_usd;
          if (typeof cost === "number") { s.cost += cost; s.costRuns += pass ? 1 : 0; }
        } else if (arm === "without" && kind === "behaviour") { s.without.n++; if (pass) s.without.c++; }
      }
    }
  }
  return acc;
}

/** รวม recall จากชุด triggers: cases.json บอกว่าเคสไหนต้องเปิด skill ไหน · <id>-<n>.json บอกว่ารอบนั้นเปิดอะไร */
export function tallyTriggers(cases, runs, acc, pluginOf = () => "?") {
  const base = (s) => String(s ?? "").split(":").pop();
  for (const r of runs) {
    const c = cases.find((x) => x.id === r.id);
    if (!c) continue;
    const got = new Set((r.skills ?? []).map(base));
    for (const skill of [...(c.expect_all ?? []), ...(c.expect_any ?? [])]) {
      const s = (acc[`${pluginOf(skill)}/${skill}`] ??= blank());
      s.trigger.n++; if (got.has(skill)) s.trigger.c++;
    }
    for (const skill of c.expect_none ?? []) {
      const s = (acc[`${pluginOf(skill)}/${skill}`] ??= blank());
      s.noTrigger.n++; if (got.has(skill)) s.noTrigger.c++;
    }
  }
  return acc;
}

// ---------- ให้ระดับ ----------

const rate = ({ c, n }) => (n ? c / n : null);

/** แถวผลต่อ skill: ตัวเลขทุกตัว + ระดับ + สิ่งที่ควรทำต่อ */
export function gradeSkill(key, s, k) {
  const [plugin, skill] = key.split("/");
  const recall = rate(s.trigger), falseTrigger = rate(s.noTrigger);
  const withCI = wilson(s.with.c, s.with.n), uplift = s.without.n ? diffCI(s.with.c, s.with.n, s.without.c, s.without.n) : null;
  const passK = s.with.n >= k ? passHatK(s.with.c, s.with.n, k) : null;
  const enough = (x) => x.n >= RULE.minRuns;
  const recallOk = enough(s.trigger) && recall >= RULE.recall;
  const falseOk = enough(s.noTrigger) && falseTrigger <= RULE.falseTrigger;
  const passOk = enough(s.with) && withCI.p >= RULE.pass;
  const upliftOk = uplift && s.with.n >= RULE.upliftRuns && s.without.n >= RULE.upliftRuns && uplift.lo > 0;
  const grade = recallOk && falseOk && passOk ? (upliftOk ? "A*" : "B") : "C";

  const next = [];
  if (!s.trigger.n) next.push("เขียนเคสเปิด");
  else if (!recallOk && passOk) next.push("แก้ description (เนื้อดีแต่เรียกไม่ขึ้น)");
  else if (!recallOk && !enough(s.trigger)) next.push("รันเคสเปิดให้ถึง 3 รอบ");
  if (!s.noTrigger.n) next.push("เขียนเคสไม่ควรเปิด"); else if (enough(s.noTrigger) && !falseOk) next.push("คำอธิบายกว้างไป เปิดผิด");
  if (!s.with.n) next.push("เขียนเคสพฤติกรรม");
  else if (enough(s.with) && !passOk) next.push("แก้เนื้อ (ผ่านต่ำกว่า 0.80)");
  else if (uplift && s.with.n >= RULE.upliftRuns && s.without.n >= RULE.upliftRuns) {
    if (uplift.hi <= 0) next.push("เสนอรวมกับตัวข้างเคียงหรือตัด (ไม่มี skill ก็ทำได้เท่ากัน)");
    else if (uplift.lo <= 0) next.push("ช่วง uplift คร่อม 0 สรุปไม่ได้ · รันเพิ่ม หรือเกณฑ์ง่ายจนไม่มี skill ก็ผ่าน");
  } else if (grade === "B") next.push(`รันเพิ่มให้ถึง ${RULE.upliftRuns} รอบต่อแขนเพื่อวัด uplift`);
  return { plugin, skill, recall, falseTrigger, withCI, withoutRate: rate(s.without), uplift, passK, k,
    costPerPass: s.costRuns ? s.cost / s.costRuns : null, runs: s, grade, next: next.join(" · ") || "ใช้จริง 30 วันแล้วเติมชั้น 4" };
}

export function gradeAll(acc, k = 3) {
  return Object.entries(acc).map(([key, s]) => gradeSkill(key, s, k)).sort((a, b) => a.plugin.localeCompare(b.plugin) || a.skill.localeCompare(b.skill));
}

// ---------- แสดงผล ----------

const f2 = (x) => (x === null || x === undefined ? "–" : (Math.abs(x) < 0.005 ? 0 : x).toFixed(2));
const fCI = (ci, key = "p") => (ci ? `${f2(ci[key])} (${f2(ci.lo)}–${f2(ci.hi)})` : "–");
const fRuns = ({ c, n }) => (n ? `${c}/${n}` : "–");
const fRate = (x, runs) => (runs.n ? `${f2(x)} ${fRuns(runs)}` : "–");

export function toMarkdown(rows, when = new Date().toISOString().slice(0, 10)) {
  const head = `# ระดับต่อ skill จากผลรันจริง · ${when} · ${rows.length} skill · ช่วง = 95% Wilson · uplift = ผ่านมี − ไม่มี skill (Newcombe) · pass^k ตาม τ-bench\n\n` +
    "| plugin | skill | recall (เปิด) | false trigger | ผ่าน มี skill | ผ่าน ไม่มี | uplift | pass^k | $/งานที่ผ่าน | ระดับ | ทำต่อ |\n|---|---|---|---|---|---|---|---|---|---|---|\n";
  const body = rows.map((r) => `| ${r.plugin} | ${r.skill} | ${fRate(r.recall, r.runs.trigger)} | ${fRate(r.falseTrigger, r.runs.noTrigger)} | ${r.withCI ? `${fCI(r.withCI)} ${fRuns(r.runs.with)}` : "–"} | ${fRate(r.withoutRate, r.runs.without)} | ${fCI(r.uplift, "d")} | ${f2(r.passK)} (k=${r.k}) | ${f2(r.costPerPass)} | ${r.grade} | ${r.next} |`).join("\n");
  return head + body + "\n";
}

// ---------- self-test ----------

function selfTest() {
  const run = (passes, weights = passes.map(() => 1)) => ({ graders: passes.map((p, i) => ({ name: `g${i}`, passed: p, weight: weights[i] })) });
  const opened = (yes) => ({ graders: [{ name: "skill-opened", passed: yes }] });
  const sample = { cases: [
    { name: "doc-quotation-trigger", graders: [{ name: "skill-opened", type: "tool_used" }], arms: { with: [opened(true), opened(true), opened(false)] } },
    { name: "doc-quotation-no-trigger", arms: { with: [run([true]), run([true]), run([true])] } },
    { name: "doc-quotation-behaviour", arms: { with: Array(10).fill(run([true])), without: Array(10).fill(run([false])) } },
    { name: "cash-flow-behaviour", arms: { with: [run([true, false], [3, 1]), run([true, true])], without: [run([false, false])] } },
  ] };
  const acc = tallyEval(sample, {}, { threshold: 0.8, plugin: "e-commerce" });
  const rows = gradeAll(acc, 3);
  const quote = rows.find((r) => r.skill === "doc-quotation"), cash = rows.find((r) => r.skill === "cash-flow");
  const trig = tallyTriggers([{ id: "t1", expect_all: ["human-writing"], expect_none: ["superuser"] }],
    [{ id: "t1", run: 1, skills: ["superuser:human-writing", "superuser:superuser"] }, { id: "t1", run: 2, skills: ["human-writing"] }], {}, () => "superuser");
  const cases = [
    ["ชนิดเคสจากชื่อ", caseKind("x-trigger-negative").kind === "no-trigger" && caseKind("x-trigger-2").kind === "trigger" && caseKind("x-behaviour-vat").skill === "x" && caseKind("x-guard").kind === "behaviour"],
    ["คะแนนรอบถ่วงน้ำหนัก 3/4", Math.abs(runScore(run([true, false], [3, 1])) - 0.75) < 1e-9],
    ["run.score ชนะ graders", runScore({ score: 0.5, graders: [{ passed: true }] }) === 0.5],
    ["grader ที่ scored:false ไม่นับ", runScore({ graders: [{ passed: false, scored: false }, { passed: true }] }) === 1],
    ["รอบที่ error ไม่มี grader = 0", runScore({ error: "timed out" }) === 0],
    ["recall 2/3", quote.runs.trigger.c === 2 && quote.runs.trigger.n === 3],
    ["false trigger 0/3", quote.falseTrigger === 0],
    ["ผ่านมี 10/10 ไม่มี 0/10 uplift ขอบล่าง > 0", quote.uplift.lo > 0],
    ["recall ต่ำกว่า 0.90 จึงยังไม่ถึง B", quote.grade === "C" && quote.next.startsWith("แก้ description")],
    ["cash-flow รอบ 0.75 ไม่ผ่านที่ 0.8 → ผ่าน 1/2", cash.runs.with.c === 1 && cash.runs.with.n === 2],
    ["pass^k ไม่มีเมื่อรอบน้อยกว่า k", cash.passK === null],
    ["triggers: human-writing เปิด 2/2", trig["superuser/human-writing"].trigger.c === 2],
    ["triggers: superuser เปิดผิด 1/2", trig["superuser/superuser"].noTrigger.c === 1 && trig["superuser/superuser"].noTrigger.n === 2],
    ["markdown มีแถวครบ", toMarkdown(rows).split("\n").filter((l) => l.startsWith("| e-commerce")).length === 2],
    ["รอบ null ไม่ล้ม", tallyEval({ cases: [{ name: "x-behaviour", arms: { with: [null, run([true])] } }] }, {}, { threshold: 0.8 })["?/x"].with.n === 1],
    ["ไฟล์ JSON เสียคืน null", readJson(fileURLToPath(import.meta.url)) === null],
  ];
  let ok = 0;
  for (const [name, pass] of cases) { console.log(`${pass ? "ผ่าน" : "ไม่ผ่าน"}  ${name}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}

// ---------- main ----------

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) return selfTest();
  const opts = (flag) => args.flatMap((a, i) => (a === flag ? [args[i + 1]] : []));
  const threshold = Number(opts("--threshold")[0] ?? 0.8), k = Number(opts("--k")[0] ?? 3);
  const onlyPlugin = opts("--plugin")[0], mdPath = opts("--md")[0];

  // plugin จาก path: plugins/<plugin>/evals/results/... (รัน claude plugin eval ตรง) หรือ _to_delete/eval-<plugin>.json (ผ่าน plugin-eval.mjs ที่รันบนสำเนาชั่วคราว)
  const plugins = readdirSync(join(ROOT, "plugins"));
  const pluginOfPath = (p) => {
    const posix = p.replace(/\\/g, "/");
    const inPlugins = posix.match(/plugins\/([^/]+)\/evals/)?.[1];
    // ชื่อ plugin มีขีดกลาง (trading-finance) จึงเทียบกับรายชื่อจริง เอาตัวที่ยาวสุดที่ขึ้นต้นตรง
    const byName = plugins.filter((n) => posix.split("/").pop().startsWith(`eval-${n}`)).sort((a, b) => b.length - a.length)[0];
    return inPlugins ?? byName ?? "?";
  };
  const defaultPaths = [...plugins.map((p) => join(ROOT, "plugins", p, "evals", "results")),
    ...(isDir(join(ROOT, "_to_delete")) ? readdirSync(join(ROOT, "_to_delete")).filter((f) => /^eval-.*\.json$/.test(f)).map((f) => join(ROOT, "_to_delete", f)) : [])];
  const resultPaths = opts("--results").length ? opts("--results") : defaultPaths;
  const files = findResultFiles(resultPaths).filter((f) => !onlyPlugin || pluginOfPath(f) === onlyPlugin);
  const acc = {};
  let totalCost = 0;
  for (const f of files) {
    const result = readJson(f);
    if (!Array.isArray(result?.cases)) continue;
    tallyEval(result, acc, { threshold, plugin: pluginOfPath(f) });
    totalCost += result.costUsd ?? 0;
    if (result.partial) console.error(`หมายเหตุ: ${f} รันไม่ครบ (${result.partialReason ?? "ไม่บอกเหตุ"})`);
  }
  for (const dir of opts("--triggers")) {
    const cases = readJson(join(ROOT, "scripts/evals/triggers/cases.json"));
    if (!Array.isArray(cases)) continue;
    const runs = findResultFiles([dir]).filter((f) => /-\d+\.json$/.test(f)).map(readJson).filter(Boolean);
    const pluginOf = (skill) => readdirSync(join(ROOT, "plugins")).find((p) => existsSync(join(ROOT, "plugins", p, "skills", skill))) ?? "?";
    tallyTriggers(cases, runs, acc, pluginOf);
  }
  if (!Object.keys(acc).length) {
    console.error("ไม่เจอผลรัน · รัน `node scripts/evals/plugin-eval.mjs <plugin> --max-cost-usd <เพดาน>` ก่อน หรือชี้ --results ไปที่ไฟล์ของ `claude plugin eval --json`");
    process.exit(2);
  }
  const rows = gradeAll(acc, k).filter((r) => !onlyPlugin || r.plugin === onlyPlugin);
  console.table(rows.map((r) => ({ plugin: r.plugin, skill: r.skill, recall: f2(r.recall), "false trig": f2(r.falseTrigger), "ผ่านมี": fCI(r.withCI), "ผ่านไม่มี": f2(r.withoutRate), uplift: fCI(r.uplift, "d"), [`pass^${k}`]: f2(r.passK), "ระดับ": r.grade, "ทำต่อ": r.next })));
  // costUsd ระดับไฟล์รวมทั้ง 2 แขนและผู้ตัดสิน · ต่อรอบที่ผ่านจึงเป็นค่าหยาบทั้งชุด ส่วนต่อ skill (คอลัมน์ $/งานที่ผ่าน) มีเฉพาะเมื่อรอบมีค่าใช้จ่ายของตัวเอง
  const passedRuns = rows.reduce((s, r) => s + r.runs.with.c + r.runs.trigger.c, 0);
  console.log(`\nไฟล์ผล ${files.length} · ค่าใช้จ่ายรวม $${totalCost.toFixed(2)} · หยาบ ๆ ต่อรอบที่ผ่านแขนมี skill $${passedRuns ? (totalCost / passedRuns).toFixed(2) : "–"} · ระดับ: ${["A*", "B", "C"].map((g) => `${g} ${rows.filter((r) => r.grade === g).length}`).join(" · ")}`);
  if (mdPath) { writeFileSync(mdPath, toMarkdown(rows)); console.log(`เขียนตาราง ${rows.length} แถวที่ ${mdPath}`); }
}

main();
