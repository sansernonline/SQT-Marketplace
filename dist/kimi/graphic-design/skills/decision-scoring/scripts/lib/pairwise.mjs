// เทียบเป็นคู่ → คะแนนความแข็งแบบ Bradley-Terry · ทุกคู่ควรตัดสิน 2 ครั้งสลับตำแหน่ง เพราะ LLM ที่เป็นผู้ตรวจเอียงตามตำแหน่ง
// คู่ที่สลับแล้วตัวที่วางก่อน (หรือหลัง) ชนะทุกครั้ง = เอียงตามตำแหน่ง นับเสมอ (ฝั่งละครึ่ง) · ทุกตัวได้ชนะ 0.5 ครั้งกับตัวกลางสมมติ กันคะแนนเป็นศูนย์
import { list, unique } from "./check.mjs";

const ITER = 500;
const pairKey = (a, b) => [a, b].sort().join("\u0000");

export function pairwise({ items, judgments }) {
  unique(list(items, "items")); list(judgments, "judgments");
  const known = new Set(items);
  for (const j of judgments) {
    for (const name of [j.first, j.second]) if (!known.has(name)) throw new Error(`ไม่รู้จัก ${name} ใน judgments`);
    if (j.first === j.second) throw new Error(`เทียบ ${j.first} กับตัวเองไม่ได้`);
    if (j.winner !== "tie" && j.winner !== j.first && j.winner !== j.second) throw new Error(`winner ต้องเป็น ${j.first} · ${j.second} หรือ tie (ได้ ${j.winner})`);
  }
  const byPair = Map.groupBy(judgments, (j) => pairKey(j.first, j.second));
  const wins = new Map(), games = new Map();
  const record = (a, b, scoreA) => {
    wins.set(`${a}>${b}`, (wins.get(`${a}>${b}`) ?? 0) + scoreA);
    wins.set(`${b}>${a}`, (wins.get(`${b}>${a}`) ?? 0) + 1 - scoreA);
    games.set(pairKey(a, b), (games.get(pairKey(a, b)) ?? 0) + 1);
  };
  let swapped = 0, biased = 0;
  for (const list of byPair.values()) {
    const bothOrders = new Set(list.map((j) => j.first)).size === 2;
    // เอียงตามตำแหน่ง = สลับแล้วตัวที่วางก่อนชนะทุกครั้ง (หรือตัวที่วางหลังชนะทุกครั้ง) ไม่ใช่แค่ผลปนกัน
    const flipped = bothOrders && (list.every((j) => j.winner === j.first) || list.every((j) => j.winner === j.second));
    if (bothOrders) swapped++;
    if (flipped) biased++;
    for (const j of list) {
      const scoreFirst = flipped || j.winner === "tie" ? 0.5 : j.winner === j.first ? 1 : 0;
      record(j.first, j.second, scoreFirst);
    }
  }
  const p = strengths(items, wins, games);
  const sum = items.reduce((s, i) => s + p[i], 0);
  const ranked = items.map((i) => ({ name: i, strength: p[i] / sum })).sort((a, b) => b.strength - a.strength);
  return { ranked, pairs: byPair.size, swapped, biased, topWin: ranked[1] ? ranked[0].strength / (ranked[0].strength + ranked[1].strength) : 1 };
}

// MM algorithm (Hunter 2004): p_i ← W_i ÷ Σ_j n_ij/(p_i + p_j) · ตัวกลางสมมติ p = 1 ให้ชนะ 0.5 และแพ้ 0.5 กับทุกตัว
export function strengths(items, wins, games) {
  let p = Object.fromEntries(items.map((i) => [i, 1]));
  for (let t = 0; t < ITER; t++) {
    const next = {};
    for (const i of items) {
      let w = 0.5, denom = 1 / (p[i] + 1);
      for (const j of items) {
        if (i === j) continue;
        w += wins.get(`${i}>${j}`) ?? 0;
        const n = games.get(pairKey(i, j)) ?? 0;
        if (n) denom += n / (p[i] + p[j]);
      }
      next[i] = w / denom;
    }
    p = next;
  }
  return p;
}

export function renderPairwise(r) {
  const lines = ["| อันดับ | ตัวเลือก | ความแข็ง (รวม 100) |", "|---|---|---|",
    ...r.ranked.map((x, i) => `| ${i + 1} | ${x.name} | ${(x.strength * 100).toFixed(1)} |`), ""];
  lines.push(`คู่ที่เทียบ ${r.pairs} · สลับตำแหน่งครบ ${r.swapped} · ผลกลับข้างเมื่อสลับ ${r.biased} คู่ (นับเสมอ)`);
  if (r.swapped < r.pairs) lines.push(`**เตือน:** ${r.pairs - r.swapped} คู่ยังไม่ได้สลับตำแหน่ง ผลอาจเอียงตามลำดับที่ส่ง`);
  if (r.biased * 2 > r.pairs) lines.push("**เตือน:** ผลกลับข้างเกินครึ่งของคู่ทั้งหมด ผู้ตัดสินแยกไม่ออกจริง ให้คนเลือก");
  lines.push("", `**ผล:** ${r.ranked[0].name} อันดับ 1 · โอกาสชนะอันดับ 2 ตามโมเดล ${Math.round(r.topWin * 100)}%${r.topWin < 0.6 ? " (ต่ำกว่า 60% ถือว่าสูสี ให้คนดูทั้ง 2 ตัว)" : ""}`);
  return lines.join("\n");
}
