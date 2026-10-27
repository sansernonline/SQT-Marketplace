// แจกชิ้นงานข้ามหลายบัญชี LLM (ช่วงแจกงานครั้งแรก ① จัดลำดับ ② กรอง ③ ให้คะแนน ④ เลือกแล้วจอง)
// แนวคิดจาก KC-QUEST ใน lab 03_KC_QUEST ของคอร์ส CWN2026 · เขียนใหม่ ไม่ได้นำโค้ดมา · หน่วยเวลาเป็นชั่วโมง ขนาดเป็น k token
// บัญชี: { name, tool, speed_k_per_hour, max_parallel, cap_k, remaining_k, reset_in_hours, window_hours }
export const DEFAULT_WEIGHTS = { U: 0.4, F: 0.2, R: 0.15, V: 0.15, L: -0.1 }; // น้ำหนักตาม lab · ค่าตั้งเอง ยังไม่ได้วัดกับงานเรา
export const DEFAULT_SAFETY = 1.2; // เผื่อขนาดจริงเกินที่ประเมิน ก่อนรับงานต้องมีโควตาเหลือ ≥ ขนาด × ค่านี้ (σ ของ lab · ค่าตั้งเอง)
const DEFAULT_WINDOW = 5; // ขีดจำกัดราย 5 ชั่วโมงของแผน Claude (จากแหล่ง ดู SKILL.md หัวข้อ planner)

const near = (x) => Math.round(x * 1000) / 1000;

export function validateAccounts(accounts, tasks, safety = DEFAULT_SAFETY) {
  if (!Array.isArray(accounts) || !accounts.length) return ["accounts ต้องเป็นรายการบัญชีอย่างน้อย 1 บัญชี"];
  const errors = [], names = new Set();
  for (const [i, a] of accounts.entries()) {
    const who = a?.name ?? `บัญชีที่ ${i + 1}`;
    if (!a?.name) errors.push(`${who}: ต้องมี name`);
    else if (names.has(a.name)) errors.push(`ชื่อบัญชีซ้ำ: ${a.name}`);
    names.add(a?.name);
    for (const key of ["speed_k_per_hour", "cap_k"]) if (!(a?.[key] > 0)) errors.push(`${who}: ${key} ต้องมากกว่า 0`);
    if (a?.max_parallel !== undefined && !(Number.isInteger(a.max_parallel) && a.max_parallel >= 1)) errors.push(`${who}: max_parallel ต้องเป็นจำนวนเต็มตั้งแต่ 1`);
  }
  if (errors.length) return errors;
  for (const t of tasks) {
    const fits = accounts.filter((a) => (!t.tool || t.tool === a.tool) && a.cap_k >= t.size * safety);
    if (!fits.length) errors.push(`${t.id}: ขนาด ${t.size}k × ${safety} ใหญ่กว่าโควตาเต็มถังของทุกบัญชีที่ใช้ได้ ให้แตกชิ้นให้เล็กลง`);
  }
  return errors;
}

// ③ คะแนนของบัญชีสำหรับชิ้นนี้ · U ใช้โควตาที่ใกล้รีเซ็ตก่อน · F ใส่ถังที่พอดี · R ถังที่ว่างมาก · V บัญชีเร็วรับชิ้นบนสายวิกฤต · L หักบัญชีที่งานล้น
export function score(acc, task, { critical, maxSpeed, weights = DEFAULT_WEIGHTS }) {
  const parts = {
    U: 24 / (24 + Math.max(0, acc.resetIn)),
    F: Math.min(1, task.size / acc.left),
    R: acc.left / acc.cap_k,
    V: critical ? acc.speed_k_per_hour / maxSpeed : 0,
    L: acc.running.length / acc.max_parallel,
  };
  return { total: Object.entries(weights).reduce((s, [k, w]) => s + w * (parts[k] ?? 0), 0), parts };
}

// จำลองการแจกงานตามเวลา: ทุกครั้งที่มีชิ้นพร้อม ① เรียง rank ② กรองบัญชีที่ผิดกฎเหล็ก ③ ให้คะแนน ④ เลือกตัวคะแนนสูงสุดแล้วจองโควตาทันที
export function assign(a, accountsIn, { weights = DEFAULT_WEIGHTS, safety = DEFAULT_SAFETY } = {}) {
  const accounts = accountsIn.map((x) => ({ ...x, max_parallel: x.max_parallel ?? 1, window: x.window_hours ?? DEFAULT_WINDOW,
    left: x.remaining_k ?? x.cap_k, resetIn: x.reset_in_hours ?? x.window_hours ?? DEFAULT_WINDOW, running: [] }));
  const maxSpeed = Math.max(...accounts.map((x) => x.speed_k_per_hour));
  const done = new Set(), started = new Set(), out = [];
  let now = 0;
  const ready = () => a.tasks.filter((t) => !started.has(t.id) && t.needs.every((n) => done.has(n)))
    .sort((x, y) => a.rank.get(y.id) - a.rank.get(x.id) || x.id.localeCompare(y.id));
  const anySolo = () => accounts.some((x) => x.running.some((r) => r.solo));
  const busy = () => accounts.some((x) => x.running.length);
  for (let guard = 0; done.size < a.tasks.length; guard++) {
    if (guard > 100000) throw new Error("จำลองไม่จบ: ตรวจโควตาและขนาดชิ้นใน accounts");
    for (const t of ready()) {
      if (anySolo() || (t.solo && busy())) break;
      const ok = accounts.filter((x) => x.running.length < x.max_parallel && x.left >= t.size * safety && (!t.tool || t.tool === x.tool));
      if (!ok.length) continue;
      const critical = a.cpm.get(t.id).float === 0;
      const ranked = ok.map((x) => ({ x, s: score(x, t, { critical, maxSpeed, weights }) })).sort((p, q) => q.s.total - p.s.total || p.x.name.localeCompare(q.x.name));
      const { x, s } = ranked[0];
      x.left -= t.size;
      const run = { id: t.id, account: x.name, solo: Boolean(t.solo), start: now, end: now + t.size / x.speed_k_per_hour, score: near(s.total), parts: s.parts, critical };
      x.running.push(run); out.push(run); started.add(t.id);
      if (t.solo) break;
    }
    const finishes = accounts.flatMap((x) => x.running.map((r) => r.end));
    const resets = accounts.map((x) => now + x.resetIn);
    const next = Math.min(...finishes, ...(finishes.length && ready().length === 0 ? [] : resets));
    const step = next - now;
    now = next;
    for (const x of accounts) {
      x.resetIn -= step;
      if (x.resetIn <= 1e-9) { x.left = x.cap_k; x.resetIn += x.window; }
      for (const r of x.running.filter((q) => q.end <= now + 1e-9)) { done.add(r.id); x.running.splice(x.running.indexOf(r), 1); }
    }
  }
  return { makespan: now, schedule: out, accounts: accounts.map((x) => ({ name: x.name, tool: x.tool, used: near(out.filter((r) => r.account === x.name).reduce((s, r) => s + a.tasks.find((t) => t.id === r.id).size, 0)), tasks: out.filter((r) => r.account === x.name).length })) };
}

const n1 = (x) => (Number.isInteger(x) ? String(x) : x.toFixed(1));

export function renderAssign(a, res) {
  const title = (id) => { const t = a.tasks.find((x) => x.id === id); return `${t.id}${t.title ? ` ${t.title}` : ""}`.replace(/\|/g, "\\|"); };
  return [
    "## แจกงานข้ามบัญชี", "",
    `ใช้เวลาตามแผน ${n1(res.makespan)} ชั่วโมง · ${res.accounts.map((x) => `${x.name} ${x.tasks} ชิ้น ${n1(x.used)}k`).join(" · ")}`, "",
    "| ชิ้น | บัญชี | เริ่ม → จบ (ชม.) | คะแนน | U · F · R · V · L | วิกฤต |", "|---|---|---|---|---|---|",
    ...[...res.schedule].sort((x, y) => x.start - y.start).map((r) => `| ${title(r.id)} | ${r.account} | ${n1(near(r.start))} → ${n1(near(r.end))} | ${r.score} | ${["U", "F", "R", "V", "L"].map((k) => r.parts[k].toFixed(2)).join(" · ")} | ${r.critical ? "✓" : ""} |`),
    "",
  ].join("\n");
}
