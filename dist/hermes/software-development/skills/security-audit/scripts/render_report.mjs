#!/usr/bin/env node
/**
 * render_report.mjs — สร้าง REPORT.md และ NEEDS-VALIDATION.md ภาษาไทย จาก findings.json (+ ledger.json ถ้ามี) ในโฟลเดอร์เดียวกัน
 * ใช้: node render_report.mjs <dir> [--force] · node render_report.mjs --self-test
 * ตรวจข้อมูลก่อนเขียนเสมอ ผิดแม้ข้อเดียวไม่เขียน · มีไฟล์อยู่แล้วไม่เขียนทับเว้นแต่ใส่ --force
 * exit 0 เขียนแล้ว · 1 ข้อมูลผิดหรือมีไฟล์อยู่แล้ว · 2 ใช้ผิด
 */
import { existsSync, readFileSync, writeFileSync, rmSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { validateFiles, report, SEVERITIES, STATUSES } from './audit_lib.mjs';
import { FIXTURES, tempDir } from './self_test.mjs';

const OWASP_2025 = {
  A01: 'Broken Access Control', A02: 'Security Misconfiguration', A03: 'Software Supply Chain Failures',
  A04: 'Cryptographic Failures', A05: 'Injection', A06: 'Insecure Design', A07: 'Authentication Failures',
  A08: 'Software or Data Integrity Failures', A09: 'Security Logging and Alerting Failures', A10: 'Mishandling of Exceptional Conditions',
};
const VERDICT_TH = { confirmed: 'ยืนยันแล้ว (confirmed)', needs_validation: 'รอยืนยัน (needs_validation)', rejected: 'ตัดทิ้ง (rejected)' };
const SEVERITY_TH = { critical: 'วิกฤต', high: 'สูง', medium: 'กลาง', low: 'ต่ำ', info: 'ข้อสังเกต' };
const STATUS_TH = { pending: 'ยังไม่ตรวจ', checked: 'ตรวจแล้ว', not_applicable: 'ไม่เกี่ยว', blocked: 'ติด' };

const cell = (v) => (v === null || v === undefined || v === '' ? '-' : String(v).replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' '));
const row = (cols) => `| ${cols.map(cell).join(' | ')} |`;
const table = (head, rows) => [row(head), `|${head.map(() => '---').join('|')}|`, ...rows.map(row)].join('\n');
const count = (list, test) => list.filter(test).length;
const where = (f) => `\`${f.location.file}${f.location.line ? `:${f.location.line}` : ''}\`${f.location.symbol ? ` · \`${f.location.symbol}\`` : ''}`;
// หลักฐานอาจมี backtick จึงล้อมด้วย ~~~~ ซึ่งไม่ชนกับ ``` ในเนื้อ
const block = (text) => `~~~~text\n${text}\n~~~~`;
const pdpaText = (p) => (p.personal_data ? `เกี่ยว · ${p.kinds.join(' · ')}` : 'ไม่เกี่ยว');

function detail(f) {
  return [
    `### ${f.id} · ${f.title}`,
    '',
    `- ระดับ: ${SEVERITY_TH[f.severity]} (${f.severity}) · OWASP: ${f.owasp ?? '-'} · ${f.cwe ?? 'ไม่มี CWE'} · ประเภท: ${f.class}`,
    `- ตำแหน่ง: ${where(f)}`,
    `- ทางเข้า: \`${f.entrypoint}\``,
    `- ข้อมูลส่วนบุคคล (PDPA): ${pdpaText(f.pdpa)}`,
    `- เงื่อนไข: ${f.preconditions?.length ? f.preconditions.join(' · ') : 'ไม่มี'}`,
    `- พบโดย ${f.hunted_by} · ยืนยันโดย ${f.verified_by} · fingerprint \`${f.fingerprint}\``,
    '',
    'เส้นทาง:',
    '',
    ...f.trace.map((t, i) => `${i + 1}. \`${t.file}:${t.line}\` ${t.note}`),
    '',
    `ผลกระทบ: ${f.impact}`,
    '',
    'หลักฐาน:',
    '',
    block(f.evidence),
    '',
    `วิธีแก้: ${f.fix}`,
  ].join('\n');
}

function renderReport({ audit, findings }, ledger) {
  const confirmed = findings.filter((f) => f.verdict === 'confirmed')
    .sort((a, b) => SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) || a.id.localeCompare(b.id));
  const rejected = findings.filter((f) => f.verdict === 'rejected');
  const nvCount = count(findings, (f) => f.verdict === 'needs_validation');
  const parts = [
    `# รายงานตรวจความปลอดภัย · ${audit.repo}`,
    '',
    `วันที่ตรวจ ${audit.date} · commit \`${audit.commit}\` · โปรไฟล์ ${audit.profile} · สร้างจาก findings.json ด้วย render_report.mjs`,
    '',
    '## สรุป',
    '',
    table(['คำตัดสิน', 'จำนวน'], Object.keys(VERDICT_TH).map((v) => [VERDICT_TH[v], count(findings, (f) => f.verdict === v)])),
    '',
    table(['ระดับ (เฉพาะที่ยืนยันแล้ว)', 'จำนวน'], SEVERITIES.map((s) => [`${SEVERITY_TH[s]} (${s})`, count(confirmed, (f) => f.severity === s)])),
    '',
    nvCount ? `มี ${nvCount} ข้อที่ยังต้องยืนยันกับระบบจริง ดู NEEDS-VALIDATION.md` : 'ไม่มีข้อที่รอยืนยัน',
    '',
    '## สำหรับเจ้าของกิจการ',
    '',
    confirmed.length
      ? table(['รหัส', 'ระดับ', 'เรื่อง', 'ผลต่อธุรกิจ', 'ข้อมูลส่วนบุคคล'], confirmed.map((f) => [f.id, SEVERITY_TH[f.severity], f.title, f.owner_impact_th, pdpaText(f.pdpa)]))
      : 'ไม่พบช่องโหว่ที่ยืนยันแล้วในรอบนี้',
    '',
    '## OWASP Top 10:2025',
    '',
    table(['หมวด', 'ชื่อ', 'ยืนยันแล้ว', 'รหัส'], Object.entries(OWASP_2025).map(([code, name]) => {
      const hits = confirmed.filter((f) => f.owasp === code);
      return [code, name, hits.length, hits.map((f) => f.id).join(' · ')];
    })),
    '',
    `ยืนยันแล้วแต่ไม่อยู่ในหมวดใด: ${count(confirmed, (f) => !f.owasp)} ข้อ · ตารางนี้นับเฉพาะที่พบ ไม่ได้บอกว่าหมวดที่เป็น 0 ปลอดภัย`,
    '',
    '## รายละเอียดข้อที่ยืนยันแล้ว',
    '',
    confirmed.length ? confirmed.map(detail).join('\n\n') : 'ไม่มี',
    '',
    '## ข้อที่ตัดทิ้ง',
    '',
    rejected.length ? table(['รหัส', 'เรื่อง', 'เหตุผล'], rejected.map((f) => [f.id, f.title, f.reject_reason])) : 'ไม่มี',
  ];
  if (ledger) {
    const pending = ledger.rows.filter((r) => r.status === 'pending');
    const blocked = ledger.rows.filter((r) => r.status === 'blocked');
    parts.push('', '## ความครอบคลุม', '',
      table(['สถานะ', 'จำนวนหน่วย'], STATUSES.map((s) => [`${STATUS_TH[s]} (${s})`, count(ledger.rows, (r) => r.status === s)])),
      '', pending.length ? `ยังไม่ได้ตรวจ ${pending.length} หน่วย: ${pending.map((r) => r.coverage_id).join(' · ')} — รอบนี้จึงยังไม่ครบ` : blocked.length ? `ตรวจครบทุกหน่วยที่ไม่ติด · ติด ${blocked.length} หน่วย (ตารางด้านล่าง)` : 'ตรวจครบทุกหน่วยที่วางไว้');
    if (blocked.length) parts.push('', table(['หน่วยที่ติด', 'เหตุผล'], blocked.map((r) => [r.coverage_id, r.note])));
  }
  return parts.join('\n') + '\n';
}

function renderNeedsValidation({ audit, findings }) {
  const list = findings.filter((f) => f.verdict === 'needs_validation');
  const head = [`# ข้อที่รอยืนยัน · ${audit.repo}`, '', `วันที่ตรวจ ${audit.date} · commit \`${audit.commit}\``, '',
    'แต่ละข้อมีหลักฐานจากโค้ดแล้ว แต่ยังขาดข้อเท็จจริงจากระบบจริง ทำตาม "วิธีตรวจ" แล้วแจ้งผลกลับ ข้อจะถูกย้ายเป็นยืนยันแล้วหรือตัดทิ้ง', ''];
  if (!list.length) return [...head, 'ไม่มีข้อที่รอยืนยัน', ''].join('\n');
  return [...head, ...list.flatMap((f) => [
    `## ${f.id} · ${f.title}`, '',
    `- ตำแหน่ง: ${where(f)} · OWASP: ${f.owasp ?? '-'}`,
    `- ถ้าเป็นจริง: ${f.owner_impact_th || f.impact || '-'}`,
    `- ยังขาด: ${f.missing}`,
    `- วิธีตรวจ: ${f.check_plan}`, '',
  ])].join('\n');
}

// ตรวจแล้วเขียน · คืน exit code
function render(dir, force) {
  const ledgerFile = join(dir, 'ledger.json');
  const result = validateFiles({ findingsFile: join(dir, 'findings.json'), ledgerFile: existsSync(ledgerFile) ? ledgerFile : undefined });
  if (result.errors.length) return report('render_report (ข้อมูลผิด ไม่เขียน)', result);
  const outputs = { 'REPORT.md': renderReport(result.findings, result.ledger), 'NEEDS-VALIDATION.md': renderNeedsValidation(result.findings) };
  const existing = Object.keys(outputs).filter((name) => existsSync(join(dir, name)));
  if (existing.length && !force) {
    console.log(`มี ${existing.join(' · ')} อยู่แล้ว — ไม่เขียนทับ ใส่ --force ถ้าต้องการ`);
    return 1;
  }
  for (const [name, text] of Object.entries(outputs)) writeFileSync(join(dir, name), text);
  console.log(`เขียน ${Object.keys(outputs).join(' · ')} ใน ${dir}`);
  return 0;
}

function selfTest() {
  let failed = 0, total = 0;
  const check = (label, ok) => { total++; if (!ok) failed++; console.log(`${ok ? 'ผ่าน' : 'พลาด'} · ${label}`); };
  const dir = tempDir();
  try {
    cpSync(join(FIXTURES, 'good-full'), dir, { recursive: true });
    check('เขียนจาก good-full ได้', render(dir, false) === 0);
    const text = readFileSync(join(dir, 'REPORT.md'), 'utf8');
    check('สรุปคำตัดสิน confirmed = 2', text.includes('| ยืนยันแล้ว (confirmed) | 2 |'));
    check('ตาราง OWASP มีแถว A01 นับ 1 ข้อ', text.includes('| A01 | Broken Access Control | 1 | F-001 |'));
    check('ตารางเจ้าของกิจการใช้ owner_impact_th', text.includes('ลูกค้าคนหนึ่งเห็นชื่อ ที่อยู่ และเบอร์โทรของลูกค้าทุกคน'));
    check('บอกหน่วยที่ยังไม่ตรวจ', text.includes('C-webhook-signature'));
    check('NEEDS-VALIDATION มี F-003', readFileSync(join(dir, 'NEEDS-VALIDATION.md'), 'utf8').includes('## F-003'));
    check('ไม่เขียนทับเมื่อไม่ใส่ --force', render(dir, false) === 1);
    check('เขียนทับได้เมื่อใส่ --force', render(dir, true) === 0);
    rmSync(join(dir, 'REPORT.md'));
    writeFileSync(join(dir, 'findings.json'), '{"audit":{},"findings":[]}');
    check('ข้อมูลผิดแล้วไม่เขียน', render(dir, false) === 1 && !existsSync(join(dir, 'REPORT.md')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log(`render_report --self-test: ${failed ? 'ไม่ผ่าน' : 'ผ่าน'} ${total - failed}/${total}`);
  return failed ? 1 : 0;
}

const args = process.argv.slice(2);
if (args[0] === '--self-test') process.exit(selfTest());
const dirs = args.filter((a) => a !== '--force');
if (dirs.length !== 1 || dirs[0].startsWith('--')) {
  console.error('ใช้: node render_report.mjs <dir> [--force] | --self-test');
  process.exit(2);
}
process.exit(render(dirs[0], args.includes('--force')));
