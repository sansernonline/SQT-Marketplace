#!/usr/bin/env node
// size.mjs - position size from risk budget, snapped to board lot and checked against SET ticks (Node stdlib only)
// Usage: node size.mjs <file.json> [--json]   |   node size.mjs --self-test
// type "share" | "etf" | "crypto": { capital, riskPct, entry, stop, costPerShare, lot, maxPositionPct, avgDailyValue, asOf }
// type "forex": { capital, riskPct, stopPips, pipValuePerLot, costPerLot, volumeStep } + optional margin: { price, leverage, contractSize }
// Any type, optional: riskPctApprovedBy (required when riskPct > 2), gapMultiplier (1.5-2 for earnings/XD/weekend), openRiskPct (risk already open, % of capital)
// No stop = error. Tick table lives in ticks.json (checked + source); entry and stop must sit on a valid tick.
import { readFileSync } from 'node:fs';

const TICKS = JSON.parse(readFileSync(new URL('./ticks.json', import.meta.url), 'utf8'));
// SKILL.md rule (1-2% a trade): above this the script stops unless riskPctApprovedBy says who set it in CONTEXT.md
const MAX_RISK_PCT = 2;
// SKILL.md rule of thumb so the position can be exited in a day; starting value, not measured
const LIQUIDITY_PCT = 5;
// SKILL.md and forex-cfd-crypto.md: total open risk across positions <= 5-6% of capital; warn above the upper end
const MAX_OPEN_RISK_PCT = 6;
// forex-cfd-crypto.md section 2: one standard lot = 100,000 units of the base currency
const STANDARD_CONTRACT = 100000;
const todayLocal = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

export const tickFor = (price, bands) => bands.filter(([from]) => price >= from).at(-1)[1];
const onTick = (price, tick) => Math.abs(price / tick - Math.round(price / tick)) < 1e-6;
// floor with a tiny nudge so float noise (0.3 / 0.1) does not drop a whole step
const floorTo = (value, step) => Math.floor(value / step + 1e-9) * step;

const num = (v, label, { min = 0, strict = true } = {}) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || (strict ? v <= min : v < min)) throw new Error(`ช่อง ${label} ต้องเป็นตัวเลข${strict ? 'มากกว่า' : 'ตั้งแต่'} ${min} (ได้ ${JSON.stringify(v)})`);
};

// Throws a Thai message naming the bad field; returns warnings (list of strings).
export function validate(input) {
  if (!input || typeof input !== 'object') throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  const type = input.type ?? 'share';
  if (!['share', 'etf', 'crypto', 'forex'].includes(type)) throw new Error(`ช่อง type ต้องเป็น share, etf, crypto หรือ forex (ได้ ${JSON.stringify(input.type)})`);
  num(input.capital, 'capital');
  num(input.riskPct, 'riskPct');
  const warnings = [];
  if (input.riskPct > MAX_RISK_PCT) {
    const by = typeof input.riskPctApprovedBy === 'string' ? input.riskPctApprovedBy.trim() : '';
    if (!by) throw new Error(`riskPct ${input.riskPct}% เกินเพดาน ${MAX_RISK_PCT}% · ลดเป็น ${MAX_RISK_PCT} หรือต่ำกว่า หรือใส่ช่อง riskPctApprovedBy บอกว่าผู้ใช้เขียนค่านี้ไว้ที่ไหน (เช่น "CONTEXT.md 2026-10-28")`);
    warnings.push(`riskPct ${input.riskPct}% เกินเพดาน ${MAX_RISK_PCT}% · ผู้ใช้อนุมัติไว้: ${by}`);
  }
  if (input.gapMultiplier !== undefined) {
    num(input.gapMultiplier, 'gapMultiplier');
    if (input.gapMultiplier < 1) throw new Error(`ช่อง gapMultiplier ต้องไม่น้อยกว่า 1 (ได้ ${input.gapMultiplier}) · ใช้ 1.5–2 เมื่อราคาอาจกระโดดข้าม stop`);
  }
  if (input.openRiskPct !== undefined) num(input.openRiskPct, 'openRiskPct', { strict: false });
  if (type === 'forex') {
    if (input.stopPips === undefined || input.stopPips === null) throw new Error('ไม่มี stop-loss (ช่อง stopPips) · ไม่คำนวณขนาดไม้โดยไม่มี stop');
    num(input.stopPips, 'stopPips');
    num(input.pipValuePerLot, 'pipValuePerLot');
    num(input.costPerLot ?? 0, 'costPerLot', { strict: false });
    num(input.volumeStep ?? 0.01, 'volumeStep');
    if (input.leverage !== undefined || input.price !== undefined) {
      num(input.price, 'price (ราคาเข้า ใช้คิด margin)');
      num(input.leverage, 'leverage (เช่น 100 สำหรับ 1:100)');
      num(input.contractSize ?? STANDARD_CONTRACT, 'contractSize');
    }
    return warnings;
  }
  num(input.entry, 'entry');
  if (input.stop === undefined || input.stop === null) throw new Error('ไม่มี stop-loss (ช่อง stop) · ไม่คำนวณขนาดไม้โดยไม่มี stop');
  num(input.stop, 'stop');
  if (input.stop === input.entry) throw new Error('ช่อง stop เท่ากับ entry · ความเสี่ยงต่อหุ้นเป็น 0 คำนวณไม่ได้');
  num(input.costPerShare ?? 0, 'costPerShare', { strict: false });
  if (input.lot !== undefined) num(input.lot, 'lot');
  if (input.maxPositionPct !== undefined) num(input.maxPositionPct, 'maxPositionPct');
  if (input.avgDailyValue !== undefined) num(input.avgDailyValue, 'avgDailyValue');
  if (type === 'crypto') num(input.lot, 'lot (step ของเหรียญ)');
  else warnings.push(...checkTicks(input, type));
  return warnings;
}

// Error if entry/stop are off the tick in force on asOf; warning if they would be off the other table.
// A table marked unconfirmed in ticks.json never rejects: off-tick becomes a warning and the result says so.
function checkTicks(input, type) {
  const asOf = input.asOf ?? todayLocal();
  const inForce = asOf >= TICKS.effective ? 'after' : 'before';
  const other = inForce === 'after' ? 'before' : 'after';
  const warnings = [];
  const confirmed = TICKS.confirmed?.[inForce] !== false;
  if (!confirmed) warnings.push(`ใช้ตาราง tick ${inForce === 'after' ? 'หลัง' : 'ก่อน'} ${TICKS.effective} ที่ยังไม่ยืนยันประกาศฉบับสุดท้ายของ SET · ตรวจราคากับประกาศก่อนส่งคำสั่ง`);
  for (const field of ['entry', 'stop']) {
    const price = input[field];
    const tick = type === 'etf' ? TICKS.etf : tickFor(price, TICKS[inForce]);
    if (!onTick(price, tick)) {
      const msg = `ช่อง ${field} ${price} ไม่อยู่บน tick ที่ใช้ ณ ${asOf} (tick ${tick} บาท) · ปรับเป็นราคาที่หาร ${tick} ลงตัว`;
      if (confirmed) throw new Error(msg);
      warnings.push(`${msg} (ตารางยังไม่ยืนยัน จึงเตือนแทนหยุด)`);
      continue;
    }
    if (type !== 'etf' && !onTick(price, tickFor(price, TICKS[other]))) {
      warnings.push(`${field} ${price} ใช้ได้ตาม tick ${inForce === 'after' ? 'หลัง' : 'ก่อน'} ${TICKS.effective} แต่ไม่ตรง tick ${inForce === 'after' ? 'ก่อน' : 'หลัง'}วันนั้น`);
    }
  }
  return warnings;
}

function sizeForex(input, warnings) {
  const step = input.volumeStep ?? 0.01;
  const budget = (input.capital * input.riskPct) / 100;
  const riskPerLot = input.stopPips * input.pipValuePerLot + (input.costPerLot ?? 0);
  const size = floorTo(budget / riskPerLot, step);
  // margin = lots x contract size x price / leverage (forex-cfd-crypto.md section 3), in the quote currency
  const margin = input.leverage === undefined ? null : (size * (input.contractSize ?? STANDARD_CONTRACT) * input.price) / input.leverage;
  return addRiskChecks(input, { type: 'forex', unit: 'lot', step, budget, riskPerUnit: riskPerLot, rawSize: budget / riskPerLot, size, value: null, valuePct: null, margin, realRisk: size * riskPerLot, bound: size > 0 ? 'risk' : null, warnings });
}

// Gap loss and total open risk: both are what-ifs on top of the sized trade, never change the size itself.
function addRiskChecks(input, r) {
  const realPct = (r.realRisk / input.capital) * 100;
  r.gapRisk = input.gapMultiplier === undefined ? null : r.realRisk * input.gapMultiplier;
  r.totalOpenRiskPct = input.openRiskPct === undefined ? null : input.openRiskPct + realPct;
  if (r.totalOpenRiskPct !== null && r.totalOpenRiskPct > MAX_OPEN_RISK_PCT) r.warnings.push(`ความเสี่ยงรวมที่เปิดอยู่ ${fmt(r.totalOpenRiskPct, 2)}% เกิน ${MAX_OPEN_RISK_PCT}% ของทุน · ลดขนาดหรือปิดไม้อื่นก่อน`);
  return r;
}

export function compute(input) {
  const warnings = validate(input);
  const type = input.type ?? 'share';
  if (type === 'forex') return sizeForex(input, warnings);
  const lot = input.lot ?? 100;
  const budget = (input.capital * input.riskPct) / 100;
  const riskPerUnit = Math.abs(input.entry - input.stop) + (input.costPerShare ?? 0);
  const rawSize = budget / riskPerUnit;
  const maxPct = input.maxPositionPct ?? (type === 'etf' ? 20 : 10);
  const limits = [
    ['risk', floorTo(rawSize, lot)],
    ['concentration', floorTo((input.capital * maxPct) / 100 / input.entry, lot)],
  ];
  if (input.avgDailyValue !== undefined) limits.push(['liquidity', floorTo((input.avgDailyValue * LIQUIDITY_PCT) / 100 / input.entry, lot)]);
  const [bound, size] = limits.reduce((a, b) => (b[1] < a[1] ? b : a));
  const value = size * input.entry;
  return addRiskChecks(input, { type, step: lot, unit: type === 'crypto' ? 'เหรียญ' : 'หุ้น', side: input.stop < input.entry ? 'buy' : 'short', budget, riskPerUnit, rawSize, size, value, valuePct: (value / input.capital) * 100, realRisk: size * riskPerUnit, bound: size > 0 ? bound : null, limits: Object.fromEntries(limits), warnings });
}

const fmt = (n, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const decimalsOf = (step) => Math.max(0, Math.ceil(-Math.log10(step) - 1e-9));
const BOUND_TEXT = { risk: 'งบความเสี่ยง', concentration: 'เพดานสัดส่วนต่อไม้', liquidity: 'สภาพคล่อง (5% ของมูลค่าซื้อขายเฉลี่ยต่อวัน)' };

export function report(input, r) {
  const money = r.type === 'forex' ? 'หน่วยสกุลบัญชี' : 'บาท';
  const lines = [
    `งบความเสี่ยง ${fmt(r.budget, 2)} ${money} (${input.riskPct}% ของ ${fmt(input.capital)})`,
    `ความเสี่ยงต่อ ${r.unit} (รวมต้นทุน) ${fmt(r.riskPerUnit, 2)}`,
    `ขนาดดิบ ${fmt(r.rawSize, Math.max(2, decimalsOf(r.step)))} ${r.unit}`,
    ...r.warnings.map((w) => `คำเตือน: ${w}`),
    '',
  ];
  if (r.size === 0) {
    lines.push('**ผล:** ขนาดเป็น 0 · stop กว้างเกินสำหรับบัญชีนี้ · ข้ามไม้นี้ (ไม่ขยาย risk%)');
  } else {
    const value = r.value === null ? '' : ` · มูลค่า ${fmt(r.value)} บาท (${fmt(r.valuePct, 1)}% ของทุน)`;
    lines.push(`**ผล:** ${fmt(r.size, decimalsOf(r.step))} ${r.unit}${value} · ความเสี่ยงจริง ${fmt(r.realRisk, 2)} ${money} (${fmt((r.realRisk / input.capital) * 100, 2)}%)`);
    lines.push(`ข้อที่กำหนดขนาด: ${BOUND_TEXT[r.bound]}`);
    if (r.gapRisk !== null) lines.push(`ถ้าราคากระโดดข้าม stop (x${input.gapMultiplier}): ขาดทุนได้ถึง ${fmt(r.gapRisk, 2)} ${money} (${fmt((r.gapRisk / input.capital) * 100, 2)}%)`);
    if (r.totalOpenRiskPct !== null) lines.push(`ความเสี่ยงรวมหลังเปิดไม้นี้ ${fmt(r.totalOpenRiskPct, 2)}% ของทุน (เพดาน ${MAX_OPEN_RISK_PCT}%)`);
    if (r.margin != null) lines.push(`margin ประมาณ ${fmt(r.margin, 2)} (สกุลราคา · แปลงเป็นสกุลบัญชีถ้าต่างกัน) = ${fmt((r.margin / input.capital) * 100, 1)}% ของทุน · margin ไม่ใช่ความเสี่ยง`);
  }
  lines.push('', 'ข้อมูลทั่วไป ไม่ใช่คำแนะนำการลงทุน');
  return lines.join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, b) => Math.abs(a - b) < 0.01;
  const throwsWith = (inp, word) => { try { compute(inp); return false; } catch (e) { return e.message.includes(word); } };
  const S = { capital: 100000, riskPct: 1, entry: 48.5, stop: 47.5, costPerShare: 0.19, asOf: '2026-10-28' };
  // SKILL.md worked example: raw 840 -> 800 by risk; concentration caps at 200; real risk 238
  let r = compute({ ...S, maxPositionPct: 100 });
  t('ตัวอย่าง SKILL ไม่ติดเพดาน = 800', r.size === 800 && r.bound === 'risk' && near(r.rawSize, 840.34));
  r = compute(S);
  t('ตัวอย่าง SKILL เพดาน 10% = 200', r.size === 200 && r.bound === 'concentration' && near(r.realRisk, 238) && near(r.value, 9700));
  t('งบความเสี่ยง 1,000', near(r.budget, 1000));
  // stop 45.50 -> risk 3.19/share -> raw 313.5 -> 300, still capped at 200
  t('stop กว้าง 45.50', compute({ ...S, stop: 45.5 }).size === 200 && compute({ ...S, stop: 45.5, maxPositionPct: 100 }).size === 300);
  // liquidity: 5% of 100,000 = 5,000 baht -> 100 shares
  t('สภาพคล่องจำกัด', compute({ ...S, avgDailyValue: 100000 }).bound === 'liquidity');
  r = compute({ ...S, capital: 10000, stop: 30 });
  t('size 0 เมื่อ stop กว้าง', r.size === 0 && r.bound === null);
  // forex SKILL example: 100 / (30 x 10 + 10) = 0.322 -> 0.32 lots, risk 99.2
  r = compute({ type: 'forex', capital: 10000, riskPct: 1, stopPips: 30, pipValuePerLot: 10, costPerLot: 10 });
  t('forex 0.32 lot', near(r.size, 0.32) && near(r.realRisk, 99.2));
  // crypto: 1,000 / 10 = 100 coins by risk; cap 10% of 100,000 = 10,000 / 100 = 100 coins
  r = compute({ type: 'crypto', capital: 100000, riskPct: 1, entry: 100, stop: 90, lot: 1 });
  t('crypto 100 เหรียญ', r.size === 100);
  // size under 1 coin must print with the step's decimals: step 0.0001, 0.05 coin (10% cap)
  const tiny = { type: 'crypto', capital: 10000, riskPct: 1, entry: 20000, stop: 19980, lot: 0.0001 };
  t('crypto เศษเหรียญพิมพ์ทศนิยม', report(tiny, compute(tiny)).includes('0.0500 เหรียญ'));
  const fx = { type: 'forex', capital: 10000, riskPct: 1, stopPips: 30, pipValuePerLot: 10, costPerLot: 10 };
  t('forex พิมพ์ 0.32 lots', report(fx, compute(fx)).includes('0.32 lot'));
  t('ไม่มี stop error', throwsWith({ ...S, stop: undefined }, 'stop-loss'));
  t('forex ไม่มี stop error', throwsWith({ type: 'forex', capital: 1000, riskPct: 1, pipValuePerLot: 10 }, 'stopPips'));
  // 48.30 is valid only under the new table (0.10), not before 16 Nov (0.25)
  t('tick เดิม 48.30 ผิด', throwsWith({ ...S, entry: 48.3 }, 'entry'));
  t('tick ใหม่ 48.30 ผ่าน', compute({ ...S, entry: 48.3, asOf: '2026-11-16' }).size > 0);
  t('tick stop ผิด', throwsWith({ ...S, stop: 47.4 }, 'stop'));
  t('48.50 ใช้ได้ทั้งสองตาราง ไม่เตือน', compute(S).warnings.length === 0);
  const after = compute({ ...S, entry: 48.3, asOf: '2026-11-16' }).warnings;
  t('tick ใหม่ 48.30 เตือนว่าไม่ตรงตารางเดิม และว่าตารางยังไม่ยืนยัน', after.length === 2 && after.some((w) => w.includes('ยังไม่ยืนยัน')));
  t('ตารางก่อนวันที่ 16 พ.ย. ไม่เตือนเรื่องยังไม่ยืนยัน', !compute(S).warnings.some((w) => w.includes('ยังไม่ยืนยัน')));
  // ตารางหลังยังไม่ยืนยัน: ราคา 48.35 ไม่อยู่บน tick 0.10 -> เตือนแทนหยุด แต่ยังคำนวณ
  const off = compute({ ...S, entry: 48.35, asOf: '2026-11-16' });
  t('ตารางยังไม่ยืนยัน off-tick เตือนไม่หยุด', off.size > 0 && off.warnings.some((w) => w.includes('เตือนแทนหยุด')));
  t('ETF tick 0.01', compute({ ...S, type: 'etf', entry: 10.07, stop: 9.97 }).size > 0);
  t('tickFor 9.90 ก่อน/หลัง', tickFor(9.9, TICKS.before) === 0.05 && tickFor(9.9, TICKS.after) === 0.02 && tickFor(400, TICKS.after) === 2);
  t('capital NaN', throwsWith({ ...S, capital: NaN }, 'capital'));
  t('riskPct เป็นข้อความ', throwsWith({ ...S, riskPct: '1' }, 'riskPct'));
  t('stop = entry', throwsWith({ ...S, stop: 48.5 }, 'stop'));
  t('type ผิด', throwsWith({ ...S, type: 'bond' }, 'type'));
  t('riskPct > 2 ไม่มีผู้อนุมัติ error', throwsWith({ ...S, riskPct: 3 }, 'riskPctApprovedBy'));
  t('riskPct > 2 มีผู้อนุมัติ เตือน', compute({ ...S, riskPct: 3, riskPctApprovedBy: 'CONTEXT.md 2026-10-28' }).warnings.length === 1);
  t('forex riskPct 50 error', throwsWith({ ...fx, riskPct: 50 }, 'riskPctApprovedBy'));
  // forex-cfd-crypto.md worked example: 0.32 lots x 100,000 x 1.085 / 100 = 347.2
  t('forex margin 347', near(compute({ ...fx, price: 1.085, leverage: 100 }).margin, 347.2));
  t('forex leverage ไม่มี price error', throwsWith({ ...fx, leverage: 100 }, 'price'));
  // gap x2 on the SKILL example: real risk 238 -> 476
  t('gapMultiplier 2', near(compute({ ...S, gapMultiplier: 2 }).gapRisk, 476));
  t('gapMultiplier < 1 error', throwsWith({ ...S, gapMultiplier: 0.5 }, 'gapMultiplier'));
  // open risk 5.9% + 0.238% = 6.138% > 6 -> warn; 3% + 0.238% -> no warning
  t('ความเสี่ยงรวมเกิน 6% เตือน', compute({ ...S, openRiskPct: 5.9 }).warnings.some((w) => w.includes('ความเสี่ยงรวม')));
  t('ความเสี่ยงรวมไม่เกิน ไม่เตือน', compute({ ...S, openRiskPct: 3 }).warnings.length === 0 && near(compute({ ...S, openRiskPct: 3 }).totalOpenRiskPct, 3.238));
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('ใช้: node size.mjs <ไฟล์.json> [--json] | --self-test'); process.exit(2); }
  try {
    const input = JSON.parse(readFileSync(file, 'utf8'));
    const r = compute(input);
    console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(input, r));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
