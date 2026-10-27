// เทียบแผนกับงานที่เกิดจริง: อ่านงานลูกทีมจาก log ของ superuser (runs.jsonl ผ่าน model-scorecard) แล้วผูกกับชิ้นในแผน
// ผูกด้วยคำอธิบายงาน (description ของเครื่องมือ Agent) ที่ขึ้นต้นด้วย id ของชิ้น เช่น "a: ออกแบบตาราง" หรือ "a ออกแบบตาราง"
import { score, DEFAULT_WEIGHTS } from "./plan-assign.mjs";

// ปัดทศนิยม 1 ตำแหน่งก่อน เพราะ 400 × 0.2 ได้ 80.00000000000001 แล้วจะแสดงเป็น 80.0
const n1 = (x) => { const r = Math.round(x * 10) / 10; return Number.isInteger(r) ? String(r) : r.toFixed(1); };
const realTokens = (r) => r.total_tokens ?? (r.tokens && !r.tokensEstimated ? Object.values(r.tokens).reduce((s, v) => s + (v ?? 0), 0) : null);
const escRe = (id) => id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// id ตามด้วย : หรือช่องว่างเท่านั้น · "-" และ "." เป็นส่วนของ id ได้ (b-2 ไม่ใช่งานของ b)
const startsWithId = (desc, id) => new RegExp(`^\\s*${escRe(id)}(\\s*[:：]|\\s)`).test(desc ?? "");
const cell = (s) => String(s).replace(/\|/g, "\\|");

// งานแรกของแต่ละชิ้น (ไม่นับขั้น review) · งาน 1 ชิ้นผูกได้กับ id เดียว คือ id ที่ยาวที่สุดที่ตรง
export function matchRuns(a, runs) {
  const ids = a.tasks.map((t) => t.id).sort((x, y) => y.length - x.length), out = new Map(a.tasks.map((t) => [t.id, null]));
  for (const r of runs.filter((x) => x.step !== "review").sort((x, y) => Date.parse(x.ts) - Date.parse(y.ts))) {
    const id = ids.find((i) => startsWithId(r.description, i));
    if (id && !out.get(id)) out.set(id, r);
  }
  return out;
}

// hook จดเวลา ts ตอนเครื่องมือ Agent คืนผล · งานที่รอผล (ไม่ใช่เบื้องหลัง) ts จึงเป็นเวลาจบ ต้องลบเวลาที่ใช้ออก
const startMs = (r) => Date.parse(r.ts) - (!r.async && r.duration_ms > 0 ? r.duration_ms : 0);
const verdictOf = (r) => r.reviews?.at(-1) ?? r.verdict ?? "–";

// ⑥ เรียนรู้ความเร็วจริงต่อบัญชี: k token ต่อชั่วโมงของงานที่จบแล้ว · ถ่วงแบบ EMA k ← 0.6k + 0.4 × ค่าใหม่ (สูตรเดียวกับ model-scorecard)
export function learnSpeed(rows, accounts) {
  const out = new Map();
  for (const x of [...rows].sort((p, q) => p.start - q.start)) {
    const tk = realTokens(x.r), hrs = x.r.duration_ms / 3600000;
    if (!x.r.account || !x.done || !(tk > 0) || !(hrs > 0)) continue;
    const prev = out.get(x.r.account) ?? { n: 0, speed: accounts.find((acc) => acc.name === x.r.account)?.speed_k_per_hour ?? tk / 1000 / hrs };
    out.set(x.r.account, { n: prev.n + 1, speed: 0.6 * prev.speed + 0.4 * (tk / 1000 / hrs) });
  }
  return out;
}

// ⑤ คาดการณ์ว่าโควตาของบัญชีพอกับงานที่ค้างไหม · ไม่พอ ให้ย้ายชิ้นใหญ่ก่อนจนที่เหลือพอ · ✦ ส่งไม้ไปบัญชีที่ผ่านกฎเหล็กเดียวกับ ② และคะแนน ③ สูงสุด แล้วหักโควตาปลายทางทุกครั้งที่เสนอ
export function predictMoves(a, rows, team, est) {
  const safety = team.safety ?? 1.2, moves = [];
  const pool = team.accounts.map((b) => ({ ...b, left: b.remaining_k ?? b.cap_k, resetIn: b.reset_in_hours ?? b.window_hours ?? 5, max_parallel: b.max_parallel ?? 1,
    running: rows.filter((x) => !x.done && x.r.account === b.name) }));
  const maxSpeed = Math.max(...pool.map((b) => b.speed_k_per_hour));
  for (const acc of pool) {
    const open = [...acc.running].sort((p, q) => est(q.id) - est(p.id));
    let need = open.reduce((s, x) => s + est(x.id) / 1000, 0) * safety;
    const left = acc.left;
    for (const x of open) {
      if (need <= left) break;
      const task = a.tasks.find((t) => t.id === x.id), size = est(x.id) / 1000;
      const to = pool.filter((b) => b.name !== acc.name && b.left >= size * safety && (!task.tool || task.tool === b.tool))
        .map((b) => ({ b, s: score(b, { size }, { critical: a.cpm.get(x.id).float === 0, maxSpeed, weights: team.weights ?? DEFAULT_WEIGHTS }).total }))
        .sort((p, q) => q.s - p.s)[0]?.b;
      if (to) to.left -= size;
      moves.push({ id: x.id, from: acc.name, to: to?.name ?? null, need, left });
      need -= size * safety;
    }
  }
  return moves;
}

// อายุของข้อมูลโควตา · เก่ากว่า 1 รอบ (ค่าตั้งต้น 5 ชม.) เตือน เพราะอาจไม่ตรงกับตอนนี้
const quotaAge = (acc, now = Date.now()) => {
  if (!acc.quota_at) return "ไม่มี (ใช้เต็มถัง)";
  const h = (now - Date.parse(acc.quota_at)) / 3600000;
  return h > (acc.window_hours ?? 5) ? `เก่า ${n1(Math.round(h))} ชม. ควรอ่านใหม่` : `${n1(Math.round(h * 10) / 10)} ชม. ก่อน`;
};

function accountSection(a, rows, team, est) {
  const speeds = learnSpeed(rows, team.accounts), moves = predictMoves(a, rows, team, est);
  return [
    "## บัญชีระหว่างทำงาน", "",
    "| บัญชี | โควตาเหลือ | รีเซ็ตใน | ข้อมูลโควตา | ความเร็วที่ตั้ง | ความเร็วจริง (EMA) |", "|---|---|---|---|---|---|",
    ...team.accounts.map((acc) => { const sp = speeds.get(acc.name); return `| ${cell(acc.name)} | ${n1(acc.remaining_k ?? acc.cap_k)}k / ${n1(acc.cap_k)}k | ${acc.reset_in_hours != null ? `${n1(acc.reset_in_hours)} ชม.` : "–"} | ${quotaAge(acc, team.now ?? Date.now())} | ${acc.speed_k_per_hour}k/ชม. | ${sp ? `${n1(sp.speed)}k/ชม. (${sp.n} งาน) → แก้ speed_k_per_hour ใน accounts.json` : "ยังไม่มีงานที่จบ"} |`; }),
    "",
    ...(moves.length ? ["**ควรย้ายงาน (โควตาไม่พอกับงานที่ค้าง)**", "",
      ...moves.map((m) => `- ${cell(m.id)}: ${m.from} ต้องใช้ราว ${n1(m.need)}k แต่เหลือ ${n1(m.left)}k → ${m.to ? `ส่งไม้ให้ ${m.to}: ลูกทีมบน ${m.from} เขียนใบส่งต่อ \`.claude/superuser/handoff/${m.id}.md\` ในโฟลเดอร์หลักของ repo (\`.claude/\` ไม่ตามไปใน worktree) ตาม skill \`handoff\` (ทำถึงไหน · commit อะไร · ต่อจากตรงไหน) แล้วเปิดงานบน ${m.to} ด้วยคำอธิบาย \`${m.id}: ทำต่อจากใบส่งต่อ ไม่เริ่มใหม่\`` : "ไม่มีบัญชีที่โควตาพอ รอรีเซ็ตหรือแตกชิ้นให้เล็กลง"}`), ""] : ["โควตาทุกบัญชีพอกับงานที่ค้างอยู่", ""]),
  ];
}

export function actualReport(a, runs, team = null) {
  const matched = matchRuns(a, runs), hits = [...matched.entries()].filter(([, r]) => r);
  if (!hits.length) return { rows: [], markdown: "ยังไม่มีงานใน log ที่คำอธิบายขึ้นต้นด้วย id ของชิ้นในแผน (เช่น `a: ออกแบบตาราง`)", summary: "" };
  const t0 = Math.min(...hits.map(([, r]) => startMs(r)));
  const minutes = (ms) => ms / 60000;
  const rows = hits.map(([id, r]) => {
    const start = minutes(startMs(r) - t0), dur = r.duration_ms != null && r.duration_ms >= 0 ? minutes(r.duration_ms) : null;
    return { id, r, start, end: dur == null ? start : start + dur, done: dur != null };
  }).sort((x, y) => x.start - y.start);
  const missing = a.tasks.filter((t) => !matched.get(t.id)).map((t) => t.id);
  const span = Math.max(...rows.map((x) => x.end));
  const cpDone = a.cp.every((id) => rows.find((x) => x.id === id)?.done);
  const est = (id) => a.tasks.find((t) => t.id === id).size * 1000;
  const over = rows.filter((x) => realTokens(x.r) > est(x.id) * 1.5).map((x) => x.id);
  const summary = `เกิดจริง ${rows.length} จาก ${a.tasks.length} ชิ้น · ใช้เวลารวม ${n1(span)} นาที${cpDone ? "" : " (สายวิกฤตยังไม่ครบ)"}${over.length ? ` · token เกินที่ประเมินเกิน 1.5 เท่า: ${over.join(" ")}` : ""}${missing.length ? ` · ยังไม่ได้ปล่อย: ${missing.join(" ")}` : ""}`;
  const bar = (x) => { const s = 40 / (span || 1); return "·".repeat(Math.round(x.start * s)) + "█".repeat(Math.max(1, Math.round((x.end - x.start) * s))); };
  const markdown = [
    "## เกิดจริงเทียบแผน", "", summary, "",
    "| ชิ้น | ใครทำ | model | เริ่ม (นาที) | ใช้เวลา | token จริง / ประเมิน | ผลตรวจ | ไทม์ไลน์ |", "|---|---|---|---|---|---|---|---|",
    ...rows.map((x) => { const tk = realTokens(x.r); return `| ${cell(x.id)} | ${cell(`${x.r.role ?? "–"}${x.r.account ? ` @ ${x.r.account}` : ""}`)} | ${cell(x.r.model ?? "–")} | ${n1(x.start)} | ${x.done ? `${n1(x.end - x.start)} นาที` : "ยังไม่จบ"} | ${tk == null ? "–" : `${n1(tk / 1000)}k / ${n1(est(x.id) / 1000)}k`} | ${verdictOf(x.r)} | \`${bar(x)}\` |`; }),
    "",
    ...(team ? accountSection(a, rows, team, est) : []),
  ].join("\n");
  return { summary, markdown, rows: rows.map((x) => ({ label: `${x.id} · ${x.r.role ?? ""}`, start: x.start, end: Math.max(x.end, x.start + 0.1), crit: a.cpm.get(x.id).float === 0 })) };
}
