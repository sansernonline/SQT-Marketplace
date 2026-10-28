/**
 * logger.node.js — logger มาตรฐานสำหรับ Node / TypeScript
 *   npm i winston winston-daily-rotate-file
 *
 * ให้รูปแบบบรรทัดตามมาตรฐานเดียวกับ .NET / Python ใน skill นี้:
 *   2026-08-31 09:42:13.482 +07:00  INFO  [a3f9c1] orders  สร้างคำสั่งซื้อสำเร็จ  orderId=1042 ms=134
 *
 * ใช้:
 *   const { logger, withCorrelation, redact } = require('./logger.node');
 *   const log = withCorrelation(req.id).child({ source: 'orders' });
 *   log.info('สร้างคำสั่งซื้อสำเร็จ', { orderId: 1042, ms: 134 });
 *
 * TypeScript: เปลี่ยนเป็น import แล้ว type ของ winston มากับแพ็กเกจอยู่แล้ว
 *
 * ทดสอบ:  node logger.node.js --self-test     (ต้องลง winston ก่อน · ไม่มี → ข้ามและบอกชัด)
 */
'use strict';

if (require.main === module && process.argv.includes('--self-test')) {
  try {
    require.resolve('winston');
    require.resolve('winston-daily-rotate-file');
  } catch {
    console.log('SKIP self-test: ไม่มี winston (npm i winston winston-daily-rotate-file)');
    process.exit(0);
  }
}

const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

/* ---------------------------------------------------------------- redaction
   คีย์ที่ห้ามหลุดลง log ไม่ว่ากรณีใด — ตัดตั้งแต่ก่อนเข้า formatter
   แยกชื่อ key เป็นส่วนตาม _ - และตัวพิมพ์ใหญ่ ทิ้งส่วนที่เป็นคำธรรมดาทั้งคำ (shipping, className) แล้วต่อที่เหลือ
   ลับเมื่อมีคำในรายการอยู่ข้างใน เหมือนการเทียบแบบมีอยู่ในชื่อ จึงจับได้ทุกตัวที่การเทียบแบบเดิมจับได้
   ยกเว้นชื่อที่คำลับคร่อมคำธรรมดา (AddressSn, ShotProcess) ซึ่งไม่ใช่ key ลับจริง
   (OTPs, customersPin, X-Api-Key) · ปิดเกินได้เมื่อคำลับเกิดจากรอยต่อ (access_number) ซึ่งเสียน้อยกว่าหลุด */
const SECRET_PARTS = [
  'password', 'passwd', 'pwd', 'secret', 'token', 'authorization', 'cookie', 'apikey',
  'otp', 'pin', 'creditcard', 'cardnumber', 'cvv', 'citizenid', 'nationalid', 'ssn',
];
const NOT_SECRET = new Set([
  'shipping', 'shopping', 'mapping', 'typing', 'ping', 'spin', 'spinner', 'opinion',
  'class', 'classname', 'business', 'process', 'address', 'screenshot',
]);
const isSecret = (k) => {
  const parts = k.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const name = parts.filter((p) => !NOT_SECRET.has(p)).join('');
  return SECRET_PARTS.some((s) => name.includes(s));
};
const CARD = /(?<!\d)(?:\d[ -]?){12,18}\d(?!\d)/g; // เลขบัตร 13-19 หลักในข้อความอิสระ
const luhn = (digits) => [...digits].reverse().reduce((s, c, i) => {
  const d = Number(c) * (i % 2 ? 2 : 1);
  return s + (d > 9 ? d - 9 : d);
}, 0) % 10 === 0;
// ปิดเฉพาะเลขที่ผ่าน Luhn · เลขยาวอื่น (timestamp เลขออเดอร์) ราว 1 ใน 10 ผ่าน Luhn โดยบังเอิญจึงโดนปิดด้วย
const maskCards = (text) => text.replace(CARD, (m) => (luhn(m.replace(/\D/g, '')) ? '***' : m));

function redact(value, depth = 0) {
  if (depth > 4 || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = isSecret(k) ? '***' : redact(v, depth + 1);
  }
  return out;
}

/* ------------------------------------------------------------ log injection
   ค่าที่มาจากผู้ใช้อาจมี \n — ถ้าปล่อยผ่าน ผู้ใช้จะ "แต่ง" บรรทัด log ปลอมได้
   ทำให้คนอ่าน log เข้าใจผิด และ parser พัง */
function safe(v) {
  if (v === null || v === undefined) return '-';
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  const clean = maskCards(s.replace(/[\r\n\t]+/g, ' ').trim());
  return clean.includes(' ') ? `"${clean.replace(/"/g, "'")}"` : clean;
}

const RESERVED = new Set(['level', 'message', 'timestamp', 'source', 'cid', 'stack', 'splat']);

const lineFormat = winston.format.printf((info) => {
  const cid = info.cid || '--------';
  const src = info.source || 'app';
  const ctx = Object.entries(info)
    .filter(([k]) => !RESERVED.has(k) && !k.startsWith('Symbol('))
    .map(([k, v]) => `${k}=${safe(v)}`)
    .join(' ');
  const head = `${info.timestamp}  ${info.level.toUpperCase().padEnd(5)}  [${cid}] ${src}  ${maskCards(String(info.message).replace(/[\r\n\t]+/g, ' ').trim())}`;
  const body = ctx ? `${head}  ${ctx}` : head;
  // stack trace ขึ้นบรรทัดใหม่ได้ — เยื้อง 4 ช่องเพื่อให้เห็นว่าเป็นส่วนต่อของบรรทัดบน
  return info.stack ? `${body}\n    ${info.stack.replace(/\n/g, '\n    ')}` : body;
});

const LOG_DIR = process.env.LOG_DIR || 'logs';
const LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const baseFormat = winston.format.combine(
  winston.format((info) => Object.assign(info, redact(info)))(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS ZZ' }),
  winston.format.errors({ stack: true }),
  lineFormat,
);

const logger = winston.createLogger({
  level: LEVEL,
  format: baseFormat,
  transports: [
    // ไฟล์รวมทุกระดับ — หมุนรายวัน เก็บ 30 วัน จำกัดขนาดกันดิสก์เต็ม
    new winston.transports.DailyRotateFile({
      dirname: LOG_DIR,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYYMMDD',
      maxSize: '100m',
      maxFiles: '30d',
      zippedArchive: true,
    }),
    // ไฟล์เฉพาะ error — เวลามีปัญหาจะได้ไม่ต้องไล่หาในไฟล์รวม
    new winston.transports.DailyRotateFile({
      dirname: LOG_DIR,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYYMMDD',
      level: 'error',
      maxSize: '100m',
      maxFiles: '90d',
      zippedArchive: true,
    }),
    new winston.transports.Console(),
  ],
  // อย่าให้แอปตายเงียบ ๆ โดยไม่มี log
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(LOG_DIR, 'fatal.log') }),
  ],
  exitOnError: false,
});

/** ผูก correlation id เข้ากับ logger — เรียกครั้งเดียวต่อ request */
function withCorrelation(cid) {
  return logger.child({ cid: (cid || '--------').slice(0, 8) });
}

module.exports = { logger, withCorrelation, redact, safe };

/* self-test: ตรวจฟังก์ชันปิดข้อมูลลับและกัน log injection (ไม่เขียนไฟล์ log) */
function selfTest() {
  const assert = require('assert');
  const results = [];
  const t = (name, fn) => { try { fn(); results.push([name, true]); } catch (e) { results.push([name, false, e.message]); } };
  const r = redact({ orderId: 1042, password: 'hunter2', shipping: 'ems', nested: { apiKey: 'k', list: [{ OTP: '1' }] } });
  t('password ถูกปิด', () => assert.strictEqual(r.password, '***'));
  t('orderId และ shipping ไม่ถูกปิดเกิน', () => assert.deepStrictEqual([r.orderId, r.shipping], [1042, 'ems']));
  t('key ซ้อนข้างในและใน array ก็ปิด', () => assert.deepStrictEqual([r.nested.apiKey, r.nested.list[0].OTP], ['***', '***']));
  t('ชื่อ camelCase จับได้ (customersPin) แต่ className ไม่', () =>
    assert.deepStrictEqual([redact({ customersPin: 1 }).customersPin, redact({ className: 'x' }).className], ['***', 'x']));
  t('safe: ตัวขึ้นบรรทัดกลายเป็นช่องว่าง + ครอบด้วย "', () => assert.strictEqual(safe('a\nb'), '"a b"'));
  t('safe: เครื่องหมายคำพูดข้างในเปลี่ยนเป็นฟันหนู', () => assert.strictEqual(safe('say "hi"'), `"say 'hi'"`));
  t('safe: null เป็น -', () => assert.strictEqual(safe(null), '-'));
  t('safe: เลขบัตรที่ผ่าน Luhn ถูกปิด', () => assert.ok(!safe('card 4111 1111 1111 1111 ok').includes('4111')));
  t('safe: เลขยาวที่ไม่ผ่าน Luhn ไม่ถูกปิด', () => assert.strictEqual(safe('1234567890123457'), '1234567890123457'));
  results.forEach(([n, ok, m]) => console.log(ok ? 'ok  ' : 'FAIL', n, ok ? '' : m));
  const passed = results.filter((x) => x[1]).length;
  console.log(`self-test ${passed}/${results.length}`);
  process.exit(passed === results.length ? 0 : 1);
}

if (require.main === module && process.argv.includes('--self-test')) selfTest();
