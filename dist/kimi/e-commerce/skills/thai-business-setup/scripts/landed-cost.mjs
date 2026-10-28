#!/usr/bin/env node
// landed-cost.mjs - ต้นทุนนำเข้าจากจีนถึงร้านต่อชิ้น: CIF · อากร · VAT · ค่าชิปปิ้ง (Node stdlib only)
// Usage: node landed-cost.mjs <file.json> [--json]   |   node landed-cost.mjs --self-test
// File: { "qty": 200, "goods_cny": 5000, "fx_thb_per_cny": 5.0, "cn_shipping_cny": 100, "freight_thb": 2400,
//   "insurance_pct": 1, "duty_pct": 20, "excise_thb": 0, "other_tax_thb": 0, "broker_thb": 1000, "th_delivery_thb": 300 }
// insurance_pct คิดจากค่าสินค้าเป็นบาท · duty_pct ตามพิกัดสินค้า (ค้นทุกครั้ง ไม่มีค่าตั้งต้น) · excise_thb และ other_tax_thb ไม่บังคับ
// สูตรตาม thai-business-setup/SKILL.md หัวข้อ 5 · อัตรา VAT อ่านจาก rates.json ข้างไฟล์นี้ พร้อมวันที่ตรวจ
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const RATES_FILE = join(dirname(fileURLToPath(import.meta.url)), 'rates.json');
export const loadRates = () => JSON.parse(readFileSync(RATES_FILE, 'utf8'));
// VAT เปลี่ยนตาม พ.ร.ฎ. ราวปีละครั้ง · 90 วันเป็นค่าตั้งต้น ยังไม่ได้วัด
const RATES_MAX_AGE_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

const round2 = (n) => Math.round(Number((n * 100).toPrecision(12))) / 100;

export function validate(input) {
  const num = (k, { required = true, positive = false } = {}) => {
    const v = input[k];
    if (v === undefined && !required) return;
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || (positive && v === 0)) {
      throw new Error(`ช่อง ${k} ต้องเป็นตัวเลข${positive ? 'มากกว่า 0' : 'ตั้งแต่ 0'} (ได้ ${JSON.stringify(v)})`);
    }
  };
  if (!input || typeof input !== 'object') throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  num('qty', { positive: true });
  if (!Number.isInteger(input.qty)) throw new Error(`ช่อง qty ต้องเป็นจำนวนเต็ม (ได้ ${input.qty})`);
  num('goods_cny', { positive: true });
  num('fx_thb_per_cny', { positive: true });
  for (const k of ['cn_shipping_cny', 'freight_thb', 'duty_pct', 'broker_thb', 'th_delivery_thb']) num(k);
  for (const k of ['insurance_pct', 'excise_thb', 'other_tax_thb']) num(k, { required: false });
  const warnings = [];
  if (input.insurance_pct === undefined) warnings.push('ไม่ได้ใส่ insurance_pct · คิดค่าประกันภัยเป็น 0 · ถามชิปปิ้งว่าราคารวมประกันไหม');
  if (input.duty_pct > 0 && input.duty_pct < 1) warnings.push(`duty_pct = ${input.duty_pct} น้อยกว่า 1 · ใส่เป็น % (20 ไม่ใช่ 0.2)`);
  if (input.fx_thb_per_cny < 1 || input.fx_thb_per_cny > 20) warnings.push(`fx_thb_per_cny = ${input.fx_thb_per_cny} ดูผิดปกติ · ใส่เป็นบาทต่อ 1 หยวน ตามอัตราวันจ่ายเงินจริง`);
  return warnings;
}

export function calc(input, rates = loadRates(), today = new Date()) {
  const warnings = validate(input);
  const age = Math.floor((today - new Date(`${rates.checked}T00:00:00Z`)) / DAY_MS);
  if (age > RATES_MAX_AGE_DAYS) warnings.push(`อัตรา VAT ใน rates.json ตรวจล่าสุด ${rates.checked} (${age} วันก่อน) · เทียบกับ rd.go.th แล้วแก้ rates.json`);
  if (today > new Date(`${rates.vat_pct_valid_until}T23:59:59Z`)) warnings.push(`VAT ${rates.vat_pct}% ใช้ถึง ${rates.vat_pct_valid_until} ซึ่งผ่านมาแล้ว · หา พ.ร.ฎ. ฉบับใหม่แล้วแก้ rates.json`);

  const fx = input.fx_thb_per_cny;
  const goods = round2(input.goods_cny * fx);
  const cnShipping = round2(input.cn_shipping_cny * fx);
  const freight = round2(input.freight_thb);
  const insurance = round2((goods * (input.insurance_pct ?? 0)) / 100);
  const cif = round2(goods + cnShipping + freight + insurance);
  const duty = round2((cif * input.duty_pct) / 100);
  const excise = round2(input.excise_thb ?? 0);
  const otherTax = round2(input.other_tax_thb ?? 0);
  const vat = round2(((cif + duty + excise + otherTax) * rates.vat_pct) / 100);
  const total = round2(cif + duty + excise + otherTax + vat + input.broker_thb + input.th_delivery_thb);
  const lines = [
    ['ค่าสินค้า', `${input.goods_cny} × ${fx}`, goods],
    ['ค่าส่งในจีน', `${input.cn_shipping_cny} × ${fx}`, cnShipping],
    ['ค่าขนส่งจีนถึงไทย', '', freight],
    ['ค่าประกันภัย', `${goods} × ${input.insurance_pct ?? 0}%`, insurance],
    ['**CIF**', 'รวม 4 บรรทัดบน', cif],
    ['อากรขาเข้า', `${cif} × ${input.duty_pct}%`, duty],
    ...(excise ? [['ภาษีสรรพสามิต', '', excise]] : []),
    ...(otherTax ? [['ภาษีอื่น', '', otherTax]] : []),
    ['VAT', `(CIF + อากร${excise ? ' + สรรพสามิต' : ''}${otherTax ? ' + ภาษีอื่น' : ''}) × ${rates.vat_pct}%`, vat],
    ['ค่าบริการชิปปิ้งและพิธีการ', '', round2(input.broker_thb)],
    ['ค่าส่งในไทย', '', round2(input.th_delivery_thb)],
    ['**รวมจ่ายจริง**', '', total],
  ];
  return {
    rates: { checked: rates.checked, vat_pct: rates.vat_pct }, lines, cif, duty, vat, total,
    per_unit_no_vat_reg: round2(total / input.qty),
    // จด VAT และนำเข้าในชื่อตัวเอง: VAT ตอนนำเข้าเป็นภาษีซื้อ ไม่นับเป็นต้นทุน
    per_unit_vat_reg: round2((total - vat) / input.qty),
    warnings,
  };
}

const baht = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function report(r, qty) {
  return [
    `อัตรา VAT ${r.rates.vat_pct}% ตรวจล่าสุด ${r.rates.checked} (rates.json) · อัตราอากรมาจาก input ตรวจพิกัดจริงที่กรมศุลกากร`,
    ...r.warnings.map((w) => `คำเตือน: ${w}`),
    '',
    '| บรรทัด | วิธีคิด | บาท |', '|---|---|---|',
    ...r.lines.map(([k, how, v]) => `| ${k} | ${how} | ${baht(v)} |`),
    `| **ต้นทุนต่อชิ้น (ยังไม่จด VAT)** | ${baht(r.total)} ÷ ${qty} | **${baht(r.per_unit_no_vat_reg)}** |`,
    `| ต้นทุนต่อชิ้น (จด VAT และนำเข้าในชื่อตัวเอง) | (${baht(r.total)} − ${baht(r.vat)}) ÷ ${qty} | ${baht(r.per_unit_vat_reg)} |`,
    '',
    'เอาต้นทุนต่อชิ้นไปตั้งราคาขายด้วย marketplace-fees-pricing · ข้อมูลประกอบ ไม่ใช่คำแนะนำด้านภาษีหรือศุลกากร',
  ].join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const rates = loadRates();
  const FRESH = new Date(`${rates.checked}T00:00:00Z`);
  const base = { qty: 200, goods_cny: 5000, fx_thb_per_cny: 5, cn_shipping_cny: 100, freight_thb: 2400, insurance_pct: 1, duty_pct: 20, broker_thb: 1000, th_delivery_thb: 300 };
  const run = (x = {}) => calc({ ...base, ...x }, rates, FRESH);
  // SKILL.md หัวข้อ 5: 28,150 · 5,630 · 2,364.60 · 37,444.60 · 187.22 · 175.40
  let r = run();
  t('SKILL CIF 28,150', r.cif === 28150);
  t('SKILL อากร 5,630', r.duty === 5630);
  t('SKILL VAT 2,364.60', r.vat === 2364.6);
  t('SKILL รวม 37,444.60', r.total === 37444.6);
  t('SKILL ต่อชิ้น 187.22 และ 175.40', r.per_unit_no_vat_reg === 187.22 && r.per_unit_vat_reg === 175.4);
  t('SKILL ไม่มีคำเตือน', r.warnings.length === 0);
  // อากร 0% (เช่นใช้ Form E ได้): VAT จาก CIF อย่างเดียว
  r = run({ duty_pct: 0 });
  t('อากร 0% VAT = CIF × 7%', r.duty === 0 && r.vat === 1970.5);
  // ไม่ใส่ประกัน: เตือนและคิด 0
  const { insurance_pct, ...noIns } = base;
  r = calc(noIns, rates, FRESH);
  t('ไม่ใส่ประกัน CIF 27,900 และเตือน', r.cif === 27900 && r.warnings.length === 1);
  // สรรพสามิตเข้าฐาน VAT
  r = run({ excise_thb: 1000 });
  t('สรรพสามิตเข้าฐาน VAT', r.vat === round2((28150 + 5630 + 1000) * 0.07));
  // ค่าขอบ
  const throwsWith = (x, word) => { try { run(x); return false; } catch (e) { return e.message.includes(word); } };
  t('qty 0', throwsWith({ qty: 0 }, 'qty'));
  t('qty ทศนิยม', throwsWith({ qty: 1.5 }, 'qty'));
  t('ไม่ใส่ duty_pct', throwsWith({ duty_pct: undefined }, 'duty_pct'));
  t('fx เป็นข้อความ', throwsWith({ fx_thb_per_cny: '5' }, 'fx_thb_per_cny'));
  t('duty 0.2 เตือน', run({ duty_pct: 0.2 }).warnings.some((w) => w.includes('duty_pct')));
  t('fx 0.2 เตือน', run({ fx_thb_per_cny: 0.2 }).warnings.some((w) => w.includes('fx')));
  t('rates.json 91 วันเตือน', calc(base, rates, new Date(FRESH.getTime() + 91 * DAY_MS)).warnings.length === 1);
  t('เลยวันสิ้นสุด VAT 7% เตือน', calc(base, rates, new Date('2027-10-01T00:00:00Z')).warnings.some((w) => w.includes('ผ่านมาแล้ว')));
  // rates.json ตรงกับ facts.json (มีเฉพาะใน repo · ข้ามเมื่อยังไม่มีรายการ vat-rate)
  try {
    const fact = JSON.parse(readFileSync(join(dirname(RATES_FILE), '..', '..', '..', '..', '..', 'scripts', 'check', 'facts.json'), 'utf8')).facts['vat-rate'];
    if (fact) t('VAT ตรง facts.json vat-rate', `${rates.vat_pct}%` === fact.value);
  } catch (err) { if (err.code !== 'ENOENT') throw err; }
  t('รายงานมีต้นทุนต่อชิ้น', report(run(), 200).includes('187.22'));
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) selfTest();
  else {
    const file = args.find((a) => !a.startsWith('--'));
    if (!file) { console.error('ใช้: node landed-cost.mjs <ไฟล์.json> [--json] | --self-test'); process.exit(2); }
    try {
      const input = JSON.parse(readFileSync(file, 'utf8'));
      const r = calc(input);
      console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(r, input.qty));
    } catch (e) {
      console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
      process.exit(1);
    }
  }
}
