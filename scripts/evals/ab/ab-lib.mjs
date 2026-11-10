// ส่วนที่ไม่เรียก model ของตัวรัน A/B: คีย์แคช · ตรวจแคชเก่า · ให้คะแนนด้วย regex · สรุปผล
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export const sha1 = (s) => createHash("sha1").update(s).digest("hex");

// คีย์แคช = ชุดเคส + จำนวนรอบ + model + plugin · ref เปลี่ยนไม่เปลี่ยนคีย์ แต่ sha ในไฟล์จะไม่ตรง = เก่า
export const cacheKey = ({ cases, runs, model, pluginPath }) =>
  sha1(JSON.stringify({ cases, runs, model, pluginPath })).slice(0, 12);

export const cacheFile = (dir, key) => join(dir, `baseline-${key}.json`);

// คืน { status: "hit" | "stale" | "miss", data?, cachedSha? }
export function readCache(dir, key, currentSha) {
  const f = cacheFile(dir, key);
  if (!existsSync(f)) return { status: "miss" };
  let data;
  try { data = JSON.parse(readFileSync(f, "utf8")); } catch { return { status: "miss" }; }
  return data.sha === currentSha ? { status: "hit", data } : { status: "stale", cachedSha: data.sha };
}

export function writeCache(dir, key, data) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(cacheFile(dir, key), JSON.stringify(data, null, 2));
}

// เคสผ่านเมื่อ regex ใน must ตรงครบ และไม่มี regex ใน must_not ตรงเลย · ไม่มีเกณฑ์สักข้อ = error
export function scoreText(text, check) {
  const must = check?.must ?? [], mustNot = check?.must_not ?? [];
  if (!must.length && !mustNot.length) throw new Error("เคสไม่มี must หรือ must_not");
  const failed = [
    ...must.filter((p) => !new RegExp(p, "i").test(text)).map((p) => `ขาด ${p}`),
    ...mustNot.filter((p) => new RegExp(p, "i").test(text)).map((p) => `มี ${p}`),
  ];
  return { passed: failed.length === 0, failed };
}

// run(prompt) -> { text, costUsd } · หยุดเมื่อค่าใช้จ่ายสะสมถึงเพดาน
export function runArm({ cases, runs, run, maxCostUsd = Infinity }) {
  const out = []; let cost = 0, partial = false;
  outer: for (const c of cases) {
    const rows = [];
    for (let i = 0; i < runs; i++) {
      if (cost >= maxCostUsd) { partial = true; if (rows.length) out.push({ id: c.id, rows }); break outer; }
      const r = run(c.prompt);
      cost += r.costUsd ?? 0;
      rows.push({ ...scoreText(r.text ?? "", c.check), costUsd: r.costUsd ?? 0 });
    }
    out.push({ id: c.id, rows });
  }
  return { cases: out, costUsd: cost, partial };
}

export const passRate = (rows) => (rows.length ? rows.filter((r) => r.passed).length / rows.length : NaN);

// รวม 2 แขนเป็นตารางต่อเคส: อัตราผ่าน และ delta = ใหม่ − baseline
export function compare(base, next) {
  return next.cases.map((n) => {
    const b = base.cases.find((x) => x.id === n.id);
    const bp = b ? passRate(b.rows) : NaN, np = passRate(n.rows);
    return { id: n.id, baseline: bp, next: np, delta: np - bp, runs: n.rows.length };
  });
}

const f2 = (x) => (Number.isNaN(x) ? "-" : x.toFixed(2));
export const fmtTable = (rows) => ["| เคส | baseline | ใหม่ | Δ |", "|---|---|---|---|",
  ...rows.map((r) => `| ${r.id} | ${f2(r.baseline)} | ${f2(r.next)} | ${Number.isNaN(r.delta) ? "-" : (r.delta >= 0 ? "+" : "") + r.delta.toFixed(2)} |`)].join("\n");
