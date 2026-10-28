#!/usr/bin/env node
// payroll.mjs - เงินเดือนสุทธิ ประกันสังคม กองทุนสำรองเลี้ยงชีพ และภาษีหัก ณ ที่จ่ายต่อเดือน (Node stdlib only)
// Usage: node payroll.mjs <file.json> [--json]   |   node payroll.mjs --self-test
// File: { "employees": [ { "name": "A", "gross": 50000, "pvd_employee_pct": 0, "pvd_employer_pct": 0,
//   "spouse": false, "children": 0, "children_2nd_plus": 0, "parents": 0, "other_deductions": 0, "periods": 12 } ] }
// ทุกช่องนอกจาก name และ gross ไม่บังคับ (ค่าเริ่มต้น 0 / false / 12) · gross = เงินได้ที่ต้องเสียภาษีต่อเดือน
// ขั้นบันไดภาษี เพดานประกันสังคม และค่าลดหย่อนอยู่ใน rates.json (ข้างไฟล์นี้) · เงินได้ทั้งปี = gross x periods
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RATES_FILE = join(dirname(fileURLToPath(import.meta.url)), 'rates.json');
export const loadRates = () => JSON.parse(readFileSync(RATES_FILE, 'utf8'));

const round2 = (n) => Math.round(n * 100) / 100;

export function validate(input) {
  const num = (v, label, max = Infinity) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > max) throw new Error(`ช่อง ${label} ต้องเป็นตัวเลขตั้งแต่ 0${max < Infinity ? ` ถึง ${max}` : ''} (ได้ ${JSON.stringify(v)})`);
  };
  if (!input || typeof input !== 'object') throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  if (!Array.isArray(input.employees) || input.employees.length === 0) throw new Error('ช่อง employees ต้องเป็นรายชื่อพนักงานอย่างน้อย 1 คน');
  const warnings = [];
  input.employees.forEach((e, i) => {
    const n = e?.name ?? `คนที่ ${i + 1}`;
    const at = (f) => `employees[${i}].${f} (${n})`;
    if (!e?.name || typeof e.name !== 'string') throw new Error(`ช่อง employees[${i}].name ต้องเป็นข้อความ`);
    if (typeof e.gross !== 'number' || !Number.isFinite(e.gross) || e.gross <= 0) throw new Error(`ช่อง ${at('gross')} ต้องเป็นตัวเลขมากกว่า 0 (ได้ ${JSON.stringify(e.gross)})`);
    for (const f of ['pvd_employee_pct', 'pvd_employer_pct', 'children', 'children_2nd_plus', 'parents', 'other_deductions', 'periods']) {
      if (e[f] !== undefined) num(e[f], at(f), f.endsWith('_pct') ? 100 : Infinity);
    }
    if (e.spouse !== undefined && typeof e.spouse !== 'boolean') throw new Error(`ช่อง ${at('spouse')} ต้องเป็น true หรือ false`);
    if (e.periods !== undefined && !Number.isInteger(e.periods)) throw new Error(`ช่อง ${at('periods')} ต้องเป็นจำนวนเต็ม (จำนวนงวดจ่ายในปี)`);
    if (e.periods === 0) throw new Error(`ช่อง ${at('periods')} ต้องมากกว่า 0`);
    if (e.pvd_employee_pct > 15) warnings.push(`${n}: PVD ลูกจ้าง ${e.pvd_employee_pct}% เกิน 15% ของค่าจ้าง · ลดหย่อนภาษีได้ไม่เกิน 15%`);
  });
  return warnings;
}

// ภาษีขั้นบันได: เก็บตามช่วงของเงินได้สุทธิ
export function progressiveTax(netIncome, brackets) {
  let tax = 0;
  let lower = 0;
  for (const { up_to, rate_pct } of brackets) {
    const top = up_to ?? Infinity;
    if (netIncome > lower) tax += (Math.min(netIncome, top) - lower) * (rate_pct / 100);
    lower = top;
  }
  return tax;
}

export function calcEmployee(e, rates) {
  const periods = e.periods ?? 12;
  // ปัดเป็นบาทตาม social-security-th/SKILL.md (ทิศการปัดไม่ระบุ ใช้ปัดครึ่งขึ้น)
  // ฐานและเพดานประกันสังคมเป็นรายเดือน: คิดจากค่าจ้างเฉลี่ยต่อเดือน แล้วกระจายกลับเป็นต่องวด (periods 12 ได้ค่าเดิม)
  const ssoMonthly = Math.round(Math.min(Math.max((e.gross * periods) / 12, rates.sso.wage_floor), rates.sso.wage_cap) * (rates.sso.rate_pct / 100));
  const sso = round2((ssoMonthly * 12) / periods);
  const pvdEmployee = (e.gross * (e.pvd_employee_pct ?? 0)) / 100;
  const pvdEmployer = (e.gross * (e.pvd_employer_pct ?? 0)) / 100;

  const annualIncome = e.gross * periods;
  const expense = Math.min(annualIncome * (rates.expense.rate_pct / 100), rates.expense.max);
  const a = rates.allowance;
  const pvdAllowance = Math.min(pvdEmployee * periods, annualIncome * (rates.pvd.max_pct_of_wage / 100), rates.pvd.retirement_cap);
  const allowances = a.personal + (e.spouse ? a.spouse : 0)
    + (e.children ?? 0) * a.child + (e.children_2nd_plus ?? 0) * a.child_2nd_plus_born_2561
    + (e.parents ?? 0) * a.parent + ssoMonthly * 12 + pvdAllowance + (e.other_deductions ?? 0);
  const netIncome = Math.max(0, annualIncome - expense - allowances);
  const annualTax = progressiveTax(netIncome, rates.brackets);
  const wht = annualTax / periods;

  return {
    name: e.name, gross: e.gross, sso, pvd_employee: pvdEmployee, pvd_employer: pvdEmployer,
    annual_income: annualIncome, expense, allowances, net_income: netIncome, annual_tax: annualTax,
    wht, net_pay: e.gross - sso - pvdEmployee - wht,
  };
}

export function calc(input, rates = loadRates()) {
  const warnings = validate(input);
  return { rates: { checked: rates.checked, source: rates.source }, employees: input.employees.map((e) => calcEmployee(e, rates)), warnings };
}

const baht = (n) => round2(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function report(r) {
  const rows = r.employees.map((x) => `| ${x.name} | ${baht(x.gross)} | ${baht(x.sso)} | ${baht(x.pvd_employee)} | ${baht(x.net_income)} | ${baht(x.annual_tax)} | ${baht(x.wht)} | **${baht(x.net_pay)}** |`);
  return [
    `อัตราภาษีและเพดานประกันสังคมตรวจล่าสุด ${r.rates.checked} · แหล่ง: ${r.rates.source}`,
    ...r.warnings.map((w) => `คำเตือน: ${w}`),
    '',
    '| ชื่อ | เงินได้/เดือน | ประกันสังคม | PVD ลูกจ้าง | เงินได้สุทธิ/ปี | ภาษี/ปี | ภาษีหัก ณ ที่จ่าย/เดือน | เงินสุทธิ |',
    '|---|---|---|---|---|---|---|---|',
    ...rows,
    '',
    'ไม่รวมโบนัส พนักงานเข้ากลางปี และเงินได้ที่จ่ายไปแล้ว (ดู SKILL.md ส่วนโบนัส) · ข้อมูลประกอบ ไม่ใช่คำแนะนำด้านภาษี · เคสพิเศษถามนักบัญชี',
  ].join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, b) => Math.abs(a - b) < 0.005;
  const rates = loadRates();
  const one = (e) => calcEmployee({ name: 'A', ...e }, rates);
  // SKILL.md: เงินเดือน 50,000 ไม่มี PVD -> เงินได้สุทธิ 429,500 ภาษี 20,450 หัก 1,704.17 สุทธิ 47,420.83
  let x = one({ gross: 50000 });
  t('ตัวอย่าง SKILL.md เงินได้สุทธิ', near(x.net_income, 429500));
  t('ตัวอย่าง SKILL.md ภาษี/ปี', near(x.annual_tax, 20450));
  t('ตัวอย่าง SKILL.md หัก/เดือน', near(x.wht, 1704.17));
  t('ตัวอย่าง SKILL.md สุทธิ', near(x.net_pay, 47420.83) && near(x.sso, 875));
  // ต่ำกว่าเกณฑ์: 10,000 -> 120,000 - 60,000 - 60,000 - 6,000 < 0 -> ภาษี 0, ประกันสังคม 500
  x = one({ gross: 10000 });
  t('ต่ำกว่าเกณฑ์ ภาษี 0', x.net_income === 0 && x.wht === 0);
  t('ต่ำกว่าเกณฑ์ สุทธิ = 9,500', near(x.sso, 500) && near(x.net_pay, 9500));
  // เกินเพดาน: 30,000 -> ประกันสังคมหยุดที่ 875 · เงินได้สุทธิ 189,500 · ภาษี 1,975 · หัก 164.58
  x = one({ gross: 30000 });
  t('เกินเพดาน ประกันสังคม 875', near(x.sso, 875));
  t('เกินเพดาน ภาษี 1,975 หัก 164.58', near(x.annual_tax, 1975) && near(x.wht, 164.58));
  // ฐานขั้นต่ำ 1,650 -> 83 · ปัดเป็นบาท 15,330 x 5% = 766.5 -> 767
  t('ประกันสังคมฐานขั้นต่ำ', one({ gross: 1000 }).sso === 83);
  t('ประกันสังคมปัดเป็นบาท', one({ gross: 15330 }).sso === 767);
  // PVD 5% ของ 50,000 = 2,500/เดือน = 30,000/ปี -> เงินได้สุทธิ 399,500 ภาษี 17,450 หัก 1,454.17
  x = one({ gross: 50000, pvd_employee_pct: 5, pvd_employer_pct: 5 });
  t('PVD ลดภาษี', near(x.net_income, 399500) && near(x.annual_tax, 17450) && near(x.wht, 1454.17));
  t('PVD หักจากเงินสุทธิ นายจ้างสมทบแยก', near(x.net_pay, 50000 - 875 - 2500 - 1454.17) && near(x.pvd_employer, 2500));
  // PVD 20% ลดหย่อนได้แค่ 15% ของเงินได้ทั้งปี (15% x 600,000 = 90,000)
  x = one({ gross: 50000, pvd_employee_pct: 20 });
  t('PVD ลดหย่อนไม่เกิน 15%', near(x.net_income, 429500 - 90000));
  // ลดหย่อนครอบครัว: คู่สมรส 60,000 + ลูก 30,000 + ลูกคนที่ 2+ 60,000 + พ่อแม่ 2 คน 60,000
  x = one({ gross: 50000, spouse: true, children: 1, children_2nd_plus: 1, parents: 2 });
  t('ลดหย่อนครอบครัว', near(x.net_income, 429500 - 60000 - 30000 - 60000 - 60000));
  // edge/pr4: periods 52 เคยลดหย่อนประกันสังคม 45,500 · ต้องไม่เกิน 875 x 12 = 10,500
  const sso12 = rates.sso.wage_cap * (rates.sso.rate_pct / 100) * 12;
  t('periods 13 ลดหย่อนประกันสังคม 10,500', near(one({ gross: 50000, periods: 13 }).allowances, 60000 + sso12));
  t('periods 52 ลดหย่อนประกันสังคม 10,500', near(one({ gross: 50000, periods: 52 }).allowances, 60000 + sso12));
  t('periods 1 ค่าจ้างเฉลี่ยเกินเพดาน ลดหย่อน 10,500', near(one({ gross: 600000, periods: 1 }).allowances, 60000 + sso12));
  // รายสัปดาห์ 5,000 x 52 / 12 = 21,667 ต่อเดือน เกินเพดาน → 875 ต่อเดือน · 10,500 ต่อปี · งวดละ 201.92
  // (สูตรเดิมใช้ 5,000 เป็นฐานรายเดือน ได้งวดละ 250 · ลดหย่อน 13,000)
  x = one({ gross: 5000, periods: 52 });
  t('periods 52 ฐานจากค่าจ้างต่อเดือน', near(x.allowances, 60000 + sso12) && near(x.sso, 201.92));
  // ขั้นบันได: ตรงกับตาราง SKILL.md
  const tax = (n) => progressiveTax(n, rates.brackets);
  t('ขั้น 150,000 = 0', tax(150000) === 0);
  t('ขั้น 300,000 = 7,500', near(tax(300000), 7500));
  t('ขั้น 2,000,000 = 365,000', near(tax(2000000), 365000));
  t('ขั้น 5,000,000 = 1,265,000', near(tax(5000000), 1265000));
  t('เกิน 5,000,000 อัตรา 35%', near(tax(6000000), 1265000 + 350000));
  // rates.json ตรงกับ facts.json (มีเฉพาะใน repo)
  const facts = join(dirname(RATES_FILE), '..', '..', '..', '..', '..', 'scripts', 'check', 'facts.json');
  try {
    const cap = Number(JSON.parse(readFileSync(facts, 'utf8')).facts['sso-wage-cap-2569'].value.replace(/,/g, ''));
    t('เพดานประกันสังคมตรง facts.json', cap === rates.sso.wage_cap);
  } catch (err) { if (err.code !== 'ENOENT') throw err; }
  // input checks
  const throwsWith = (inp, word) => { try { calc(inp, rates); return false; } catch (err) { return err.message.includes(word); } };
  const emp = (e) => ({ employees: [{ name: 'A', gross: 20000, ...e }] });
  t('ไม่มี employees', throwsWith({ employees: [] }, 'employees'));
  t('gross เป็นข้อความ', throwsWith(emp({ gross: '20000' }), 'gross'));
  t('gross ติดลบ', throwsWith(emp({ gross: -1 }), 'gross'));
  t('children ติดลบ', throwsWith(emp({ children: -1 }), 'children'));
  t('spouse ไม่ใช่ boolean', throwsWith(emp({ spouse: 'yes' }), 'spouse'));
  t('periods ไม่ใช่จำนวนเต็ม', throwsWith(emp({ periods: 6.5 }), 'periods'));
  t('PVD เกิน 15% เตือน', calc(emp({ pvd_employee_pct: 20 }), rates).warnings.length === 1);
  t('รายงานพิมพ์วันที่ตรวจ', report(calc(emp({}), rates)).includes(rates.checked));
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('ใช้: node payroll.mjs <ไฟล์.json> [--json] | --self-test'); process.exit(2); }
  try {
    const r = calc(JSON.parse(readFileSync(file, 'utf8')));
    console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(r));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
