// ประตูรับรุ่นใหม่: ความแกว่ง A/A · เกณฑ์ต่อชุด · คำตัดสิน · ไม่อ่านไฟล์ ไม่พิมพ์
// สูตรดัดแปลงจาก skillopt.py (noise_of · se_diff · cmd_gate) ของคอร์ส CWN2026 สัปดาห์ 2 บท Skill Optimization · เรียบเรียงใหม่ 2026-11-11
export const COST_METRICS = ["cost_usd", "turns", "tokens"];
export const JUDGED_SPLITS = ["train", "val"]; // test ไม่ใช้ตัดสิน รันครั้งเดียวกับรุ่นสุดท้ายเพื่อยืนยัน
const MIN_COST_CUT = 0.1; // คะแนนเท่าเดิมแต่ต้นทุนลดอย่างน้อย 10% จึงรับ

const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;

function groupByCase(rows) {
  const out = {};
  for (const r of rows) (out[r.case] ??= []).push(r.score);
  return out;
}

/** ความแกว่งของรุ่นเดียว: sd ระหว่างรอบของเคสเดียวกัน (รวมทุกเคสแบบ pooled) · seMean = sd / √รอบทั้งหมด · null ถ้าไม่มีเคสที่รัน ≥ 2 รอบ */
export function noiseOf(rows) {
  let sumSquares = 0, dof = 0, trials = 0, cases = 0, moved = 0;
  for (const scores of Object.values(groupByCase(rows))) {
    if (scores.length < 2) continue;
    const m = mean(scores);
    sumSquares += scores.reduce((s, x) => s + (x - m) ** 2, 0);
    dof += scores.length - 1;
    trials += scores.length;
    cases++;
    if (Math.max(...scores) - Math.min(...scores) > 1e-9) moved++;
  }
  if (!dof) return null;
  const sd = Math.sqrt(sumSquares / dof);
  return { cases, trials, moved, sd, seMean: sd / Math.sqrt(trials) };
}

/** ความแกว่งของ "ส่วนต่างค่าเฉลี่ย" ระหว่าง 2 รุ่น = √(se ฐาน² + se ใหม่²) · null ถ้ารุ่นใดรันเคสละรอบเดียว */
export function seDiff(baseRows, candRows) {
  const b = noiseOf(baseRows), c = noiseOf(candRows);
  return b && c ? Math.hypot(b.seMean, c.seMean) : null;
}

/** เหตุที่เทียบไม่ได้ (ว่าง = เทียบได้) */
export function comparability(base, cand, costMetric) {
  const problems = [];
  const keys = (rows) => new Set(rows.map((r) => `${r.case}#${r.rep}`));
  const kb = keys(base.rows), kc = keys(cand.rows);
  const onlyBase = [...kb].filter((k) => !kc.has(k)), onlyCand = [...kc].filter((k) => !kb.has(k));
  if (!kb.size) problems.push("ไม่มีรอบให้เทียบ (ตัวกรองเคสหรือ label ไม่ตรงไฟล์)");
  const list = (keys) => (keys.length ? ` (${keys.slice(0, 6).join(" ")}${keys.length > 6 ? " …" : ""})` : "");
  if (onlyBase.length || onlyCand.length)
    problems.push(`เคส × รอบ ไม่ตรงกัน · มีเฉพาะฐาน ${onlyBase.length}${list(onlyBase)} · มีเฉพาะรุ่นใหม่ ${onlyCand.length}${list(onlyCand)} → รันให้ครบชุดเดียวกัน หรือกรองด้วย --only`);
  const sig = (rows) => Object.fromEntries(rows.map((r) => [r.case, r.signature]));
  const sb = sig(base.rows), sc = sig(cand.rows);
  const changed = Object.keys(sb).filter((c) => sb[c] && sc[c] && sb[c] !== sc[c]);
  if (changed.length)
    problems.push(`โจทย์หรือตัวตรวจเปลี่ยนระหว่าง 2 รุ่น: ${changed.join(" ")} → รันรุ่นฐานใหม่ด้วยตัวตรวจชุดเดียวกัน (ห้ามตรวจรุ่นเก่าด้วยตัวตรวจเก่า รุ่นใหม่ด้วยตัวตรวจใหม่)`);
  if (base.model && cand.model && base.model !== cand.model)
    problems.push(`model ต่างกัน (${base.model} กับ ${cand.model}) → วัดซ้ำด้วย model effort และจำนวนรอบเดิม`);
  if (!COST_METRICS.includes(costMetric))
    problems.push(`ยังไม่ได้ประกาศตัวชี้วัดต้นทุน (${COST_METRICS.join(" · ")}) → ใส่ใน split ก่อนวัดรุ่นใหม่ ห้ามเลือกหลังเห็นผล`);
  else if ([...base.rows, ...cand.rows].some((r) => typeof r[costMetric] !== "number"))
    problems.push(`ไฟล์ผลไม่มีค่า ${costMetric} ทุกรอบ (plugin eval มีแค่ cost_usd กับ turns)`);
  return problems;
}

function summarize(base, cand, split, { eps, z, costMetric }) {
  const pick = (rows) => rows.filter((r) => (split === "all" ? JUDGED_SPLITS.includes(r.split) : r.split === split));
  const b = pick(base.rows), c = pick(cand.rows);
  if (!b.length) return null;
  const sd = seDiff(b, c);
  const baseScore = mean(b.map((r) => r.score)), candScore = mean(c.map((r) => r.score));
  return {
    split, runs: b.length, baseScore, candScore, diff: candScore - baseScore, seDiff: sd,
    threshold: sd === null ? eps : Math.max(eps, z * sd),
    baseCost: mean(b.map((r) => r[costMetric])), candCost: mean(c.map((r) => r[costMetric])),
  };
}

const pts = (x) => `${(x * 100).toFixed(1)} จุด`;
const costChange = (metric, cut) => `${metric} ${cut >= 0 ? "ลดลง" : "เพิ่มขึ้น"} ${Math.abs(cut * 100).toFixed(0)}%`;

/** base/cand = { rows (มี split แล้ว), model } → { verdict: accept|reject|incomparable, reasons, table, warnings } */
export function decide(base, cand, { eps = 0.02, z = 1.5, costMetric } = {}) {
  const opts = { eps, z, costMetric };
  const warnings = [base, cand].flatMap((v, i) => {
    const bad = v.rows.filter((r) => r.abnormal);
    return bad.length ? [`${i ? "รุ่นใหม่" : "ฐาน"} มี ${bad.length} รอบจบไม่ปกติ (error หรือไม่มีคะแนน): ${bad.slice(0, 6).map((r) => `${r.case}#${r.rep}`).join(" ")} → ถ้าเป็นเหตุของระบบ (โควตา เครือข่าย) ให้รันรอบนั้นซ้ำก่อนตัดสิน`] : [];
  });
  const problems = comparability(base, cand, costMetric);
  if (problems.length) return { verdict: "incomparable", reasons: problems, table: [], warnings };

  const reasons = [], table = [];
  let ok = true;
  const bySplit = {};
  for (const split of JUDGED_SPLITS) {
    const s = summarize(base, cand, split, opts);
    if (!s) { ok = false; reasons.push(`ไม่มีเคสชุด ${split} → ตัดสินไม่ได้ว่าจำโจทย์หรือไม่ (ใส่ split ให้เคส)`); continue; }
    bySplit[split] = s;
    table.push(s);
  }
  const { train, val } = bySplit;
  if (train && train.diff < -train.threshold) { ok = false; reasons.push(`ชุด train ลดลง ${pts(-train.diff)} เกินเกณฑ์ ${pts(train.threshold)} → การแก้ไม่ได้ผล`); }
  if (val && val.diff < -val.threshold) {
    ok = false;
    reasons.push(train && train.diff > 0
      ? `ชุด train ขึ้นแต่ชุด val ลดลง ${pts(-val.diff)} เกินเกณฑ์ ${pts(val.threshold)} → จำโจทย์ train (overfit) ไม่รับ`
      : `ชุด val ลดลง ${pts(-val.diff)} เกินเกณฑ์ ${pts(val.threshold)} → ทำของเดิมพัง`);
  }
  const all = summarize(base, cand, "all", opts);
  if (all) table.push(all);
  const test = summarize(base, cand, "test", opts);
  if (test) table.push({ ...test, note: "ไม่ใช้ตัดสิน" });

  if (ok) {
    const costCut = all.baseCost > 0 ? 1 - all.candCost / all.baseCost : 0;
    if (all.diff > all.threshold) reasons.push(`คะแนนรวมดีขึ้น ${pts(all.diff)} มากกว่าเกณฑ์ ${pts(all.threshold)}`);
    else if (all.diff >= -all.threshold && costCut >= MIN_COST_CUT) reasons.push(`คะแนนรวมไม่ลดเกินเกณฑ์ และ ${costChange(costMetric, costCut)} (ต้องลดอย่างน้อย 10%)`);
    else { ok = false; reasons.push(`คะแนนรวมเปลี่ยน ${pts(all.diff)} ไม่เกินเกณฑ์ ${pts(all.threshold)} และ ${costChange(costMetric, costCut)} ไม่ได้ลดถึง 10% → ยังไม่มีหลักฐานพอให้รับ`); }
  }
  return { verdict: ok ? "accept" : "reject", reasons, table, warnings };
}
