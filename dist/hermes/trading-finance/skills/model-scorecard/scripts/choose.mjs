import { actualTokens, costOf, costPerRun, priceFor } from "./report.mjs";

// 2 การตัดสินจากงานเก่า: ขนาดชิ้นงาน (reference class + PERT 3 จุด) · model ต่อขั้น (Thompson sampling บน Beta-Binomial)
const THIN = 5;
// จำนวนสุ่ม Thompson · ค่าตั้งเอง ยังไม่ได้วัดว่าน้อยกว่านี้พอไหม · ความคลาดจากการสุ่มของโอกาสชนะ = √(p(1−p)/4000) ที่ p = 0.95 ราว 0.0035
const DRAWS = 4000;
const SURE = 0.95;

// สุ่มแบบกำหนด seed ได้ (mulberry32) ให้รายงานออกมาเหมือนเดิมทุกครั้ง · --pick ใช้ Math.random
export function seeded(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Gamma(k, 1) แบบ Marsaglia-Tsang (k ≥ 1 เสมอ เพราะ prior Beta(1,1)) → Beta(a, b) = X ÷ (X + Y)
function gamma(k, rand) {
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x, v;
    do { x = Math.sqrt(-2 * Math.log(rand() || 1e-12)) * Math.cos(2 * Math.PI * rand()); v = 1 + c * x; } while (v <= 0);
    v = v ** 3;
    const u = rand();
    if (Math.log(u || 1e-12) < 0.5 * x * x + d - d * v + d * Math.log(v)) return d * v;
  }
}
export const betaDraw = (a, b, rand) => { const x = gamma(a, rand); return x / (x + gamma(b, rand)); };

// ---------- ขนาดชิ้นงานจากงานเก่าของขั้นเดียวกัน ----------
const quantile = (sorted, q) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(q * sorted.length) - 1))];

export function pertByStep(runs) {
  const byStep = new Map();
  for (const r of runs) {
    const real = actualTokens(r);
    if (real > 0) byStep.set(r.step, [...(byStep.get(r.step) ?? []), real]);
  }
  return [...byStep].map(([step, list]) => {
    const s = list.sort((a, b) => a - b);
    const [o, m, p] = [quantile(s, 0.1), quantile(s, 0.5), quantile(s, 0.9)];
    // PERT ใช้ (เร็ว + 4 × กลาง + ช้า) ÷ 6 · ใช้ P10/P90 แทนค่าสุดขั้วเพราะ log มีค่าหลุดได้ · ช่วง P10–P90 ของการแจกแจงปกติกว้าง 2.56 เท่าของ sd
    return { step, n: s.length, o, m, p, mean: (o + 4 * m + p) / 6, sd: (p - o) / 2.56 };
  }).sort((a, b) => b.n - a.n);
}

// ---------- model ต่อขั้น ----------
// ผู้ท้าชิงของขั้น = ช่องที่มีผลตรวจแล้ว · --candidates เพิ่ม model ที่ยังไม่เคยใช้ (prior Beta(1,1) · ราคาประมาณจาก token เฉลี่ยของขั้น × ราคา model นั้น)
export function contenders(cells, step, prices, extra = []) {
  const own = cells.filter((c) => c.step === step && c.review.n > 0)
    .map((c) => ({ model: c.model, a: 1 + c.review.firstPass, b: 1 + c.review.n - c.review.firstPass, n: c.review.n, cost: costPerRun(c) }));
  const stepCells = cells.filter((c) => c.step === step && c.tok.n);
  const avg = Object.fromEntries(["input", "output", "cacheRead", "cacheCreate"].map((k) => [k, stepCells.reduce((s, c) => s + c.tok[k], 0) / Math.max(1, stepCells.reduce((s, c) => s + c.tok.n, 0))]));
  for (const model of extra) {
    if (own.some((c) => c.model === model)) continue;
    const price = priceFor(model, prices);
    own.push({ model, a: 1, b: 1, n: 0, cost: price && stepCells.length ? costOf(avg, price) : null });
  }
  return own;
}

// ความคุ้ม = โอกาสผ่านรอบแรกที่สุ่มได้ ÷ ค่าใช้จ่ายต่องาน · ถ้ามีตัวไหนไม่มีราคา เทียบแค่โอกาสผ่าน (บอกในรายงาน)
const priced = (list) => list.length > 0 && list.every((c) => c.cost > 0);
const valueOf = (c, theta, usePrice) => (usePrice ? theta / c.cost : theta);

export function pickOnce(list, rand = Math.random) {
  const usePrice = priced(list);
  return list.map((c) => ({ c, v: valueOf(c, betaDraw(c.a, c.b, rand), usePrice) })).sort((x, y) => y.v - x.v)[0]?.c.model ?? null;
}

export function bestOdds(list, rand = seeded(1)) {
  const usePrice = priced(list), wins = new Map(list.map((c) => [c.model, 0]));
  for (let i = 0; i < DRAWS; i++) {
    const top = list.map((c) => ({ c, v: valueOf(c, betaDraw(c.a, c.b, rand), usePrice) })).sort((x, y) => y.v - x.v)[0];
    wins.set(top.c.model, wins.get(top.c.model) + 1);
  }
  return { usePrice, rows: list.map((c) => ({ ...c, mean: c.a / (c.a + c.b), pBest: wins.get(c.model) / DRAWS })).sort((x, y) => y.pBest - x.pBest) };
}

const k = (n) => `${Math.round(n / 1000)}k`;

export function chooseSections(runs, cells, prices) {
  const pert = pertByStep(runs);
  const out = ["", "## ขนาดชิ้นงานจากงานเก่า (reference class + PERT)", ""];
  if (!pert.length) out.push("ยังไม่มีงานที่รู้ token จริง", "");
  else out.push(
    "| ขั้น | งาน | เร็ว (P10) | กลาง (P50) | ช้า (P90) | ค่าคาด PERT | ใช้อย่างไร | ป้าย |",
    "|---|---|---|---|---|---|---|---|",
    ...pert.map((s) => `| ${s.step} | ${s.n} | ${k(s.o)} | ${k(s.m)} | ${k(s.p)} | ${k(s.mean)} ± ${k(s.sd)} | ชิ้นขั้นนี้ที่ยังประเมินไม่ได้ ใส่ \`ขนาด: ${k(s.mean)}\` · วางงบใช้ ${k(s.p)} | ${s.n < THIN ? "ตัวอย่างน้อย" : ""} |`),
    "",
    "ค่าคาด PERT = (เร็ว + 4 × กลาง + ช้า) ÷ 6 โดยเร็ว = P10 ช้า = P90 · ± = (ช้า − เร็ว) ÷ 2.56 (ส่วนเบี่ยงเบนมาตรฐานเมื่อใช้ P10–P90) · คิดจาก token จริงของงานขั้นเดียวกัน ไม่ใช่การเดา",
    "");
  const steps = [...new Set(cells.map((c) => c.step))].map((step) => [step, contenders(cells, step, prices)]).filter(([, list]) => list.length > 1);
  out.push("## model ต่อขั้น (Thompson sampling)", "");
  if (!steps.length) return [...out, "ยังไม่มีขั้นที่มีผลตรวจมากกว่า 1 model · ใช้ตามตารางระดับใน `superuser` หัวข้อ 5 ไปก่อน", ""];
  out.push("| ขั้น | model | ผลตรวจ | โอกาสผ่านรอบแรก (เฉลี่ยหลังเรียนรู้) | โอกาสคุ้มที่สุด | ทำอย่างไร |", "|---|---|---|---|---|---|");
  for (const [step, list] of steps) {
    const { usePrice, rows } = bestOdds(list);
    const top = rows[0];
    const action = top.pBest >= SURE ? `ใช้ ${top.model} ประจำขั้นนี้` : `ยังไม่ชัด · แต่ละงานจับ 1 ครั้ง \`scorecard.mjs --pick ${step}\``;
    rows.forEach((c, i) => out.push(`| ${i ? "" : step} | ${c.model} | ${c.n} | ${Math.round(c.mean * 100)}% | ${Math.round(c.pBest * 100)}%${usePrice ? "" : " (ไม่มีราคา เทียบแค่โอกาสผ่าน)"} | ${i ? "" : action} |`));
  }
  out.push("", `โอกาสคุ้มที่สุด = สัดส่วนครั้งที่ model นั้นชนะเมื่อสุ่มโอกาสผ่านจาก Beta(1 + ผ่าน, 1 + ไม่ผ่าน) แล้วหารด้วยค่าใช้จ่ายต่องาน ${DRAWS} ครั้ง · ถึง ${SURE * 100}% แล้วใช้ตัวนั้นประจำ · ไม่ถึงให้สุ่มต่อ เพราะการสุ่มตามโอกาสนี้ลองตัวที่ยังไม่แน่ใจพอดี ๆ ไม่ทิ้งตัวที่อาจดีกว่า`, "");
  return out;
}
