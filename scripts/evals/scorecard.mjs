#!/usr/bin/env node
// ชั้น 0 ของ docs/SKILL-SCORECARD.md: วัดทุก skill จากไฟล์ใน repo อย่างเดียว ไม่เรียก claude ไม่เสียเงิน
//   node scripts/evals/scorecard.mjs                 สรุปต่อ plugin + 15 skill ที่ควรเขียนเคสก่อน
//   node scripts/evals/scorecard.mjs --md <ไฟล์>     เขียนตารางทุก skill ลงไฟล์ (ใช้ _to_delete/ ถ้าไม่เก็บ)
//   node scripts/evals/scorecard.mjs --plugin <ชื่อ>  เฉพาะ plugin เดียว
import { readdirSync, readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const args = process.argv.slice(2);
const opt = (flag) => { const i = args.indexOf(flag); return i < 0 ? null : args[i + 1]; };
const onlyPlugin = opt("--plugin");
const mdPath = opt("--md");

const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const dirs = (p) => (existsSync(p) ? readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory()) : []);
const router = read(join(ROOT, "plugins/superuser/hooks/skill-router.json"));
const expiry = read(join(ROOT, "scripts/check/expiry.json"));

// ระดับจากไฟล์อย่างเดียว · B และ A ต้องมีผลรันจริง (ดูหัวข้อ 4 ของ SKILL-SCORECARD.md)
function grade(s) {
  if (s.trigger && s.negative && s.behaviour) return "C";
  if (s.trigger || s.behaviour) return "C-";
  return "D";
}

const rows = [];
for (const plugin of dirs(join(ROOT, "plugins"))) {
  if (onlyPlugin && plugin !== onlyPlugin) continue;
  const cases = dirs(join(ROOT, "plugins", plugin, "evals"));
  for (const skill of dirs(join(ROOT, "plugins", plugin, "skills"))) {
    const dir = join(ROOT, "plugins", plugin, "skills", skill);
    const skillMd = join(dir, "SKILL.md");
    if (!existsSync(skillMd)) continue;
    const mine = cases.filter((c) => c === skill || c.startsWith(skill + "-"));
    const s = {
      plugin, skill,
      kb: Math.round(statSync(skillMd).size / 100) / 10,
      trigger: mine.filter((c) => /-trigger(-\d+)?$/.test(c) && !/no-trigger/.test(c)).length,
      negative: mine.filter((c) => /negative|no-trigger/.test(c)).length,
      behaviour: mine.filter((c) => /behaviou?r|-guard|-regression/.test(c)).length,
      scripts: dirs(dir).includes("scripts") ? readdirSync(join(dir, "scripts")).filter((f) => /\.(mjs|js|py|ps1)$/.test(f)).length : 0,
      router: router.includes(`"${skill}"`) || router.includes(`:${skill}"`),
      expiry: (expiry.match(new RegExp(`/skills/${skill}/`, "g")) || []).length,
    };
    s.grade = grade(s);
    // ตัวเลขที่หมดอายุหรือสคริปต์คิดเลข = ผิดแล้วผู้ใช้เสียของจริง → ควรมีเคส behaviour ก่อนตัวอื่น
    s.priority = (s.behaviour ? 0 : 2 * s.expiry + (s.scripts ? 2 : 0)) + (s.trigger ? 0 : 1);
    rows.push(s);
  }
}

const pct = (n, d) => (d ? Math.round((100 * n) / d) + "%" : "-");
const byPlugin = {};
for (const r of rows) (byPlugin[r.plugin] ??= []).push(r);
const summary = Object.entries(byPlugin).map(([plugin, rs]) => ({
  plugin,
  skill: rs.length,
  "มีเคสเปิด": pct(rs.filter((r) => r.trigger).length, rs.length),
  "มีเคสไม่ควรเปิด": pct(rs.filter((r) => r.negative).length, rs.length),
  "มีเคสพฤติกรรม": pct(rs.filter((r) => r.behaviour).length, rs.length),
  "อยู่ใน router": pct(rs.filter((r) => r.router).length, rs.length),
  "ระดับ C": rs.filter((r) => r.grade === "C").length,
  "ระดับ D": rs.filter((r) => r.grade === "D").length,
}));
console.table(summary);

const todo = rows.filter((r) => r.priority > 1).sort((a, b) => b.priority - a.priority).slice(0, 15);
console.log("\nควรเขียนเคสก่อน (มีตัวเลขหมดอายุหรือสคริปต์ แต่ยังไม่มีเคสพฤติกรรม):");
console.table(todo.map(({ plugin, skill, expiry, scripts, trigger, grade }) => ({ plugin, skill, expiry, scripts, trigger, grade })));

if (mdPath) {
  const head = "| plugin | skill | KB | เคสเปิด | ไม่ควรเปิด | พฤติกรรม | สคริปต์ | router | วันหมดอายุ | ระดับ |\n|---|---|---|---|---|---|---|---|---|---|\n";
  const body = rows.map((r) => `| ${r.plugin} | ${r.skill} | ${r.kb} | ${r.trigger} | ${r.negative} | ${r.behaviour} | ${r.scripts} | ${r.router ? "มี" : "-"} | ${r.expiry} | ${r.grade} |`).join("\n");
  writeFileSync(mdPath, `# scorecard ชั้น 0 · ${new Date().toISOString().slice(0, 10)} · ${rows.length} skill\n\n${head}${body}\n`);
  console.log(`\nเขียนตาราง ${rows.length} แถวที่ ${mdPath}`);
}
