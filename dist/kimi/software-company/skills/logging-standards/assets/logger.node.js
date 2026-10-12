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
 */
'use strict';

const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

/* ---------------------------------------------------------------- redaction
   คีย์ที่ห้ามหลุดลง log ไม่ว่ากรณีใด — ตัดตั้งแต่ก่อนเข้า formatter
   ตรวจแบบ "ชื่อคีย์มีคำนี้อยู่" เพราะของจริงมาหลายชื่อ (userPassword, pwd, ...) */
const SECRET_KEYS = [
  'password', 'passwd', 'pwd', 'secret', 'token', 'authorization', 'cookie',
  'apikey', 'api_key', 'accesstoken', 'refreshtoken', 'otp', 'pin',
  'creditcard', 'cardnumber', 'cvv', 'citizenid', 'nationalid', 'ssn',
];

function redact(value, depth = 0) {
  if (depth > 4 || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    const isSecret = SECRET_KEYS.some((s) => k.toLowerCase().includes(s));
    out[k] = isSecret ? '***' : redact(v, depth + 1);
  }
  return out;
}

/* ------------------------------------------------------------ log injection
   ค่าที่มาจากผู้ใช้อาจมี \n — ถ้าปล่อยผ่าน ผู้ใช้จะ "แต่ง" บรรทัด log ปลอมได้
   ทำให้คนอ่าน log เข้าใจผิด และ parser พัง */
function safe(v) {
  if (v === null || v === undefined) return '-';
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  const clean = s.replace(/[\r\n\t]+/g, ' ').trim();
  return clean.includes(' ') ? `"${clean.replace(/"/g, "'")}"` : clean;
}

const RESERVED = new Set(['level', 'message', 'timestamp', 'source', 'cid', 'stack', 'splat']);

const lineFormat = winston.format.printf((info) => {
  const cid = info.cid || '------';
  const src = info.source || 'app';
  const ctx = Object.entries(info)
    .filter(([k]) => !RESERVED.has(k) && !k.startsWith('Symbol('))
    .map(([k, v]) => `${k}=${safe(v)}`)
    .join(' ');
  const head = `${info.timestamp}  ${info.level.toUpperCase().padEnd(5)}  [${cid}] ${src}  ${info.message}`;
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
  return logger.child({ cid: (cid || '------').slice(0, 8) });
}

module.exports = { logger, withCorrelation, redact, safe };
