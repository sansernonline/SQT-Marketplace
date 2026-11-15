#!/usr/bin/env node
// price-calc.mjs - ราคาขายจากต้นทุน ค่าธรรมเนียมแพลตฟอร์ม และกำไรที่ต้องการ (Node stdlib only)
// Usage: node price-calc.mjs <file.json> [--json]   |   node price-calc.mjs --self-test
// File: { "rates_checked": "2026-10-06", "items": [ { "name": "bag", "cost": 120, "shipping": 15, "fixed": 1.07, "margin_pct": 20,
//   "vat_registered": false, "fees_pct": { "commission": 10.7, "transaction": 3.21 }, "campaign": { "extra_pct": 3, "voucher": 20 } } ] }
// fees_pct = ทุกค่าธรรมเนียมที่คิดเป็น % ของราคา รวม VAT แล้ว (อัตราอ่านจากไฟล์เท่านั้น ไม่ฝังในโค้ด) · campaign ไม่บังคับ
// สูตร: P = (C + S + F) / (1 - r - v - m) · v = 7/107 ถ้าจด VAT · ปัดราคาขึ้นให้ลงท้าย 9 หรือ 0 แล้วคิดกำไรใหม่ที่ราคาที่ปัด
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const VAT_SHARE = 7 / 107;
// ค่าธรรมเนียมแพลตฟอร์มเปลี่ยนบ่อย (CHANGELOG 1.1.0) · 30 วันเป็นค่าตั้งต้น ยังไม่ได้วัด
const RATES_MAX_AGE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const round2 = (n) => Math.round(n * 100) / 100;
const sumPct = (fees) => Object.values(fees).reduce((s, v) => s + v, 0);

export function validate(input, today = new Date()) {
  const num = (v, label) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) throw new Error(`ช่อง ${label} ต้องเป็นตัวเลขตั้งแต่ 0 (ได้ ${JSON.stringify(v)})`);
  };
  if (!input || typeof input !== 'object') throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  if (typeof input.rates_checked !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(input.rates_checked)) throw new Error(`ช่อง rates_checked ต้องเป็นวันที่ YYYY-MM-DD ที่ตรวจอัตราใน Seller Centre (ได้ ${JSON.stringify(input.rates_checked)})`);
  if (!Array.isArray(input.items) || input.items.length === 0) throw new Error('ช่อง items ต้องเป็นรายการสินค้าอย่างน้อย 1 ชิ้น');
  const warnings = [];
  const age = Math.floor((today - new Date(`${input.rates_checked}T00:00:00Z`)) / DAY_MS);
  if (age > RATES_MAX_AGE_DAYS) warnings.push(`อัตราตรวจล่าสุด ${input.rates_checked} (${age} วันก่อน) เก่ากว่า ${RATES_MAX_AGE_DAYS} วัน · เปิด Seller Centre ดูอัตราปัจจุบัน แล้วแก้ fees_pct และ rates_checked`);
  input.items.forEach((it, i) => {
    const n = it?.name ?? `ชิ้นที่ ${i + 1}`;
    const at = (f) => `items[${i}].${f} (${n})`;
    num(it?.cost, at('cost'));
    num(it?.shipping, at('shipping'));
    num(it?.fixed, at('fixed'));
    num(it?.margin_pct, at('margin_pct'));
    if (it.cost + it.shipping + it.fixed <= 0) throw new Error(`${n}: cost + shipping + fixed เป็น 0 ได้ราคา 0 · ใส่ต้นทุนจริงของสินค้า`);
    if (it.margin_pct > 0 && it.margin_pct < 1) warnings.push(`${n}: margin_pct = ${it.margin_pct} น้อยกว่า 1 · ใส่เป็น % (20 ไม่ใช่ 0.2)`);
    if (typeof it.vat_registered !== 'boolean') throw new Error(`ช่อง ${at('vat_registered')} ต้องเป็น true หรือ false`);
    if (!it.fees_pct || typeof it.fees_pct !== 'object') throw new Error(`ช่อง ${at('fees_pct')} ต้องเป็นอ็อบเจกต์ เช่น { "commission": 10.7 }`);
    for (const [k, v] of Object.entries(it.fees_pct)) {
      num(v, at(`fees_pct.${k}`));
      if (v > 0 && v < 1) warnings.push(`${n}: fees_pct.${k} = ${v} น้อยกว่า 1 · ใส่เป็น % (10.7 ไม่ใช่ 0.107)`);
    }
    if (it.campaign) {
      num(it.campaign.extra_pct ?? 0, at('campaign.extra_pct'));
      num(it.campaign.voucher ?? 0, at('campaign.voucher'));
    }
    const load = sumPct(it.fees_pct) / 100 + (it.vat_registered ? VAT_SHARE : 0) + it.margin_pct / 100;
    if (load >= 1) throw new Error(`${n}: ค่าธรรมเนียม + VAT + กำไรที่ต้องการรวมกัน ${round2(load * 100)}% ตั้งแต่ 100% ขึ้นไป หาราคาไม่ได้ · ลดกำไรที่ต้องการหรือเช็คอัตรา`);
  });
  return warnings;
}

// ปัดขึ้นจนลงท้าย 9 หรือ 0
export function roundPrice(p) {
  let n = Math.ceil(p);
  while (n % 10 !== 0 && n % 10 !== 9) n++;
  return n;
}

// แต่ละบรรทัดปัด 2 ตำแหน่งแบบใบแจ้ง แล้วกำไร = ราคา - บรรทัดที่ปัดแล้ว (ตรงกับตัวอย่างใน SKILL.md)
function breakdown(it, price, extraPct = 0) {
  const fees = Object.entries(it.fees_pct).map(([k, v]) => [k, round2((price * v) / 100)]);
  if (extraPct > 0) fees.push(['campaign', round2((price * extraPct) / 100)]);
  const vat = it.vat_registered ? round2(price * VAT_SHARE) : 0;
  const profit = round2(price - it.cost - it.shipping - it.fixed - fees.reduce((s, [, f]) => s + f, 0) - vat);
  return { price, fees: Object.fromEntries(fees), vat, profit, margin_pct: round2((profit / price) * 100) };
}

export function calcItem(it) {
  const r = sumPct(it.fees_pct) / 100;
  const v = it.vat_registered ? VAT_SHARE : 0;
  const formulaPrice = (it.cost + it.shipping + it.fixed) / (1 - r - v - it.margin_pct / 100);
  const price = roundPrice(formulaPrice);
  const out = { name: it.name, formula_price: round2(formulaPrice), ...breakdown(it, price) };
  if (it.campaign) {
    // simple: voucher ลดราคาที่ลูกค้าจ่าย ค่าธรรมเนียมคิดจากราคาหลังหัก voucher · ตรวจใน Seller Centre ว่าแพลตฟอร์มคิดแบบนี้ไหม
    const c = breakdown(it, price - (it.campaign.voucher ?? 0), it.campaign.extra_pct ?? 0);
    out.campaign = { profit: c.profit, loss: c.profit < 0 };
  }
  return out;
}

export function calc(input, today = new Date()) {
  const warnings = validate(input, today);
  const items = input.items.map(calcItem);
  input.items.forEach((it, i) => {
    if ((it.campaign?.voucher ?? 0) >= items[i].price) warnings.push(`${items[i].name}: voucher ${it.campaign.voucher} ตั้งแต่ราคาขาย ${items[i].price} ขึ้นไป · เช็คว่าใส่ voucher ถูกช่องและถูกหน่วย`);
  });
  return { rates_checked: input.rates_checked, items, warnings };
}

const baht = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function report(r) {
  const rows = r.items.map((x) => {
    const fees = Object.entries(x.fees).map(([k, f]) => `${k} ${baht(f)}`).join(' + ');
    const camp = x.campaign ? (x.campaign.loss ? `ขาดทุน ${baht(-x.campaign.profit)} · ไม่ควรร่วม` : `กำไร ${baht(x.campaign.profit)}`) : '-';
    return `| ${x.name} | ${baht(x.formula_price)} | **${x.price}** | ${fees}${x.vat ? ` + VAT ${baht(x.vat)}` : ''} | ${baht(x.profit)} (${x.margin_pct}%) | ${camp} |`;
  });
  return [
    `อัตราค่าธรรมเนียมตรวจล่าสุด ${r.rates_checked} (ตามที่ผู้ใช้ให้มา · ยืนยันซ้ำใน Seller Centre)`,
    ...r.warnings.map((w) => `คำเตือน: ${w}`),
    '',
    '| สินค้า | ราคาตามสูตร | ราคาที่ปัด | ค่าธรรมเนียมที่ราคาปัด | กำไรที่ราคาปัด | ช่วงแคมเปญ |',
    '|---|---|---|---|---|---|',
    ...rows,
    '',
    'ข้อมูลประกอบการตัดสินใจ ไม่ใช่คำแนะนำด้านบัญชีหรือภาษี · ผู้ใช้ตัดสิน',
  ].join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, b) => Math.abs(a - b) < 0.005;
  const base = { name: 'bag', cost: 120, shipping: 15, fixed: 1.07, margin_pct: 20, vat_registered: false, fees_pct: { commission: 10.7, transaction: 3.21 } };
  // SKILL.md: Shopee ไม่จด VAT สูตร 205.89 -> 209 กำไร 43.86
  let x = calcItem(base);
  t('Shopee สูตร 205.89', near(x.formula_price, 205.89));
  t('Shopee ปัด 209', x.price === 209);
  t('Shopee ค่าธรรมเนียม', x.fees.commission === 22.36 && x.fees.transaction === 6.71);
  t('Shopee กำไร 43.86', near(x.profit, 43.86));
  // SKILL.md: จด VAT สูตร 228.50 -> 229 commission 24.50 transaction 7.35 VAT 14.98 กำไร 46.10 (20.1%)
  x = calcItem({ ...base, vat_registered: true });
  t('VAT สูตร 228.50', near(x.formula_price, 228.5) && x.price === 229);
  t('VAT ค่าธรรมเนียม', x.fees.commission === 24.5 && x.fees.transaction === 7.35 && x.vat === 14.98);
  t('VAT กำไร 46.10 (20.1%)', near(x.profit, 46.1) && near(x.margin_pct, 20.13));
  // Lazada: fixed 0 -> สูตร 204.27 -> 209 กำไร 44.93
  x = calcItem({ ...base, fixed: 0 });
  t('Lazada 204.27 -> 209 กำไร 44.93', near(x.formula_price, 204.27) && x.price === 209 && near(x.profit, 44.93));
  // ปัดราคา
  t('ปัดลงท้าย 0', roundPrice(209.27) === 210);
  t('ปัดลงท้าย 9', roundPrice(205.89) === 209);
  t('ราคาลงท้าย 9 หรือ 0 พอดี คงเดิม', roundPrice(229) === 229 && roundPrice(230) === 230);
  // แคมเปญ: voucher 100 ที่ราคา 209 ต้นทุนรวม 136.07 -> ขาดทุน
  x = calcItem({ ...base, campaign: { extra_pct: 3, voucher: 100 } });
  t('แคมเปญขาดทุน', x.campaign.loss === true);
  t('ไม่มีแคมเปญ ไม่มีช่อง', calcItem(base).campaign === undefined);
  // input checks
  const FRESH = new Date('2026-10-10T00:00:00Z'); // 4 วันหลัง rates_checked ในตัวอย่าง จึงไม่เตือนวันที่
  const throwsWith = (inp, word) => { try { calc(inp, FRESH); return false; } catch (e) { return e.message.includes(word); } };
  const file = (item, extra = {}) => ({ rates_checked: '2026-10-06', items: [{ ...base, ...item }], ...extra });
  t('ไม่มี rates_checked', throwsWith(file({}, { rates_checked: undefined }), 'rates_checked'));
  t('cost ติดลบ', throwsWith(file({ cost: -1 }), 'cost'));
  t('shipping เป็นข้อความ', throwsWith(file({ shipping: '15' }), 'shipping'));
  t('vat_registered ไม่ใช่ boolean', throwsWith(file({ vat_registered: 'no' }), 'vat_registered'));
  t('ไม่มี fees_pct', throwsWith(file({ fees_pct: undefined }), 'fees_pct'));
  t('items ว่าง', throwsWith({ rates_checked: '2026-10-06', items: [] }, 'items'));
  t('หาราคาไม่ได้ (รวม >= 100%)', throwsWith(file({ margin_pct: 90 }), '100%'));
  t('fees_pct < 1 เตือน', calc(file({ fees_pct: { commission: 0.107 } }), FRESH).warnings.length === 1);
  t('รายงานพิมพ์วันที่อัตรา', report(calc(file({}), FRESH)).includes('2026-10-06'));
  // edge/pc1: อัตราปี 2019 · cost 0 ได้ NaN% · margin 0.2 · voucher เกินราคา
  t('อัตราเก่า 2019 เตือน', calc(file({}, { rates_checked: '2019-01-01' }), FRESH).warnings.some((w) => w.includes('2019-01-01')));
  t('อัตรา 30 วันพอดี ไม่เตือน', calc(file({}), new Date('2026-11-05T00:00:00Z')).warnings.length === 0);
  t('อัตรา 31 วัน เตือน', calc(file({}), new Date('2026-11-06T00:00:00Z')).warnings.length === 1);
  t('ต้นทุนรวม 0 ปฏิเสธ', throwsWith(file({ cost: 0, shipping: 0, fixed: 0 }), 'ราคา 0'));
  t('margin_pct 0.2 เตือน', calc(file({ margin_pct: 0.2 }), FRESH).warnings.some((w) => w.includes('margin_pct')));
  t('voucher เกินราคา เตือน', calc(file({ campaign: { voucher: 500 } }), FRESH).warnings.some((w) => w.includes('voucher')));
  t('voucher ปกติ ไม่เตือน', calc(file({ campaign: { voucher: 20 } }), FRESH).warnings.length === 0);
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

// รัน CLI เฉพาะตอนเรียกไฟล์นี้ตรง ๆ · import จากสคริปต์อื่นได้โดยไม่ออก
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) selfTest();
  else {
    const file = args.find((a) => !a.startsWith('--'));
    if (!file) { console.error('ใช้: node price-calc.mjs <ไฟล์.json> [--json] | --self-test'); process.exit(2); }
    try {
      const r = calc(JSON.parse(readFileSync(file, 'utf8')));
      console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(r));
    } catch (e) {
      console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
      process.exit(1);
    }
  }
}
