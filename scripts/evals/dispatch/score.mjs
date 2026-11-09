// score.mjs — ให้คะแนนแผนแจกงานที่ model ตอบเป็น JSON เทียบกับเฉลยของเคส · ฟังก์ชันล้วน ไม่อ่านไฟล์ ไม่เรียก claude
// เฉลยมาจาก SKILL.md ของ superuser หัวข้อ 2 (ขนาด) และหัวข้อ 5 (ระดับ model · ลูกทีมเท่าความกว้างของกราฟ · เกิน 8 แบ่งคลื่น)

import { wilson } from "../speed/stats.mjs";

export const WAVE_MAX = 8;
export const RATIO_LO = 0.8;
export const RATIO_HI = 1.2;
/** น้ำหนักคะแนนรวมเต็ม 10 · จำนวนลูกทีมเป็นเรื่องหลักของชุดนี้จึงหนักสุด */
export const WEIGHTS = { ratio_ok: 3, tier_acc: 2.5, iron_clean: 1.5, effort_set: 1, has_expect: 1, wave_ok: 1 };

// ป้ายของชิ้น → ระดับเฉลย ตาม superuser หัวข้อ 5 (ข้อแรกที่ตรงชนะ) · เฉลยจึงคำนวณได้ ไม่ใช่ใส่มือ
// ใหญ่: เงิน ภาษี กฎหมาย สุขภาพ ส่งถึงคนนอก ย้อนไม่ได้ สิทธิ์และรหัสผ่าน สถาปัตยกรรมทั้งระบบ · หรืออยู่ในงานเสี่ยง (ทุกชิ้นใหญ่)
// เล็ก: กลไก (mechanical) และมีแบบให้ทำตาม (template) และไม่ต้องตัดสินใจเอง (ไม่มี judgment)
export const RISK_TAGS = ["money", "legal", "health", "external", "irreversible", "auth", "architecture"];
export const TAGS = [...RISK_TAGS, "mechanical", "template", "judgment"];
export function tierFromTags(tags = [], risky = false) {
  if (risky || tags.some((t) => RISK_TAGS.includes(t))) return "ใหญ่";
  if (tags.includes("mechanical") && tags.includes("template") && !tags.includes("judgment")) return "เล็ก";
  return "กลาง";
}

// fable ไม่ใช่ค่าเริ่มของระดับไหน (superuser หัวข้อ 5) นับเป็นระดับใหญ่ เพื่อไม่ให้หลุดกฎเหล็กงานเสี่ยง
const TIER_BY_MODEL = [[/opus|fable/i, "ใหญ่"], [/sonnet/i, "กลาง"], [/haiku/i, "เล็ก"]];
/** ชื่อ model → ระดับ · ไม่ระบุหรือไม่รู้จัก → null (นับว่าผิด) */
export const tierOf = (model) => TIER_BY_MODEL.find(([re]) => re.test(String(model ?? "")))?.[1] ?? null;

const BROKEN = { parsed: false, ratio: null, ratio_ok: false, tier_acc: 0, iron_violation: 0, effort_set: 0, has_expect: false, wave_ok: false };

/** ดึง JSON ก้อนแรกจากคำตอบ (ในรั้ว ``` หรือจาก { แรกถึง } สุดท้าย) · อ่านไม่ได้ → null */
export function parsePlan(text) {
  if (typeof text !== "string") return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  try {
    const plan = JSON.parse(body);
    return plan && typeof plan === "object" && !Array.isArray(plan) ? plan : null;
  } catch {
    return null;
  }
}

const shares = (tiers) => tiers.reduce((m, t) => ({ ...m, [t]: (m[t] ?? 0) + 1 / tiers.length }), {});

/** สัดส่วนชิ้นที่ระดับตรงเฉลย · เทียบสัดส่วนของแต่ละระดับ ไม่จับคู่ตามชื่อ เพราะ model ตั้งชื่อชิ้นเอง
 *  เช่น ตอบ กลาง 4 ชิ้น เฉลย กลาง 3 ใหญ่ 1 → 0.75 · ระดับ null ไม่ตรงกับอะไรเลย */
export function tierAccuracy(got, want) {
  if (!got.length || !want.length) return 0;
  const g = shares(got), w = shares(want);
  return Object.keys(g).filter((t) => t !== "null").reduce((sum, t) => sum + Math.min(g[t], w[t] ?? 0), 0);
}

const waveSize = (w) => (Array.isArray(w) ? w.length : typeof w === "number" ? w : Infinity);
const hasText = (s) => typeof s === "string" && s.trim() !== "";

/** จำนวนลูกทีมถูกไหม · เคสที่มี accept_workers ถูกเมื่ออยู่ในรายการ · เฉลย 0 ถูกเมื่อ 0
 *  ที่เหลือ 0.8–1.2 เท่าของเฉลย และไม่เกิน 8 (ตัวที่ 9 ต้องรอคลื่นถัดไป) */
function workersOk(c, got) {
  if (got === null) return false;
  if (c.accept_workers) return c.accept_workers.includes(got);
  const want = c.expected.workers;
  if (want === 0) return got === 0;
  return got / want >= RATIO_LO && got / want <= RATIO_HI && got <= WAVE_MAX;
}

/** คะแนนของคำตอบ 1 รอบ · c = เคส ({ risky, expected: { workers }, accept_workers?, graph: { tasks: [{ tier }] } }) */
export function scoreRun(c, answer) {
  const plan = parsePlan(answer);
  if (!plan) return { ...BROKEN };
  const pieces = Array.isArray(plan.pieces) ? plan.pieces.filter((p) => p && typeof p === "object") : [];
  const want = c.expected.workers;
  const got = typeof plan.workers_parallel_max === "number" ? plan.workers_parallel_max : null;
  const ratio_ok = workersOk(c, got);
  // หัวหน้าทำเองและนับว่าถูก (เฉลย 0 หรือ accept_workers มี 0) → ไม่มีชิ้นส่งลูกทีม ระดับจึงไม่นับ
  const isLeadOnly = want === 0 || (got === 0 && ratio_ok);
  const tiers = pieces.map((p) => tierOf(p.model));
  return {
    parsed: true,
    ratio: want === 0 || got === null ? null : got / want,
    ratio_ok,
    tier_acc: isLeadOnly ? null : tierAccuracy(tiers, c.graph.tasks.map((t) => t.tier)),
    iron_violation: c.risky && tiers.includes("เล็ก") ? 1 : 0,
    effort_set: pieces.length ? pieces.filter((p) => hasText(p.effort)).length / pieces.length : isLeadOnly ? null : 0,
    has_expect: hasText(plan.expect_line) && plan.expect_line.trim().startsWith("คาด:"),
    wave_ok: Array.isArray(plan.waves) && plan.waves.every((w) => waveSize(w) <= WAVE_MAX),
  };
}

const mean = (xs) => {
  const v = xs.filter((x) => x !== null && x !== undefined).map(Number);
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null;
};

/** สรุปแขนเดียว · rows = [{ risky, score, skill_opened? }] · ไม่มีรอบ → null · skill_opened ไม่นับในคะแนนรวม */
export function summarizeArm(rows) {
  if (!rows.length) return null;
  const scores = rows.map((r) => r.score);
  const risky = rows.filter((r) => r.risky);
  const ratioOk = scores.filter((s) => s.ratio_ok).length;
  const m = {
    runs: rows.length,
    broken: scores.filter((s) => !s.parsed).length,
    ratio_ok: { c: ratioOk, ...wilson(ratioOk, rows.length) },
    tier_acc: mean(scores.map((s) => s.tier_acc)) ?? 0,
    iron_violations: scores.reduce((sum, s) => sum + s.iron_violation, 0),
    // รอบงานเสี่ยงที่ JSON อ่านได้และไม่มีชิ้นใช้ haiku · JSON พังไม่ได้คะแนนข้อนี้ · ไม่มีรอบงานเสี่ยง (ให้คะแนนบางเคส) → เต็ม
    iron_clean: risky.length ? risky.filter((r) => r.score.parsed && !r.score.iron_violation).length / risky.length : 1,
    effort_set: mean(scores.map((s) => s.effort_set)) ?? 0,
    has_expect: mean(scores.map((s) => s.has_expect)),
    wave_ok: mean(scores.map((s) => s.wave_ok)),
    skill_opened: mean(rows.map((r) => r.skill_opened)),
  };
  m.total = WEIGHTS.ratio_ok * m.ratio_ok.p + Object.entries(WEIGHTS).slice(1).reduce((sum, [k, w]) => sum + w * m[k], 0);
  return m;
}

const pct = (x) => `${Math.round(x * 100)}%`;
const signed = (x, f) => (x >= 0 ? "+" : "−") + f(Math.abs(x));
const ROWS = [
  ["จำนวนลูกทีมอยู่ในช่วง 0.8–1.2 เท่าของเฉลย (ช่วง 95% Wilson)", (m) => `${pct(m.ratio_ok.p)} (${pct(m.ratio_ok.lo)}–${pct(m.ratio_ok.hi)}) · ${m.ratio_ok.c}/${m.runs}`, (m) => m.ratio_ok.p, pct],
  ["ระดับ model ตรงเฉลย (เฉลี่ย)", (m) => m.tier_acc.toFixed(2), (m) => m.tier_acc, (x) => x.toFixed(2)],
  ["งานเสี่ยงที่มีชิ้นใช้ haiku (รอบ · ต้อง 0)", (m) => String(m.iron_violations), (m) => m.iron_violations, String],
  ["ชิ้นที่ระบุ effort", (m) => pct(m.effort_set), (m) => m.effort_set, pct],
  ["มีบรรทัด คาด:", (m) => pct(m.has_expect), (m) => m.has_expect, pct],
  ["ไม่มีคลื่นเกิน 8", (m) => pct(m.wave_ok), (m) => m.wave_ok, pct],
  ["JSON พังหรือไม่มีคำตอบ (รอบ)", (m) => `${m.broken}/${m.runs}`, (m) => m.broken, String],
  ["เปิด skill (% รอบ · ไม่นับในคะแนน)", (m) => (m.skill_opened === null ? "–" : pct(m.skill_opened)), (m) => m.skill_opened, pct],
  ["**คะแนนรวม (เต็ม 10)**", (m) => `**${m.total.toFixed(1)}**`, (m) => m.total, (x) => x.toFixed(1)],
];

/** ตาราง markdown 2 แขน + Δ (มี plugin − ไม่มี plugin) */
export function armTable(withPlugin, without) {
  const cell = (m, show) => (m ? show(m) : "–");
  const lines = ["| ตัววัด | มี plugin | ไม่มี plugin | Δ |", "|---|---|---|---|"];
  for (const [name, show, value, fmt] of ROWS) {
    const hasBoth = withPlugin && without && value(withPlugin) !== null && value(without) !== null;
    const delta = hasBoth ? signed(value(withPlugin) - value(without), fmt) : "–";
    lines.push(`| ${name} | ${cell(withPlugin, show)} | ${cell(without, show)} | ${delta} |`);
  }
  return lines.join("\n");
}
