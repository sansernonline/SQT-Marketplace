#!/usr/bin/env node
/**
 * validate-manifests.mjs — ตรวจ manifest ของทุกเครื่องมือในคำสั่งเดียว (ให้ pre-commit hook เรียก)
 *
 *   node scripts/check/validate-manifests.mjs                 ต้นฉบับ + dist ทุกเครื่องมือ
 *   node scripts/check/validate-manifests.mjs --source-only   เฉพาะต้นฉบับ (ข้าม dist · ใช้ตอนยังไม่ได้ build)
 *   node scripts/check/validate-manifests.mjs --fail-code=2   ให้ออกรหัสนี้เมื่อพบปัญหา (hook แบบ fail closed ใช้ 2 · ค่าตั้งต้น 1)
 *   node scripts/check/validate-manifests.mjs --self-test
 *
 * ตรวจอะไร
 *   Claude Code   .claude-plugin/marketplace.json · plugins/<p>/.claude-plugin/plugin.json · hooks/hooks.json (ไฟล์ที่ command ชี้ต้องมี) · icon · dependencies
 *   Gemini CLI    dist/gemini-cli/<p>/gemini-extension.json  (ชื่อ sqt-<p> · รุ่นตรง plugin.json · ไฟล์ context มี)
 *   Kimi          dist/kimi/<p>/kimi.plugin.json             (ชื่อ · รุ่น · skills/agents/systemPromptPath ชี้ของที่มี)
 *   Codex         dist/codex/<p>/.codex/agents/*.toml        (มี name และ description)
 *   claude.ai     dist/claude-web/<p>.zip                    (มีไฟล์)
 * ไม่ใช้ dependency ภายนอก · ตรวจศูนย์รายการ = พัง ไม่ใช่ผ่าน
 */
import { readFileSync, readdirSync, existsSync, statSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const readJson = (path, problems, rel) => {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (e) { problems.push(`${rel} · ${existsSync(path) ? 'JSON พัง: ' + e.message : 'ไม่มีไฟล์'}`); return null; }
};
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();
const SEMVER = /^\d+\.\d+\.\d+$/;

// คืน { problems, inspected } · inspected = จำนวน manifest ที่เปิดอ่านจริง
export function checkManifests(root, { dist = true } = {}) {
  const problems = [];
  let inspected = 0;
  const pluginsDir = join(root, 'plugins');
  const names = isDir(pluginsDir) ? readdirSync(pluginsDir).filter((d) => !d.startsWith('.') && isDir(join(pluginsDir, d))) : [];
  const versions = {};

  const mpRel = '.claude-plugin/marketplace.json';
  const mp = readJson(join(root, mpRel), problems, mpRel);
  if (mp) {
    inspected++;
    if (typeof mp.name !== 'string' || !mp.name) problems.push(`${mpRel} · ไม่มี name`);
    if (!mp.owner?.name) problems.push(`${mpRel} · ไม่มี owner.name`);
    if (!Array.isArray(mp.plugins) || !mp.plugins.length) problems.push(`${mpRel} · plugins ว่างหรือไม่ใช่รายการ`);
    const seen = new Set();
    for (const e of mp.plugins ?? []) {
      if (!e?.name) { problems.push(`${mpRel} · มีรายการที่ไม่มี name`); continue; }
      if (seen.has(e.name)) problems.push(`${mpRel} · plugin "${e.name}" ประกาศซ้ำ`);
      seen.add(e.name);
      if (typeof e.source !== 'string' || !e.source.startsWith('./')) problems.push(`${mpRel} · ${e.name} source ต้องเป็น path ขึ้นต้น ./`);
      else if (!existsSync(join(root, e.source, '.claude-plugin', 'plugin.json'))) problems.push(`${mpRel} · ${e.name} source ${e.source} ไม่มี .claude-plugin/plugin.json`);
      if (!e.description) problems.push(`${mpRel} · ${e.name} ไม่มี description`);
    }
    for (const n of names) if (!seen.has(n)) problems.push(`${mpRel} · plugin "${n}" มีโฟลเดอร์แต่ไม่ได้ประกาศ`);
  }

  for (const n of names) {
    const rel = `plugins/${n}/.claude-plugin/plugin.json`;
    const j = readJson(join(root, rel), problems, rel);
    if (!j) continue;
    inspected++;
    if (j.name !== n) problems.push(`${rel} · name "${j.name}" ไม่ตรงชื่อโฟลเดอร์ "${n}"`);
    if (!SEMVER.test(j.version ?? '')) problems.push(`${rel} · version "${j.version}" ต้องเป็น x.y.z`);
    else versions[n] = j.version;
    if (typeof j.description !== 'string' || !j.description) problems.push(`${rel} · ไม่มี description`);
    if (j.icon && !existsSync(join(root, 'plugins', n, j.icon))) problems.push(`${rel} · icon ${j.icon} ไม่มีไฟล์`);
    for (const d of j.dependencies ?? []) {
      const dn = typeof d === 'string' ? d : d?.name;
      if (!dn || !names.includes(dn)) problems.push(`${rel} · dependencies ชี้ plugin "${dn}" ที่ไม่มี`);
    }
    const hooksRel = `plugins/${n}/hooks/hooks.json`;
    if (existsSync(join(root, hooksRel))) {
      const h = readJson(join(root, hooksRel), problems, hooksRel);
      if (h) {
        inspected++;
        if (!h.hooks || typeof h.hooks !== 'object') problems.push(`${hooksRel} · ไม่มี "hooks"`);
        for (const [ev, groups] of Object.entries(h.hooks ?? {}))
          for (const g of [].concat(groups))
            for (const hk of g?.hooks ?? []) {
              const f = String(hk.command ?? '').match(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^"\s]+)/)?.[1];
              if (f && !existsSync(join(root, 'plugins', n, f))) problems.push(`${hooksRel} · ${ev} เรียก ${f} ที่ไม่มีใน plugin — hook นี้จะล้มทุกครั้ง`);
            }
      }
    }
  }

  if (dist && isDir(join(root, 'dist'))) {
    const fix = 'รัน node scripts/build/build-targets.mjs แล้ว commit dist/';
    for (const n of names) {
      const v = versions[n];
      const sameVer = (rel, got) => { if (v && got !== v) problems.push(`${rel} · รุ่น ${got} แต่ plugin.json เป็น ${v} — dist เก่า ${fix}`); };
      const gRel = `dist/gemini-cli/${n}/gemini-extension.json`;
      const g = existsSync(join(root, gRel)) ? readJson(join(root, gRel), problems, gRel) : (problems.push(`${gRel} · ไม่มีไฟล์ — ${fix}`), null);
      if (g) {
        inspected++;
        if (g.name !== `sqt-${n}`) problems.push(`${gRel} · name "${g.name}" ควรเป็น sqt-${n}`);
        sameVer(gRel, g.version);
        if (g.contextFileName && !existsSync(join(root, 'dist/gemini-cli', n, g.contextFileName))) problems.push(`${gRel} · contextFileName ${g.contextFileName} ไม่มีไฟล์`);
      }
      const kRel = `dist/kimi/${n}/kimi.plugin.json`;
      const k = existsSync(join(root, kRel)) ? readJson(join(root, kRel), problems, kRel) : (problems.push(`${kRel} · ไม่มีไฟล์ — ${fix}`), null);
      if (k) {
        inspected++;
        if (k.name !== `sqt-${n}`) problems.push(`${kRel} · name "${k.name}" ควรเป็น sqt-${n}`);
        sameVer(kRel, k.version);
        for (const key of ['skills', 'agents', 'systemPromptPath'])
          if (k[key] && !existsSync(join(root, 'dist/kimi', n, k[key]))) problems.push(`${kRel} · ${key} ${k[key]} ชี้ของที่ไม่มี`);
      }
      const agentsDir = join(root, 'dist/codex', n, '.codex/agents');
      if (isDir(agentsDir)) for (const f of readdirSync(agentsDir).filter((x) => x.endsWith('.toml'))) {
        inspected++;
        const t = readFileSync(join(agentsDir, f), 'utf8');
        for (const key of ['name', 'description']) if (!new RegExp(`^${key} = "`, 'm').test(t)) problems.push(`dist/codex/${n}/.codex/agents/${f} · ไม่มี ${key}`);
      }
      if (!existsSync(join(root, 'dist/claude-web', `${n}.zip`))) problems.push(`dist/claude-web/${n}.zip · ไม่มีไฟล์ — ${fix}`);
    }
  }
  return { problems, inspected };
}

// ---------------------------------------------------------------- self-test
function selfTest() {
  const t = mkdtempSync(join(tmpdir(), 'manifests-selftest-'));
  const put = (p, s) => { mkdirSync(dirname(join(t, p)), { recursive: true }); writeFileSync(join(t, p), typeof s === 'string' ? s : JSON.stringify(s)); };
  const good = () => {
    rmSync(t, { recursive: true, force: true });
    put('.claude-plugin/marketplace.json', { name: 'm', owner: { name: 'o' }, plugins: [{ name: 'a', source: './plugins/a', description: 'd' }] });
    put('plugins/a/.claude-plugin/plugin.json', { name: 'a', version: '1.2.3', description: 'd', icon: './assets/i.png', dependencies: [] });
    put('plugins/a/assets/i.png', 'x');
    put('plugins/a/hooks/hooks.json', { hooks: { SessionStart: [{ hooks: [{ command: 'node "${CLAUDE_PLUGIN_ROOT}/hooks/h.mjs"' }] }] } });
    put('plugins/a/hooks/h.mjs', '');
    put('dist/gemini-cli/a/gemini-extension.json', { name: 'sqt-a', version: '1.2.3', contextFileName: 'GEMINI.md' });
    put('dist/gemini-cli/a/GEMINI.md', '');
    put('dist/kimi/a/kimi.plugin.json', { name: 'sqt-a', version: '1.2.3', skills: './skills/', agents: './agents/', systemPromptPath: './KIMI.md' });
    put('dist/kimi/a/skills/x', ''); put('dist/kimi/a/agents/x', ''); put('dist/kimi/a/KIMI.md', '');
    put('dist/codex/a/.codex/agents/r.toml', 'name = "r"\ndescription = "d"\n');
    put('dist/claude-web/a.zip', 'z');
  };
  // [ชื่อ, ตัวทำให้พัง, ข้อความที่ต้องเจอ]
  const breaks = [
    ['marketplace.json พัง', () => put('.claude-plugin/marketplace.json', '{ x'), /marketplace\.json · JSON พัง/],
    ['plugin ไม่ประกาศ', () => put('plugins/b/.claude-plugin/plugin.json', { name: 'b', version: '1.0.0', description: 'd' }), /"b" มีโฟลเดอร์แต่ไม่ได้ประกาศ/],
    ['version ผิดรูป', () => put('plugins/a/.claude-plugin/plugin.json', { name: 'a', version: '1.2', description: 'd' }), /ต้องเป็น x\.y\.z/],
    ['icon หาย', () => put('plugins/a/.claude-plugin/plugin.json', { name: 'a', version: '1.2.3', description: 'd', icon: './no.png' }), /icon \.\/no\.png ไม่มีไฟล์/],
    ['dependency ชี้ plugin ที่ไม่มี', () => put('plugins/a/.claude-plugin/plugin.json', { name: 'a', version: '1.2.3', description: 'd', dependencies: [{ name: 'zzz' }] }), /plugin "zzz" ที่ไม่มี/],
    ['hook ชี้ไฟล์ที่ไม่มี', () => rmSync(join(t, 'plugins/a/hooks/h.mjs')), /เรียก hooks\/h\.mjs ที่ไม่มี/],
    ['gemini รุ่นเก่า', () => put('dist/gemini-cli/a/gemini-extension.json', { name: 'sqt-a', version: '1.0.0', contextFileName: 'GEMINI.md' }), /dist เก่า/],
    ['kimi systemPromptPath หาย', () => rmSync(join(t, 'dist/kimi/a/KIMI.md')), /systemPromptPath .* ชี้ของที่ไม่มี/],
    ['codex toml ไม่มี description', () => put('dist/codex/a/.codex/agents/r.toml', 'name = "r"\n'), /ไม่มี description/],
    ['zip หาย', () => rmSync(join(t, 'dist/claude-web/a.zip')), /a\.zip · ไม่มีไฟล์/],
  ];
  let ok = 0, total = 0;
  const report = (pass, name) => { total++; if (pass) ok++; console.log(`  ${pass ? 'ผ่าน' : 'ล้ม'} ${name}`); };
  good();
  const base = checkManifests(t);
  report(base.problems.length === 0 && base.inspected === 6, `ชุดที่ถูกต้องผ่าน และเปิดอ่านจริง 6 manifest (ได้ ${base.inspected} · ปัญหา ${base.problems.length})`);
  for (const [name, mutate, want] of breaks) {
    good(); mutate();
    const r = checkManifests(t);
    report(r.problems.some((p) => want.test(p)), `${name} โดนจับ`);
  }
  good(); put('dist/gemini-cli/a/gemini-extension.json', { name: 'sqt-a', version: '9.9.9' });
  report(checkManifests(t, { dist: false }).problems.length === 0, 'โหมดต้นฉบับอย่างเดียวไม่ตรวจ dist');
  rmSync(t, { recursive: true, force: true });
  report(checkManifests(join(t, 'ไม่มี')).problems.length > 0, 'รากที่ไม่มีอะไรเลย = ปัญหา ไม่ใช่ผ่าน');
  console.log(`\nself-test ${ok}/${total} ผ่าน`);
  process.exit(ok === total ? 0 : 1);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('/validate-manifests.mjs')) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) selfTest();
  const root = args.find((a) => a.startsWith('--root='))?.slice(7) ?? join(dirname(fileURLToPath(import.meta.url)), '..', '..');
  const failCode = Number(args.find((a) => a.startsWith('--fail-code='))?.slice(12)) || 1;
  const { problems, inspected } = checkManifests(root, { dist: !args.includes('--source-only') });
  for (const p of problems) console.log(`  ✗ ${p}`);
  if (inspected === 0) { console.error('ไม่ได้เปิดอ่าน manifest เลย — path ผิดหรือตัวตรวจพัง'); process.exit(failCode); }
  console.log(problems.length ? `\nmanifest ผิด ${problems.length} จุด (ตรวจ ${inspected} ไฟล์)` : `manifest ถูกต้องทั้ง ${inspected} ไฟล์`);
  process.exit(problems.length ? failCode : 0);
}
