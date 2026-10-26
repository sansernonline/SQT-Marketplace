/**
 * self_test.mjs — ของใช้ร่วมของ --self-test ทั้ง 3 สคริปต์
 * fixture ถูก 3 ชุดอยู่ใน fixtures/good-* · เคสผิดอยู่ใน fixtures/bad-cases.json (เอา good-full มาแก้ทีละจุด)
 */
import { mkdtempSync, readFileSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateFiles, MAX_BYTES } from './audit_lib.mjs';

export const FIXTURES = fileURLToPath(new URL('./fixtures/', import.meta.url));
export const GOOD = ['good-full', 'good-confirmed-only', 'good-empty'];
export const tempDir = () => mkdtempSync(join(tmpdir(), 'security-audit-'));

// ใส่ค่าตาม path แบบ "findings.0.trace.1.file" · unset = ลบช่อง
function apply(doc, path, value, remove) {
  const keys = path.split('.');
  const last = keys.pop();
  const parent = keys.reduce((o, k) => o[k], doc);
  if (remove) delete parent[last]; else parent[last] = value;
}

// เขียน good-full ที่แก้ตามเคสลงโฟลเดอร์ชั่วคราว · คืน path ของ findings.json และ ledger.json
export function writeCase(c, dir) {
  const docs = {
    findings: JSON.parse(readFileSync(join(FIXTURES, 'good-full', 'findings.json'), 'utf8')),
    ledger: JSON.parse(readFileSync(join(FIXTURES, 'good-full', 'ledger.json'), 'utf8')),
  };
  for (const [p, v] of Object.entries(c.set ?? {})) apply(docs[c.target], p, v, false);
  for (const p of c.unset ?? []) apply(docs[c.target], p, null, true);
  const findingsFile = join(dir, 'findings.json'), ledgerFile = join(dir, 'ledger.json');
  writeFileSync(findingsFile, JSON.stringify(docs.findings));
  writeFileSync(ledgerFile, JSON.stringify(docs.ledger));
  return { findingsFile, ledgerFile };
}

// รัน fixture ถูกทุกชุด + เคสผิดของ target + เคสระดับไฟล์ (ใหญ่เกิน · symlink) · คืน exit code
export function runValidatorSelfTest(name, target) {
  let failed = 0, total = 0;
  const check = (label, ok, detail = '') => {
    total++;
    if (!ok) failed++;
    console.log(`${ok ? 'ผ่าน' : 'พลาด'} · ${label}${ok ? '' : ` · ${detail}`}`);
  };
  for (const g of GOOD) {
    const r = validateFiles({ findingsFile: join(FIXTURES, g, 'findings.json'), ledgerFile: join(FIXTURES, g, 'ledger.json') });
    check(`ถูก ${g}`, r.errors.length === 0, r.errors.map((e) => e.rule).join(','));
  }
  const dir = tempDir();
  try {
    const { cases } = JSON.parse(readFileSync(join(FIXTURES, 'bad-cases.json'), 'utf8'));
    for (const c of cases.filter((x) => x.target === target)) {
      const r = validateFiles(writeCase(c, dir));
      const rules = r.errors.map((e) => e.rule);
      check(`ผิด ${c.name} → ${c.expect}`, rules.includes(c.expect), `เจอ ${rules.join(',') || 'ไม่มี error'}`);
    }
    const big = join(dir, 'big.json');
    writeFileSync(big, `{"pad":"${'x'.repeat(MAX_BYTES)}"}`);
    const sizeRule = validateFiles({ [`${target}File`]: big }).errors[0]?.rule;
    check('ผิด ไฟล์เกิน 5 MB → file-size', sizeRule === 'file-size', `เจอ ${sizeRule}`);
    const link = join(dir, 'link.json');
    try {
      symlinkSync(join(FIXTURES, 'good-full', `${target}.json`), link, 'file');
      const linkRule = validateFiles({ [`${target}File`]: link }).errors[0]?.rule;
      check('ผิด symlink → file-symlink', linkRule === 'file-symlink', `เจอ ${linkRule}`);
    } catch (e) {
      console.log(`ข้าม · symlink สร้างไม่ได้ในเครื่องนี้ (${e.code}) — Windows ต้องเปิด Developer Mode`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log(`${name} --self-test: ${failed ? 'ไม่ผ่าน' : 'ผ่าน'} ${total - failed}/${total}`);
  return failed ? 1 : 0;
}
