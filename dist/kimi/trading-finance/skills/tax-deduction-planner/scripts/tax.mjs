#!/usr/bin/env node
// tax.mjs - Thai personal income tax before / after a deduction plan (Node stdlib only)
// Usage: node tax.mjs <file.json> [--json]   |   node tax.mjs --self-test
// File: { "salary": 720000, "deductions": { "socialSecurity": 10500, "pvd": 36000 }, "buy": { "rmf": 50000, "thaiesg": 50000 },
//         "dividends": { "amount": 40000 } }   (optional: otherIncome, otherExpense, blockSize)
// Every rate and cap comes from rates-2569.json (field checked = date the reference was last checked).
import { readFileSync } from 'node:fs';

const RATES = JSON.parse(readFileSync(new URL('./rates-2569.json', import.meta.url), 'utf8'));
const GROUP = new Set(RATES.retirement_group.keys);
// Keys the script knows. Others (spouse, child, parents, disabled, pregnancy, gpf) are taken as entered, without a cap check.
const KNOWN = new Set([...Object.keys(RATES.caps), ...GROUP, 'donation', 'donationDouble']);

const num = (v, label, { min = 0, strict = false, max } = {}) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || (strict ? v <= min : v < min) || (max !== undefined && v >= max))
    throw new Error(`ช่อง ${label} ต้องเป็นตัวเลข${strict ? 'มากกว่า' : 'ตั้งแต่'} ${min}${max !== undefined ? ` และน้อยกว่า ${max}` : ''} (ได้ ${JSON.stringify(v)})`);
};

// Throws a Thai message naming the bad field; returns the input with defaults filled.
export function validate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  num(input.salary, 'salary (เงินได้ 40(1)+40(2) ทั้งปี)');
  const x = { otherIncome: 0, otherExpense: 0, deductions: {}, buy: {}, blockSize: RATES.block_size, ...input };
  num(x.otherIncome, 'otherIncome');
  num(x.otherExpense, 'otherExpense');
  if (x.otherExpense > x.otherIncome) throw new Error(`ช่อง otherExpense (${x.otherExpense}) มากกว่า otherIncome (${x.otherIncome}) · ค่าใช้จ่ายหักได้ไม่เกินเงินได้`);
  num(x.blockSize, 'blockSize', { strict: true });
  for (const part of ['deductions', 'buy']) {
    if (!x[part] || typeof x[part] !== 'object' || Array.isArray(x[part])) throw new Error(`ช่อง ${part} ต้องเป็นอ็อบเจกต์ {"ชื่อ": จำนวนบาท}`);
    for (const [k, v] of Object.entries(x[part])) {
      if (k === 'personal') throw new Error(`ช่อง ${part}.personal ไม่ต้องใส่ · สคริปต์หักส่วนตัว ${RATES.personal.amount} ให้เอง · ลบช่องนี้ออก`);
      num(v, `${part}.${k}`);
    }
  }
  if (x.dividends !== undefined) {
    num(x.dividends?.amount, 'dividends.amount (ปันผลหุ้นไทยทั้งปี ก่อนหักภาษี)');
    x.dividends = { corporateRatePct: RATES.dividend.default_corporate_rate_pct, ...x.dividends };
    num(x.dividends.corporateRatePct, 'dividends.corporateRatePct', { max: 100 });
  }
  return x;
}

export function taxOf(net) {
  let tax = 0, low = 0;
  for (const b of RATES.brackets) {
    const top = b.up_to ?? Infinity;
    if (net > low) tax += ((Math.min(net, top) - low) * b.rate_pct) / 100;
    low = top;
  }
  return tax;
}

export function marginalRate(net) {
  if (net <= 0) return 0;
  return RATES.brackets.find((b) => b.up_to === null || net <= b.up_to).rate_pct;
}

// Applies every cap from rates-2569.json; returns { total, warnings }.
function allowances(x, items, base) {
  const warnings = [];
  const amt = { ...items };
  const clip = (k, cap, why) => {
    if ((amt[k] ?? 0) > cap) { warnings.push(`${k} ${fmt(amt[k])} เกินเพดาน ${fmt(cap)} (${why}) · นับแค่ ${fmt(cap)}`); amt[k] = cap; }
  };
  for (const [k, c] of Object.entries(RATES.caps)) {
    const cap = c.pct_of_income === undefined ? c.max : Math.min(c.max, (base * c.pct_of_income) / 100);
    clip(k, cap, c.source);
  }
  const lh = (amt.lifeInsurance ?? 0) + (amt.ownHealth ?? 0);
  if (lh > RATES.life_plus_health_max) {
    warnings.push(`ประกันชีวิต + สุขภาพตนเอง ${fmt(lh)} เกิน ${fmt(RATES.life_plus_health_max)} รวมกัน · นับแค่ ${fmt(RATES.life_plus_health_max)}`);
    amt.ownHealth = RATES.life_plus_health_max - Math.min(amt.lifeInsurance ?? 0, RATES.life_plus_health_max);
    amt.lifeInsurance = RATES.life_plus_health_max - amt.ownHealth;
  }
  if ((amt.pvd ?? 0) > (x.salary * RATES.pvd_pct_of_wage) / 100)
    warnings.push(`pvd ${fmt(amt.pvd)} เกิน ${RATES.pvd_pct_of_wage}% ของ salary · เพดานคิดจากค่าจ้าง ตรวจกับ 50 ทวิ`);
  const groupSum = [...GROUP].reduce((s, k) => s + (amt[k] ?? 0), 0);
  let total = 0;
  for (const [k, v] of Object.entries(amt)) if (!GROUP.has(k) && k !== 'donation' && k !== 'donationDouble') total += v;
  const groupUsed = Math.min(groupSum, RATES.retirement_group.max);
  if (groupSum > groupUsed) warnings.push(`${[...GROUP].join(' + ')} รวม ${fmt(groupSum)} เกินวงเงินรวม ${fmt(RATES.retirement_group.max)} · นับแค่ ${fmt(groupUsed)}`);
  total += groupUsed;
  return { total, groupSum, amt, warnings };
}

function scenario(x, items, extraIncome = 0) {
  const base = x.salary + x.otherIncome; // 30% caps use income before dividends (conservative; see SKILL.md "Tax script")
  const expense = Math.min((x.salary * RATES.expense.rate_pct) / 100, RATES.expense.max) + x.otherExpense;
  const a = allowances(x, items, base);
  let net = base + extraIncome - expense - RATES.personal.amount - a.total;
  const don = (items.donation ?? 0) + RATES.donation.double_multiplier * (items.donationDouble ?? 0);
  const donCap = Math.max(0, (net * RATES.donation.max_pct_of_net) / 100);
  if (don > donCap) a.warnings.push(`เงินบริจาคหลังคูณ ${fmt(don)} เกิน ${RATES.donation.max_pct_of_net}% ของเงินได้หลังหักค่าลดหย่อนอื่น (${fmt(donCap)}) · นับแค่ ${fmt(donCap)}`);
  net = Math.max(0, net - Math.min(don, donCap));
  return { base, expense, allowances: a.total, groupSum: a.groupSum, amt: a.amt, net, tax: taxOf(net), rate: marginalRate(net), warnings: a.warnings };
}

const sumItems = (a, b) => {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = (out[k] ?? 0) + v;
  return out;
};

export function plan(input) {
  const x = validate(input);
  const before = scenario(x, x.deductions);
  const all = sumItems(x.deductions, x.buy);
  const after = scenario(x, all);
  const unknown = Object.keys(all).filter((k) => !KNOWN.has(k));
  const warnings = [...new Set([...after.warnings, ...before.warnings])];
  if (unknown.length) warnings.push(`ไม่ได้ตรวจเพดาน: ${unknown.join(', ')} · ตรวจเองกับ references/deductions-2569.md`);
  // Room left after the plan (each cap from rates-2569.json)
  const cap = (k) => Math.min(RATES.caps[k].max, (after.base * RATES.caps[k].pct_of_income) / 100);
  const groupRoom = Math.max(0, RATES.retirement_group.max - after.groupSum);
  const room = {
    rmf: Math.max(0, Math.min(cap('rmf') - (all.rmf ?? 0), groupRoom)),
    thaiesg: Math.max(0, cap('thaiesg') - (all.thaiesg ?? 0)),
    pensionInsurance: Math.max(0, Math.min(cap('pensionInsurance') - (all.pensionInsurance ?? 0), groupRoom)),
    retirementGroup: groupRoom,
  };
  // knapsack value per block: tax saved by the k-th block cut from net income before the plan
  const blocks = [];
  for (let k = 0; k < 10 && before.net - k * x.blockSize > 0; k++) {
    const hi = before.net - k * x.blockSize;
    const lo = Math.max(0, hi - x.blockSize);
    const v = taxOf(hi) - taxOf(lo);
    if (v <= 0) break;
    blocks.push(Math.round(v));
  }
  let dividends = null;
  if (x.dividends) {
    const d = x.dividends.amount, t = x.dividends.corporateRatePct;
    const credit = (d * t) / (100 - t);
    const withheld = (d * RATES.dividend.withholding_pct) / 100;
    const inc = scenario(x, all, d + credit);
    // Total tax cost on everything: final = tax without dividends + 10% withheld; include = tax with grossed-up dividends - credit
    const finalCost = after.tax + withheld;
    const includeCost = inc.tax - credit;
    dividends = { amount: d, credit, withheld, finalCost, includeCost, better: includeCost < finalCost ? 'include' : 'final', gap: Math.abs(finalCost - includeCost), netIfIncluded: inc.net, rateIfIncluded: inc.rate };
  }
  return { before, after, saved: before.tax - after.tax, room, blocks, blockSize: x.blockSize, dividends, warnings };
}

const fmt = (n) => Math.round(n).toLocaleString('en-US');

export function report(r) {
  const { before: b, after: a, room } = r;
  const out = [
    `ปีภาษี ${RATES.tax_year} · อัตราและเพดานจาก rates-2569.json (ตรวจ ${RATES.checked})`,
    ...r.warnings.map((w) => `คำเตือน: ${w}`),
    '',
    '| รายการ | ก่อนแผน | หลังแผน |',
    '|---|---|---|',
    `| เงินได้ | ${fmt(b.base)} | ${fmt(a.base)} |`,
    `| หักค่าใช้จ่าย | −${fmt(b.expense)} | −${fmt(a.expense)} |`,
    `| ค่าลดหย่อน (รวมส่วนตัว ${fmt(RATES.personal.amount)}) | −${fmt(b.allowances + RATES.personal.amount)} | −${fmt(a.allowances + RATES.personal.amount)} |`,
    `| **เงินได้สุทธิ** | **${fmt(b.net)}** | **${fmt(a.net)}** |`,
    `| ภาษี | ${fmt(b.tax)} | ${fmt(a.tax)} |`,
    `| อัตราส่วนเพิ่ม (ขั้นสุดท้าย) | ${b.rate}% | ${a.rate}% |`,
    '',
    `**ประหยัด ${fmt(r.saved)} บาท**${a.rate < b.rate ? ' · เงินได้สุทธิลงขั้นต่ำกว่าเดิม ก้อนที่ซื้อเกินขอบขั้นประหยัดแค่อัตราขั้นล่าง' : ''}${b.rate === 0 ? ' · เงินได้สุทธิอยู่ขั้นยกเว้นอยู่แล้ว ลดหย่อนเพิ่มไม่ประหยัด' : ''}`,
    '',
    `ห้องเหลือหลังแผน: RMF ${fmt(room.rmf)} · ThaiESG ${fmt(room.thaiesg)} · ประกันบำนาญ ${fmt(room.pensionInsurance)} · วงเงินรวม ${fmt(RATES.retirement_group.max)} เหลือ ${fmt(room.retirementGroup)}`,
    `ภาษีที่ประหยัดต่อก้อน ${fmt(r.blockSize)} (ใช้เป็น value ของ knapsack ก้อนที่ 1, 2, ...): ${r.blocks.length ? r.blocks.map(fmt).join(' · ') : 'ไม่มี (เงินได้สุทธิอยู่ขั้นยกเว้น)'}`,
  ];
  const d = r.dividends;
  if (d) out.push(
    '',
    `ปันผล ${fmt(d.amount)} (เครดิต ${fmt(d.credit)}, หัก ณ ที่จ่าย ${fmt(d.withheld)}):`,
    `- ไม่รวมคำนวณ (ภาษี 10% เป็นที่สุด): ภาระภาษีทั้งหมด ${fmt(d.finalCost)}`,
    `- รวมคำนวณและขอเครดิต: ภาระภาษีทั้งหมด ${fmt(d.includeCost)} · เงินได้สุทธิกลายเป็น ${fmt(d.netIfIncluded)} (ขั้น ${d.rateIfIncluded}%)`,
    `- ${d.better === 'include' ? 'รวมคำนวณ' : 'ไม่รวมคำนวณ'} ถูกกว่า ${fmt(d.gap)} บาท · รวมคำนวณต้องรวมปันผลทุกก้อนในปีนั้น`,
  );
  out.push('', 'ผลนี้เป็นข้อมูล ไม่ใช่คำแนะนำภาษี · ผู้ใช้ตัดสิน');
  return out.join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, b, tol = 0.5) => Math.abs(a - b) < tol;
  // rate table edges, by hand from deductions-2569.md lines 14-23
  t('ภาษี 0', taxOf(0) === 0 && marginalRate(0) === 0);
  t('ภาษี 150,000 = 0', taxOf(150000) === 0);
  t('ขอบ 300,000 = 7,500 ขั้น 5%', taxOf(300000) === 7500 && marginalRate(300000) === 5);
  t('300,001 ขึ้นขั้น 10%', near(taxOf(300001), 7500.1, 0.01) && marginalRate(300001) === 10);
  t('ขอบ 5,000,000 = 1,265,000', taxOf(5000000) === 1265000 && marginalRate(5000000) === 30);
  t('6,000,000 = 1,615,000 ขั้น 35%', taxOf(6000000) === 1615000 && marginalRate(6000000) === 35);
  // SKILL.md worked example: 478,500 -> 25,350; 378,500 -> 15,350; saved 10,000
  const ex = { salary: 720000, deductions: { socialSecurity: 10500, pvd: 36000, lifeInsurance: 20000, ownHealth: 15000 }, buy: { rmf: 50000, thaiesg: 50000 } };
  let r = plan(ex);
  t('ตัวอย่าง SKILL ก่อน 478,500 / 25,350', r.before.net === 478500 && near(r.before.tax, 25350));
  t('ตัวอย่าง SKILL หลัง 378,500 / 15,350', r.after.net === 378500 && near(r.after.tax, 15350));
  t('ตัวอย่าง SKILL ประหยัด 10,000 อัตรา 10%', near(r.saved, 10000) && r.before.rate === 10);
  // room: RMF 30% x 720,000 = 216,000 - 50,000 = 166,000 (group left 500,000 - 86,000 = 414,000); ThaiESG 216,000 - 50,000
  t('ห้อง RMF 166,000 ThaiESG 166,000 วงเงินรวม 414,000', r.room.rmf === 166000 && r.room.thaiesg === 166000 && r.room.retirementGroup === 414000);
  // knapsack example in SKILL.md: net 800,000 -> blocks 10,000 then 7,500
  r = plan({ salary: 960000, deductions: {} });
  t('net 800,000', r.before.net === 800000);
  t('ก้อน knapsack 10,000 · 7,500 · 7,500', r.blocks[0] === 10000 && r.blocks[1] === 7500 && r.blocks[2] === 7500);
  // income 0
  r = plan({ salary: 0 });
  t('รายได้ 0 ภาษี 0 ไม่มีก้อน', r.before.net === 0 && r.before.tax === 0 && r.blocks.length === 0 && r.saved === 0);
  // caps: ThaiESG 30% of 400,000 = 120,000; 500,000 combined cap
  r = plan({ salary: 400000, buy: { thaiesg: 200000 } });
  t('ThaiESG ตัดที่ 30%', r.after.amt.thaiesg === 120000 && r.warnings.some((w) => w.includes('thaiesg')));
  r = plan({ salary: 5000000, deductions: { pvd: 300000, pensionInsurance: 200000 }, buy: { rmf: 100000 } });
  t('วงเงินรวม 500,000', r.after.groupSum === 600000 && r.room.retirementGroup === 0 && r.room.rmf === 0 && near(r.saved, 0));
  // tax-basics-th worked example: net 350,000, dividends 40,000 -> include better by 9,000
  r = plan({ salary: 510000, dividends: { amount: 40000 } });
  t('ปันผล ตัวอย่าง tax-basics-th', r.after.net === 350000 && near(r.dividends.credit, 10000) && r.dividends.better === 'include' && near(r.dividends.gap, 9000));
  // at a 35% band keep dividends final
  r = plan({ salary: 8000000, dividends: { amount: 100000 } });
  t('ขั้น 35% ไม่รวมดีกว่า', r.dividends.better === 'final');
  // bad input names the field
  const throwsWith = (inp, word) => { try { plan(inp); return false; } catch (e) { return e.message.includes(word); } };
  t('ไม่มี salary', throwsWith({}, 'salary'));
  t('salary ติดลบ', throwsWith({ salary: -1 }, 'salary'));
  t('salary ข้อความ', throwsWith({ salary: '720000' }, 'salary'));
  t('buy ค่าผิด', throwsWith({ salary: 1, buy: { rmf: 'x' } }, 'buy.rmf'));
  t('ใส่ personal ซ้ำ', throwsWith({ salary: 1, deductions: { personal: 60000 } }, 'personal'));
  t('corporateRatePct 100', throwsWith({ salary: 1, dividends: { amount: 1, corporateRatePct: 100 } }, 'corporateRatePct'));
  t('otherExpense เกิน', throwsWith({ salary: 1, otherIncome: 10, otherExpense: 20 }, 'otherExpense'));
  console.log(`self-test: ${ok} ผ่าน ${bad} ล้ม`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('ใช้: node tax.mjs <ไฟล์.json> [--json] | --self-test'); process.exit(2); }
  try {
    const r = plan(JSON.parse(readFileSync(file, 'utf8')));
    console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(r));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
