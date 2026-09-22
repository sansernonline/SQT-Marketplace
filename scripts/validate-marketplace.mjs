#!/usr/bin/env node
/**
 * validate-marketplace.mjs — ตรวจความถูกต้องของ skill/agent/plugin ทั้ง marketplace
 *
 *   node scripts/validate-marketplace.mjs            ตรวจทั้งหมด
 *   node scripts/validate-marketplace.mjs --warn     ให้ warning นับเป็น error ด้วย
 *   node scripts/validate-marketplace.mjs --self-test พิสูจน์ว่าตัวตรวจยังจับ bug ได้จริง
 *
 * ออก exit code 1 เมื่อเจอ error — ใช้เป็น gate ใน CI ได้
 *
 * ไม่ใช้ dependency ภายนอก
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.argv.find(a => a.startsWith('--root='))?.slice(7)
          ?? join(dirname(fileURLToPath(import.meta.url)), '..');   // fileURLToPath ไม่งั้น path ที่มีช่องว่างจะกลายเป็น %20
const STRICT = process.argv.includes('--warn');

const errors = [];
const warns  = [];
let inspected = 0;

const err  = (file, msg) => errors.push(`${file}\n      ${msg}`);
const warn = (file, msg) => warns.push(`${file}\n      ${msg}`);

// ---------------------------------------------------------------- frontmatter
/**
 * ตรวจ frontmatter แบบเจาะจงปัญหาที่เกิดจริง ไม่ได้ parse YAML เต็มรูปแบบ
 * กับดักตัวใหญ่ที่สุด: ค่าที่ไม่ได้ครอบด้วยเครื่องหมายคำพูดแล้วมี ": " อยู่ข้างใน
 * YAML จะ parse ทั้งบล็อกไม่ผ่าน → loader ทิ้ง field ทั้งหมด → skill ไม่เคยถูกเรียกเลย
 * และไม่มี error ให้เห็น
 */
function parseFrontmatter(file, text) {
  if (!text.startsWith('---\n')) { err(file, 'ไม่มี frontmatter (ต้องขึ้นต้นด้วย ---)'); return null; }
  const end = text.indexOf('\n---', 3);
  if (end === -1) { err(file, 'frontmatter ไม่มีบรรทัดปิด ---'); return null; }

  const fields = {};
  let currentKey = null;

  for (const line of text.slice(4, end).split('\n')) {
    if (!line.trim()) continue;
    const m = line.match(/^([A-Za-z][\w-]*):\s?(.*)$/);
    if (!m) {                                   // บรรทัดต่อของค่าเดิม
      if (currentKey) fields[currentKey] += ' ' + line.trim();
      else err(file, `frontmatter บรรทัดนี้ไม่ใช่ key: value → ${line.slice(0, 60)}`);
      continue;
    }
    currentKey = m[1];
    const value = m[2];
    const quoted = /^".*"$/.test(value) || /^'.*'$/.test(value);
    if (!quoted && /:\s/.test(value)) {
      err(file, `YAML พัง: "${currentKey}" มี ": " อยู่ในค่าที่ไม่ได้ครอบด้วยเครื่องหมายคำพูด\n` +
                `      → YAML parse ไม่ผ่าน ทุก field หายหมด skill จะไม่ถูกเรียกเลยโดยไม่มี error\n` +
                `      แก้: เปลี่ยน ": " เป็น " — " หรือครอบค่าทั้งหมดด้วย "..."`);
    }
    if (!quoted && /^[>|]/.test(value)) warn(file, `"${currentKey}" ใช้ block scalar — loader บางตัวอ่านไม่ได้`);
    fields[currentKey] = quoted ? value.slice(1, -1) : value;
  }
  return fields;
}

// ---------------------------------------------------------------- skill
function checkSkill(dir) {
  const file = join(dir, 'SKILL.md');
  const slug = basename(dir);
  if (!existsSync(file)) { err(dir, 'ไม่มี SKILL.md'); return; }
  inspected++;

  const text = readFileSync(file, 'utf8');
  const fm = parseFrontmatter(file, text);
  if (!fm) return;

  const { name, description } = fm;

  if (!name) err(file, 'ไม่มี name');
  else {
    if (name !== slug)                       err(file, `name "${name}" ไม่ตรงกับชื่อโฟลเดอร์ "${slug}"`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) err(file, `name "${name}" ต้องเป็น a-z 0-9 และ - เท่านั้น ห้ามขึ้นหรือลงท้ายด้วย -`);
    if (name.length > 64)                    err(file, `name ยาว ${name.length} ตัว เกิน 64`);
    if (/anthropic|claude/i.test(name))      err(file, `name ห้ามมีคำว่า anthropic หรือ claude`);
  }

  if (!description) err(file, 'ไม่มี description');
  else {
    if (description.length > 1024) err(file, `description ยาว ${description.length} ตัว เกิน 1024 — จะถูกตัด`);
    if (description.length < 60)   warn(file, `description สั้นแค่ ${description.length} ตัว — บอก "ใช้เมื่อไหร่" ให้ครบ ไม่งั้น skill จะไม่ถูกเรียก`);
    if (/<[a-zA-Z/]/.test(description)) err(file, 'description มีแท็ก < > — ไม่อนุญาต');
    // หมายเหตุ: \b ใช้กับอักษรไทยไม่ได้ใน JavaScript regex — ตรวจแบบไม่มี word boundary
    if (!/(^|[^a-z])use\s|ใช้/i.test(description)) warn(file, 'description ไม่ได้บอกว่าใช้เมื่อไหร่ — ขึ้นต้นด้วย "Use when …" หรือ "ใช้เมื่อ …"');
  }

  const bodyLines = text.slice(text.indexOf('\n---', 3) + 4).split('\n').length;
  if (bodyLines > 500) err(file, `เนื้อหา ${bodyLines} บรรทัด เกิน 500 — แยกไป references/`);
  else if (bodyLines > 400) warn(file, `เนื้อหา ${bodyLines} บรรทัด ใกล้เพดาน 500 แล้ว`);

  // ไฟล์อ้างอิงยาว ๆ ควรมีสารบัญ ไม่งั้นจะถูกอ่านแค่บางส่วน
  // เฉพาะ references/ — ไฟล์ที่ตั้งใจให้อ่านเป็นส่วน ๆ
  // assets/ คือของที่ตั้งใจให้คัดลอกไปทั้งไฟล์ สารบัญจะกลายเป็นขยะติดไปด้วย
  for (const sub of ['references']) {
    const d = join(dir, sub);
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d)) {
      if (!f.endsWith('.md')) continue;
      const p = join(d, f);
      const n = readFileSync(p, 'utf8').split('\n').length;
      if (n > 100 && !/^\s*(\||-|\d+\.).*\[.*\]\(#/m.test(readFileSync(p, 'utf8')))
        warn(p, `${n} บรรทัดแต่ไม่มีสารบัญ — ไฟล์ยาวจะถูกอ่านแค่บางส่วน`);
    }
  }
}

// ---------------------------------------------------------------- agent
function checkAgent(file) {
  inspected++;
  const stem = basename(file, '.md');
  const fm = parseFrontmatter(file, readFileSync(file, 'utf8'));
  if (!fm) return;
  if (!fm.name) err(file, 'ไม่มี name');
  else if (fm.name !== stem) err(file, `name "${fm.name}" ไม่ตรงกับชื่อไฟล์ "${stem}"`);
  if (!fm.description) err(file, 'ไม่มี description');
  // agent ใช้คีย์ tools: ส่วน skill/command ใช้ allowed-tools: — ใส่ผิดคีย์ loader จะเงียบ ๆ ไม่สนใจ
  if (fm['allowed-tools']) err(file, 'agent ต้องใช้คีย์ "tools:" ไม่ใช่ "allowed-tools:" — ใส่ผิดคีย์จะถูกเมินเงียบ ๆ');
}

// ---------------------------------------------------------------- plugin
function checkPlugin(dir) {
  const slug = basename(dir);
  const pj = join(dir, '.claude-plugin', 'plugin.json');
  if (!existsSync(pj)) { err(dir, 'ไม่มี .claude-plugin/plugin.json'); return; }
  inspected++;
  let j;
  try { j = JSON.parse(readFileSync(pj, 'utf8')); }
  catch (e) { err(pj, `JSON พัง: ${e.message}`); return; }
  if (j.name !== slug) err(pj, `name "${j.name}" ไม่ตรงกับชื่อโฟลเดอร์ "${slug}"`);
  if (!/^\d+\.\d+\.\d+$/.test(j.version ?? '')) err(pj, `version "${j.version}" ต้องเป็น x.y.z`);
  if (!j.description) warn(pj, 'ไม่มี description');

  for (const sub of ['skills', 'agents', 'commands']) {
    const d = join(dir, sub);
    if (!existsSync(d)) continue;
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (sub === 'skills' && statSync(p).isDirectory()) checkSkill(p);
      if (sub !== 'skills' && e.endsWith('.md')) checkAgent(p);
    }
  }
}

// ---------------------------------------------------------------- self-test
// กฎ: ตัวตรวจที่ไม่เคยเจออะไรเลย ต้องถือว่าพัง ไม่ใช่ผ่าน
// self-test พิสูจน์ว่ากฎแต่ละข้อยัง "ยิงโดน" เป้าของมันจริง ไม่ได้เขียว ๆ ไปวัน ๆ
function selfTest() {
  const cases = [
    ['YAML พัง',       '---\nname: x\ndescription: Use when foo: bar happens\n---\n', /YAML พัง/],
    ['name ไม่ตรง',     '---\nname: other\ndescription: Use when something happens in a project\n---\n', /ไม่ตรงกับชื่อโฟลเดอร์/],
    ['ไม่มี frontmatter','# hello\n', /ไม่มี frontmatter/],
    ['description ยาว', `---\nname: x\ndescription: Use ${'a'.repeat(1100)}\n---\n`, /เกิน 1024/],
  ];
  let ok = 0;
  for (const [label, text, expect] of cases) {
    errors.length = 0;
    const fm = parseFrontmatter('x/SKILL.md', text);
    if (fm) {
      if (fm.name && fm.name !== 'x') err('x/SKILL.md', `name "${fm.name}" ไม่ตรงกับชื่อโฟลเดอร์ "x"`);
      if (fm.description?.length > 1024) err('x/SKILL.md', `description ยาว ${fm.description.length} ตัว เกิน 1024`);
    }
    const hit = errors.some(e => expect.test(e));
    console.log(`  ${hit ? '✅' : '❌'} ${label}`);
    if (hit) ok++;
  }
  errors.length = 0;
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}

// ---------------------------------------------------------------- run
if (process.argv.includes('--self-test')) selfTest();

const pluginsDir = join(ROOT, 'plugins');
if (!existsSync(pluginsDir)) { console.error(`ไม่พบ ${pluginsDir}`); process.exit(1); }

const plugins = readdirSync(pluginsDir).filter(d => statSync(join(pluginsDir, d)).isDirectory());
plugins.forEach(p => checkPlugin(join(pluginsDir, p)));

// marketplace.json ต้องมี plugin ครบทุกตัวที่มีอยู่จริง
const mp = join(ROOT, '.claude-plugin', 'marketplace.json');
if (existsSync(mp)) {
  inspected++;
  try {
    const j = JSON.parse(readFileSync(mp, 'utf8'));
    const listed = new Set((j.plugins ?? []).map(p => p.name));
    for (const p of plugins) if (!listed.has(p)) err(mp, `ไม่ได้ประกาศ plugin "${p}" ที่มีอยู่จริงในโฟลเดอร์`);
    for (const n of listed) if (!plugins.includes(n)) err(mp, `ประกาศ plugin "${n}" ที่ไม่มีโฟลเดอร์จริง`);
  } catch (e) { err(mp, `JSON พัง: ${e.message}`); }
} else err(mp, 'ไม่มี marketplace.json');

// README ต้องพูดถึงทุก plugin ไม่งั้นคนหาไม่เจอว่ามีอะไรบ้าง
const readme = join(ROOT, 'README.md');
if (existsSync(readme)) {
  const t = readFileSync(readme, 'utf8');
  for (const p of plugins) if (!t.includes(p)) warn(readme, `ไม่ได้พูดถึง plugin "${p}"`);
}

// ---------------------------------------------------------------- report
console.log();
if (inspected === 0) {
  // ตรวจไม่เจออะไรเลย = ตัวตรวจพัง ไม่ใช่ทุกอย่างเรียบร้อย
  console.error('❌ ไม่ได้ตรวจอะไรเลย — path ผิดหรือตัวตรวจพัง (ไม่ใช่ว่าไม่มีปัญหา)');
  process.exit(1);
}
for (const w of warns)  console.log(`  ⚠  ${w}`);
for (const e of errors) console.log(`  ❌ ${e}`);
console.log();
console.log(`  ตรวจ ${inspected} รายการ · error ${errors.length} · warning ${warns.length}`);
console.log();

const failed = errors.length > 0 || (STRICT && warns.length > 0);
process.exit(failed ? 1 : 0);
