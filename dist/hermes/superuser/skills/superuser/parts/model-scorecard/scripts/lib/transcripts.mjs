// Shared helpers for the log tools: stream a transcript jsonl line by line without ever holding a huge line,
// turn records into small events, redact text with the hook's own patterns.
import { createReadStream, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const PLUGIN_ROOT = resolve(HERE, "..", "..", "..", "..");
export const HOOKS_DIR = join(PLUGIN_ROOT, "hooks");
export const DEFAULT_MAX_LINE = 8_000_000; // bytes; api-request records reach ~2 MB, longer = skip and count

// Reuse the hook's redaction so every tool prints the same safe text (single source of patterns).
const hook = await import(pathToFileURL(join(HOOKS_DIR, "superuser-hook.mjs")).href);
export const redact = hook.redact;
export const routeSkills = hook.routeSkills;

const TYPE_PREFIX = Buffer.from('{"type":"');
const KEEP_PREFIX = [Buffer.from('{"type":"user"'), Buffer.from('{"type":"assistant"')];
const startsWith = (buf, at, pre) => buf.length - at >= pre.length && buf.compare(pre, 0, pre.length, at, at + pre.length) === 0;

// Yields { line } or { skipped: bytes, reason: "long" | "type" }. Lines whose first key is "type" and not user/assistant
// (api-request blobs, cost-state ...) are dropped without buffering. Longer than maxLine = dropped and reported.
export async function* readLines(file, maxLine = DEFAULT_MAX_LINE) {
  let parts = [], len = 0, skipping = null, skipBytes = 0;
  const finish = function* () {
    if (skipping) yield { skipped: skipBytes, reason: skipping };
    else if (len) yield { line: Buffer.concat(parts).toString("utf8") };
    parts = []; len = 0; skipping = null; skipBytes = 0;
  };
  for await (const chunk of createReadStream(file)) {
    let start = 0;
    while (start < chunk.length) {
      const nl = chunk.indexOf(10, start);
      const end = nl < 0 ? chunk.length : nl;
      const n = end - start;
      if (!skipping && len === 0 && startsWith(chunk, start, TYPE_PREFIX) && !KEEP_PREFIX.some((p) => startsWith(chunk, start, p)) && n >= 24) {
        skipping = "type"; skipBytes = 0;
      }
      if (!skipping) {
        if (len + n > maxLine) { skipping = "long"; skipBytes = len + n; parts = []; len = 0; }
        else { parts.push(chunk.subarray(start, end)); len += n; }
      } else skipBytes += n;
      if (nl >= 0) { yield* finish(); start = nl + 1; } else start = end;
    }
  }
  yield* finish();
}

const NOT_USER = /^\s*(<(agent-message|task-notification|command-|local-command|system-reminder|bash-|user-prompt)|คุณเป็นผู้ตัดสิน|\[Request interrupted|Caveat:)/i;
const text = (c) => (typeof c === "string" ? c : Array.isArray(c) ? c.filter((b) => b?.type === "text").map((b) => b.text).join("\n") : "");

// Events: prompt (a real person-typed message) · assistant (usage, model, text, tools) · result (tool_result text)
export async function* events(file, opts = {}) {
  const stats = opts.stats ?? {};
  for await (const r of readLines(file, opts.maxLine)) {
    if (r.skipped !== undefined) { if (r.reason === "long") { stats.skippedLong = (stats.skippedLong ?? 0) + 1; stats.skippedBytes = (stats.skippedBytes ?? 0) + r.skipped; } continue; }
    let o; try { o = JSON.parse(r.line); } catch { stats.bad = (stats.bad ?? 0) + 1; continue; }
    const base = { ts: o.timestamp ?? "", session: o.sessionId ?? "", side: !!o.isSidechain };
    const m = o.message;
    if (o.type === "user" && m) {
      const c = m.content;
      if (Array.isArray(c) && c.some((b) => b?.type === "tool_result")) {
        yield { ...base, kind: "result", text: c.filter((b) => b?.type === "tool_result").map((b) => text(b.content)).join("\n") };
      } else {
        const t = text(c);
        if (t && !o.isMeta && !NOT_USER.test(t)) yield { ...base, kind: "prompt", text: t };
      }
    } else if (o.type === "assistant" && m) {
      const tools = (Array.isArray(m.content) ? m.content : []).filter((b) => b?.type === "tool_use").map((b) => ({ name: b.name, input: b.input ?? {} }));
      const u = m.usage ?? {};
      yield { ...base, kind: "assistant", id: m.id ?? o.uuid, model: m.model ?? "", text: text(m.content), tools,
        usage: { input: u.input_tokens ?? 0, output: u.output_tokens ?? 0, cacheRead: u.cache_read_input_tokens ?? 0, cacheCreate: u.cache_creation_input_tokens ?? 0, cacheCreate1h: u.cache_creation?.ephemeral_1h_input_tokens ?? 0 } };
    }
  }
}

export const slugOf = (p) => resolve(p).replace(/[^A-Za-z0-9]/g, "-");
export const projectsRoot = (root) => root ?? join(process.env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude"), "projects");

// Transcript files of one project (slug or folder path) or all. Subagent transcripts only when asked.
export function listTranscripts({ root, project, all = false, subagents = false, since = "" } = {}) {
  const base = projectsRoot(root);
  if (!existsSync(base)) return [];
  const dirs = all ? readdirSync(base).map((d) => join(base, d)) : [join(base, existsSync(join(base, project ?? "")) && project ? project : slugOf(project ?? process.cwd()))];
  const out = [];
  for (const d of dirs) {
    if (!existsSync(d) || !statSync(d).isDirectory()) continue;
    for (const n of readdirSync(d)) {
      const f = join(d, n);
      if (n.endsWith(".jsonl")) out.push({ file: f, session: basename(n, ".jsonl"), agentType: "main", mtime: statSync(f).mtimeMs });
      else if (subagents && statSync(f).isDirectory() && existsSync(join(f, "subagents"))) {
        for (const s of readdirSync(join(f, "subagents")).filter((x) => x.endsWith(".jsonl"))) {
          const metaFile = join(f, "subagents", s.replace(/\.jsonl$/, ".meta.json"));
          let agentType = "subagent"; try { agentType = JSON.parse(readFileSync(metaFile, "utf8")).agentType ?? agentType; } catch { /* no meta */ }
          out.push({ file: join(f, "subagents", s), session: n, agentType, mtime: statSync(join(f, "subagents", s)).mtimeMs });
        }
      }
    }
  }
  const sinceMs = since ? Date.parse(since) : 0;
  return out.filter((x) => x.mtime >= sinceMs).sort((a, b) => a.mtime - b.mtime);
}

// Skill tool input is { skill: "plugin:name" } -> bare name
export const bareSkill = (s) => String(s ?? "").split(":").pop();

export function parseArgs(argv, spec) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { out._.push(a); continue; }
    const key = a.slice(2);
    if (!(key in spec)) throw new Error(`unknown option --${key} (try --help)`);
    out[key] = spec[key] === "flag" ? true : argv[++i];
    if (spec[key] !== "flag" && out[key] === undefined) throw new Error(`--${key} needs a value`);
  }
  return out;
}

export const oneLine = (s, n = 100) => redact(String(s ?? "").replace(/\s+/g, " ").trim(), n);
export const day = (ts) => String(ts).slice(0, 10);
