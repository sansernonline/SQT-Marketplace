#!/usr/bin/env node
// money-calc.mjs - money arithmetic for 5 trading-finance skills, so figures are not worked out in the model's head (Node stdlib only)
// Usage: node money-calc.mjs <snapshot|drift|dividend|afterTax|fee> <file.json> [--json]   |   node money-calc.mjs --self-test
// Example files: examples/<command>.json next to this script. Each command follows the formula in its skill:
//   snapshot  portfolio-snapshot/SKILL.md "Formulas"      drift     rebalance-and-dca/SKILL.md section 3
//   dividend  dividend-tracker/SKILL.md "Formulas"        afterTax  bonds-and-deposits/SKILL.md Workflow step 5
//   fee       mutual-fund-picker/SKILL.md "fee drag"
import { readFileSync } from 'node:fs';

// Tax rates change with the law: each one is taken from the skill text that carries its source and check date.
// 10% withheld on Thai dividends: dividend-tracker/SKILL.md "Formulas" (withholding tax = 10% × gross).
const DIVIDEND_WHT_PCT = 10;
// 15% withheld on interest: bonds-and-deposits/SKILL.md section 2 ("Interest is 15% withheld each payment", checked 2026-10-26).
const INTEREST_WHT_PCT = 15;
// Band 5 points and N = 12 months: rebalance-and-dca/SKILL.md section 3 (starting values, not yet measured; the user's values win).
const DEFAULT_BAND_POINTS = 5;
const DEFAULT_MAX_MONTHS = 12;

const num = (v, label, min = 0, strict = false) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || (strict ? v <= min : v < min)) throw new Error(`ช่อง ${label} ต้องเป็นตัวเลข${strict ? 'มากกว่า' : 'ตั้งแต่'} ${min} (ได้ ${JSON.stringify(v)})`);
};
const list = (v, label) => {
  if (!Array.isArray(v) || v.length === 0) throw new Error(`ช่อง ${label} ต้องเป็นรายการอย่างน้อย 1 แถว`);
  return v;
};
const opt = (v, def) => (v === undefined ? def : v);
const pct = (a, b) => (a / b) * 100;

// --- snapshot: P/L, weight, Modified Dietz return -------------------------------------------
export function snapshot(input) {
  const warnings = [];
  const rows = list(input?.holdings, 'holdings').map((h, i) => {
    const n = h?.name ?? `แถวที่ ${i + 1}`;
    const L = (f) => `holdings[${i}].${f} (${n})`;
    let value, cost = null;
    if (h.value !== undefined) num(h.value, L('value'));
    if (h.shares !== undefined || h.price !== undefined) {
      num(h.shares, L('shares')); num(h.price, L('price'));
      value = h.shares * h.price;
      if (h.value !== undefined && Math.abs(h.value - value) > Math.max(1, value * 0.005)) warnings.push(`${n}: value ${h.value} ไม่ตรงกับ shares × price ${value} · ใช้ shares × price · ลบช่องที่ไม่แน่ใจออกหรือแก้ให้ตรงกัน`);
    } else if (h.value !== undefined) value = h.value;
    else throw new Error(`ช่อง ${L('value')} หายไป · ใส่ value หรือ shares + price`);
    if (h.avgCost !== undefined) {
      num(h.avgCost, L('avgCost'));
      if (h.shares === undefined) throw new Error(`ช่อง ${L('shares')} หายไป · avgCost ต้องมี shares ด้วย`);
      cost = h.avgCost * h.shares;
    }
    return { name: n, value, cost, pl: cost === null ? null : value - cost, plPct: cost ? pct(value - cost, cost) : null };
  });
  const total = rows.reduce((s, r) => s + r.value, 0);
  if (total <= 0) throw new Error('มูลค่ารวมเป็น 0 · ตรวจช่อง value / shares / price');
  rows.forEach((r) => { r.weight = pct(r.value, total); });
  const out = { total, pl: rows.reduce((s, r) => s + (r.pl ?? 0), 0), rows, ret: null, warnings };
  if (input.startValue !== undefined) {
    num(input.startValue, 'startValue', 0, true);
    const dep = opt(input.netDeposits, 0);
    if (typeof dep !== 'number' || !Number.isFinite(dep)) throw new Error(`ช่อง netDeposits ต้องเป็นตัวเลข (ถอนออกใส่ติดลบ) (ได้ ${JSON.stringify(dep)})`);
    const base = input.startValue + dep * 0.5; // deposits assumed mid-period (Modified Dietz shortcut)
    if (base <= 0) throw new Error('startValue + netDeposits × 0.5 ต้องมากกว่า 0 · ถอนเกินมูลค่าต้นงวด ตรวจตัวเลข');
    out.ret = pct(total - input.startValue - dep, base);
  }
  return out;
}

// --- drift: deviation from target and months for DCA to close the gap --------------------
export function drift(input) {
  const h = input?.holdings, t = input?.target;
  if (!h || typeof h !== 'object' || !t || typeof t !== 'object') throw new Error('ต้องมีช่อง holdings และ target เป็นอ็อบเจกต์ {ชื่อ: ตัวเลข}');
  const names = Object.keys(t);
  if (names.length < 2) throw new Error('ช่อง target ต้องมีอย่างน้อย 2 สินทรัพย์');
  for (const k of Object.keys(h)) if (!(k in t)) throw new Error(`holdings มี "${k}" แต่ target ไม่มี · ใส่ target ของ ${k} (0 ได้)`);
  names.forEach((k) => { num(t[k], `target.${k}`); num(opt(h[k], 0), `holdings.${k}`); });
  const tSum = names.reduce((s, k) => s + t[k], 0);
  if (Math.abs(tSum - 100) > 0.01) throw new Error(`ช่อง target รวมได้ ${tSum} ต้องรวม 100 (หน่วยเป็น %)`);
  const dca = opt(input.monthlyDca, 0); num(dca, 'monthlyDca');
  const band = opt(input.bandPoints, DEFAULT_BAND_POINTS); num(band, 'bandPoints');
  const maxMonths = opt(input.maxMonths, DEFAULT_MAX_MONTHS); num(maxMonths, 'maxMonths');
  const total = names.reduce((s, k) => s + opt(h[k], 0), 0);
  if (total <= 0) throw new Error('มูลค่ารวมใน holdings เป็น 0');
  const rows = names.map((k) => {
    const value = opt(h[k], 0), share = t[k] / 100, targetBaht = share * total, gap = targetBaht - value;
    // months = gap ÷ (DCA × (1 − target share)), all new money into this line; null = DCA alone never closes it
    const per = dca * (1 - share);
    const raw = gap > 0 ? (per > 0 ? gap / per : null) : 0;
    return { name: k, value, pctNow: pct(value, total), targetPct: t[k], deviation: pct(value, total) - t[k], targetBaht, gap, months: raw === null ? null : Math.ceil(raw - 1e-9) };
  });
  const worst = Math.max(...rows.map((r) => Math.abs(r.deviation)));
  const breach = worst > band;
  const under = rows.filter((r) => r.gap > 0).sort((a, b) => b.gap - a.gap)[0];
  let verdict = 'within-band';
  if (breach) verdict = under.months !== null && under.months <= maxMonths ? 'dca' : 'offer-switch';
  return { total, band, maxMonths, monthlyDca: dca, rows, worstDeviation: worst, verdict, closeWith: breach ? under.name : null, months: breach ? under.months : null };
}

// --- dividend: gross, withheld, net, yields ------------------------------------------------
export function dividend(input) {
  const rows = list(input?.holdings, 'holdings').map((h, i) => {
    const n = h?.symbol ?? `แถวที่ ${i + 1}`;
    const L = (f) => `holdings[${i}].${f} (${n})`;
    num(h.shares, L('shares')); num(h.dps, L('dps'));
    const src = opt(h.source, 'thai-listed');
    let wht;
    if (h.withholdingPct !== undefined) { num(h.withholdingPct, L('withholdingPct')); wht = h.withholdingPct; }
    else if (src === 'thai-listed' || src === 'thai-fund') wht = DIVIDEND_WHT_PCT;
    else if (src === 'foreign') throw new Error(`ช่อง ${L('withholdingPct')} หายไป · ปันผลต่างประเทศหักตามประเทศ ใส่อัตราที่ตรวจแล้ว ไม่รู้ให้เขียน (รอยืนยัน) แล้วเว้นแถวนี้`);
    else throw new Error(`ช่อง ${L('source')} ต้องเป็น thai-listed · thai-fund · foreign (ได้ ${JSON.stringify(src)})`);
    if (wht > 100) throw new Error(`ช่อง ${L('withholdingPct')} เกิน 100`);
    const gross = h.dps * h.shares, tax = (gross * wht) / 100;
    const r = { symbol: n, status: opt(h.status, 'declared'), gross, withheldPct: wht, tax, net: gross - tax, trailingYield: null, yieldOnCost: null };
    if (h.dps12m !== undefined && h.price !== undefined) { num(h.dps12m, L('dps12m')); num(h.price, L('price'), 0, true); r.trailingYield = pct(h.dps12m, h.price); }
    if (h.annualDps !== undefined && h.avgCost !== undefined) { num(h.annualDps, L('annualDps')); num(h.avgCost, L('avgCost'), 0, true); r.yieldOnCost = pct(h.annualDps, h.avgCost); }
    return r;
  });
  const sum = (f) => rows.reduce((s, r) => s + r[f], 0);
  return { rows, gross: sum('gross'), tax: sum('tax'), net: sum('net'), hasEstimates: rows.some((r) => r.status === 'estimated') };
}

// --- afterTax: interest after 15% withholding (simple interest, as in the skill) ------------
export function afterTax(input) {
  const rows = list(input?.options, 'options').map((o, i) => {
    const n = o?.name ?? `ตัวเลือกที่ ${i + 1}`;
    const L = (f) => `options[${i}].${f} (${n})`;
    num(o.amount, L('amount'), 0, true); num(o.ratePct, L('ratePct')); num(o.years, L('years'), 0, true);
    const wht = opt(o.withholdingPct, INTEREST_WHT_PCT); num(wht, L('withholdingPct'));
    if (wht > 100) throw new Error(`ช่อง ${L('withholdingPct')} เกิน 100`);
    // amount × rate × (1 − 0.15) × years
    const gross = o.amount * (o.ratePct / 100) * o.years, tax = (gross * wht) / 100;
    return { name: n, amount: o.amount, ratePct: o.ratePct, years: o.years, withheldPct: wht, gross, tax, net: gross - tax, netRatePct: o.ratePct * (1 - wht / 100) };
  });
  return { rows };
}

// --- fee: fee drag, amount × (1 + return − TER)^years -------------------------------------
export function fee(input) {
  num(input?.amount, 'amount', 0, true); num(input.years, 'years', 0, true);
  if (typeof input.grossReturnPct !== 'number' || !Number.isFinite(input.grossReturnPct)) throw new Error(`ช่อง grossReturnPct ต้องเป็นตัวเลข % ต่อปีก่อนหักค่าธรรมเนียม (ได้ ${JSON.stringify(input.grossReturnPct)})`);
  const rows = list(input.funds, 'funds').map((f, i) => {
    const n = f?.name ?? `กองที่ ${i + 1}`;
    num(f.terPct, `funds[${i}].terPct (${n})`);
    const net = input.grossReturnPct - f.terPct;
    if (net <= -100) throw new Error(`funds[${i}] (${n}): ผลตอบแทนหลังหักค่าธรรมเนียม ${net}% ต่ำกว่า −100% · ตรวจ terPct`);
    return { name: n, terPct: f.terPct, netReturnPct: net, value: input.amount * (1 + net / 100) ** input.years };
  });
  const best = Math.max(...rows.map((r) => r.value));
  rows.forEach((r) => { r.lostVsBest = best - r.value; r.lostPctOfBest = pct(best - r.value, best); });
  return { amount: input.amount, years: input.years, grossReturnPct: input.grossReturnPct, rows };
}

const COMMANDS = { snapshot, drift, dividend, afterTax, fee };

// --- text output ----------------------------------------------------------------------------
const b = (n) => Math.round(n).toLocaleString('en-US');
const p1 = (n) => (n === null ? '-' : `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`);
const w1 = (n) => `${n.toFixed(1)}%`;

export function report(cmd, r) {
  if (cmd === 'snapshot') {
    const lines = ['| ถือ | มูลค่า | กำไร/ขาดทุน | น้ำหนัก |', '|---|---|---|---|',
      ...r.rows.map((x) => `| ${x.name} | ${b(x.value)} | ${x.pl === null ? '-' : `${x.pl >= 0 ? '+' : ''}${b(x.pl)} (${p1(x.plPct)})`} | ${w1(x.weight)} |`),
      `| **รวม** | **${b(r.total)}** | **${r.pl >= 0 ? '+' : ''}${b(r.pl)}** | 100% |`];
    if (r.ret !== null) lines.push('', `ผลตอบแทนงวดนี้ ${p1(r.ret)} (Modified Dietz ถือว่าเงินเข้ากลางงวด เป็นค่าประมาณ)`);
    if (r.warnings.length) lines.unshift(...r.warnings.map((w) => `คำเตือน: ${w}`), '');
    return lines.join('\n');
  }
  if (cmd === 'drift') {
    const lines = ['| สินทรัพย์ | ตอนนี้ | % ตอนนี้ | % เป้า | ส่วนเบี่ยง (จุด) | บาทตามเป้า | ขาด(+)/เกิน(−) |', '|---|---|---|---|---|---|---|',
      ...r.rows.map((x) => `| ${x.name} | ${b(x.value)} | ${x.pctNow.toFixed(1)} | ${x.targetPct} | ${x.deviation >= 0 ? '+' : ''}${x.deviation.toFixed(1)} | ${b(x.targetBaht)} | ${x.gap >= 0 ? '+' : ''}${b(x.gap)} |`), ''];
    if (r.verdict === 'within-band') lines.push(`ส่วนเบี่ยงสูงสุด ${r.worstDeviation.toFixed(1)} จุด ไม่เกินกรอบ ${r.band} จุด · ยังไม่ต้องปรับ`);
    else if (r.months === null) lines.push(`เกินกรอบ ${r.band} จุด · DCA ${b(r.monthlyDca)} ต่อเดือนปิดช่อง ${r.closeWith} ไม่ได้ · เสนอสับเปลี่ยนหรือขายพร้อมค่าใช้จ่าย ผู้ใช้ตัดสิน`);
    else lines.push(`เกินกรอบ ${r.band} จุด · ใส่ DCA ทั้ง ${b(r.monthlyDca)} ลง ${r.closeWith} ใช้ ${r.months} เดือน`
      + (r.verdict === 'dca' ? ` ไม่เกิน ${r.maxMonths} เดือน → ปิดด้วย DCA ไม่ขาย` : ` เกิน ${r.maxMonths} เดือน → เสนอสับเปลี่ยนหรือขายพร้อมค่าใช้จ่ายข้างทาง DCA ผู้ใช้ตัดสิน`));
    return lines.join('\n');
  }
  if (cmd === 'dividend') {
    return ['| หุ้น | สถานะ | ปันผลก่อนภาษี | หัก | สุทธิ | yield ย้อนหลัง | yield on cost |', '|---|---|---|---|---|---|---|',
      ...r.rows.map((x) => `| ${x.symbol} | ${x.status} | ${b(x.gross)} | ${b(x.tax)} (${x.withheldPct}%) | ${b(x.net)} | ${x.trailingYield === null ? '-' : w1(x.trailingYield)} | ${x.yieldOnCost === null ? '-' : w1(x.yieldOnCost)} |`),
      `| **รวม** | | **${b(r.gross)}** | **${b(r.tax)}** | **${b(r.net)}** | | |`,
      ...(r.hasEstimates ? ['', 'มีแถวที่เป็นตัวเลขประมาณ (estimated) · ห้ามบอกว่าประกาศแล้ว'] : [])].join('\n');
  }
  if (cmd === 'afterTax') {
    return ['| ตัวเลือก | เงินต้น | อัตรา %/ปี | ปี | ดอกก่อนภาษี | หัก | ดอกหลังภาษี | อัตราหลังภาษี %/ปี |', '|---|---|---|---|---|---|---|---|',
      ...r.rows.map((x) => `| ${x.name} | ${b(x.amount)} | ${x.ratePct} | ${x.years} | ${b(x.gross)} | ${b(x.tax)} (${x.withheldPct}%) | ${b(x.net)} | ${x.netRatePct.toFixed(2)} |`),
      '', 'คิดแบบดอกเบี้ยไม่ทบต้นตามสูตรใน skill · อัตราทุกตัวต้องมีแหล่งและวันที่'].join('\n');
  }
  return [`| กอง | TER % | ผลตอบแทนหลังหักค่าธรรมเนียม %/ปี | มูลค่าหลัง ${r.years} ปี | หายไปเทียบกองถูกสุด |`, '|---|---|---|---|---|',
    ...r.rows.map((x) => `| ${x.name} | ${x.terPct} | ${x.netReturnPct.toFixed(2)} | ${b(x.value)} | ${b(x.lostVsBest)} (${x.lostPctOfBest.toFixed(1)}%) |`),
    '', `เงินต้น ${b(r.amount)} · ผลตอบแทนตลาดสมมติ ${r.grossReturnPct}%/ปีก่อนหักค่าธรรมเนียม · ผลตอบแทนในอดีตไม่รับประกันอนาคต`].join('\n');
}

// --- self-test: worked examples in each SKILL.md + edge cases -------------------------------
function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, x, tol = 0.01) => Math.abs(a - x) < tol;
  const throwsWith = (fn, inp, word) => { try { fn(inp); return false; } catch (e) { return e.message.includes(word); } };

  // portfolio-snapshot worked example: total 300,000 · P/L +2,000 · ABC 32.7% · return +1.7%
  const snap = { startValue: 285000, netDeposits: 10000, holdings: [
    { name: 'ABC', shares: 2000, avgCost: 42, price: 49 }, { name: 'DEF', shares: 1000, avgCost: 60, price: 45 },
    { name: 'SET50 index fund', shares: 4000, avgCost: 11.5, price: 12.25 }, { name: 'Money market fund', value: 78000 }, { name: 'Cash at broker', value: 30000 }] };
  let r = snapshot(snap);
  t('snapshot รวม 300,000', near(r.total, 300000));
  t('snapshot P/L +2,000', near(r.pl, 2000));
  t('snapshot ABC 32.7%', r.rows[0].weight.toFixed(1) === '32.7' && r.rows[0].plPct.toFixed(1) === '16.7');
  t('snapshot DEF −25%', near(r.rows[1].plPct, -25));
  t('snapshot ผลตอบแทน +1.7%', r.ret.toFixed(1) === '1.7');
  t('snapshot ไม่มี startValue ไม่คิดผลตอบแทน', snapshot({ holdings: [{ name: 'A', value: 1 }] }).ret === null);
  t('snapshot ถอนเงินติดลบได้', near(snapshot({ startValue: 100, netDeposits: -20, holdings: [{ name: 'A', value: 90 }] }).ret, 10 / 90 * 100));
  const mis = snapshot({ holdings: [{ name: 'A', shares: 100, price: 10, value: 5000 }, { name: 'B', shares: 100, price: 10, value: 1000 }] });
  t('value ไม่ตรง shares×price เตือน 1 ครั้ง (ตรงกันไม่เตือน)', mis.warnings.length === 1 && mis.warnings[0].startsWith('A:') && report('snapshot', mis).includes('คำเตือน') && snap && r.warnings.length === 0);
  t('snapshot มูลค่ารวม 0 error', throwsWith(snapshot, { holdings: [{ name: 'A', value: 0 }] }, 'มูลค่ารวม'));
  t('snapshot shares ติดลบ error', throwsWith(snapshot, { holdings: [{ name: 'A', shares: -1, price: 10 }] }, 'shares'));
  t('snapshot ไม่มี value error', throwsWith(snapshot, { holdings: [{ name: 'A' }] }, 'value'));
  t('snapshot startValue 0 error', throwsWith(snapshot, { startValue: 0, holdings: [{ name: 'A', value: 1 }] }, 'startValue'));

  // rebalance-and-dca worked example: deviation 10.9 · 20 months > 12 · DCA 20,000 → 10 months
  const dr = { holdings: { Equity: 780000, Bonds: 320000 }, target: { Equity: 60, Bonds: 40 }, monthlyDca: 10000 };
  r = drift(dr);
  t('drift ส่วนเบี่ยง 10.9', r.rows[0].deviation.toFixed(1) === '10.9' && r.rows[1].deviation.toFixed(1) === '-10.9');
  t('drift ช่อง 120,000', near(r.rows[1].gap, 120000) && near(r.rows[0].gap, -120000));
  t('drift 20 เดือน เกิน N', r.months === 20 && r.closeWith === 'Bonds' && r.verdict === 'offer-switch');
  r = drift({ ...dr, monthlyDca: 20000 });
  t('drift DCA 20,000 = 10 เดือน', r.months === 10 && r.verdict === 'dca');
  t('drift ในกรอบ', drift({ ...dr, holdings: { Equity: 640000, Bonds: 460000 } }).verdict === 'within-band');
  t('drift DCA 0 ปิดไม่ได้', drift({ ...dr, monthlyDca: 0 }).months === null);
  t('drift target ไม่ครบ 100 error', throwsWith(drift, { ...dr, target: { Equity: 60, Bonds: 30 } }, 'รวม 100'));
  t('drift DCA ติดลบ error', throwsWith(drift, { ...dr, monthlyDca: -1 }, 'monthlyDca'));
  t('drift ชื่อไม่ตรง error', throwsWith(drift, { ...dr, holdings: { Equity: 1, Gold: 1 } }, 'Gold'));

  // dividend-tracker worked example: 2,000 × 0.80 = 1,600 · 160 · 1,440 · trailing 4.5%
  r = dividend({ holdings: [{ symbol: 'ABC', shares: 2000, dps: 0.8, price: 40, dps12m: 1.8 }] });
  t('dividend 1,600/160/1,440', near(r.gross, 1600) && near(r.tax, 160) && near(r.net, 1440));
  t('dividend yield 4.5%', near(r.rows[0].trailingYield, 4.5));
  t('dividend 0 หุ้น = 0', dividend({ holdings: [{ symbol: 'X', shares: 0, dps: 1 }] }).net === 0);
  t('dividend ต่างประเทศไม่ใส่อัตรา error', throwsWith(dividend, { holdings: [{ symbol: 'X', shares: 1, dps: 1, source: 'foreign' }] }, 'withholdingPct'));
  t('dividend dps ติดลบ error', throwsWith(dividend, { holdings: [{ symbol: 'X', shares: 1, dps: -1 }] }, 'dps'));
  t('dividend ประมาณการติดป้าย', dividend({ holdings: [{ symbol: 'X', shares: 1, dps: 1, status: 'estimated' }] }).hasEstimates);

  // bonds-and-deposits formula: amount × rate × (1 − 0.15) × years · 500,000 at 1.80% for 3 years (the ออมพลัส example rate)
  r = afterTax({ options: [{ name: 'savings bond 3y', amount: 500000, ratePct: 1.8, years: 3 }] });
  t('afterTax 22,950', near(r.rows[0].net, 22950) && near(r.rows[0].tax, 4050) && near(r.rows[0].netRatePct, 1.53));
  t('afterTax อัตรา 0 = 0', afterTax({ options: [{ amount: 1, ratePct: 0, years: 1 }] }).rows[0].net === 0);
  t('afterTax เงินต้น 0 error', throwsWith(afterTax, { options: [{ amount: 0, ratePct: 1, years: 1 }] }, 'amount'));
  t('afterTax อัตราติดลบ error', throwsWith(afterTax, { options: [{ amount: 1, ratePct: -1, years: 1 }] }, 'ratePct'));

  // mutual-fund-picker fee drag: 100,000 · 25 years · 7% → ≈506,000 / ≈355,000 · gap ≈151,000 (≈30%)
  r = fee({ amount: 100000, years: 25, grossReturnPct: 7, funds: [{ name: 'Index', terPct: 0.3 }, { name: 'Active', terPct: 1.8 }] });
  t('fee 506,000', Math.round(r.rows[0].value / 1000) === 506);
  t('fee 355,000', Math.round(r.rows[1].value / 1000) === 355);
  t('fee ต่าง ≈151,000 ≈30%', Math.round(r.rows[1].lostVsBest / 1000) === 151 && Math.round(r.rows[1].lostPctOfBest) === 30);
  t('fee TER 0 = ทบต้นเต็ม', near(fee({ amount: 100, years: 1, grossReturnPct: 10, funds: [{ terPct: 0 }] }).rows[0].value, 110));
  t('fee TER ติดลบ error', throwsWith(fee, { amount: 1, years: 1, grossReturnPct: 7, funds: [{ name: 'X', terPct: -1 }] }, 'terPct'));
  t('fee years 0 error', throwsWith(fee, { amount: 1, years: 0, grossReturnPct: 7, funds: [{ terPct: 1 }] }, 'years'));

  console.log(`self-test: ${ok} ผ่าน ${bad} ล้ม`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const [cmd, file] = args.filter((a) => !a.startsWith('--'));
  if (!COMMANDS[cmd] || !file) { console.error(`ใช้: node money-calc.mjs <${Object.keys(COMMANDS).join('|')}> <ไฟล์.json> [--json] | --self-test`); process.exit(2); }
  try {
    const r = COMMANDS[cmd](JSON.parse(readFileSync(file, 'utf8')));
    console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(cmd, r));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
