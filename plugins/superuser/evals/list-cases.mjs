#!/usr/bin/env node
/**
 * list-cases.mjs — สร้างตาราง "เคสที่มี" จากโฟลเดอร์เคส (ไม่ต้องติดตั้งอะไร)
 *   node list-cases.mjs                  พิมพ์ตาราง
 *   node list-cases.mjs --write README.md   เขียนตารางทับช่วงระหว่างเครื่องหมายใน README
 *   node list-cases.mjs --check README.md   exit 1 ถ้าตารางใน README ไม่ตรงกับโฟลเดอร์
 *   node list-cases.mjs --self-test
 * อ่านแค่ช่องบนสุดของ case.yaml (name · tags · runs · description) แบบบรรทัดเดียว
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const START = '<!-- list-cases:start -->';
const END = '<!-- list-cases:end -->';

const field = (text, key) => (text.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1] ?? '').trim();

export function readCases(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, 'case.yaml')))
    .map((d) => {
      const text = readFileSync(join(dir, d.name, 'case.yaml'), 'utf8').replace(/\r\n/g, '\n');
      const tags = field(text, 'tags').replace(/^\[|\]$/g, '').split(',').map((s) => s.trim());
      return { name: field(text, 'name') || d.name, type: tags[0] || '-', runs: field(text, 'runs') || '-', purpose: field(text, 'description') };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function table(cases) {
  const cell = (s) => String(s).replace(/\|/g, '\\|');
  return ['| เคส | แบบ | รอบ | พิสูจน์ |', '|---|---|---|---|',
    ...cases.map((c) => `| \`${c.name}\` | ${cell(c.type)} | ${cell(c.runs)} | ${cell(c.purpose)} |`)].join('\n');
}

const between = (readme) => {
  const s = readme.indexOf(START), e = readme.indexOf(END);
  if (s < 0 || e < s) throw new Error(`ไม่พบเครื่องหมาย ${START} … ${END}`);
  return [readme.slice(0, s + START.length), readme.slice(s + START.length, e), readme.slice(e)];
};
const norm = (s) => s.replace(/\r\n/g, '\n').trim();

export function check(readme, cases) {
  return norm(between(readme)[1]) === norm(table(cases));
}

export function write(readme, cases) {
  const [head, , tail] = between(readme);
  const eol = readme.includes('\r\n') ? '\r\n' : '\n';
  return head + eol + table(cases).replace(/\n/g, eol) + eol + tail;
}

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), 'list-cases-'));
  try {
    const mk = (n, extra) => { mkdirSync(join(dir, n)); writeFileSync(join(dir, n, 'case.yaml'), `schema_version: "1.1"\nname: ${n}\ndescription: ทดสอบ a|b\ntags: [${extra}, x]\nruns: 10\n`); };
    mk('b-trigger', 'trigger'); mk('a-guard', 'guard'); mkdirSync(join(dir, 'results'));
    const cases = readCases(dir);
    const t = table(cases);
    const readme = `# x\n\n${START}\n${t}\n${END}\n`;
    const ok = [
      ['อ่าน 2 เคส ข้ามโฟลเดอร์ที่ไม่มี case.yaml', cases.length === 2],
      ['เรียงตามชื่อ', cases[0].name === 'a-guard'],
      ['แบบมาจาก tag แรก และรอบจาก runs', cases[0].type === 'guard' && cases[0].runs === '10'],
      ['escape | ในคำอธิบาย', t.includes('a\\|b')],
      ['--check ผ่านเมื่อตรง', check(readme, cases)],
      ['--check ตกเมื่อแถวขาด', !check(readme, cases.slice(1))],
      ['--write แล้ว --check ผ่าน (CRLF)', check(write(readme.replace(/\n/g, '\r\n'), cases.slice(1)), cases.slice(1))],
    ];
    for (const [name, pass] of ok) console.log(`${pass ? 'ผ่าน' : 'ตก'}  ${name}`);
    return ok.every(([, p]) => p);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const here = dirname(fileURLToPath(import.meta.url));
  const [flag, file] = process.argv.slice(2);
  if (flag === '--self-test') process.exit(selfTest() ? 0 : 1);
  const cases = readCases(here);
  if (flag === '--check') {
    const same = check(readFileSync(file, 'utf8'), cases);
    console.log(same ? `ตารางใน ${file} ตรงกับ ${cases.length} เคส` : `ตารางใน ${file} ไม่ตรงกับโฟลเดอร์ — รัน node list-cases.mjs --write ${file}`);
    process.exit(same ? 0 : 1);
  }
  if (flag === '--write') { writeFileSync(file, write(readFileSync(file, 'utf8'), cases)); console.log(`เขียนตาราง ${cases.length} เคสลง ${file}`); }
  else console.log(table(cases));
}
