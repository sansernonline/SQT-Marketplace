#!/usr/bin/env node
// due-dates.mjs - which papers are due (date minus lead time) and when a medicine runs out (Node stdlib only)
// Usage: node due-dates.mjs <file.json> [--json]  |  node due-dates.mjs --refill <file.json> [--json]  |  node due-dates.mjs --self-test
// Docs file:   { "today": "2026-10-28", "items": [ { "name": "Passport", "end_date": "2027-02-01", "lead_days": 120 } ] }
// Refill file: { "today": "2026-10-28", "refills": [ { "name": "Medicine A", "on_hand": 60, "per_day": 2, "start_date": "2026-10-28", "remind_days": 7 } ] }
// Dates are YYYY-MM-DD. A year of 2400 or more is read as Buddhist Era (พ.ศ.) and 543 is subtracted. "today" is optional (default: this computer's date).
import { readFileSync } from 'node:fs';

const DAY = 86400000;
const DEFAULT_REMIND_DAYS = 7; // default 7 days before the last dose day, same as medication-schedule SKILL.md; not measured

// Parses a YYYY-MM-DD string (พ.ศ. or ค.ศ.) into UTC milliseconds; throws a Thai message naming the field.
export function parseDate(s, label) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s ?? ''));
  if (!m) throw new Error(`ช่อง ${label} ต้องเป็นวันที่แบบ YYYY-MM-DD เช่น 2027-02-01 (ได้ ${JSON.stringify(s)})`);
  let [y, mo, d] = m.slice(1).map(Number);
  if (y >= 2400) y -= 543;
  const t = Date.UTC(y, mo - 1, d);
  const back = new Date(t);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) throw new Error(`ช่อง ${label} ไม่มีวันที่นี้ในปฏิทิน (${s}) · ตรวจวัน เดือน และปี (ปี ค.ศ. ${y})`);
  return t;
}

const iso = (t) => new Date(t).toISOString().slice(0, 10);

function today(input) {
  if (input.today !== undefined) return parseDate(input.today, 'today');
  const n = new Date();
  return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
}

function list(input, key) {
  if (!Array.isArray(input?.[key]) || input[key].length === 0) throw new Error(`ช่อง ${key} ต้องเป็นรายการอย่างน้อย 1 รายการ`);
  return input[key];
}

function posNum(v, label, allowZero) {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || (v === 0 && !allowZero)) throw new Error(`ช่อง ${label} ต้องเป็นตัวเลข${allowZero ? 'ตั้งแต่ 0' : 'มากกว่า 0'} (ได้ ${JSON.stringify(v)})`);
}

// Status by days left: past = overdue, within lead time = do it now, else not yet. Sorted by date.
export function dueDates(input) {
  const now = today(input);
  return list(input, 'items').map((it, i) => {
    posNum(it?.lead_days, `items[${i}].lead_days`, true);
    const end = parseDate(it.end_date, `items[${i}].end_date`);
    const left = Math.round((end - now) / DAY);
    const lead = Math.ceil(it.lead_days); // lead 1.5 → 2 วัน ให้ start_by กับสถานะตรงกัน
    const status = left < 0 ? 'เลยกำหนด' : left <= lead ? 'ต้องทำตอนนี้' : 'ยังไม่ถึง';
    return { name: it.name ?? `รายการที่ ${i + 1}`, end_date: iso(end), days_left: left, start_by: iso(end - lead * DAY), status };
  }).sort((a, b) => a.days_left - b.days_left);
}

// Whole days of supply = floor(on_hand / per_day). Pills cover start_date .. start_date + supply - 1. Remind = last covered day - remind_days.
export function refill(input) {
  const now = today(input);
  return list(input, 'refills').map((r, i) => {
    posNum(r?.on_hand, `refills[${i}].on_hand`, true);
    posNum(r?.per_day, `refills[${i}].per_day`, false);
    const remind = r.remind_days ?? DEFAULT_REMIND_DAYS;
    posNum(remind, `refills[${i}].remind_days`, true);
    const start = r.start_date === undefined ? now : parseDate(r.start_date, `refills[${i}].start_date`);
    const supply = Math.floor(r.on_hand / r.per_day);
    const last = start + (supply - 1) * DAY; // with 0 supply this is the day before start: already out
    const remindOn = last - remind * DAY;
    const status = supply === 0 || last < now ? 'หมดแล้ว' : remindOn <= now ? 'ต้องสั่งยาตอนนี้' : 'ยังไม่ถึง';
    return { name: r.name ?? `ยาตัวที่ ${i + 1}`, days_supply: supply, last_dose_day: iso(last), remind_on: iso(remindOn), status };
  });
}

const dueTable = (rows) => ['| รายการ | หมดอายุ | เหลือ (วัน) | เริ่มทำภายใน | สถานะ |', '|---|---|---|---|---|', ...rows.map((r) => `| ${r.name} | ${r.end_date} | ${r.days_left} | ${r.start_by} | ${r.status} |`)].join('\n');
const refillTable = (rows) => ['| ยา | พอกินกี่วัน | วันสุดท้ายที่มียา | วันเตือน | สถานะ |', '|---|---|---|---|---|', ...rows.map((r) => `| ${r.name} | ${r.days_supply} | ${r.last_dose_day} | ${r.remind_on} | ${r.status} |`)].join('\n');

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const throwsWith = (fn, word) => { try { fn(); return false; } catch (e) { return e.message.includes(word); } };
  const D = (now, items) => dueDates({ today: now, items });
  t('พ.ศ. 2570 = ค.ศ. 2027', parseDate('2570-06-20', 'x') === Date.UTC(2027, 5, 20));
  t('ค.ศ. ไม่ถูกแปลง', parseDate('2027-06-20', 'x') === Date.UTC(2027, 5, 20));
  t('29 ก.พ. 2028 มีจริง', iso(parseDate('2028-02-29', 'x')) === '2028-02-29');
  t('29 ก.พ. 2027 ไม่มี', throwsWith(() => parseDate('2027-02-29', 'วัน'), 'ปฏิทิน'));
  t('29 ก.พ. พ.ศ. 2571 (ค.ศ. 2028) มีจริง', iso(parseDate('2571-02-29', 'x')) === '2028-02-29');
  t('รูปแบบผิด', throwsWith(() => parseDate('20/06/2027', 'วัน'), 'YYYY-MM-DD'));
  // today = due date: 0 days left, lead 90 -> do it now
  let r = D('2026-10-28', [{ name: 'a', end_date: '2026-10-28', lead_days: 90 }])[0];
  t('วันนี้ = วันครบ เหลือ 0 วัน ต้องทำตอนนี้', r.days_left === 0 && r.status === 'ต้องทำตอนนี้');
  r = D('2026-10-28', [{ name: 'a', end_date: '2026-10-27', lead_days: 0 }])[0];
  t('เมื่อวาน เลยกำหนด', r.days_left === -1 && r.status === 'เลยกำหนด');
  // lead edge: exactly lead days left = do now; one more day = not yet
  t('เหลือเท่าเวลานำพอดี', D('2026-10-28', [{ end_date: '2027-01-26', lead_days: 90 }])[0].status === 'ต้องทำตอนนี้');
  r = D('2027-02-27', [{ end_date: '2027-03-01', lead_days: 1.5 }])[0];
  t('เวลานำเป็นเศษปัดขึ้น', r.start_by === '2027-02-27' && r.status === 'ต้องทำตอนนี้');
  t('เหลือเกินเวลานำ 1 วัน', D('2026-10-28', [{ end_date: '2027-01-27', lead_days: 90 }])[0].status === 'ยังไม่ถึง');
  // across the year: 2026-12-20 -> 2027-01-10 = 21 days
  t('ข้ามปี 21 วัน', D('2026-12-20', [{ end_date: '2027-01-10', lead_days: 30 }])[0].days_left === 21);
  // leap day: 2028-02-01 -> 2028-03-01 = 29 days
  t('ข้าม 29 ก.พ. ปีอธิกสุรทิน', D('2028-02-01', [{ end_date: '2028-03-01', lead_days: 30 }])[0].days_left === 29);
  // Buddhist and Gregorian rows in one file, sorted by days left
  const rows = D('2026-10-28', [
    { name: 'ภาษีรถ', end_date: '2570-06-20', lead_days: 90 },
    { name: 'พาสปอร์ต', end_date: '2027-02-01', lead_days: 120 },
    { name: 'พ.ร.บ.', end_date: '2569-10-20', lead_days: 30 },
  ]);
  t('เรียงตามวัน', rows.map((x) => x.name).join() === 'พ.ร.บ.,พาสปอร์ต,ภาษีรถ');
  t('พ.ร.บ. เลยกำหนด 8 วัน', rows[0].days_left === -8 && rows[0].status === 'เลยกำหนด');
  t('ภาษีรถ พ.ศ. 2570 = 2027-06-20 เริ่มทำ 2027-03-22', rows[2].end_date === '2027-06-20' && rows[2].start_by === '2027-03-22');
  t('พาสปอร์ต เริ่มทำ 2026-10-04', rows[1].start_by === '2026-10-04' && rows[1].status === 'ต้องทำตอนนี้');
  t('lead_days ติดลบ', throwsWith(() => D('2026-10-28', [{ end_date: '2027-01-01', lead_days: -1 }]), 'lead_days'));
  t('ไม่มี items', throwsWith(() => dueDates({ today: '2026-10-28' }), 'items'));
  // refill: 60 pills, 2 per day, start on the 1st -> 30 days, last day 30th, remind 23rd
  const R = (refills, now = '2026-10-01') => refill({ today: now, refills });
  let f = R([{ name: 'a', on_hand: 60, per_day: 2, start_date: '2026-10-01' }])[0];
  t('60 เม็ด 2 ต่อวัน = 30 วัน', f.days_supply === 30);
  t('วันสุดท้าย 30 ต.ค. เตือน 23 ต.ค.', f.last_dose_day === '2026-10-30' && f.remind_on === '2026-10-23' && f.status === 'ยังไม่ถึง');
  f = R([{ on_hand: 15, per_day: 0.5, start_date: '2026-10-01' }])[0];
  t('ครึ่งเม็ดต่อวัน 15 เม็ด = 30 วัน', f.days_supply === 30);
  f = R([{ on_hand: 5, per_day: 2, start_date: '2026-10-01' }])[0];
  t('เศษเม็ดปัดลง 5 ÷ 2 = 2 วัน', f.days_supply === 2);
  f = R([{ on_hand: 0, per_day: 1, start_date: '2026-10-01' }])[0];
  t('0 เม็ด หมดแล้ว', f.days_supply === 0 && f.status === 'หมดแล้ว');
  t('เม็ดต่อวัน 0 ปฏิเสธ', throwsWith(() => R([{ on_hand: 10, per_day: 0 }]), 'per_day'));
  t('จำนวนติดลบ', throwsWith(() => R([{ on_hand: -1, per_day: 1 }]), 'on_hand'));
  f = R([{ on_hand: 60, per_day: 2, start_date: '2026-10-01' }], '2026-10-23')[0];
  t('ถึงวันเตือนพอดี ต้องสั่งยา', f.status === 'ต้องสั่งยาตอนนี้');
  f = R([{ on_hand: 60, per_day: 2, start_date: '2026-10-01' }], '2026-10-31')[0];
  t('เลยวันสุดท้าย หมดแล้ว', f.status === 'หมดแล้ว');
  f = R([{ on_hand: 20, per_day: 1, start_date: '2026-12-20' }])[0];
  t('ข้ามปี: วันสุดท้าย 2027-01-08', f.last_dose_day === '2027-01-08');
  t('start_date ไม่ใส่ = วันนี้', R([{ on_hand: 10, per_day: 1 }], '2026-10-05')[0].last_dose_day === '2026-10-14');
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('ใช้: node due-dates.mjs <ไฟล์.json> [--json] | --refill <ไฟล์.json> | --self-test'); process.exit(2); }
  try {
    const input = JSON.parse(readFileSync(file, 'utf8'));
    const mode = args.includes('--refill');
    const rows = mode ? refill(input) : dueDates(input);
    console.log(args.includes('--json') ? JSON.stringify(rows, null, 2) : (mode ? refillTable : dueTable)(rows));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
