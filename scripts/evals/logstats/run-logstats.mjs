#!/usr/bin/env node
/**
 * run-logstats.mjs — วัด superuser จากงานจริงใน log (ไม่ใช่ชุดทดสอบ) · ไม่เรียก model ไม่เสียเงิน
 *
 *   node scripts/evals/logstats/run-logstats.mjs                    # log ของโฟลเดอร์นี้ (.claude/superuser/log) · พิมพ์ตาราง
 *   node scripts/evals/logstats/run-logstats.mjs --log <โฟลเดอร์> --days 30 --save   # 30 วันล่าสุด · --save ต่อท้าย RESULTS.md
 *   node scripts/evals/logstats/run-logstats.mjs --self-test
 *
 * ทุกตัวเลขมีสูตร · n · ช่วง 95% (สัดส่วน = Wilson · ค่ากลางอัตราส่วน = bootstrap บน log) · สูตรเต็มอยู่ใน docs/EVAL-FORMULAS.md หัวข้อ logstats
 * ใช้ฟังก์ชันของ hook (countDay · estimates · expectVsActual) ตัวเดียวกับที่เขียน log/SUMMARY.md ตัวเลขจึงตรงกัน
 * ข้อจำกัด: log จดเฉพาะงานที่ hook เห็น · ฟิลด์บางตัวเพิ่งเริ่มจด (ดูคอลัมน์ n) · ไม่มีแขนเทียบ ตัวเลขนี้บอกว่าเกิดอะไร ไม่ได้บอกว่าดีกว่าไม่ใช้
 */
import { existsSync, readdirSync, readFileSync, appendFileSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { wilson, median, ratioCI } from "../speed/stats.mjs";
import { countDay, estimates, expectVsActual } from "../../../plugins/superuser/hooks/superuser-hook.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");

// ---------- ฟังก์ชันล้วน (มี self-test) ----------
const readLines = (f) => (existsSync(f) ? readFileSync(f, "utf8").split("\n").flatMap((l) => { try { return l.trim() ? [JSON.parse(l)] : []; } catch { return []; } }) : []);
/** token ของรอบ: ผลรวมทุกช่องของ {input, output, cacheRead, cacheCreate} · ไม่มี → null */
export const tokenSum = (t) => (t && typeof t === "object" ? Object.values(t).reduce((s, v) => s + (Number(v) || 0), 0) : typeof t === "number" ? t : null);
const quantile = (xs, q) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(q * s.length))] : null; };
const share = (c, n) => ({ c, n, ...(wilson(c, n) ?? { p: null, lo: null, hi: null }) });

/** สรุปผลตรวจรายรอบ: แถว result ที่มี verdict เรียงตามเวลาใน session เดียวกัน → รอบที่ k ของ session (ไม่ใช้ช่อง round ที่ผู้ตรวจเขียนเอง เพราะว่างบ่อย) */
export function reviewRounds(runs) {
  const bySession = new Map();
  for (const r of [...runs].filter((x) => x.event === "result" && x.verdict).sort((a, b) => (a.ts < b.ts ? -1 : 1))) {
    const list = bySession.get(r.session) ?? []; list.push(r); bySession.set(r.session, list);
  }
  const byRound = {}, untilPass = [], sessions = { n: 0, passed: 0 };
  for (const list of bySession.values()) {
    sessions.n++;
    list.forEach((r, i) => { const k = Math.min(i + 1, 4); const b = (byRound[k] ??= { c: 0, n: 0 }); b.n++; if (r.verdict === "pass") b.c++; });
    const at = list.findIndex((r) => r.verdict === "pass");
    if (at >= 0) { sessions.passed++; untilPass.push(at + 1); }
  }
  return { byRound, untilPass, sessions };
}

/** บรรทัด คาด: เทียบจริง → คู่ [คาด, จริง] ของลูกทีม (เฉพาะที่คาดไว้) */
export const workerPairs = (plans) => plans.filter((p) => p.expect.workers != null).map((p) => [p.expect.workers, p.actual.workers]);

/** ทุกตัววัด · runs = แถวจาก runs.jsonl ทุกวัน · days = ผลของ countDay ต่อวัน */
export function measure(runs, days) {
  const spawn = runs.filter((r) => r.event === "run");
  const res = runs.filter((r) => r.event === "result");
  const rows = [];
  const add = (dim, name, formula, value, ci, n, note = "") => rows.push({ dim, name, formula, value, ci, n, note });
  const addShare = (dim, name, formula, c, n, note) => { const s = share(c, n); add(dim, name, formula, s.p, s.p == null ? null : [s.lo, s.hi], n, `${c}/${n}${note ? ` · ${note}` : ""}`); };

  // 1 การแจกงาน
  const withBrief = spawn.filter((r) => typeof r.brief_sections === "number");
  addShare("แจกงาน", "ใบสั่งงานครบ 5 ข้อ", "รอบที่ brief_sections = 5 ÷ รอบที่จดช่องนี้", withBrief.filter((r) => r.brief_sections === 5).length, withBrief.length);
  const named = spawn.filter((r) => r.role && !/^(Explore|claude-code-guide|web-fetch)$/.test(r.role));
  addShare("แจกงาน", "ระบุ effort", "รอบที่ effort ไม่ว่าง ÷ รอบที่ส่งลูกทีม (ไม่นับ agent ในตัวของ Claude Code)", named.filter((r) => r.effort).length, named.length);
  addShare("แจกงาน", "ระบุ model เอง", "รอบที่ model ไม่ใช่ inherit ÷ รอบที่ส่งลูกทีม", named.filter((r) => r.model && r.model !== "inherit").length, named.length);
  const tierOf = (m) => (/opus|fable/i.test(m ?? "") ? "opus" : /sonnet/i.test(m ?? "") ? "sonnet" : /haiku/i.test(m ?? "") ? "haiku" : "?");
  for (const t of ["opus", "sonnet", "haiku"]) addShare("แจกงาน", `สัดส่วนลูกทีมที่ใช้ ${t}`, `รอบที่ resolved_model เป็น ${t} ÷ รอบที่รู้ model`, spawn.filter((r) => tierOf(r.resolved_model ?? r.model) === t).length, spawn.filter((r) => tierOf(r.resolved_model ?? r.model) !== "?").length);
  const par = days.reduce((p, d) => ({ sumMs: p.sumMs + (d.par?.sumMs ?? 0), unionMs: p.unionMs + (d.par?.unionMs ?? 0) }), { sumMs: 0, unionMs: 0 });
  add("แจกงาน", "ขนานได้จริงกี่เท่า", "Σ เวลาลูกทีมทุกตัว ÷ ช่วงที่มีลูกทีมทำงานอย่างน้อย 1 ตัว (union)", par.unionMs ? par.sumMs / par.unionMs : null, null, days.length, "ทั้งช่วง ไม่มีช่วงความเชื่อมั่น");
  const pairs = workerPairs(days.flatMap((d) => d.plans ?? []));
  const err = pairs.map(([e, a]) => a - e);
  add("แจกงาน", "ลูกทีมจริง − คาด (ค่ากลาง)", "ค่ากลางของ (ลูกทีมที่สั่งจริงหลังบรรทัด คาด: − ลูกทีมที่คาด)", err.length ? median(err) : null, null, err.length, "บวก = สั่งเกินที่คาด · หยาบ: นับทุกงานที่ไม่ใช่ตรวจจนถึง คาด: ถัดไปในวันเดียวกัน");
  addShare("แจกงาน", "ลูกทีมจริงตรงคาด (±1)", "บรรทัด คาด: ที่ |จริง − คาด| ≤ 1 ÷ บรรทัด คาด: ที่ระบุลูกทีม", err.filter((x) => Math.abs(x) <= 1).length, err.length);

  // 2 ประมาณขนาด
  const est = estimates(runs);
  const ratios = est.map(([e, a]) => a / e);
  const rci = ratioCI(ratios);
  add("ประมาณขนาด", "token จริง ÷ คาด (ค่ากลาง)", "ค่ากลางของ token จริง ÷ ขนาด: Nk ในใบสั่งงาน · ช่วง bootstrap บน log", rci?.ratio ?? null, rci ? [rci.lo, rci.hi] : null, est.length, "1 = แม่น · > 1 = คาดต่ำไป");
  add("ประมาณขนาด", "ความคลาดเคลื่อนสัมบูรณ์ (MdAPE)", "ค่ากลางของ |จริง − คาด| ÷ จริง", ratios.length ? median(est.map(([e, a]) => Math.abs(a - e) / a)) : null, null, est.length);
  addShare("ประมาณขนาด", "คาดอยู่ในช่วง 0.5–2 เท่า", "คู่ที่ 0.5 ≤ จริง ÷ คาด ≤ 2 ÷ คู่ทั้งหมด", ratios.filter((x) => x >= 0.5 && x <= 2).length, ratios.length);

  // 3 การตรวจ
  const rr = reviewRounds(runs);
  for (const [k, b] of Object.entries(rr.byRound)) addShare("ตรวจ", `ผ่านในรอบตรวจที่ ${k === "4" ? "4 ขึ้นไป" : k}`, `ผลตรวจรอบที่ ${k} ของ session ที่ผ่าน ÷ ผลตรวจรอบที่ ${k} ทั้งหมด`, b.c, b.n);
  addShare("ตรวจ", "session ที่ตรวจจนผ่าน", "session ที่มีผลตรวจ pass อย่างน้อย 1 ครั้ง ÷ session ที่มีผลตรวจ", rr.sessions.passed, rr.sessions.n);
  add("ตรวจ", "รอบตรวจจนผ่าน (ค่ากลาง)", "ค่ากลางของลำดับผลตรวจแรกที่ pass ใน session ที่ผ่าน", rr.untilPass.length ? median(rr.untilPass) : null, null, rr.untilPass.length);
  const sev = res.filter((r) => r.verdict && typeof r.high === "number");
  addShare("ตรวจ", "ผลตรวจที่เจอข้อระดับสูง", "ผลตรวจที่ high > 0 ÷ ผลตรวจที่จดจำนวนข้อ", sev.filter((r) => r.high > 0).length, sev.length);
  const passed = days.reduce((s, d) => s + d.passedReviews, 0), escaped = days.reduce((s, d) => s + d.correctedAfterPass, 0);
  addShare("ตรวจ", "ผ่านตรวจแล้วผู้ใช้ยังแก้ (หลุด)", "ครั้งที่ผู้ใช้สั่งแก้หลังผลตรวจผ่านล่าสุด ÷ ผลตรวจที่ผ่าน", escaped, passed, "ต่ำ = ผู้ตรวจเชื่อได้");

  // 4 ผลกับผู้ใช้
  const prompts = days.reduce((s, d) => s + d.prompts, 0), corr = days.reduce((s, d) => s + d.corrections, 0);
  addShare("ผู้ใช้", "ข้อความที่เป็นการสั่งแก้", "ข้อความผู้ใช้ที่ isCorrection() จับว่าแก้ ÷ ข้อความผู้ใช้ทั้งหมด", corr, prompts, "จับคำ หยาบ");
  const fb = runs.filter((r) => r.event === "feedback");
  addShare("ผู้ใช้", "รับงานโดยไม่แก้", "feedback = accept ÷ feedback ทั้งหมด", fb.filter((r) => r.user_feedback === "accept").length, fb.length, `${fb.filter((r) => r.inferred).length} จาก ${fb.length} อนุมานจากข้อความ`);
  const st = res.filter((r) => r.status);
  for (const s of ["done", "done_concerns", "missing_context", "blocked"]) addShare("ผู้ใช้", `ลูกทีมรายงาน ${s}`, `ผลที่บรรทัดแรกเป็น ${s} ÷ ผลที่มีสถานะ`, st.filter((r) => r.status === s).length, st.length);

  // 5 ต้นทุน
  const actions = days.reduce((s, d) => s + d.actions, 0), failed = days.reduce((s, d) => s + d.failed, 0);
  addShare("ต้นทุน", "คำสั่งที่ล้ม", "คำสั่งที่ ok = false ÷ คำสั่งทั้งหมด (หัวหน้า + ลูกทีม)", failed, actions);
  // ลูกทีมเบื้องหลัง (async) ไม่มี tokens ในแถว run · ใช้ total_tokens ของแถว result ที่ tool_use_id ตรงกัน (วิธีเดียวกับ estimates() ของ hook)
  const doneTokens = new Map(res.filter((r) => r.tool_use_id && r.total_tokens > 0).map((r) => [r.tool_use_id, r.total_tokens]));
  const tk = spawn.map((r) => tokenSum(r.tokens) || doneTokens.get(r.tool_use_id) || null).filter((x) => x > 0);
  add("ต้นทุน", "token ต่อลูกทีม (ค่ากลาง)", "ค่ากลางของ input + output + cacheRead + cacheCreate (ลูกทีมเบื้องหลังใช้ total_tokens ของผล)", tk.length ? median(tk) : null, null, tk.length, `p90 ${quantile(tk, 0.9) ?? "–"}`);
  const dur = spawn.map((r) => r.duration_ms).filter((x) => x > 0).map((x) => x / 1000);
  add("ต้นทุน", "เวลาต่อลูกทีม (วินาที · ค่ากลาง)", "ค่ากลางของ duration_ms ÷ 1000", dur.length ? median(dur) : null, null, dur.length, `p90 ${quantile(dur, 0.9)?.toFixed(0) ?? "–"}`);
  return rows;
}

// ไม่มีข้อมูลต้องเขียนว่าไม่มี ไม่ใช่ 0 · n < 5 เตือนในตาราง
const fmt = (x) => (x == null ? "–" : Math.abs(x) <= 1 && !Number.isInteger(x) ? x.toFixed(2) : Number.isInteger(x) ? String(x) : x.toFixed(2));
export function toMarkdown(rows, head) {
  return [head, "", "| มิติ | ตัววัด | สูตร | ค่า | ช่วง 95% | n | หมายเหตุ |", "|---|---|---|---|---|---|---|",
    ...rows.map((r) => `| ${r.dim} | ${r.name} | ${r.formula} | ${r.n ? fmt(r.value) : "ไม่มีข้อมูล"}${r.n && r.n < 5 ? " (n น้อย)" : ""} | ${r.ci ? `${fmt(r.ci[0])}–${fmt(r.ci[1])}` : "–"} | ${r.n} | ${r.note} |`),
    "", "ช่วง 95%: สัดส่วนใช้ Wilson · อัตราส่วนใช้ bootstrap บน log 2,000 ครั้ง · n น้อยกว่า 5 อ่านเป็นแนวโน้มเท่านั้น · ไม่มีแขนเทียบ: บอกว่าเกิดอะไร ไม่ได้บอกว่าดีกว่าไม่ใช้ superuser"].join("\n");
}

// ---------- self-test ----------
function selfTest() {
  const runs = [
    { ts: "1", session: "a", event: "result", verdict: "fail", high: 2 }, { ts: "2", session: "a", event: "result", verdict: "pass", high: 0 },
    { ts: "1", session: "b", event: "result", verdict: "fail", high: 0 }, { ts: "2", session: "b", event: "result", verdict: "fail" },
    { ts: "0", session: "a", event: "run", role: "superuser:worker", brief_sections: 5, effort: "low", model: "haiku", tokens: { input: 10, output: 90 }, estimate_tokens: 50 },
    { ts: "0", session: "b", event: "run", role: "superuser:reviewer", brief_sections: 2, effort: null, model: "inherit", resolved_model: "claude-sonnet-5-5", tokens: { input: 100, output: 100 }, estimate_tokens: 100 },
    { ts: "3", session: "a", event: "feedback", user_feedback: "accept", inferred: true },
  ];
  const day = { prompts: 4, corrections: 1, passedReviews: 2, correctedAfterPass: 1, actions: 10, failed: 1, par: { sumMs: 300, unionMs: 100 }, plans: [{ expect: { workers: 3 }, actual: { workers: 5 } }, { expect: { workers: null }, actual: { workers: 1 } }] };
  const rows = measure(runs, [day]);
  const get = (name) => rows.find((r) => r.name === name);
  const rr = reviewRounds(runs);
  const cases = [
    ["token รวมทุกช่อง", tokenSum({ input: 1, output: 2, cacheRead: 3, cacheCreate: 4 }) === 10 && tokenSum(null) === null],
    ["รอบตรวจเรียงตามเวลาใน session", rr.byRound[1].n === 2 && rr.byRound[1].c === 0 && rr.byRound[2].c === 1],
    ["ผ่านจนจบ 1 ใน 2 session · ค่ากลางรอบจนผ่าน 2", rr.sessions.passed === 1 && median(rr.untilPass) === 2],
    ["ใบสั่งงานครบ 1/2", get("ใบสั่งงานครบ 5 ข้อ").note === "1/2"],
    ["ระบุ effort 1/2", get("ระบุ effort").note === "1/2"],
    ["ขนานได้ 3 เท่า", get("ขนานได้จริงกี่เท่า").value === 3],
    ["คาด: ลูกทีมเกิน 2 · ไม่นับบรรทัดที่ไม่ระบุ", get("ลูกทีมจริง − คาด (ค่ากลาง)").value === 2 && get("ลูกทีมจริง − คาด (ค่ากลาง)").n === 1],
    ["token จริง ÷ คาด ค่ากลาง 2 กับ 2 = 2", Math.abs(get("token จริง ÷ คาด (ค่ากลาง)").value - 2) < 1e-9],
    ["หลุดหลังผ่าน 1/2", get("ผ่านตรวจแล้วผู้ใช้ยังแก้ (หลุด)").note.startsWith("1/2")],
    ["เจอข้อสูง 1/3 (ไม่นับแถวที่ไม่จดจำนวน)", get("ผลตรวจที่เจอข้อระดับสูง").note === "1/3"],
    ["markdown มีแถวครบ", toMarkdown(rows, "#").split("\n").filter((l) => l.startsWith("| ") && !l.startsWith("| มิติ")).length === rows.length],
  ];
  let ok = 0;
  for (const [name, pass] of cases) { console.log(`${pass ? "ผ่าน" : "ไม่ผ่าน"}  ${name}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}

// ---------- main ----------
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const args = process.argv.slice(2), opt = (f) => { const i = args.indexOf(f); return i < 0 ? null : args[i + 1]; };
  if (args.includes("--self-test")) selfTest();
  const logDir = resolve(opt("--log") ?? join(ROOT, ".claude", "superuser", "log"));
  if (!existsSync(logDir)) { console.error(`ไม่เจอ log ที่ ${logDir} · ใส่ --log <โฟลเดอร์>`); process.exit(2); }
  let names = readdirSync(logDir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  if (opt("--days")) names = names.slice(-Number(opt("--days")));
  const runs = names.flatMap((d) => readLines(join(logDir, d, "runs.jsonl")));
  const days = names.map((d) => countDay(join(logDir, d)));
  const sessions = new Set(runs.map((r) => r.session)).size;
  const head = `## ${new Date().toISOString().slice(0, 16).replace("T", " ")} · log ${names[0] ?? "–"} ถึง ${names.at(-1) ?? "–"} · ${names.length} วัน · ${sessions} session · ${runs.filter((r) => r.event === "run").length} ครั้งที่ส่งลูกทีม`;
  const md = toMarkdown(measure(runs, days), head);
  console.log(md);
  if (args.includes("--save")) {
    const f = join(HERE, "RESULTS.md");
    if (!existsSync(f)) writeFileSync(f, "# ผลวัดจาก log งานจริง\n\nสร้างโดย `scripts/evals/logstats/run-logstats.mjs` · ใหม่สุดอยู่ล่างสุด · สูตรใน `docs/EVAL-FORMULAS.md`\n");
    appendFileSync(f, "\n" + md + "\n");
    console.error(`ต่อท้าย ${f.replace(ROOT, ".")}`);
  }
}
