#!/usr/bin/env node
// retire.mjs - Thai retirement sum, social security pension, monthly saving and three levers (Node stdlib only)
// Usage: node retire.mjs <file.json> [--json]   |   node retire.mjs --self-test
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
  return { input: x, base, levers: { later, less }, range };
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
  console.log(`self-test: ${ok} ผ่าน ${bad} ล้ม`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('ใช้: node retire.mjs <ไฟล์.json> [--json] | --self-test'); process.exit(2); }
  try {
    const r = plan(JSON.parse(readFileSync(file, 'utf8')));
    console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(r));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
