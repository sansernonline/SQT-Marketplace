#!/usr/bin/env node
// stock-calc.mjs - ต่อ SKU: available · buffer · วันที่ขายได้ · ระดับ stock · safety stock · จุดสั่งซื้อ · จำนวนสั่ง (Node stdlib only)
// Usage: node stock-calc.mjs <file.json> [--json]   |   node stock-calc.mjs --self-test
// File: { "skus": [ { "sku": "BAG-TOTE-BLK-L", "on_hand": 140, "reserved": 14, "avg_daily": 4, "max_daily": 9,
//   "lead_avg": 10, "lead_max": 14, "cover_days": 45, "orders_per_day": 8, "syncs_per_day": 2 } ] }
// avg_daily และ max_daily = ชิ้นต่อวันรวมทุกช่องทาง · orders_per_day ไม่บังคับ (ไม่ใส่ = avg_daily) · syncs_per_day ไม่บังคับ (ค่าตั้งต้น 2)
// สูตรตาม multi-shop-stock/SKILL.md หัวข้อ Sync rules และ Reorder point
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ค่าตั้งต้น ยังไม่ได้วัด: เส้นแบ่งระดับ stock เป็นจำนวนวันที่ขายได้ (SKILL.md ตาราง Sync rules)
const PLENTY_DAYS = 14;
const VERY_LOW_DAYS = 3;
// ค่าตั้งต้น ยังไม่ได้วัด: กันออเดอร์ที่เข้ามาพร้อมกันเกินค่าเฉลี่ยระหว่าง 2 รอบ sync
const BUFFER_EXTRA = 2;
const DEFAULT_SYNCS_PER_DAY = 2;

const TIER_TEXT = {
  plenty: 'มาก: ทุกช่องทางแสดง available − buffer',
  low: 'น้อย: ช่องทางขายดีสุดแสดงเต็ม ช่องอื่นแสดงจำนวนเล็กคงที่ (3–5)',
  very_low: 'น้อยมาก: ขายช่องทางเดียว ช่องอื่นตั้ง 0',
};

export function validate(input) {
  if (!input || typeof input !== 'object') throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  if (!Array.isArray(input.skus) || input.skus.length === 0) throw new Error('ช่อง skus ต้องมีอย่างน้อย 1 SKU');
  const seen = new Set();
  input.skus.forEach((s, i) => {
    if (typeof s?.sku === 'string' && seen.has(s.sku)) throw new Error(`SKU "${s.sku}" ซ้ำ (skus[${i}]) · ผลของ 2 แถวจะทับกัน · รวมเป็นแถวเดียวหรือตั้งรหัสให้ต่างกัน`);
    if (typeof s?.sku === 'string') seen.add(s.sku);
    const at = (f) => `skus[${i}].${f} (${s?.sku ?? `ตัวที่ ${i + 1}`})`;
    if (!s?.sku || typeof s.sku !== 'string') throw new Error(`ช่อง skus[${i}].sku ต้องเป็นรหัส SKU`);
    const num = (f, required = true) => {
      if (s[f] === undefined && !required) return;
      if (typeof s[f] !== 'number' || !Number.isFinite(s[f]) || s[f] < 0) throw new Error(`ช่อง ${at(f)} ต้องเป็นตัวเลขตั้งแต่ 0 (ได้ ${JSON.stringify(s[f])})`);
    };
    for (const f of ['on_hand', 'reserved', 'avg_daily', 'max_daily', 'lead_avg', 'lead_max', 'cover_days']) num(f);
    num('orders_per_day', false);
    num('syncs_per_day', false);
    if (s.syncs_per_day === 0) throw new Error(`ช่อง ${at('syncs_per_day')} ต้องมากกว่า 0 (sync อย่างน้อยวันละครั้ง)`);
    if (s.max_daily < s.avg_daily) throw new Error(`ช่อง ${at('max_daily')} (${s.max_daily}) น้อยกว่า avg_daily (${s.avg_daily}) · ใส่ยอดขายสูงสุดต่อวันของวันปกติ`);
    if (s.lead_max < s.lead_avg) throw new Error(`ช่อง ${at('lead_max')} (${s.lead_max}) น้อยกว่า lead_avg (${s.lead_avg}) · ใส่วันรอของนานสุดที่เคยเจอ`);
  });
}

export function calcSku(s) {
  const warnings = [];
  const available = s.on_hand - s.reserved;
  const ordersPerSync = (s.orders_per_day ?? s.avg_daily) / (s.syncs_per_day ?? DEFAULT_SYNCS_PER_DAY);
  const buffer = Math.ceil(ordersPerSync) + BUFFER_EXTRA;
  const days = s.avg_daily > 0 ? available / s.avg_daily : Infinity;
  // stock ไม่เกิน buffer ขายหลายช่องทางเสี่ยงขายเกินแม้ขายช้า
  const tier = available <= buffer || days < VERY_LOW_DAYS ? 'very_low' : days <= PLENTY_DAYS ? 'low' : 'plenty';
  const safety = s.max_daily * s.lead_max - s.avg_daily * s.lead_avg;
  const reorderPoint = s.avg_daily * s.lead_avg + safety;
  const belowReorder = available <= reorderPoint;
  const reorderQty = belowReorder ? Math.ceil(s.avg_daily * s.cover_days - (available - reorderPoint)) : 0;
  if (available < 0) warnings.push(`${s.sku}: available ติดลบ ${available} (reserved มากกว่า on_hand) · ขายเกินแล้ว นับของจริงและแจ้งลูกค้าก่อน`);
  if (s.avg_daily === 0) warnings.push(`${s.sku}: ไม่มียอดขาย จุดสั่งซื้อเหลือแค่ safety stock · ทบทวนว่าควรสั่งเพิ่มไหม`);
  return {
    sku: s.sku, available, buffer, days_of_cover: Number.isFinite(days) ? Math.round(days * 10) / 10 : null,
    tier, shown_per_channel: Math.max(0, available - buffer), safety_stock: safety, reorder_point: reorderPoint,
    below_reorder: belowReorder, reorder_qty: reorderQty, warnings,
  };
}

export function calc(input) {
  validate(input);
  const skus = input.skus.map(calcSku);
  return { skus, warnings: skus.flatMap((x) => x.warnings) };
}

export function report(r) {
  const rows = r.skus.map((x) => `| ${x.sku} | ${x.available} | ${x.buffer} | ${x.days_of_cover ?? 'ไม่มียอดขาย'} | ${TIER_TEXT[x.tier]} | ${x.shown_per_channel} | ${x.safety_stock} | ${x.reorder_point} | ${x.below_reorder ? `**สั่ง ${x.reorder_qty}**` : '-'} |`);
  return [
    ...r.warnings.map((w) => `คำเตือน: ${w}`),
    '| SKU | available | buffer | ขายได้อีก (วัน) | ระดับ | แสดงได้สูงสุดต่อช่อง | safety stock | จุดสั่งซื้อ | สั่งเพิ่ม |',
    '|---|---|---|---|---|---|---|---|---|',
    ...rows,
    '',
    `เส้นแบ่ง ${PLENTY_DAYS} และ ${VERY_LOW_DAYS} วัน และ buffer +${BUFFER_EXTRA} เป็นค่าตั้งต้น ยังไม่ได้วัด · ก่อนแคมเปญใหญ่ใส่ avg_daily ของช่วงแคมเปญปีก่อน`,
  ].join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const base = { sku: 'BAG-TOTE-BLK-L', on_hand: 140, reserved: 14, avg_daily: 4, max_daily: 9, lead_avg: 10, lead_max: 14, cover_days: 45 };
  // SKILL.md: safety 86 · จุดสั่ง 126 · available 126 สั่ง 180
  let x = calcSku(base);
  try { validate({ skus: [base, { ...base }] }); t('SKU ซ้ำ หยุด', false); } catch (e) { t('SKU ซ้ำ หยุดพร้อมบอกชื่อ', e.message.includes('BAG-TOTE-BLK-L') && e.message.includes('ซ้ำ')); }
  t('SKILL safety stock 86', x.safety_stock === 86);
  t('SKILL จุดสั่งซื้อ 126', x.reorder_point === 126);
  t('SKILL available 126 สั่ง 180', x.available === 126 && x.below_reorder && x.reorder_qty === 180);
  // SKILL.md: 8 ออเดอร์ต่อวัน sync วันละ 2 ครั้ง → buffer 4 + 2 = 6
  t('SKILL buffer 6', calcSku({ ...base, orders_per_day: 8, syncs_per_day: 2 }).buffer === 6);
  t('available เหนือจุดสั่ง ไม่สั่ง', calcSku({ ...base, on_hand: 300 }).reorder_qty === 0);
  // ระดับตามวันที่ขายได้: 50 ชิ้น ขาย 4 ต่อวัน = 12.5 วัน (น้อย) · ขาย 0.2 ต่อวัน = 250 วัน (มาก)
  const fast = calcSku({ ...base, on_hand: 50, reserved: 0 });
  const slow = calcSku({ ...base, on_hand: 50, reserved: 0, avg_daily: 0.2, max_daily: 1 });
  t('ขายเร็ว 50 ชิ้น = น้อย', fast.tier === 'low' && fast.days_of_cover === 12.5);
  t('ขายช้า 50 ชิ้น = มาก', slow.tier === 'plenty' && slow.days_of_cover === 250);
  t('ขายเร็ว 10 ชิ้น = น้อยมาก', calcSku({ ...base, on_hand: 10, reserved: 0 }).tier === 'very_low');
  t('14 วันพอดี = น้อย', calcSku({ ...base, on_hand: 56, reserved: 0 }).tier === 'low');
  t('ไม่เกิน buffer = น้อยมาก แม้ขายช้า', calcSku({ ...base, on_hand: 3, reserved: 0, avg_daily: 0.1, max_daily: 1 }).tier === 'very_low');
  // ค่าขอบ
  x = calcSku({ ...base, avg_daily: 0, max_daily: 0 });
  t('avg 0 วันขายได้ไม่มี จุดสั่ง 0 เตือน', x.days_of_cover === null && x.reorder_point === 0 && x.warnings.length === 1);
  x = calcSku({ ...base, lead_avg: 0, lead_max: 0 });
  t('lead 0 จุดสั่ง 0', x.safety_stock === 0 && x.reorder_point === 0);
  x = calcSku({ ...base, on_hand: 5, reserved: 8 });
  t('available ติดลบ เตือน แสดง 0', x.available === -3 && x.shown_per_channel === 0 && x.warnings.some((w) => w.includes('ติดลบ')));
  const throwsWith = (inp, word) => { try { calc(inp); return false; } catch (e) { return e.message.includes(word); } };
  t('skus ว่าง', throwsWith({ skus: [] }, 'skus'));
  t('on_hand เป็นข้อความ', throwsWith({ skus: [{ ...base, on_hand: '1' }] }, 'on_hand'));
  t('max น้อยกว่า avg', throwsWith({ skus: [{ ...base, max_daily: 1 }] }, 'max_daily'));
  t('lead_max น้อยกว่า lead_avg', throwsWith({ skus: [{ ...base, lead_max: 5 }] }, 'lead_max'));
  t('sync 0 ครั้ง', throwsWith({ skus: [{ ...base, syncs_per_day: 0 }] }, 'syncs_per_day'));
  t('รายงานบอกค่าตั้งต้น', report(calc({ skus: [base] })).includes('ยังไม่ได้วัด'));
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) selfTest();
  else {
    const file = args.find((a) => !a.startsWith('--'));
    if (!file) { console.error('ใช้: node stock-calc.mjs <ไฟล์.json> [--json] | --self-test'); process.exit(2); }
    try {
      const r = calc(JSON.parse(readFileSync(file, 'utf8')));
      console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(r));
    } catch (e) {
      console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
      process.exit(1);
    }
  }
}
