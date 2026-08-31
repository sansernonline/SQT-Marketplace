#!/usr/bin/env node
/**
 * check-design-tokens.mjs — ยามเฝ้าประตูของระบบดีไซน์
 *
 * ตรวจ 3 ข้อ:
 *   1. โค้ดคอมโพเนนต์ไม่มีสีดิบ (#rrggbb / rgb() / rgba() / hsl()) — ต้องอ้าง var(--token)
 *   2. ทุก var(--x) ที่ถูกอ้าง มีนิยามจริงในไฟล์ token (จับ typo)
 *   3. token แกนหลักครบตามสัญญา
 *
 * ใช้:
 *   node check-design-tokens.mjs <ไฟล์ token> <โฟลเดอร์ที่จะตรวจ> [ตัวเลือก]
 *
 *   node check-design-tokens.mjs src/styles.css src/app
 *   node check-design-tokens.mjs src/theme.css src --ext ts,tsx,jsx,vue,svelte,html,css
 *   node check-design-tokens.mjs src/styles.css src/app --ignore src/app/vendor
 *
 * ใส่ใน package.json:  "lint:tokens": "node tools/check-design-tokens.mjs src/styles.css src/app"
 * แล้วต่อเข้า CI — ถ้าไม่บังคับด้วยเครื่อง ระบบดีไซน์จะพังภายในสามสัปดาห์
 *
 * exit 0 = ผ่าน · exit 1 = พบการละเมิด
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

/* -------------------------------------------------------------- อ่านอาร์กิวเมนต์ */
const argv = process.argv.slice(2);
if (argv.length < 2 || argv.includes('--help')) {
  console.log(readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0].replace(/^\/\*\*?/, ''));
  process.exit(argv.length < 2 ? 1 : 0);
}

const opt = (name, fallback) => {
  const i = argv.indexOf('--' + name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

const TOKENS_FILE = resolve(argv[0]);
const SRC_DIR = resolve(argv[1]);
const EXT = opt('ext', 'ts,tsx,js,jsx,vue,svelte,html,css,scss').split(',');
const IGNORE = opt('ignore', 'node_modules,dist,.git').split(',');

/** token แกนหลักที่ทุกโปรเจกต์ต้องมี — แก้ให้ตรงกับสัญญาของโปรเจกต์คุณ */
const REQUIRED = [
  '--brand', '--brand-2', '--grad-accent', '--grad-page',
  '--bg', '--surface', '--line', '--line-strong', '--shadow', '--radius',
  '--text', '--text-body', '--text-muted', '--text-faint',
  '--sidebar-w', '--topbar-h', '--content-max',
];

/** เส้นแบ่ง: ในไฟล์ token เอง อนุญาตสีดิบเฉพาะ "ก่อน" บรรทัดนี้ */
const BASE_MARKER = opt('marker', '=========================== base');

const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(\s*[\d.]|\bhsla?\(\s*[\d.]/g;
const VAR_USE = /var\(\s*(--[a-zA-Z0-9-]+)/g;

/**
 * ลบ "เนื้อใน" ของคอมเมนต์ทิ้ง แต่คงจำนวนบรรทัดไว้เท่าเดิม
 * จำเป็นมาก ไม่งั้นคอมเมนต์ที่อธิบายกฎ (เช่น "ต้องใช้ var(--token)")
 * จะถูกรายงานเป็นความผิดเสียเอง — และคนจะเลิกเชื่อผลตรวจทันที
 */
function stripComments(src) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  return src
    .replace(/\/\*[\s\S]*?\*\//g, blank)        // /* ... */  (CSS + JS)
    .replace(/<!--[\s\S]*?-->/g, blank)          // <!-- ... --> (HTML)
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + blank(m.slice(p1.length)));  // // ... (ไม่กิน https://)
}

/* -------------------------------------------------------------- ตรวจไฟล์ */
if (!existsSync(TOKENS_FILE)) { console.error('ไม่พบไฟล์ token: ' + TOKENS_FILE); process.exit(1); }
if (!existsSync(SRC_DIR)) { console.error('ไม่พบโฟลเดอร์: ' + SRC_DIR); process.exit(1); }

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (IGNORE.some((ig) => p.includes(sep + ig) || name === ig)) continue;
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (EXT.some((e) => p.endsWith('.' + e))) out.push(p);
  }
  return out;
}

const tokensCss = readFileSync(TOKENS_FILE, 'utf8');
const defined = new Set([...tokensCss.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)].map((m) => m[1]));
const errors = [];
const ROOT = process.cwd();

/* (3) token แกนหลักครบ */
for (const t of REQUIRED) {
  if (!defined.has(t)) errors.push(`ขาด token แกนหลัก ${t} ใน ${relative(ROOT, TOKENS_FILE)}`);
}

/* (1) + (2) ไล่ทุกไฟล์ในโฟลเดอร์เป้าหมาย */
const files = walk(SRC_DIR).filter((f) => resolve(f) !== TOKENS_FILE);
for (const file of files) {
  const rel = relative(ROOT, file);
  stripComments(readFileSync(file, 'utf8')).split('\n').forEach((line, i) => {
    for (const m of line.matchAll(RAW_COLOUR)) {
      errors.push(`${rel}:${i + 1} hardcode สี "${m[0]}" — ต้องใช้ var(--token)`);
    }
    for (const m of line.matchAll(VAR_USE)) {
      if (!defined.has(m[1])) errors.push(`${rel}:${i + 1} อ้าง token ที่ไม่มีนิยาม ${m[1]}`);
    }
  });
}

/* ไฟล์ token เอง: สีดิบได้เฉพาะในบล็อกนิยามด้านบน */
{
  const rel = relative(ROOT, TOKENS_FILE);
  const idx = tokensCss.indexOf(BASE_MARKER);
  if (idx < 0) {
    errors.push(`${rel}: ไม่พบเส้นแบ่ง "${BASE_MARKER}" — แยกบล็อก token ไม่ได้ ` +
                `(ใส่คอมเมนต์คั่น หรือระบุ --marker)`);
  } else {
    const before = tokensCss.slice(0, idx).split('\n').length - 1;
    stripComments(tokensCss.slice(idx)).split('\n').forEach((line, i) => {
      for (const m of line.matchAll(RAW_COLOUR)) {
        errors.push(`${rel}:${before + i + 1} hardcode สี "${m[0]}" นอกบล็อก token`);
      }
      for (const m of line.matchAll(VAR_USE)) {
        if (!defined.has(m[1])) errors.push(`${rel}:${before + i + 1} อ้าง token ที่ไม่มีนิยาม ${m[1]}`);
      }
    });
  }
}

/* -------------------------------------------------------------- สรุป */
if (errors.length) {
  console.error(`✗ ไม่ผ่าน — พบ ${errors.length} รายการ ` +
                `(ตรวจ ${files.length} ไฟล์, token ${defined.size} ตัว)`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log(`✓ ผ่าน — ตรวจ ${files.length} ไฟล์, ไม่มีสี hardcode, token ${defined.size} ตัวถูกอ้างครบถ้วน`);
