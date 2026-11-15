#!/usr/bin/env node
/**
 * fingerprint.mjs — คำนวณ fingerprint ของ finding ให้คงที่ข้ามรอบ (สูตรเดียวกับที่ validate_findings ตรวจ)
 * ใช้: node fingerprint.mjs <class> <location.file> <location.symbol หรือ -> <entrypoint>
 * ตัวอย่าง: node fingerprint.mjs idor src/orders/order-service.js getOrder "src/routes/orders.js#GET /orders/:id"
 */
import { fingerprintOf } from './audit_lib.mjs';

const args = process.argv.slice(2);
if (args.length !== 4) {
  console.error('ใช้: node fingerprint.mjs <class> <location.file> <location.symbol หรือ -> <entrypoint>');
  process.exit(2);
}
const [cls, file, symbol, entrypoint] = args;
console.log(fingerprintOf(cls, file, symbol === '-' ? null : symbol, entrypoint));
