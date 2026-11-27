#!/usr/bin/env node
// thai-doc-total.mjs - totals for a Thai quotation / invoice: VAT, withholding tax, net payment, amount in Thai words (Node stdlib only)
// Usage: node thai-doc-total.mjs <file.json> [--json]   |   node thai-doc-total.mjs --self-test
// File: { "items": [ { "name": "ค่าบริการ", "qty": 1, "price": 50000, "discount": 0 } ],
//         "vatMode": "exclusive", "vatRate": 7, "whtRate": 3, "sellerTaxId": "...", "buyerTaxId": "..." }
// vatMode: exclusive = prices exclude VAT (default) · inclusive = prices include VAT · none = seller not VAT-registered (no VAT shown)
// discount = baht off that line. Optional fields: vatMode, vatRate, whtRate (default 0), discount, sellerTaxId, buyerTaxId.
// Rules from doc-quotation/SKILL.md section 4: VAT is rounded once per document (not per line); withholding tax is on the amount before VAT.
// All money is counted in whole satang (integers) so 2-decimal rounding happens once per step, half up.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

// Default VAT rate lives in rates.json next to this file, with the date it was checked and the date the reduced rate ends.
const RATES_FILE = join(dirname(fileURLToPath(import.meta.url)), 'rates.json');
export const loadRates = () => JSON.parse(readFileSync(RATES_FILE, 'utf8'));
// The VAT rate changes about once a year by royal decree · 90 days is a starting value, not measured
const RATES_MAX_AGE_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;
// toSatang keeps 12 significant digits, so satang stay exact only up to 12 digits; larger amounts also need ล้านล้าน in words
const MAX_TOTAL_SATANG = 999999999999; // 9,999,999,999.99 baht
const VAT_MODES = ['exclusive', 'inclusive', 'none'];
const SATANG_PER_BAHT = 100;

// Copy of isValidThaiId; the original is e-tax-invoice/scripts/thai-id.mjs (skills may be installed apart, so no cross-skill import)
function isValidThaiId(value) {
  const id = String(value ?? '').replace(/[\s-]/g, '');
  if (!/^\d{13}$/.test(id)) return false;
  const sum = [...id.slice(0, 12)].reduce((s, d, i) => s + Number(d) * (13 - i), 0);
  return (11 - (sum % 11)) % 10 === Number(id[12]);
}

// Round to whole satang, ignoring float noise such as 14.499999999999998
const toSatang = (baht) => Math.round(Number((baht * SATANG_PER_BAHT).toPrecision(12)));
const roundHalfUp = (x) => Math.round(Number(x.toPrecision(12)));

const DIGITS = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const PLACES = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];

// n < 1,000,000. hasHigher = a millions part sits before it (1,000,001 = หนึ่งล้านเอ็ด)
function belowMillion(n, hasHigher) {
  const digits = String(n).split('').map(Number);
  return digits.map((d, i) => {
    const place = digits.length - 1 - i;
    if (d === 0) return '';
    if (place === 0) return d === 1 && (n > 1 || hasHigher) ? 'เอ็ด' : DIGITS[d];
    if (place === 1) return (d === 1 ? '' : d === 2 ? 'ยี่' : DIGITS[d]) + PLACES[1];
    return DIGITS[d] + PLACES[place];
  }).join('');
}

function integerToThai(n) {
  if (n === 0) return DIGITS[0];
  const millions = Math.floor(n / 1e6);
  const rest = n % 1e6;
  return (millions ? integerToThai(millions) + 'ล้าน' : '') + (rest ? belowMillion(rest, millions > 0) : '');
}

// Amount in whole satang -> Thai words: "...บาทถ้วน" or "...บาท...สตางค์"
export function bahtText(satang) {
  const baht = Math.floor(satang / SATANG_PER_BAHT);
  const rest = satang % SATANG_PER_BAHT;
  if (rest === 0) return `${integerToThai(baht)}บาทถ้วน`;
  return `${baht ? `${integerToThai(baht)}บาท` : ''}${integerToThai(rest)}สตางค์`;
}

// Throws a Thai message naming the bad field; returns warnings (list of strings).
export function validate(input) {
  const num = (v, label, min, strict) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || (strict ? v <= min : v < min)) throw new Error(`ช่อง ${label} ต้องเป็นตัวเลข${strict ? 'มากกว่า' : 'ตั้งแต่'} ${min} (ได้ ${JSON.stringify(v)})`);
  };
  if (!input || typeof input !== 'object') throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  if (!Array.isArray(input.items) || input.items.length === 0) throw new Error('ช่อง items ต้องเป็นรายการสินค้าอย่างน้อย 1 รายการ');
  input.items.forEach((it, i) => {
    num(it?.qty, `items[${i}].qty`, 0, true);
    num(it?.price, `items[${i}].price`, 0, false);
    if (it.discount !== undefined) {
      num(it.discount, `items[${i}].discount`, 0, false);
      if (it.discount > it.qty * it.price) throw new Error(`ช่อง items[${i}].discount (${it.discount}) มากกว่ายอดรายการ ${it.qty * it.price}`);
    }
  });
  if (input.vatMode !== undefined && !VAT_MODES.includes(input.vatMode)) throw new Error(`ช่อง vatMode ต้องเป็น ${VAT_MODES.join(' · ')} (ได้ ${JSON.stringify(input.vatMode)})`);
  if (input.vatRate !== undefined) num(input.vatRate, 'vatRate', 0, false);
  if (input.whtRate !== undefined) {
    num(input.whtRate, 'whtRate', 0, false);
    if (input.whtRate > 100) throw new Error(`ช่อง whtRate ต้องไม่เกิน 100 (ได้ ${input.whtRate})`);
  }
  const warnings = [];
  for (const [key, label] of [['sellerTaxId', 'ผู้ขาย'], ['buyerTaxId', 'ผู้ซื้อ']]) {
    if (input[key] !== undefined && !isValidThaiId(input[key])) warnings.push(`เลขประจำตัวผู้เสียภาษี${label} (${key}) ไม่ผ่านการตรวจหลักสุดท้าย · ตรวจกับเอกสารจริง`);
  }
  if (input.vatMode === 'none' && input.vatRate !== undefined) warnings.push('vatMode เป็น none · ไม่คิด VAT จึงไม่ใช้ vatRate');
  return warnings;
}

// Returns satang for every step.
export function compute(input, rates = loadRates(), today = new Date()) {
  const warnings = validate(input);
  const mode = input.vatMode ?? 'exclusive';
  const vatRate = input.vatRate ?? rates.vat_pct;
  if (mode !== 'none' && input.vatRate === undefined) {
    const age = Math.floor((today - new Date(`${rates.checked}T00:00:00Z`)) / DAY_MS);
    if (age > RATES_MAX_AGE_DAYS) warnings.push(`อัตรา VAT ${rates.vat_pct}% ใน rates.json ตรวจล่าสุด ${rates.checked} (${age} วันก่อน) · เทียบกับ rd.go.th แล้วแก้ rates.json หรือใส่ vatRate เอง`);
    if (today > new Date(`${rates.vat_pct_valid_until}T23:59:59Z`)) warnings.push(`อัตรา VAT ${rates.vat_pct}% ใช้ถึง ${rates.vat_pct_valid_until} ซึ่งผ่านมาแล้ว · หา พ.ร.ฎ. ฉบับใหม่ที่ rd.go.th แล้วใส่ vatRate`);
  }
  const lines = input.items.map((it) => toSatang(it.qty * it.price) - toSatang(it.discount ?? 0));
  const subtotal = lines.reduce((s, x) => s + x, 0);
  let base = subtotal, vat = 0, total = subtotal;
  if (mode === 'exclusive') {
    vat = roundHalfUp((subtotal * vatRate) / 100);
    total = subtotal + vat;
  } else if (mode === 'inclusive') {
    base = roundHalfUp((subtotal * 100) / (100 + vatRate));
    vat = subtotal - base;
  }
  const wht = roundHalfUp((base * (input.whtRate ?? 0)) / 100);
  const net = total - wht;
  if (total > MAX_TOTAL_SATANG) throw new Error(`ยอดรวม ${total / SATANG_PER_BAHT} บาท เกินเพดาน 9,999,999,999.99 บาทที่สคริปต์อ่านเป็นตัวหนังสือได้ถูก · เช็ค qty และ price หรือแยกเป็นหลายเอกสาร`);
  return { lines, subtotal, base, vat, total, wht, net, totalText: bahtText(total), netText: bahtText(net), warnings };
}

const baht = (satang) => (satang / SATANG_PER_BAHT).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function report(input, r) {
  const mode = input.vatMode ?? 'exclusive';
  const vatRate = input.vatRate ?? loadRates().vat_pct;
  const rows = input.items.map((it, i) => `| ${it.name ?? `รายการที่ ${i + 1}`} | ${it.qty} × ${it.price}${it.discount ? ` − ${it.discount}` : ''} | ${baht(r.lines[i])} |`);
  const summary = [['รวมเป็นเงิน', r.subtotal]];
  if (mode === 'inclusive') summary.push([`มูลค่าก่อน VAT`, r.base]);
  if (mode !== 'none') summary.push([`ภาษีมูลค่าเพิ่ม ${vatRate}%${mode === 'inclusive' ? ' (รวมอยู่ในราคาแล้ว)' : ''}`, r.vat]);
  summary.push(['รวมทั้งสิ้น', r.total]);
  if (r.wht) summary.push([`หัก ภาษี ณ ที่จ่าย ${input.whtRate}% (คิดจากมูลค่าก่อน VAT ${baht(r.base)})`, -r.wht]);
  summary.push(['ยอดชำระสุทธิ', r.net]);
  return [
    ...r.warnings.map((w) => `คำเตือน: ${w}`),
    '| รายการ | จำนวน × ราคา | บาท |', '|---|---|---|', ...rows, '',
    '| ยอด | บาท |', '|---|---|', ...summary.map(([k, v]) => `| ${k} | ${baht(v)} |`), '',
    `รวมทั้งสิ้น: ${r.totalText}`,
    `ยอดชำระสุทธิ: ${r.netText}`,
  ].join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const item = (price, extra = {}) => ({ name: 'x', qty: 1, price, ...extra });
  // doc-quotation/SKILL.md section 4: 50,000 + VAT 3,500 = 53,500 · WHT 3% of 50,000 = 1,500 · net 52,000
  let r = compute({ items: [item(50000)], whtRate: 3 });
  t('SKILL: VAT 3,500', r.vat === 350000);
  t('SKILL: รวม 53,500 และหัก 1,500', r.total === 5350000 && r.wht === 150000);
  t('SKILL: สุทธิ 52,000', r.net === 5200000);
  t('SKILL: ตัวหนังสือรวม', r.totalText === 'ห้าหมื่นสามพันห้าร้อยบาทถ้วน');
  t('SKILL: ตัวหนังสือสุทธิ', r.netText === 'ห้าหมื่นสองพันบาทถ้วน');
  // promptpay-qr/SKILL.md section 4: 20,000 + 1,400 = 21,400 · WHT 600 · net 20,800
  r = compute({ items: [item(200, { qty: 100 })], whtRate: 3 });
  t('21,400 หัก 600 เหลือ 20,800', r.total === 2140000 && r.wht === 60000 && r.net === 2080000);
  // inclusive: 107 -> base 100, VAT 7
  r = compute({ items: [item(107)], vatMode: 'inclusive' });
  t('รวม VAT 107 = ฐาน 100 + VAT 7', r.base === 10000 && r.vat === 700 && r.total === 10700);
  r = compute({ items: [item(53500)], vatMode: 'inclusive', whtRate: 3 });
  t('รวม VAT หัก ณ ที่จ่ายจากฐานก่อน VAT', r.base === 5000000 && r.wht === 150000 && r.net === 5200000);
  r = compute({ items: [item(1000)], vatMode: 'none', whtRate: 3 });
  t('ไม่จด VAT ไม่มี VAT', r.vat === 0 && r.total === 100000 && r.net === 97000);
  // VAT rounded once per document: 3 lines of 0.50 -> subtotal 1.50 -> VAT 0.105 -> 0.11 (per line would be 3 x 0.04 = 0.12)
  r = compute({ items: [item(0.5), item(0.5), item(0.5)] });
  t('ปัด VAT ทั้งใบ ไม่ปัดรายบรรทัด', r.subtotal === 150 && r.vat === 11);
  r = compute({ items: [item(100, { qty: 3, discount: 50 })] });
  t('จำนวน × ราคา − ส่วนลด', r.subtotal === 25000 && r.vat === 1750);
  r = compute({ items: [item(0.29, { qty: 50 })] });
  t('ไม่เพี้ยนจากทศนิยมลอย 0.29 × 50', r.subtotal === 1450);
  r = compute({ items: [item(100)], vatRate: 10 });
  t('อัตรา VAT รับจาก input', r.vat === 1000);
  // Thai words
  const w = (b) => bahtText(Math.round(b * 100));
  t('1 หนึ่งบาท', w(1) === 'หนึ่งบาทถ้วน');
  t('11 สิบเอ็ด', w(11) === 'สิบเอ็ดบาทถ้วน');
  t('20 ยี่สิบ', w(20) === 'ยี่สิบบาทถ้วน');
  t('21 ยี่สิบเอ็ด', w(21) === 'ยี่สิบเอ็ดบาทถ้วน');
  t('101 หนึ่งร้อยเอ็ด', w(101) === 'หนึ่งร้อยเอ็ดบาทถ้วน');
  t('10,050 หนึ่งหมื่นห้าสิบ', w(10050) === 'หนึ่งหมื่นห้าสิบบาทถ้วน');
  t('1,234.50 มีสตางค์', w(1234.5) === 'หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์');
  t('0.01 หนึ่งสตางค์ ไม่มีบาท', w(0.01) === 'หนึ่งสตางค์');
  t('0.21 ยี่สิบเอ็ดสตางค์', w(0.21) === 'ยี่สิบเอ็ดสตางค์');
  t('1.01 หนึ่งบาทหนึ่งสตางค์', w(1.01) === 'หนึ่งบาทหนึ่งสตางค์');
  t('0 ศูนย์บาทถ้วน', w(0) === 'ศูนย์บาทถ้วน');
  t('1,000,000 หนึ่งล้าน', w(1000000) === 'หนึ่งล้านบาทถ้วน');
  t('1,000,001 หนึ่งล้านเอ็ด', w(1000001) === 'หนึ่งล้านเอ็ดบาทถ้วน');
  t('21,400 สองหมื่นหนึ่งพันสี่ร้อย', w(21400) === 'สองหมื่นหนึ่งพันสี่ร้อยบาทถ้วน');
  t('12,345,678 ตัวเต็ม', w(12345678) === 'สิบสองล้านสามแสนสี่หมื่นห้าพันหกร้อยเจ็ดสิบแปดบาทถ้วน');
  // tax id check and input checks
  t('เลขผู้เสียภาษีผิดเตือน', compute({ items: [item(1)], sellerTaxId: '1234567890138' }).warnings.length === 1);
  t('เลขผู้เสียภาษีถูกไม่เตือน', compute({ items: [item(1)], sellerTaxId: '1234567890139', buyerTaxId: '1-2345-67890-13-9' }).warnings.length === 0);
  const throwsWith = (inp, word) => { try { compute(inp); return false; } catch (e) { return e.message.includes(word); } };
  t('ไม่มี items', throwsWith({ items: [] }, 'items'));
  t('qty 0', throwsWith({ items: [item(1, { qty: 0 })] }, 'qty'));
  t('price เป็นข้อความ', throwsWith({ items: [item('100')] }, 'price'));
  t('ส่วนลดเกินยอด', throwsWith({ items: [item(100, { discount: 101 })] }, 'discount'));
  t('vatMode ผิด', throwsWith({ items: [item(1)], vatMode: 'both' }, 'vatMode'));
  t('whtRate เกิน 100', throwsWith({ items: [item(1)], whtRate: 300 }, 'whtRate'));
  // edge/dt7: ยอดเกินเพดาน · VAT จาก rates.json เตือนเมื่อเก่าหรือหมดช่วงลดอัตรา
  t('ยอดเกินเพดานปฏิเสธ', throwsWith({ items: [item(99999999999, { qty: 2147483647.5 })] }, 'เพดาน'));
  t('ยอดใต้เพดานพอดีผ่าน', compute({ items: [item(9999999999.99)], vatMode: 'none' }).total === MAX_TOTAL_SATANG);
  const rates = loadRates();
  const fresh = new Date(`${rates.checked}T00:00:00Z`);
  const plus = (d) => new Date(fresh.getTime() + d * DAY_MS);
  t('VAT ตั้งต้นจาก rates.json', compute({ items: [item(100)] }, rates, fresh).vat === rates.vat_pct * 100 && rates.vat_pct === 7);
  t('rates.json ใหม่ไม่เตือน', compute({ items: [item(100)] }, rates, fresh).warnings.length === 0);
  t('rates.json 91 วันเตือน', compute({ items: [item(100)] }, rates, plus(91)).warnings.length === 1);
  t('เลยวันสิ้นสุดอัตราลดเตือน', compute({ items: [item(100)] }, rates, new Date('2027-10-01T00:00:00Z')).warnings.some((w) => w.includes('ผ่านมาแล้ว')));
  t('ใส่ vatRate เองไม่เตือนวันที่', compute({ items: [item(100)], vatRate: 7 }, rates, plus(400)).warnings.length === 0);
  // rates.json ตรงกับ facts.json (มีเฉพาะใน repo · ข้ามเมื่อยังไม่มีรายการ vat-rate)
  try {
    const fact = JSON.parse(readFileSync(join(dirname(RATES_FILE), '..', '..', '..', '..', '..', 'scripts', 'check', 'facts.json'), 'utf8')).facts['vat-rate'];
    if (fact) t('VAT ตรง facts.json vat-rate', `${rates.vat_pct}%` === fact.value);
  } catch (err) { if (err.code !== 'ENOENT') throw err; }
  t('รายงานมีตัวหนังสือ', report({ items: [item(50000)], whtRate: 3 }, compute({ items: [item(50000)], whtRate: 3 })).includes('ห้าหมื่นสองพันบาทถ้วน'));
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

// รัน CLI เฉพาะตอนเรียกไฟล์นี้ตรง ๆ · import จากสคริปต์อื่นได้โดยไม่ออก
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const args = process.argv.slice(2);
if (!isMain) { /* imported */ } else if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('ใช้: node thai-doc-total.mjs <ไฟล์.json> [--json] | --self-test'); process.exit(2); }
  try {
    const input = JSON.parse(readFileSync(file, 'utf8'));
    const r = compute(input);
    console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(input, r));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
