// ตัวบอก skill ขยาย — อ่านข้อมูลจาก skill-router.json ส่วน scored · byTool · homonyms
//   scored   [{ skill, on: ["prompt"|"file"|"command"], anyOf: [regex | {p, w}], allOf: [...], noneOf: [...], minScore }] ให้คะแนนถ่วงน้ำหนักต่อ skill ไม่ต้องเขียน regex ก้อนใหญ่
//   byTool   { maxSkills, maxBytes, rules: [{ on: "file"|"command"|"import", pattern, skills, weight }] } เจอชื่อไฟล์ คำสั่ง หรือ import ตอนจะลงมือ → บอก skill ไม่เกิน 3 ตัวในงบไบต์ · skill ละครั้งต่อ session ต่อ agent
//   homonyms [{ name, use, note }] ชื่อ skill ที่ซ้ำกับของในตัว Claude Code → ใช้ชื่อเต็มเสมอ
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { readJson, sessionOnce, sessionSeen, editDistance, semverGt, TMP_USER } from "./util.mjs";
import { writtenText } from "./rules.mjs";

const rx = (p, f = "i") => { try { return new RegExp(p, f); } catch { return null; } };
const items = (xs) => (xs ?? []).map((x) => (typeof x === "string" ? { p: x, w: 1 } : { p: x.p, w: x.w ?? 1 }));

/** คะแนนของ 1 กฎ · noneOf ตรง = 0 · allOf ต้องตรงครบ · รวมน้ำหนัก anyOf และ allOf · ถึง minScore (ค่าเริ่ม 1) ถึงนับ */
export function scoreRule(text, rule) {
  const hit = (i) => rx(i.p)?.test(text) ?? false;
  if (items(rule.noneOf).some(hit)) return 0;
  const all = items(rule.allOf);
  if (!all.every(hit)) return 0;
  const score = [...all, ...items(rule.anyOf).filter(hit)].reduce((a, i) => a + i.w, 0);
  return score >= (rule.minScore ?? 1) ? score : 0;
}
export function scoredRoutes(text, router, on = "prompt") {
  return (router?.scored ?? []).filter((r) => [].concat(r.on ?? "prompt").includes(on))
    .map((r) => ({ skill: r.skill, score: scoreRule(text, r) })).filter((x) => x.score > 0);
}

// ชื่อซ้ำกับของในตัว Claude Code · routeSkills ส่งผลมาแก้เป็นชื่อเต็ม
export const fixHomonyms = (skills, router) => skills.map((s) => (router?.homonyms ?? []).find((h) => h.name === s)?.use ?? s);
export function homonymWarn(input, router, sessDir) {
  if (input.tool_name !== "Skill") return "";
  const h = (router?.homonyms ?? []).find((x) => x.name === input.tool_input?.skill);
  if (!h || !sessionOnce(input.session_id, `homonym:${h.name}`, sessDir)) return "";
  return `ชื่อ skill \`${h.name}\` ซ้ำกับของในตัว Claude Code — งานของเครื่องนี้หมายถึง \`${h.use}\`${h.note ? ` (${h.note})` : ""} · ถ้าตั้งใจใช้ตัวในตัวของ Claude Code ทำต่อได้ · ไม่ใช่ให้เรียก \`${h.use}\` ก็เรียกใหม่`;
}

// ── รายการ skill ที่ติดตั้งจริง (ตรวจรายการจริงก่อนแนะนำ · ข้อ 78 และ 46) ─────────────────
// dev: plugins/<plugin>/skills/<skill> ข้าง hook นี้ · ติดตั้งแล้ว: <config>/plugins/cache/<marketplace>/<plugin>/<รุ่น>/skills/<skill> · เก็บผลใน tmp 6 ชั่วโมง
const listDirs = (p) => { try { return readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name); } catch { return []; } };
export function scanInstalled({ pluginsDir, cacheDir }) {
  const full = new Set(), bare = new Set();
  const add = (plugin, skill) => { bare.add(skill); full.add(`${plugin}:${skill}`); };
  if (pluginsDir) for (const p of listDirs(pluginsDir)) for (const s of listDirs(join(pluginsDir, p, "skills"))) add(p, s);
  if (cacheDir) for (const m of listDirs(cacheDir)) for (const p of listDirs(join(cacheDir, m))) for (const v of listDirs(join(cacheDir, m, p))) for (const s of listDirs(join(cacheDir, m, p, v, "skills"))) add(p, s);
  return { full: [...full], bare: [...bare] };
}
export function installedSkills({ hereDir, configDir, now = Date.now(), cacheFile = join(tmpdir(), `sqt-superuser-installed-${TMP_USER}.json`) } = {}) {
  // plugin ที่เปิดอยู่ (enabledPlugins ใน settings) · cache เก็บรุ่นเก่าของ plugin ที่เปลี่ยนชื่อไว้ด้วย (software-company) จึงใช้แยกชื่อซ้ำ
  const enabled = new Set(Object.entries(readJson(join(configDir, "settings.json"), {})?.enabledPlugins ?? {}).filter(([, on]) => on).map(([k]) => k.split("@")[0]));
  const saved = cacheFile ? readJson(cacheFile, null) : null;
  if (saved && now - saved.at < 6 * 3600000) return { full: new Set(saved.full), bare: new Set(saved.bare), enabled };
  const up = join(hereDir, "..", "..");
  const found = scanInstalled({ pluginsDir: basename(up) === "plugins" ? up : null, cacheDir: join(configDir, "plugins", "cache") });
  if (cacheFile && found.bare.length) { try { writeFileSync(cacheFile, JSON.stringify({ at: now, ...found })); } catch { /* ไม่จำก็สแกนใหม่รอบหน้า */ } }
  return { full: new Set(found.full), bare: new Set(found.bare), enabled };
}
// ชื่อเต็มที่ plugin อยู่ในเครื่อง ต้องตรงทั้งชื่อ (superuser:lazy-coding ไม่นับ เพราะ lazy-coding อยู่ใน software-development) · plugin ที่สแกนไม่เจอ (anthropic-skills · skill ในตัว) ไม่รู้ จึงไม่เตือน
const knownPlugin = (p, inst) => [...inst.full].some((f) => f.startsWith(`${p}:`));
const isInstalled = (s, inst) => {
  if (!s.includes(":")) return inst.bare.has(s);
  const plugin = s.slice(0, s.lastIndexOf(":"));
  return inst.full.has(s) || !knownPlugin(plugin, inst);
};
/** ชื่อสั้น → ชื่อเต็ม plugin:skill เมื่อ plugin ที่เปิดอยู่มีตัวเดียวที่ชื่อนี้ (หลายตัวเลือกของ superuser) · ได้ชื่อสั้นแล้ว model เดา prefix ผิด (superuser:lazy-coding 2026-11-13) */
export function qualify(s, inst) {
  if (!inst || s.includes(":")) return s;
  const all = [...inst.full].filter((f) => f.endsWith(`:${s}`));
  const on = inst.enabled?.size ? all.filter((f) => inst.enabled.has(f.slice(0, f.lastIndexOf(":")))) : all;
  const hits = on.length ? on : all;
  return hits.length === 1 ? hits[0] : hits.find((f) => f.startsWith("superuser:")) ?? s;
}

// ── ชื่อ skill ที่ไม่มีในเครื่อง → "หมายถึงอันนี้ไหม" (ไม่ปฏิเสธ) ─────────────────
export function suggestSkill(name, inst) {
  const n = String(name ?? "");
  if (n.length < 5 || isInstalled(n, inst)) return "";
  let best = "", d = 3;
  for (const c of [...inst.full, ...inst.bare]) { const e = editDistance(n.split(":").pop().toLowerCase(), c.split(":").pop().toLowerCase()); if (e < d) { d = e; best = c; } }
  return best ? `ไม่พบ skill "${n}" ในเครื่อง — หมายถึง \`${best}\` ไหม · ถ้าเป็นชื่อ skill ในตัวของ Claude Code ทำต่อได้` : "";
}

// ── บอก skill ตอนจะลงมือ ตามชื่อไฟล์ · คำสั่ง · import ──────────────────────────────
const IMPORT_LINE = /^[ \t]*(?:import\b[^\n]*|from\s+\S+\s+import\b[^\n]*|(?:const|let|var)\s+\S+\s*=\s*require\([^)\n]*\)|using\s+[\w.]+\s*;|#include\s+\S+)/gm;
export const importsOf = (text) => [...String(text).matchAll(IMPORT_LINE)].slice(0, 60).map((m) => m[0].trim()).join("\n").slice(0, 4000);
const listSkills = (xs) => xs.map((s) => `\`${s}\``).join(" · ");

export function toolRoute(input, router, { inst, sessDir } = {}) {
  const cfg = router?.byTool;
  if (!cfg || !inst) return "";
  const tool = input.tool_name ?? "", ti = input.tool_input ?? {}, agent = input.agent_id ?? "main";
  const path = String(ti.file_path ?? ti.notebook_path ?? ""), cmd = tool === "Bash" ? String(ti.command ?? "") : "";
  const imports = importsOf(writtenText(tool, ti));
  const subjects = { file: path, command: cmd, import: imports };
  const cand = new Map();
  const bump = (skill, w) => cand.set(skill, (cand.get(skill) ?? 0) + w);
  for (const r of cfg.rules ?? []) { const t = subjects[r.on]; if (t && rx(r.pattern)?.test(t)) for (const s of r.skills ?? []) bump(s, r.weight ?? 1); }
  for (const on of ["file", "command"]) if (subjects[on]) for (const { skill, score } of scoredRoutes(subjects[on], router, on)) bump(skill, score);
  const key = (s) => `route:${agent}:${s.split(":").pop()}`;
  let chosen = [...cand].map(([s, w]) => [qualify(s, inst), w]).filter(([s]) => !sessionSeen(input.session_id, key(s), sessDir)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, cfg.maxSkills ?? 3).map(([s]) => s);
  const build = (xs) => {
    const have = xs.filter((s) => isInstalled(s, inst)), miss = xs.filter((s) => !isInstalled(s, inst));
    return [have.length && `ตรงกับ skill ${listSkills(have)} — เปิดด้วยเครื่องมือ Skill ก่อนลงมือชิ้นนี้ (ตัวที่เปิดแล้วใน session ข้ามได้)`, miss.length && `skill ${listSkills(miss)} ยังไม่ได้ติดตั้งในเครื่อง — บอกผู้ใช้ ไม่ติดตั้งเอง`].filter(Boolean).join(" · ");
  };
  while (chosen.length > 1 && Buffer.byteLength(build(chosen)) > (cfg.maxBytes ?? 700)) chosen.pop();
  if (!chosen.length) return "";
  for (const s of chosen) sessionOnce(input.session_id, key(s), sessDir);
  return build(chosen).slice(0, cfg.maxBytes ?? 700);
}
/** เปิด skill แล้ว (PostToolUse ของ Skill) → ไม่ต้องบอกซ้ำ */
export function markSkillOpened(input, sessDir) {
  if (input.tool_name !== "Skill" || !input.tool_input?.skill) return;
  sessionOnce(input.session_id, `route:${input.agent_id ?? "main"}:${String(input.tool_input.skill).split(":").pop()}`, sessDir);
}

// ── เล่น log จริงผ่านตัวจับคู่ + เทียบสำเนาที่ติดตั้ง ─────────────────────────────────
// node superuser-hook.mjs --route-replay [โฟลเดอร์ .claude/superuser] → prompt ใน log ที่ไม่มีแถวไหนตรงเลย (ช่องว่างของ router)
export function replayRoutes(teamDir, router, route) {
  const logRoot = join(teamDir, "log"), seen = new Set(), miss = [];
  let total = 0, hit = 0;
  for (const day of listDirs(logRoot)) {
    let lines = []; try { lines = readFileSync(join(logRoot, day, "main.jsonl"), "utf8").split("\n"); } catch { continue; }
    for (const l of lines) {
      let e; try { e = JSON.parse(l); } catch { continue; }
      if (e.event !== "UserPromptSubmit" || !e.prompt || e.prompt.length < 12 || e.prompt.startsWith("/") || seen.has(e.prompt)) continue;
      seen.add(e.prompt); total++;
      if (route(e.prompt, router).length) hit++; else miss.push(e.prompt.replace(/\s+/g, " ").slice(0, 90));
    }
  }
  return { total, hit, miss };
}
const sha = (p) => { try { return createHash("sha1").update(readFileSync(p)).digest("hex").slice(0, 10); } catch { return null; } };
export function cacheDiff(hereDir, configDir) {
  const root = join(configDir, "plugins", "cache");
  const out = [];
  for (const m of listDirs(root)) {
    const vers = listDirs(join(root, m, "superuser")).sort((a, b) => (semverGt(a, b) ? 1 : -1));
    const latest = vers.at(-1);
    if (!latest) continue;
    const cached = join(root, m, "superuser", latest, "hooks");
    const files = (d) => { try { return readdirSync(d, { recursive: true }).map(String).filter((f) => /\.(mjs|json|md)$/.test(f)); } catch { return []; } };
    for (const f of new Set([...files(hereDir), ...files(cached)])) if (sha(join(hereDir, f)) !== sha(join(cached, f))) out.push({ market: m, version: latest, file: f, dev: sha(join(hereDir, f)), installed: sha(join(cached, f)) });
  }
  return out;
}
