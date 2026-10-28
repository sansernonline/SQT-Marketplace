#!/usr/bin/env node
// power-bill.mjs - electricity bill from units, and why it changed between 2 months (Node stdlib only)
// Usage: node power-bill.mjs <file.json> [--json]   |   node power-bill.mjs --history <file.json> [--json]   |   node power-bill.mjs --self-test
// History file: { "months": [ { "label": "ก.พ.", "units": 305 }, ... 4 months, oldest first ] } - latest month vs the average of the 3 before it
// File: { "tiers": [ { "upTo": 150, "rate": 3.0 }, { "upTo": null, "rate": 5.0 } ], "service": 25, "months": [ { "label": "เม.ย.", "units": 330, "ft": 39.72 } ] }
// tiers = baht/unit, upTo = cumulative units (last one null). ft = satang/unit (optional, default from rates.json). Bill = (energy + service + ft x units) x 1.07
import { readFileSync } from 'node:fs';

const RATES = JSON.parse(readFileSync(new URL('./rates.json', import.meta.url), 'utf8'));

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

function num(v, label, min) {
  if (!isNum(v) || v < min) throw new Error(`ช่อง ${label} ต้องเป็นตัวเลขตั้งแต่ ${min} (ได้ ${JSON.stringify(v)})`);
}

// Fills defaults from rates.json, throws a Thai message naming the bad field; returns the clean input.
export function validate(input) {
  if (!input || typeof input !== 'object') throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  const tiers = input.tiers ?? RATES.tiers;
  const service = input.service ?? RATES.service;
  if (!Array.isArray(tiers) || tiers.length === 0) throw new Error(`ช่อง tiers ต้องเป็นรายการขั้นบันไดอย่างน้อย 1 ขั้น · ${RATES.missing}`);
  if (service === null || service === undefined) throw new Error(`ช่อง service (ค่าบริการ บาท) หายไป · ${RATES.missing}`);
  num(service, 'service', 0);
  let prev = 0;
  tiers.forEach((t, i) => {
    num(t?.rate, `tiers[${i}].rate`, 0);
    const last = i === tiers.length - 1;
    if (last ? t.upTo !== null : !isNum(t.upTo) || t.upTo <= prev) throw new Error(`ช่อง tiers[${i}].upTo ${last ? 'ของขั้นสุดท้ายต้องเป็น null' : `ต้องเป็นตัวเลขมากกว่าขั้นก่อน (${prev})`} (ได้ ${JSON.stringify(t?.upTo)})`);
    prev = t.upTo;
  });
  if (!Array.isArray(input.months) || input.months.length < 1 || input.months.length > 2) throw new Error('ช่อง months ต้องมี 1 เดือน (คิดบิล) หรือ 2 เดือน (เทียบ)');
  const defaultFt = input.ft ?? RATES.ftSatang;
  const months = input.months.map((m, i) => {
    num(m?.units, `months[${i}].units`, 0);
    const ft = m.ft ?? defaultFt;
    if (!isNum(ft)) throw new Error(`ช่อง months[${i}].ft ต้องเป็นตัวเลข สตางค์/หน่วย (ได้ ${JSON.stringify(ft)})`);
    return { label: m.label ?? `เดือนที่ ${i + 1}`, units: m.units, ft };
  });
  return { tiers, service, months };
}

function energyCharge(units, tiers) {
  let from = 0;
  let sum = 0;
  for (const t of tiers) {
    const top = t.upTo ?? Infinity;
    if (units > from) sum += (Math.min(units, top) - from) * t.rate;
    from = top;
  }
  return sum;
}

function topTier(units, tiers) {
  return tiers.findIndex((t) => t.upTo === null || units <= t.upTo) + 1;
}

export function bill({ units, ft }, { tiers, service }, vatRate = RATES.vat) {
  const energy = energyCharge(units, tiers);
  const ftCharge = (ft / 100) * units;
  const beforeVat = energy + service + ftCharge;
  const vat = beforeVat * vatRate;
  return { units, ft, tier: topTier(units, tiers), energy, service, ftCharge, vat, total: beforeVat + vat };
}

// Splits (bill2 - bill1) into: more units at month-1 average rate · tier shift · Ft change. Each includes its VAT, so the three add up to the difference.
export function explain(a, b, vatRate = RATES.vat) {
  const k = 1 + vatRate;
  const ft = ((b.ft - a.ft) / 100) * b.units * k;
  // month 1 with 0 units has no average rate: everything except Ft counts as more units, no tier split
  if (a.units === 0) return { diff: b.total - a.total, units: b.total - a.total - ft, tier: 0, ft };
  const avg = (a.energy + (a.ft / 100) * a.units) / a.units;
  const parts = {
    units: (b.units - a.units) * avg * k,
    tier: (b.energy - a.energy - ((b.units - a.units) * a.energy) / a.units) * k,
    ft,
  };
  return { diff: b.total - a.total, ...parts };
}

// Latest month vs the average units of the 3 months before it. Flags when it is MORE than RATES.spikePct above (equal is not a spike).
export function spike(raw, thresholdPct = RATES.spikePct) {
  if (!Array.isArray(raw?.months) || raw.months.length !== 4) throw new Error('ช่อง months ต้องมี 4 เดือนพอดี เรียงจากเก่าไปใหม่ (3 เดือนก่อนหน้า + เดือนที่จะเช็ก)');
  raw.months.forEach((m, i) => num(m?.units, `months[${i}].units`, 0));
  const [a, b, c, latest] = raw.months;
  const avg = (a.units + b.units + c.units) / 3;
  if (avg === 0) throw new Error('ค่าเฉลี่ย 3 เดือนก่อนหน้าเป็น 0 หน่วย คิดเปอร์เซ็นต์ไม่ได้ · ตรวจว่าเดือนเหล่านั้นไม่ได้กรอกหน่วยเป็น 0 ผิดช่อง');
  const pct = ((latest.units - avg) / avg) * 100;
  return { label: latest.label ?? 'เดือนล่าสุด', units: latest.units, avg, pct, thresholdPct, spike: pct > thresholdPct };
}

export function spikeReport(r) {
  return [
    `| เดือน | หน่วย | ค่าเฉลี่ย 3 เดือนก่อนหน้า | ต่างจากค่าเฉลี่ย | เกณฑ์ | ผล |`,
    `|---|---|---|---|---|---|`,
    `| ${r.label} | ${fmt(r.units)} | ${fmt(r.avg)} | ${sign(r.pct)}% | เกิน ${r.thresholdPct}% | ${r.spike ? 'สูงผิดปกติ ทำรายการตรวจสาเหตุ' : 'ไม่เกินเกณฑ์'} |`,
    '',
    `เกณฑ์ ${r.thresholdPct}% เป็นค่าตั้งต้น ยังไม่ได้วัด (ตั้งใน rates.json ช่อง spikePct) · เทียบเป็นหน่วย ไม่ใช่บาท`,
  ].join('\n');
}

export function compute(raw) {
  const input = validate(raw);
  const bills = input.months.map((m) => bill(m, input));
  const why = bills.length === 2 ? explain(bills[0], bills[1]) : null;
  return { bills: bills.map((b, i) => ({ label: input.months[i].label, ...b })), why };
}

const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sign = (n) => (n >= 0 ? '+' : '-') + fmt(Math.abs(n));

export function report(r) {
  const rows = r.bills.map((b) => `| ${b.label} | ${fmt(b.units)} | ขั้นที่ ${b.tier} | ${fmt(b.energy)} | ${fmt(b.service)} | ${fmt(b.ftCharge)} (${b.ft} สต.) | ${fmt(b.vat)} | ${fmt(b.total)} |`);
  const out = [
    '| เดือน | หน่วย | ขั้นสูงสุดที่ถึง | ค่าพลังงาน | ค่าบริการ | ค่า Ft | VAT 7% | รวม (บาท) |',
    '|---|---|---|---|---|---|---|---|',
    ...rows,
  ];
  if (r.why) {
    const [a, b] = r.bills;
    const w = r.why;
    out.push(
      '',
      `**ส่วนต่าง ${b.label} − ${a.label}: ${sign(w.diff)} บาท (รวม VAT)**`,
      `- หน่วยที่เพิ่ม (${sign(b.units - a.units)} หน่วย ที่อัตราเฉลี่ยเดือน${a.label}): ${sign(w.units)}`,
      a.units === 0 ? "- ขั้นบันไดที่ขยับ: แยกไม่ได้ เพราะเดือนแรกใช้ 0 หน่วย จึงรวมอยู่ในหน่วยที่เพิ่ม" : `- ขั้นบันไดที่ขยับ (ขั้นที่ ${a.tier} → ${b.tier}): ${sign(w.tier)}`,
      `- ค่า Ft เปลี่ยน (${a.ft} → ${b.ft} สต./หน่วย): ${sign(w.ft)}`,
    );
  }
  out.push('', `ผลคิดจากอัตราที่ผู้ใช้ใส่ · ค่า Ft ตั้งต้น ${RATES.ftSatang} สต./หน่วย งวด ${RATES.ftPeriod} (ตรวจ ${RATES.checked}) · ยืนยันกับบิลจริงของ กฟน./กฟภ. ก่อนตัดสินใจ`);
  return out.join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, b) => Math.abs(a - b) < 0.005;
  // by hand: 100 units at 2, rest at 4, service 20, Ft 10 satang
  const tariff = { tiers: [{ upTo: 100, rate: 2 }, { upTo: null, rate: 4 }], service: 20 };
  // 150 units: energy 200+200=400 · Ft 15 · sum 435 · VAT 30.45 · total 465.45
  let r = compute({ ...tariff, months: [{ units: 150, ft: 10 }] });
  t('150 หน่วย ค่าพลังงาน 400', near(r.bills[0].energy, 400));
  t('150 หน่วย รวม 465.45', near(r.bills[0].total, 465.45) && near(r.bills[0].vat, 30.45));
  // 250 units: energy 200+600=800 · Ft 25 · sum 845 · total 904.15 · diff 438.70 = units 276.67 + tier 133.33 (x1.07)
  r = compute({ ...tariff, months: [{ units: 150, ft: 10 }, { units: 250, ft: 10 }] });
  t('250 หน่วย รวม 904.15', near(r.bills[1].total, 904.15));
  t('ส่วนต่าง 438.70', near(r.why.diff, 438.7));
  t('หน่วยเพิ่ม 296.03', near(r.why.units, 276.6667 * 1.07));
  t('ขั้นบันได 142.67', near(r.why.tier, 133.3333 * 1.07));
  t('Ft ไม่เปลี่ยน = 0', near(r.why.ft, 0));
  t('3 ส่วนรวมเท่าส่วนต่าง', near(r.why.units + r.why.tier + r.why.ft, r.why.diff));
  // same units, Ft 10 -> 20: 150 x 0.10 = 15 baht x 1.07 = 16.05
  r = compute({ ...tariff, months: [{ units: 150, ft: 10 }, { units: 150, ft: 20 }] });
  t('Ft อย่างเดียว 16.05', near(r.why.ft, 16.05) && near(r.why.diff, 16.05) && near(r.why.units, 0) && near(r.why.tier, 0));
  // all units in tier 1 -> no tier shift. 40 -> 80 units: avg (80+4)/40 = 2.1 x 40 = 84 x 1.07 = 89.88
  r = compute({ ...tariff, months: [{ units: 40, ft: 10 }, { units: 80, ft: 10 }] });
  t('ไม่ข้ามขั้น tier 0', near(r.why.tier, 0) && near(r.why.units, 89.88));
  // 0 units: bill is service + VAT = 20 x 1.07 = 21.40 · compare 0 -> 150 keeps the split without dividing by zero: diff 465.45 - 21.40 = 444.05
  r = compute({ ...tariff, months: [{ units: 0, ft: 10 }, { units: 150, ft: 10 }] });
  t('0 หน่วย คิดบิล 21.40', near(r.bills[0].total, 21.4));
  t('0 -> 150 ไม่หารศูนย์', near(r.why.diff, 444.05) && near(r.why.units, 444.05) && near(r.why.tier, 0) && near(r.why.ft, 0));
  // Ft falls back to rates.json (16.23 satang): 100 units = 16.23
  r = compute({ ...tariff, months: [{ units: 100 }] });
  t('ft ค่าตั้งต้นจาก rates.json', near(r.bills[0].ftCharge, 16.23));
  t('report มีส่วนต่าง', report(compute({ ...tariff, months: [{ units: 150, ft: 10 }, { units: 250, ft: 10 }] })).includes('+438.70'));
  const throwsWith = (inp, word, fn = compute) => { try { fn(inp); return false; } catch (e) { return e.message.includes(word); } };
  const M = [{ units: 100, ft: 10 }];
  t('ไม่มี tiers/service ใน input', throwsWith({ months: M }, 'tiers'));
  t('ไม่มี service', throwsWith({ tiers: tariff.tiers, months: M }, 'service'));
  t('ขั้นสุดท้ายต้อง null', throwsWith({ ...tariff, tiers: [{ upTo: 100, rate: 2 }], months: M }, 'null'));
  t('upTo ไม่เรียง', throwsWith({ ...tariff, tiers: [{ upTo: 100, rate: 2 }, { upTo: 50, rate: 3 }, { upTo: null, rate: 4 }], months: M }, 'tiers[1].upTo'));
  t('units เป็นข้อความ', throwsWith({ ...tariff, months: [{ units: '100' }] }, 'units'));
  t('months 3 เดือน', throwsWith({ ...tariff, months: [...M, ...M, ...M] }, 'months'));
  // spike: 3 months 300 each -> avg 300; 360 = +20% exactly (not a spike), 361 is, 240 is below, 0 avg refused
  const H = (u) => spike({ months: [300, 300, 300, u].map((units) => ({ units })) }, 20);
  t('เท่ากับเกณฑ์ 20% ไม่ใช่ spike', near(H(360).pct, 20) && H(360).spike === false);
  t('เกินเกณฑ์ 361 หน่วย เป็น spike', H(361).spike === true);
  t('ต่ำกว่าค่าเฉลี่ย ไม่ spike', near(H(240).pct, -20) && H(240).spike === false);
  t('ค่าเฉลี่ยจาก 3 เดือนก่อน', near(spike({ months: [{ units: 100 }, { units: 200 }, { units: 300 }, { units: 400 }] }, 20).avg, 200));
  t('ข้อมูลไม่ครบ 3 เดือน', throwsWith({ months: [{ units: 1 }, { units: 2 }, { units: 3 }] }, 'ช่อง months', spike));
  t('ค่าเฉลี่ย 0 ปฏิเสธ', throwsWith({ months: [0, 0, 0, 50].map((units) => ({ units })) }, 'เป็น 0', spike));
  t('หน่วยติดลบ', throwsWith({ months: [300, 300, -1, 50].map((units) => ({ units })) }, 'units', spike));
  t('spikeReport มีผล', spikeReport(H(400)).includes('สูงผิดปกติ'));
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('ใช้: node power-bill.mjs <ไฟล์.json> [--json] | --history <ไฟล์.json> | --self-test'); process.exit(2); }
  try {
    const data = JSON.parse(readFileSync(file, 'utf8'));
    const history = args.includes('--history');
    const r = history ? spike(data) : compute(data);
    console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : (history ? spikeReport : report)(r));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
