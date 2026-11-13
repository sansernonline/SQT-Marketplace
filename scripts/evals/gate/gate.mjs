#!/usr/bin/env node
// ประตูรับรุ่นใหม่ของ skill จากผลรัน 2 รุ่น · ไม่เรียก model ไม่เสียเงิน
// ดัดแปลงจากคอร์ส CWN2026 สัปดาห์ 2 บท Skill Optimization (skill-optimizer) ของเจ้าของ repo · เรียบเรียงใหม่ 2026-11-11
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { loadRuns, loadPluginEval, loadBench } from "./load-runs.mjs";
import { decide, noiseOf, seDiff, COST_METRICS } from "./decide.mjs";

const HELP = `ใช้:
  node scripts/evals/gate/gate.mjs --base <ผล> --cand <ผล> --split <split.json> [ตัวเลือก]
  node scripts/evals/gate/gate.mjs --null <ผล> [--split <split.json>] [--label <x>]   ความแกว่ง A/A ของรุ่นเดียวจากรอบซ้ำ
  node scripts/evals/gate/gate.mjs --self-test

<ผล> = ไฟล์ JSON จาก \`claude plugin eval --json\` (หรือ plugin-eval.mjs --json) · หรือโฟลเดอร์ runs/ ของ bench (ต้องมี label)
split.json = { "costMetric": "cost_usd", "splits": { "<ชื่อเคส>": "train" | "val" | "test" } } · เคสที่ไม่อยู่ในรายการนับเป็น train
  costMetric ประกาศก่อนวัดรุ่นใหม่: ${COST_METRICS.join(" · ")} (plugin eval มี cost_usd กับ turns · bench มีครบรวม tool_calls = คำสั่งต่อรอบ)

ตัวเลือก
  --only <regex>          กรองชื่อเคส
  --arm with|without      แขนของ plugin eval (ค่าเริ่ม with)
  --base-label / --cand-label / --label <x>   label ของ bench เช่น old · new · none
  --cost-metric <x>       ใช้เมื่อไม่มี split.json · ถ้า split ประกาศไว้แล้วห้ามเปลี่ยน
  --eps 0.02              เกณฑ์ขั้นต่ำ (2 จุด)
  --z 1.5                 เกณฑ์ = max(eps, z × ความแกว่งของส่วนต่าง) · 1.5 รุ่นที่ไม่ต่างจริงหลุดราว 7% · 2 ราว 2%

exit: 0 รับ · 1 ไม่รับ · 2 เทียบไม่ได้ (เคส × รอบไม่ตรง · ตัวตรวจเปลี่ยน · model ต่าง · ไม่ประกาศต้นทุน · ชุด val ใช้ครบ 3 รุ่น)`;

const VAL_LIMIT = 3; // ชุด val ใช้ตัดสินได้ไม่เกิน 3 รุ่น แล้วต้องเพิ่มโจทย์ val ใหม่

// ---------- split และสมุดการใช้ชุด val ----------

function readSplit(path) {
  if (!path) return { costMetric: undefined, splits: {} };
  const s = JSON.parse(readFileSync(path, "utf8"));
  const bad = Object.entries(s.splits ?? {}).filter(([, v]) => !["train", "val", "test"].includes(v));
  if (bad.length) throw new Error(`split ต้องเป็น train · val · test: ${bad.map(([k, v]) => `${k}=${v}`).join(" ")}`);
  return { costMetric: s.costMetric, splits: s.splits ?? {} };
}

function applySplit(loaded, splits, only) {
  const re = only ? new RegExp(only) : null;
  const rows = loaded.rows.filter((r) => !re || re.test(r.case)).map((r) => ({ ...r, split: splits[r.case] ?? "train" }));
  return { ...loaded, rows };
}

/** สมุดข้างไฟล์ split: รุ่นที่ถูกตัดสินด้วยชุด val ชุดนี้ · ชุด val เปลี่ยน (เพิ่มโจทย์) = เริ่มนับใหม่ */
function valLedger(splitPath, valCases) {
  const file = splitPath.replace(/\.json$/i, "") + ".gate-log.jsonl";
  const valSet = createHash("sha1").update([...valCases].sort().join("\n")).digest("hex").slice(0, 12);
  const entries = existsSync(file) ? readFileSync(file, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : [];
  const judged = new Set(entries.filter((e) => e.valSet === valSet).map((e) => e.cand));
  return {
    file, judged,
    blocks: (cand) => !judged.has(cand) && judged.size >= VAL_LIMIT,
    record(cand, verdict) {
      if (judged.has(cand)) return;
      judged.add(cand);
      appendFileSync(file, JSON.stringify({ date: new Date().toISOString().slice(0, 10), valSet, cand, verdict }) + "\n");
    },
  };
}

// ---------- พิมพ์ ----------

const pct = (x) => `${(x * 100).toFixed(1)}%`;
const pts = (x) => (x === null ? "ไม่รู้ (เคสละรอบเดียว)" : `${(x * 100).toFixed(1)}`);
const num = (x) => (Math.abs(x) >= 100 ? x.toFixed(0) : x.toFixed(3));

function printTable(table, costMetric) {
  console.log(`| ชุด | รอบ | ฐาน | ใหม่ | ต่าง (จุด) | ความแกว่งของส่วนต่าง (จุด) | เกณฑ์ (จุด) | ${costMetric} ฐาน → ใหม่ |`);
  console.log("|---|---|---|---|---|---|---|---|");
  for (const s of table) {
    const name = s.split === "all" ? "รวม train+val" : s.note ? `${s.split} (${s.note})` : s.split;
    const sign = s.diff >= 0 ? "+" : "";
    console.log(`| ${name} | ${s.runs} | ${pct(s.baseScore)} | ${pct(s.candScore)} | ${sign}${(s.diff * 100).toFixed(1)} | ${pts(s.seDiff)} | ${(s.threshold * 100).toFixed(1)} | ${num(s.baseCost)} → ${num(s.candCost)} |`);
  }
}

const VERDICT = { accept: ["รับ", 0], reject: ["ไม่รับ", 1], incomparable: ["เทียบไม่ได้", 2] };

function runGate(opt) {
  const split = readSplit(opt.split);
  if (split.costMetric && opt.costMetric && opt.costMetric !== split.costMetric) {
    console.log(`เทียบไม่ได้: split ประกาศตัวชี้วัดต้นทุนเป็น ${split.costMetric} ไว้แล้ว ห้ามเปลี่ยนเป็น ${opt.costMetric} หลังเห็นผล`);
    return 2;
  }
  const costMetric = split.costMetric ?? opt.costMetric;
  const base = applySplit(loadRuns(opt.base, { arm: opt.arm, label: opt.baseLabel }), split.splits, opt.only);
  const cand = applySplit(loadRuns(opt.cand, { arm: opt.arm, label: opt.candLabel }), split.splits, opt.only);

  const candId = resolve(opt.cand) + (opt.candLabel ? `#${opt.candLabel}` : "");
  const valCases = new Set(base.rows.filter((r) => r.split === "val").map((r) => r.case));
  const ledger = opt.split && valCases.size ? valLedger(opt.split, valCases) : null;
  if (ledger?.blocks(candId)) {
    console.log(`เทียบไม่ได้: ชุด val นี้ใช้ตัดสินครบ ${VAL_LIMIT} รุ่นแล้ว (${ledger.file}) → เพิ่มโจทย์ val ใหม่ หรือรันชุด test ครั้งเดียวกับรุ่นสุดท้าย`);
    return 2;
  }

  const r = decide(base, cand, { eps: opt.eps, z: opt.z, costMetric });
  console.log(`ตัวชี้วัดต้นทุน: ${costMetric ?? "(ไม่ได้ประกาศ)"}${split.costMetric ? " (ประกาศใน split)" : ""} · z ${opt.z} · eps ${opt.eps * 100} จุด\n`);
  if (r.table.length) { printTable(r.table, costMetric); console.log(""); }
  for (const w of r.warnings) console.log(`เตือน: ${w}`);
  for (const line of r.reasons) console.log(`- ${line}`);
  if (ledger && r.verdict !== "incomparable") {
    ledger.record(candId, r.verdict);
    console.log(`ชุด val ใช้ตัดสินแล้ว ${ledger.judged.size}/${VAL_LIMIT} รุ่น`);
  }
  const [word, code] = VERDICT[r.verdict];
  console.log(`\nผล: ${word} (exit ${code})`);
  if (r.verdict === "accept") console.log(`ผ่านประตูไม่ใช่ข้อพิสูจน์: ที่ z ${opt.z} รุ่นที่ไม่ต่างจริงยังหลุดผ่านได้ราว ${opt.z >= 2 ? "2" : "7"}% · งานที่พลาดแล้วเสียหายมากใช้ --z 2 และเพิ่มรอบ`);
  return code;
}

function runNull(opt) {
  const split = readSplit(opt.split);
  const loaded = applySplit(loadRuns(opt.null, { arm: opt.arm, label: opt.label }), split.splits, opt.only);
  const splitsSeen = new Set(loaded.rows.map((r) => r.split));
  for (const name of ["train", "val", "test", "all"]) {
    if (name === "all" && splitsSeen.size < 2) continue; // มีชุดเดียว แถว "all" ซ้ำกับแถวบน
    const rows = loaded.rows.filter((r) => name === "all" || r.split === name);
    if (!rows.length) continue;
    const n = noiseOf(rows);
    if (!n) { console.log(`${name}: ไม่มีข้อมูล (ต้องรันเคสละอย่างน้อย 2 รอบ)`); continue; }
    console.log(`${name}: ${n.cases} เคส ${n.trials} รอบ · คะแนนต่างกันระหว่างรอบ ${n.moved} เคส · sd ระหว่างรอบ ${(n.sd * 100).toFixed(1)} จุด · ความแกว่งของค่าเฉลี่ย ${(n.seMean * 100).toFixed(1)} จุด · ความแกว่งของส่วนต่าง 2 รุ่น ${(n.seMean * Math.SQRT2 * 100).toFixed(1)} จุด`);
  }
  console.log(`รุ่นเดียวกัน เคสเดียวกัน ยังได้คะแนนต่างกันเท่านี้ · ส่วนต่างที่น้อยกว่า ${opt.z} เท่าของ "ความแกว่งของส่วนต่าง" ถือว่าไม่ต่าง · ถ้าค่านี้ใหญ่กว่าส่วนต่างที่หวัง ให้เพิ่มรอบหรือเคสก่อนเริ่มแก้`);
  return 0;
}

// ---------- self-test ----------

function selfTest() {
  // rows(split, case, [scores], cost) → แถวรอบ
  const rows = (spec) => spec.flatMap(([split, c, scores, cost = 1]) => scores.map((score, i) => ({ case: c, rep: i + 1, split, score, cost_usd: cost, turns: 5, abnormal: false, signature: "s" })));
  const v = (spec) => ({ rows: rows(spec), model: "sonnet" });
  const g = (b, c, extra = {}) => decide(v(b), v(c), { costMetric: "cost_usd", ...extra });
  const near = (a, b) => Math.abs(a - b) < 1e-3;

  const n = noiseOf(rows([["train", "a", [1, 0]], ["train", "b", [1, 1, 1]]]));
  const big = g([["train", "t", [0, 0, 0]], ["val", "v", [0, 0, 0]]], [["train", "t", [1, 1, 1]], ["val", "v", [1, 1, 1]]]);
  const overfit = g([["train", "t", [0.5, 0.5]], ["val", "v", [1, 1]]], [["train", "t", [1, 1]], ["val", "v", [0.5, 0.5]]]);
  const cheaper = g([["train", "t", [1, 1]], ["val", "v", [1, 1]]], [["train", "t", [1, 1], 0.8], ["val", "v", [1, 1], 0.8]]);
  const slightly = g([["train", "t", [1, 1]], ["val", "v", [1, 1]]], [["train", "t", [1, 1], 0.95], ["val", "v", [1, 1], 0.95]]);
  const noisy = g([["train", "t", [0, 1, 0, 1]], ["val", "v", [0, 1, 0, 1]]], [["train", "t", [1, 1, 0, 1]], ["val", "v", [1, 1, 0, 1]]]);
  const noVal = g([["train", "t", [0, 0]]], [["train", "t", [1, 1]]]);
  const missingRep = g([["train", "t", [0, 0, 0]], ["val", "v", [0, 0]]], [["train", "t", [1, 1]], ["val", "v", [1, 1]]]);
  const changedGrader = (() => { const c = v([["train", "t", [1, 1]], ["val", "v", [1, 1]]]); c.rows[0].signature = c.rows[1].signature = "x"; return decide(v([["train", "t", [0, 0]], ["val", "v", [0, 0]]]), c, { costMetric: "cost_usd" }); })();
  const noMetric = g([["train", "t", [0, 0]], ["val", "v", [0, 0]]], [["train", "t", [1, 1]], ["val", "v", [1, 1]]], { costMetric: undefined });
  const tokensMissing = g([["train", "t", [0, 0]], ["val", "v", [0, 0]]], [["train", "t", [1, 1]], ["val", "v", [1, 1]]], { costMetric: "tokens" });
  const withCalls = (spec, calls) => ({ ...v(spec), rows: v(spec).rows.map((r) => ({ ...r, tool_calls: calls })) });
  const fewerCalls = decide(withCalls([["train", "t", [1, 1]], ["val", "v", [1, 1]]], 11), withCalls([["train", "t", [1, 1]], ["val", "v", [1, 1]]], 6.5), { costMetric: "tool_calls" });
  const callsMissing = g([["train", "t", [0, 0]], ["val", "v", [0, 0]]], [["train", "t", [1, 1]], ["val", "v", [1, 1]]], { costMetric: "tool_calls" });
  const valThree = g([["train", "t", [0, 0]], ["val", "v1", [0, 0]], ["val", "v2", [0, 0]], ["val", "v3", [0, 0]]], [["train", "t", [1, 1]], ["val", "v1", [1, 1]], ["val", "v2", [1, 1]], ["val", "v3", [1, 1]]]);
  const testIgnored = g([["train", "t", [0, 0]], ["val", "v", [0, 0]], ["test", "x", [1, 1]]], [["train", "t", [1, 1]], ["val", "v", [1, 1]], ["test", "x", [0, 0]]]);

  const pe = loadPluginEval({ suite: { modelOverride: "sonnet" }, cases: [
    { name: "a-behaviour", promptMarkdown: "p", graders: [{ name: "g" }], arms: { with: [{ score: 0.5, costUsd: 0.1, turns: 3 }, null, { score: 1, costUsd: 0.2, turns: 4, error: "timeout" }] } },
  ] }, "with");

  const dir = mkdtempSync(join(tmpdir(), "gate-selftest-"));
  let benchRows, ledgerOk;
  try {
    mkdirSync(join(dir, "runs"));
    writeFileSync(join(dir, "runs", "t1-new-1.json"), JSON.stringify({ hidden: "5/7", cost: 0.3, turns: 9, tokens: 1000, toolCalls: 7 }));
    writeFileSync(join(dir, "runs", "t1-old-1.json"), JSON.stringify({ passAll: true, cost: 0.4, turns: 9, tokens: 1200 }));
    writeFileSync(join(dir, "runs", "t1-new-2.json"), "{ ยังเขียนไม่เสร็จ");
    benchRows = loadBench(join(dir, "runs"), "new").rows;
    const splitPath = join(dir, "split.json");
    const book = () => valLedger(splitPath, new Set(["v"]));
    for (const c of ["c1", "c2", "c3"]) book().record(c, "reject");
    ledgerOk = book().blocks("c4") && !book().blocks("c2") && !valLedger(splitPath, new Set(["v", "v2"])).blocks("c4");
  } finally { rmSync(dir, { recursive: true, force: true }); }

  const checks = [
    ["ความแกว่ง pooled: sd = √(0.5/3)", near(n.sd, Math.sqrt(0.5 / 3)) && near(n.seMean, Math.sqrt(0.5 / 3 / 5)) && n.moved === 1],
    ["เคสละรอบเดียว = ไม่รู้ความแกว่ง", noiseOf(rows([["train", "a", [1]]])) === null && seDiff(rows([["train", "a", [1]]]), rows([["train", "a", [0]]])) === null],
    ["ดีขึ้นชัดเจน → รับ", big.verdict === "accept"],
    ["train ขึ้น val ลง → ไม่รับ เพราะ overfit", overfit.verdict === "reject" && overfit.reasons.some((r) => r.includes("overfit"))],
    ["คะแนนเท่าเดิม ต้นทุนลด 20% → รับ", cheaper.verdict === "accept"],
    ["คะแนนเท่าเดิม ต้นทุนลด 5% → ไม่รับ", slightly.verdict === "reject"],
    ["ดีขึ้น 25 จุดแต่ความแกว่งสูง → ไม่รับ", noisy.verdict === "reject" && noisy.table.at(-1).threshold > 0.25],
    ["ไม่มีชุด val → ไม่รับ", noVal.verdict === "reject" && noVal.reasons[0].includes("val")],
    ["รอบไม่ครบ → เทียบไม่ได้", missingRep.verdict === "incomparable"],
    ["ตัวตรวจเปลี่ยน → เทียบไม่ได้", changedGrader.verdict === "incomparable" && changedGrader.reasons[0].includes("ตัวตรวจ")],
    ["ไม่ประกาศตัวชี้วัดต้นทุน → เทียบไม่ได้", noMetric.verdict === "incomparable"],
    ["ไม่มีค่า tokens ในผล → เทียบไม่ได้", tokensMissing.verdict === "incomparable"],
    ["ชุด test ไม่ใช้ตัดสิน", testIgnored.verdict === "accept" && testIgnored.table.some((s) => s.note)],
    ["plugin eval: ข้ามรอบ null · รอบ error นับว่าจบไม่ปกติ", pe.rows.length === 2 && pe.rows[1].rep === 3 && pe.rows[1].abnormal && pe.model === "sonnet"],
    ["bench: hidden 5/7 · ไฟล์เขียนไม่เสร็จถูกข้าม · ไม่ปน label อื่น", benchRows.length === 1 && near(benchRows[0].score, 5 / 7) && benchRows[0].tokens === 1000 && benchRows[0].tool_calls === 7],
    ["คะแนนเท่าเดิม คำสั่ง 11 → 6.5 (tool_calls) → รับ", fewerCalls.verdict === "accept" && fewerCalls.reasons[0].includes("tool_calls")],
    ["ไม่มีค่า tool_calls ในผล (plugin eval) → เทียบไม่ได้", callsMissing.verdict === "incomparable" && callsMissing.reasons[0].includes("tool_calls")],
    ["ชุด val 1 เคส → เตือน · 3 เคส → ไม่เตือน", big.warnings.some((w) => w.includes("ชุด val มีแค่ 1")) && !valThree.warnings.some((w) => w.includes("ชุด val มีแค่"))],
    ["ชุด val ใช้ครบ 3 รุ่น รุ่นที่ 4 ถูกกัน · รุ่นเดิมตัดสินซ้ำได้ · เพิ่มโจทย์ val แล้วนับใหม่", ledgerOk],
  ];
  let ok = 0;
  for (const [name, pass] of checks) { console.log(`${pass ? "ผ่าน" : "ไม่ผ่าน"}  ${name}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${checks.length} ผ่าน`);
  return ok === checks.length ? 0 : 1;
}

// ---------- main ----------

function parseArgs(argv) {
  const get = (flag) => { const i = argv.indexOf(flag); return i >= 0 ? argv[i + 1] : undefined; };
  return {
    base: get("--base"), cand: get("--cand"), null: get("--null"), split: get("--split"), only: get("--only"),
    arm: get("--arm") ?? "with", label: get("--label"), baseLabel: get("--base-label") ?? get("--label"), candLabel: get("--cand-label") ?? get("--label"),
    costMetric: get("--cost-metric"), eps: Number(get("--eps") ?? 0.02), z: Number(get("--z") ?? 1.5),
  };
}

function main(argv) {
  if (argv.includes("--self-test")) return selfTest();
  const opt = parseArgs(argv);
  if (opt.null) return runNull(opt);
  if (!opt.base || !opt.cand || argv.includes("-h") || argv.includes("--help")) { console.log(HELP); return 2; }
  return runGate(opt);
}

try { process.exitCode = main(process.argv.slice(2)); }
catch (e) { console.error(`ผิดพลาด: ${e.message}`); process.exitCode = 2; }
