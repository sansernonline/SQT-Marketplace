#!/usr/bin/env node
// Search past Claude Code session transcripts by keyword, scoped to one project. Read-only, streams each file.
import { events, listTranscripts, parseArgs, redact, day } from "./lib/transcripts.mjs";

const HELP = `session-search.mjs <keyword...> [options]
Search prompts, assistant text and tool inputs in ~/.claude/projects/<project>/*.jsonl (this project by default).
  --project <folder|slug>  project to search (default: current folder)
  --all                    search every project (only when the person asked)
  --any                    match any keyword (default: all keywords)
  --role prompt|assistant|tool|result   limit to one kind (default: prompt, assistant, tool)
  --since <date>           only files changed on/after this date (YYYY-MM-DD)
  --limit <n>              max hits (default 20)   --context <n>  chars around the hit (default 120)
  --subagents              also search subagent transcripts
  --json                   machine-readable output   --root <dir>  projects folder (testing)
  --max-line <bytes>       skip records longer than this (default 8000000; counted, never loaded)
Output is redacted with the superuser hook patterns. Oversized records are skipped and counted.`;

const SPEC = { project: "v", all: "flag", any: "flag", role: "v", since: "v", limit: "v", context: "v", subagents: "flag", json: "flag", root: "v", "max-line": "v", help: "flag" };

const toolText = (t) => Object.values(t.input).filter((v) => typeof v === "string").join(" ").slice(0, 4000);

export async function search(keywords, o = {}) {
  const kws = keywords.map((k) => k.toLowerCase());
  const roles = new Set(o.role ? [o.role] : ["prompt", "assistant", "tool"]);
  const limit = Number(o.limit ?? 20), ctx = Number(o.context ?? 120);
  const files = listTranscripts({ root: o.root, project: o.project, all: o.all, subagents: o.subagents, since: o.since });
  const hits = [], stats = { files: files.length, skippedLong: 0 };
  for (const f of files.reverse()) { // newest file first
    const st = {};
    for await (const e of events(f.file, { maxLine: o["max-line"] ? Number(o["max-line"]) : undefined, stats: st })) {
      const parts = [];
      if (e.kind === "prompt" && roles.has("prompt")) parts.push(["prompt", e.text]);
      if (e.kind === "assistant") {
        if (roles.has("assistant") && e.text) parts.push(["assistant", e.text]);
        if (roles.has("tool")) for (const t of e.tools) parts.push(["tool:" + t.name, toolText(t)]);
      }
      if (e.kind === "result" && roles.has("result")) parts.push(["result", e.text.slice(0, 4000)]);
      for (const [role, t] of parts) {
        const low = t.toLowerCase();
        const ok = o.any ? kws.some((k) => low.includes(k)) : kws.every((k) => low.includes(k));
        if (!ok) continue;
        const at = Math.max(0, low.indexOf(kws.find((k) => low.includes(k))) - Math.floor(ctx / 2));
        hits.push({ date: day(e.ts), session: f.session.slice(0, 8), agent: f.agentType, role, snippet: redact(t.slice(at, at + ctx).replace(/\s+/g, " "), ctx + 40) });
        if (hits.length >= limit) { stats.skippedLong += st.skippedLong ?? 0; return { hits, stats, truncated: true }; }
      }
    }
    stats.skippedLong += st.skippedLong ?? 0;
  }
  return { hits, stats, truncated: false };
}

async function main() {
  const a = parseArgs(process.argv.slice(2), SPEC);
  if (a.help || !a._.length) { console.log(HELP); return; }
  const r = await search(a._, a);
  if (a.json) { console.log(JSON.stringify(r, null, 2)); return; }
  for (const h of r.hits) console.log(`${h.date} ${h.session} ${h.role.padEnd(10)} ${h.snippet}`);
  console.log(`-- ${r.hits.length} hit(s)${r.truncated ? " (limit reached)" : ""} · ${r.stats.files} file(s) · ${r.stats.skippedLong} oversized record(s) skipped`);
}
if (process.argv[1]?.replace(/\\/g, "/").endsWith("/session-search.mjs")) main().catch((e) => { console.error(e.message); process.exit(1); });
