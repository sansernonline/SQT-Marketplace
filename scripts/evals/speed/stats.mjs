#!/usr/bin/env node
/**
 * stats.mjs — สถิติของ run-bench: ค่ากลาง · อัตราส่วนจับคู่ · ช่วง 95% แบบ bootstrap · pass^k
 *
 *   node scripts/evals/speed/stats.mjs --self-test
 *
 * ผล bench แกว่งแรง (t4 รุ่นเดียวกัน 134 กับ 277 วินาที ใน RESULTS.md 2026-10-19) จึงใช้ค่ากลางแทนค่าเฉลี่ย
 * และรายงานช่วงแทนตัวเลขเดียว · ช่วงคร่อม 1 = ยังแยกไม่ออกว่าต่างกัน
 */

export const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b), m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// สุ่มแบบกำหนด seed ได้ ให้รันซ้ำแล้วได้ช่วงเดิม (mulberry32)
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** อัตราส่วนของคู่ (ใหม่ ÷ เก่า) ทุกคู่ที่ทั้ง 2 ฝั่งมีค่าบวก */
export const pairRatios = (pairs) => pairs.filter(([a, b]) => a > 0 && b > 0).map(([a, b]) => a / b);

/** ช่วง 95% ของค่ากลางอัตราส่วน: สุ่มเลือกคู่ซ้ำ 2,000 ครั้ง (พอให้ขอบช่วงนิ่งที่ทศนิยม 2 ตำแหน่ง)
 *  คิดบน log เพื่อให้ 2 เท่า กับ 0.5 เท่า ห่างจาก 1 เท่ากัน */
export function ratioCI(ratios, { iters = 2000, seed = 1 } = {}) {
  if (!ratios.length) return null;
  const logs = ratios.map(Math.log), next = rng(seed), meds = [];
  for (let i = 0; i < iters; i++) meds.push(median(logs.map(() => logs[Math.floor(next() * logs.length)])));
  meds.sort((a, b) => a - b);
  const at = (q) => Math.exp(meds[Math.min(meds.length - 1, Math.floor(q * meds.length))]);
  return { ratio: Math.exp(median(logs)), lo: at(0.025), hi: at(0.975), n: ratios.length };
}

const choose = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1); return r; };
/** pass^k = โอกาสที่ k รอบผ่านครบทุกรอบ ประมาณจาก c รอบที่ผ่านใน n รอบ (C(c,k)/C(n,k) ตาม τ-bench) */
export const passHatK = (c, n, k) => (k > n ? null : choose(c, k) / choose(n, k));

/** "0.82 (0.71–0.95)" · ช่วงคร่อม 1 ต่อท้าย "แยกไม่ออก" · คู่น้อยกว่า 5 ช่วงที่ได้คือค่าต่ำสุดถึงสูงสุดเกือบเสมอ จึงต่อท้าย "ตัวอย่างน้อย ช่วงหยาบ" */
export const SMALL_N = 5;
export function fmtCI(ci) {
  if (!ci) return "–";
  const f = (x) => x.toFixed(2);
  return `${f(ci.ratio)} (${f(ci.lo)}–${f(ci.hi)})${ci.lo <= 1 && ci.hi >= 1 ? " แยกไม่ออก" : ""}${ci.n < SMALL_N ? " · ตัวอย่างน้อย ช่วงหยาบ" : ""}`;
}

function selfTest() {
  const ci = ratioCI(pairRatios([[80, 100], [90, 100], [70, 100], [85, 100], [75, 100]]));
  const wide = ratioCI([0.5, 2, 1, 0.8, 1.3]);
  const cases = [
    ["median คี่", median([3, 1, 2]) === 2],
    ["median คู่", median([4, 1, 2, 3]) === 2.5],
    ["median ว่าง", median([]) === null],
    ["ตัดคู่ที่เป็นศูนย์", pairRatios([[1, 0], [0, 1], [2, 4]]).length === 1],
    ["ค่ากลางอัตราส่วน 0.80", Math.abs(ci.ratio - 0.8) < 1e-9],
    ["ช่วงอยู่ต่ำกว่า 1 ทั้งช่วง", ci.hi < 1 && ci.lo <= ci.ratio && ci.ratio <= ci.hi],
    ["seed เดิมได้ช่วงเดิม", JSON.stringify(ratioCI([0.7, 0.9, 1.1])) === JSON.stringify(ratioCI([0.7, 0.9, 1.1]))],
    ["ช่วงกว้างคร่อม 1 บอกแยกไม่ออก", fmtCI(wide).endsWith("แยกไม่ออก")],
    ["คู่น้อยกว่า 5 บอกช่วงหยาบ", fmtCI(ratioCI([0.7, 0.9, 1.1])).endsWith("ตัวอย่างน้อย ช่วงหยาบ")],
    ["pass^k ผ่านครบ", passHatK(5, 5, 3) === 1],
    ["pass^k 3 ใน 4 รอบ k=2 = 0.5", Math.abs(passHatK(3, 4, 2) - 0.5) < 1e-9],
    ["pass^k k เกิน n", passHatK(2, 2, 3) === null],
  ];
  let ok = 0;
  for (const [name, pass] of cases) { console.log(`${pass ? "ผ่าน" : "ไม่ผ่าน"}  ${name}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}

if (process.argv.includes("--self-test")) selfTest();
