#!/usr/bin/env node
// retire.mjs - Thai retirement sum, social security pension, monthly saving and three levers (Node stdlib only)
// Usage: node retire.mjs <file.json> [--json] [--mc]   |   node retire.mjs --self-test
// --mc: random-return simulation (seeded, same answer every run); needs "mc": { "sdPct": <user's own figure> } in the file.
// File: { "age": 35, "retireAge": 60, "planToAge": 85, "spendMonthly": 30000, "returnPct": 6,
//         "sso": { "monthsNow": 0 }, "assets": [ { "name": "PVD", "balance": 0, "monthly": 4000, "returnPct": 5 } ] }
// Formulas follow SKILL.md "Formulas": spending grows with inflation, needed sum = yearly spending x years (real return 0),
// FV of monthly saving = PMT x ((1+r)^n - 1) / r with r = yearly return / 12. Pension rules and wage ceilings: sso-pension.json.
import { readFileSync } from 'node:fs';

const SSO = JSON.parse(readFileSync(new URL('./sso-pension.json', import.meta.url), 'utf8'));
const DEFAULT_INFLATION = 3; // SKILL.md Formulas: "Use 3% inflation unless the user chooses another"
const RETURN_RANGE = [3, 5, 6]; // SKILL.md Workflow step 4: 3% conservative, 5-6% balanced mix
const PENSION_AGE = 55; // SKILL.md social security table: benefit at age 55 and leaving insured work
// Lever sizes from the SKILL.md worked example (retire at 63 instead of 60; spend 25,000 instead of 30,000) - starting values, not measured
const DEFAULT_LEVERS = { retireLaterYears: 3, spendLessMonthly: 5000 };
// --mc: 5,000 runs and a fixed seed so the same file gives the same answer (SKILL.md "Chance the money lasts").
// There is no default volatility: no Thai source was checked, so mc.sdPct must come from the user.
const MC_RUNS = 5000;
const MC_SEED = 42;

const num = (v, label, { min = 0, strict = false } = {}) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || (strict ? v <= min : v < min))
    throw new Error(`ช่อง ${label} ต้องเป็นตัวเลข${strict ? 'มากกว่า' : 'ตั้งแต่'} ${min} (ได้ ${JSON.stringify(v)})`);
};

// Throws a Thai message naming the bad field; returns the input with defaults filled.
export function validate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  const x = { inflationPct: DEFAULT_INFLATION, assets: [], year: new Date().getFullYear() + 543, ...input };
  num(x.age, 'age (อายุตอนนี้)');
  num(x.retireAge, 'retireAge (อายุเกษียณ)');
  num(x.planToAge, 'planToAge (วางแผนถึงอายุ เช่น 85-90)');
  if (x.retireAge < x.age) throw new Error(`ช่อง retireAge (${x.retireAge}) น้อยกว่า age (${x.age}) · เกษียณแล้วให้ใส่ retireAge เท่ากับ age`);
  if (x.planToAge <= x.retireAge) throw new Error(`ช่อง planToAge (${x.planToAge}) ต้องมากกว่า retireAge (${x.retireAge})`);
  num(x.spendMonthly, 'spendMonthly (ค่าใช้จ่ายต่อเดือนวันนี้)', { strict: true });
  num(x.inflationPct, 'inflationPct (% ต่อปี เช่น 3)');
  num(x.returnPct, 'returnPct (% ต่อปีของเงินออมใหม่ เช่น 6)');
  num(x.year, 'year (ปี พ.ศ. ปัจจุบัน)', { min: 2500 });
  if (!Array.isArray(x.assets)) throw new Error('ช่อง assets ต้องเป็นรายการ [{ "name", "balance", "monthly", "returnPct" }]');
  x.assets = x.assets.map((a, i) => {
    const n = a?.name ?? `ก้อนที่ ${i + 1}`;
    const out = { balance: 0, monthly: 0, ...a, name: n };
    num(out.balance, `assets[${i}].balance (${n})`);
    num(out.monthly, `assets[${i}].monthly (${n})`);
    num(out.returnPct, `assets[${i}].returnPct (${n})`);
    return out;
  });
  if (x.sso !== undefined) {
    x.sso = { monthsPerYear: 12, ...x.sso };
    num(x.sso.monthsNow, 'sso.monthsNow (เดือนที่ส่งประกันสังคมแล้ว)');
    num(x.sso.monthsPerYear, 'sso.monthsPerYear (เดือนที่จะส่งต่อปี ปกติ 12 · หยุดส่งใส่ 0)');
    if (x.sso.monthsPerYear > 12) throw new Error(`ช่อง sso.monthsPerYear ต้องไม่เกิน 12 (ได้ ${x.sso.monthsPerYear})`);
    if (x.sso.avgWage !== undefined) num(x.sso.avgWage, 'sso.avgWage (ค่าจ้างเฉลี่ย 60 เดือนสุดท้าย)', { strict: true });
  }
  x.levers = { ...DEFAULT_LEVERS, ...x.levers };
  num(x.levers.retireLaterYears, 'levers.retireLaterYears', { strict: true });
  num(x.levers.spendLessMonthly, 'levers.spendLessMonthly', { strict: true });
  for (const w of ['inflationPct', 'returnPct']) if (x[w] > 0 && x[w] < 1) x._warn = [...(x._warn ?? []), `${w} ${x[w]} น้อยกว่า 1 · ใส่เป็น % (6 ไม่ใช่ 0.06)`];
  return x;
}

// ((1+r)^n - 1) / r with r monthly; r = 0 gives n (no division by zero)
export const factor = (yearPct, months) => {
  const r = yearPct / 1200;
  return r === 0 ? months : ((1 + r) ** months - 1) / r;
};

export const ceilingFor = (year) => SSO.wage_ceiling.filter((c) => year >= c.from_year).at(-1).ceiling;

export function pensionPct(months) {
  const p = SSO.pension;
  if (months < p.min_months) return 0;
  return p.base_pct + p.step_pct * Math.floor((months - p.min_months) / p.step_months);
}

export function compute(x, over = {}) {
  const c = { ...x, ...over };
  const years = c.retireAge - c.age;
  const n = years * 12;
  const yearsRetired = c.planToAge - c.retireAge;
  const spendYear = c.spendMonthly * 12 * (1 + c.inflationPct / 100) ** years;
  const needed = spendYear * yearsRetired;
  const warnings = [...(x._warn ?? [])];
  let pension = { months: 0, pct: 0, wage: 0, monthly: 0, total: 0 };
  if (c.sso) {
    const months = c.sso.monthsNow + c.sso.monthsPerYear * years;
    const ceiling = ceilingFor(c.year + years);
    let wage = c.sso.avgWage ?? ceiling;
    if (wage > ceiling) { warnings.push(`sso.avgWage ${fmt(wage)} เกินเพดานค่าจ้างปี ${c.year + years} (${fmt(ceiling)}) · นับแค่เพดาน`); wage = ceiling; }
    const pct = pensionPct(months);
    const monthly = (pct / 100) * wage;
    const payYears = Math.max(0, c.planToAge - Math.max(c.retireAge, PENSION_AGE));
    pension = { months, pct, wage, monthly, total: monthly * 12 * payYears };
    if (pct === 0) warnings.push(`ส่งประกันสังคม ${months} เดือน ไม่ถึง ${SSO.pension.min_months} · ได้บำเหน็จก้อนเดียว ไม่ได้นับในแผนนี้`);
  }
  const assetsFV = c.assets.reduce((s, a) => s + a.balance * (1 + a.returnPct / 1200) ** n + a.monthly * factor(a.returnPct, n), 0);
  const gap = Math.max(0, needed - pension.total - assetsFV);
  const f = factor(c.returnPct, n);
  const monthly = gap === 0 ? 0 : n === 0 ? null : gap / f;
  return { years, yearsRetired, spendYear, needed, pension, assetsFV, gap, factor: f, monthly, warnings };
}

export function plan(input) {
  const x = validate(input);
  const base = compute(x);
  const L = x.levers;
  const later = x.retireAge + L.retireLaterYears < x.planToAge ? compute(x, { retireAge: x.retireAge + L.retireLaterYears }) : null;
  const less = x.spendMonthly > L.spendLessMonthly ? compute(x, { spendMonthly: x.spendMonthly - L.spendLessMonthly }) : null;
  const range = RETURN_RANGE.map((p) => ({ returnPct: p, monthly: compute(x, { returnPct: p }).monthly }));
  // two-way table: retire age (now, +1 lever, +2 levers) × spending today (now, −1 lever, −2 levers)
  const ages = [0, 1, 2].map((k) => x.retireAge + k * L.retireLaterYears).filter((a) => a < x.planToAge);
  const spends = [0, 1, 2].map((k) => x.spendMonthly - k * L.spendLessMonthly).filter((s) => s > 0);
  const grid = { ages, spends, monthly: ages.map((a) => spends.map((s) => compute(x, { retireAge: a, spendMonthly: s }).monthly)) };
  return { input: x, base, levers: { later, less }, range, grid };
}

// --- Monte Carlo (--mc) -------------------------------------------------------------------
// mulberry32: small seeded generator, so a run can be repeated exactly
const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
// Box-Muller: standard normal from two uniforms
const normal = (rand) => { let u = 0; while (u === 0) u = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand()); };

export function validateMc(x) {
  if (!x.mc || typeof x.mc !== 'object') throw new Error('โหมด --mc ต้องมีช่อง mc เช่น "mc": { "sdPct": 10 } · sdPct คือความผันผวนต่อปีของพอร์ตเป็น % ที่ผู้ใช้หาเอง');
  const m = { returnPct: x.returnPct, inflationSdPct: 0, runs: MC_RUNS, seed: MC_SEED, ...x.mc };
  if (m.sdPct === undefined) throw new Error('ช่อง mc.sdPct หายไป · ใส่ความผันผวนต่อปีของพอร์ต (%) เอง เช่นจากส่วนเบี่ยงเบนมาตรฐานใน factsheet ของกองที่ถือ · plugin ไม่มีค่าตั้งต้นเพราะยังไม่มีแหล่งไทยที่ตรวจแล้ว');
  num(m.sdPct, 'mc.sdPct (ความผันผวนต่อปีของพอร์ต %)');
  num(m.returnPct, 'mc.returnPct (ผลตอบแทนเฉลี่ยต่อปีก่อนเกษียณ %)', { min: -100 });
  m.retiredReturnPct ??= m.returnPct;
  num(m.retiredReturnPct, 'mc.retiredReturnPct (ผลตอบแทนเฉลี่ยต่อปีหลังเกษียณ %)', { min: -100 });
  num(m.inflationSdPct, 'mc.inflationSdPct (ความผันผวนของเงินเฟ้อ %)');
  num(m.runs, 'mc.runs (จำนวนรอบ)', { min: 100 });
  num(m.seed, 'mc.seed');
  if (m.monthlySaving !== undefined) num(m.monthlySaving, 'mc.monthlySaving (เงินออมเพิ่มต่อเดือน)');
  m.runs = Math.floor(m.runs);
  return m;
}

const pctile = (sorted, p) => sorted[Math.floor(p * (sorted.length - 1))];

// Year by year from today to planToAge.
// Before retirement: the same basis as compute() - each pot (every asset, plus the extra saving at returnPct) grows
// month by month at its yearly return / 12 and takes its deposit at each month end. Then one random draw per year
// scales that year's growth by k = 1 + sdPct x z (floor 0, so a pot can lose all but not go below 0): the balance
// carried in takes all of k, the year's deposits half of it (on average they are in for half the year).
// Every pot uses the same z (one portfolio, one return series); mc.returnPct - returnPct shifts every pot's average.
// k averages 1, so the average path is the plan's; with sdPct 0 the pot at retirement equals the plan's (self-test).
// From retirement: take the year's spending (minus the pension once it is paid), then grow what is left.
// Spending grows with inflation every year, also after retirement; the pension stays fixed in baht.
export function simulate(x, base, m) {
  const rand = rng(m.seed);
  const saving = m.monthlySaving ?? base.monthly ?? 0;
  const shift = m.returnPct - x.returnPct;
  const pots = [...x.assets.map((a) => ({ balance: a.balance, monthly: a.monthly, pct: a.returnPct })), { balance: 0, monthly: saving, pct: x.returnPct }];
  const pensionYear = base.pension.monthly * 12;
  const pensionFrom = Math.max(x.retireAge, PENSION_AGE);
  const atRetire = [], atEnd = [], brokeAges = [];
  for (let i = 0; i < m.runs; i++) {
    let bal = pots.map((p) => p.balance), pot = 0, spend = x.spendMonthly * 12, broke = null;
    for (let age = x.age; age < x.planToAge; age++) {
      const inflation = x.inflationPct + m.inflationSdPct * normal(rand);
      if (age === x.retireAge) { pot = bal.reduce((s, v) => s + v, 0); atRetire.push(pot); }
      if (age < x.retireAge) {
        const z = normal(rand);
        const k = Math.max(0, 1 + (m.sdPct * z) / 100);
        bal = bal.map((v, j) => {
          const y = pots[j].pct + shift;
          return v * (1 + y / 1200) ** 12 * k + pots[j].monthly * factor(y, 12) * ((1 + k) / 2);
        });
      } else {
        const need = Math.max(0, spend - (age >= pensionFrom ? pensionYear : 0));
        if (pot < need) { broke = age; pot = 0; break; }
        pot = (pot - need) * (1 + Math.max(-100, m.retiredReturnPct + m.sdPct * normal(rand)) / 100);
      }
      spend *= 1 + inflation / 100;
    }
    atEnd.push(pot);
    if (broke !== null) brokeAges.push(broke);
  }
  const sort = (a) => [...a].sort((p, q) => p - q);
  const r = sort(atRetire), e = sort(atEnd), b = sort(brokeAges);
  return {
    runs: m.runs, seed: m.seed, saving, successPct: ((m.runs - b.length) / m.runs) * 100,
    atRetire: { p10: pctile(r, 0.1), p50: pctile(r, 0.5), p90: pctile(r, 0.9) },
    atEnd: { p10: pctile(e, 0.1), p50: pctile(e, 0.5), p90: pctile(e, 0.9) },
    brokeAgeMedian: b.length ? pctile(b, 0.5) : null, mc: m,
  };
}

export function reportMc(r, s) {
  const x = r.input, m = s.mc;
  return [
    `สุ่มผลตอบแทน ${s.runs.toLocaleString('en-US')} รอบ (seed ${s.seed} รันซ้ำได้ผลเดิม) · อายุ ${x.age} เกษียณ ${x.retireAge} ถึง ${x.planToAge}`,
    `คำเตือน: ความผันผวน ${m.sdPct}% ผลตอบแทนเฉลี่ย ${m.returnPct}% (หลังเกษียณ ${m.retiredReturnPct}%) และความผันผวนเงินเฟ้อ ${m.inflationSdPct}% เป็นค่าที่ผู้ใช้ใส่เอง ไม่ใช่ค่าที่ plugin ตรวจจากแหล่ง`,
    ...(m.inflationSdPct === 0 ? ['คำเตือน: เงินเฟ้อคงที่ทุกปี เพราะไม่ได้ใส่ mc.inflationSdPct'] : []),
    'คำเตือน: ผลสุ่มบอกช่วงที่เป็นไปได้ภายใต้ข้อสมมตินี้ ไม่ใช่คำพยากรณ์ · บำนาญประกันสังคมไม่ปรับตามเงินเฟ้อ · ผลตอบแทนต่อปีสุ่มแบบปกติ ปีที่ตลาดตกหนักจริงอาจแรงกว่านี้',
    '',
    '| ผล | ค่า |',
    '|---|---|',
    `| โอกาสที่เงินอยู่ถึงอายุ ${x.planToAge} | **${s.successPct.toFixed(1)}%** |`,
    `| เงินก้อนตอนเกษียณ (10% · 50% · 90% ของรอบ) | ${fmt(s.atRetire.p10)} · ${fmt(s.atRetire.p50)} · ${fmt(s.atRetire.p90)} |`,
    `| เงินเหลือตอนอายุ ${x.planToAge} (10% · 50% · 90%) | ${fmt(s.atEnd.p10)} · ${fmt(s.atEnd.p50)} · ${fmt(s.atEnd.p90)} |`,
    `| รอบที่เงินหมด: อายุกลาง | ${s.brokeAgeMedian === null ? 'ไม่มีรอบที่เงินหมด' : s.brokeAgeMedian} |`,
    '',
    `ออมเพิ่ม ${fmt(s.saving)} ต่อเดือน (${m.monthlySaving === undefined ? 'ตามที่แผนปกติคำนวณ' : 'ตามที่ผู้ใช้ใส่'}) + ${x.assets.map((a) => a.name).join(' · ') || 'ไม่มีเงินก้อนอื่น'} รวมเป็นพอร์ตเดียวใช้ผลตอบแทนชุดเดียว`,
    'แผนปกติถือว่าหลังเกษียณผลตอบแทนจริงเป็น 0 ส่วนการสุ่มให้เงินทำงานต่อหลังเกษียณ ถ้าอยากให้ระวังกว่านี้ ลด mc.retiredReturnPct',
  ].join('\n');
}

const fmt = (n) => Math.round(n).toLocaleString('en-US');
const showMonthly = (m) => (m === null ? 'ไม่มีเวลาออมแล้ว' : fmt(m));

export function report(r) {
  const { input: x, base: b } = r;
  const row = (name, c) => (c ? `| ${name} | ${fmt(c.spendYear)} | ${fmt(c.needed)} | ${fmt(c.pension.total + c.assetsFV)} | ${fmt(c.gap)} | ${showMonthly(c.monthly)} |` : `| ${name} | - | - | - | - | ใช้ไม่ได้กับตัวเลขนี้ |`);
  const out = [
    `อายุ ${x.age} เกษียณ ${x.retireAge} วางแผนถึง ${x.planToAge} · เงินเฟ้อ ${x.inflationPct}% · ผลตอบแทนเงินออมใหม่ ${x.returnPct}% ต่อปี`,
    ...b.warnings.map((w) => `คำเตือน: ${w}`),
    '',
    '| ขั้น | ผล |',
    '|---|---|',
    `| ค่าใช้จ่ายตอนเกษียณ | ${fmt(b.spendYear)} / ปี (${fmt(b.spendYear / 12)} / เดือน) |`,
    `| เงินที่ต้องมี (${b.yearsRetired} ปี ผลตอบแทนจริงหลังเกษียณ 0) | **${fmt(b.needed)}** |`,
    x.sso ? `| บำนาญประกันสังคม | ${fmt(b.pension.monthly)} / เดือน (${b.pension.pct}% × ${fmt(b.pension.wage)}, ${b.pension.months} เดือน) รวม −${fmt(b.pension.total)} · ไม่ปรับตามเงินเฟ้อ |` : '| บำนาญประกันสังคม | ไม่ได้ใส่ sso |',
    ...x.assets.map((a) => `| ${a.name} ตอนเกษียณ | ${fmt(a.monthly)}/เดือน + ยอด ${fmt(a.balance)} ที่ ${a.returnPct}% |`),
    `| เงินก้อนที่มีตอนเกษียณรวม | −${fmt(b.assetsFV)} |`,
    `| ส่วนที่ขาด | **${fmt(b.gap)}** |`,
    `| ต้องออมเพิ่มต่อเดือน | **${showMonthly(b.monthly)}** (${x.returnPct}%, ${b.years * 12} เดือน, ตัวคูณ ${b.factor.toFixed(1)}) |`,
    '',
    'สามคันโยก:',
    '',
    '| ทางเลือก | ค่าใช้จ่ายต่อปีตอนเกษียณ | เงินที่ต้องมี | บำนาญ + เงินก้อน | ส่วนที่ขาด | ออมต่อเดือน |',
    '|---|---|---|---|---|---|',
    row('ตามแผน', b),
    row(`เกษียณช้าลง ${x.levers.retireLaterYears} ปี`, r.levers.later),
    row(`ใช้จ่ายน้อยลง ${fmt(x.levers.spendLessMonthly)}/เดือน`, r.levers.less),
    '',
    `ออมมากขึ้น = ช่องออมต่อเดือนข้างบน · ตามผลตอบแทน: ${r.range.map((g) => `${g.returnPct}% → ${showMonthly(g.monthly)}`).join(' · ')}`,
    '',
    `ออมต่อเดือนเมื่อขยับ 2 คันโยกพร้อมกัน (ผลตอบแทน ${x.returnPct}%):`,
    '',
    `| อายุเกษียณ \\ ใช้จ่ายวันนี้ต่อเดือน | ${r.grid.spends.map(fmt).join(' | ')} |`,
    `|---|${r.grid.spends.map(() => '---').join('|')}|`,
    ...r.grid.ages.map((a, i) => `| ${a} | ${r.grid.monthly[i].map(showMonthly).join(' | ')} |`),
    '',
    `เพดานค่าจ้างประกันสังคมจาก sso-pension.json (ตรวจ ${SSO.checked}) · ทุกตัวเลขเป็นค่าประมาณ คิดใหม่ทุกปี · ผู้ใช้ตัดสิน`,
  ];
  return out.join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  // SKILL.md worked example
  const ex = { age: 35, retireAge: 60, planToAge: 85, spendMonthly: 30000, returnPct: 6, year: 2569, sso: { monthsNow: 0 }, assets: [{ name: 'PVD', monthly: 4000, returnPct: 5 }] };
  let r = plan(ex).base;
  t('ค่าใช้จ่าย 753,760 / ปี', near(r.spendYear, 753760, 1));
  t('เงินที่ต้องมี 18,844,000', near(r.needed, 18844000, 500));
  t('บำนาญ 35% × 23,000 = 8,050 รวม 2,415,000', r.pension.pct === 35 && near(r.pension.monthly, 8050, 0.001) && near(r.pension.total, 2415000, 0.01));
  t('PVD 2,382,039', near(r.assetsFV, 2382039, 1));
  t('ส่วนที่ขาด 14,047,000', near(r.gap, 14047000, 500));
  t('ตัวคูณ 693.0', near(r.factor, 693.0, 0.05));
  t('ออม 20,270 / เดือน', near(r.monthly, 20270, 1));
  // 0 years to retirement: no division by zero, says there is no time left
  r = plan({ ...ex, age: 60 }).base;
  t('0 ปีถึงเกษียณ', r.years === 0 && r.monthly === null && r.gap > 0 && near(r.spendYear, 360000, 0.01));
  t('0 ปี รายงานไม่พัง', report(plan({ ...ex, age: 60 })).includes('ไม่มีเวลาออมแล้ว'));
  // 0% return: factor = months
  r = plan({ ...ex, returnPct: 0, assets: [{ name: 'PVD', monthly: 4000, returnPct: 0 }] }).base;
  t('ผลตอบแทน 0% ตัวคูณ = 300', r.factor === 300 && near(r.assetsFV, 1200000, 0.01) && near(r.monthly, r.gap / 300, 0.001));
  // pension rule edges (SKILL.md line 31)
  t('179 เดือน = 0', pensionPct(179) === 0);
  t('180 เดือน = 20%', pensionPct(180) === 20);
  t('191 เดือน = 20%, 192 = 21.5%', pensionPct(191) === 20 && pensionPct(192) === 21.5);
  // wage ceilings (SKILL.md line 33)
  t('เพดาน 2568 15,000 · 2571 17,500 · 2572 20,000 · 2575 23,000', ceilingFor(2568) === 15000 && ceilingFor(2571) === 17500 && ceilingFor(2572) === 20000 && ceilingFor(2575) === 23000);
  r = plan({ ...ex, sso: { monthsNow: 0, avgWage: 40000 } }).base;
  t('ค่าจ้างเกินเพดาน ตัดที่เพดาน', r.pension.wage === 23000 && r.warnings.length === 1);
  // retire before 55: pension paid from 55 only
  r = plan({ ...ex, age: 30, retireAge: 50, sso: { monthsNow: 0 } }).base;
  t('เกษียณ 50 บำนาญเริ่ม 55', near(r.pension.total, r.pension.monthly * 12 * 30, 0.01));
  // enough assets: gap 0, saving 0
  r = plan({ ...ex, assets: [{ name: 'มีแล้ว', balance: 20000000, returnPct: 0 }] }).base;
  t('เงินพอแล้ว ออม 0', r.gap === 0 && r.monthly === 0);
  // levers move the number the right way
  const p = plan(ex);
  t('เกษียณช้าลงออมน้อยลง', p.levers.later.monthly < p.base.monthly);
  t('ใช้น้อยลงออมน้อยลง', p.levers.less.monthly < p.base.monthly);
  t('ช่วงผลตอบแทน 3% มากกว่า 6%', p.range[0].monthly > p.range[2].monthly && near(p.range[2].monthly, 20270, 1));
  // bad input names the field
  const throwsWith = (inp, word) => { try { plan(inp); return false; } catch (e) { return e.message.includes(word); } };
  t('อายุเกษียณน้อยกว่าอายุ', throwsWith({ ...ex, retireAge: 30 }, 'retireAge'));
  t('planToAge ไม่เกิน retireAge', throwsWith({ ...ex, planToAge: 60 }, 'planToAge'));
  t('ไม่มี returnPct', throwsWith({ ...ex, returnPct: undefined }, 'returnPct'));
  t('spendMonthly 0', throwsWith({ ...ex, spendMonthly: 0 }, 'spendMonthly'));
  t('assets ค่าผิด', throwsWith({ ...ex, assets: [{ name: 'PVD', monthly: 'x', returnPct: 5 }] }, 'assets[0].monthly'));
  t('sso.monthsPerYear เกิน 12', throwsWith({ ...ex, sso: { monthsNow: 0, monthsPerYear: 13 } }, 'monthsPerYear'));
  // two-way table: corner cells equal the plan and the single levers
  t('ตาราง 2 ทาง มุมตรงแผนและคันโยก', p.grid.ages.join() === '60,63,66' && p.grid.spends.join() === '30000,25000,20000'
    && p.grid.monthly[0][0] === p.base.monthly && p.grid.monthly[1][0] === p.levers.later.monthly && p.grid.monthly[0][1] === p.levers.less.monthly
    && p.grid.monthly[2][2] < p.grid.monthly[1][1]);
  t('ตาราง 2 ทาง ตัดอายุที่เกิน planToAge', plan({ ...ex, planToAge: 64 }).grid.ages.join() === '60,63');
  // Monte Carlo. Set 1 (hand-worked): retired at 60, 0% return, 0 volatility, 60,000 a year for 20 years
  const sim = (inp) => { const q = plan(inp); return simulate(q.input, q.base, validateMc(q.input)); };
  const retired = { age: 60, retireAge: 60, planToAge: 80, spendMonthly: 5000, inflationPct: 0, returnPct: 0, year: 2569, mc: { sdPct: 0, runs: 100 } };
  let s = sim({ ...retired, assets: [{ name: 'เงินก้อน', balance: 1200000, returnPct: 0 }] });
  t('MC 1,200,000 พอดี 20 ปี: อยู่รอด 100% เหลือ 0', s.successPct === 100 && s.atEnd.p50 === 0 && s.atRetire.p50 === 1200000);
  s = sim({ ...retired, assets: [{ name: 'เงินก้อน', balance: 1000000, returnPct: 0 }] });
  t('MC 1,000,000 หมดตอนอายุ 76 (ถอน 16 ปี เหลือ 40,000)', s.successPct === 0 && s.brokeAgeMedian === 76);
  // Set 2 (hand-worked, monthly like the plan): 100,000 × (1 + 0.10/12)^24 + 1,000 × ((1 + 0.10/12)^24 − 1) ÷ (0.10/12)
  //   = 122,039.1 + 26,446.9 = 148,486.0
  s = sim({ age: 58, retireAge: 60, planToAge: 61, spendMonthly: 1, inflationPct: 0, returnPct: 10, year: 2569,
    assets: [{ name: 'PVD', balance: 100000, monthly: 1000, returnPct: 10 }], mc: { sdPct: 0, runs: 100, monthlySaving: 0 } });
  t('MC สะสม 2 ปี รายเดือน = 148,486', near(s.atRetire.p50, 148486, 1));
  // Set 2b: volatility 0 gives the plan's own answer (pot at retirement within 0.1%, and 100% when the plan says enough)
  const flat = (inp) => { const q = plan(inp); return { q, s: simulate(q.input, q.base, validateMc(q.input)) }; };
  let f = flat({ ...ex, mc: { sdPct: 0, runs: 100 } });
  const planPot = f.q.base.assetsFV + f.q.base.monthly * f.q.base.factor;
  t('MC ผันผวน 0 เงินก้อนตรงแผน (16.43 ล้าน)', Math.abs(f.s.atRetire.p50 - planPot) / planPot <= 0.001 && near(planPot, 16429000, 1000));
  t('MC ผันผวน 0 แผนบอกพอ โอกาส 100%', f.s.successPct === 100);
  f = flat({ ...ex, assets: [{ name: 'PVD', balance: 300000, monthly: 4000, returnPct: 4 }, { name: 'RMF', balance: 50000, monthly: 2000, returnPct: 7 }], mc: { sdPct: 0, runs: 100 } });
  const planPot2 = f.q.base.assetsFV + f.q.base.monthly * f.q.base.factor;
  t('MC ผันผวน 0 หลายกอง ผลตอบแทนต่างกัน ตรงแผน', Math.abs(f.s.atRetire.p50 - planPot2) / planPot2 <= 0.001 && f.s.successPct === 100);
  f = flat({ ...ex, assets: [{ name: 'PVD', balance: 30000000, monthly: 0, returnPct: 5 }], mc: { sdPct: 0, runs: 100 } });
  t('MC ผันผวน 0 มีเงินพอโดยไม่ต้องออมเพิ่ม โอกาส 100%', f.q.base.monthly === 0 && f.s.successPct === 100 && Math.abs(f.s.atRetire.p50 - f.q.base.assetsFV) / f.q.base.assetsFV <= 0.001);
  // Set 3: same seed = same answer, more volatility = wider spread, percentiles in order
  const vol = { ...ex, mc: { sdPct: 12, runs: 2000 } };
  const s1 = sim(vol), s2 = sim(vol), s3 = sim({ ...ex, mc: { sdPct: 20, runs: 2000 } });
  t('MC seed เดิมได้ผลเดิม', s1.successPct === s2.successPct && s1.atEnd.p50 === s2.atEnd.p50);
  t('MC เปอร์เซ็นไทล์เรียงกัน', s1.atRetire.p10 <= s1.atRetire.p50 && s1.atRetire.p50 <= s1.atRetire.p90);
  t('MC ผันผวนมากขึ้น p10 ต่ำลง p90 สูงขึ้น', s3.atRetire.p10 < s1.atRetire.p10 && s3.atRetire.p90 > s1.atRetire.p90);
  t('MC ไม่ใส่ sdPct ต้องหยุด', (() => { try { sim({ ...ex, mc: {} }); return false; } catch (e) { return e.message.includes('mc.sdPct'); } })());
  t('MC ไม่มีช่อง mc ต้องหยุด', (() => { try { sim(ex); return false; } catch (e) { return e.message.includes('mc'); } })());
  console.log(`self-test: ${ok} ผ่าน ${bad} ล้ม`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('ใช้: node retire.mjs <ไฟล์.json> [--json] [--mc] | --self-test'); process.exit(2); }
  try {
    const r = plan(JSON.parse(readFileSync(file, 'utf8')));
    if (args.includes('--mc')) {
      const s = simulate(r.input, r.base, validateMc(r.input));
      console.log(args.includes('--json') ? JSON.stringify(s, null, 2) : reportMc(r, s));
    } else console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(r));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
