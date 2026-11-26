// Tests for session-search · router-replay · digest · usage-report on the small fixtures in ./fixtures
// Run: node log-tools.test.mjs   (also: node --test)
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readLines } from "./lib/transcripts.mjs";
import { search } from "./session-search.mjs";
import { replay, installedDiff } from "./router-replay.mjs";
import { buildDigest, BLOCKED } from "./digest.mjs";
import { collect, renderHtml, parseFindings } from "./usage-report.mjs";

const FX = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const root = join(FX, "projects");

test("readLines: drops api-request lines and over-long lines without loading them", async () => {
  const dir = mkdtempSync(join(tmpdir(), "logtools-"));
  const f = join(dir, "t.jsonl");
  writeFileSync(f, ['{"type":"user","n":1}', '{"type":"api-request","x":"' + "y".repeat(500) + '"}', '{"type":"user","big":"' + "z".repeat(5000) + '"}', '{"type":"user","n":4}'].join("\n") + "\n");
  const got = [];
  for await (const r of readLines(f, 1000)) got.push(r);
  rmSync(dir, { recursive: true, force: true });
  assert.deepEqual(got.filter((r) => r.line).map((r) => JSON.parse(r.line).n), [1, 4]);
  assert.deepEqual(got.filter((r) => r.skipped !== undefined).map((r) => r.reason), ["type", "long"]);
});

test("search: finds assistant text, scopes to the project, redacts secrets", async () => {
  const r = await search(["zebra"], { root, project: "-fx-proj" });
  assert.ok(r.hits.some((h) => h.role === "assistant" && /zebra found/.test(h.snippet)));
  const p = await search(["token"], { root, project: "-fx-proj", role: "prompt" });
  assert.equal(p.hits.length, 1);
  assert.ok(!p.hits[0].snippet.includes("abcd1234secret"), p.hits[0].snippet);
  assert.equal((await search(["zebra"], { root, project: "-other" })).hits.length, 0);
  assert.equal((await search(["zebra", "nomatch"], { root, project: "-fx-proj" })).hits.length, 0);
  assert.ok((await search(["zebra", "nomatch"], { root, project: "-fx-proj", any: true })).hits.length > 0);
});

test("search: oversized record is skipped and counted, not loaded", async () => {
  const r = await search(["zebra"], { root, project: "-fx-proj", "max-line": "150" });
  assert.ok(r.stats.skippedLong >= 1);
});

test("router-replay: unrouted opened skill is MISSED, routed but unopened is IGNORED", async () => {
  const r = await replay({ root, project: "-fx-proj" });
  assert.equal(r.prompts, 3);
  assert.ok(r.missed.some((m) => m.skill === "my-unrouted-skill"));
  assert.ok(r.ignored.some((m) => m.skill === "human-writing"), JSON.stringify(r.ignored));
  assert.ok(r.agree >= 1, "prompt 1 opened human-writing and the router named it");
});

test("router-replay: installed copy compare spots a different file", () => {
  const dir = mkdtempSync(join(tmpdir(), "logtools-"));
  mkdirSync(join(dir, "a", "hooks"), { recursive: true });
  writeFileSync(join(dir, "a", "hooks", "skill-router.json"), "{}");
  writeFileSync(join(dir, "dev.json"), '{"rules":[]}');
  const d = installedDiff(join(dir, "dev.json"), dir);
  rmSync(dir, { recursive: true, force: true });
  assert.equal(d.copies.length, 1);
  assert.equal(d.copies[0].same, false);
});

test("usage: counts streamed duplicates once, splits skill and subagent type, finds the cache break", async () => {
  const r = await collect({ root, project: "-fx-proj" });
  assert.equal(r.total, 51110 + 30505 + 263 + 327 + 1301);
  assert.equal(r.agents.find((a) => a.name === "reviewer").total, 1301);
  assert.equal(r.skills.find((s) => s.name === "human-writing").total, 30505);
  assert.equal(r.breaks.length, 1);
  assert.equal(r.prompts[0].tokens, 4260 + 39510); // cost-weighted: input 1 · output 5 · cache write 1.25 · cache read 0.05
  assert.ok(!r.prompts[0].text.includes("abcd1234secret"));
  assert.ok(Math.abs(r.skills.reduce((s, x) => s + x.pct, 0) + r.agents.find((a) => a.name === "reviewer").pct - 100) < 1e-6);
});

test("usage: HTML is self-contained and carries the findings; findings count is checked", async () => {
  const r = await collect({ root, project: "-fx-proj", log: join(FX, "log") });
  const html = renderHtml(r, { findings: ["a", "b", "c"] });
  assert.ok(!/(src|href)=["']?https?:/i.test(html) && !/@import/.test(html));
  assert.ok(html.includes("<li>a</li>") && html.includes("human-writing"));
  assert.equal(parseFindings("- a\n- b").warning.length > 0, true);
  assert.equal(parseFindings("1. a\n2. b\n3) c").warning, "");
  assert.equal(parseFindings("a\nb\nc\nd\ne\nf").lines.length, 5);
});

test("digest: blocked rows and 'waiting' section survive; old days and secrets do not", async () => {
  const md = await buildDigest({ logDir: join(FX, "log"), progressFile: join(FX, "CONTEXT.md"), today: "2026-11-10", keep: 0 });
  assert.ok(md.includes("งาน ข รอ ผู้ขายตอบ"), "blocked row kept even with keep=0");
  assert.ok(md.includes("เลือกชื่อโปรเจกต์"), "รอผู้ใช้ section kept");
  assert.ok(!md.includes("งาน ก เสร็จ"), "non-blocked rows dropped with keep=0");
  assert.ok(/reviewer fail round 1/.test(md), "failed review is flagged");
  assert.ok(md.includes("2026-11-07") && !md.includes("2026-10-01"));
  assert.ok(!md.includes("abc12345secret"));
  assert.ok(/แก้งาน 1/.test(md));
});

test("digest: BLOCKED matches blocked/waiting wording but not รอบ", () => {
  assert.ok(BLOCKED.test("ติดที่ API key") && BLOCKED.test("(รอยืนยัน) ราคา") && BLOCKED.test("งานนี้ รอ ผู้ใช้"));
  assert.ok(!BLOCKED.test("ตรวจรอบที่ 2 ผ่านแล้ว"));
});
