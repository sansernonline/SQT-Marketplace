/**
 * audit_lib.mjs — กฎตรวจ findings.json และ ledger.json ของ skill security-audit (ใช้จาก validate_findings · validate_ledger · render_report)
 * ทุกฟังก์ชันตรวจคืนรายการ { rule, at, msg } · rule คือรหัสกฎ (self-test เทียบกับรหัสนี้) · at คือ id ของ finding/แถว และช่อง
 * โครงข้อมูลเต็มอยู่ที่ ../assets/findings.schema.json
 */
import { lstatSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

export const MAX_BYTES = 5 * 1024 * 1024;
const VERDICTS = ['confirmed', 'needs_validation', 'rejected'];
export const SEVERITIES = ['critical', 'high', 'medium', 'low', 'info'];
export const STATUSES = ['pending', 'checked', 'not_applicable', 'blocked'];

// อ่าน JSON แบบไม่ตาม symlink และจำกัดขนาด · Windows ไม่มี O_NOFOLLOW จึงตรวจด้วย lstat ก่อนเปิด
function readJson(file) {
  let st;
  try { st = lstatSync(file); } catch { return { error: { rule: 'file-missing', at: file, msg: 'ไม่พบไฟล์' } }; }
  if (st.isSymbolicLink()) return { error: { rule: 'file-symlink', at: file, msg: 'เป็น symlink — ไม่อ่าน ให้ส่งไฟล์จริง' } };
  if (!st.isFile()) return { error: { rule: 'file-not-regular', at: file, msg: 'ไม่ใช่ไฟล์ธรรมดา' } };
  if (st.size > MAX_BYTES) return { error: { rule: 'file-size', at: file, msg: `ใหญ่ ${st.size} ไบต์ เกิน 5 MB` } };
  try { return { data: JSON.parse(readFileSync(file, 'utf8').replace(/^﻿/, '')) }; }
  catch (e) { return { error: { rule: 'json-parse', at: file, msg: `อ่าน JSON ไม่ได้: ${e.message}` } }; }
}

// fingerprint คงที่ข้ามรอบ: sha256 ของ class · location.file · location.symbol · entrypoint คั่นด้วย \n (symbol null = ว่าง) ตัด 16 hex
export const fingerprintOf = (cls, file, symbol, entrypoint) =>
  createHash('sha256').update([cls, file, symbol ?? '', entrypoint].join('\n')).digest('hex').slice(0, 16);

// entrypoint เขียนเป็น "<path>" หรือ "<path>#<ทางเข้า>" เช่น "src/routes/user.js#POST /users/:id"
const entrypointFile = (ep) => String(ep).split('#')[0];

// path สัมพัทธ์ใน repo แบบ / · ไม่มี .. · ไม่ขึ้นต้นด้วย / ~ หรือไดรฟ์ · ไม่มี \ หรือ :
const isSafePath = (p) =>
  typeof p === 'string' && p !== '' && p.trim() === p && !/[\\:\0]/.test(p) && !/^[/~]/.test(p)
  && p.split('/').every((s) => s !== '' && s !== '.' && s !== '..');

const SECRET_PATTERNS = [
  [/AKIA[0-9A-Z]{16}/, 'AWS access key'],
  [/gh[pousr]_[A-Za-z0-9]{20,}/, 'GitHub token'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/xox[abposr]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/[sr]k_live_[A-Za-z0-9]{10,}/, 'Stripe live key'],
];

const isText = (v) => typeof v === 'string' && v.trim() !== '';
const matches = (re) => (v) => typeof v === 'string' && re.test(v);
const isNullOr = (v, test) => v === null || v === undefined || test(v);
const isPosInt = (v) => Number.isInteger(v) && v > 0;
const isStrList = (v) => Array.isArray(v) && v.every((x) => typeof x === 'string');

// ชนิดของแต่ละช่อง · required = ต้องมีทุกคำตัดสิน · ช่องที่ไม่ required ใส่ null หรือไม่ใส่ก็ได้ แล้วกฎตามคำตัดสินบังคับต่อ
const FINDING_FIELDS = {
  id: [true, matches(/^F-\d{3,}$/), 'รูปแบบ F-001'],
  fingerprint: [true, matches(/^[0-9a-f]{16}$/), 'hex ตัวเล็ก 16 ตัว'],
  verdict: [true, (v) => VERDICTS.includes(v), VERDICTS.join('|')],
  severity: [false, (v) => SEVERITIES.includes(v), SEVERITIES.join('|')],
  title: [true, isText, 'ข้อความไม่ว่าง'],
  class: [true, isText, 'ข้อความไม่ว่าง'],
  owasp: [true, (v) => v === null || matches(/^A(0[1-9]|10)$/)(v), 'A01..A10 หรือ null'],
  cwe: [true, (v) => v === null || matches(/^CWE-\d+$/)(v), 'CWE-n หรือ null'],
  location: [true, (v) => v && typeof v === 'object' && !Array.isArray(v), 'object {file, line, symbol}'],
  entrypoint: [true, isText, 'ข้อความไม่ว่าง แบบ path#ทางเข้า'],
  trace: [true, Array.isArray, 'array ของ {file, line, note}'],
  preconditions: [false, isStrList, 'array ของข้อความ'],
  impact: [false, (v) => typeof v === 'string', 'ข้อความ'],
  owner_impact_th: [false, (v) => typeof v === 'string', 'ข้อความ'],
  pdpa: [true, (v) => v && typeof v.personal_data === 'boolean' && isStrList(v.kinds), '{personal_data: bool, kinds: []}'],
  evidence: [true, (v) => typeof v === 'string', 'ข้อความ'],
  missing: [false, (v) => typeof v === 'string', 'ข้อความ'],
  check_plan: [false, (v) => typeof v === 'string', 'ข้อความ'],
  reject_reason: [false, (v) => typeof v === 'string', 'ข้อความ'],
  fix: [false, (v) => typeof v === 'string', 'ข้อความ'],
  verified_by: [false, (v) => typeof v === 'string', 'ข้อความ'],
  hunted_by: [true, isText, 'ข้อความไม่ว่าง'],
  coverage_ids: [true, (v) => isStrList(v) && v.length > 0, 'array ของ coverage_id อย่างน้อย 1'],
};

function checkShape(obj, fields, at) {
  const out = [];
  for (const [key, [required, test, want]] of Object.entries(fields)) {
    const v = obj[key];
    if (v === undefined || (v === null && !required)) {
      if (required) out.push({ rule: 'field-missing', at: `${at}.${key}`, msg: `ไม่มีช่องบังคับ (${want})` });
    } else if (!test(v)) {
      out.push({ rule: 'field-type', at: `${at}.${key}`, msg: `ชนิดหรือค่าไม่ถูก ต้องเป็น ${want}` });
    }
  }
  for (const key of Object.keys(obj)) if (!(key in fields)) out.push({ rule: 'field-unknown', at: `${at}.${key}`, msg: 'ช่องที่ไม่รู้จัก — สะกดผิดหรือเกินสัญญา' });
  return out;
}

// หาค่าลับในทุกข้อความของ finding (ไม่ใช่แค่ evidence)
function secretsIn(value, at, out) {
  if (typeof value === 'string') {
    for (const [re, kind] of SECRET_PATTERNS) if (re.test(value)) out.push({ rule: 'secret-in-text', at, msg: `มีค่าที่หน้าตาเหมือน ${kind} — ตัดให้เหลือ 4 ตัวท้ายก่อนลงไฟล์` });
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) secretsIn(v, Array.isArray(value) ? `${at}[${k}]` : `${at}.${k}`, out);
  }
  return out;
}

function checkFinding(f, at) {
  const out = checkShape(f, FINDING_FIELDS, at);
  // ช่องโครงหลักผิด ตรวจกฎความหมายต่อไม่ได้
  if (out.some((e) => /\.(verdict|class|location|entrypoint|trace|pdpa)$/.test(e.at))) return out;

  const loc = f.location;
  if (!isSafePath(loc.file)) out.push({ rule: 'path-unsafe', at: `${at}.location.file`, msg: 'ต้องเป็น path สัมพัทธ์ใน repo ใช้ / ไม่มี .. ไม่ขึ้นต้นด้วย / หรือไดรฟ์' });
  if (!isNullOr(loc.line, isPosInt)) out.push({ rule: 'field-type', at: `${at}.location.line`, msg: 'ต้องเป็นจำนวนเต็มบวกหรือ null' });
  if (!isNullOr(loc.symbol, (v) => typeof v === 'string')) out.push({ rule: 'field-type', at: `${at}.location.symbol`, msg: 'ต้องเป็นข้อความหรือ null' });
  for (const key of Object.keys(loc)) if (!['file', 'line', 'symbol'].includes(key)) out.push({ rule: 'field-unknown', at: `${at}.location.${key}`, msg: 'ช่องที่ไม่รู้จัก' });
  if (!isSafePath(entrypointFile(f.entrypoint))) out.push({ rule: 'path-unsafe', at: `${at}.entrypoint`, msg: 'ส่วน path หน้า # ต้องเป็น path สัมพัทธ์ใน repo' });
  f.trace.forEach((t, i) => {
    if (!t || !isSafePath(t.file)) out.push({ rule: 'path-unsafe', at: `${at}.trace[${i}].file`, msg: 'ต้องเป็น path สัมพัทธ์ใน repo' });
    if (!t || !isPosInt(t.line)) out.push({ rule: 'field-type', at: `${at}.trace[${i}].line`, msg: 'ต้องเป็นจำนวนเต็มบวก' });
    if (!t || typeof t.note !== 'string') out.push({ rule: 'field-type', at: `${at}.trace[${i}].note`, msg: 'ต้องเป็นข้อความ' });
  });

  const expected = fingerprintOf(f.class, loc.file, loc.symbol, f.entrypoint);
  if (f.fingerprint !== expected) out.push({ rule: 'fp-mismatch', at: `${at}.fingerprint`, msg: `ไม่ตรงกับ class+file+symbol+entrypoint ควรเป็น ${expected} (คำนวณด้วย fingerprint.mjs)` });

  if (f.pdpa.personal_data && f.pdpa.kinds.length === 0) out.push({ rule: 'pdpa-kinds', at: `${at}.pdpa.kinds`, msg: 'personal_data เป็น true ต้องบอกชนิดข้อมูลอย่างน้อย 1 อย่าง' });

  const has = (k) => isText(f[k]);
  if (f.verdict === 'confirmed') {
    if (!f.severity) out.push({ rule: 'confirmed-severity', at: `${at}.severity`, msg: 'confirmed ต้องมีระดับความรุนแรง' });
    if (!has('evidence')) out.push({ rule: 'confirmed-evidence', at: `${at}.evidence`, msg: 'confirmed ต้องมีหลักฐาน' });
    if (f.trace.length === 0) out.push({ rule: 'confirmed-trace', at: `${at}.trace`, msg: 'confirmed ต้องมีเส้นทางอย่างน้อย 1 ขั้น' });
    else if (f.trace[0]?.file !== entrypointFile(f.entrypoint)) out.push({ rule: 'trace-entry-file', at: `${at}.trace[0].file`, msg: `ขั้นแรกต้องเป็นไฟล์ของ entrypoint (${entrypointFile(f.entrypoint)})` });
    if (!has('verified_by') || f.verified_by === f.hunted_by) out.push({ rule: 'confirmed-verifier', at: `${at}.verified_by`, msg: 'confirmed ต้องมีผู้ยืนยันที่ไม่ใช่คนเดียวกับ hunted_by' });
    for (const k of ['impact', 'owner_impact_th', 'fix']) if (!has(k)) out.push({ rule: 'confirmed-text', at: `${at}.${k}`, msg: 'confirmed ต้องมีข้อความในช่องนี้' });
  } else if (f.severity) {
    out.push({ rule: 'severity-not-allowed', at: `${at}.severity`, msg: `${f.verdict} ห้ามมีระดับ (ระดับใช้กับ confirmed เท่านั้น)` });
  }
  if (f.verdict === 'needs_validation') {
    for (const k of ['missing', 'check_plan']) if (!has(k)) out.push({ rule: 'nv-plan', at: `${at}.${k}`, msg: 'needs_validation ต้องบอกว่าขาดอะไรและจะตรวจอย่างไร' });
  }
  if (f.verdict === 'rejected' && !has('reject_reason')) out.push({ rule: 'rejected-reason', at: `${at}.reject_reason`, msg: 'rejected ต้องบอกเหตุผลที่ตัดทิ้ง' });

  return secretsIn(f, at, out);
}

function checkFindingsDoc(doc) {
  if (!doc || typeof doc !== 'object' || !Array.isArray(doc.findings) || !doc.audit || typeof doc.audit !== 'object')
    return [{ rule: 'doc-shape', at: '$', msg: 'ต้องเป็น { "audit": {...}, "findings": [...] }' }];
  const out = checkShape(doc.audit, {
    date: [true, matches(/^\d{4}-\d{2}-\d{2}$/), 'YYYY-MM-DD'],
    repo: [true, isText, 'ข้อความไม่ว่าง'],
    commit: [true, isText, 'ข้อความไม่ว่าง'],
    profile: [true, (v) => ['quick', 'standard', 'deep'].includes(v), 'quick|standard|deep'],
  }, 'audit');
  for (const k of Object.keys(doc)) if (k !== 'audit' && k !== 'findings') out.push({ rule: 'field-unknown', at: k, msg: 'ช่องที่ไม่รู้จัก' });
  const ids = new Set(), fps = new Set();
  doc.findings.forEach((f, i) => {
    if (!f || typeof f !== 'object') return out.push({ rule: 'field-type', at: `findings[${i}]`, msg: 'ต้องเป็น object' });
    const at = typeof f.id === 'string' ? f.id : `findings[${i}]`;
    if (ids.has(f.id)) out.push({ rule: 'id-dup', at: `${at}.id`, msg: 'id ซ้ำ' });
    if (fps.has(f.fingerprint)) out.push({ rule: 'fp-dup', at: `${at}.fingerprint`, msg: 'fingerprint ซ้ำ — ต้นเหตุเดียวกันต้องรวมเป็น finding เดียว' });
    ids.add(f.id); fps.add(f.fingerprint);
    out.push(...checkFinding(f, at));
  });
  return out;
}

const ROW_FIELDS = {
  coverage_id: [true, isText, 'ข้อความไม่ว่าง'],
  entrypoint: [true, isText, 'ข้อความไม่ว่าง แบบ path#ทางเข้า'],
  boundary: [true, isText, 'ข้อความไม่ว่าง'],
  class: [true, isText, 'ข้อความไม่ว่าง'],
  status: [true, (v) => STATUSES.includes(v), STATUSES.join('|')],
  finding_ids: [true, isStrList, 'array ของ id'],
  note: [false, (v) => typeof v === 'string', 'ข้อความ'],
};

// คืน { errors, warnings } · แถว pending ที่เหลือเป็นคำเตือน ไม่ใช่ error
function checkLedgerDoc(doc) {
  if (!doc || typeof doc !== 'object' || !Array.isArray(doc.rows)) return { errors: [{ rule: 'doc-shape', at: '$', msg: 'ต้องเป็น { "rows": [...] }' }], warnings: [] };
  const errors = [], warnings = [], seen = new Set();
  doc.rows.forEach((r, i) => {
    if (!r || typeof r !== 'object') return errors.push({ rule: 'field-type', at: `rows[${i}]`, msg: 'ต้องเป็น object' });
    const at = isText(r.coverage_id) ? r.coverage_id : `rows[${i}]`;
    errors.push(...checkShape(r, ROW_FIELDS, at));
    if (seen.has(r.coverage_id)) errors.push({ rule: 'cov-dup', at: `${at}.coverage_id`, msg: 'coverage_id ซ้ำ' });
    seen.add(r.coverage_id);
    if (isText(r.entrypoint) && !isSafePath(entrypointFile(r.entrypoint))) errors.push({ rule: 'path-unsafe', at: `${at}.entrypoint`, msg: 'ส่วน path หน้า # ต้องเป็น path สัมพัทธ์ใน repo' });
    if (['not_applicable', 'blocked'].includes(r.status) && !isText(r.note)) errors.push({ rule: 'ledger-note', at: `${at}.note`, msg: `สถานะ ${r.status} ต้องมีเหตุผลใน note` });
    if (r.status === 'pending') warnings.push({ rule: 'ledger-pending', at, msg: 'ยังไม่ได้ตรวจ — รายงานจะนับเป็นงานค้าง' });
  });
  return { errors, warnings };
}

// ตรวจข้ามไฟล์: id ที่แถวอ้างต้องมีจริง · coverage_id ที่ finding อ้างต้องมีจริง · ลิงก์ต้องอ้างกันทั้ง 2 ทาง
function crossCheck(findingsDoc, ledgerDoc) {
  const out = [];
  const findings = findingsDoc?.findings ?? [], rows = ledgerDoc?.rows ?? [];
  const byId = new Map(findings.map((f) => [f?.id, f]));
  const byCov = new Map(rows.map((r) => [r?.coverage_id, r]));
  for (const r of rows) for (const id of r?.finding_ids ?? []) {
    const f = byId.get(id);
    if (!f) out.push({ rule: 'ledger-finding-missing', at: `${r.coverage_id}.finding_ids`, msg: `อ้าง ${id} ที่ไม่มีใน findings.json` });
    else if (!(f.coverage_ids ?? []).includes(r.coverage_id)) out.push({ rule: 'link-oneway', at: `${id}.coverage_ids`, msg: `แถว ${r.coverage_id} อ้าง ${id} แต่ ${id} ไม่ได้อ้างแถวนี้กลับ` });
  }
  for (const f of findings) for (const cov of f?.coverage_ids ?? []) {
    const r = byCov.get(cov);
    if (!r) out.push({ rule: 'finding-coverage-missing', at: `${f.id}.coverage_ids`, msg: `อ้าง ${cov} ที่ไม่มีใน ledger` });
    else if (!(r.finding_ids ?? []).includes(f.id)) out.push({ rule: 'link-oneway', at: `${cov}.finding_ids`, msg: `${f.id} อ้างแถวนี้ แต่แถวไม่ได้ใส่ ${f.id} ใน finding_ids` });
  }
  return out;
}

const formatIssue = (e) => `${e.at}: ${e.msg} [${e.rule}]`;

// ตรวจไฟล์จริง · ส่งไฟล์ใดไฟล์หนึ่งหรือทั้งคู่ · ส่งคู่ = ตรวจข้ามไฟล์ด้วย · คืน { errors, warnings, findings, ledger }
export function validateFiles({ findingsFile, ledgerFile }) {
  const errors = [], warnings = [];
  const load = (file) => {
    if (!file) return null;
    const r = readJson(file);
    if (r.error) errors.push(r.error);
    return r.data ?? null;
  };
  const findings = load(findingsFile), ledger = load(ledgerFile);
  if (findings) errors.push(...checkFindingsDoc(findings));
  if (ledger) {
    const r = checkLedgerDoc(ledger);
    errors.push(...r.errors); warnings.push(...r.warnings);
  }
  if (findings && ledger) errors.push(...crossCheck(findings, ledger));
  return { errors, warnings, findings, ledger };
}

// พิมพ์ผลแบบเดียวกันทุกสคริปต์ · คืน exit code
export function report(name, { errors, warnings }) {
  for (const w of warnings) console.log(`เตือน ${formatIssue(w)}`);
  for (const e of errors) console.log(`ผิด ${formatIssue(e)}`);
  console.log(`${name}: ${errors.length ? 'ไม่ผ่าน' : 'ผ่าน'} · error ${errors.length} · เตือน ${warnings.length}`);
  return errors.length ? 1 : 0;
}
