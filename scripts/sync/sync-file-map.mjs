#!/usr/bin/env node
/**
 * sync-file-map.mjs — เขียน docs/FILE-MAP.md (แผนผังไฟล์) จากไฟล์จริงใน plugins/
 *
 *   node scripts/sync/sync-file-map.mjs           เขียนทับ docs/FILE-MAP.md
 *   node scripts/sync/sync-file-map.mjs --check   ตรวจอย่างเดียว · ไม่ตรง หรือขาดคำอธิบาย → exit 1
 *
 * คำอธิบายภาษาไทย:
 *   agent · playbook → scripts/diagrams/labels/<plugin>.json ก่อน ไม่มีจึงใช้ file-map-th.json
 *   skill · ไฟล์อื่น  → scripts/sync/file-map-th.json
 * skill หรือ agent ใหม่ที่ยังไม่มีคำอธิบาย → แจ้งชื่อ แล้ว exit 1 (เพิ่มใน file-map-th.json แล้วรันใหม่)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "docs", "FILE-MAP.md");
const CHECK_ONLY = process.argv.includes("--check");
const CORE = "superuser"; // ของกลางอยู่ที่นี่ที่เดียว · plugin อื่นใช้ร่วมผ่าน dependencies
const TH = JSON.parse(readFileSync(join(ROOT, "scripts", "sync", "file-map-th.json"), "utf8"));
const missing = [];

// ── อ่านของจริง ─────────────────────────────────────────────────────────

// ไฟล์ที่เครื่องสร้างเองตอนรัน (cache ของ Python) ไม่อยู่ใน git · ถ้านับ แผนผังในเครื่องจะไม่ตรงกับ CI
const list = (p) => (existsSync(p) ? readdirSync(p).filter((n) => !n.startsWith(".") && n !== "__pycache__" && !n.endsWith(".pyc")).sort() : []);

function walk(dir, base = "") {
  return list(dir).flatMap((name) => {
    const rel = base ? `${base}/${name}` : name;
    return statSync(join(dir, name)).isDirectory() ? walk(join(dir, name), rel) : [rel];
  });
}

function frontmatter(file) {
  const m = readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const out = {};
  for (const line of (m ? m[1] : "").split(/\r?\n/)) {
    const pair = line.match(/^([\w-]+):\s*(.*)$/);
    if (pair) out[pair[1]] = pair[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

function labels(plugin) {
  const p = join(ROOT, "scripts", "diagrams", "labels", `${plugin}.json`);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
}

function scan(name) {
  const dir = join(ROOT, "plugins", name);
  const skills = list(join(dir, "skills")).map((s) => ({
    name: s,
    command: String(frontmatter(join(dir, "skills", s, "SKILL.md"))["disable-model-invocation"]) === "true",
    files: walk(join(dir, "skills", s)).filter((f) => f !== "SKILL.md"),
  }));
  const agents = list(join(dir, "agents")).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));
  const other = walk(dir).filter((f) => !f.startsWith("skills/") && !f.startsWith("agents/"));
  // .claude-plugin ขึ้นต้นด้วยจุด walk ข้าม จึงเพิ่มเอง
  if (existsSync(join(dir, ".claude-plugin", "plugin.json"))) other.unshift(".claude-plugin/plugin.json");
  return { name, skills, agents, other, labels: labels(name) };
}

const plugins = list(join(ROOT, "plugins")).map(scan);
const core = plugins.find((p) => p.name === CORE);
// ของกลาง = skill และ agent ของ superuser ยกเว้น skill superuser (ทุก plugin มีฉบับของตัวเอง)
const sharedSkills = new Set(core.skills.map((s) => s.name).filter((n) => n !== "superuser"));
const sharedAgents = new Set(core.agents);

// ── คำอธิบาย ────────────────────────────────────────────────────────────

function say(table, key, where) {
  const text = table?.[key];
  if (!text) missing.push(`${where}: ${key}`);
  return text ?? "**(ยังไม่มีคำอธิบาย)**";
}
const skillTh = (n) => say(TH.skills, n, "skills");
const agentTh = (p, n) => p.labels.agents?.[n] ?? say(TH.agents, n, `agents (${p.name})`);
const playbookTh = (p, n) => p.labels.playbooks?.[n]?.short ?? say(TH.playbooks, n, `playbooks (${p.name})`);
const code = (s) => `\`${s}\``;
const files = (arr) => (arr.length ? arr.map(code).join(" · ") : "—");

// ── เขียนเอกสาร ─────────────────────────────────────────────────────────

const playbooksOf = (p) =>
  p.skills.find((s) => s.name === "superuser")?.files
    .filter((f) => /^references\/playbook-.+\.md$/.test(f) && f !== "references/playbook-template.md")
    .map((f) => f.slice("references/playbook-".length, -3)) ?? [];

function overview() {
  const rows = plugins.map((p) => {
    const cmd = p.skills.filter((s) => s.command).length;
    const fileCount = p.skills.reduce((n, s) => n + s.files.length + 1, 0) + p.agents.length + p.other.length;
    return `| [${code(p.name)}](#${p.name}) | ${p.labels.tagline ?? ""} | ${p.agents.length} | ${p.skills.length - cmd} | ${cmd} | ${playbooksOf(p).length} | ${fileCount} |`;
  });
  return [
    "| plugin | ทำอะไร | agent | skill | คำสั่ง | playbook | ไฟล์ทั้งหมด |",
    "|---|---|---|---|---|---|---|",
    ...rows,
  ].join("\n");
}

function layout() {
  const f = TH.plugin_files;
  return [
    "```",
    "plugins/<plugin>/",
    `├─ .claude-plugin/plugin.json   ${f[".claude-plugin/plugin.json"]}`,
    `├─ CHANGELOG.md                 ${f["CHANGELOG.md"]}`,
    "├─ agents/<ชื่อ>.md             agent 1 ไฟล์ต่อ 1 ตัว: บทบาท · เครื่องมือที่ใช้ได้ · skill ที่ต้องโหลด",
    "├─ skills/<ชื่อ>/SKILL.md        skill 1 โฟลเดอร์ต่อ 1 ตัว: ใช้เมื่อไร · ทำอย่างไร",
    "│  ├─ references/              รายละเอียดที่ skill เปิดอ่านเมื่อต้องใช้ (ไม่โหลดทุกครั้ง)",
    "│  ├─ templates/               แบบไฟล์ที่คัดลอกไปใช้ในโปรเจกต์",
    "│  └─ scripts/                 สคริปต์ที่ skill เรียกใช้",
    "└─ (hooks/ มีใน superuser ที่เดียว · ดู ของกลาง)",
    "```",
    "",
    "- **skill** → Claude โหลดเองเมื่องานตรงกับ description",
    "- **คำสั่ง** → skill ที่ Claude ไม่โหลดเอง ต้องพิมพ์ `/<plugin>:<ชื่อ>`",
    "- **agent** → ลูกทีมที่หัวหน้าทีม (SuperUser) ส่งงานให้",
    "- **playbook** → ขั้นตอนของงานแต่ละแบบ อยู่ใน `skills/superuser/references/playbook-*.md`",
  ].join("\n");
}

function sharedSection() {
  const sk = core.skills.filter((s) => sharedSkills.has(s.name));
  const generic = new Set(plugins.flatMap((p) => p.skills.find((s) => s.name === "superuser")?.files ?? [])
    .filter((f) => !/playbook-(?!template)/.test(f)));
  return [
    `อยู่ใน ${code("plugins/superuser")} ที่เดียว · plugin อื่นประกาศ ${code('"dependencies": ["superuser"]')} แล้วใช้ร่วมกัน · ${code("scripts/sync/sync-superuser.mjs")} คัดลอกเฉพาะไฟล์กลางของ ${code("skills/superuser/")} (ทุก plugin มี skill superuser ฉบับของตัวเอง)`,
    "",
    "| ชนิด | ชื่อ | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ |",
    "|---|---|---|---|",
    ...sk.map((s) => `| skill | ${code(s.name)} | ${skillTh(s.name)} | ${files(s.files.filter((f) => !f.startsWith("references/playbook-") || s.name !== "superuser"))} |`),
    ...[...sharedAgents].map((a) => `| agent | ${code(a)} | ${agentTh(core, a)} | ${code(`agents/${a}.md`)} |`),
    `| hook | ${code("hooks/")} | ${TH.plugin_files["hooks/superuser-hook.mjs"]} | ${["hooks.json", "superuser-hook.mjs", "core-rules.md", "skill-router.json"].map(code).join(" · ")} |`,
    "",
    `**ไฟล์ข้างใน ${code("skills/superuser/")}** (นอกจาก playbook ของแต่ละ plugin)`,
    "",
    "| ไฟล์ | ใช้ทำอะไร | มีใน |",
    "|---|---|---|",
    ...["SKILL.md", ...[...generic].sort()].map((f) => {
      const has = plugins.filter((p) => f === "SKILL.md" || p.skills.find((s) => s.name === "superuser")?.files.includes(f)).map((p) => p.name);
      return `| ${code(f)} | ${say(TH.superuser_files, f, "superuser_files")} | ${has.length === plugins.length ? "ทุก plugin" : has.map(code).join(" · ")} |`;
    }),
  ].join("\n");
}

function skillRows(p, names) {
  return names.map((n) => {
    const s = p.skills.find((x) => x.name === n);
    return `| ${code(s.name)} | ${skillTh(s.name)} | ${files(s.files)} |`;
  });
}

function pluginSection(p) {
  const own = p.skills.filter((s) => !sharedSkills.has(s.name));
  const skills = own.filter((s) => !s.command).map((s) => s.name);
  const commands = own.filter((s) => s.command).map((s) => s.name);
  const out = [
    `## ${p.name}`,
    "",
    `${p.labels.tagline ?? ""} · ภาพประกอบ: [docs/plugins/${p.name}](plugins/${p.name}/README.md) · ต้นฉบับ: ${code(`plugins/${p.name}/`)}`,
    "",
    `**ไฟล์ระดับ plugin:** ${p.other.map((f) => `${code(f)} (${say(TH.plugin_files, f, "plugin_files")})`).join(" · ")}`,
    "",
    `### agent (${p.agents.length})`,
    "",
    "| ไฟล์ | ใช้ทำอะไร |",
    "|---|---|",
    ...p.agents.map((a) => `| ${code(`agents/${a}.md`)} | ${agentTh(p, a)}${sharedAgents.has(a) ? " · ของกลาง" : ""} |`),
    "",
    `### skill (${skills.length} + ของกลาง ${sharedSkills.size})`,
    "",
    `ของกลาง: ${[...sharedSkills].map(code).join(" · ")} — ดู [ของกลาง](#ของกลาง)`,
    "",
  ];
  const groups = p.labels.skill_groups;
  const head = ["| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |", "|---|---|---|"];
  if (groups) {
    const placed = new Set();
    for (const [group, names] of Object.entries(groups)) {
      const here = names.filter((n) => skills.includes(n));
      here.forEach((n) => placed.add(n));
      if (here.length) out.push(`**${group}**`, "", ...head, ...skillRows(p, here), "");
    }
    const rest = skills.filter((n) => !placed.has(n));
    if (rest.length) out.push("**อื่น ๆ**", "", ...head, ...skillRows(p, rest), "");
  } else if (skills.length) {
    out.push(...head, ...skillRows(p, skills), "");
  }
  if (commands.length) {
    out.push(`### คำสั่ง (${commands.length}) — พิมพ์ ${code(`/${p.name}:<ชื่อ>`)}`, "", ...head, ...skillRows(p, commands), "");
  }
  const pbs = playbooksOf(p);
  out.push(
    `### playbook (${pbs.length}) — ${code("skills/superuser/references/")}`,
    "",
    "| ไฟล์ | ทำอะไร | ขั้น |",
    "|---|---|---|",
    ...pbs.map((n) => `| ${code(`playbook-${n}.md`)} | ${playbookTh(p, n)} | ${p.labels.playbooks?.[n]?.steps?.length ?? "—"} |`),
    "",
  );
  return out.join("\n");
}

const doc = [
  "<!-- สร้างโดย scripts/sync/sync-file-map.mjs · แก้คำอธิบายที่ scripts/sync/file-map-th.json ไม่แก้ที่นี่ -->",
  "",
  "# แผนผังไฟล์ (file map)",
  "",
  `แต่ละ plugin มีไฟล์อะไร ใช้ทำอะไร · สร้างจากไฟล์จริงใน ${code("plugins/")} · เพิ่มหรือลบ skill แล้วรัน ${code("node scripts/sync/sync-file-map.mjs")} (${code("build-dist.cmd")} รันให้แล้ว)`,
  "",
  "## สารบัญ",
  "",
  overview(),
  "",
  "## โครงของทุก plugin",
  "",
  layout(),
  "",
  "## ของกลาง",
  "",
  sharedSection(),
  "",
  ...plugins.map(pluginSection),
].join("\n").replace(/\n{3,}/g, "\n\n");

// ── เขียนหรือตรวจ ──────────────────────────────────────────────────────

if (missing.length) {
  console.error(`✗ ยังไม่มีคำอธิบายภาษาไทย ${missing.length} รายการ → เพิ่มใน scripts/sync/file-map-th.json`);
  for (const m of [...new Set(missing)]) console.error(`  - ${m}`);
  process.exit(1);
}
const current = existsSync(OUT) ? readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";
if (CHECK_ONLY) {
  if (current !== doc) {
    console.error("✗ docs/FILE-MAP.md ไม่ตรงกับ plugins/ → รัน node scripts/sync/sync-file-map.mjs");
    process.exit(1);
  }
  console.log("✓ docs/FILE-MAP.md ตรงกับ plugins/");
} else {
  writeFileSync(OUT, doc, "utf8");
  console.log(`✓ เขียน docs/FILE-MAP.md · ${plugins.length} plugin`);
}
