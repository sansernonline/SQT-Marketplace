// เทียบแผนกับงานที่เกิดจริง: อ่านงานลูกทีมจาก log ของ superuser (runs.jsonl ผ่าน model-scorecard) แล้วผูกกับชิ้นในแผน
// ผูกด้วยคำอธิบายงาน (description ของเครื่องมือ Agent) ที่ขึ้นต้นด้วย id ของชิ้น เช่น "a: ออกแบบตาราง" หรือ "a ออกแบบตาราง"
const n1 = (x) => (Number.isInteger(x) ? String(x) : x.toFixed(1));
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

export function actualReport(a, runs) {
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
    ...rows.map((x) => { const tk = realTokens(x.r); return `| ${cell(x.id)} | ${cell(x.r.role ?? "–")} | ${cell(x.r.model ?? "–")} | ${n1(x.start)} | ${x.done ? `${n1(x.end - x.start)} นาที` : "ยังไม่จบ"} | ${tk == null ? "–" : `${n1(tk / 1000)}k / ${n1(est(x.id) / 1000)}k`} | ${verdictOf(x.r)} | \`${bar(x)}\` |`; }),
    "",
  ].join("\n");
  return { summary, markdown, rows: rows.map((x) => ({ label: `${x.id} · ${x.r.role ?? ""}`, start: x.start, end: Math.max(x.end, x.start + 0.1), crit: a.cpm.get(x.id).float === 0 })) };
}
