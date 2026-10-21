#!/usr/bin/env node
/**
 * validate-marketplace.mjs — ตรวจความถูกต้องของ skill/agent/plugin ทั้ง marketplace
 *
 *   node scripts/check/validate-marketplace.mjs            ตรวจทั้งหมด
 *   node scripts/check/validate-marketplace.mjs --warn     ให้ warning นับเป็น error ด้วย
 *   node scripts/check/validate-marketplace.mjs --self-test พิสูจน์ว่าตัวตรวจยังจับ bug ได้จริง
 *
 * ออก exit code 1 เมื่อเจอ error — ใช้เป็น gate ใน CI ได้
 *
 * ไม่ใช้ dependency ภายนอก
 */
import { plan as planSuperuser } from '../sync/sync-superuser.mjs';
import { plan as planPromptRules, PROMPT_DIR } from '../sync/sync-prompt-rules.mjs';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync, statSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.argv.find(a => a.startsWith('--root='))?.slice(7)
          ?? join(dirname(fileURLToPath(import.meta.url)), '..', '..');   // fileURLToPath ไม่งั้น path ที่มีช่องว่างจะกลายเป็น %20
const STRICT = process.argv.includes('--warn');

const errors = [];
const warns  = [];
// คำอธิบายทุกตัวโหลดทุก session: skill และ command เตือนเกิน 150 · agent เตือนเกิน 120 · เกิน 160 = error (D14 · R4)
const DESC_HARD_MAX = 160, SKILL_DESC_SOFT = 150, AGENT_DESC_SOFT = 120;
function checkDescLength(file, len, soft) {
  if (len > DESC_HARD_MAX) err(file, `description ยาว ${len} ตัว เกิน ${DESC_HARD_MAX} — ตัดให้เหลือ "ใช้เมื่อไหร่" + งานหลัก`);
  else if (len > soft) warn(file, `description ยาว ${len} ตัว เกิน ${soft}`);
}
// claude.ai ไม่รับ plugin ที่ description ใน plugin.json ยาวเกิน 500 ตัว (ทดสอบอัปโหลด 2026-10-08: ≤488 ผ่าน · ≥516 ไม่ผ่าน)
const PLUGIN_DESC_MAX = 500;
function checkPluginDescription(file, description) {
  if (description && description.length > PLUGIN_DESC_MAX)
    err(file, `description ยาว ${description.length} ตัว เกิน ${PLUGIN_DESC_MAX} — claude.ai ไม่รับ plugin นี้ตอนอัปโหลด`);
}
let inspected = 0;
// รายการใน marketplace.json ประกาศ mcpServers เองได้ — checkPlugin ตรวจด้วย (อ่านก่อนเรียก checkPlugin · JSON พังรายงานตอนตรวจ marketplace)
let mpEntries = [];

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
  text = text.replace(/\r\n/g, '\n'); // Windows checkouts use CRLF — same file, not a broken one
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
    if (!quoted && /^[\[{*&!%@`]/.test(value)) {
      err(file, `YAML พัง: "${currentKey}" ขึ้นต้นด้วย ${value[0]} โดยไม่มีเครื่องหมายคำพูด\n` +
                `      → YAML อ่านเป็น list/object หรือ parse ไม่ผ่าน (เช่น [month|year-end] [--x]) · claude.ai ไม่รับ plugin นี้\n` +
                `      แก้: ครอบค่าด้วย '...' เช่น ${currentKey}: '${value.slice(0, 30)}'`);
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
    // คำอธิบายทุกตัวถูกโหลดเข้า context ทุก session — ยาวเกินจะดันตัวอื่นตกโควตา
    checkDescLength(file, description.length, SKILL_DESC_SOFT);
    // คำสั่งที่ผู้ใช้พิมพ์เอง (disable-model-invocation: true) — Claude ไม่ได้ใช้ description เลือก จึงไม่ต้องบอก "ใช้เมื่อไหร่"
    const userOnly = String(fm['disable-model-invocation']) === 'true';
    if (userOnly) { /* ตรวจแค่ความยาวกับแท็กด้านบนและล่าง */ }
    else if (description.length < 60)   warn(file, `description สั้นแค่ ${description.length} ตัว — บอก "ใช้เมื่อไหร่" ให้ครบ ไม่งั้น skill จะไม่ถูกเรียก`);
    if (/<[a-zA-Z/]/.test(description)) err(file, 'description มีแท็ก < > — ไม่อนุญาต');
    // หมายเหตุ: \b ใช้กับอักษรไทยไม่ได้ใน JavaScript regex — ตรวจแบบไม่มี word boundary
    if (!userOnly && !/(^|[^a-z])use\s|ใช้/i.test(description)) warn(file, 'description ไม่ได้บอกว่าใช้เมื่อไหร่ — ขึ้นต้นด้วย "Use when …" หรือ "ใช้เมื่อ …"');
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
function checkAgent(file, soft = AGENT_DESC_SOFT) {
  inspected++;
  const stem = basename(file, '.md');
  const fm = parseFrontmatter(file, readFileSync(file, 'utf8'));
  if (!fm) return;
  if (!fm.name) err(file, 'ไม่มี name');
  else if (fm.name !== stem) err(file, `name "${fm.name}" ไม่ตรงกับชื่อไฟล์ "${stem}"`);
  if (!fm.description) err(file, 'ไม่มี description');
  else checkDescLength(file, fm.description.length, soft);
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
  checkPluginDescription(pj, j.description);

  for (const sub of ['skills', 'agents', 'commands']) {
    const d = join(dir, sub);
    if (!existsSync(d)) continue;
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (sub === 'skills' && statSync(p).isDirectory()) checkSkill(p);
      if (sub !== 'skills' && e.endsWith('.md')) checkAgent(p, sub === 'agents' ? AGENT_DESC_SOFT : SKILL_DESC_SOFT);
    }
  }

  // MCP server มาได้ 3 ทาง: .mcp.json · "mcpServers" ใน plugin.json (object หรือ path ไปไฟล์ JSON) · รายการใน marketplace.json
  const local = (rel) => { const p = join(dir, rel.replace(/^\.\//, '')); return existsSync(p) ? readFileSync(p, 'utf8') : null; };
  const pins = {};
  const mcp = join(dir, '.mcp.json');
  if (existsSync(mcp)) { inspected++; Object.assign(pins, checkMcpConfig(mcp, readFileSync(mcp, 'utf8'), local)); }
  const inline = [[pj, j.mcpServers], ...mpEntries.filter(e => e?.name === slug).map(e => [`marketplace.json → ${slug}`, e.mcpServers])];
  for (const [where, value] of inline)
    for (const ref of [].concat(value ?? [])) {
      inspected++;
      if (typeof ref === 'string') {
        const body = local(ref);
        if (body === null) err(where, `"mcpServers" ชี้ไป ${ref} ที่ไม่มีอยู่ใน plugin`);
        else Object.assign(pins, checkMcpConfig(join(dir, ref), body, local));
      } else Object.assign(pins, checkMcpServers(`${where} → mcpServers`, ref, local));
    }
  if (Object.keys(pins).length) checkPinnedVersions(pins, markdownFiles(dir).map(([rel, text]) => [join(ROOT, rel), text]));
}

// ---------------------------------------------------------------- MCP server ของ plugin
// .mcp.json เปิด server ทุกครั้งที่เริ่ม session · npx ที่ไม่ล็อกรุ่นหรือใช้ @latest = ดึงโค้ดใหม่จาก npm ทุกรอบโดยไม่มีใครตรวจ
const RUNNERS = /^(npx|bunx|pnpx|uvx)(\.cmd|\.exe)?$/i;
const PINNED = /^(@[\w.-]+\/)?[\w.-]+@\d+\.\d+\.\d+$/;
const FLOATING = /@(latest|next|canary|beta)\b/;
// คืน { แพ็กเกจ: รุ่น } ที่ล็อกไว้ เพื่อตรวจว่าไฟล์อื่นใน plugin อ้างรุ่นเดียวกัน
function checkMcpConfig(file, text, readLocal) {
  let j;
  try { j = JSON.parse(text); } catch (e) { err(file, `JSON พัง: ${e.message}`); return {}; }
  const servers = j?.mcpServers;
  if (!servers || typeof servers !== 'object') { err(file, 'ไม่มี "mcpServers" — Claude Code จะไม่เปิด server ใดเลย'); return {}; }
  return checkMcpServers(file, servers, readLocal);
}
// ตัด comment ของ JavaScript ออก (/* */ และ // ที่ต้นบรรทัดหรือหลังช่องว่าง — ไม่ตัด https://) แล้วเหลือแค่ string literal
const codeStrings = (body) => [...body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1')
  .matchAll(/(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g)].map(m => m[2]);
// <แพ็กเกจ>@<รุ่น> ใน string · ซ้ายต้องไม่ใช่ตัวอักษร @ / . - เพื่อไม่จับกลางชื่ออื่น
const PKG_SPEC = /(?<![\w@/.-])((?:@[\w.-]+\/)?[a-z0-9][\w.-]*)@([^\s"'`,)\]]*)/gi;
const EXACT = /^\d+\.\d+\.\d+$/;
function checkMcpServers(file, servers, readLocal) {
  const pins = {};
  if (!servers || typeof servers !== 'object') { err(file, '"mcpServers" ต้องเป็น object หรือ path ไปไฟล์ JSON'); return pins; }
  for (const [name, s] of Object.entries(servers)) {
    if (!s?.command && !s?.url) { err(file, `server "${name}" ไม่มี command หรือ url`); continue; }
    const argv = [s.command, ...(s.args ?? [])].filter(a => typeof a === 'string');
    for (const a of argv) if (FLOATING.test(a)) err(file, `server "${name}" ใช้ "${a}" — ห้ามรุ่นลอย ล็อกเลขรุ่น x.y.z`);
    const at = argv.findIndex(a => RUNNERS.test(basename(a)));
    if (at >= 0) {
      const spec = argv.slice(at + 1).find(a => !a.startsWith('-'));
      if (!spec || !PINNED.test(spec)) err(file, `server "${name}" รัน ${basename(argv[at])} "${spec ?? ''}" โดยไม่ล็อกรุ่น — เขียนเป็น <แพ็กเกจ>@x.y.z`);
      else { const i = spec.lastIndexOf('@'); pins[spec.slice(0, i)] = spec.slice(i + 1); }
    }
    // script ของ plugin ที่ server เรียก (launcher) ต้องมีจริง และต้องล็อกรุ่นเหมือนกัน
    for (const a of argv) {
      const m = a.match(/^\$\{CLAUDE_PLUGIN_ROOT\}\/(.+)$/);
      if (!m) continue;
      const body = readLocal(m[1]);
      if (body === null) { err(file, `server "${name}" เรียก ${m[1]} ที่ไม่มีอยู่ใน plugin`); continue; }
      let found = 0;
      for (const str of codeStrings(body))
        for (const [, pkg, ver] of str.matchAll(PKG_SPEC)) {
          if (EXACT.test(ver)) { pins[pkg] = ver; found++; }
          else err(file, `${m[1]} อ้าง "${pkg}@${ver}" — ห้ามรุ่นลอยหรือช่วงรุ่น (@latest · @^ · @~ · @* · @6 · @6.5) ล็อกเลขรุ่น x.y.z`);
        }
      if (!found) err(file, `${m[1]} ไม่มี "<แพ็กเกจ>@x.y.z" ในโค้ด — launcher ต้องล็อกรุ่น`);
    }
  }
  return pins;
}
// เอกสารและคำสั่งใน plugin ที่อ้าง <แพ็กเกจ>@x.y.z ต้องเป็นรุ่นเดียวกับที่ server ใช้
function checkPinnedVersions(pins, files) {
  for (const [pkg, ver] of Object.entries(pins)) {
    const re = new RegExp(`(?<![\\w@/.-])${pkg.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}@(\\d+\\.\\d+\\.\\d+)`, 'g');
    for (const [file, text] of files)
      for (const [, other] of text.matchAll(re))
        if (other !== ver) err(file, `อ้าง ${pkg}@${other} แต่ server ล็อกไว้ที่ ${pkg}@${ver} — แก้ให้ตรงกัน`);
  }
}

// ---------------------------------------------------------------- shared facts
function checkFacts(facts, read) {
  for (const [id, fact] of Object.entries(facts)) {
    for (const rel of fact.files) {
      const body = read(rel);
      if (body === null) { err(rel, `${id}: ไม่มีไฟล์นี้ — ลบออกจาก scripts/check/facts.json หรือแก้ path`); continue; }
      for (const v of [].concat(fact.value))
        if (!body.includes(v)) err(rel, `${id}: ไม่มีค่าปัจจุบัน "${v}" (ตรวจล่าสุด ${fact.checked}) — แก้ไฟล์นี้ หรือแก้ scripts/check/facts.json`);
    }
  }
}

// ---------------------------------------------------------------- retired words
// คำที่เลิกใช้แล้ว (facts.json → retired) ห้ามค้างในไฟล์ที่คนและ agent อ่าน · แจ้งทุกไฟล์ที่เจอในครั้งเดียว ไม่ให้ตามแก้ทีละไฟล์
function checkRetired(retired, files) {
  for (const r of retired) {
    const hits = files.filter(([, text]) => text.includes(r.old)).map(([rel]) => rel);
    if (hits.length) err(hits.join('\n      '), `คำที่เลิกใช้ "${r.old}" ยังค้าง ${hits.length} ไฟล์ — ใช้ ${r.new} (${r.why})`);
  }
}

// ---------------------------------------------------------------- markdown tables
// ทุกแถวมีจำนวนช่องเท่าหัวตาราง · แถวที่ขึ้นต้นด้วย | ต้องอยู่ใต้หัวและแถวคั่น |---| (แถวหลุดเพราะบรรทัดว่างคั่นจะแสดงเป็นข้อความ)
// ตาม GFM | ใน `code` ก็คั่นช่อง ต้องเขียน \|
const cellCount = (row) => row.replace(/\\\|/g, '').trim().replace(/^\||\|$/g, '').split('|').length;
function checkTables(file, text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const isRow = (l) => /^\s*\|/.test(l ?? '');
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) { inFence = !inFence; continue; }   // ไม่รู้จัก: โค้ดย่อหน้า 4 ช่อง · HTML comment · ตารางใน blockquote · fence 4 backtick ที่มี ``` ข้างใน
    if (inFence || !isRow(lines[i]) || isRow(lines[i - 1])) continue;
    if (!/^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] ?? '')) { err(`${file}:${i + 1}`, 'แถวตารางไม่มีหัวและแถวคั่น |---| — มักเป็นแถวที่หลุดเพราะมีบรรทัดว่างคั่น'); continue; }
    const want = cellCount(lines[i]);
    for (let j = i + 1; isRow(lines[j]); j++)
      if (cellCount(lines[j]) !== want) err(`${file}:${j + 1}`, `แถวมี ${cellCount(lines[j])} ช่อง แต่หัวตารางมี ${want} ช่อง`);
  }
}

// ---------------------------------------------------------------- playbook
// ทุกขั้นของ playbook บอก "ใคร:" · ชื่อ agent ใน backtick ต้องมีจริง · ขั้นตรวจต้องอยู่หลังขั้นสุดท้ายที่ลงมือทำ
// คนตรวจ = `reviewer` ตัวใหม่ · ผู้ตรวจเฉพาะทางตัวใหม่ที่บรรทัดเขียน READ_ONLY · ผู้ใช้อนุมัติ/ตรวจ (การเลือกทางไม่ใช่การตรวจ)
// คนทำที่ชื่ออยู่หลังคนตรวจในบรรทัดเดียวกัน = ยังไม่ได้ตรวจ · ขั้นของหัวหน้าทีมที่ขึ้นต้นด้วย แก้/เขียน/ร่าง/สร้าง = ลงมือ (ยกเว้นขั้นรายงาน/บันทึก)
// "ตัวเดิม" ได้เฉพาะ "ตัวเดิม (ถือ …)" ไม่เปลี่ยนระดับโมเดล · ผู้ใช้ไม่ทำขั้นกลางงานและไม่มีขั้นรอคำตอบ · ข้อความหลัง "ไม่ต้อง · ห้าม · ไม่ให้" ไม่นับ
const BUILTIN_AGENTS = new Set(['general-purpose', 'Explore', 'Plan']);
const SPECIALISTS = ['design-critic', 'brand-keeper', 'qa-tester', 'security-engineer', 'risk-manager'];
const READ_ONLY = 'อ่านอย่างเดียว · ไม่แก้ไฟล์';
const CHECKER_NAMES = ['reviewer', ...SPECIALISTS];
const CHECKER_TAIL = new RegExp('`(?:[\\w-]+:)?(' +CHECKER_NAMES.join('|') + ')`( ตัวใหม่)?([^·]*)', 'g');   // [1] ชื่อ · [3] คำหลังชื่อ
// งานลงมือ (สรุปผลตรวจให้หัวหน้าทีมเป็นงานของคนตรวจเอง จึงไม่อยู่ในรายการ)
// "จดผล" คือรายงานผลตรวจ · "ทำงาน/ทำตาม" คือสิ่งที่ถูกตรวจ จึงไม่นับ
const MAKE_VERBS = 'เขียน|ร่าง|แก้|เตรียม|คัด|ทิ้ง|จด(?!ผล)|สร้าง|ปรับ|เพิ่ม|ลบ|ทำ(?!งาน|ตาม)|ส่ง|ย้าย|อัปเดต|กรอก|นัด';
const REVIEWER_MAKES = new RegExp('(^|แล้ว|และ|ซึ่ง|ช่วย|\\(|\\s)(' + MAKE_VERBS + ')');   // คำหลังชื่อคนตรวจ
const THEN_MAKES = new RegExp('(แล้ว|และ)\\s*(' + MAKE_VERBS + ')');   // ในเนื้อขั้น: "ตรวจ…แล้วเตรียม" (ไม่นับ "· นัด" ที่เป็นรายการคำนาม)
// ขั้นที่มีแต่คนตรวจ: ต้องมีงานตรวจใน 80 ตัวอักษรแรก (ตัดปลายทางลิงก์ออกก่อน) และไม่ขึ้นต้นด้วยงานลงมือ (รายการที่อนุญาต เพราะรายการที่ห้ามเลี่ยงด้วยการเลือกคำได้)
// ข้อจำกัดที่ยังเหลือ: คำกริยานอกรายการหลัง "แล้ว · และ" ยังหลุดได้ — reviewer ตัวใหม่เป็นด่านสุดท้าย
const CHECK_NEAR = /^.{0,80}(ตรวจ|พิสูจน์|รีวิว|ทวน|ยืนยัน|รัน|วัด|เทียบ|ทดสอบ|ให้คะแนน|สแกน|อ่าน|ลอง|กด|เช็ก)/;
const MAKE_START = /^\d+\. (\*\*)?(เขียน|ร่าง|แก้|เตรียม|คัด|ทิ้ง|จด|สร้าง|ปรับ|เพิ่ม|ลบ|ทำ|สรุป)/;   // ไม่มี "ส่ง" เพราะ "ส่ง `reviewer`" คือหัวหน้าทีมส่งงาน
const NEGATED = /(ไม่ต้อง|ห้าม|ไม่ให้)[^·)]*/g;
const USER_WAIT = /(?<!ไม่)รอ(คำตอบ|ผู้ใช้|ให้ผู้ใช้)|คำยืนยัน[^·]{0,15}(ไปต่อ|ค่อย)|(?<!คำ|ไม่)ถาม(?!รวม)[^·]{0,20}ผู้ใช้/;   // "ถามรวมครั้งเดียวตอนเริ่ม" ได้
const LEAD_MAKES = /^\d+\. (\*\*)?(แก้|เขียน|ร่าง|สร้าง|ปรับ)|ใคร: หัวหน้าทีม[\s—-]*(แก้|เขียน|ร่าง|สร้าง|ปรับ)/;
const LEAD_RECORDS = /รายงาน|สรุป|บันทึก|CONTEXT\.md|BUILD-PLAN|IMPROVEMENTS|log/;
function checkPlaybook(file, text, hasAgent) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  if (!lines.some(l => /^## ขั้นตอน/.test(l))) { err(file, 'playbook ไม่มีหัวข้อ "## ขั้นตอน"'); return; }
  let steps = 0, lastCheck = 0, lastWork = 0, inSteps = false, inFence = false;
  const userSteps = [];
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    if (/^## /.test(line)) { inSteps = /^## ขั้นตอน/.test(line); continue; }
    const m = inSteps && line.match(/^(\d+)\. /);
    if (!m) continue;
    steps++;
    const at = line.indexOf('ใคร:');
    if (at < 0) { err(file, `ขั้น ${m[1]} ไม่บอก "ใคร:" — ใส่ท้ายบรรทัด: หัวหน้าทีม · ผู้ใช้ · หรือ \`agent\``); continue; }
    const who = line.slice(at + 4);
    const said = who.replace(NEGATED, '');   // "(ไม่ต้องให้ผู้ใช้ตรวจ)" ไม่นับ
    const plain = line.replace(NEGATED, '');
    // คนตรวจอ่านอย่างเดียว: ขั้นที่มีแต่คนตรวจ หรือคำหลังชื่อคนตรวจ ต้องไม่ใช่งานลงมือ (คำในกลุ่ม "ตรวจ…" ไม่นับ เช่น "ตรวจร่าง")
    const isChecker = (n) => n === 'reviewer' || (SPECIALISTS.includes(n) && line.includes(READ_ONLY));
    const actors = [...plain.matchAll(/`([A-Za-z][\w-]*(?::[\w-]+)?)`/g)].map(a => a[1].split(':').pop()).filter(n => hasAgent(n) || BUILTIN_AGENTS.has(n));
    const onlyCheckers = actors.length > 0 && actors.every(isChecker) && !/หัวหน้าทีม/.test(said);
    const checkerSays = [...said.matchAll(CHECKER_TAIL)].filter(t => isChecker(t[1])).map(t => t[3]).join(' ');
    const body = line.slice(0, at).replace(NEGATED, '').replace(/\]\([^)]*\)/g, ']');
    const afterCheck = checkerSays.replace(/ตรวจว่า[^·]*/g, '').replace(/ตรวจ(ร่าง|ผล|ซ้ำ)?/g, '');   // หลัง "ตรวจว่า" คือสิ่งที่ถูกตรวจ · "ตรวจร่าง" คือตรวจ ไม่ใช่ร่าง
    if ((onlyCheckers && (MAKE_START.test(body) || !CHECK_NEAR.test(body) || THEN_MAKES.test(body))) || REVIEWER_MAKES.test(afterCheck))
      err(file, `ขั้น ${m[1]}: คนตรวจ (\`reviewer\` หรือผู้ตรวจเฉพาะทาง) ได้งานลงมือ — ขั้นที่มีแต่คนตรวจต้องเป็นงานตรวจ (ตรวจ · พิสูจน์ · รีวิว · รัน · วัด … ในต้นขั้น ไม่ขึ้นต้นด้วยงานลงมือ) และไม่มี "แล้ว/และ + ${MAKE_VERBS.replace(/\|/g, ' · ')}" · งานลงมือให้ agent สาขาทำ แล้วคนตรวจตรวจ`);
    let checkAt = said.search(/ผู้ใช้(อนุมัติ|ตรวจ)/), workAt = -1;
    if (/^\s*หัวหน้าทีม/.test(who) && LEAD_MAKES.test(plain) && !LEAD_RECORDS.test(plain)) workAt = 0;
    for (const a of said.matchAll(/`([A-Za-z][\w-]*(?::[\w-]+)?)`( ตัวใหม่)?/g)) {   // มีจุด = ชื่อไฟล์ ไม่ใช่ agent
      const name = a[1], base = name.split(':').pop();
      if (!BUILTIN_AGENTS.has(name) && !hasAgent(name)) err(file, `ขั้น ${m[1]}: ไม่มี agent "${name}" ใน plugin นี้`);
      if (name.includes(':') && !line.includes('ถ้าติดตั้ง')) warn(file, `ขั้น ${m[1]}: "${name}" อยู่ plugin อื่น — เขียน "(ถ้าติดตั้ง plugin …)" พร้อมทางสำรอง`);
      const reviews = a[2] && (base === 'reviewer' || (SPECIALISTS.includes(base) && line.includes(READ_ONLY)));
      if (reviews) checkAt = a.index; else workAt = a.index;
    }
    if (workAt >= 0) lastWork = steps;
    if (checkAt >= 0 && workAt < checkAt) lastCheck = steps;
    const kept = [...plain.matchAll(/ตัวเดิม(\s*\([^)]*\))?[^·]*/g)].map(k => k[0]);
    if (kept.some(k => !k.startsWith('ตัวเดิม (ถือ') || /opus|sonnet|haiku/.test(k)))
      err(file, `ขั้น ${m[1]}: "ตัวเดิม" — ใช้ตัวใหม่แล้วส่งงานต่อ ยกเว้นถือของที่ย้ายยาก "ตัวเดิม (ถือ …)" และห้ามเปลี่ยนระดับโมเดล`);
    if (/^\s*ผู้ใช้(?!อนุมัติ|ตรวจ)|ผู้ใช้ตอบ/.test(said) || USER_WAIT.test(plain)) userSteps.push(m[1]);
  }
  if (steps === 0) { err(file, 'playbook ไม่มีขั้นตอนแบบเลขข้อ'); return; }
  if (!lastCheck) err(file, `ไม่มีขั้นที่คนตรวจไม่ใช่คนทำ — ใส่ "ใคร: \`reviewer\` ตัวใหม่" (หรือผู้ตรวจเฉพาะทางที่เขียน "${READ_ONLY}") ในขั้นตรวจ`);
  else if (lastCheck < lastWork) err(file, `ขั้นตรวจสุดท้าย (ขั้น ${lastCheck}) อยู่ก่อนขั้นสุดท้ายที่ลงมือ (ขั้น ${lastWork}) — เพิ่ม "ใคร: \`reviewer\` ตัวใหม่" หลังขั้นนั้น`);
  for (const n of userSteps) err(file, `ขั้น ${n}: ผู้ใช้ทำขั้นกลางงานหรือขั้นนี้รอคำตอบผู้ใช้ — ถามรวมตอนเริ่ม หรือใส่ (รอยืนยัน) แล้วลง "รออนุมัติ" ตอนจบ`);
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
    ['ค่าขึ้นต้นด้วย [', "---\nname: x\ndescription: Use when something happens in a project\nargument-hint: [month|year-end] [--x]\n---\n", /ขึ้นต้นด้วย \[/],
    ['ค่า [ ที่ครอบคำพูดผ่าน', "---\nname: x\ndescription: Use when something happens in a project\nargument-hint: '[--deep]'\n---\n", null],
    ['CRLF ไม่ใช่ error', '---\r\nname: x\r\ndescription: Use when something happens in a project\r\n---\r\n', null],
  ];
  let ok = 0;
  for (const [label, text, expect] of cases) {
    errors.length = 0;
    const fm = parseFrontmatter('x/SKILL.md', text);
    if (fm) {
      if (fm.name && fm.name !== 'x') err('x/SKILL.md', `name "${fm.name}" ไม่ตรงกับชื่อโฟลเดอร์ "x"`);
      if (fm.description?.length > 1024) err('x/SKILL.md', `description ยาว ${fm.description.length} ตัว เกิน 1024`);
    }
    const hit = expect ? errors.some(e => expect.test(e)) : errors.length === 0;
    console.log(`  ${hit ? '✅' : '❌'} ${label}`);
    if (hit) ok++;
  }
  // facts: ไฟล์ที่ค่าเก่าค้างต้องโดนจับ ไฟล์ที่ค่าตรงต้องผ่าน
  const facts = { cap: { value: '17,500', checked: 'test', files: ['old.md', 'new.md'] } };
  errors.length = 0;
  checkFacts(facts, (rel) => (rel === 'old.md' ? 'ฐาน 15,000' : 'ฐาน 17,500'));
  const factHit = errors.length === 1 && errors[0].startsWith('old.md');
  console.log(`  ${factHit ? '✅' : '❌'} facts ค่าเก่าค้าง`);
  if (factHit) ok++;
  // plugin description: 516 ตัวต้องโดนจับ 488 ตัวต้องผ่าน
  errors.length = 0;
  checkPluginDescription('x/plugin.json', 'a'.repeat(516));
  checkPluginDescription('y/plugin.json', 'a'.repeat(488));
  const descHit = errors.length === 1 && errors[0].startsWith('x/');
  console.log(`  ${descHit ? '✅' : '❌'} plugin description เกิน 500`);
  if (descHit) ok++;
  // playbook: ขาด ใคร: · agent ไม่มีจริง · ไม่มีคนตรวจ ต้องโดนจับ · แบบถูกต้องต้องผ่าน
  const has = (n) => ['reviewer', 'developer', 'qa-tester', 'x:writer'].includes(n);
  const pb = (steps) => `# playbook\n\n## ขั้นตอน\n\n${steps}\n\n## จบเมื่อ\n`;
  const pbCases = [
    [pb('1. ทำ · ใคร: หัวหน้าทีม\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 0],
    [pb('1. ทำ\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 1],
    [pb('1. ทำ · ใคร: `ghost`\n2. ตรวจ · ใคร: ผู้ใช้อนุมัติ'), 1],
    [pb('1. ทำ · ใคร: ผู้ใช้ให้ข้อมูล\n2. ตรวจ · ใคร: หัวหน้าทีม (ไม่ต้องให้ผู้ใช้ตรวจ · ไม่ต้องเรียก `reviewer` ตัวใหม่)'), 2],
    // ขั้นตรวจต้องอยู่หลังขั้นสุดท้ายที่ลงมือ · การเลือกทางไม่ใช่การตรวจ · ตัวเดิม · ผู้ใช้กลางงาน
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่\n3. แก้ต่อ · ใคร: `developer` ตัวใหม่'), 1],
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่ · `reviewer` ตัวใหม่ตรวจ\n2. รายงาน · ใคร: หัวหน้าทีม'), 0],
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่\n2. เลือกทาง · ใคร: หัวหน้าทีม (ผู้ใช้เลือก · ผู้ใช้ตัดสิน)'), 1],
    [pb('1. ทำ · ใคร: `developer` ตัวเดิม\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 1],
    [pb('1. ทำ · ใคร: `developer` ตัวเดิม (ถือ server ที่รันอยู่)\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 0],
    [pb('1. ทำ · ใคร: `developer` ตัวเดิม (ถือไฟล์ · `model: opus`)\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 1],
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่\n2. ตั้งเป้า · ใคร: ผู้ใช้\n3. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 1],
    [pb('1. ทำ · ใคร: หัวหน้าทีม (ห้ามให้ผู้ใช้ตรวจ)\n2. ตรวจ · ใคร: หัวหน้าทีม (ไม่ให้ `reviewer` ตัวใหม่ดู)'), 1],
    [pb('1. ทำ · ใคร: หัวหน้าทีม\n   ```\n2. x\n   ```\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 0],
    [pb('1. ทำ · ใคร: หัวหน้าทีม\n2. ตรวจ · ใคร: หัวหน้าทีม'), 1],
    [pb('1. ทำ · ใคร: `general-purpose` ตัวใหม่\n2. ตรวจ · ใคร: หัวหน้าทีม'), 1],
    [pb('1. ทำ · ใคร: หัวหน้าทีม (ไม่ต้องถามผู้ใช้)\n2. ตรวจ · ใคร: หัวหน้าทีม'), 1],
    [pb('1. ทำ · ใคร: หัวหน้าทีม เขียน `CONTEXT.md`\n2. ตรวจ · ใคร: ผู้ใช้อนุมัติ'), 0],
    [pb('```\n1. ตัวอย่าง\n```\n1. ทำ · ใคร: หัวหน้าทีม\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 0],
    // ผู้ตรวจเฉพาะทางนับเมื่อเขียนว่าอ่านอย่างเดียว · คนทำหลังคนตรวจในบรรทัดเดียว · หัวหน้าทีมลงมือ · ตัวเดิม/รอผู้ใช้ทั้งบรรทัด
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่\n2. เขียน test · ใคร: `qa-tester` ตัวใหม่'), 1],
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่\n2. วัดผล · ใคร: `qa-tester` ตัวใหม่ (อ่านอย่างเดียว · ไม่แก้ไฟล์)'), 0],
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่\n2. ตรวจแล้วแก้ · ใคร: `reviewer` ตัวใหม่ตรวจ · `developer` ตัวใหม่แก้'), 1],
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่\n3. แก้ตามผลตรวจ · ใคร: หัวหน้าทีม'), 1],
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่\n3. เขียนรายงาน · ใคร: หัวหน้าทีม'), 0],
    [pb('1. ให้ `developer` ตัวเดิมแก้ · ใคร: `developer` ตัวใหม่\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 1],
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่\n2. เลือกทาง · ใคร: หัวหน้าทีม ถามผู้ใช้ให้เลือก แล้วรอคำตอบ\n3. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 1],
    [pb('1. รวมคำถาม · ใคร: หัวหน้าทีมถาม · ผู้ใช้ตอบ\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 1],
    [pb('1. คำถามที่ต้องให้ผู้ใช้ตอบลง "ค้างอยู่" · ใคร: หัวหน้าทีม (ถามรวมครั้งเดียวตอนเริ่ม)\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 0],
    // ช่องหลุดที่รอบตรวจ 2026-10-12 เจอ: กริยา "ปรับ" · ขีดหลัง "หัวหน้าทีม" · รอผู้ใช้แบบอ้อม
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่\n3. ปรับโค้ดตามผลตรวจ · ใคร: หัวหน้าทีม'), 1],
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่\n2. ตรวจ · ใคร: `reviewer` ตัวใหม่\n3. ปิดงาน · ใคร: หัวหน้าทีม — แก้ข้อที่เหลือ'), 1],
    [pb('1. ทำ · ใคร: `developer` ตัวใหม่\n2. ส่งให้ผู้ใช้ดู ได้คำยืนยันแล้วจึงไปต่อ · ใคร: หัวหน้าทีม\n3. ตรวจ · ใคร: `reviewer` ตัวใหม่'), 1],
  ];
  const pbHit = pbCases.every(([text, n]) => { errors.length = 0; checkPlaybook('p.md', text, has); return errors.length === n; });
  console.log(`  ${pbHit ? '✅' : '❌'} playbook ใคร: · agent มีจริง · มีคนตรวจ`);
  if (pbHit) ok++;
  // agent ข้าม plugin ต้องเขียน "ถ้าติดตั้ง" (D13)
  const xpb = (who) => pb(`1. ทำ · ใคร: ${who}\n2. ตรวจ · ใคร: \`reviewer\` ตัวใหม่`);
  warns.length = 0; checkPlaybook('p.md', xpb('`x:writer` ตัวใหม่'), has);
  const xBad = warns.length === 1;
  warns.length = 0; checkPlaybook('p.md', xpb('`x:writer` ตัวใหม่ (ถ้าติดตั้ง plugin `x` ไม่มีก็ `general-purpose`)'), has);
  const xHit = xBad && warns.length === 0;
  console.log(`  ${xHit ? '✅' : '❌'} playbook agent ข้าม plugin ต้องบอก "ถ้าติดตั้ง"`);
  if (xHit) ok++;
  // description: agent เตือนเกิน 120 · skill เตือนเกิน 150 · ทุกชนิด error เกิน 160
  errors.length = 0; warns.length = 0;
  checkDescLength('a', 121, AGENT_DESC_SOFT); checkDescLength('s', 151, SKILL_DESC_SOFT);
  checkDescLength('ok', 150, SKILL_DESC_SOFT); checkDescLength('big', 161, SKILL_DESC_SOFT);
  const lenHit = warns.length === 2 && errors.length === 1 && errors[0].startsWith('big');
  console.log(`  ${lenHit ? '✅' : '❌'} description agent 120 · skill 150 · error 160`);
  if (lenHit) ok++;
  // บทเรียน 2026-10-12 — กรณีทดสอบคือข้อความจริงจากเหตุการณ์ ต้องล้มกับของเดิม และผ่านกับที่แก้แล้ว
  // คนตรวจได้งานลงมือ: warranty-claim ขั้น 3 · side-project ขั้น 3 (ข้อความก่อนแก้)
  const rv = (step) => { errors.length = 0; checkPlaybook('p.md', pb(`1. ทำ · ใคร: \`developer\` ตัวใหม่\n${step}`), has); return errors.some(e => /ได้งานลงมือ/.test(e)); };
  const rvHit = rv('2. ถ้าจะเคลม ให้ตรวจว่ายังอยู่ในประกัน อ่านเงื่อนไขยกเว้น แล้วเตรียมเอกสาร · ใคร: `reviewer` ตัวใหม่')
    && rv('2. เขียนนิยาม "เสร็จ" ที่ตรวจได้ 3–5 ข้อ · ใคร: `reviewer` ตัวใหม่')
    && !rv('2. เขียนนิยาม "เสร็จ" ที่ตรวจได้ 3–5 ข้อ · ใคร: `developer` ตัวใหม่เขียน · `reviewer` ตัวใหม่ตรวจว่าทุกข้อวัดได้')
    && !rv('2. ตรวจทั้งชุด — การแก้ที่เก็บ · ค่าดิบ · ใคร: `reviewer` ตัวใหม่')
    // ทางเลี่ยงที่ reviewer รอบ 1 ลองแล้วหลุด · และถ้อยคำตรวจที่ต้องไม่โดนจับ
    && rv('2. ทำเอกสารแจ้งศูนย์ · ใคร: `reviewer` ตัวใหม่')
    && rv('2. รอบตรวจ · ใคร: `reviewer` ตัวใหม่ตรวจแล้วแก้ไฟล์ที่ผิด')
    && rv('2. รอบตรวจ · ใคร: `reviewer` ตัวใหม่ตรวจและเขียนสรุปส่งผู้ใช้')
    && !rv('2. ตรวจว่ารายการที่ให้แก้ครบทุกข้อ · ใคร: `reviewer` ตัวใหม่')
    && !rv('2. รอบตรวจ · ใคร: `reviewer` ตัวใหม่ตรวจผลแล้วสรุปข้อที่เจอให้หัวหน้าทีม')
    // reviewer รอบ 2: จับเกินหลัง "ตรวจว่า" · ถ้อยคำตรวจที่เป็นธรรมชาติ · ทางเลี่ยงด้วยคำกริยาอื่น
    && !rv('2. รอบตรวจ · ใคร: `reviewer` ตัวใหม่ตรวจว่าแก้ครบ')
    && !rv('2. ลองกดทุกปุ่มใน mockup · ใคร: `reviewer` ตัวใหม่')
    && !rv('2. รันเทสต์แล้วจดผลลงตาราง · ใคร: `reviewer` ตัวใหม่')
    && rv('2. ตรวจเอกสาร แล้วส่งอีเมลถึงลูกค้า · ใคร: `reviewer` ตัวใหม่')
    && rv('2. รอบตรวจ · ใคร: `reviewer` ตัวใหม่ (เขียนไฟล์แก้เอง)');
  console.log(`  ${rvHit ? '✅' : '❌'} คนตรวจได้งานลงมือ (warranty-claim · side-project)`);
  if (rvHit) ok++;
  // แถวหลุดตารางเพราะบรรทัดว่างคั่น: brainstormer แถว "ไม่ทำ" · จำนวนช่องไม่ตรงหัว
  const tb = (text) => { errors.length = 0; checkTables('t.md', text); return errors.length; };
  const head = '| ทาง | แรง |\n|---|---|\n| ก. | เล็ก |\n';
  const tbHit = tb(head + '\n| ไม่ทำ | ไม่มี |\n') === 1 && tb(head + '| ไม่ทำ | ไม่มี |\n') === 0
    && tb(head + '| ไม่ทำ |\n') === 1 && tb('```\n| a |\n```\n' + head) === 0 && tb('~~~\n| a |\n~~~\n' + head) === 0
    && tb('| `a\\|b` | x |\n|---|---|\n| 1 | 2 |\n') === 0 && tb('| `a|b` | x |\n|---|---|\n| 1 | 2 |\n') >= 1;   // GFM: | ใน code ก็คั่นช่อง
  console.log(`  ${tbHit ? '✅' : '❌'} ตาราง markdown แถวหลุด · จำนวนช่อง`);
  if (tbHit) ok++;
  // คำที่เลิกใช้: docs/USAGE.md ก่อนแก้ (commit 24dbac3) ต้องโดนจับ หลังแก้ต้องผ่าน
  errors.length = 0;
  checkRetired([{ old: '`ตรวจจริง` · `อนุมาน` · `เดา`', new: 'ป้าย 4 คำ', why: 'test' }], [
    ['old.md', '| คำตอบตอนจบ | ทุกข้ออ้างมีป้าย `ตรวจจริง` · `อนุมาน` · `เดา` · ข้อเสนอปรับปรุงไม่เกิน 3 ข้อ |'],
    ['new.md', '| คำตอบตอนจบ | ทุกข้ออ้างมีป้าย `ตรวจจริง` · `จากแหล่ง` · `อนุมาน` · `ยังไม่ตรวจ` |']]);
  const reHit = errors.length === 1 && errors[0].startsWith('old.md') && !errors[0].includes('new.md');
  console.log(`  ${reHit ? '✅' : '❌'} คำที่เลิกใช้ (ป้าย \`เดา\` ใน docs)`);
  if (reHit) ok++;
  // .mcp.json: @latest · npx ไม่ล็อกรุ่น · JSON พัง · launcher หาย/รุ่นลอย ต้องโดนจับ · แบบที่ล็อกรุ่นผ่าน launcher ต้องผ่าน · รุ่นในเอกสารต้องตรง
  const mcp = (servers, files = {}) => {
    errors.length = 0;
    const pins = checkMcpConfig('m/.mcp.json', typeof servers === 'string' ? servers : JSON.stringify({ mcpServers: servers }), (rel) => files[rel] ?? null);
    return [errors.length, pins];
  };
  const launcher = { 'scripts/l.mjs': 'export const P = "demo-mcp@6.5.0";' };
  const viaLauncher = { demo: { command: 'node', args: ['${CLAUDE_PLUGIN_ROOT}/scripts/l.mjs'] } };
  const pinErr = (text) => { errors.length = 0; checkPinnedVersions({ 'demo-mcp': '6.5.0' }, [['d.md', text]]); return errors.length; };
  const mcpHit = mcp({ demo: { command: 'npx', args: ['-y', 'demo-mcp@latest', 'mcp'] } })[0] >= 1
    && mcp({ demo: { command: 'npx', args: ['-y', 'demo-mcp', 'mcp'] } })[0] === 1
    && mcp({ demo: { command: 'cmd.exe', args: ['/d', '/c', 'npx', '-y', 'demo-mcp', 'mcp'] } })[0] === 1
    && mcp({ demo: { command: 'npx', args: ['-y', 'demo-mcp@6.5.0', 'mcp'] } })[0] === 0
    && mcp('{ "mcpServers": ')[0] === 1
    && mcp(viaLauncher)[0] === 1
    && mcp(viaLauncher, { 'scripts/l.mjs': 'spawn("npx", ["-y", "demo-mcp@latest"])' })[0] >= 1
    && mcp(viaLauncher, launcher)[0] === 0 && mcp(viaLauncher, launcher)[1]['demo-mcp'] === '6.5.0'
    && pinErr('npx -y demo-mcp@6.4.0 doctor') === 1 && pinErr('npx -y demo-mcp@6.5.0 doctor · ห้าม demo-mcp@latest') === 0;
  // ช่วงรุ่นและรุ่นไม่ครบ ต้องโดนจับทั้งใน .mcp.json (ทุก runner) และใน launcher · comment ไม่นับ · ชื่อที่ซ้อนในชื่ออื่นไม่นับ
  const ranged = ['^6.5.0', '~6.5.0', '*', '6', '6.5'];
  const rangeHit = ['npx', 'bunx', 'pnpx', 'uvx'].every(r => ranged.every(v => mcp({ s: { command: r, args: ['-y', `demo-mcp@${v}`] } })[0] === 1)
      && mcp({ s: { command: r, args: ['pkg-x@1.2.3'] } })[0] === 0 && mcp({ s: { command: r, args: ['-y', 'pkg-x'] } })[0] === 1)
    && ranged.every(v => mcp(viaLauncher, { 'scripts/l.mjs': `export const P = "demo-mcp@${v}";` })[0] === 2)   // ช่วงรุ่น + ไม่มีรุ่นที่ล็อก
    && mcp(viaLauncher, { 'scripts/l.mjs': 'spawn("npx", ["-y", "demo-mcp", "mcp"])' })[0] === 1
    && mcp(viaLauncher, { 'scripts/l.mjs': '// เดิมใช้ "demo-mcp@latest"\n/* "demo-mcp@^6" */\nconst P = "demo-mcp@6.5.0"; const r = "https://registry.npmjs.org/";' })[0] === 0
    && mcp(viaLauncher, { 'scripts/l.mjs': '// "demo-mcp@6.5.0"\nconst P = "demo-mcp";' })[0] === 1
    && pinErr('xdemo-mcp@6.4.0 · @scope/demo-mcp@6.4.0 · foo/demo-mcp@6.4.0') === 0;
  console.log(`  ${mcpHit && rangeHit ? '✅' : '❌'} .mcp.json ห้ามรุ่นลอยหรือช่วงรุ่น · launcher ต้องล็อกรุ่น (comment ไม่นับ) · รุ่นในเอกสารตรงกัน`);
  if (mcpHit && rangeHit) ok++;
  // mcpServers ที่ประกาศใน plugin.json (object และ path) และใน marketplace.json ต้องโดนตรวจเหมือน .mcp.json
  const tmp = mkdtempSync(join(tmpdir(), 'vm-'));
  const plug = (name, pj, files = {}) => {
    const d = join(tmp, name);
    mkdirSync(join(d, '.claude-plugin'), { recursive: true });
    writeFileSync(join(d, '.claude-plugin', 'plugin.json'), JSON.stringify({ name, version: '0.1.0', description: 'test', ...pj }));
    for (const [rel, body] of Object.entries(files)) writeFileSync(join(d, rel), body);
    errors.length = 0; checkPlugin(d); return errors.length;
  };
  const bad = { s: { command: 'npx', args: ['-y', 'demo-mcp@^6'] } }, good = { s: { command: 'npx', args: ['-y', 'demo-mcp@6.5.0'] } };
  let inlineHit;
  try {
    inlineHit = plug('p1', { mcpServers: bad }) === 1 && plug('p2', { mcpServers: good }) === 0
      && plug('p3', { mcpServers: './m.json' }, { 'm.json': JSON.stringify({ mcpServers: bad }) }) === 1
      && plug('p4', { mcpServers: './none.json' }) === 1;
    mpEntries = [{ name: 'p5', mcpServers: bad }];
    inlineHit = inlineHit && plug('p5', {}) === 1;
  } finally { mpEntries = []; rmSync(tmp, { recursive: true, force: true }); }
  console.log(`  ${inlineHit ? '✅' : '❌'} mcpServers ใน plugin.json และ marketplace.json โดนตรวจเหมือน .mcp.json`);
  if (inlineHit) ok++;
  errors.length = 0; warns.length = 0;
  const total = cases.length + 10;
  console.log(`\nself-test ${ok}/${total} ผ่าน`);
  process.exit(ok === total ? 0 : 1);
}

// ---------------------------------------------------------------- run
if (process.argv.includes('--self-test')) selfTest();

const pluginsDir = join(ROOT, 'plugins');
if (!existsSync(pluginsDir)) { console.error(`ไม่พบ ${pluginsDir}`); process.exit(1); }

const plugins = readdirSync(pluginsDir).filter(d => !d.startsWith('.') && statSync(join(pluginsDir, d)).isDirectory());
try { mpEntries = JSON.parse(readFileSync(join(ROOT, '.claude-plugin', 'marketplace.json'), 'utf8')).plugins ?? []; } catch { mpEntries = []; }
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

// playbook ของ superuser ทุก plugin — playbook-template เป็นแม่แบบ ไม่ตรวจ
for (const p of plugins) {
  const refDir = join(pluginsDir, p, 'skills', 'superuser', 'references');
  if (!existsSync(refDir)) continue;
  const hasAgent = (name) => {
    const [plug, agent] = name.includes(':') ? name.split(':') : [p, name];
    // agent กลาง (reviewer · brainstormer · learning-reviewer) อยู่ใน superuser ที่เดียว · plugin อื่นได้มาทาง dependencies
    return existsSync(join(pluginsDir, plug, 'agents', `${agent}.md`)) || (!name.includes(':') && existsSync(join(pluginsDir, 'superuser', 'agents', `${agent}.md`)));
  };
  for (const f of readdirSync(refDir).filter(n => /^playbook-.+\.md$/.test(n) && n !== 'playbook-template.md')) {
    inspected++;
    checkPlaybook(join(refDir, f), readFileSync(join(refDir, f), 'utf8'), hasAgent);
  }
}

// README ต้องพูดถึงทุก plugin ไม่งั้นคนหาไม่เจอว่ามีอะไรบ้าง
const readme = join(ROOT, 'README.md');
if (existsSync(readme)) {
  const t = readFileSync(readme, 'utf8');
  for (const p of plugins) if (!t.includes(p)) warn(readme, `ไม่ได้พูดถึง plugin "${p}"`);
}

// ข้อเท็จจริงที่ใช้ร่วมกันหลายไฟล์ (อัตราภาษี ฐานประกันสังคม ฯลฯ) — ไฟล์ที่ลงทะเบียนไว้ต้องมีค่าปัจจุบัน
// อัตราเปลี่ยน → แก้ค่าใน facts.json ที่เดียว แล้วตัวตรวจจะชี้ทุกไฟล์ที่ต้องตามแก้
const factsFile = join(ROOT, 'scripts', 'check', 'facts.json');
if (existsSync(factsFile)) checkFacts(JSON.parse(readFileSync(factsFile, 'utf8')).facts, (rel) => {
  const p = join(ROOT, rel);
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
});

// ไฟล์ .md ที่คนและ agent อ่าน (ไม่นับ dist/ ซึ่ง build มาจากที่นี่ และ _to_delete/) — ตรวจตาราง และคำที่เลิกใช้
function markdownFiles(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (['dist', '_to_delete', 'node_modules', '.git'].includes(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) markdownFiles(p, out);
    else if (e.name.endsWith('.md')) out.push([p.slice(ROOT.length + 1).replace(/\\/g, '/'), readFileSync(p, 'utf8')]);
  }
  return out;
}
const docFiles = ['plugins', 'prompt', 'docs', 'scripts/install'].filter(d => existsSync(join(ROOT, d))).flatMap(d => markdownFiles(join(ROOT, d)))
  .concat(existsSync(readme) ? [['README.md', readFileSync(readme, 'utf8')]] : []);
for (const [rel, text] of docFiles) checkTables(rel, text);
if (existsSync(factsFile)) checkRetired(JSON.parse(readFileSync(factsFile, 'utf8')).retired ?? [], docFiles);

// skill กลางที่ต้องเหมือนกันทุก plugin (human-writing · agent-patterns) · ทุก agent ต้องชี้ไปที่ human-writing
// ของกลางของ SuperUser: ต้นฉบับอยู่ที่ plugins/superuser · ทุก plugin ต้องตรงกับต้นฉบับ (sync-superuser.mjs)
if (existsSync(join(pluginsDir, 'superuser'))) {
  const { problems } = planSuperuser(join(pluginsDir, '..'));
  for (const line of problems) err(line, 'ของกลาง SuperUser ไม่ตรงกับต้นฉบับ — แก้ที่ plugins/superuser แล้วรัน node scripts/sync/sync-superuser.mjs');
}
// บล็อกกฎร่วมของ prompt/software-company: ต้นฉบับคือ RULES ใน sync-prompt-rules.mjs
if (existsSync(join(pluginsDir, '..', PROMPT_DIR))) {
  const { problems } = planPromptRules(join(pluginsDir, '..'));
  for (const line of problems) err(line, 'บล็อกกฎร่วมของ prompt ไม่ตรงกับต้นฉบับ — แก้ RULES แล้วรัน node scripts/sync/sync-prompt-rules.mjs');
}
for (const shared of ['human-writing']) {
  if (shared === 'human-writing') for (const p of plugins) {
    const ad = join(pluginsDir, p, 'agents');
    if (!existsSync(ad)) continue;
    for (const a of readdirSync(ad).filter(n => n.endsWith('.md')))
      if (!readFileSync(join(ad, a), 'utf8').includes('human-writing')) err(join(ad, a), 'agent ไม่ได้ชี้ไปที่ human-writing — เพิ่มหัวข้อ ## Writing');
  }
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

// ตัวเลขนับในเอกสารต้องตรงกับของจริง — sync-docs.mjs เป็นเจ้าของเรื่องนี้
let docsOutOfDate = false;
try {
  execFileSync(process.execPath, [join(ROOT, 'scripts', 'sync', 'sync-docs.mjs'), '--check'], { stdio: 'pipe' });
} catch {
  docsOutOfDate = true;
  console.log('  ⚠  เอกสารไม่ตรงกับของจริง — รัน: node scripts/sync/sync-docs.mjs');
  console.log();
}

const failed = errors.length > 0 || docsOutOfDate || (STRICT && warns.length > 0);
process.exit(failed ? 1 : 0);
