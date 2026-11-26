// หัวข้อ "การแจกงาน": ตัววัดการแจกงานที่นับจาก log ได้เอง (นิยามอยู่ในหัวข้อ H ของ scripts/check/improve-plugin-prompt.md)
const THIN = 5;
const SAME_MOMENT_MS = 5000;
const MAX_WIDTH = 8;
const Z95 = 1.96;

const percent = (x) => `${Math.round(x * 100)}%`;
const missing = (field) => `วัดไม่ได้ — ต้องมีช่อง ${field}`;
const median = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

export function wilson(k, n) {
  const p = k / n, z2 = Z95 * Z95, mid = (p + z2 / (2 * n)) / (1 + z2 / n);
  const half = (Z95 * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / (1 + z2 / n);
  return [Math.max(0, mid - half), Math.min(1, mid + half)];
}

// ลูกทีมลงมือ (ไม่ใช่ review) ใน session เดียวกันที่ ts ห่างจาก run แรกของชุดไม่เกิน 5 วินาที นับเป็นชุดเดียว (ไม่ต่อเป็นสาย) · คืนขนาดของแต่ละชุด
export function simultaneousGroups(runs) {
  const bySession = Map.groupBy(runs.filter((r) => r.step !== "review"), (r) => r.session);
  const sizes = [];
  for (const list of bySession.values()) {
    const times = list.map((r) => Date.parse(r.ts)).sort((a, b) => a - b);
    let start = null, size = 0;
    for (const t of times) {
      if (start !== null && t - start <= SAME_MOMENT_MS) { size++; continue; }
      if (size) sizes.push(size);
      start = t; size = 1;
    }
    if (size) sizes.push(size);
  }
  return sizes;
}

// 1 งาน = บรรทัด expect กับ run ที่ตามมาจนถึง expect ถัดไปใน session เดียวกัน (แบบเดียวกับ expectVsActual ใน hook แต่แยกตาม session)
export function planSegments(runs, expects) {
  const events = [...expects.map((e) => ({ ...e, event: "expect" })), ...runs.map((r) => ({ ...r, event: "run" }))];
  const segments = [];
  for (const list of Map.groupBy(events, (e) => e.session).values()) {
    let current = null;
    for (const e of list.sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts))) {
      if (e.event === "expect") { current = { expect: e, runs: [] }; segments.push(current); }
      else if (current) current.runs.push(e);
    }
  }
  return segments;
}

export const workerRatios = (segments) => segments.filter((g) => g.expect.workers > 0)
  .map((g) => g.runs.filter((r) => r.step !== "review").length / g.expect.workers);

export const widthRatios = (segments) => segments.filter((g) => g.expect.width > 0)
  .map((g) => Math.max(0, ...simultaneousGroups(g.runs)) / Math.min(g.expect.width, MAX_WIDTH));

const row = (name, value, n) => `| ${name} | ${value} | ${n} | ${n < THIN ? "ตัวอย่างน้อย" : ""} |`;
const unmeasured = (name, field) => row(name, missing(field), 0);
const NO_EXPECT = "ยังไม่มีบรรทัด คาด:";

function modelRows(runs) {
  if (!runs.some((r) => "model" in r)) return [unmeasured("ระบุ model", "model"), unmeasured("run ต่อ model", "model")];
  const named = runs.filter((r) => r.model !== "inherit").length;
  const perModel = [...Map.groupBy(runs, (r) => r.model)].map(([m, rs]) => `${m} ${rs.length}`).join(" · ");
  return [row("ระบุ model", `${percent(named / runs.length)} (${named}/${runs.length})`, runs.length), row("run ต่อ model", perModel, runs.length)];
}

function effortRow(runs) {
  if (!runs.some((r) => "effort" in r)) return unmeasured("ระบุ effort", "effort");
  const set = runs.filter((r) => r.effort).length;
  return row("ระบุ effort", `${percent(set / runs.length)} (${set}/${runs.length})`, runs.length);
}

function widthRows(runs) {
  const sizes = simultaneousGroups(runs);
  if (!sizes.length) return [row("ลูกทีมพร้อมกันมากสุด (ทุก session)", "ไม่มีลูกทีมลงมือ", 0), row(`ชุดที่เกิน ${MAX_WIDTH}`, "ไม่มีลูกทีมลงมือ", 0)];
  const over = sizes.filter((s) => s > MAX_WIDTH).length;
  return [row("ลูกทีมพร้อมกันมากสุด (ทุก session)", String(Math.max(...sizes)), sizes.length), row(`ชุดที่เกิน ${MAX_WIDTH}`, `${over} จาก ${sizes.length} ชุด`, sizes.length)];
}

function briefRow(runs) {
  const counted = runs.filter((r) => typeof r.brief_sections === "number");
  if (!counted.length) return unmeasured("ใบสั่งงานครบ", "brief_sections");
  const avg = counted.reduce((s, r) => s + r.brief_sections, 0) / counted.length;
  return row("ใบสั่งงานครบ", `${(avg / 5).toFixed(2)} (เฉลี่ย ${avg.toFixed(1)} จาก 5 ส่วน)`, counted.length);
}

// ผลผู้ตรวจ = result ที่ spawned_id ตรงกับ run ขั้น review (collect.mjs เลือกมาให้แล้ว)
function reviewRows(results) {
  const first = results.filter((r) => r.round === 1);
  const empty = results.filter((r) => !r.verdict).length;
  if (!first.length) return [row("ผ่านรอบแรก", "ยังไม่มีผลผู้ตรวจรอบ 1", 0), row("verdict ว่าง", `${empty}/${results.length}`, results.length)];
  const pass = first.filter((r) => r.verdict === "pass").length, [lo, hi] = wilson(pass, first.length);
  return [row("ผ่านรอบแรก", `${percent(pass / first.length)} (${pass}/${first.length}) · ช่วง Wilson 95% ${percent(lo)}–${percent(hi)}`, first.length),
    row("verdict ว่างในผลผู้ตรวจ", `${empty}/${results.length}`, results.length)];
}

function expectRows(runs, expects) {
  const sessions = [...Map.groupBy(runs, (r) => r.session)].filter(([, rs]) => rs.length >= 2).map(([s]) => s);
  const planned = sessions.filter((s) => expects.some((e) => e.session === s)).length;
  const segments = planSegments(runs, expects);
  const accuracy = workerRatios(segments), widths = widthRatios(segments);
  const inBand = widths.filter((x) => x >= 0.8 && x <= 1.2).length;
  return [
    sessions.length ? row("คาดก่อนแจก", `${percent(planned / sessions.length)} (${planned}/${sessions.length} session)`, sessions.length) : row("คาดก่อนแจก", "ไม่มี session ที่แจกตั้งแต่ 2 ตัว", 0),
    accuracy.length ? row("คาดแม่นแค่ไหน (ค่ากลางของ จริง ÷ คาด)", median(accuracy).toFixed(2), accuracy.length) : row("คาดแม่นแค่ไหน", expects.length ? missing("expect.workers") : NO_EXPECT, 0),
    widths.length ? row("ลูกทีม ÷ ความกว้าง (ค่ากลาง · อยู่ใน 0.8–1.2)", `${median(widths).toFixed(2)} · ${percent(inBand / widths.length)} (${inBand}/${widths.length})`, widths.length) : row("ลูกทีม ÷ ความกว้าง", "ยังไม่มีบรรทัด คาด: ที่มีกว้างสุด", 0),
  ];
}

export function distributionSection(runs, { expects = [], reviewResults = [] } = {}) {
  const head = ["", "## การแจกงาน", ""];
  if (!runs.length) return [...head, "ยังไม่มีงานลูกทีมให้นับ", ""];
  return [...head,
    "| ตัววัด | ค่าที่วัดได้ | n | ป้าย |",
    "|---|---|---|---|",
    ...modelRows(runs), effortRow(runs), ...widthRows(runs), briefRow(runs), ...reviewRows(reviewResults), ...expectRows(runs, expects),
    ""];
}
