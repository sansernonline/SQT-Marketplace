// เลือกหลายอย่างภายใต้งบ: ไม่เกิน 20 รายการลองทุกชุด ได้ชุดดีสุดจริงและชุดรองลงมา · มากกว่านั้นใช้ greedy ตามค่าที่ได้ต่อต้นทุน
// max_items (ไม่บังคับ) = เลือกได้ไม่เกินกี่รายการ นับรวมรายการบังคับ · groups { ชื่อ: เพดานต้นทุน } + item.group = ต้นทุนรวมในกลุ่มห้ามเกินเพดาน
import { num, list, unique } from "./check.mjs";

const EXACT_MAX = 20;

export function knapsack({ budget, items, max_items = Infinity, groups = {} }) {
  num(budget, "budget", { above: 0 });
  if (max_items !== Infinity) num(max_items, "max_items", { above: 0 });
  unique(list(items, "items"));
  for (const it of items) {
    num(it.cost, `${it.name}: cost`, { above: 0 });
    num(it.value, `${it.name}: value`, { min: 0 });
    if (it.group !== undefined && !(it.group in groups)) throw new Error(`${it.name}: group "${it.group}" ไม่มีใน groups`);
  }
  for (const [g, cap] of Object.entries(groups)) num(cap, `groups.${g}`, { above: 0 });
  const ranked = items.map((it) => ({ ...it, ratio: it.value / it.cost })).sort((a, b) => b.ratio - a.ratio);
  const fits = makeFits(budget, max_items, groups);
  const must = ranked.filter((it) => it.must);
  if (!fits(must)) throw new Error("รายการบังคับรวมกันเกินงบ เพดานกลุ่ม หรือ max_items");
  const free = ranked.filter((it) => !it.must);
  const exact = free.length <= EXACT_MAX;
  const [best, runnerUp] = exact ? bestTwo(must, free, fits) : [greedy(must, free, fits), null];
  const names = new Set(best.map((c) => c.name));
  return {
    method: exact ? "ลองทุกชุด (ดีสุดจริง)" : "greedy ตามค่าต่อต้นทุน เทียบกับชิ้นเดียวที่ค่าสูงสุด (ใกล้เคียง ไม่รับประกันดีสุด)",
    ranked: ranked.map((it) => ({ ...it, chosen: names.has(it.name) })),
    cost: total(best, "cost"),
    value: total(best, "value"),
    runnerUp: runnerUp && { names: runnerUp.map((it) => it.name), value: total(runnerUp, "value"), cost: total(runnerUp, "cost") },
    budget,
  };
}

const total = (set, key) => set.reduce((s, it) => s + it[key], 0);

function makeFits(budget, maxItems, groups) {
  return (set) => {
    if (set.length > maxItems || total(set, "cost") > budget) return false;
    return Object.entries(groups).every(([g, cap]) => total(set.filter((it) => it.group === g), "cost") <= cap);
  };
}

// ลองทุกชุด เก็บ 2 อันดับแรก (ค่ามากกว่าชนะ · ค่าเท่ากันต้นทุนน้อยกว่าชนะ)
function bestTwo(must, free, fits) {
  const better = (a, b) => !b || a.value > b.value || (a.value === b.value && a.cost < b.cost);
  let first = null, second = null;
  for (let mask = 0; mask < 1 << free.length; mask++) {
    const set = [...must, ...free.filter((_, i) => mask & (1 << i))];
    if (!fits(set)) continue;
    const cand = { set, value: total(set, "value"), cost: total(set, "cost") };
    if (better(cand, first)) { second = first; first = cand; }
    else if (better(cand, second)) second = cand;
  }
  return [first.set, second?.set ?? null];
}

// greedy ตามอัตราส่วนอาจแย่มากเมื่อชิ้นใหญ่ชิ้นเดียวคุ้มกว่า จึงเทียบกับชิ้นเดียวที่ค่าสูงสุดด้วย (ได้อย่างน้อยครึ่งของคำตอบดีสุด)
function greedy(must, free, fits) {
  const picked = [...must];
  for (const it of free) if (fits([...picked, it])) picked.push(it);
  const single = free.filter((it) => fits([...must, it])).sort((a, b) => b.value - a.value)[0];
  return single && total([...must, single], "value") > total(picked, "value") ? [...must, single] : picked;
}

export function renderKnapsack(r) {
  const f = (x) => (Math.abs(x) >= 1000 ? Math.round(x).toLocaleString("en-US") : +x.toFixed(3));
  const lines = [
    "| รายการ | ต้นทุน | ค่าที่ได้ | ค่าที่ได้ต่อต้นทุน | เลือก |",
    "|---|---|---|---|---|",
    ...r.ranked.map((it) => `| ${it.name}${it.must ? " (บังคับ)" : ""}${it.group ? ` [${it.group}]` : ""} | ${f(it.cost)} | ${f(it.value)} | ${f(it.ratio)} | ${it.chosen ? "✓" : "✗"} |`),
    "",
    `**ผล:** ใช้ ${f(r.cost)} จากงบ ${f(r.budget)} · ได้ค่ารวม ${f(r.value)} · วิธี ${r.method}`,
  ];
  if (r.runnerUp) {
    const gap = r.value ? ((r.value - r.runnerUp.value) / Math.abs(r.value)) * 100 : 0;
    lines.push(`**ชุดรองลงมา:** ${r.runnerUp.names.join(" · ")} · ค่ารวม ${f(r.runnerUp.value)} · ห่างจากชุดดีสุด ${+gap.toFixed(1)}%${gap < 10 ? " (ไม่ถึง 10% ถือว่าสูสี ให้คนเลือก)" : ""}`);
  }
  return lines.join("\n");
}
