#!/usr/bin/env node
/**
 * validate_findings.mjs — ตรวจ findings.json ของ security-audit ตามสัญญาข้อมูลและกฎความหมาย
 * ใช้: node validate_findings.mjs <findings.json> [--ledger ledger.json] · node validate_findings.mjs --self-test
 * exit 0 ผ่าน · 1 ไม่ผ่าน · 2 ใช้ผิด · ผ่านแปลว่ารูปแบบและความสอดคล้องถูก ไม่ได้แปลว่าช่องโหว่จริง
 */
import { validateFiles, report } from './audit_lib.mjs';
import { runValidatorSelfTest } from './self_test.mjs';

const args = process.argv.slice(2);
if (args[0] === '--self-test') process.exit(runValidatorSelfTest('validate_findings', 'findings'));

const at = args.indexOf('--ledger');
const ledgerFile = at >= 0 ? args[at + 1] : undefined;
const rest = at < 0 ? args : args.filter((_, i) => i !== at && i !== at + 1);
if (rest.length !== 1 || rest[0].startsWith('--') || (at >= 0 && !ledgerFile)) {
  console.error('ใช้: node validate_findings.mjs <findings.json> [--ledger ledger.json] | --self-test');
  process.exit(2);
}
process.exit(report('validate_findings', validateFiles({ findingsFile: rest[0], ledgerFile })));
