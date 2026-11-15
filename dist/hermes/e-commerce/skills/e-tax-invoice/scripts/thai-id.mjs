#!/usr/bin/env node
// thai-id.mjs - check the 13-digit Thai national ID / tax ID check digit (Node stdlib only)
// Usage: node thai-id.mjs <file.json> [--json]   |   node thai-id.mjs <id> [<id> ...]   |   node thai-id.mjs --self-test
// File: { "ids": ["0105536000001", "1-2345-6789-01-23"] }   (dashes and spaces allowed)
// Rule: last digit = (11 - (sum of digit i x (14 - i), i = 1..12) mod 11) mod 10. It catches typos only; it does not prove the ID exists.
// Other scripts that need this check copy isValidThaiId (e.g. doc-quotation/scripts/thai-doc-total.mjs) - this file is the original.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ID_DIGITS = 13;

export const normalizeThaiId = (v) => String(v ?? '').replace(/[\s-]/g, '');

export function thaiIdCheckDigit(first12) {
  const sum = [...first12].reduce((s, d, i) => s + Number(d) * (13 - i), 0);
  return (11 - (sum % 11)) % 10;
}

// Returns { ok, id, reason } - reason is a Thai message when not ok.
export function checkThaiId(value) {
  const id = normalizeThaiId(value);
  if (!/^\d+$/.test(id)) return { ok: false, id, reason: 'มีตัวอักษรที่ไม่ใช่ตัวเลข' };
  if (id.length !== ID_DIGITS) return { ok: false, id, reason: `ต้องมี ${ID_DIGITS} หลัก (ได้ ${id.length} หลัก)` };
  const want = thaiIdCheckDigit(id.slice(0, 12));
  if (want !== Number(id[12])) return { ok: false, id, reason: `หลักตรวจสอบไม่ตรง (หลักสุดท้ายควรเป็น ${want})` };
  return { ok: true, id, reason: '' };
}

export const isValidThaiId = (value) => checkThaiId(value).ok;

// Throws a Thai message naming the bad field.
export function validate(input) {
  if (!input || typeof input !== 'object') throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  if (!Array.isArray(input.ids) || input.ids.length === 0) throw new Error('ช่อง ids ต้องเป็นรายการเลขอย่างน้อย 1 ตัว');
}

export function checkAll(input) {
  validate(input);
  return input.ids.map(checkThaiId);
}

export function report(results) {
  return ['| เลข | ผล |', '|---|---|', ...results.map((r) => `| ${r.id} | ${r.ok ? 'ถูกต้อง' : `ไม่ผ่าน · ${r.reason}`} |`)].join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  // by hand: 1,2,3,4,5,6,7,8,9,0,1,3 x 13..2 = 354 · 354 mod 11 = 2 · 11-2 = 9
  t('คิดมือ 1234567890139 ผ่าน', isValidThaiId('1234567890139'));
  t('หลักสุดท้ายผิด 1234567890138', !isValidThaiId('1234567890138'));
  // same digits ending 1,2: sum 352 = 32 x 11, mod 0 -> 11 -> 11 mod 10 = 1
  t('ผลรวม 352 หลักตรวจ 1', isValidThaiId('1234567890121'));
  // sum 11 (3x3 + 1x2) mod 11 = 0 -> 11 -> 11 mod 10 = 1
  t('ผลรวมหาร 11 ลงตัว หลักตรวจ 1', thaiIdCheckDigit('000000000031') === 1 && isValidThaiId('0000000000311'));
  // sum 12 (2x3 + 3x2) mod 11 = 1 -> 10 -> 10 mod 10 = 0
  t('เศษ 1 หลักตรวจ 0', thaiIdCheckDigit('000000000023') === 0 && isValidThaiId('0000000000230'));
  t('มีขีดและช่องว่าง', isValidThaiId('1-2345-67890-13-9') && isValidThaiId(' 1234 5678 90139 '));
  t('ส่งเป็นตัวเลข 311 ไม่ผ่าน (ศูนย์นำหน้าหาย)', !isValidThaiId(311));
  t('12 หลัก', checkThaiId('123456789012').reason.includes('13 หลัก'));
  t('14 หลัก', !isValidThaiId('12345678901234'));
  t('มีตัวอักษร', !isValidThaiId('12345678901ab'));
  t('ว่าง/undefined', !isValidThaiId('') && !isValidThaiId(undefined));
  t('ข้อความบอกหลักที่ควรเป็น', checkThaiId('1234567890138').reason.includes('ควรเป็น 9'));
  const throwsWith = (inp, word) => { try { checkAll(inp); return false; } catch (e) { return e.message.includes(word); } };
  t('ไม่มี ids', throwsWith({}, 'ids'));
  t('ids ว่าง', throwsWith({ ids: [] }, 'ids'));
  t('checkAll หลายตัว', checkAll({ ids: ['1234567890139', '1234567890138'] }).map((r) => r.ok).join() === 'true,false');
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) selfTest();
  else {
    const rest = args.filter((a) => !a.startsWith('--'));
    if (rest.length === 0) { console.error('ใช้: node thai-id.mjs <ไฟล์.json> [--json] | <เลข> ... | --self-test'); process.exit(2); }
    try {
      const input = rest[0].endsWith('.json') ? JSON.parse(readFileSync(rest[0], 'utf8')) : { ids: rest };
      const results = checkAll(input);
      console.log(args.includes('--json') ? JSON.stringify(results, null, 2) : report(results));
      process.exit(results.every((r) => r.ok) ? 0 : 1);
    } catch (e) {
      console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${rest[0]} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${rest[0]}` : e.message}`);
      process.exit(2);
    }
  }
}
