// --self-test ของ plan.mjs · ตัวอย่างใน superuser/references/team-roles.md "แบ่งงาน" + กรณีผิดที่ต้องจับได้
import { validate, ranks, analyse, render } from "./plan.mjs";
import { toMermaid, toHtml, levels } from "./plan-draw.mjs";
import { actualReport, learnSpeed, predictMoves } from "./plan-actual.mjs";
import { assign, validateAccounts, score, renderAssign } from "./plan-assign.mjs";
import { fileURLToPath } from "node:url";
import { fromStatusLine, fromCodexLine, applyQuota, accountName } from "./quota.mjs";

// บัญชีจำลอง (หน่วยขนาด = k token · ความเร็ว = k ต่อชั่วโมง)
const fast = { name: "fast", tool: "claude", speed_k_per_hour: 2, max_parallel: 1, cap_k: 10, reset_in_hours: 5 };
const slow = { name: "slow", tool: "claude", speed_k_per_hour: 1, max_parallel: 1, cap_k: 10, reset_in_hours: 5 };
const NOW = new Date("2026-10-27T00:00:00Z");
const accountCases = (a) => [
  ["บัญชี ①–④: ชิ้นวิกฤต a ได้บัญชีเร็ว · c ไปบัญชีที่ว่าง · จองโควตาทันที", (() => { const r = assign(a, [fast, slow]); const of = (id) => r.schedule.find((x) => x.id === id).account; return of("a") === "fast" && of("c") === "slow" && r.accounts.find((x) => x.name === "fast").used === 7; })()],
  ["บัญชี ②: โควตาไม่พอ (เหลือ < ขนาด × 1.2) ต้องรอรีเซ็ต · ชิ้นที่ 2 เริ่มชั่วโมงที่ 5", (() => { const p = analyse({ tasks: [{ id: "x", size: 2 }, { id: "y", size: 2 }] }); const r = assign(p, [{ name: "one", speed_k_per_hour: 10, cap_k: 3, reset_in_hours: 5 }]); const y = r.schedule.find((s) => s.id === "y"); return y.start === 5 && Math.abs(r.makespan - 5.2) < 1e-9; })()],
  ["บัญชี ②: ชิ้นที่ระบุ tool ไปได้เฉพาะบัญชีของ tool นั้น", (() => { const p = analyse({ tasks: [{ id: "x", size: 1, tool: "codex" }] }); return assign(p, [fast, { ...slow, name: "cx", tool: "codex" }]).schedule[0].account === "cx"; })()],
  ["บัญชี: ชิ้นใหญ่กว่าโควตาเต็มถังของทุกบัญชีฟ้อง · บัญชีไม่มี speed ฟ้อง", validateAccounts([fast], [{ id: "big", size: 20 }]).some((e) => e.includes("big")) && validateAccounts([{ name: "x", cap_k: 1 }], []).some((e) => e.includes("speed_k_per_hour"))],
  ["บัญชี ③: U สูงเมื่อใกล้รีเซ็ต · L หักบัญชีที่งานล้น", (() => { const t = { size: 1 }, base = { left: 5, cap_k: 10, speed_k_per_hour: 1, max_parallel: 2 }; const soon = score({ ...base, resetIn: 0, running: [] }, t, { critical: false, maxSpeed: 1 }), late = score({ ...base, resetIn: 24, running: [] }, t, { critical: false, maxSpeed: 1 }), busy = score({ ...base, resetIn: 0, running: [{}] }, t, { critical: false, maxSpeed: 1 }); return soon.parts.U === 1 && late.parts.U === 0.5 && soon.total > late.total && busy.total < soon.total; })()],
  ["บัญชี: ตาราง markdown และ HTML มี Gantt แยกบัญชี", (() => { const r = assign(a, [fast, slow]); return renderAssign(a, r).includes("| a ออกแบบตาราง | fast |") && toHtml({}, a, null, r).includes("แจกงานข้ามบัญชี"); })()],
  ["โควตา: status line → % ที่ใช้และเวลารีเซ็ต · ชื่อบัญชีจาก CLAUDE_CONFIG_DIR", (() => { const q = fromStatusLine({ rate_limits: { five_hour: { used_percentage: 40, resets_at: NOW.getTime() / 1000 + 7200 } } }, { CLAUDE_CONFIG_DIR: "C:\\u\\.claude-b" }, NOW); return q.account === ".claude-b" && q.five_hour.used === 40 && fromStatusLine({}, {}, NOW) === null && accountName({ CODEX_HOME: "/h/.codex-2" }, "codex") === ".codex-2"; })()],
  ["โควตา: บรรทัด token_count ของ Codex (รอบ 5 ชม. กับรอบยาว)", (() => { const q = fromCodexLine(JSON.stringify({ timestamp: "t", payload: { type: "token_count", rate_limits: { primary: { used_percent: 30, window_minutes: 300, resets_at: 1 }, secondary: { used_percent: 7, window_minutes: 10080, resets_at: 2 } } } }), "cx"); return q.five_hour.used === 30 && q.week.used === 7; })()],
  ["โควตา: ใช้ไป 40% → เหลือ 60k · รอบที่เลยรีเซ็ตแล้วถือว่าเต็ม · รายสัปดาห์เต็มแล้วเหลือ 0", (() => { const h = (x) => new Date(NOW.getTime() + x * 3600000).toISOString(); const accs = [{ name: "a", cap_k: 100 }, { name: "b", cap_k: 100 }, { name: "c", cap_k: 100 }]; const out = applyQuota(accs, { accounts: [{ account: "a", five_hour: { used: 40, reset: h(2) } }, { account: "b", five_hour: { used: 90, reset: h(-1) } }, { account: "c", five_hour: { used: 10, reset: h(1) }, week: { used: 100, reset: h(30) } }] }, NOW); return out[0].remaining_k === 60 && out[0].reset_in_hours === 2 && out[1].remaining_k === undefined && out[2].remaining_k === 0 && out[2].reset_in_hours === 30; })()],
  ["บัญชี: ก้าวเวลาข้ามหลายรอบโควตาไม่ย้อนเวลา · ไม่มีชิ้นเริ่มก่อนชิ้นที่รอจบ", (() => { const p = analyse({ tasks: [{ id: "a", size: 12, tool: "x" }, { id: "d", size: 20, tool: "y" }, { id: "b", size: 7, tool: "x", needs: ["a"] }, { id: "e", size: 7, tool: "x", needs: ["a"] }] }); const r = assign(p, [{ name: "one", tool: "x", speed_k_per_hour: 1, max_parallel: 3, cap_k: 15, window_hours: 5 }, { name: "two", tool: "y", speed_k_per_hour: 1, cap_k: 30, window_hours: 5 }]); const at_ = (id) => r.schedule.find((s) => s.id === id); return ["b", "e"].every((id) => at_(id).start >= at_("a").end - 1e-9); })()],
  ["บัญชี ②: โควตาเหลือเท่าขนาดพอดีแต่ไม่ถึงขนาด × 1.2 ยังรับไม่ได้", (() => { const p = analyse({ tasks: [{ id: "x", size: 2 }] }); return assign(p, [{ name: "one", speed_k_per_hour: 10, cap_k: 3, remaining_k: 2, reset_in_hours: 4 }]).schedule[0].start === 4; })()],
  ["บัญชี ②: ชิ้นทำคนเดียวไม่ทับเวลาชิ้นอื่นแม้มีหลายบัญชี", (() => { const p = analyse({ tasks: [{ id: "x", size: 2 }, { id: "y", size: 2 }, { id: "z", size: 1, solo: true }] }); const r = assign(p, [fast, slow]); const z = r.schedule.find((s) => s.id === "z"); return r.schedule.filter((s) => s.id !== "z").every((s) => s.end <= z.start + 1e-9 || s.start >= z.end - 1e-9); })()],
  ["บัญชี ③: V มีค่าเฉพาะชิ้นบนสายวิกฤต", (() => { const acc = { left: 5, cap_k: 10, speed_k_per_hour: 2, max_parallel: 1, resetIn: 5, running: [] }; return score(acc, { size: 1 }, { critical: true, maxSpeed: 2 }).parts.V === 1 && score(acc, { size: 1 }, { critical: false, maxSpeed: 2 }).parts.V === 0; })()],
  ["ระหว่างทำ ⑥: งานที่ยังไม่จบไม่ถูกนับความเร็ว", learnSpeed([{ start: 0, done: false, r: { account: "fast", total_tokens: 4000, duration_ms: 3600000 } }], [fast]).size === 0],
  ["ระหว่างทำ ⑤: โควตาพอไม่เสนอย้าย · ย้ายเฉพาะบัญชีที่ tool ตรงและหักโควตาปลายทาง", (() => { const est = () => 4000; const p = analyse({ tasks: [{ id: "a", size: 4, tool: "claude" }, { id: "b", size: 4, tool: "claude" }] }); const rows = [{ id: "a", done: false, r: { account: "A" } }, { id: "b", done: false, r: { account: "A" } }]; const accs = (left) => ({ accounts: [{ name: "A", tool: "claude", speed_k_per_hour: 1, cap_k: 20, remaining_k: left }, { name: "B", tool: "claude", speed_k_per_hour: 1, cap_k: 20, remaining_k: 5 }, { name: "C", tool: "codex", speed_k_per_hour: 1, cap_k: 20, remaining_k: 20 }] }); const ok = predictMoves(p, rows, accs(20), est).length === 0; const m = predictMoves(p, rows, accs(1), est); return ok && m.filter((x) => x.to === "B").length === 1 && m.every((x) => x.to !== "C"); })()],
  ["โควตา: ไม่ตั้งตัวแปรชื่อบัญชีเป็น .claude/.codex · รอบยาวใกล้เต็มลดโควตาที่ใช้ได้", (() => { const h = (x) => new Date(NOW.getTime() + x * 3600000).toISOString(); const out = applyQuota([{ name: "a", cap_k: 100 }], { accounts: [{ account: "a", five_hour: { used: 10, reset: h(2) }, week: { used: 95, reset: h(50) } }] }, NOW); return accountName({}) === ".claude" && accountName({}, "codex") === ".codex" && Math.abs(out[0].remaining_k - 5) < 1e-9; })()],
  ["ระหว่างทำ ⑤: ปลายทางเหลือเท่าขนาดแต่ไม่ถึงขนาด × 1.2 ไม่ถูกเลือก", (() => { const p = analyse({ tasks: [{ id: "a", size: 4 }] }); const m = predictMoves(p, [{ id: "a", done: false, r: { account: "A" } }], { accounts: [{ name: "A", speed_k_per_hour: 1, cap_k: 20, remaining_k: 1 }, { name: "B", speed_k_per_hour: 1, cap_k: 20, remaining_k: 4.5 }] }, () => 4000); return m.length === 1 && m[0].to === null; })()],
  ["ตัวเลข: ทศนิยมจากการคูณไม่แสดงเป็น .0 (400 × 0.2 → 80k)", actualReport(a, [{ ts: at(0), step: "design", description: "a: ทำ", async: true, account: "fast" }], { accounts: [{ ...fast, cap_k: 400, remaining_k: 400 * (1 - 0.8) }] }).markdown.includes("| 80k / 400k |")],
  ["ระหว่างทำ ⑥: ความเร็วจริงต่อบัญชีแบบ EMA (ตั้ง 2 · จริง 4 → 2.8)", learnSpeed([{ start: 0, done: true, r: { account: "fast", total_tokens: 4000, duration_ms: 3600000 } }], [fast]).get("fast").speed === 2.8],
  ["ระหว่างทำ ⑤✦: โควตาไม่พอกับงานค้าง → ย้ายไปบัญชีที่เหลือมาก พร้อมคำสั่งส่งไม้", (() => { const est = () => 2000; const rows = [{ id: "a", done: false, r: { account: "fast" } }]; const m = predictMoves(a, rows, { accounts: [{ ...fast, remaining_k: 1 }, slow] }, est); const md = actualReport(a, [{ ts: at(0), step: "design", description: "a: ทำ", async: true, account: "fast" }], { accounts: [{ ...fast, remaining_k: 1 }, slow] }).markdown; return m[0].to === "slow" && md.includes("ส่งไม้ให้ slow") && md.includes("handoff/a.md"); })()],
];

const example = { name: "ตัวอย่าง team-roles", tasks: [
  { id: "a", title: "ออกแบบตาราง", size: 2, owns: ["db/schema.sql"], step: "design" },
  { id: "b", title: "เขียน API", size: 3, needs: ["a"], owns: ["src/api.ts"], step: "code" },
  { id: "c", title: "แก้ README", size: 1, owns: ["README.md"] },
  { id: "d", title: "ทดสอบรวม", size: 2, needs: ["b"], step: "test" },
] };
const wide = { tasks: Array.from({ length: 10 }, (_, i) => ({ id: `w${i}`, size: 1 })) };
const diamond = { tasks: [{ id: "a", size: 2 }, { id: "b", size: 3, needs: ["a"] }, { id: "c", size: 5, needs: ["a"] }, { id: "d", size: 1, needs: ["b", "c"] }] };
const layered = { tasks: [{ id: "a", size: 3 }, { id: "b", size: 4, needs: ["a"] }, { id: "c", size: 2, needs: ["b"] }, { id: "d", size: 1, needs: ["a"] },
  { id: "e", size: 2, needs: ["d"] }, { id: "f", size: 1, needs: ["c", "e"] }, { id: "g", size: 1 }] };
// รูปแบบของ lab: ไฟล์เป็น array · depends_on · exclusive · ขนาด S/M/L
const lab = [{ id: "rag1", title: "ตำรา", size: "S" }, { id: "rag2", title: "chunk", size: "M", depends_on: ["rag1"] },
  { id: "k8s", title: "deploy + ทดสอบรวม", size: "L", depends_on: ["rag2"], exclusive: true }];
const at = (m) => new Date(Date.UTC(2026, 9, 27, 3, m)).toISOString();
const runs = [
  { ts: at(0), step: "design", description: "a: ออกแบบตาราง", role: "general-purpose", model: "sonnet", duration_ms: 600000, total_tokens: 2500, verdict: null },
  { ts: at(10), step: "code", description: "b เขียน API", role: "developer", model: "sonnet", duration_ms: 900000, total_tokens: 9000, verdict: null },
  { ts: at(26), step: "review", description: "b: ตรวจ", role: "superuser:reviewer", model: "opus", duration_ms: 60000, verdict: "pass" },
  { ts: at(12), step: "other", description: "ba: ไม่ใช่ชิ้น b", role: "x", model: "y", duration_ms: 1000 },
];
const solo = { tasks: [{ id: "x", size: 2 }, { id: "y", size: 2 }, { id: "z", size: 1, solo: true }] };

export function selfTest() {
  const a = analyse(example);
  const r = ranks(example.tasks);
  const md = render(example, a);
  const w = analyse(wide), wCap = analyse(wide, { agents: 3 });
  const s = analyse(solo);
  const zRun = s.schedule.find((x) => x.id === "z");
  const cases = [
    ["rank ก 7 · ข 5 · ง 2 · ค 1", [r.get("a"), r.get("b"), r.get("d"), r.get("c")].join() === "7,5,2,1"],
    ["สายวิกฤต ก → ข → ง ยาว 7 · งานรวม 8", a.cp.join() === "a,b,d" && a.cpLen === 7 && a.total === 8],
    ["กว้างสุด 2 · ขนาน 2 ตัว เวลาต่ำสุด 7 เร็วขึ้น 1.1 เท่า จึงใช้ลูกทีม 1 · ตัวเดียวได้ 8", a.width === 2 && a.lowerBound === 7 && Math.abs(a.parallelSpeedup - 8 / 7) < 1e-9 && a.team === 1 && a.makespan === 8 && md.includes("เวลาต่ำสุดตามสูตร 7k")],
    ["ปล่อยชิ้น rank สูงก่อน: ก ลำดับ 1 · ค ไปท้ายสุด", md.includes("| 1 | a ออกแบบตาราง") && md.includes("| 4 | c แก้ README")],
    ["เร็วขึ้นใกล้ 1 เท่า → บอกเหตุที่ใช้ตัวเดียว", md.includes("เร็วขึ้นแค่ 1.1 เท่า")],
    ["บรรทัดคาด: พร้อมใช้", md.includes("คาด: ลูกทีม 1 · สายวิกฤต 7k · กว้างสุด 2 · เร็วขึ้น 1.0 เท่า")],
    ["ค่า k ต่อขั้นคูณขนาด (code × 2 → ข 6 · rank ก 10)", ranks(analyse(example, { k: { code: 2 } }).tasks).get("a") === 10],
    ["กว้าง 10 → ลูกทีม 8 และเตือน dynamic workflow", w.width === 10 && w.team === 8 && w.needsWorkflow && render(wide, w).includes("dynamic workflow")],
    ["--agents 3 จำกัดลูกทีม · ไม่เตือน workflow", wCap.team === 3 && !wCap.needsWorkflow && wCap.makespan === 4],
    ["ชิ้นคนเดียวไม่ทับเวลากับชิ้นอื่น", s.schedule.filter((x) => x.id !== "z").every((x) => x.end <= zRun.start || x.start >= zRun.end)],
    ["จับกราฟวน", validate({ tasks: [{ id: "p", size: 1, needs: ["q"] }, { id: "q", size: 1, needs: ["p"] }] }).some((e) => e.includes("วน"))],
    ["จับเจ้าของไฟล์ซ้ำที่ไม่ได้รอกัน", validate({ tasks: [{ id: "p", size: 1, owns: ["f"] }, { id: "q", size: 1, owns: ["f"] }] }).some((e) => e.includes("เจ้าของ f"))],
    ["เจ้าของไฟล์ซ้ำแต่รอกันแล้ว → ผ่าน", validate({ tasks: [{ id: "p", size: 1, owns: ["f"] }, { id: "q", size: 1, owns: ["f"], needs: ["p"] }] }).length === 0],
    ["จับชิ้นที่รอชิ้นไม่มีอยู่ · id ซ้ำ · size 0", validate({ tasks: [{ id: "p", size: 0, needs: ["zz"] }, { id: "p", size: 1 }] }).length === 3],
    ["ตัวอย่างผ่านการตรวจ", validate(example).length === 0],
    ["lab: array · depends_on · exclusive · S/M/L แปลงเป็น 20/50/100", (() => { const l = analyse(lab); return validate(lab).length === 0 && l.cpLen === 170 && l.tasks.find((t) => t.id === "k8s").solo === true && render({}, l).includes("L 100k"); })()],
    ["ขนาดป้ายที่ไม่รู้จักฟ้อง · sizes ในไฟล์เปลี่ยนค่าได้", validate([{ id: "x", size: "XL" }])[0].includes("XL") && analyse({ sizes: { S: 5 }, tasks: [{ id: "x", size: "s" }] }).total === 5],
    ["Mermaid: flowchart มีเส้นวิกฤต ==> และ class critical", (() => { const m = toMermaid(a); return m.startsWith("```mermaid\nflowchart LR") && m.includes("n0 ==> n1") && m.includes("n2[") && m.includes("class n0 critical") && !m.includes("class n2 critical"); })()],
    ["Mermaid: id ภาษาไทยและ a-b กับ a_b ไม่ชนกัน ไม่มีเส้นวนเข้าตัวเอง", (() => { const m = toMermaid(analyse({ tasks: [{ id: "ก", size: 1 }, { id: "ข", size: 1, needs: ["ก"] }, { id: "a-b", size: 1 }, { id: "a_b", size: 1, needs: ["a-b"] }] })); return m.includes("n0 ==> n1") && m.includes("n2 ==> n3") && !/(n\d+) [-=]+> \1\b/.test(m); })()],
    ["DAG: ชิ้นพ่ออยู่ชั้นซ้ายของลูกเสมอ · ชิ้นที่ไม่เกี่ยวกับใครอยู่ชั้นแรก", (() => { const l = analyse(layered), lv = levels(l); return l.tasks.every((t) => t.needs.every((n) => lv.get(n) < lv.get(t.id))) && lv.get("g") === 0 && lv.get("d") > lv.get("a"); })()],
    ["DAG: ชิ้นนอกสายวิกฤตวางชิดชิ้นที่รอมัน ไม่กองซ้ายสุด (x → z อยู่ชั้น 2 ไม่ใช่ 0)", (() => { const lv = levels(analyse({ tasks: [{ id: "a", size: 1 }, { id: "b", size: 1, needs: ["a"] }, { id: "c", size: 1, needs: ["b"] }, { id: "x", size: 1 }, { id: "z", size: 1, needs: ["c", "x"] }] })); return lv.get("x") === 2 && lv.get("z") === 3; })()],
    ["actual: แผนมีแค่ b · งาน b-2 ไม่นับเป็นของ b (- ไม่ใช่ตัวคั่น)", actualReport(analyse({ tasks: [{ id: "b", size: 1 }] }), [{ ts: at(0), step: "code", description: "b-2: งานอื่น", async: true, duration_ms: 1000 }]).rows.length === 0],
    ["actual: งาน b-2 ไม่ผูกกับชิ้น b · ใช้ id ที่ยาวที่สุด", (() => { const p = analyse({ tasks: [{ id: "b", size: 1 }, { id: "b-2", size: 1 }] }); const r = actualReport(p, [{ ts: at(0), step: "code", description: "b-2: งานย่อย", async: true, duration_ms: 60000 }]); return r.rows.length === 1 && r.rows[0].label.startsWith("b-2") && r.summary.includes("ยังไม่ได้ปล่อย: b"); })()],
    ["actual: review ที่มาก่อนไม่ถูกนับเป็นงาน · ผลตรวจอ่านจาก reviews ที่ผูกไว้ · duration 0 นับว่าจบ", (() => { const r = actualReport(a, [{ ts: at(0), step: "review", description: "a: ตรวจ", duration_ms: 1000 }, { ts: at(5), step: "design", description: "a: ทำ", async: true, duration_ms: 0, reviews: ["fail"] }]); return r.rows.length === 1 && /\| a \|[^\n]*\| 0 นาที \|[^\n]*\| fail \|/.test(r.markdown); })()],
    ["actual: งานแบบรอผลเริ่มที่ ts ลบเวลาที่ใช้ (hook จด ts ตอนจบ)", (() => { const r = actualReport(a, [{ ts: at(0), step: "design", description: "a: ทำ", async: true, duration_ms: 60000 }, { ts: at(20), step: "code", description: "b: ทำ", async: false, duration_ms: 600000 }]); return r.markdown.includes("| b | – | – | 10 | 10 นาที |"); })()],
    ["คิว deep research แปลงเป็นแผนได้ (ข้อย่อย · คำถาม · ขนาด · ไฟล์ผล)", (() => { const q = { "งาน": "x", "ข้อย่อย": [{ id: "q1", "คำถาม": "ก", depends_on: [], "ขนาด": "S", "ไฟล์ผล": "r/q1.md" }, { id: "q2", "คำถาม": "ข", depends_on: ["q1"], "ขนาด": "M", "ไฟล์ผล": "r/q2.md" }] }; const p = analyse(q); return validate(q).length === 0 && p.total === 70 && p.tasks[1].owns[0] === "r/q2.md"; })()],
    ["ตาราง markdown: ชื่อที่มี | ไม่ทำคอลัมน์เลื่อน", render({}, analyse({ tasks: [{ id: "x", title: "ก|ข", size: 1 }] })).includes("x ก\\|ข")],
    ...accountCases(a),
    ["HTML: มี SVG ของ DAG และ Gantt · escape ข้อความ · ไม่มี undefined/NaN", (() => { const h = toHtml({ name: "<x>" }, a); return (h.match(/<svg /g) ?? []).length === 2 && h.includes("&lt;x&gt;") && !/undefined|NaN/.test(h); })()],
    ["actual: ผูกงานด้วย id ต้นคำอธิบาย · ไม่นับ review · ไม่สับสน ba กับ b · บอกชิ้นที่ยังไม่ปล่อย", (() => { const r = actualReport(a, runs); return r.rows.length === 2 && r.markdown.includes("| a | general-purpose | sonnet | 0 | 10 นาที | 2.5k / 2k |") && r.markdown.includes("| b | developer |") && r.summary.includes("ยังไม่ได้ปล่อย: c d") && r.summary.includes("เกินที่ประเมินเกิน 1.5 เท่า: b"); })()],
    ["actual: ไม่มีงานใน log → บอกวิธีตั้งคำอธิบาย", actualReport(a, []).markdown.includes("`a: ออกแบบตาราง`")],
    ["HTML ที่มีงานจริง: มี Gantt ที่ 3", (toHtml({}, a, actualReport(a, runs)).match(/<svg /g) ?? []).length === 3],
    ["เพชร: rank ใช้ค่าสูงสุดของชิ้นที่รอ ไม่ใช่ผลรวม (a = 2 + 6 = 8)", ranks(diamond.tasks).get("a") === 8 && analyse(diamond).cp.join() === "a,c,d"],
    ["CPM เพชร: c และ d เผื่อได้ 0 · b เผื่อได้ 2 (เริ่มเร็วสุด 2 ช้าสุด 4)", (() => { const c = analyse(diamond).cpm; return c.get("a").float === 0 && c.get("c").float === 0 && c.get("d").float === 0 && c.get("b").early === 2 && c.get("b").late === 4 && c.get("b").float === 2; })()],
    ["CPM หลายระดับ: d e เผื่อได้ 3 · g เผื่อได้ 9 · สายวิกฤต a b c f ยาว 10", (() => { const c = analyse(layered).cpm; return ["a", "b", "c", "f"].every((x) => c.get(x).float === 0) && c.get("d").float === 3 && c.get("e").early === 4 && c.get("e").float === 3 && c.get("g").float === 9; })()],
    ["needs หรือ owns ซ้ำในชิ้นเดียว ไม่ฟ้องผิด", validate({ tasks: [{ id: "p", size: 1, owns: ["f", "f"] }, { id: "q", size: 1, needs: ["p", "p"] }] }).length === 0],
    ["scope: ครบพอดีผ่าน · ข้อตก ข้อซ้ำ และ covers นอก scope ฟ้อง", (() => { const t = (covers) => ({ id: covers.join(""), size: 1, covers }); const ok = validate({ scope: ["x", "y"], tasks: [t(["x"]), t(["y"])] }); const bad = validate({ scope: ["x", "y", "z"], tasks: [t(["x"]), t(["x", "y"]), t(["w"])] }); return ok.length === 0 && bad.some((e) => e.includes('"z" ไม่มีชิ้นไหนรับ')) && bad.some((e) => e.includes('"x" ซ้ำ')) && bad.some((e) => e.includes('"w" ไม่อยู่ใน scope')); })()],
    ["input เพี้ยนได้ข้อความไทยที่บอกชิ้น ไม่พัง", validate({ tasks: {} })[0].includes("array") && validate({ tasks: [null] })[0].includes("object") && validate({ tasks: [{ id: "p", size: 1, needs: "a" }] })[0].startsWith("p: needs")],
  ];
  let ok = 0;
  for (const [label, pass] of cases) { console.log(`  ${pass ? "✅" : "❌"} ${label}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}

// รันไฟล์นี้ตรง ๆ (node plan.test.mjs) ต้องรัน test ด้วย ไม่ใช่จบเงียบ ๆ ด้วย exit 0
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) selfTest();
