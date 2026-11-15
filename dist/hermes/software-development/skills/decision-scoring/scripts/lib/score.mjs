// เลือก 1 จากหลายตัวเลือก: กฎเหล็กกรองทิ้ง → normalize min-max → ถ่วงน้ำหนัก → ขยับน้ำหนัก ±20% ดูว่าอันดับ 1 นิ่งไหม
import { num, oneOf, list, unique } from "./check.mjs";

const SWING = 0.2;

// กฎเหล็ก { criterion, min?, max?, equals? } · ไม่ผ่าน = ตัดทิ้ง ไม่เอาไปคิดคะแนน
function mustFailures(option, must) {
  return must.flatMap((m) => {
    const v = option.values?.[m.criterion];
    if (v === undefined || v === null) return [`ไม่มีค่า ${m.criterion}`];
    if (m.equals !== undefined && v !== m.equals) return [`${m.criterion} ต้องเป็น ${m.equals}`];
    if (m.min !== undefined && v < m.min) return [`${m.criterion} ${v} ต่ำกว่า ${m.min}`];
    if (m.max !== undefined && v > m.max) return [`${m.criterion} ${v} สูงกว่า ${m.max}`];
    return [];
  });
}

// ทุกเกณฑ์เป็นสเกล 0–1 เดียวกัน · ค่าเท่ากันหมด = 1 ทุกตัว (เกณฑ์นั้นไม่ช่วยแยก)
export function normalize(options, criteria) {
  return options.map((o) => ({
    ...o,
    norm: Object.fromEntries(criteria.map((c) => {
      const all = options.map((x) => x.values[c.name]);
      const [lo, hi] = [Math.min(...all), Math.max(...all)];
      const v = o.values[c.name];
      if (hi === lo) return [c.name, 1];
      return [c.name, c.better === "low" ? (hi - v) / (hi - lo) : (v - lo) / (hi - lo)];
    })),
  }));
}

const weighted = (rows, weights) => {
  const total = Object.values(weights).reduce((s, w) => s + w, 0);
  return rows.map((r) => ({ ...r, score: Object.entries(weights).reduce((s, [k, w]) => s + (r.norm[k] * w) / total, 0) }))
    .sort((a, b) => b.score - a.score);
};

export function score({ criteria, options, must = [] }) {
  unique(list(criteria, "criteria"), "ชื่อเกณฑ์"); unique(list(options, "options"));
  for (const c of criteria) { num(c.weight, `criteria ${c.name}: weight`, { above: 0 }); oneOf(c.better ?? "high", ["high", "low"], `criteria ${c.name}: better`); }
  const excluded = [], kept = [];
  for (const o of options) {
    const why = [...mustFailures(o, must), ...criteria.filter((c) => !Number.isFinite(o.values?.[c.name])).map((c) => `ไม่มีค่า ${c.name}`)];
    (why.length ? excluded.push({ name: o.name, why }) : kept.push(o));
  }
  if (!kept.length) return { ranked: [], excluded, flips: [], stable: false };
  const weights = Object.fromEntries(criteria.map((c) => [c.name, c.weight]));
  const ranked = weighted(normalize(kept, criteria), weights);
  // ขยับน้ำหนักทีละเกณฑ์ ×0.8 และ ×1.2 · อันดับ 1 เปลี่ยน = ผลยังไม่นิ่ง
  const flips = criteria.flatMap((c) => [1 - SWING, 1 + SWING].flatMap((f) => {
    const top = weighted(ranked, { ...weights, [c.name]: c.weight * f })[0];
    return top.name !== ranked[0].name ? [{ criterion: c.name, factor: f, top: top.name }] : [];
  }));
  return { ranked, excluded, flips, stable: flips.length === 0 };
}

export function renderScore(r, criteria) {
  const pct = (x) => Math.round(x * 100);
  const lines = ["| อันดับ | ตัวเลือก | คะแนน (0–100) | " + criteria.map((c) => `${c.name} (${c.better === "low" ? "น้อยดี" : "มากดี"} · น้ำหนัก ${c.weight})`).join(" | ") + " |",
    "|---|---|---|" + criteria.map(() => "---|").join(""),
    ...r.ranked.map((o, i) => `| ${i + 1} | ${o.name} | ${pct(o.score)} | ` + criteria.map((c) => `${o.values[c.name]} (${pct(o.norm[c.name])})`).join(" | ") + " |")];
  if (r.excluded.length) lines.push("", "**ตัดทิ้งด้วยกฎเหล็ก:** " + r.excluded.map((e) => `${e.name} (${e.why.join(" · ")})`).join(" · "));
  if (!r.ranked.length) return [...lines, "", "ไม่เหลือตัวเลือกที่ผ่านกฎเหล็ก"].join("\n");
  const gap = r.ranked[1] ? pct(r.ranked[0].score) - pct(r.ranked[1].score) : null;
  lines.push("", r.stable
    ? `**ผล:** ${r.ranked[0].name} อันดับ 1 นิ่ง (ขยับน้ำหนักทีละเกณฑ์ ±20% แล้วไม่เปลี่ยน${gap === null ? "" : ` · นำอันดับ 2 อยู่ ${gap} คะแนน`})`
    : `**ผล: ยังไม่นิ่ง** อันดับ 1 เปลี่ยนเมื่อ ${r.flips.map((f) => `${f.criterion} ×${f.factor} → ${f.top}`).join(" · ")} · ให้คนตัดสินระหว่าง ${[r.ranked[0].name, ...new Set(r.flips.map((f) => f.top))].join(" กับ ")} โดยดูว่าเกณฑ์ที่ทำให้พลิกสำคัญแค่ไหน`);
  return lines.join("\n");
}
