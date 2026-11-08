// summary.mjs — สรุปผลหลายรอบต่อขั้น: อัตราผ่าน · ขอบล่าง Wilson · $ ต่องานที่ผ่าน · เลือกตัวถูกสุดที่น่าเชื่อถือ
import { wilson } from "../speed/stats.mjs";

// ค่าตั้งต้น ยังไม่ได้วัดว่าเหมาะกับงานชุดนี้
export const PASS_SCORE = 8;
export const MIN_LOWER = 0.6;

const avg = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;

/** rows = ผลรายรอบของ 1 ขั้น [{ model, score, cost }] → สถิติต่อ model เรียงจาก $ เฉลี่ยน้อยไปมาก */
export function modelStats(rows) {
  const models = [...new Set(rows.map((r) => r.model))];
  return models.map((model) => {
    const rs = rows.filter((r) => r.model === model);
    const passes = rs.filter((r) => r.score >= PASS_SCORE).length;
    const avgCost = avg(rs.map((r) => r.cost));
    return { model, n: rs.length, passes, lower: wilson(passes, rs.length).lo, avgCost, costPerPass: passes ? avgCost / (passes / rs.length) : null };
  }).sort((a, b) => a.avgCost - b.avgCost);
}

/** จำนวนรอบน้อยสุดที่ผ่านครบทุกรอบแล้วขอบล่างถึงเกณฑ์ */
export function minRunsToQualify() {
  let n = 1;
  while (wilson(n, n).lo < MIN_LOWER) n++;
  return n;
}

/** คืนข้อความแนะนำ: ทุกตัวผ่านหมด → แยกไม่ออก · ไม่งั้นตัวถูกสุดที่ขอบล่าง ≥ MIN_LOWER */
export function recommendation(stats) {
  if (stats.every((s) => s.passes === s.n)) return "แยกไม่ออก (ชนเพดาน) · ทุก model ผ่านหมดทุกรอบ";
  const pick = stats.find((s) => s.lower >= MIN_LOWER);
  if (pick) return `${pick.model} (ผ่าน ${pick.passes}/${pick.n} · ขอบล่าง ${pick.lower.toFixed(2)} · $${pick.costPerPass.toFixed(2)} ต่องานที่ผ่าน)`;
  // รอบน้อยเกินจะถึงเกณฑ์ (3 รอบผ่านครบได้ขอบล่างราว 0.44) → บอกตัวถูกสุดที่ผ่านครบเป็นแนวโน้ม ไม่ใช่คำตัดสิน
  const trend = stats.find((s) => s.passes === s.n && s.n > 0);
  const need = `ยังเลือกไม่ได้ ไม่มี model ที่ขอบล่าง ≥ ${MIN_LOWER} (ผ่านครบทุกรอบต้องรันอย่างน้อย ${minRunsToQualify()} รอบ)`;
  return trend ? `${need} · แนวโน้ม (ตัวอย่างน้อย): ${trend.model} ผ่าน ${trend.n}/${trend.n} · $${trend.costPerPass.toFixed(2)} ต่องานที่ผ่าน` : need;
}

/** model ที่ไม่มีรอบที่นับได้เลย (ถูกตัดหรือโควตาหมดทุกรอบ) พร้อมจำนวนรอบที่ไม่นับ */
export function uncountedModels(all, valid) {
  const counted = new Set(valid.map((r) => r.model));
  return [...new Set(all.map((r) => r.model))].filter((m) => !counted.has(m)).map((model) => ({ model, cut: all.filter((r) => r.model === model).length }));
}
