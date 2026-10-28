#!/usr/bin/env node
// promptpay.mjs - build a PromptPay (EMVCo) QR payload string with CRC16 (Node stdlib only)
// Usage: node promptpay.mjs <file.json> [--json]   |   node promptpay.mjs --self-test
// File (tag 29, credit transfer): { "id": "081-234-5678", "amount": 1500 }
//   id = mobile (10 digits) · national/tax ID (13) · e-Wallet ID (15) · dashes and spaces allowed · amount optional (none = static QR)
// File (tag 30, bill payment):    { "billerId": "010555000000001", "ref1": "IV26100001", "ref2": "", "name": "SHOP", "amount": 1500 }
// Rules come from promptpay-qr/SKILL.md sections 1, 2 and Rules. Render the payload with any QR library.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AID_CREDIT_TRANSFER = 'A000000677010111'; // SKILL.md tag 29 sub-ID 00
const AID_BILL_PAYMENT = 'A000000677010112'; // SKILL.md tag 30 sub-ID 00
const MAX_AMOUNT_CHARS = 13; // SKILL.md Rules: amount max 13 chars
const MAX_REF_CHARS = 20; // SKILL.md tag 30: Ref1/Ref2 up to 20 chars
const MAX_NAME_CHARS = 25; // EMVCo merchant name field limit
const BILLER_ID_DIGITS = 15; // SKILL.md tag 30 sub-ID 01
const SUB_ID_BY_LENGTH = { 13: '02', 15: '03' }; // national/tax ID, e-Wallet ID (tag 29)

// สูตรเดียวกับ e-tax-invoice/scripts/thai-id.mjs แต่เขียนซ้ำไว้ เพราะ skill ต้องติดตั้งแยกกันได้
// หลักที่ 13 ของเลขบัตรประชาชน/ผู้เสียภาษี = (11 - (ผลรวมหลักที่ 1-12 x น้ำหนัก 13..2) mod 11) mod 10
const hasValidCheckDigit = (id) => (11 - ([...id.slice(0, 12)].reduce((s, d, i) => s + Number(d) * (13 - i), 0) % 11)) % 10 === Number(id[12]);

const field = (id, value) => id + String(value.length).padStart(2, '0') + value;
const isPrintableAscii = (v) => /^[ -~]*$/.test(v);
const digitsOnly = (v) => String(v ?? '').replace(/[\s-]/g, '');

// CRC-16/CCITT-FALSE: poly 0x1021, init 0xFFFF, no reflection, no final XOR
export function crc16(text) {
  let crc = 0xffff;
  for (const byte of Buffer.from(text, 'utf8')) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function validateAmount(a) {
  if (a === undefined) return;
  if (typeof a !== 'number' || !Number.isFinite(a) || a <= 0) throw new Error(`ช่อง amount ต้องเป็นตัวเลขมากกว่า 0 หรือไม่ใส่เลย (ได้ ${JSON.stringify(a)})`);
  if (Math.abs(a * 100 - Math.round(a * 100)) > 1e-6) throw new Error(`ช่อง amount ต้องไม่เกิน 2 ตำแหน่งทศนิยม (ได้ ${a})`);
  if (a.toFixed(2).length > MAX_AMOUNT_CHARS) throw new Error(`ช่อง amount ยาวเกิน ${MAX_AMOUNT_CHARS} ตัวอักษร`);
}

function validateName(name) {
  if (name === undefined) return;
  if (typeof name !== 'string' || name.length > MAX_NAME_CHARS) throw new Error(`ช่อง name ต้องเป็นข้อความไม่เกิน ${MAX_NAME_CHARS} ตัวอักษร`);
  if (!isPrintableAscii(name)) throw new Error('ช่อง name ต้องเป็นอักษร ASCII ที่พิมพ์ได้ ภาษาไทยใส่ไม่ได้ · แอปธนาคารแสดงชื่อจากบัญชี PromptPay อยู่แล้ว ไม่ต้องใส่ชื่อร้าน');
}

function validateBiller(input) {
  const warnings = [];
  if (digitsOnly(input.billerId).length !== BILLER_ID_DIGITS || !/^\d+$/.test(digitsOnly(input.billerId))) throw new Error(`ช่อง billerId ต้องเป็นตัวเลข ${BILLER_ID_DIGITS} หลัก (ได้ ${JSON.stringify(input.billerId)})`);
  if (!input.ref1) throw new Error('ช่อง ref1 ต้องมีเมื่อใช้ billerId (เช่น เลขที่ใบแจ้งหนี้)');
  for (const k of ['ref1', 'ref2']) {
    const v = input[k] ?? '';
    if (typeof v !== 'string' || v.length > MAX_REF_CHARS) throw new Error(`ช่อง ${k} ต้องเป็นข้อความไม่เกิน ${MAX_REF_CHARS} ตัวอักษร`);
    if (!isPrintableAscii(v)) throw new Error(`ช่อง ${k} ต้องเป็นอักษร ASCII ที่พิมพ์ได้ (ภาษาไทยใส่ไม่ได้ ความยาวจะไม่ตรงกับ CRC)`);
    if (v && !/^[A-Z0-9]+$/.test(v)) warnings.push(`${k} "${v}" ไม่ใช่ A-Z 0-9 ล้วน · ธนาคารบางแห่งไม่รับ ตรวจกับสเปกบิลเลอร์`);
  }
  return warnings;
}

// Throws a Thai message naming the bad field; returns warnings (list of strings).
export function validate(input) {
  if (!input || typeof input !== 'object') throw new Error('ไฟล์ต้องเป็นอ็อบเจกต์ JSON');
  validateAmount(input.amount);
  validateName(input.name);
  if (input.billerId !== undefined) return validateBiller(input);
  const id = digitsOnly(input.id);
  if (!/^\d+$/.test(id)) throw new Error(`ช่อง id ต้องเป็นตัวเลข (ได้ ${JSON.stringify(input.id)})`);
  if (![10, 13, 15].includes(id.length)) throw new Error(`ช่อง id ต้องเป็นเบอร์มือถือ 10 หลัก เลขบัตร/ผู้เสียภาษี 13 หลัก หรือ e-Wallet 15 หลัก (ได้ ${id.length} หลัก)`);
  if (id.length === 10 && !id.startsWith('0')) throw new Error('ช่อง id เบอร์มือถือ 10 หลักต้องขึ้นต้นด้วย 0');
  if (id.length === 13 && !hasValidCheckDigit(id)) throw new Error(`ช่อง id เลข 13 หลัก ${id} ไม่ผ่านการตรวจหลักตรวจสอบ · เลขน่าจะพิมพ์ผิด ตรวจกับบัตรหรือใบทะเบียนอีกครั้งก่อนสร้าง QR (QR ที่เลขผิดสแกนได้แต่เงินไปหาคนอื่น)`);
  return [];
}

function accountField(input) {
  if (input.billerId !== undefined) {
    const ref2 = input.ref2 ? field('03', input.ref2) : '';
    return field('30', field('00', AID_BILL_PAYMENT) + field('01', digitsOnly(input.billerId)) + field('02', input.ref1) + ref2);
  }
  const id = digitsOnly(input.id);
  const sub = id.length === 10 ? field('01', '0066' + id.slice(1)) : field(SUB_ID_BY_LENGTH[id.length], id);
  return field('29', field('00', AID_CREDIT_TRANSFER) + sub);
}

export function buildPayload(input) {
  const warnings = validate(input);
  const hasAmount = input.amount !== undefined;
  const body = field('00', '01') + field('01', hasAmount ? '12' : '11') + accountField(input)
    + field('58', 'TH') + field('53', '764') + (hasAmount ? field('54', input.amount.toFixed(2)) : '')
    + (input.name ? field('59', input.name) : '') + '6304';
  return { payload: body + crc16(body), kind: hasAmount ? 'dynamic' : 'static', warnings };
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const throwsWith = (inp, word) => { try { buildPayload(inp); return false; } catch (e) { return e.message.includes(word); } };
  const crcHolds = (p) => crc16(p.slice(0, -4)) === p.slice(-4);
  t('CRC มาตรฐาน 123456789 = 29B1', crc16('123456789') === '29B1');
  // SKILL.md section 3 worked examples, 081-234-5678
  t('static ตรงตัวอย่าง SKILL', buildPayload({ id: '0812345678' }).payload === '00020101021129370016A000000677010111011300668123456785802TH530376463045D82');
  t('dynamic 1500 ตรงตัวอย่าง SKILL', buildPayload({ id: '081-234-5678', amount: 1500 }).payload === '00020101021229370016A000000677010111011300668123456785802TH530376454071500.0063046960');
  const nid = buildPayload({ id: '1234567890121', amount: 100 }).payload;
  t('เลขบัตร ใช้ sub-ID 02 ยาว 13', nid.includes('29370016A000000677010111' + '02131234567890121') && crcHolds(nid));
  t('เลข 13 หลักผิดหลักตรวจสอบ (edge/pp1)', throwsWith({ id: '1234567890123', amount: 100 }, 'หลักตรวจสอบ'));
  t('เลข 13 หลักมีขีดและผ่านหลักตรวจสอบ', buildPayload({ id: '1-2345-67890-12-1' }).kind === 'static');
  const wallet = buildPayload({ id: '123456789012345' }).payload;
  t('e-Wallet ใช้ sub-ID 03 ยาว 15 และ tag 29 ยาว 39', wallet.includes('29390016A000000677010111' + '0315123456789012345') && crcHolds(wallet));
  const bill = buildPayload({ billerId: '010555000000001', ref1: 'IV26100001', name: 'SHOP', amount: 20800 });
  const subs = '0016A000000677010112' + '0115010555000000001' + '0210IV26100001';
  t('tag 30 ยาวเท่าผลรวม sub-field', bill.payload.includes('30' + subs.length + subs + '5802TH5303764' + '5408' + '20800.00' + '5904SHOP6304') && crcHolds(bill.payload));
  t('ref2 ใส่ sub-ID 03', buildPayload({ billerId: '010555000000001', ref1: 'A1', ref2: 'B2' }).payload.includes('0302B2'));
  t('มี amount = dynamic ไม่มี = static', buildPayload({ id: '0812345678', amount: 1 }).kind === 'dynamic' && buildPayload({ id: '0812345678' }).kind === 'static');
  t('amount 5.5 เติมเป็น 5.50', buildPayload({ id: '0812345678', amount: 5.5 }).payload.includes('54045.50'));
  t('ref1 มีขีดเตือน', buildPayload({ billerId: '010555000000001', ref1: 'IV-1' }).warnings.length === 1);
  t('id ผิดความยาว', throwsWith({ id: '08123' }, 'id'));
  t('id มีตัวอักษร', throwsWith({ id: '08123abc78' }, 'id'));
  t('มือถือไม่ขึ้นต้น 0', throwsWith({ id: '8123456789' }, 'ขึ้นต้นด้วย 0'));
  t('amount ติดลบ', throwsWith({ id: '0812345678', amount: -1 }, 'amount'));
  t('amount เป็นข้อความ', throwsWith({ id: '0812345678', amount: '100' }, 'amount'));
  t('amount ทศนิยม 3 ตำแหน่ง', throwsWith({ id: '0812345678', amount: 1.234 }, 'amount'));
  t('billerId ไม่ครบ 15 หลัก', throwsWith({ billerId: '123', ref1: 'A' }, 'billerId'));
  t('name ภาษาไทยโดน error', throwsWith({ id: '0812345678', name: 'ร้านดี' }, 'name'));
  t('ref1 ภาษาไทยโดน error', throwsWith({ billerId: '010555000000001', ref1: 'ใบ1' }, 'ref1'));
  t('name ASCII ผ่านและ CRC ถูก', crcHolds(buildPayload({ id: '0812345678', name: 'SHOP 1' }).payload));
  t('ไม่มี ref1', throwsWith({ billerId: '010555000000001' }, 'ref1'));
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

// รัน CLI เฉพาะตอนเรียกไฟล์นี้ตรง ๆ · import จากสคริปต์อื่นได้โดยไม่ออก
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const args = process.argv.slice(2);
if (!isMain) { /* imported */ } else if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('ใช้: node promptpay.mjs <ไฟล์.json> [--json] | --self-test'); process.exit(2); }
  try {
    const r = buildPayload(JSON.parse(readFileSync(file, 'utf8')));
    if (args.includes('--json')) console.log(JSON.stringify(r, null, 2));
    else console.log([...r.warnings.map((w) => `คำเตือน: ${w}`), `QR แบบ ${r.kind === 'dynamic' ? 'dynamic (ระบุยอด)' : 'static (ผู้จ่ายใส่ยอดเอง)'}`, r.payload].join('\n'));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
