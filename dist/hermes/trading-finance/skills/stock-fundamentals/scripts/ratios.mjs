#!/usr/bin/env node
// ratios.mjs - basic ratios of a SET-listed company from its filed statements, with "open the statement" flags (Node stdlib only)
// Usage: node ratios.mjs <file.json> [--json]   |   node ratios.mjs --self-test
// File: one company { symbol, statementDate, price, priceDate, shares, unit, sector, netProfit, equity, totalLiabilities, ... }
//   or { "companies": [ ... ], "screen": { "maxPE", "minROE", "maxDE", "minYield" } } to list candidates.
// Formulas are the textbook ones (SKILL.md "The ratios"); written from scratch, no code copied.
import { readFileSync } from 'node:fs';

// Points where the statement deserves a second look - starting values, not measured (SKILL.md "Flags").
const FLAG = { growthHigh: 100, growthLow: -50, marginHigh: 60, marginLow: -50, roeHigh: 40, deHigh: 2, coverageLow: 1.5, payoutHigh: 100 };
const SECTORS = ['general', 'bank', 'insurance'];

const num = (v, label, { min = -Infinity, strict = false } = {}) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || (strict ? v <= min : v < min))
    throw new Error(`ช่อง ${label} ต้องเป็นตัวเลข${min === -Infinity ? '' : `${strict ? 'มากกว่า' : 'ตั้งแต่'} ${min}`} (ได้ ${JSON.stringify(v)})`);
};
const optNum = (x, k, label, o) => { if (x[k] !== undefined) num(x[k], label, o); };
const pct = (a, b) => (a / b) * 100;
const growth = (now, prev) => (prev === undefined || prev === 0 ? null : pct(now - prev, Math.abs(prev)));

export function validate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('ข้อมูลบริษัทต้องเป็นอ็อบเจกต์ JSON');
  const x = { unit: 1, sector: 'general', ...input };
  const n = x.symbol ?? 'บริษัท';
  if (!SECTORS.includes(x.sector)) throw new Error(`${n}: ช่อง sector ต้องเป็น ${SECTORS.join(' · ')} (ได้ ${JSON.stringify(x.sector)})`);
  if (!x.statementDate) throw new Error(`${n}: ช่อง statementDate หายไป · ใส่วันสิ้นงวดของงบ เช่น 2026-09-30`);
  num(x.unit, `${n}: unit (หน่วยของตัวเลขในงบ 1 = บาท · 1000 = พันบาท)`, { min: 0, strict: true });
  num(x.price, `${n}: price (ราคาหุ้น บาท)`, { min: 0, strict: true });
  num(x.shares, `${n}: shares (จำนวนหุ้นจดทะเบียนที่ชำระแล้ว หน่วยเป็นหุ้น)`, { min: 0, strict: true });
  num(x.netProfit, `${n}: netProfit (กำไรสุทธิส่วนที่เป็นของผู้ถือหุ้นบริษัทใหญ่ 12 เดือนล่าสุด)`);
  num(x.equity, `${n}: equity (ส่วนของผู้ถือหุ้นบริษัทใหญ่)`);
  for (const [k, l, o] of [
    ['totalLiabilities', 'totalLiabilities (หนี้สินรวม)', { min: 0 }],
    ['revenue', 'revenue (รายได้รวม 12 เดือน)', { min: 0 }],
    ['revenuePrev', 'revenuePrev (รายได้ 12 เดือนก่อนหน้า)', { min: 0 }],
    ['netProfitPrev', 'netProfitPrev (กำไรสุทธิ 12 เดือนก่อนหน้า)', {}],
    ['ebit', 'ebit (กำไรก่อนดอกเบี้ยและภาษี)', {}],
    ['interestExpense', 'interestExpense (ต้นทุนทางการเงิน)', { min: 0 }],
    ['dps', 'dps (ปันผลต่อหุ้น 12 เดือน บาท)', { min: 0 }],
    ['oneOff', 'oneOff (กำไรพิเศษที่ไม่เกิดซ้ำ ใส่ติดลบถ้าเป็นขาดทุนพิเศษ)', {}],
  ]) optNum(x, k, `${n}: ${l}`, o);
  if (x.sector === 'general' && x.totalLiabilities === undefined) throw new Error(`${n}: ช่อง totalLiabilities หายไป · บริษัททั่วไปต้องใช้คิด D/E`);
  return x;
}

export function ratios(input) {
  const x = validate(input);
  const u = x.unit;
  const np = x.netProfit * u, eq = x.equity * u;
  const r = { symbol: x.symbol ?? 'บริษัท', sector: x.sector, statementDate: x.statementDate, priceDate: x.priceDate ?? null, price: x.price, flags: [], notes: [] };
  const flag = (s) => r.flags.push(s);
  r.eps = np / x.shares;
  r.pe = r.eps > 0 ? x.price / r.eps : null;
  if (r.eps <= 0) flag('กำไรต่อหุ้นติดลบหรือเป็น 0 · P/E ใช้ไม่ได้');
  r.bvps = eq / x.shares;
  r.pbv = eq > 0 ? x.price / r.bvps : null;
  r.roe = eq > 0 ? pct(np, eq) : null;
  if (eq <= 0) flag('ส่วนของผู้ถือหุ้นติดลบหรือเป็น 0 · P/BV ROE D/E ใช้ไม่ได้ (ขาดทุนสะสมเกินทุน)');
  if (r.roe !== null && r.roe > FLAG.roeHigh) flag(`ROE ${r.roe.toFixed(1)}% เกิน ${FLAG.roeHigh}% · ดูว่ามีกำไรพิเศษ หรือทุนเล็กเพราะจ่ายปันผลเกิน/ซื้อหุ้นคืน`);
  if (x.oneOff !== undefined) {
    const core = np - x.oneOff * u;
    r.coreEps = core / x.shares;
    r.corePe = r.coreEps > 0 ? x.price / r.coreEps : null;
  }
  if (x.sector === 'general') {
    r.de = eq > 0 ? (x.totalLiabilities * u) / eq : null;
    if (r.de !== null && r.de > FLAG.deHigh) flag(`D/E ${r.de.toFixed(2)} เท่า เกิน ${FLAG.deHigh} · ดูหนี้ที่มีดอกเบี้ยและวันครบกำหนดในหมายเหตุงบ`);
    if (x.ebit !== undefined && x.interestExpense !== undefined) {
      r.coverage = x.interestExpense > 0 ? x.ebit / x.interestExpense : null;
      if (r.coverage !== null && r.coverage < FLAG.coverageLow) flag(`กำไรจ่ายดอกเบี้ยได้ ${r.coverage.toFixed(2)} เท่า ต่ำกว่า ${FLAG.coverageLow} · กำไรแทบไม่พอจ่ายดอกเบี้ย`);
    }
  } else {
    r.notes.push(x.sector === 'bank'
      ? 'ธนาคาร: D/E และ interest coverage ใช้ไม่ได้ (เงินฝากคือหนี้โดยธรรมชาติ) · ดู NIM · NPL ratio · coverage ratio · BIS ratio จากรายงานของธนาคารเอง'
      : 'ประกัน: D/E ใช้ไม่ได้ (เงินสำรองประกันคือหนี้โดยธรรมชาติ) · ดูอัตราส่วนความเพียงพอของเงินกองทุน (CAR) และอัตราค่าสินไหม (loss ratio) จากรายงานของบริษัทเอง');
  }
  if (x.dps !== undefined) {
    r.yield = pct(x.dps, x.price);
    r.payout = r.eps > 0 ? pct(x.dps, r.eps) : null;
    if (r.eps <= 0 && x.dps > 0) flag('จ่ายปันผลทั้งที่กำไรต่อหุ้นติดลบ · จ่ายจากกำไรสะสมหรือเงินกู้ ดูว่าจะจ่ายต่อได้นานแค่ไหน');
    if (r.payout !== null && r.payout > FLAG.payoutHigh) flag(`จ่ายปันผล ${r.payout.toFixed(0)}% ของกำไร เกิน ${FLAG.payoutHigh}% · จ่ายเกินที่หาได้`);
  }
  if (x.revenue !== undefined && x.revenue > 0) {
    r.netMargin = pct(np, x.revenue * u);
    if (r.netMargin > FLAG.marginHigh || r.netMargin < FLAG.marginLow) flag(`อัตรากำไรสุทธิ ${r.netMargin.toFixed(1)}% อยู่นอกช่วง ${FLAG.marginLow}% ถึง ${FLAG.marginHigh}% · ตรวจหน่วยของตัวเลขและกำไรพิเศษ`);
  }
  r.revenueGrowth = x.revenue !== undefined ? growth(x.revenue, x.revenuePrev) : null;
  r.profitGrowth = growth(x.netProfit, x.netProfitPrev);
  for (const [g, name] of [[r.revenueGrowth, 'รายได้'], [r.profitGrowth, 'กำไร']])
    if (g !== null && (g > FLAG.growthHigh || g < FLAG.growthLow)) flag(`${name}เปลี่ยน ${g >= 0 ? '+' : ''}${g.toFixed(0)}% จากปีก่อน · หาเหตุในงบ (ควบรวม ขายสินทรัพย์ กำไรพิเศษ) ก่อนเชื่อแนวโน้ม`);
  if (x.oneOff === undefined) r.notes.push('ไม่ได้ใส่ oneOff · ถ้างบมีกำไรหรือขาดทุนพิเศษ (ขายที่ดิน ตีราคา ค่าเผื่อด้อยค่า) ให้ใส่เพื่อดูกำไรปกติ');
  return r;
}

// Candidates only: passing the screen means "worth reading", never "worth buying" (SKILL.md "Screen").
export function screen(r, s) {
  const why = [];
  if (s.maxPE !== undefined && (r.pe === null || r.pe > s.maxPE)) why.push(r.pe === null ? 'P/E ใช้ไม่ได้' : `P/E ${r.pe.toFixed(1)} > ${s.maxPE}`);
  if (s.minROE !== undefined && (r.roe === null || r.roe < s.minROE)) why.push(r.roe === null ? 'ROE ใช้ไม่ได้' : `ROE ${r.roe.toFixed(1)}% < ${s.minROE}`);
  if (s.maxDE !== undefined && r.sector === 'general' && (r.de === null || r.de > s.maxDE)) why.push(r.de === null ? 'D/E ใช้ไม่ได้' : `D/E ${r.de.toFixed(2)} > ${s.maxDE}`);
  if (s.minYield !== undefined && (r.yield === undefined || r.yield < s.minYield)) why.push(r.yield === undefined ? 'ไม่ได้ใส่ dps' : `ปันผล ${r.yield.toFixed(1)}% < ${s.minYield}`);
  return { pass: why.length === 0 && r.flags.length === 0, why: [...why, ...(r.flags.length ? [`มีจุดต้องเปิดงบ ${r.flags.length} ข้อ`] : [])] };
}

export function run(input) {
  if (input && Array.isArray(input.companies)) {
    if (input.companies.length === 0) throw new Error('ช่อง companies ว่าง');
    const rows = input.companies.map(ratios);
    const s = input.screen;
    if (s !== undefined) for (const k of ['maxPE', 'minROE', 'maxDE', 'minYield']) optNum(s, k, `screen.${k}`, {});
    return { rows, screen: s ?? null, results: s ? rows.map((r) => ({ symbol: r.symbol, ...screen(r, s) })) : null };
  }
  return { rows: [ratios(input)], screen: null, results: null };
}

const f = (v, d = 2) => (v === null || v === undefined ? '-' : v.toFixed(d));
const p = (v) => (v === null || v === undefined ? '-' : `${v.toFixed(1)}%`);

export function report(out) {
  const lines = ['| หุ้น | งบ ณ | EPS | P/E | P/BV | ROE | D/E | ปันผล | จ่ายปันผล/กำไร | อัตรากำไรสุทธิ | จ่ายดอกเบี้ยได้ (เท่า) |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...out.rows.map((r) => `| ${r.symbol} | ${r.statementDate} | ${f(r.eps)} | ${f(r.pe, 1)} | ${f(r.pbv)} | ${p(r.roe)} | ${r.sector === 'general' ? f(r.de) : 'ใช้ไม่ได้'} | ${p(r.yield)} | ${p(r.payout)} | ${p(r.netMargin)} | ${r.sector === 'general' ? f(r.coverage) : 'ใช้ไม่ได้'} |`)];
  for (const r of out.rows) {
    if (r.coreEps !== undefined) lines.push('', `${r.symbol}: ตัดกำไรพิเศษแล้ว EPS ${f(r.coreEps)} · P/E ${f(r.corePe, 1)}`);
    if (r.revenueGrowth !== null || r.profitGrowth !== null) lines.push(`${r.symbol}: รายได้ ${p(r.revenueGrowth)} · กำไร ${p(r.profitGrowth)} เทียบ 12 เดือนก่อนหน้า`);
    if (r.flags.length) lines.push('', `${r.symbol} จุดที่ต้องเปิดงบดู:`, ...r.flags.map((x) => `- ${x}`));
    if (r.notes.length) lines.push(...r.notes.map((x) => `หมายเหตุ ${r.symbol}: ${x}`));
    lines.push(`ราคา ${r.price} บาท ณ ${r.priceDate ?? '(ไม่ได้ใส่ priceDate)'} · งบ ณ ${r.statementDate}`);
  }
  if (out.results) {
    const pass = out.results.filter((x) => x.pass).map((x) => x.symbol);
    lines.push('', `คัดกรอง ${JSON.stringify(out.screen)}: ผ่าน ${pass.length ? pass.join(' · ') : 'ไม่มี'}`,
      ...out.results.filter((x) => !x.pass).map((x) => `- ${x.symbol} ไม่ผ่าน: ${x.why.join(' · ')}`),
      'ผ่านเกณฑ์ = ผู้สมัครที่ควรอ่านงบต่อ ไม่ใช่หุ้นที่ควรซื้อ');
  }
  lines.push('', 'ตัวเลขจากงบที่ผู้ใช้ให้มา · ข้อมูลทั่วไป ไม่ใช่คำแนะนำการลงทุน');
  return lines.join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, b, tol = 1e-6) => a !== null && a !== undefined && Math.abs(a - b) <= tol;
  const throwsWith = (inp, word) => { try { run(inp); return false; } catch (e) { return e.message.includes(word); } };

  // Set A (hand-worked, SKILL.md worked example): EPS 2.5 · P/E 16 · BVPS 20 · P/BV 2 · ROE 12.5% · D/E 0.75
  // yield 3.75% · payout 60% · coverage 9 · margin 8.33% · revenue +20% · profit +25% · no flags
  const A = { symbol: 'AAA', statementDate: '2026-09-30', price: 40, priceDate: '2026-11-07', shares: 1e9, netProfit: 2.5e9, netProfitPrev: 2e9,
    equity: 20e9, totalLiabilities: 15e9, revenue: 30e9, revenuePrev: 25e9, ebit: 3.6e9, interestExpense: 0.4e9, dps: 1.5 };
  let r = ratios(A);
  t('A EPS 2.5', near(r.eps, 2.5)); t('A P/E 16', near(r.pe, 16)); t('A BVPS 20', near(r.bvps, 20)); t('A P/BV 2', near(r.pbv, 2));
  t('A ROE 12.5', near(r.roe, 12.5)); t('A D/E 0.75', near(r.de, 0.75)); t('A yield 3.75', near(r.yield, 3.75)); t('A payout 60', near(r.payout, 60));
  t('A coverage 9', near(r.coverage, 9)); t('A margin 8.33', near(r.netMargin, 25 / 3, 1e-9)); t('A growth 20/25', near(r.revenueGrowth, 20) && near(r.profitGrowth, 25));
  t('A ไม่มีธง', r.flags.length === 0);
  // same company in thousand baht gives the same ratios
  const Ak = { ...A, unit: 1000, netProfit: 2.5e6, netProfitPrev: 2e6, equity: 20e6, totalLiabilities: 15e6, revenue: 30e6, revenuePrev: 25e6, ebit: 3.6e6, interestExpense: 0.4e6 };
  const rk = ratios(Ak);
  t('หน่วยพันบาทได้ค่าเดิม', near(rk.eps, 2.5) && near(rk.pe, 16) && near(rk.roe, 12.5) && near(rk.de, 0.75) && near(rk.coverage, 9));
  // one-off: 0.5 bn of the 2.5 bn is a land sale -> core EPS 2.0, core P/E 20
  r = ratios({ ...A, oneOff: 0.5e9 });
  t('A กำไรปกติ EPS 2.0 P/E 20', near(r.coreEps, 2) && near(r.corePe, 20));

  // Set B (hand-worked, loss maker): EPS -0.5 · P/E none · BVPS 5 · P/BV 1 · ROE -10% · D/E 3 · coverage 0.75 · revenue +150% · yield 4%
  const B = { symbol: 'BBB', statementDate: '2026-06-30', price: 5, shares: 100e6, netProfit: -50e6, equity: 500e6, totalLiabilities: 1500e6,
    revenue: 1000e6, revenuePrev: 400e6, ebit: 30e6, interestExpense: 40e6, dps: 0.2 };
  r = ratios(B);
  t('B EPS -0.5 P/E ใช้ไม่ได้', near(r.eps, -0.5) && r.pe === null);
  t('B P/BV 1 ROE -10', near(r.pbv, 1) && near(r.roe, -10));
  t('B D/E 3 coverage 0.75', near(r.de, 3) && near(r.coverage, 0.75));
  t('B yield 4 payout ใช้ไม่ได้', near(r.yield, 4) && r.payout === null);
  t('B ธง 5 ข้อ (EPS · D/E · coverage · ปันผลตอนขาดทุน · รายได้ +150%)', r.flags.length === 5);

  // bank: D/E and coverage not computed, note given
  r = ratios({ symbol: 'BANK', sector: 'bank', statementDate: '2026-09-30', price: 150, shares: 2e9, netProfit: 40e9, equity: 400e9 });
  t('ธนาคารไม่คิด D/E', r.de === undefined && r.coverage === undefined && r.notes[0].includes('NPL'));
  t('ธนาคาร ROE 10 P/BV 0.75', near(r.roe, 10) && near(r.pbv, 0.75));
  // negative equity
  r = ratios({ ...B, equity: -10e6 });
  t('ทุนติดลบ P/BV ROE D/E ใช้ไม่ได้', r.pbv === null && r.roe === null && r.de === null);
  // screen: A passes, B fails with reasons
  const sc = run({ companies: [A, B], screen: { maxPE: 20, minROE: 10, maxDE: 1.5 } });
  t('คัดกรอง A ผ่าน B ไม่ผ่าน', sc.results[0].pass && !sc.results[1].pass && sc.results[1].why.length >= 3);
  t('รายงานบอกว่าไม่ใช่คำแนะนำ', report(sc).includes('ไม่ใช่หุ้นที่ควรซื้อ'));
  // bad input names the field
  t('ไม่มี statementDate', throwsWith({ ...A, statementDate: undefined }, 'statementDate'));
  t('ราคา 0', throwsWith({ ...A, price: 0 }, 'price'));
  t('หุ้น 0', throwsWith({ ...A, shares: 0 }, 'shares'));
  t('บริษัททั่วไปไม่มีหนี้สินรวม', throwsWith({ ...A, totalLiabilities: undefined }, 'totalLiabilities'));
  t('sector ผิด', throwsWith({ ...A, sector: 'tech' }, 'sector'));
  t('companies ว่าง', throwsWith({ companies: [] }, 'companies'));
  console.log(`self-test: ${ok} ผ่าน ${bad} ล้ม`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('ใช้: node ratios.mjs <ไฟล์.json> [--json] | --self-test'); process.exit(2); }
  try {
    const out = run(JSON.parse(readFileSync(file, 'utf8')));
    console.log(args.includes('--json') ? JSON.stringify(out, null, 2) : report(out));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
