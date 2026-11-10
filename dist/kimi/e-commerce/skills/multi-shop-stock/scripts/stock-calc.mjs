#!/usr/bin/env node
// stock-calc.mjs - ต่อ SKU: available · buffer · วันที่ขายได้ · ระดับ stock · safety stock · จุดสั่งซื้อ · จำนวนสั่ง (Node stdlib only)
// Usage: node stock-calc.mjs <file.json> [--json]   |   node stock-calc.mjs --self-test
// File: { "skus": [ { "sku": "BAG-TOTE-BLK-L", "on_hand": 140, "reserved": 14, "avg_daily": 4, "max_daily": 9,
//   "lead_avg": 10, "lead_max": 14, "cover_days": 45, "orders_per_day": 8, "syncs_per_day": 2 } ] }
// avg_daily และ max_daily = ชิ้นต่อวันรวมทุกช่องทาง · orders_per_day ไม่บังคับ (ไม่ใส่ = avg_daily) · syncs_per_day ไม่บังคับ (ค่าตั้งต้น 2)
// ไม่บังคับ: on_order = ชิ้นที่สั่งแล้วยังไม่ถึง (หักออกจากจำนวนสั่ง) · unit_cost = ต้นทุนต่อชิ้น บาท (คิดเงินจม) · days_since_sale = กี่วันแล้วที่ไม่มีการขาย
// สูตรตาม multi-shop-stock/SKILL.md หัวข้อ Sync rules · Reorder point · Stuck stock
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ค่าตั้งต้น ยังไม่ได้วัด: เส้นแบ่งระดับ stock เป็นจำนวนวันที่ขายได้ (SKILL.md ตาราง Sync rules)
const PLENTY_DAYS = 14;
const VERY_LOW_DAYS = 3;
// ค่าตั้งต้น ยังไม่ได้วัด: กันออเดอร์ที่เข้ามาพร้อมกันเกินค่าเฉลี่ยระหว่าง 2 รอบ sync
const BUFFER_EXTRA = 2;
const DEFAULT_SYNCS_PER_DAY = 2;
// เส้นแบ่งสต็อกค้าง (แนวจาก Anthropic inventory-planner · ยังไม่ได้วัดกับร้านไทย): ไม่ขาย 28 วัน = ช้า · 90 วัน = ตาย · ของพอขายเกิน 120 วัน = ล้น
const SLOW_DAYS = 28;
const DEAD_DAYS = 90;
const OVERSTOCK_DAYS = 120;
const STUCK_TEXT = { slow: 'เคลื่อนไหวช้า', dead: 'สต็อกตาย', overstock: 'ล้นสต็อก' };

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
    for (const f of ['orders_per_day', 'syncs_per_day', 'on_order', 'unit_cost', 'days_since_sale']) num(f, false);
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
  // ของที่สั่งแล้วยังไม่ถึงนับรวมก่อนตัดสินว่าต้องสั่งอีกไหม
  const position = available + (s.on_order ?? 0);
  const sinceSale = s.days_since_sale ?? 0;
  const stuck = sinceSale >= DEAD_DAYS ? 'dead' : sinceSale >= SLOW_DAYS ? 'slow' : Number.isFinite(days) && days > OVERSTOCK_DAYS && available > 0 ? 'overstock' : null;
  // ช้าหรือตาย ห้ามสั่งซ้ำ · ล้นสต็อกอยู่เหนือจุดสั่งเสมอ
  const belowReorder = !stuck && position <= reorderPoint;
  const reorderQty = belowReorder ? Math.max(0, Math.ceil(s.avg_daily * s.cover_days - (position - reorderPoint))) : 0;
  // เงินจม: ช้าและตายนับทั้งก้อน · ล้นนับเฉพาะส่วนที่เกิน 120 วัน
  const stuckUnits = stuck === 'overstock' ? Math.floor(available - s.avg_daily * OVERSTOCK_DAYS) : stuck ? Math.max(0, s.on_hand) : 0;
  const stuckValue = s.unit_cost === undefined ? null : Math.round(stuckUnits * s.unit_cost * 100) / 100;
  if (available < 0) warnings.push(`${s.sku}: available ติดลบ ${available} (reserved มากกว่า on_hand) · ขายเกินแล้ว นับของจริงและแจ้งลูกค้าก่อน`);
  if (s.avg_daily === 0 && !stuck) warnings.push(`${s.sku}: ไม่มียอดขาย จุดสั่งซื้อเหลือแค่ safety stock · ทบทวนว่าควรสั่งเพิ่มไหม`);
  if (stuck && stuck !== 'overstock') warnings.push(`${s.sku}: ไม่มีการขาย ${sinceSale} วัน (${STUCK_TEXT[stuck]}) · ไม่สั่งซ้ำ เลือก คงไว้ · ลดราคา · ถอดลิสต์`);
  if (stuck && s.unit_cost === undefined) warnings.push(`${s.sku}: ใส่ unit_cost เพื่อคิดเงินจม`);
  return {
    sku: s.sku, available, buffer,
    days_of_cover: stuck === 'slow' || stuck === 'dead' || !Number.isFinite(days) ? null : Math.round(days * 10) / 10,
    tier, shown_per_channel: Math.max(0, available - buffer), safety_stock: safety, reorder_point: reorderPoint,
    on_order: s.on_order ?? 0, below_reorder: belowReorder, reorder_qty: reorderQty,
    stuck, stuck_units: stuckUnits, stuck_value: stuckValue, warnings,
  };
}

export function calc(input) {
  validate(input);
  const skus = input.skus.map(calcSku);
  const stuck = skus.filter((x) => x.stuck);
  const stuck_value = stuck.reduce((sum, x) => sum + (x.stuck_value ?? 0), 0);
  return { skus, stuck_count: stuck.length, stuck_value: Math.round(stuck_value * 100) / 100, warnings: skus.flatMap((x) => x.warnings) };
}

const baht = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

export function report(r) {
  const days = (x) => x.days_of_cover ?? (x.stuck ? '-' : 'ไม่มียอดขาย');
  const stuckCell = (x) => (x.stuck ? `${STUCK_TEXT[x.stuck]} ${x.stuck_units} ชิ้น${x.stuck_value === null ? '' : ` ฿${baht(x.stuck_value)}`}` : '-');
  const rows = r.skus.map((x) => `| ${x.sku} | ${x.available} | ${x.buffer} | ${days(x)} | ${TIER_TEXT[x.tier]} | ${x.shown_per_channel} | ${x.safety_stock} | ${x.reorder_point} | ${x.on_order} | ${x.below_reorder ? `**สั่ง ${x.reorder_qty}**` : '-'} | ${stuckCell(x)} |`);
  return [
    `เงินจมในสต็อกค้าง: ฿${baht(r.stuck_value)} (${r.stuck_count} SKU)`,
    ...r.warnings.map((w) => `คำเตือน: ${w}`),
    '| SKU | available | buffer | ขายได้อีก (วัน) | ระดับ | แสดงได้สูงสุดต่อช่อง | safety stock | จุดสั่งซื้อ | สั่งแล้วยังไม่ถึง | สั่งเพิ่ม | สต็อกค้าง |',
    '|---|---|---|---|---|---|---|---|---|---|---|',
    ...rows,
    '',
    `เส้นแบ่ง ${PLENTY_DAYS} และ ${VERY_LOW_DAYS} วัน · buffer +${BUFFER_EXTRA} · สต็อกค้าง ${SLOW_DAYS}/${DEAD_DAYS}/${OVERSTOCK_DAYS} วัน เป็นค่าตั้งต้น ยังไม่ได้วัด · ก่อนแคมเปญใหญ่ใส่ avg_daily ของช่วงแคมเปญปีก่อน`,
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
  // สต็อกค้าง
  t('สั่งแล้ว 10 ชิ้นยังไม่ถึง สั่งเพิ่ม 190 แทน 200', calcSku({ ...base, on_hand: 120 }).reorder_qty === 200 && calcSku({ ...base, on_hand: 120, on_order: 10 }).reorder_qty === 190);
  t('สั่งแล้วพอ ไม่สั่งซ้ำ', calcSku({ ...base, on_order: 200 }).below_reorder === false);
  x = calcSku({ ...base, days_since_sale: 30, unit_cost: 80 });
  t('ไม่ขาย 30 วัน = ช้า ไม่สั่ง ไม่คิดวันขายได้', x.stuck === 'slow' && x.reorder_qty === 0 && x.days_of_cover === null);
  t('ช้า เงินจม = on_hand × ต้นทุน', x.stuck_value === 140 * 80);
  t('ไม่ขาย 90 วัน = ตาย', calcSku({ ...base, days_since_sale: 90 }).stuck === 'dead');
  x = calcSku({ ...base, on_hand: 600, reserved: 0, unit_cost: 10 });
  t('150 วัน = ล้น นับส่วนเกิน 120 วัน', x.stuck === 'overstock' && x.stuck_units === 120 && x.stuck_value === 1200);
  const all = calc({ skus: [{ ...base, days_since_sale: 30, unit_cost: 80 }, { ...base, sku: 'B', on_hand: 600, reserved: 0, unit_cost: 10 }] });
  t('รวมเงินจมบรรทัดแรก', all.stuck_value === 12400 && report(all).startsWith('เงินจมในสต็อกค้าง: ฿12,400 (2 SKU)'));
  t('ค้างแต่ไม่มีต้นทุน เตือน', calcSku({ ...base, days_since_sale: 95 }).warnings.some((w) => w.includes('unit_cost')));
  t('on_order ติดลบ หยุด', throwsWith({ skus: [{ ...base, on_order: -1 }] }, 'on_order'));
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
