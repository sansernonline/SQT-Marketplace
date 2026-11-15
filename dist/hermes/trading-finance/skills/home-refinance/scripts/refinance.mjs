#!/usr/bin/env node
// refinance.mjs — ค่างวด ดอกเบี้ยรวม N เดือน และจุดคุ้มทุนของรีไฟแนนซ์/รีเทนชั่น (Node stdlib เท่านั้น)
// ใช้:
//   node refinance.mjs pmt <ยอดกู้> <ดอกเบี้ย%ต่อปี> <จำนวนงวด>
//   node refinance.mjs compare <ไฟล์.json> [--json]
//   node refinance.mjs scenarios <ไฟล์.json>     → JSON ตาราง options × scenarios สำหรับ decide.mjs payoff
//   node refinance.mjs --self-test
// อัตราหลายช่วง: ใส่ "rates": [{ "months": 36, "rate": 3.2 }, { "rate": 5.5, "floating": true }] แทน "rate" · ช่วงสุดท้ายใช้ต่อจนครบ N เดือน
// scenarios: { ..., "scenarios": [{ "name": "MRR ขึ้น 1 จุด", "shift": 1 }] } · shift (จุด %) บวกเข้าเฉพาะช่วงที่ "floating": true
// ไฟล์ compare: { "balance": 2400000, "payment": 18000, "months": 36,
//   "stay": { "rate": 6.5 },
//   "options": [ { "name": "A รีไฟแนนซ์", "rate": 3.2, "cost": 28200 } ] }
// สูตรค่างวด (ลดต้นลดดอก): PMT = P × r ÷ (1 − (1 + r)^−n)  โดย r = ดอกเบี้ยต่อปี ÷ 12 · ถ้า r = 0 → P ÷ n
// จุดคุ้มทุน (เดือน) = (ค่าใช้จ่ายรวมในการย้าย − ค่าใช้จ่ายของทางเดิม) ÷ ดอกเบี้ยที่ประหยัดต่อเดือน (เฉลี่ยตลอด N เดือน)
import { readFileSync } from 'node:fs';

export function pmt(principal, annualRatePct, n) {
  const r = annualRatePct / 100 / 12;
  return r === 0 ? principal / n : (principal * r) / (1 - (1 + r) ** -n);
}

// จ่ายงวดคงที่ N เดือน (หรือจนหมดก่อน) → ดอกเบี้ยรวม และเงินต้นคงเหลือ
export function simulate(balance, annualRatePct, payment, months) {
  let bal = balance;
  let interest = 0;
  for (let m = 0; m < months && bal > 0.005; m++) {
    const i = (bal * annualRatePct) / 100 / 12;
    interest += i;
    bal = Math.max(0, bal + i - payment);
  }
  return { interest, balance: bal };
}

// rates = [{ months, rate }] ตามลำดับ · ช่วงสุดท้ายไม่ต้องมี months (ใช้ต่อจนครบ) · shift บวกเข้าช่วง floating
export function simulateSegments(balance, rates, payment, months, shift = 0) {
  let bal = balance;
  let interest = 0;
  let m = 0;
  rates.forEach((seg, k) => {
    const end = k === rates.length - 1 ? months : Math.min(months, m + seg.months);
    const r = seg.rate + (seg.floating ? shift : 0);
    if (r < 0) throw new Error(`อัตราช่วงที่ ${k + 1} หลังบวก shift ${shift} จุดเหลือ ${r.toFixed(2)}% ต่ำกว่า 0 · ลด shift ให้ติดลบน้อยลง หรือเช็ก rate ของช่วง floating`);
    for (; m < end && bal > 0.005; m++) {
      const i = (bal * r) / 100 / 12;
      interest += i;
      bal = Math.max(0, bal + i - payment);
    }
    m = end;
  });
  return { interest, balance: bal };
}

const segmentsOf = (o) => o.rates ?? [{ rate: o.rate }];
const rateText = (o) => (o.rates ? o.rates.map((s) => `${s.rate}${s.floating ? '*' : ''}${s.months ? ` (${s.months} ด.)` : ''}`).join(' → ') : String(o.rate));

export function breakEvenMonths(extraCost, monthlySaving) {
  if (extraCost <= 0) return 0;
  return monthlySaving > 0 ? extraCost / monthlySaving : null;
}

// Throws a Thai message naming the bad field; returns warnings (list of strings).
export function validate(input) {
  const num = (v, label, min, strict) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || (strict ? v <= min : v < min)) throw new Error(`ช่อง ${label} ต้องเป็นตัวเลข${strict ? 'มากกว่า' : 'ตั้งแต่'} ${min} (ได้ ${JSON.stringify(v)})`);
  };
  if (!input || typeof input !== 'object') throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  num(input.balance, 'balance', 0, true);
  num(input.payment, 'payment', 0, true);
  num(input.months, 'months', 0, true);
  if (!input.stay || typeof input.stay !== 'object') throw new Error('ช่อง stay ต้องมี (เช่น { "rate": 6.5 })');
  const warnings = [];
  const rateWarn = (n, rate) => { if (rate > 0 && rate < 1) warnings.push(`${n}: rate ${rate} น้อยกว่า 1 · rate เป็น % ต่อปี (ใส่ 3.2 ไม่ใช่ 0.032) · ตรวจว่าไม่ได้ใส่เป็นทศนิยม`); };
  // rate (ตัวเดียว) หรือ rates (หลายช่วง) อย่างใดอย่างหนึ่ง
  const rates = (o, label) => {
    if (o.rates === undefined) { num(o.rate, `${label}.rate`, 0, false); rateWarn(label, o.rate); return; }
    if (o.rate !== undefined) throw new Error(`${label} ใส่ได้อย่างใดอย่างหนึ่ง: rate หรือ rates · ลบช่องหนึ่งออก`);
    if (!Array.isArray(o.rates) || o.rates.length === 0) throw new Error(`ช่อง ${label}.rates ต้องเป็นรายการช่วง เช่น [{ "months": 36, "rate": 3.2 }, { "rate": 5.5 }]`);
    o.rates.forEach((seg, k) => {
      num(seg?.rate, `${label}.rates[${k}].rate`, 0, false);
      rateWarn(label, seg.rate);
      if (k < o.rates.length - 1) num(seg.months, `${label}.rates[${k}].months (ทุกช่วงยกเว้นช่วงสุดท้ายต้องบอกจำนวนเดือน)`, 0, true);
    });
  };
  rates(input.stay, 'stay');
  if (input.stay.cost !== undefined) num(input.stay.cost, 'stay.cost', 0, false);
  if (!Array.isArray(input.options) || input.options.length === 0) throw new Error('ช่อง options ต้องเป็นรายการทางเลือกอย่างน้อย 1 ทาง');
  input.options.forEach((o, i) => {
    const n = o?.name ?? `ทางที่ ${i + 1}`;
    if (!o || typeof o !== 'object') throw new Error(`ช่อง options[${i}] ต้องเป็นอ็อบเจกต์ { name, rate หรือ rates, cost }`);
    rates(o, `options[${i}] (${n})`);
    num(o.cost, `options[${i}].cost (${n})`, 0, false);
  });
  if (input.scenarios !== undefined) {
    if (!Array.isArray(input.scenarios) || input.scenarios.length === 0) throw new Error('ช่อง scenarios ต้องเป็นรายการฉาก เช่น [{ "name": "MRR ขึ้น 1 จุด", "shift": 1 }]');
    input.scenarios.forEach((sc, k) => num(sc?.shift, `scenarios[${k}].shift (จุด % ที่บวกเข้าช่วง floating)`, -100, true));
  }
  if (input.baseline !== undefined && input.baseline !== 'อยู่เฉย ๆ' && !input.options.some((o) => o.name === input.baseline)) throw new Error(`ช่อง baseline "${input.baseline}" ไม่ตรงกับชื่อทางเลือกใดเลย`);
  return warnings;
}

// baseline (ไม่บังคับ) = ชื่อทางเลือกที่ใช้เป็นฐานเทียบ ค่าตั้งต้นคืออยู่เฉย ๆ
export function compare(input) {
  const warnings = validate(input);
  const { balance, payment, months } = input;
  const mk = (name, o, cost) => {
    const s = simulateSegments(balance, segmentsOf(o), payment, months);
    return { name, rate: segmentsOf(o)[0].rate, rateText: rateText(o), cost, ...s, total: s.interest + cost };
  };
  const all = [mk('อยู่เฉย ๆ', input.stay, input.stay.cost ?? 0), ...input.options.map((o) => mk(o.name, o, o.cost))];
  const base = all.find((x) => x.name === input.baseline) ?? all[0];
  const rows = all.map((x) => {
    const monthlySaving = (base.interest - x.interest) / months;
    return { ...x, saved: base.total - x.total, monthlySaving, breakEven: x === base ? 0 : breakEvenMonths(x.cost - base.cost, monthlySaving) };
  });
  return { months, payment, baseline: base.name, rows, warnings, warning: payment <= (balance * segmentsOf(input.stay)[0].rate) / 100 / 12 ? 'ค่างวดไม่พอจ่ายดอกเบี้ยเดือนแรกของทางเดิม' : null };
}

// ตาราง ดอกเบี้ยรวม + ค่าใช้จ่าย ต่อฉาก → input ของ decide.mjs payoff (better = low) · ปัดเป็นบาท
export function scenarios(input) {
  validate(input);
  if (!input.scenarios) throw new Error('ไม่มีช่อง scenarios · ใส่เช่น [{ "name": "MRR ลง 1 จุด", "shift": -1 }, { "name": "MRR ทรงตัว", "shift": 0 }] และติด "floating": true ที่ช่วงอัตราลอยตัว');
  const { balance, payment, months } = input;
  const opts = [...input.options.map((o) => ({ name: o.name, o, cost: o.cost })), { name: 'อยู่เฉย ๆ', o: input.stay, cost: input.stay.cost ?? 0 }];
  const cell = (o, cost, shift) => Math.round(simulateSegments(balance, segmentsOf(o), payment, months, shift).interest + cost);
  return {
    _note: `ดอกเบี้ยรวม ${months} เดือน + ค่าใช้จ่ายครั้งเดียว (บาท) จาก refinance.mjs scenarios · shift บวกเฉพาะช่วง floating · อัตราหลังโปรเป็นข้อสมมติจนกว่าธนาคารยืนยัน`,
    better: 'low',
    options: opts.map((x) => x.name),
    scenarios: input.scenarios.map((sc) => ({ name: sc.name ?? `shift ${sc.shift}` })),
    table: Object.fromEntries(opts.map(({ name, o, cost }) => [name, input.scenarios.map((sc) => cell(o, cost, sc.shift))])),
  };
}

const fmt = (n) => Math.round(n).toLocaleString('en-US');

function report(r) {
  const head = `| ทางเลือก | ดอกเบี้ย %/ปี | ดอกเบี้ย ${r.months} เดือน | ค่าใช้จ่ายครั้งเดียว | ดอกเบี้ย + ค่าใช้จ่าย | เงินต้นคงเหลือ | ดีกว่า ${r.baseline} | คุ้มทุนเทียบ ${r.baseline} (เดือน) |`;
  const rows = r.rows.map((x) => `| ${x.name} | ${x.rateText} | ${fmt(x.interest)} | ${fmt(x.cost)} | ${fmt(x.total)} | ${fmt(x.balance)} | ${fmt(x.saved)} | ${x.breakEven === null ? 'ไม่คุ้ม' : x.breakEven === 0 ? '-' : x.breakEven.toFixed(1)} |`);
  const best = [...r.rows].sort((a, b) => b.saved - a.saved)[0];
  return [
    `จ่ายงวดคงที่ ${fmt(r.payment)} บาท/เดือน เท่ากันทุกทาง นาน ${r.months} เดือน`,
    ...(r.warning ? ['คำเตือน: ' + r.warning] : []),
    ...r.warnings.map((w) => 'คำเตือน: ' + w),
    '', head, '|---|---|---|---|---|---|---|---|', ...rows, '',
    `**ผล:** ${best.name} ดอกเบี้ยรวมค่าใช้จ่ายต่ำสุดในช่วง ${r.months} เดือน (ดีกว่า ${r.baseline} ${fmt(best.saved)} บาท) · ยังไม่รวมอัตราหลังโปรและเงื่อนไขล็อกสัญญา · ผู้ใช้ตัดสิน`,
  ].join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, b, e = 0.01) => Math.abs(a - b) < e;
  // ค่างวดมาตรฐาน: 1,000,000 บาท 6% 360 งวด = 5,995.51 (ตารางสินเชื่อทั่วไป)
  t('PMT 1M 6% 30 ปี', near(pmt(1_000_000, 6, 360), 5995.51));
  // ดอก 0%: 120,000 ÷ 12 = 10,000
  t('PMT 0%', near(pmt(120_000, 0, 12), 10_000));
  // คิดมือ: 100,000 ดอก 12%/ปี (1%/เดือน) จ่าย 10,000 → เดือนแรกดอก 1,000 เหลือ 91,000
  const s1 = simulate(100_000, 12, 10_000, 1);
  t('ดอกเดือนแรก', near(s1.interest, 1000) && near(s1.balance, 91_000));
  // ดอก 0% จ่ายเท่าไรหมดกี่เดือน: 12,000 จ่าย 1,000 × 12 เดือน หมดพอดี ดอก 0
  const s2 = simulate(12_000, 0, 1000, 12);
  t('0% หมด 12 เดือน', near(s2.interest, 0) && near(s2.balance, 0));
  // จ่ายตาม PMT ครบงวด เงินต้นต้องเหลือ 0
  const s3 = simulate(1_000_000, 6, pmt(1_000_000, 6, 360), 360);
  t('ครบงวดเหลือ 0', near(s3.balance, 0, 0.5));
  // คุ้มทุน: ค่าใช้จ่าย 3,000 ประหยัดเดือนละ 1,000 = 3 เดือน · ประหยัด 0 = ไม่คุ้ม
  t('คุ้มทุน 3 เดือน', breakEvenMonths(3000, 1000) === 3);
  t('ไม่ประหยัด = null', breakEvenMonths(3000, 0) === null);
  // compare: ดอกเบี้ยเท่ากันแต่มีค่าใช้จ่าย → ไม่คุ้ม
  const c = compare({ balance: 100_000, payment: 5000, months: 12, stay: { rate: 6 }, options: [{ name: 'X', rate: 6, cost: 2000 }] });
  t('compare ไม่คุ้ม', c.rows[1].breakEven === null && c.rows[1].saved < 0);
  // by hand: balance 100,000 · pay 10,000 · 12 months. stay 12%: interest month 1 = 1,000 ... option 6% cost 3,000
  // baseline B (0% cost 1,000) vs X (0% cost 4,000): same interest (0), extra cost 3,000, saving 0 -> null; use rate difference instead:
  // 120,000 · pay 10,000 · 12 months. stay 12% vs option 0% cost 6,000. option interest 0, stay interest > 0 -> saved and breakEven are numbers
  const st = simulate(120_000, 12, 10_000, 12);
  const c2 = compare({ balance: 120_000, payment: 10_000, months: 12, stay: { rate: 12 }, options: [{ name: 'Z', rate: 0, cost: 6000 }] });
  t('baseline ดอกเบี้ยทางเดิม', near(c2.rows[0].interest, st.interest) && st.interest > 6000);
  t('saved = ดอกที่ประหยัด − cost', near(c2.rows[1].saved, st.interest - 6000));
  t('คุ้มทุน = cost ÷ (ประหยัด/เดือน)', near(c2.rows[1].breakEven, 6000 / (st.interest / 12)) && c2.rows[1].breakEven < 12);
  // baseline option with own cost: X cost 10,000 rate 0 vs baseline Y cost 4,000 rate 6 -> extra cost counted is 6,000 not 10,000
  const c3 = compare({ balance: 120_000, payment: 10_000, months: 12, stay: { rate: 12 }, baseline: 'Y', options: [{ name: 'Y', rate: 6, cost: 4000 }, { name: 'X', rate: 0, cost: 10_000 }] });
  const y = c3.rows.find((x) => x.name === 'Y'), x = c3.rows.find((q) => q.name === 'X');
  t('baseline ถูกเลือก', c3.baseline === 'Y' && y.breakEven === 0);
  t('คุ้มทุนหักค่าใช้จ่ายของฐาน', near(x.breakEven, 6000 / ((y.interest - x.interest) / 12)));
  const throwsWith = (inp, word) => { try { compare(inp); return false; } catch (e) { return e.message.includes(word); } };
  const G = { balance: 100_000, payment: 5000, months: 12, stay: { rate: 6 }, options: [{ name: 'X', rate: 4, cost: 1000 }] };
  t('months หาย', throwsWith({ ...G, months: undefined }, 'months'));
  t('months 0', throwsWith({ ...G, months: 0 }, 'months'));
  t('payment NaN', throwsWith({ ...G, payment: NaN }, 'payment'));
  t('ไม่มี cost', throwsWith({ ...G, options: [{ name: 'X', rate: 4 }] }, 'cost'));
  t('ไม่มี stay', throwsWith({ ...G, stay: undefined }, 'stay'));
  t('rate < 1 เตือน', compare({ ...G, options: [{ name: 'X', rate: 0.04, cost: 1000 }] }).warnings.length === 1);
  t('rates ช่วงเดียวเท่า rate', near(simulateSegments(100_000, [{ rate: 12 }], 10_000, 1).interest, 1000));
  t('rate กับ rates พร้อมกัน error', throwsWith({ ...G, options: [{ name: 'X', rate: 4, rates: [{ rate: 4 }], cost: 0 }] }, 'อย่างใดอย่างหนึ่ง'));
  t('rates ช่วงกลางไม่มี months error', throwsWith({ ...G, options: [{ name: 'X', rates: [{ rate: 3 }, { rate: 5 }], cost: 0 }] }, 'months'));
  // 9 ช่องจากรายงานตรวจ 2026-10-28 (คิดแยกด้วยสคริปต์อื่น): 2.4M จ่าย 18,000 · 60 เดือน · MRR ลง/ทรงตัว/ขึ้น 1 จุด
  const S9 = { balance: 2_400_000, payment: 18_000, months: 60,
    stay: { rates: [{ rate: 6.5, floating: true }] },
    options: [{ name: 'refi', cost: 28_200, rates: [{ months: 36, rate: 3.2 }, { rate: 5.5, floating: true }] },
      { name: 'ret', cost: 24_000, rates: [{ months: 36, rate: 4.0 }, { rate: 5.5, floating: true }] }],
    scenarios: [{ name: 'ลง', shift: -1 }, { name: 'ทรงตัว', shift: 0 }, { name: 'ขึ้น', shift: 1 }] };
  const tb = scenarios(S9).table;
  t('ฉาก refi 3 ช่อง', JSON.stringify(tb.refi) === JSON.stringify([403795, 442579, 482140]));
  t('ฉาก ret 3 ช่อง', JSON.stringify(tb.ret) === JSON.stringify([460721, 500735, 541549]));
  t('ฉาก อยู่เฉย ๆ 3 ช่อง', JSON.stringify(tb['อยู่เฉย ๆ']) === JSON.stringify([597834, 726630, 862419]));
  t('scenarios ไม่มีช่อง error', (() => { try { scenarios(G); return false; } catch (e) { return e.message.includes('scenarios'); } })());
  t('compare --json rate เป็นตัวเลข', c.rows[1].rate === 6 && typeof c.rows[0].rate === 'number' && compare(S9).rows[1].rate === 3.2 && compare(S9).rows[1].rateText === '3.2 (36 ด.) → 5.5*');
  t('shift ทำให้อัตราต่ำกว่า 0 หยุด', (() => { try { scenarios({ ...S9, scenarios: [{ name: 'x', shift: -7 }] }); return false; } catch (e) { return e.message.includes('ต่ำกว่า 0'); } })());
  console.log(`self-test: ${ok} ผ่าน ${bad} ล้ม`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else if (args[0] === 'pmt' && args.length === 4) {
  const [p, r, n] = args.slice(1).map(Number);
  const bad = [[p > 0, 'ยอดกู้ต้องมากกว่า 0'], [r >= 0, 'ดอกเบี้ยต้องไม่ติดลบ'], [n > 0 && Number.isInteger(n), 'จำนวนงวดต้องเป็นจำนวนเต็มมากกว่า 0']].find(([ok]) => !ok);
  if (bad) { console.error(bad[1]); process.exitCode = 1; }
  else console.log(`ค่างวด ${pmt(p, r, n).toFixed(2)} บาท/เดือน (ยอด ${p} · ${r}%/ปี · ${n} งวด)`);
} else if ((args[0] === 'compare' || args[0] === 'scenarios') && args[1]) {
  try {
    const input = JSON.parse(readFileSync(args[1], 'utf8'));
    if (args[0] === 'scenarios') console.log(JSON.stringify(scenarios(input), null, 2));
    else { const r = compare(input); console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(r)); }
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${args[1]} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${args[1]}` : e.message}`);
    process.exit(1);
  }
} else {
  console.error('ใช้: node refinance.mjs pmt <ยอด> <ดอก%> <งวด> | compare <ไฟล์.json> [--json] | scenarios <ไฟล์.json> | --self-test');
  process.exit(2);
}
