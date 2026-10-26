#!/usr/bin/env node
/**
 * build-targets.mjs — สร้างชุด skill/agent/command ของทุก plugin สำหรับ LLM ตัวอื่นจาก plugins/
 *
 *   node scripts/build/build-targets.mjs                 สร้างลง dist/
 *   node scripts/build/build-targets.mjs --out=<โฟลเดอร์>  สร้างลงที่อื่น (ใช้ทดสอบ)
 *   node scripts/build/build-targets.mjs --check         สร้างลงโฟลเดอร์ชั่วคราวแล้วเทียบกับ dist/ · ต่าง = ลืมสร้างใหม่หลังแก้ต้นฉบับ → exit 1 (รันก่อน commit)
 *   node scripts/build/build-targets.mjs --self-test     พิสูจน์ว่าตัวเทียบจับ dist เก่าได้
 *
 * แหล่งความจริงคือ plugins/ (รูปแบบ Claude) เท่านั้น · dist/ เป็นผลลัพธ์ ห้ามแก้มือ
 * สคริปต์ลบโฟลเดอร์ผลลัพธ์ทิ้งแล้วสร้างใหม่ทุกครั้ง
 *
 * ทุก plugin ได้ชุดของตัวเอง เพราะชื่อ skill ซ้ำกันข้าม plugin ได้ (เช่น superuser)
 * ของกลาง (human-writing · answer-shape · reviewer · hook …) อยู่ใน plugins/superuser ที่เดียว · Claude Code ได้มาทาง dependencies
 * ปลายทางอื่นไม่มี dependencies → สคริปต์ใส่ของกลางลงชุดของทุก plugin ที่ประกาศ dependencies: ["superuser"] ให้ใช้เดี่ยวได้
 *
 *   dist/claude-web/<plugin>.zip         claude.ai (Cowork / แชทเว็บ) อัปโหลดทีละไฟล์
 *   dist/codex/<plugin>/                 OpenAI Codex CLI → .agents/skills · .codex/agents/*.toml · AGENTS.md
 *   dist/gemini-cli/<plugin>/            Gemini CLI extension → gemini-extension.json · skills · agents · commands/*.toml
 *   dist/kimi/<plugin>/                  Kimi Code CLI plugin → kimi.plugin.json · skills (คำสั่ง = skill เรียกเอง) · agents · KIMI.md
 *   dist/chat-web/<plugin>/<บทบาท>/      ChatGPT Custom GPT / Gemini Gem → instructions.md + knowledge/
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync, cpSync, statSync, mkdtempSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { deflateRawSync, crc32 } from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CHECK = process.argv.includes("--check");
const OUT_ARG = process.argv.find((a) => a.startsWith("--out="))?.slice(6);
const DIST = CHECK ? mkdtempSync(join(tmpdir(), "dist-check-")) : OUT_ARG ? resolve(OUT_ARG) : join(ROOT, "dist");

// เทียบ 2 โฟลเดอร์ dist · ไฟล์ข้อความ (ไม่มีไบต์ 0) ไม่นับ CRLF/LF · คืนรายการ path ที่ต่าง ขาด หรือเกิน
// บทเรียน 2026-10-25: แก้ต้นฉบับหลังสร้าง dist แล้วไม่ได้สร้างใหม่ ผู้ตรวจจึงเจอ dist เก่า
export function distDiff(want, have) {
  const files = (dir, pre = "") => (existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name), `${pre}${e.name}/`) : [`${pre}${e.name}`]) : []);
  const norm = (b) => (b.includes(0) ? b : Buffer.from(b.toString("latin1").replace(/\r\n/g, "\n"), "latin1"));
  const a = new Set(files(want)), b = new Set(files(have));
  const out = [...a].filter((f) => !b.has(f)).map((f) => `ขาดใน dist: ${f}`);
  out.push(...[...b].filter((f) => !a.has(f)).map((f) => `เกินใน dist: ${f}`));
  for (const f of a) if (b.has(f) && !norm(readFileSync(join(want, f))).equals(norm(readFileSync(join(have, f))))) out.push(`ต่าง: ${f}`);
  return out.sort();
}

if (process.argv.includes("--self-test")) {
  const t = mkdtempSync(join(tmpdir(), "dist-selftest-"));
  const put = (p, s) => { mkdirSync(dirname(join(t, p)), { recursive: true }); writeFileSync(join(t, p), s); };
  put("want/a.md", "x\ny\n"); put("want/z.bin", Buffer.from([0, 13, 10]));
  put("have/a.md", "x\r\ny\r\n"); put("have/z.bin", Buffer.from([0, 13, 10]));
  const same = distDiff(join(t, "want"), join(t, "have")).length === 0;
  put("want/a.md", "x\ny\nแถวใหม่\n"); put("have/old.md", "x");
  const d = distDiff(join(t, "want"), join(t, "have"));
  const stale = d.length === 2 && d.includes("ต่าง: a.md") && d.includes("เกินใน dist: old.md");
  rmSync(t, { recursive: true, force: true });
  console.log(`  ${same ? "ผ่าน" : "ล้ม"} เนื้อหาเท่ากันต่างแค่ CRLF ไม่นับว่าต่าง · ไบนารีเทียบทุกไบต์`);
  console.log(`  ${stale ? "ผ่าน" : "ล้ม"} แก้ต้นฉบับหลังสร้าง dist โดนจับ · ไฟล์ค้างใน dist โดนจับ`);
  console.log(`\nself-test ${Number(same) + Number(stale)}/2 ผ่าน`);
  process.exit(same && stale ? 0 : 1);
}

// ขีดจำกัดของหน้าเว็บ (ตรวจเมื่อ 2026-10-01)
const GPT_INSTRUCTIONS_MAX = 8000; // ตัวอักษร
const KNOWLEDGE_FILES_MAX = 10;    // Gem รับ 10 ไฟล์ · Custom GPT รับ 20 → ใช้ค่าที่น้อยกว่า

// ไฟล์ที่ไม่ใส่ในชุดสำหรับหน้าเว็บ (ใหญ่เกินและหน้าเว็บรันสคริปต์แตกไฟล์ไม่ได้)
const WEB_SKIP = [/\.zip$/i];

// ไฟล์ขยะจากการรันสคริปต์ในเครื่อง ไม่ส่งออกทุกชุด · .ruff_cache เคยหลุดเข้า zip จน CI ล้ม (PR #23 · 2026-10-26)
const JUNK = /(^|[\\/])(__pycache__|\.pytest_cache|\.ruff_cache|\.mypy_cache|\.venv|node_modules)([\\/]|$)|\.pyc$/;
const COPY = { recursive: true, filter: (src) => !JUNK.test(src) };

// ── อ่านของจริงจาก plugins/ ────────────────────────────────────────────

function listDir(path) {
  return existsSync(path) ? readdirSync(path).sort() : [];
}

function parse(file) {
  // ตัด \r ออก: เครื่องที่ checkout เป็น CRLF จะได้ dist เหมือนเครื่องอื่น (ไม่งั้น \r หลุดเข้า TOML ของ Codex)
  const text = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { fields: {}, body: text };
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([\w-]+):\s*(.*)$/);
    if (pair) fields[pair[1]] = pair[2].replace(/^["']|["']$/g, "");
  }
  return { fields, body: match[2].trim() + "\n" };
}

const loaded = listDir(join(ROOT, "plugins")).map((plugin) => {
  const dir = join(ROOT, "plugins", plugin);
  const read = (sub, toItem) => listDir(join(dir, sub)).map((n) => toItem(n, join(dir, sub, n)));
  const meta = JSON.parse(readFileSync(join(dir, ".claude-plugin", "plugin.json"), "utf8"));
  const all = read("skills", (name, path) => ({ name, path, ...parse(join(path, "SKILL.md")) }));
  // skill ที่มี disable-model-invocation: true = คำสั่งที่ผู้ใช้พิมพ์เอง → แปลงเป็นคำสั่งของปลายทาง
  const isCommand = (s) => s.fields["disable-model-invocation"] === "true";
  const skills = all.filter((s) => !isCommand(s));
  return {
    plugin,
    dir,
    version: meta.version ?? "0.0.0",
    description: meta.description ?? "",
    skills,
    skillByName: new Map(skills.map((s) => [s.name, s])),
    agents: read("agents", (n, path) => ({ name: n.replace(/\.md$/, ""), ...parse(path) })),
    commands: all.filter(isCommand),
    dependsOn: (name) => (meta.dependencies ?? []).some((d) => String(typeof d === "string" ? d : d.name).split("@")[0] === name),
    meta,
  };
});

// ของกลางที่ plugin อื่นใช้ร่วม · ชุดสำหรับปลายทางอื่นต้องใช้เดี่ยวได้ จึงใส่ให้ทุก plugin ที่ประกาศ dependencies
// รายการต้องตรงกับ SHARED_ONLY_IN_SUPERUSER ใน scripts/sync/sync-superuser.mjs
const SHARED_SKILLS = ["adversarial-review-panel", "agent-patterns", "answer-shape", "chat-prompt-workflows", "commit-log", "context-budget", "decision-log", "design-references", "document-naming", "flag-and-propose", "handoff", "human-writing", "no-ai-look", "owner-style-capture", "parallel-attempts-pick-best", "parallel-split-and-merge", "polished-document-style", "polite-message-th-en", "principle-build-a-tool-not-handwork", "principle-fix-root-cause", "principle-proceed-on-reversible-work", "principle-prove-it-works", "principle-small-verifiable-steps", "principle-user-experience-first", "prior-art-review", "repeated-mistakes-to-checks", "research-with-sources", "session-lessons-to-skills", "simplify", "skill-authoring", "spell-out-abbreviations", "status-report", "targeted-fix", "temp-file-discipline", "translate-th-en"];
const SHARED_AGENTS = ["brainstormer", "reviewer", "learning-reviewer"];
const core = loaded.find((p) => p.plugin === "superuser");
// SKILL.md ของ superuser สาขามีเฉพาะส่วนสาขา (Claude Code เปิดแกนจาก plugin superuser เอง) · ปลายทางอื่นไม่มี dependencies จึงรวมแกน + สาขาเป็นไฟล์เดียว
const POINTER_LINE = /^> \*\*เปิด `superuser:superuser` ก่อน\*\*[^\n]*\n\n?/m;
function mergedSuperuser(p) {
  const own = p.skillByName.get("superuser"), base = core?.skillByName.get("superuser");
  if (!own || !base) return null;
  const branch = own.body.replace(POINTER_LINE, "").replace(/^# [^\n]*\n\n?/, "");
  return { ...own, body: `${base.body.trimEnd()}\n\n---\n\n# ส่วนของสาขา ${p.plugin}\n\n${branch}` };
}
const plugins = loaded.map((p) => {
  const fromCore = p.dependsOn("superuser") && core;
  if (!fromCore) return { ...p, shared: [], merged: null };
  const merged = fromCore ? mergedSuperuser(p) : null;
  const skills = [
    ...p.skills.map((s) => (merged && s.name === "superuser" ? merged : s)),
    ...(fromCore ? core.skills.filter((s) => SHARED_SKILLS.includes(s.name) && !p.skillByName.has(s.name)) : []),
  ];
  const have = new Set(p.agents.map((a) => a.name));
  const agents = [...p.agents, ...(fromCore ? core.agents.filter((a) => SHARED_AGENTS.includes(a.name) && !have.has(a.name)) : [])];
  // ไฟล์ของกลางสำหรับ zip: skill · agent · hook วางที่ path เดียวกันใน plugin นี้ · reference ของแกนที่สาขาไม่มี (autonomy · modules · playbook กลาง) ใส่ให้ด้วย
  const ownRefs = new Set(filesUnder(join(p.dir, "skills", "superuser"), "skills/superuser/").map((f) => f.name));
  const shared = [
    ...(fromCore ? SHARED_SKILLS.flatMap((n) => filesUnder(join(core.dir, "skills", n), `skills/${n}/`)) : []),
    ...(fromCore && merged ? filesUnder(join(core.dir, "skills", "superuser"), "skills/superuser/").filter((f) => !ownRefs.has(f.name) && !/SKILL\.md$/.test(f.name)) : []),
    ...(fromCore ? SHARED_AGENTS.map((n) => ({ path: join(core.dir, "agents", `${n}.md`), name: `agents/${n}.md` })) : []),
    ...(fromCore ? filesUnder(join(core.dir, "hooks"), "hooks/") : []),
  ].filter((f) => existsSync(f.path));
  return { ...p, skills, skillByName: new Map(skills.map((s) => [s.name, s])), agents, shared, merged };
});

// ── ตัวช่วยเขียนไฟล์ ──────────────────────────────────────────────────

function write(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

// simple: สตริงแบบ JSON เป็นสตริง basic ที่ถูกต้องทั้งใน TOML และ YAML
const quote = (s) => JSON.stringify(s);

const frontmatter = (fields) =>
  "---\n" + Object.entries(fields).map(([k, v]) => `${k}: ${quote(v)}`).join("\n") + "\n---\n\n";

function contextFile(p, tool, agentsHow) {
  const roles = p.agents.map((a) => `- **${a.name}** — ${a.fields.description}`).join("\n") || "ไม่มี";
  return `# SQT ${p.plugin} — ${tool}

> สร้างอัตโนมัติจาก plugins/${p.plugin}/ โดย scripts/build/build-targets.mjs (v${p.version}) · ห้ามแก้ไฟล์นี้โดยตรง

${p.description}

ชุดนี้มี skill ${p.skills.length} ตัว · บทบาท ${p.agents.length} บทบาท · คำสั่งสำเร็จรูป ${p.commands.length} คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → ${agentsHow}
- งานหลายขั้น → เริ่มที่ skill \`superuser\` · ทุกคำตอบและเอกสารเขียนตาม skill \`human-writing\`

## บทบาททั้งหมด

${roles}
`;
}

// วาง skill ทุกตัวของ plugin ลงโฟลเดอร์ปลายทาง · superuser สาขา → SKILL.md แกน + สาขา และ reference ของแกนที่สาขาไม่มี
function placeSkills(p, dir) {
  for (const s of p.skills) cpSync(s.path, join(dir, s.name), COPY);
  if (!p.merged) return;
  const head = readFileSync(join(p.merged.path, "SKILL.md"), "utf8").match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)?.[0] ?? "";
  write(join(dir, "superuser", "SKILL.md"), `${head}\n${p.merged.body}`);
  for (const f of p.shared.filter((f) => f.name.startsWith("skills/superuser/"))) cpSync(f.path, join(dir, f.name.replace(/^skills\//, "")), COPY);
}

// ── Codex CLI ─────────────────────────────────────────────────────────

function buildCodex(p) {
  const out = join(DIST, "codex", p.plugin);
  placeSkills(p, join(out, ".agents/skills"));

  // Codex เลิกใช้ custom prompt แล้ว → แปลงคำสั่งเป็น skill ที่เรียกด้วย $ชื่อ
  for (const c of p.commands) {
    const body = c.body.replaceAll("$ARGUMENTS", "สิ่งที่ผู้ใช้ระบุมากับคำสั่ง");
    write(join(out, ".agents/skills", c.name, "SKILL.md"),
      frontmatter({ name: c.name, description: c.fields.description }) + body);
  }

  for (const a of p.agents) {
    write(join(out, ".codex/agents", `${a.name}.toml`),
      `name = ${quote(a.name)}\ndescription = ${quote(a.fields.description)}\ndeveloper_instructions = ${quote(a.body)}\n`);
  }

  write(join(out, "AGENTS.md"), contextFile(p, "OpenAI Codex CLI",
    "เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง`"));
}

// ── Gemini CLI (extension) ────────────────────────────────────────────

function buildGemini(p) {
  const out = join(DIST, "gemini-cli", p.plugin);
  placeSkills(p, join(out, "skills"));

  // ชื่อเครื่องมือของ Claude (Read, Edit, …) ไม่ตรงกับของ Gemini → ตัด tools/model ทิ้งให้ใช้ค่าเริ่มต้น
  for (const a of p.agents) {
    write(join(out, "agents", `${a.name}.md`),
      frontmatter({ name: a.name, description: a.fields.description }) + a.body);
  }

  for (const c of p.commands) {
    const prompt = c.body.replaceAll("$ARGUMENTS", "{{args}}");
    write(join(out, "commands", `${c.name}.toml`),
      `description = ${quote(c.fields.description)}\nprompt = ${quote(prompt)}\n`);
  }

  write(join(out, "gemini-extension.json"), JSON.stringify({
    name: `sqt-${p.plugin}`,
    version: p.version,
    description: p.description,
    contextFileName: "GEMINI.md",
  }, null, 2) + "\n");

  write(join(out, "GEMINI.md"), contextFile(p, "Gemini CLI",
    "เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`"));
}

// ── Kimi Code CLI (plugin) ────────────────────────────────────────────

function buildKimi(p) {
  const out = join(DIST, "kimi", p.plugin);
  placeSkills(p, join(out, "skills"));

  // Kimi ไม่มีโฟลเดอร์คำสั่งแยกที่มีเอกสารชัด → เป็น skill ที่ผู้ใช้เรียกเองด้วย /skill:ชื่อ
  for (const c of p.commands) {
    write(join(out, "skills", c.name, "SKILL.md"),
      frontmatter({ name: c.name, description: c.fields.description, disableModelInvocation: true }) + c.body);
  }

  // ตัด tools/model เหมือน Gemini · ${base_prompt} คงคำสั่งพื้นฐานของ Kimi ไว้ก่อนบทบาท
  for (const a of p.agents) {
    write(join(out, "agents", `${a.name}.md`),
      frontmatter({ name: a.name, description: a.fields.description }) + "${base_prompt}\n\n" + a.body);
  }

  write(join(out, "kimi.plugin.json"), JSON.stringify({
    name: `sqt-${p.plugin}`,
    version: p.version,
    description: p.description,
    skills: "./skills/",
    ...(p.agents.length && { agents: "./agents/" }),
    systemPromptPath: "./KIMI.md",
  }, null, 2) + "\n");

  write(join(out, "KIMI.md"), contextFile(p, "Kimi Code CLI",
    "เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/skill:ชื่อคำสั่ง`"));
}

// ── ChatGPT Custom GPT / Gemini Gem ───────────────────────────────────

function skillAsText(s) {
  let text = `# skill: ${s.name}\n\n${s.fields.description}\n\n${s.body}`;
  const refs = join(s.path, "references");
  for (const f of listDir(refs).filter((f) => f.endsWith(".md") && statSync(join(refs, f)).isFile())) {
    text += `\n\n## reference: ${f}\n\n${readFileSync(join(refs, f), "utf8")}`;
  }
  return text;
}

// แบ่งรายการเป็น n กองให้ใกล้เคียงกัน
function chunk(list, n) {
  if (list.length === 0) return [];
  const size = Math.ceil(list.length / n);
  return Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, (i + 1) * size));
}

function buildChatWeb(p) {
  const out = join(DIST, "chat-web", p.plugin);
  const tooLong = [];

  for (const a of p.agents) {
    const dir = join(out, a.name);
    // skill ที่ agent อ้างถึง + skill กลางที่ทุกบทบาทต้องใช้ · หาเฉพาะใน plugin เดียวกัน
    const named = [...a.body.matchAll(/`([a-z0-9-]+)`/g)].map((m) => m[1]);
    const used = [...new Set([...named, "human-writing"])]
      .filter((n) => p.skillByName.has(n)).map((n) => p.skillByName.get(n));

    let instructions = a.body;
    let slots = KNOWLEDGE_FILES_MAX;
    if (instructions.length > GPT_INSTRUCTIONS_MAX) {
      tooLong.push(`${p.plugin}/${a.name}`);
      write(join(dir, "knowledge/00-role.md"), a.body);
      slots -= 1;
      instructions = `You are the **${a.name}** described in the knowledge file \`00-role.md\`.\n` +
        `Read it before every answer and follow it exactly. ${a.fields.description}\n`;
    }
    write(join(dir, "instructions.md"), instructions);

    chunk(used, slots).forEach((group, i) => {
      const file = group.length === 1 ? group[0].name : `skills-${String(i + 1).padStart(2, "0")}`;
      write(join(dir, "knowledge", `${file}.md`), group.map(skillAsText).join("\n\n---\n\n"));
    });
  }
  return tooLong;
}

function chatWebReadme(tooLong) {
  write(join(DIST, "chat-web", "README.md"), `# ChatGPT Custom GPT / Gemini Gem

> สร้างอัตโนมัติโดย scripts/build/build-targets.mjs · ห้ามแก้ไฟล์ในโฟลเดอร์นี้โดยตรง

1 โฟลเดอร์ = 1 GPT หรือ Gem (\`<plugin>/<บทบาท>/\`)

1. คัดลอก \`instructions.md\` ไปวางในช่อง Instructions
2. อัปโหลดทุกไฟล์ใน \`knowledge/\` เป็นไฟล์ความรู้ (Knowledge)

ขีดจำกัดที่ใช้ตอนสร้าง: Instructions ไม่เกิน ${GPT_INSTRUCTIONS_MAX} ตัวอักษร (Custom GPT) ·
ไฟล์ความรู้ไม่เกิน ${KNOWLEDGE_FILES_MAX} ไฟล์ (Gem)

บทบาทที่ยาวเกินช่อง Instructions → ย้ายเนื้อหาไปไว้ใน \`knowledge/00-role.md\`:
${tooLong.map((n) => `\`${n}\``).join(", ") || "ไม่มี"}

ข้อจำกัด: หน้าเว็บรันสคริปต์ใน skill ไม่ได้ และไม่มีคำสั่งสำเร็จรูป (slash command)
`);
}

// ── claude.ai (Cowork / แชทเว็บ) ──────────────────────────────────────

function filesUnder(dir, prefix = "") {
  return listDir(dir).flatMap((n) => {
    const path = join(dir, n);
    return statSync(path).isDirectory() ? filesUnder(path, `${prefix}${n}/`) : [{ path, name: prefix + n }];
  });
}

// ไฟล์ข้อความ (ไม่มีไบต์ 0) เปลี่ยน CRLF เป็น LF เหมือน parse() zip จึงเหมือนกันทุกเครื่อง · .cmd .ps1 เป็น CRLF เสมอตาม .gitattributes
const CRLF_FILE = /\.(cmd|ps1)$/i;
const toLf = (name, data) => {
  if (data.includes(0)) return data;
  const lf = data.toString("latin1").replace(/\r\n/g, "\n");
  return Buffer.from(CRLF_FILE.test(name) ? lf.replace(/\n/g, "\r\n") : lf, "latin1");
};

// simple: เขียน zip เองด้วย zlib แทน dependency · วันที่คงที่ ไฟล์จึงไม่เปลี่ยนถ้าเนื้อหาไม่เปลี่ยน
function writeZip(out, files) {
  const DOS_DATE = 0x21; // 1980-01-01
  const local = [], central = [];
  let offset = 0;
  for (const f of files) {
    const data = toLf(f.name, f.data ?? readFileSync(f.path));
    const packed = deflateRawSync(data);
    const name = Buffer.from(f.name, "utf8");
    const head = (size) => {
      const b = Buffer.alloc(size);
      b.writeUInt16LE(0x0800, size === 30 ? 6 : 8);  // ชื่อไฟล์เป็น UTF-8
      b.writeUInt16LE(8, size === 30 ? 8 : 10);       // deflate
      b.writeUInt16LE(DOS_DATE, size === 30 ? 12 : 14);
      b.writeUInt32LE(crc32(data), size === 30 ? 14 : 16);
      b.writeUInt32LE(packed.length, size === 30 ? 18 : 20);
      b.writeUInt32LE(data.length, size === 30 ? 22 : 24);
      b.writeUInt16LE(name.length, size === 30 ? 26 : 28);
      return b;
    };
    const lh = head(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    const ch = head(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt32LE(offset, 42);
    local.push(lh, name, packed);
    central.push(ch, name);
    offset += lh.length + name.length + packed.length;
  }
  const dir = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(dir.length, 12);
  end.writeUInt32LE(offset, 16);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.concat([...local, dir, end]));
}


// โฟลเดอร์หลักในไฟล์ zip ต้องเป็น <plugin>/ ไม่ใช่ plugins/<plugin>/
function buildClaudeWeb(p) {
  // zip ใช้เดี่ยวได้: ใส่ของกลางจาก superuser และตัด dependencies ออกจาก plugin.json (claude.ai ไม่ได้ติดตั้ง superuser ให้)
  // agent ที่โหลด skill กลางด้วยชื่อเต็ม (superuser:simplify) → ใน zip ของกลางเป็นของ plugin นี้เอง จึงเปลี่ยนชื่อนำหน้า
  // ตัวบอก skill และกฎประจำตัวใน hooks/ ก็อ้าง superuser:simplify เช่นกัน
  const local = (f) => /\/agents\/[^/]+\.md$|\/hooks\/(skill-router\.json|core-rules\.md)$/.test(f.name) && p.shared.length
    ? { ...f, data: Buffer.from(readFileSync(f.path, "utf8").replace(/^(\s+- )superuser:/gm, `$1${p.plugin}:`).replace(/(["`])superuser:/g, `$1${p.plugin}:`)) } : f;
  // SKILL.md ของ superuser สาขา → แกน + สาขาในไฟล์เดียว (frontmatter ของสาขาคงเดิม)
  const mergedSkill = (f) => {
    const text = readFileSync(f.path, "utf8");
    const head = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)?.[0] ?? "";
    return { ...f, data: Buffer.from(`${head}\n${p.merged.body}`) };
  };
  const own = filesUnder(p.dir, `${p.plugin}/`).map((f) => f.name === `${p.plugin}/.claude-plugin/plugin.json` && p.shared.length
    ? { ...f, data: Buffer.from(JSON.stringify({ ...p.meta, dependencies: undefined }, null, 2) + "\n") }
    : f.name === `${p.plugin}/skills/superuser/SKILL.md` && p.merged ? mergedSkill(f) : local(f));
  const files = [...own, ...p.shared.map((f) => local({ ...f, name: `${p.plugin}/${f.name}` }))]
    .filter((f) => !WEB_SKIP.some((re) => re.test(f.name)) && !JUNK.test(f.name))
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  const out = join(DIST, "claude-web", `${p.plugin}.zip`);
  writeZip(out, files);
  return statSync(out).size;
}

function distReadme(rows) {
  const table = rows.map((r) =>
    `| \`${r.plugin}\` | ${r.version} | ${r.skills} | ${r.agents} | ${r.commands} | ${(r.zip / 1024 / 1024).toFixed(1)} MB |`).join("\n");
  write(join(DIST, "README.md"), `# dist — ชุดสำหรับเครื่องมืออื่น

> สร้างอัตโนมัติโดย scripts/build/build-targets.mjs · ห้ามแก้ไฟล์ในโฟลเดอร์นี้โดยตรง · สร้างใหม่ → รัน \`scripts\\build-dist.cmd\`

ทุก plugin ได้ชุดของตัวเอง ติดตั้งเฉพาะ plugin ที่ใช้

| ปลายทาง | โฟลเดอร์ | วิธีใช้ |
|---|---|---|
| claude.ai (Cowork / แชทเว็บ) | \`claude-web/<plugin>.zip\` | อัปโหลดทีละไฟล์ |
| OpenAI Codex CLI | \`codex/<plugin>/\` | คัดลอกเนื้อในโฟลเดอร์ไปไว้รากโปรเจกต์ |
| Gemini CLI | \`gemini-cli/<plugin>/\` | \`gemini extensions install <โฟลเดอร์>\` |
| Kimi Code CLI | \`kimi/<plugin>/\` | \`/plugins install <โฟลเดอร์>\` ในหน้าจอ Kimi |
| ChatGPT Custom GPT / Gemini Gem | \`chat-web/<plugin>/<บทบาท>/\` | ดู \`chat-web/README.md\` |

| plugin | รุ่น | skill | บทบาท | คำสั่ง | ขนาด zip |
|---|---|---:|---:|---:|---:|
${table}

ไฟล์ .zip ภายใน skill (เช่นคลังไอคอน) ไม่อยู่ใน \`claude-web/\` เพราะหน้าเว็บแตกไฟล์ไม่ได้ · ชุด codex · gemini-cli · kimi มีครบ
`);
}

// ── main ──────────────────────────────────────────────────────────────

rmSync(DIST, { recursive: true, force: true });
const rows = [];
const tooLong = [];
for (const p of plugins) {
  const zip = buildClaudeWeb(p);
  buildCodex(p);
  buildGemini(p);
  buildKimi(p);
  tooLong.push(...buildChatWeb(p));
  rows.push({ plugin: p.plugin, version: p.version, skills: p.skills.length, agents: p.agents.length, commands: p.commands.length, zip });
  console.log(`  ${p.plugin.padEnd(18)} v${p.version}  ${p.skills.length} skills · ${p.agents.length} agents · ${p.commands.length} commands · zip ${(zip / 1024 / 1024).toFixed(1)} MB`);
}
chatWebReadme(tooLong);
distReadme(rows);
console.log(`dist/ → ${plugins.length} plugins · chat-web: ${tooLong.length} roles moved to knowledge/00-role.md`);
if (CHECK) {
  const diff = distDiff(DIST, join(ROOT, "dist"));
  rmSync(DIST, { recursive: true, force: true });
  for (const line of diff.slice(0, 20)) console.log(`  ${line}`);
  console.log(diff.length ? `\ndist/ เก่ากว่าต้นฉบับ ${diff.length} ไฟล์ — รัน scripts\\build-dist.cmd ใหม่` : "\ndist/ ตรงกับต้นฉบับ");
  process.exit(diff.length ? 1 : 0);
}
