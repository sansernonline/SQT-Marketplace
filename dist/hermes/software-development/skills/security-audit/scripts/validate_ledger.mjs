#!/usr/bin/env node
/**
 * validate_ledger.mjs — ตรวจ ledger.json (ตารางความครอบคลุม) ของ security-audit · แถว pending ที่เหลือเป็นคำเตือน
 * ใช้: node validate_ledger.mjs <ledger.json> [--findings findings.json] · node validate_ledger.mjs --self-test
 * exit 0 ผ่าน · 1 ไม่ผ่าน · 2 ใช้ผิด · ผ่านแปลว่ารูปแบบและความสอดคล้องถูก ไม่ได้แปลว่าช่องโหว่จริง
 */
import { validateFiles, report } from './audit_lib.mjs';
import { runValidatorSelfTest } from './self_test.mjs';

const args = process.argv.slice(2);
if (args[0] === '--self-test') process.exit(runValidatorSelfTest('validate_ledger', 'ledger'));

const at = args.indexOf('--findings');
const findingsFile = at >= 0 ? args[at + 1] : undefined;
const rest = at < 0 ? args : args.filter((_, i) => i !== at && i !== at + 1);
if (rest.length !== 1 || rest[0].startsWith('--') || (at >= 0 && !findingsFile)) {
  console.error('ใช้: node validate_ledger.mjs <ledger.json> [--findings findings.json] | --self-test');
  process.exit(2);
}
process.exit(report('validate_ledger', validateFiles({ ledgerFile: rest[0], findingsFile })));
