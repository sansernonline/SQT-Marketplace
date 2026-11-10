// เครื่องกฎรวม — ไฟล์เดียวกับด่านป้องกันเดิม (guard-rules.json) ขยายให้ใช้กับเหตุการณ์อื่น ไม่ใช่ระบบที่สอง
// ข้อของด่านป้องกันเดิม (ไม่มี "on" และไม่มี "module") ยังทำงานที่ guardGate ในไฟล์หลักเหมือนเดิมทุกอย่าง · ข้อใหม่ใช้ field เหล่านี้:
//   on        bash (ค่าเริ่ม) · file (Write/Edit ก่อนเขียน) · read (Read) · tool (ชื่อเครื่องมือ เช่น MCP) · prompt (ข้อความผู้ใช้) · post (หลังเครื่องมือ) · stop (ก่อนจบ) · รับเป็นรายการได้
//   module    สวิตช์ใน config.json "modules" (ค่าเริ่มของแต่ละตัวอยู่ที่ MODULE_DEFAULT ใน util.mjs) · ไม่ใส่ = guard (ค่าเริ่มปิด)
//   decision  deny (ค่าเริ่ม) · ask · warn · block (เฉพาะ stop/prompt)
//   pattern   regex ต่อข้อความของเหตุการณ์นั้น (คำสั่ง · เนื้อไฟล์ · ข้อความผู้ใช้ · คำตอบสุดท้าย) · flags ค่าเริ่ม i
//   tool      regex ชื่อเครื่องมือ · path regex path ไฟล์ (bash: ใช้กลุ่มจับที่ 1 ของ pattern) · output regex ผลของเครื่องมือ (post)
//   when      เงื่อนไขเสริม: exists (ไฟล์ในโปรเจกต์ต้องมี) · fileHasSecret (ไฟล์ที่จะอ่านมีคีย์จริง) · transcript {codeEdited · noTestAfterEdit · usedSuperuser · minEdited}
//   skip      regex ในคำตอบสุดท้ายที่ทำให้ข้อ stop ผ่าน (เช่น "ข้ามเทสต์: …")
//   once      "session" = แจ้งครั้งเดียวต่อ session (warn) · remind "tool" (prompt) = ฝากไว้แจ้งตอนเครื่องมือแรกหลังข้อความนั้น
//   token     true = รูปแบบคีย์จริงของผู้ให้บริการ (ใช้กับ file · bash · prompt และตรวจไฟล์ .env ก่อนอนุญาตให้อ่าน)
// กฎของโปรเจกต์วางที่ .claude/superuser/rules.json (รูปเดียวกัน · ไม่ใส่ module = โมดูล rules) · ยกเว้นต่อโปรเจกต์ที่ guard-allow.json เหมือนเดิม
import { readFileSync, existsSync, statSync, openSync, readSync, closeSync } from "node:fs";
import { join, resolve } from "node:path";
import { readJson, modOn, sessionOnce } from "./util.mjs";

export const kindsOf = (r) => [].concat(r.on ?? "bash");
export const moduleOf = (r) => r.module ?? "guard";
// ข้อของด่านป้องกันเดิม = bash อย่างเดียว · โมดูล guard · deny หรือ ask · guardGate/guardAsk ในไฟล์หลักอ่านเฉพาะข้อพวกนี้
export const isBashGuard = (r) => moduleOf(r) === "guard" && kindsOf(r).join() === "bash" && !["warn", "block"].includes(r.decision);

export function loadRules(dir, teamDir) {
  const base = readJson(join(dir, "guard-rules.json"), {});
  const mine = teamDir ? readJson(join(teamDir, "rules.json"), {}) : {};
  return {
    rules: [...(base.rules ?? []), ...(mine.rules ?? []).map((r) => ({ module: "rules", ...r, project: true }))],
    pathSkip: base.pathSkip ?? "",
    promptNote: base.tokenPromptNote ?? "",
  };
}

const rx = (p, f = "i") => { try { return new RegExp(p, f); } catch { return null; } };
const PLACEHOLDER = /x{4,}|example|your[_-]|placeholder|\*{3,}|\.{3}|0{8,}|1234567890|<[a-z_ -]+>/i;

// ข้อความที่เหตุการณ์ "เขียน" ลงไฟล์
export function writtenText(tool, ti = {}) {
  if (tool === "Write") return String(ti.content ?? "");
  if (tool === "Edit") return String(ti.new_string ?? "");
  if (tool === "MultiEdit") return (ti.edits ?? []).map((e) => e?.new_string ?? "").join("\n");
  if (tool === "NotebookEdit") return String(ti.new_source ?? "");
  return "";
}
export const FILE_TOOLS = ["Write", "Edit", "MultiEdit", "NotebookEdit"];

function readHead(path, max = 200000) {
  let fd; try { fd = openSync(path, "r"); const buf = Buffer.alloc(Math.min(statSync(path).size, max)); readSync(fd, buf, 0, buf.length, 0); return buf.toString("utf8"); }
  catch { return ""; } finally { if (fd !== undefined) try { closeSync(fd); } catch { /* ปิดไม่ได้ก็ปล่อย */ } }
}

/** ข้อความมีคีย์จริงของผู้ให้บริการหรือไม่ · คืน id ของข้อ token ที่ตรง (ข้อความตัวอย่างอย่าง xxxx · EXAMPLE ไม่นับ) */
export function tokenFound(text, rules) {
  for (const r of rules) {
    if (!r.token) continue;
    const re = rx(r.pattern, `${r.flags ?? ""}g`);
    if (!re) continue;
    for (const m of String(text).matchAll(re)) if (!PLACEHOLDER.test(m[0])) return r.id;
  }
  return "";
}

function whenOk(w, subj, ctx, m) {
  if (w.exists && !existsSync(resolve(ctx.root ?? ctx.cwd ?? ".", w.exists))) return false;
  if (w.fileHasSecret) {
    const p = String(subj.path || m?.[1] || "").replace(/^['"]|['"]$/g, "");
    if (!p || !tokenFound(readHead(resolve(ctx.cwd ?? ".", p)), ctx.rules)) return false;
  }
  const t = w.transcript, s = ctx.state;
  if (t) {
    if (!s) return false;
    if (t.codeEdited && !(s.lastCodeEdit >= 0)) return false;
    if (t.noTestAfterEdit && !((s.lastTest ?? -1) < (s.lastCodeEdit ?? -1))) return false;
    if (t.usedSuperuser && !s.usedSuperuser) return false;
    if (t.minEdited && (s.edited?.length ?? 0) < t.minEdited) return false;
  }
  return true;
}

/**
 * ข้อที่ตรงกับเหตุการณ์ · subj = { tool, command, text, path, output, prompt, lastText }
 * ctx = { rules, teamDir, allow, root, cwd, state, pathSkip, sid, sessDir }
 */
export function ruleHits(kind, subj, ctx) {
  const hits = [], memo = {};
  const on = (m) => (memo[m] ??= modOn(ctx.teamDir, m));
  const skipPath = ctx.pathSkip && subj.path && rx(ctx.pathSkip)?.test(subj.path);
  const hay = { bash: subj.command, file: subj.text, prompt: subj.prompt, post: subj.command, stop: subj.lastText }[kind] ?? "";
  for (const r of ctx.rules) {
    if (isBashGuard(r) || !kindsOf(r).includes(kind) || !on(moduleOf(r)) || ctx.allow.includes(r.id)) continue;
    if (r.token && kind === "file" && skipPath) continue;
    if (r.tool && !rx(r.tool)?.test(subj.tool ?? "")) continue;
    let m = null;
    if (r.pattern && kind !== "read" && kind !== "tool") {
      const re = rx(r.pattern, r.flags ?? "i");
      m = re?.exec(hay ?? "");
      if (!m || (r.token && PLACEHOLDER.test(m[0]))) continue;
      if (ctx.allowRx?.some((a) => a.test(hay))) continue;
    }
    if (r.path) { const re = rx(r.path); if (!re?.test(String(subj.path || m?.[1] || ""))) continue; }
    if (r.output && !rx(r.output)?.test(subj.output ?? "")) continue;
    if (r.skip && rx(r.skip)?.test(subj.lastText ?? "")) continue;
    if (r.when && !whenOk(r.when, subj, ctx, m)) continue;
    if (r.once === "session" && ctx.sid && !sessionOnce(ctx.sid, `rule:${ctx.agent ?? "main"}:${r.id}`, ctx.sessDir)) continue;
    hits.push({ rule: r, match: m, decision: kind === "prompt" && r.token ? "warn" : r.decision ?? "deny" });
  }
  return hits;
}

export function ruleContext(input, teamDir, root, dir, extra = {}) {
  const loaded = loadRules(dir, teamDir);
  const allow = (teamDir && readJson(join(teamDir, "guard-allow.json"), {}).allow) || [];
  const ids = new Set(loaded.rules.map((r) => r.id));
  return {
    rules: loaded.rules, pathSkip: loaded.pathSkip, promptNote: loaded.promptNote, teamDir, root, cwd: input.cwd ?? process.cwd(),
    allow, allowRx: allow.filter((a) => !ids.has(a)).map((a) => rx(a)).filter(Boolean), sid: input.session_id, agent: input.agent_id ?? "main", ...extra,
  };
}

const label = (r) => r.label ?? "ด่านกฎ (SuperUser)";
export function hitText(h, ctx) {
  const r = h.rule;
  const how = r.project ? "" : ` · ถ้าผู้ใช้สั่งไว้จริง เพิ่ม "${r.id}" ใน .claude/superuser/guard-allow.json ("allow") แล้วลองใหม่`;
  const note = h.decision === "warn" && r.token && ctx.promptNote ? ` · ${ctx.promptNote}` : "";
  return `${label(r)}: ${r.reason}${r.rule ? ` — กฎ: ${r.rule}` : ""}${h.decision === "warn" ? note : how}`;
}

/** ก่อนเครื่องมือทำงาน (PreToolUse) · คืน { deny, ask: [], warn: [] } */
export function preRules(input, teamDir, root, dir) {
  const tool = input.tool_name ?? "", ti = input.tool_input ?? {};
  const kind = tool === "Bash" ? "bash" : FILE_TOOLS.includes(tool) ? "file" : tool === "Read" ? "read" : /^mcp__/.test(tool) ? "tool" : null;
  const out = { deny: "", ask: [], warn: [] };
  if (!kind) return out;
  const ctx = ruleContext(input, teamDir, root, dir);
  const subj = { tool, command: String(ti.command ?? ""), text: writtenText(tool, ti), path: String(ti.file_path ?? ti.notebook_path ?? "") };
  for (const h of ruleHits(kind, subj, ctx)) {
    const t = hitText(h, ctx);
    if (h.decision === "deny" || h.decision === "block") out.deny ||= t;
    else if (h.decision === "ask") out.ask.push(t);
    else out.warn.push(t);
  }
  return out;
}

/** ข้อความผู้ใช้ (UserPromptSubmit) · คืน { warn: [], flags: [] } · flags = ข้อความที่ฝากไว้แจ้งตอนเครื่องมือแรก */
export function promptRules(input, teamDir, root, dir) {
  const text = String(input.prompt ?? "");
  const out = { warn: [], flags: [] };
  if (!text.trim() || text.startsWith("/")) return out;
  const ctx = ruleContext(input, teamDir, root, dir);
  for (const h of ruleHits("prompt", { prompt: text }, ctx)) {
    const t = hitText(h, ctx);
    (h.rule.remind === "tool" ? out.flags : out.warn).push(t);
  }
  return out;
}

/** หลังเครื่องมือ (PostToolUse · PostToolUseFailure) · เพิ่มบรรทัดชี้ทาง ไม่เคยบล็อก */
export function postRules(input, teamDir, root, dir) {
  const ti = input.tool_input ?? {}, res = input.tool_response;
  const output = typeof res === "string" ? res : res && typeof res === "object" ? [res.stdout, res.stderr, res.output, res.error].filter((x) => typeof x === "string").join("\n") : "";
  const subj = { tool: input.tool_name ?? "", command: String(ti.command ?? ""), path: String(ti.file_path ?? ""), output: `${output}\n${input.error ?? ""}` };
  const ctx = ruleContext(input, teamDir, root, dir);
  return ruleHits("post", subj, ctx).map((h) => hitText(h, ctx));
}

/** ก่อนจบ (Stop) · state = สถานะ transcript จาก gateState · คืนข้อความเหตุผลที่ไม่ให้จบ หรือ "" */
export function stopRules(state, teamDir, root, dir, input = {}) {
  const ctx = ruleContext(input, teamDir, root, dir, { state });
  for (const h of ruleHits("stop", { lastText: state?.lastText ?? "" }, ctx)) if (h.decision === "block" || h.decision === "deny") return hitText(h, ctx);
  return "";
}

// คำสั่งที่นับเป็น "รัน test หรือคำสั่งตรวจ" (กฎ stop-no-test) · อยู่ที่นี่ที่เดียว ไฟล์หลักเรียกตอนอ่าน transcript
export const TEST_CMD = /\b(?:(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?(?:test|check|lint|build)|node\s+(?:\S+\s+)*--(?:test|self-test)|pytest|python[\d.]*\s+-m\s+(?:pytest|unittest)|dotnet\s+(?:test|build)|go\s+(?:test|vet)|cargo\s+(?:test|check)|vitest|jest|phpunit|mvn\s+(?:\S+\s+)*test|gradlew?\s+test|validate-marketplace|\.test\.mjs|tsc\b)/i;
const CODE_FILE = /\.(?:js|mjs|cjs|ts|tsx|jsx|py|cs|java|go|rb|php|sql|dart|kt|swift|rs|c|cc|cpp|h|vue|svelte)$/i;
const NOT_CODE = /(^|[\\/])(_to_delete|\.claude|node_modules)([\\/]|$)/;
/** เรียกจาก foldTranscript ต่อ tool_use 1 ตัว · i = ลำดับบรรทัด */
export function foldTestState(s, name, inp, i) {
  if (name === "Bash" && TEST_CMD.test(String(inp.command ?? ""))) s.lastTest = i;
  const p = String(inp.file_path ?? inp.notebook_path ?? "");
  if (FILE_TOOLS.includes(name) && CODE_FILE.test(p) && !NOT_CODE.test(p)) s.lastCodeEdit = i;
  return s;
}
