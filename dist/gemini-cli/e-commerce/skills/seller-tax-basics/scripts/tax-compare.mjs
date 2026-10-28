#!/usr/bin/env node
// tax-compare.mjs - ภาษีคนขายของออนไลน์ 40(8): หักเหมา 60% เทียบหักตามจริง และบุคคลธรรมดาเทียบบริษัท SME (Node stdlib only)
// Usage: node tax-compare.mjs <file.json> [--json] [--payoff]   |   node tax-compare.mjs --self-test
// โหมด seller (ค่าตั้งต้น): { "sales": 1200000, "actual_expenses": 900000, "allowances": 60000 }
//   allowances = ลดหย่อนรวมทั้งปี (ไม่ใส่ = ลดหย่อนส่วนตัวใน rates.json) · ไม่รวมเงินได้ประเภทอื่น (เงินเดือน → payroll-th)
// โหมด company: { "mode": "company", "company_yearly_cost": 60000, "allowances": 60000,
//   "scenarios": [ { "name": "กำไร 300,000", "profit": 300000, "p": 0.4, "sales": 2000000 } ] }
//   profit = กำไรก่อนภาษีหลังหักค่าใช้จ่ายจริง · p = โอกาสที่ผู้ใช้ให้ (ไม่เดาแทน) · sales ไม่บังคับ ใส่แล้วคิดวิธีที่ 2 (0.5%) ให้ฝั่งบุคคล
//   company_yearly_cost = ค่าทำบัญชีและสอบบัญชีที่บริษัทจ่ายเพิ่ม (ถามผู้ใช้หรือใบเสนอราคาจริง)
//   --payoff พิมพ์ JSON สำหรับ `decide.mjs payoff` (ภาษี + ค่าใช้จ่ายเพิ่ม ยิ่งน้อยยิ่งดี)
// อัตราทุกตัวอยู่ใน rates.json ข้างไฟล์นี้ พร้อมวันที่ตรวจ · เก่ากว่า 90 วันขึ้นคำเตือน
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const RATES_FILE = join(dirname(fileURLToPath(import.meta.url)), 'rates.json');
export const loadRates = () => JSON.parse(readFileSync(RATES_FILE, 'utf8'));
// อัตราภาษีเปลี่ยนปีละครั้งหรือน้อยกว่า · 90 วันเป็นค่าตั้งต้น ยังไม่ได้วัด (เท่ากับ payroll.mjs)
const RATES_MAX_AGE_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

const round2 = (n) => Math.round(n * 100) / 100;

// ภาษีขั้นบันได แบบเดียวกับ payroll-th/scripts/payroll.mjs (skill ติดตั้งแยกกันได้ จึงไม่ import ข้าม skill)
export function progressiveTax(net, brackets) {
  let tax = 0;
  let lower = 0;
  for (const { up_to, rate_pct } of brackets) {
    const top = up_to ?? Infinity;
    if (net > lower) tax += (Math.min(net, top) - lower) * (rate_pct / 100);
    lower = top;
  }
  return round2(tax);
}

// วิธีที่ 2: เงินได้นอกจากเงินเดือน x 0.5% ใช้เมื่อเงินได้ถึงเกณฑ์และภาษีวิธีนี้เกิน 5,000
export function minTax(income, rates) {
  const m = rates.min_tax;
  if (income < m.applies_from_income) return 0;
  const tax = round2(income * (m.rate_pct / 100));
  return tax > m.exempt_up_to_tax ? tax : 0;
}

export function personalTax(sales, expense, allowances, rates) {
  const net = Math.max(0, sales - expense - allowances);
  const normal = progressiveTax(net, rates.brackets);
  const minimum = minTax(sales, rates);
  return { expense, net_income: net, normal_tax: normal, min_tax: minimum, payable: Math.max(normal, minimum) };
}

function staleWarning(rates, today) {
  const age = Math.floor((today - new Date(`${rates.checked}T00:00:00Z`)) / DAY_MS);
  return age > RATES_MAX_AGE_DAYS
    ? [`rates.json ตรวจล่าสุด ${rates.checked} (${age} วันก่อน) เก่ากว่า ${RATES_MAX_AGE_DAYS} วัน · เทียบกับ rd.go.th แล้วแก้ค่าและ checked ใน rates.json`]
    : [];
}

const num = (v, label) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) throw new Error(`ช่อง ${label} ต้องเป็นตัวเลขตั้งแต่ 0 (ได้ ${JSON.stringify(v)})`);
};

export function compareSeller(input, rates = loadRates(), today = new Date()) {
  num(input.sales, 'sales');
  num(input.actual_expenses, 'actual_expenses');
  const allowances = input.allowances ?? rates.personal_allowance;
  num(allowances, 'allowances');
  const warnings = staleWarning(rates, today);
  if (input.actual_expenses > input.sales) warnings.push(`actual_expenses ${input.actual_expenses} มากกว่า sales ${input.sales} (ขาดทุน) · เช็คว่าไม่ได้รวมของที่ยังไม่ขายหรือค่าใช้จ่ายส่วนตัว`);
  if (input.allowances !== undefined && input.allowances < rates.personal_allowance) warnings.push(`allowances ${input.allowances} น้อยกว่าลดหย่อนส่วนตัว ${rates.personal_allowance} · ใส่ลดหย่อนรวมทั้งปี`);
  const deemed = personalTax(input.sales, round2(input.sales * (rates.deemed_expense_pct / 100)), allowances, rates);
  const actual = personalTax(input.sales, input.actual_expenses, allowances, rates);
  const cheaper = actual.payable < deemed.payable ? 'actual' : 'deemed';
  return { mode: 'seller', rates: { checked: rates.checked, source: rates.source }, sales: input.sales, allowances, deemed, actual, cheaper, warnings };
}

export function compareCompany(input, rates = loadRates(), today = new Date()) {
  num(input.company_yearly_cost, 'company_yearly_cost');
  const allowances = input.allowances ?? rates.personal_allowance;
  num(allowances, 'allowances');
  if (!Array.isArray(input.scenarios) || input.scenarios.length === 0) throw new Error('ช่อง scenarios ต้องมีสถานการณ์กำไรอย่างน้อย 1 แบบ เช่น [{ "name": "กำไร 1 ล้าน", "profit": 1000000, "p": 1 }]');
  input.scenarios.forEach((s, i) => {
    if (!s?.name) throw new Error(`ช่อง scenarios[${i}].name ต้องเป็นข้อความ`);
    num(s.profit, `scenarios[${i}].profit`);
    if (typeof s.p !== 'number' || s.p < 0 || s.p > 1) throw new Error(`ช่อง scenarios[${i}].p ต้องเป็นโอกาส 0 ถึง 1 ที่ผู้ใช้ให้ (ได้ ${JSON.stringify(s.p)}) · ไม่เดาแทนผู้ใช้`);
    if (s.sales !== undefined) num(s.sales, `scenarios[${i}].sales`);
    if (input.scenarios.findIndex((x) => x.name === s.name) !== i) throw new Error(`ช่อง scenarios[${i}].name "${s.name}" ซ้ำกับสถานการณ์ก่อนหน้า · ตารางผลจะแยกไม่ออก · ตั้งชื่อให้ต่างกัน`);
  });
  const sumP = input.scenarios.reduce((t, s) => t + s.p, 0);
  if (Math.abs(sumP - 1) > 0.001) throw new Error(`โอกาสของทุกสถานการณ์รวมกันได้ ${round2(sumP)} ต้องเป็น 1 · ถามผู้ใช้ใหม่`);
  const warnings = staleWarning(rates, today);
  warnings.push('ฝั่งบุคคลธรรมดาคิดจากกำไรหลังหักค่าใช้จ่ายจริง ยังไม่ได้ลองหักเหมา 60% · ถ้าหักเหมาแล้วภาษีต่ำกว่า ส่วนต่างกับบริษัทจะแคบลง ให้รันโหมด seller เทียบอีกรอบ');
  const rows = input.scenarios.map((s) => {
    const net = Math.max(0, s.profit - allowances);
    const normal = progressiveTax(net, rates.brackets);
    const personal = s.sales === undefined ? normal : Math.max(normal, minTax(s.sales, rates));
    const companyTax = progressiveTax(s.profit, rates.sme_company_brackets);
    return { name: s.name, p: s.p, profit: s.profit, personal, company_tax: companyTax, company_total: round2(companyTax + input.company_yearly_cost) };
  });
  return { mode: 'company', rates: { checked: rates.checked, source: rates.source }, allowances, company_yearly_cost: input.company_yearly_cost, rows, warnings };
}

export function compare(input, rates = loadRates(), today = new Date()) {
  if (!input || typeof input !== 'object') throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  if (input.mode === 'company') return compareCompany(input, rates, today);
  if (input.mode !== undefined && input.mode !== 'seller') throw new Error(`ช่อง mode ต้องเป็น seller หรือ company (ได้ ${JSON.stringify(input.mode)})`);
  return compareSeller(input, rates, today);
}

// JSON สำหรับ decide.mjs payoff: ภาษีรวมค่าใช้จ่ายเพิ่ม ยิ่งน้อยยิ่งดี
export function toPayoff(r) {
  return {
    _note: `จาก tax-compare.mjs · อัตราตรวจล่าสุด ${r.rates.checked} · ไม่รวมภาษีชั้นที่ 2 ตอนจ่ายเงินออกจากบริษัท (เงินเดือนกรรมการหรือเงินปันผล) ให้นักบัญชีคิดเพิ่ม`,
    better: 'low',
    options: ['บุคคลธรรมดา', 'บริษัท SME'],
    scenarios: r.rows.map((x) => ({ name: x.name, p: x.p })),
    table: { 'บุคคลธรรมดา': r.rows.map((x) => x.personal), 'บริษัท SME': r.rows.map((x) => x.company_total) },
  };
}

const baht = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function report(r) {
  const head = [`อัตราตรวจล่าสุด ${r.rates.checked} · แหล่ง: ${r.rates.source}`, ...r.warnings.map((w) => `คำเตือน: ${w}`), ''];
  const foot = ['', 'ข้อมูลประกอบ ไม่ใช่คำแนะนำด้านภาษี · ยืนยันกับ rd.go.th หรือนักบัญชีก่อนยื่น'];
  if (r.mode === 'company') {
    return [...head,
      '| สถานการณ์ | โอกาส | กำไร | ภาษีบุคคลธรรมดา | ภาษีบริษัท SME | บริษัท + ค่าใช้จ่ายเพิ่ม |', '|---|---|---|---|---|---|',
      ...r.rows.map((x) => `| ${x.name} | ${x.p} | ${baht(x.profit)} | ${baht(x.personal)} | ${baht(x.company_tax)} | ${baht(x.company_total)} |`),
      '', `ค่าใช้จ่ายเพิ่มของบริษัท ${baht(r.company_yearly_cost)} ต่อปี · ไม่รวมภาษีชั้นที่ 2 ตอนจ่ายเงินออกจากบริษัท · ใช้ --payoff แล้วส่งต่อ decide.mjs payoff`, ...foot].join('\n');
  }
  const row = (label, f) => `| ${label} | ${baht(f(r.deemed))} | ${baht(f(r.actual))} |`;
  return [...head,
    '| | หักเหมา 60% | หักตามจริง |', '|---|---|---|',
    row('ค่าใช้จ่าย', (x) => x.expense),
    row('เงินได้สุทธิ (หลังลดหย่อน)', (x) => x.net_income),
    row('ภาษีขั้นบันได', (x) => x.normal_tax),
    row('วิธีที่ 2 (0.5% ของยอดขาย ใช้เมื่อเกิน 5,000)', (x) => x.min_tax),
    row('**ภาษีที่ต้องจ่าย**', (x) => x.payable),
    '', `ถูกกว่า: ${r.cheaper === 'actual' ? 'หักตามจริง (ต้องมีใบเสร็จทุกบาท)' : 'หักเหมา 60%'}`, ...foot].join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const rates = loadRates();
  const FRESH = new Date(`${rates.checked}T00:00:00Z`);
  const seller = (i) => compareSeller(i, rates, FRESH);
  // SKILL.md: ขาย 1,200,000 ต้นทุนจริง 900,000 → หักเหมา 19,500 · หักจริง 4,500 ยกขึ้นเป็น 6,000
  let r = seller({ sales: 1200000, actual_expenses: 900000 });
  t('SKILL หักเหมา เงินได้สุทธิ 420,000', r.deemed.net_income === 420000);
  t('SKILL หักเหมา 19,500', r.deemed.payable === 19500);
  t('SKILL หักจริง ขั้นบันได 4,500', r.actual.normal_tax === 4500);
  t('SKILL หักจริง 0.5% ยกเป็น 6,000', r.actual.min_tax === 6000 && r.actual.payable === 6000);
  t('SKILL หักจริงถูกกว่า', r.cheaper === 'actual');
  // เกณฑ์ 120,000: 119,999 ไม่เข้าวิธีที่ 2 · 120,000 เข้า แต่ 0.5% = 600 ไม่เกิน 5,000 จึงไม่ใช้
  t('119,999 ไม่คิดวิธีที่ 2', minTax(119999, rates) === 0);
  t('120,000 วิธีที่ 2 = 600 ไม่เกิน 5,000 ไม่ใช้', minTax(120000, rates) === 0);
  t('1,000,000 วิธีที่ 2 = 5,000 พอดี ไม่ใช้', minTax(1000000, rates) === 0);
  t('1,000,200 วิธีที่ 2 = 5,001 ใช้', minTax(1000200, rates) === 5001);
  // ค่าขอบ
  r = seller({ sales: 0, actual_expenses: 0 });
  t('ขาย 0 ภาษี 0', r.deemed.payable === 0 && r.actual.payable === 0 && r.warnings.length === 0);
  r = seller({ sales: 100000, actual_expenses: 150000 });
  t('ต้นทุนเกินยอดขาย เตือน เงินได้สุทธิ 0', r.warnings.some((w) => w.includes('ขาดทุน')) && r.actual.net_income === 0);
  t('ต้นทุนต่ำ หักเหมาถูกกว่า', seller({ sales: 1200000, actual_expenses: 300000 }).cheaper === 'deemed');
  t('ลดหย่อนน้อยกว่าส่วนตัว เตือน', seller({ sales: 500000, actual_expenses: 0, allowances: 0 }).warnings.length === 1);
  // บุคคลเทียบบริษัท: ตรงกับ thai-business-setup หัวข้อ 2 (กำไร 1,000,000 → 103,000 ต่อ 105,000)
  const company = (i) => compareCompany({ company_yearly_cost: 60000, ...i }, rates, FRESH);
  const c = company({ scenarios: [{ name: 'a', profit: 300000, p: 0.4 }, { name: 'b', profit: 1000000, p: 0.4 }, { name: 'c', profit: 3000000, p: 0.2 }] });
  t('กำไร 1 ล้าน บุคคล 103,000 บริษัท 105,000', c.rows[1].personal === 103000 && c.rows[1].company_tax === 105000);
  t('กำไร 300,000 บุคคล 4,500 บริษัท 0', c.rows[0].personal === 4500 && c.rows[0].company_tax === 0);
  t('กำไร 3 ล้าน บุคคล 647,000 บริษัท 405,000', c.rows[2].personal === 647000 && c.rows[2].company_tax === 405000);
  t('บริษัทเกิน 3 ล้าน ส่วนเกิน 20%', progressiveTax(4000000, rates.sme_company_brackets) === 405000 + 200000);
  t('บุคคลใส่ sales ใช้วิธีที่ 2', company({ scenarios: [{ name: 'x', profit: 100000, p: 1, sales: 4000000 }] }).rows[0].personal === 20000);
  const p = toPayoff(c);
  t('payoff ตรงไฟล์ b3', JSON.stringify(p.table) === JSON.stringify({ 'บุคคลธรรมดา': [4500, 103000, 647000], 'บริษัท SME': [60000, 165000, 465000] }) && p.better === 'low');
  const throwsWith = (fn, word) => { try { fn(); return false; } catch (e) { return e.message.includes(word); } };
  t('ชื่อสถานการณ์ซ้ำ หยุด', throwsWith(() => company({ scenarios: [{ name: 'a', profit: 1, p: 0.5 }, { name: 'a', profit: 2, p: 0.5 }] }), 'ซ้ำ'));
  t('โหมด company เตือนหักเหมา 60%', c.warnings.some((w) => w.includes('เหมา 60%')));
  t('โอกาสรวมไม่เท่า 1', throwsWith(() => company({ scenarios: [{ name: 'a', profit: 1, p: 0.5 }] }), 'รวมกัน'));
  t('ไม่ใส่โอกาส', throwsWith(() => company({ scenarios: [{ name: 'a', profit: 1 }] }), 'p'));
  t('sales ติดลบ', throwsWith(() => seller({ sales: -1, actual_expenses: 0 }), 'sales'));
  t('actual_expenses เป็นข้อความ', throwsWith(() => seller({ sales: 1, actual_expenses: '1' }), 'actual_expenses'));
  t('mode ผิด', throwsWith(() => compare({ mode: 'x' }, rates, FRESH), 'mode'));
  t('rates.json 91 วัน เตือน', compareSeller({ sales: 1, actual_expenses: 0 }, rates, new Date(FRESH.getTime() + 91 * DAY_MS)).warnings.length === 1);
  t('รายงานพิมพ์วันที่ตรวจ', report(seller({ sales: 1200000, actual_expenses: 900000 })).includes(rates.checked));
  // ขั้นบันไดตรงกับ facts.json (มีเฉพาะใน repo)
  const facts = join(dirname(RATES_FILE), '..', '..', '..', '..', '..', 'scripts', 'check', 'facts.json');
  try {
    const f = JSON.parse(readFileSync(facts, 'utf8')).facts;
    t('ขั้นสูงสุดตรง facts.json pit-top-bracket', `${rates.brackets.at(-1).rate_pct}%` === f['pit-top-bracket'].value);
  } catch (err) { if (err.code !== 'ENOENT') throw err; }
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) selfTest();
  else {
    const file = args.find((a) => !a.startsWith('--'));
    if (!file) { console.error('ใช้: node tax-compare.mjs <ไฟล์.json> [--json] [--payoff] | --self-test'); process.exit(2); }
    try {
      const r = compare(JSON.parse(readFileSync(file, 'utf8')));
      if (args.includes('--payoff')) {
        if (r.mode !== 'company') throw new Error('--payoff ใช้กับ "mode": "company" เท่านั้น');
        console.log(JSON.stringify(toPayoff(r), null, 2));
      } else console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(r));
    } catch (e) {
      console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
      process.exit(1);
    }
  }
}
