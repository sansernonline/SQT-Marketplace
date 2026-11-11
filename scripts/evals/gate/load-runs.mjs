// อ่านผลรัน 2 แบบให้เป็นแถวรูปเดียวกัน: ผลของ `claude plugin eval --json` และโฟลเดอร์ไฟล์รายรอบของ bench (speed/run-bench.mjs)
// แถว 1 รอบ = { case, rep, score 0–1, cost_usd, turns, tokens, abnormal, signature }
// signature = แฮชของโจทย์ + ตัวตรวจ ใช้จับว่ารุ่นฐานกับรุ่นใหม่ถูกตรวจด้วยตัวตรวจคนละชุด (bench ไม่มี จึงเป็น null)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const sha1 = (s) => createHash("sha1").update(s).digest("hex").slice(0, 12);

/** ไฟล์ .json = ผล plugin eval · โฟลเดอร์ = bench (ต้องมี label เช่น old · new · none) → { rows, model } */
export function loadRuns(path, { arm = "with", label } = {}) {
  if (statSync(path).isDirectory()) return loadBench(path, label);
  return loadPluginEval(JSON.parse(readFileSync(path, "utf8")), arm);
}

export function loadPluginEval(result, arm) {
  if (!Array.isArray(result.cases)) throw new Error("ไม่ใช่ผลของ claude plugin eval --json (ไม่มี cases)");
  const rows = [];
  for (const c of result.cases) {
    const signature = sha1(JSON.stringify([c.promptMarkdown, c.graders]));
    (c.arms?.[arm] ?? []).forEach((run, i) => {
      if (!run) return; // รอบที่ถูกหยุดก่อนเขียนผล ไม่นับ · ชุดรอบของ 2 รุ่นจะไม่ตรงกันแล้ว gate จะไม่ตัดสิน
      const hasScore = typeof run.score === "number";
      rows.push({
        case: c.name, rep: i + 1, score: hasScore ? run.score : 0,
        cost_usd: run.costUsd, turns: run.turns, tokens: undefined,
        abnormal: Boolean(run.error) || !hasScore, signature,
      });
    });
  }
  return { rows, model: result.suite?.modelOverride ?? null };
}

/** ไฟล์ <เคส>-<label>-<รอบ>.json · คะแนน = test ที่ซ่อนไว้ที่ผ่าน (hidden "5/7") ไม่มีใช้ passAll */
export function loadBench(dir, label) {
  if (!label) throw new Error("โฟลเดอร์ bench ต้องบอก label ของรุ่น (--base-label / --cand-label / --label เช่น old · new · none)");
  const rows = [];
  for (const file of readdirSync(dir)) {
    const m = file.match(/^(.+)-([^-]+)-(\d+)\.json$/);
    if (!m || m[2] !== label) continue;
    let run;
    try { run = JSON.parse(readFileSync(join(dir, file), "utf8")); }
    catch { console.error(`อ่านไม่ได้ ข้าม: ${file} (bench อาจยังเขียนไม่เสร็จ)`); continue; }
    const [passed, total] = String(run.hidden ?? "").split("/").map(Number);
    rows.push({
      case: m[1], rep: Number(m[3]), score: total ? passed / total : run.passAll ? 1 : 0,
      cost_usd: run.cost, turns: run.turns, tokens: run.tokens,
      abnormal: Boolean(run.error), signature: null,
    });
  }
  return { rows, model: null };
}
