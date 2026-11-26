// หมอเครื่อง: ตรวจอย่างเดียว ไม่เขียนไฟล์ ไม่แก้อะไร · ทุกข้อรันครบแม้ข้อก่อนหน้าพัง (ข้อที่ตรวจไม่ได้ขึ้น skip ไม่ใช่หยุด)
// ใช้: node setup.mjs --doctor [--project <dir>]  หรือ  node doctor.mjs [--project <dir>]
// แนวคิด (เฉพาะกลไก เขียนข้อความและโค้ดเองทั้งหมด): databricks-agent-skills (สัญญาอนุญาตของเขาเอง) · commands/doctor.md · ดู 2026-11-10
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(HERE, "..", "..", "..");
const CORE_MARK = "<!-- sqt-core-rules -->";
const HOUR = 3600 * 1000;

const readJson = (f) => JSON.parse(readFileSync(f, "utf8"));
const row = (name, status, detail, fix = "") => ({ name, status, detail, fix });

// แต่ละข้อรับ ctx แล้วคืนแถวเดียว หรือโยน error ซึ่ง runDoctor จะแปลงเป็นแถว fail ของข้อนั้น
export const CHECKS = [
  ["Node", () => {
    const major = Number(process.versions.node.split(".")[0]);
    return major >= 18 ? row("Node", "ok", `v${process.versions.node}`) : row("Node", "fail", `v${process.versions.node} เก่าเกินไป`, "ติดตั้ง Node 18 ขึ้นไป");
  }],
  ["plugin superuser", ({ home, pluginRoot }) => {
    const mine = readJson(join(pluginRoot, ".claude-plugin", "plugin.json")).version;
    const file = join(home, ".claude", "plugins", "installed_plugins.json");
    if (!existsSync(file)) return row("plugin superuser", "skip", `ไม่พบ ${file} (รันจากต้นฉบับ repo ได้ ถือว่าไม่ได้ติดตั้ง)`, "ถ้าต้องการใช้ทุกโปรเจกต์: claude plugin install superuser@sqt-marketplace");
    const list = Object.entries(readJson(file).plugins ?? {}).filter(([k]) => k.startsWith("superuser@")).flatMap(([, v]) => v);
    if (!list.length) return row("plugin superuser", "warn", "ยังไม่ได้ติดตั้ง", "claude plugin install superuser@sqt-marketplace");
    const versions = list.map((p) => p.version);
    return versions.includes(mine)
      ? row("plugin superuser", "ok", `ติดตั้ง ${versions.join(" · ")} ตรงกับต้นฉบับ ${mine}`)
      : row("plugin superuser", "warn", `ติดตั้ง ${versions.join(" · ")} แต่ต้นฉบับเป็น ${mine}`, "claude plugin update superuser@sqt-marketplace แล้วเปิด session ใหม่");
  }],
  ["hook", ({ pluginRoot }) => {
    const events = readJson(join(pluginRoot, "hooks", "hooks.json")).hooks ?? {};
    const scripts = new Set();
    for (const groups of Object.values(events)) for (const g of groups) for (const h of g.hooks ?? []) {
      const m = /hooks\/([\w.-]+\.mjs)/.exec(h.command ?? "");
      if (m) scripts.add(m[1]);
    }
    if (!scripts.size) return row("hook", "fail", "hooks.json ไม่มีคำสั่งที่ชี้ไปสคริปต์", "ตรวจ hooks/hooks.json");
    const bad = [];
    for (const s of scripts) {
      const f = join(pluginRoot, "hooks", s);
      if (!existsSync(f)) { bad.push(`${s} หาย`); continue; }
      try { execFileSync(process.execPath, ["--check", f], { stdio: "ignore" }); } catch { bad.push(`${s} ไวยากรณ์ผิด`); }
    }
    return bad.length
      ? row("hook", "fail", bad.join(" · "), "ซ่อมหรือติดตั้ง plugin ใหม่")
      : row("hook", "ok", `${Object.keys(events).length} event · ${scripts.size} สคริปต์ผ่าน node --check`);
  }],
  ["hook เคยทำงาน", ({ home, project }) => {
    // หลักฐานเดียวที่อ่านได้โดยไม่รัน hook: ไฟล์ log ล่าสุด (hook จด log เมื่อเปิดโมดูล log เท่านั้น จึงเป็นข้อมูล ไม่ใช่ข้อผิดพลาด)
    const dirs = [join(project, ".claude", "superuser", "log"), join(home, ".claude", "superuser", "log")].filter(existsSync);
    const times = dirs.flatMap((d) => readdirSync(d).map((f) => statSync(join(d, f)).mtimeMs));
    if (!times.length) return row("hook เคยทำงาน", "skip", "ยังไม่มีไฟล์ log (โมดูล log ปิดอยู่หรือยังไม่เคยจด)");
    const age = Math.round((Date.now() - Math.max(...times)) / HOUR);
    const stale = age > 24 * 14;
    return row("hook เคยทำงาน", stale ? "warn" : "ok", `log ล่าสุดเมื่อ ${age} ชั่วโมงก่อน`, stale ? "เปิด session ใหม่แล้วดูว่า hook ส่งข้อความ skill ที่ต้องเปิดหรือไม่" : "");
  }],
  ["config โปรเจกต์", ({ project }) => {
    const f = join(project, ".claude", "superuser", "config.json");
    if (!existsSync(f)) return row("config โปรเจกต์", "ok", "ไม่มีไฟล์ ใช้ค่าตั้งต้น");
    const c = readJson(f);
    return row("config โปรเจกต์", "ok", `อ่านได้ · modules: ${Object.keys(c.modules ?? {}).join(", ") || "ไม่ระบุ"}`);
  }],
  ["settings.json ผู้ใช้", ({ home }) => {
    const f = join(home, ".claude", "settings.json");
    if (!existsSync(f)) return row("settings.json ผู้ใช้", "skip", "ไม่มีไฟล์");
    readJson(f);
    return row("settings.json ผู้ใช้", "ok", "เป็น JSON ที่อ่านได้");
  }],
  ["กฎประจำตัว", ({ home }) => {
    const f = join(home, ".claude", "CLAUDE.md");
    if (!existsSync(f)) return row("กฎประจำตัว", "warn", "ไม่มี ~/.claude/CLAUDE.md", "node setup.mjs --global-rules (ผู้ใช้รันเอง)");
    return readFileSync(f, "utf8").includes(CORE_MARK)
      ? row("กฎประจำตัว", "ok", "เป็นกฎของ superuser")
      : row("กฎประจำตัว", "skip", "เป็นไฟล์ที่ผู้ใช้เขียนเอง ไม่ได้มาจาก superuser");
  }],
  ["ไฟล์โควตา", ({ home }) => {
    const dir = join(home, ".claude", "superuser");
    const accFile = join(dir, "accounts.json");
    if (!existsSync(accFile)) return row("ไฟล์โควตา", "skip", "ไม่มี accounts.json (ด่านโควตาไม่ทำงาน ซึ่งปกติถ้าไม่ได้ใช้หลายบัญชี)");
    const acc = readJson(accFile);
    if (!Array.isArray(acc.accounts)) return row("ไฟล์โควตา", "fail", "accounts.json ต้องมี accounts เป็นรายการ", "แก้ตามแม่แบบ accounts.json");
    const notes = [];
    for (const a of acc.accounts) {
      const f = join(dir, "quota", `${String(a.name).replace(/[^\w.-]/g, "_")}.json`);
      if (!existsSync(f)) { notes.push(`${a.name}: ไม่มีไฟล์โควตา`); continue; }
      const age = Date.now() - statSync(f).mtimeMs;
      if (age > HOUR) notes.push(`${a.name}: ข้อมูลเก่า ${Math.round(age / HOUR)} ชม. (เกิน 1 ชม. ด่านจะไม่ตรวจ)`);
    }
    return notes.length
      ? row("ไฟล์โควตา", "warn", notes.join(" · "), "ตรวจว่า status line ที่จดโควตาทำงานอยู่ในบัญชีนั้น")
      : row("ไฟล์โควตา", "ok", `${acc.accounts.length} บัญชี ไฟล์โควตาสดทุกบัญชี`);
  }],
];

export function runDoctor({ home = homedir(), project = process.cwd(), pluginRoot = PLUGIN_ROOT, extra = [] } = {}) {
  const ctx = { home, project, pluginRoot };
  const rows = CHECKS.map(([name, fn]) => {
    try { return fn(ctx); } catch (e) { return row(name, "fail", `ตรวจไม่สำเร็จ: ${String(e.message).split("\n")[0]}`, "ซ่อมไฟล์ที่ข้อความนี้ชี้ แล้วรัน --doctor ซ้ำ"); }
  });
  rows.push(...extra);
  const worst = rows.find((r) => r.status === "fail") ?? rows.find((r) => r.status === "warn");
  return { rows, next: worst ? `${worst.name}: ${worst.fix || worst.detail}` : "ไม่มีอะไรต้องแก้", failed: rows.some((r) => r.status === "fail") };
}

export function formatDoctor({ rows, next }) {
  const mark = { ok: "ผ่าน", warn: "เตือน", fail: "ล้ม", skip: "ข้าม" };
  const lines = ["| ข้อ | ผล | รายละเอียด |", "|---|---|---|", ...rows.map((r) => `| ${r.name} | ${mark[r.status]} | ${r.detail.replace(/\|/g, "/")} |`)];
  return `${lines.join("\n")}\n\nขั้นถัดไป: ${next}`;
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/doctor.mjs")) {
  const at = process.argv.indexOf("--project");
  const r = runDoctor({ project: resolve(at >= 0 ? process.argv[at + 1] : process.cwd()) });
  console.log(formatDoctor(r));
  process.exit(r.failed ? 1 : 0);
}
