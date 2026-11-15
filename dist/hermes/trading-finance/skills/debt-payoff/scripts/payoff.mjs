#!/usr/bin/env node
// payoff.mjs - monthly debt payoff simulation, avalanche vs snowball (Node stdlib only)
// Usage: node payoff.mjs <file.json> [--json]   |   node payoff.mjs --self-test
// File: { "budget": 8000, "debts": [ { "name": "card", "balance": 15000, "rate": 16, "min": 1000 } ] }
// Card minimum as % of balance: use "minPct": 8 (+ optional "minFloor": 500) instead of "min"; the minimum then falls as the balance falls.
// rate = yearly interest in percent. Each month: add interest (balance x rate / 12), pay every minimum, put the rest of the budget on the target debt.
import { readFileSync } from 'node:fs';

// 100 years: past this a plan is not a plan, so stop and report 'not cleared' (also guards the loop when interest > payment)
const MAX_MONTHS = 1200;

// Throws a Thai message naming the bad field; returns warnings (list of strings).
export function validate(input) {
  const num = (v, label, min, strict) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || (strict ? v <= min : v < min)) throw new Error(`ช่อง ${label} ต้องเป็นตัวเลข${strict ? 'มากกว่า' : 'ตั้งแต่'} ${min} (ได้ ${JSON.stringify(v)})`);
  };
  if (!input || typeof input !== 'object') throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  num(input.budget, 'budget', 0, true);
  if (!Array.isArray(input.debts) || input.debts.length === 0) throw new Error('ช่อง debts ต้องเป็นรายการหนี้อย่างน้อย 1 ก้อน');
  const warnings = [];
  input.debts.forEach((d, i) => {
    const n = d?.name ?? `ก้อนที่ ${i + 1}`;
    num(d?.balance, `debts[${i}].balance (${n})`, 0, true);
    num(d?.rate, `debts[${i}].rate (${n})`, 0, false);
    if (d?.minPct !== undefined) {
      num(d.minPct, `debts[${i}].minPct (${n})`, 0, true);
      if (d.minPct > 100) throw new Error(`ช่อง debts[${i}].minPct (${n}) เป็น % ของยอด ต้องไม่เกิน 100 (ได้ ${d.minPct})`);
      if (d.minFloor !== undefined) num(d.minFloor, `debts[${i}].minFloor (${n})`, 0, false);
      if (d.min !== undefined) throw new Error(`debts[${i}] (${n}) ใส่ได้อย่างใดอย่างหนึ่ง: min (บาทคงที่) หรือ minPct (% ของยอด) · ลบช่องหนึ่งออก`);
    } else num(d?.min, `debts[${i}].min (${n}) หรือ minPct`, 0, false);
    if (d.rate > 0 && d.rate < 1) warnings.push(`${n}: rate ${d.rate} น้อยกว่า 1 · rate เป็น % ต่อปี (ใส่ 24 ไม่ใช่ 0.24) · ตรวจว่าไม่ได้ใส่เป็นทศนิยม`);
  });
  const seen = new Set();
  input.debts.forEach((d, i) => {
    const n = d.name ?? `ก้อนที่ ${i + 1}`;
    if (seen.has(n)) throw new Error(`ชื่อหนี้ "${n}" ซ้ำ · ตารางจะทับกันจนหายไป 1 ก้อน · ตั้งชื่อให้ต่างกัน เช่น "${n} (2)"`);
    seen.add(n);
  });
  return warnings;
}

// Minimum due this month: fixed baht, or % of current balance with an optional floor; never more than the balance.
const minDue = (d) => Math.min(d.bal, d.minPct === undefined ? d.min : Math.max(d.minFloor ?? 0, (d.bal * d.minPct) / 100));

function simulate(input, order) {
  const debts = input.debts.map((d, i) => ({ ...d, name: d.name ?? `ก้อนที่ ${i + 1}`, bal: d.balance, paidMonth: null }));
  const minTotal = debts.reduce((s, d) => s + minDue(d), 0);
  if (input.budget < minTotal) throw new Error(`งบ ${input.budget} น้อยกว่าผลรวมขั้นต่ำ ${minTotal}`);
  let interest = 0;
  let month = 0;
  while (debts.some((d) => d.bal > 0.005) && month < MAX_MONTHS) {
    month++;
    for (const d of debts) {
      if (d.bal <= 0) continue;
      const i = (d.bal * d.rate) / 100 / 12;
      d.bal += i;
      interest += i;
    }
    let pool = input.budget;
    for (const d of debts) {
      if (d.bal <= 0) continue;
      const p = minDue(d);
      d.bal -= p;
      pool -= p;
    }
    // minPct minimums are charged after interest, so they can exceed the budget even when the opening check passed
    if (pool < -0.005) throw new Error(`งบ ${input.budget} ไม่พอจ่ายขั้นต่ำเดือนที่ ${month} (${Math.round(input.budget - pool)} รวมดอกเบี้ยเดือนนั้น) · เพิ่มงบ`);
    const live = debts.filter((d) => d.bal > 0.005).sort(order);
    for (const d of live) {
      const p = Math.min(pool, d.bal);
      d.bal -= p;
      pool -= p;
      if (pool <= 0) break;
    }
    for (const d of debts) if (d.paidMonth === null && d.bal <= 0.005) d.paidMonth = month;
  }
  const done = debts.every((d) => d.paidMonth !== null);
  return {
    months: done ? month : null,
    interest,
    paid: Object.fromEntries(debts.map((d) => [d.name, d.paidMonth])),
  };
}

const avalancheOrder = (a, b) => b.rate - a.rate || a.bal - b.bal;
const snowballOrder = (a, b) => a.bal - b.bal || b.rate - a.rate;

export function compare(input) {
  const warnings = validate(input);
  const avalanche = simulate(input, avalancheOrder);
  const snowball = simulate(input, snowballOrder);
  return { avalanche, snowball, interestGap: snowball.interest - avalanche.interest, warnings };
}

const fmt = (n) => Math.round(n).toLocaleString('en-US');

export function report(input, r) {
  const rows = ['avalanche', 'snowball'].map((k) => {
    const x = r[k];
    const per = Object.entries(x.paid).map(([n, m]) => `${n} ${m ?? 'ไม่หมด'}`).join(', ');
    return `| ${k} | ${per} | ${x.months ?? `เกิน ${MAX_MONTHS}`} | ${x.months === null ? '-' : fmt(x.interest)} |`;
  });
  const { avalanche: a, snowball: sb, interestGap: gap } = r;
  let verdict;
  if (a.months === null || sb.months === null) {
    const who = [a.months === null && 'avalanche', sb.months === null && 'snowball'].filter(Boolean).join(' และ ');
    verdict = `**ผล:** งบนี้ปลดไม่หมด (${who}) ดอกเบี้ยต่อเดือนเกินที่จ่าย หรือใช้เวลาเกิน ${MAX_MONTHS} เดือน · ไม่สรุปส่วนต่าง · เพิ่มงบหรือปรับหนี้ก่อน (ดูช่องทางปรับโครงสร้างหนี้) · ผู้ใช้ตัดสิน`;
  } else {
    const monthGap = sb.months - a.months;
    const money = gap > 0 ? `avalanche ประหยัดกว่า snowball ${fmt(gap)} บาท` : gap < 0 ? `avalanche จ่ายดอกเบี้ยมากกว่า snowball ${fmt(-gap)} บาท` : 'ดอกเบี้ยรวมเท่ากัน';
    const time = monthGap > 0 ? `และเร็วกว่า ${monthGap} เดือน` : monthGap < 0 ? `แต่ช้ากว่า snowball ${-monthGap} เดือน` : 'และหมดพร้อมกันในเดือนเดียวกัน';
    verdict = `**ผล:** ${money} ${time}${gap > 0 ? ` · ถ้าเลือก snowball คือจ่ายเพิ่ม ${fmt(gap)} บาทเพื่อให้ปิดก้อนแรกเร็วขึ้น` : ''} · ผู้ใช้ตัดสิน`;
  }
  return [
    `งบต่อเดือน ${fmt(input.budget)} บาท`,
    ...(r.warnings ?? []).map((w) => `คำเตือน: ${w}`),
    '',
    '| วิธี | เดือนที่แต่ละก้อนหมด | หมดทั้งหมด (เดือน) | ดอกเบี้ยรวม (บาท) |',
    '|---|---|---|---|',
    ...rows,
    '',
    verdict,
  ].join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, b) => Math.abs(a - b) < 0.01;
  // 1 ก้อน ดอก 0% 12,000 จ่ายเดือนละ 1,000 = 12 เดือน ดอกเบี้ย 0
  let r = compare({ budget: 1000, debts: [{ name: 'A', balance: 12000, rate: 0, min: 500 }] });
  t('0% 12 เดือน', r.avalanche.months === 12 && r.snowball.months === 12);
  t('0% ไม่มีดอก', near(r.avalanche.interest, 0));
  // 1 ก้อน 1,000 ดอก 12%/ปี = 10 บาท/เดือน จ่าย 1,010 ปิดเดือนแรก ดอกรวม 10
  r = compare({ budget: 1010, debts: [{ name: 'A', balance: 1000, rate: 12, min: 100 }] });
  t('12% ปิดเดือน 1', r.avalanche.months === 1);
  t('12% ดอก 10', near(r.avalanche.interest, 10));
  // 2 ก้อน ดอก 0% รวม 3,000 งบ 1,000 = 3 เดือน ทั้งสองวิธี ส่วนต่าง 0
  r = compare({ budget: 1000, debts: [{ name: 'A', balance: 1000, rate: 0, min: 100 }, { name: 'B', balance: 2000, rate: 0, min: 100 }] });
  t('2 ก้อน 0%', r.avalanche.months === 3 && r.snowball.months === 3 && near(r.interestGap, 0));
  // ก้อนเล็กดอกต่ำ + ก้อนใหญ่ดอกสูง: avalanche ต้องดอกน้อยกว่า snowball และ snowball ปิดก้อนเล็กก่อน
  r = compare({ budget: 1500, debts: [{ name: 'เล็ก', balance: 1000, rate: 5, min: 50 }, { name: 'ใหญ่', balance: 20000, rate: 24, min: 400 }] });
  t('avalanche ดอกน้อยกว่า', r.interestGap > 0);
  t('snowball ปิดก้อนเล็กก่อน', r.snowball.paid['เล็ก'] < r.avalanche.paid['เล็ก']);
  // งบต่ำกว่าขั้นต่ำต้อง error
  let threw = false;
  try { compare({ budget: 100, debts: [{ name: 'A', balance: 1000, rate: 0, min: 500 }] }); } catch { threw = true; }
  t('งบต่ำกว่าขั้นต่ำ error', threw);
  // minimums decide the closing order: A 600 min 300, B 1,400 min 200, budget 700, 0% -> A clears month 2, all clear month 3
  r = compare({ budget: 700, debts: [{ name: 'A', balance: 600, rate: 0, min: 300 }, { name: 'B', balance: 1400, rate: 0, min: 200 }] });
  t('ขั้นต่ำมีผลต่อลำดับ', r.avalanche.paid.A === 2 && r.avalanche.months === 3 && r.snowball.paid.A === 2);
  // by hand: budget 1,100 · A 1,000 at 12% min 100 · B 1,000 at 0% min 100 -> interest avalanche 10.10 / snowball 19.10, gap 9.00, 2 months each
  r = compare({ budget: 1100, debts: [{ name: 'A', balance: 1000, rate: 12, min: 100 }, { name: 'B', balance: 1000, rate: 0, min: 100 }] });
  t('คิดมือ 2 ก้อน', near(r.avalanche.interest, 10.1) && near(r.snowball.interest, 19.1) && near(r.interestGap, 9) && r.avalanche.months === 2 && r.snowball.months === 2);
  // never clears: interest 2,000 a month > budget 1,000
  const stuck = { budget: 1000, debts: [{ name: 'A', balance: 100000, rate: 24, min: 500 }] };
  r = compare(stuck);
  const txt = report(stuck, r);
  t('ไม่หมด months null', r.avalanche.months === null && r.snowball.months === null);
  t('ไม่หมด ข้อความ', txt.includes('ปลดไม่หมด') && !txt.includes('หมดพร้อมกัน') && !txt.includes('ประหยัดกว่า'));
  // snowball finishes sooner than avalanche -> say "ช้ากว่า", never "หมดพร้อมกัน"
  const fake = { avalanche: { months: 10, interest: 100, paid: { A: 10 } }, snowball: { months: 8, interest: 90, paid: { A: 8 } }, interestGap: -10, warnings: [] };
  const t2 = report({ budget: 1 }, fake);
  t('ติดลบเขียนตามจริง', t2.includes('ช้ากว่า snowball 2 เดือน') && t2.includes('จ่ายดอกเบี้ยมากกว่า snowball 10') && !t2.includes('หมดพร้อมกัน'));
  // input checks name the field
  const throwsWith = (inp, word) => { try { compare(inp); return false; } catch (e) { return e.message.includes(word); } };
  const D = { name: 'A', balance: 1000, rate: 10, min: 50 };
  t('budget NaN', throwsWith({ budget: NaN, debts: [D] }, 'budget'));
  t('budget ติดลบ/0', throwsWith({ budget: 0, debts: [D] }, 'budget'));
  t('ไม่มี min', throwsWith({ budget: 500, debts: [{ name: 'A', balance: 1000, rate: 10 }] }, 'min'));
  t('balance เป็นข้อความ', throwsWith({ budget: 500, debts: [{ ...D, balance: '1000' }] }, 'balance'));
  t('ไม่มี debts', throwsWith({ budget: 500, debts: [] }, 'debts'));
  t('ชื่อซ้ำ error', throwsWith({ budget: 5000, debts: [D, { ...D }] }, 'ซ้ำ'));
  // minPct by hand: 10,000 at 12%/yr, 8% min, budget 800 -> month 1 interest 100, min 808 > budget 800 -> error
  t('minPct งบไม่พอขั้นต่ำ error', throwsWith({ budget: 800, debts: [{ name: 'บัตร', balance: 10000, rate: 12, minPct: 8 }] }, 'ขั้นต่ำ'));
  // 2 debts at 0%: A 1,000 min 10% floor 0, B 1,000 fixed 100, budget 300 -> snowball/avalanche tie-break by balance; minimum of A falls with balance
  r = compare({ budget: 300, debts: [{ name: 'A', balance: 1000, rate: 0, minPct: 10 }, { name: 'B', balance: 1000, rate: 0, min: 100 }] });
  t('minPct 0% รวม 2,000 งบ 300 = 7 เดือน', r.avalanche.months === 7 && near(r.avalanche.interest, 0));
  // floor: 1,000 at 0%, 5% min floor 300, budget 300 -> pays 300 a month -> 4 months (300,300,300,100)
  r = compare({ budget: 300, debts: [{ name: 'A', balance: 1000, rate: 0, minPct: 5, minFloor: 300 }] });
  t('minFloor', r.avalanche.months === 4);
  t('min กับ minPct พร้อมกัน error', throwsWith({ budget: 500, debts: [{ ...D, minPct: 8 }] }, 'อย่างใดอย่างหนึ่ง'));
  t('rate < 1 เตือน', compare({ budget: 500, debts: [{ ...D, rate: 0.24 }] }).warnings.length === 1);
  const dup = (debts) => { try { compare({ budget: 5000, debts }); return null; } catch (e) { return e.message; } };
  const nm = { balance: 1000, rate: 10, min: 100 };
  const dupMsg = dup([{ ...nm }, { ...nm, name: 'ก้อนที่ 1' }]);
  t('ชื่อสำรอง ก้อนที่ 1 ชนชื่อจริง = ซ้ำ ไม่ขึ้น undefined', dupMsg !== null && dupMsg.includes('ก้อนที่ 1') && !dupMsg.includes('undefined'));
  t('ไม่มีชื่อ 2 ก้อน ไม่ถือว่าซ้ำ', dup([{ ...nm }, { ...nm }]) === null);
  t('ไม่มีชื่อ 1 ก้อน ผ่านและใช้ชื่อสำรอง', Object.keys(compare({ budget: 5000, debts: [{ ...nm }, { ...nm, name: 'B' }] }).avalanche.paid).join() === 'ก้อนที่ 1,B');
  console.log(`self-test: ${ok} ผ่าน ${bad} ล้ม`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('ใช้: node payoff.mjs <ไฟล์.json> [--json] | --self-test'); process.exit(2); }
  try {
    const input = JSON.parse(readFileSync(file, 'utf8'));
    const r = compare(input);
    console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(input, r));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
