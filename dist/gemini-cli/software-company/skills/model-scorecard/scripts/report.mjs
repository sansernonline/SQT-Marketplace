import { collectProject } from "./collect.mjs";
import { chooseSections } from "./choose.mjs";

// รายการงานลูกทีม (จาก collect.mjs) → ตาราง model × ขั้น + ข้อสังเกต 3 ข้อ (markdown)
const STEP_ORDER = ["plan", "research", "design", "write", "code", "test", "review", "other"];
const THIN = 5;
const TOKEN_KEYS = ["input", "output", "cacheRead", "cacheCreate"];
const PER_MTOK = { input: "input", output: "output", cacheRead: "cache_read", cacheCreate: "cache_write" };

export const modelLabel = (r) => (r.model === "inherit" ? `inherit (${r.lead_model ?? "ไม่ทราบ"})` : r.model);

// ราคาไม่ระบุ (ศูนย์ทุกช่อง) = ยังไม่มีราคา · ชื่อสั้นอย่าง sonnet จับคู่กับ id ที่มีคำนั้น
export function priceFor(label, prices) {
  const table = prices?.per_mtok ?? {};
  const id = (label.match(/\(([^)]+)\)/)?.[1] ?? label).toLowerCase();
  const key = Object.keys(table).find((k) => k.toLowerCase() === id) ?? Object.keys(table).find((k) => k.toLowerCase().includes(id) || id.includes(k.toLowerCase()));
  const p = key && table[key];
  return p && Object.values(p).some((v) => v > 0) ? p : null;
}

export const costOf = (tokens, price) => TOKEN_KEYS.reduce((s, k) => s + (tokens[k] ?? 0) * (price[PER_MTOK[k]] ?? 0), 0) / 1e6;

function newCell(model, step) {
  return { model, step, n: 0, tok: { n: 0, input: 0, output: 0, cacheRead: 0, cacheCreate: 0, estimated: false }, cost: { n: 0, sum: 0 },
    time: { n: 0, sum: 0 }, review: { n: 0, firstPass: 0, fixes: 0 }, accept: 0, reject: 0 };
}

function addRun(cell, run, price) {
  cell.n++;
  if (run.tokens) {
    cell.tok.n++; cell.tok.estimated ||= Boolean(run.tokensEstimated);
    for (const k of TOKEN_KEYS) cell.tok[k] += run.tokens[k] ?? 0;
    if (price) { cell.cost.n++; cell.cost.sum += costOf(run.tokens, price); }
  }
  if (run.duration_ms > 0) { cell.time.n++; cell.time.sum += run.duration_ms; }
  if (run.reviews.length) {
    cell.review.n++; cell.review.firstPass += run.reviews[0] === "pass" ? 1 : 0;
    cell.review.fixes += run.reviews.filter((v) => v !== "pass").length;
  }
  cell.accept += run.feedback.filter((f) => f === "accept").length;
  cell.reject += run.feedback.filter((f) => f === "reject").length;
}

export function aggregate(runs, prices) {
  const cells = new Map();
  for (const run of runs) {
    const model = modelLabel(run), key = `${model}|${run.step}`;
    if (!cells.has(key)) cells.set(key, newCell(model, run.step));
    addRun(cells.get(key), run, priceFor(model, prices));
  }
  return [...cells.values()].sort((a, b) => STEP_ORDER.indexOf(a.step) - STEP_ORDER.indexOf(b.step) || b.n - a.n);
}

export const costPerRun = (c) => (c.cost.n ? c.cost.sum / c.cost.n : null);
const firstPassRate = (c) => (c.review.n ? c.review.firstPass / c.review.n : null);
const score = (c) => (costPerRun(c) && firstPassRate(c) != null ? firstPassRate(c) / costPerRun(c) : null);

function compact(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  return n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(Math.round(n));
}

const tokenText = (t, div = 1) => (t.n ? `${compact(t.input / div)}/${compact(t.output / div)}/${compact((t.cacheRead + t.cacheCreate) / div)}${t.estimated ? " ~" : ""}` : "—");
const percent = (x) => (x == null ? "—" : `${Math.round(x * 100)}%`);
const duration = (t) => (t.n ? (t.sum / t.n >= 90000 ? `${(t.sum / t.n / 60000).toFixed(1)} นาที` : `${Math.round(t.sum / t.n / 1000)} วินาที`) : "—");
const money = (x) => (x == null ? "ยังไม่มีราคา" : `$${x < 10 ? x.toFixed(2) : x.toFixed(0)}`);

function thinMetrics(c) {
  const counts = { งาน: c.n, token: c.tok.n, เวลา: c.time.n, ผลตรวจ: c.review.n };
  const thin = Object.entries(counts).filter(([k, v]) => v < THIN && (k === "งาน" || v > 0)).map(([k]) => k);
  return thin.length ? `ตัวอย่างน้อย: ${thin.join(" ")}` : "";
}

function row(c) {
  const fixes = c.review.n ? (c.review.fixes / c.review.n).toFixed(1) : "—";
  const s = score(c);
  return `| ${c.model} | ${c.step} | ${c.n} | ${tokenText(c.tok)} | ${tokenText(c.tok, c.tok.n || 1)} | ${money(c.cost.n ? c.cost.sum : null)} | ${duration(c.time)} | ${c.review.n ? `${percent(firstPassRate(c))} (${c.review.firstPass}/${c.review.n})` : "—"} | ${fixes} | ${c.accept}/${c.reject} | ${s == null ? "—" : s.toFixed(2)} | ${c.n}/${c.tok.n}/${c.time.n}/${c.review.n} | ${thinMetrics(c)} |`;
}

const ratio = (hi, lo) => `${(hi / lo).toFixed(1)} เท่า`;

function modelGap(cells) {
  const bySt = Map.groupBy(cells, (c) => c.step);
  const options = [...bySt].filter(([, cs]) => cs.length > 1).map(([step, cs]) => ({ step, cs, n: cs.reduce((s, c) => s + c.n, 0) })).sort((a, b) => b.n - a.n);
  if (!options.length) return "ยังไม่มีขั้นที่ใช้มากกว่า 1 model จึงยังเทียบข้ามกันไม่ได้";
  const { step, cs } = options[0];
  const priced = cs.filter((c) => costPerRun(c) != null);
  const [metric, unit, pool] = priced.length > 1 ? [costPerRun, "ค่าใช้จ่าย", priced] : [(c) => (c.tok.n ? c.tok.output / c.tok.n : null), "token ออก", cs.filter((c) => c.tok.n)];
  const sorted = pool.filter((c) => metric(c) > 0).sort((a, b) => metric(b) - metric(a));
  if (sorted.length < 2) return `ขั้น ${step} มีหลาย model แต่ข้อมูล token ยังไม่พอเทียบ`;
  const [hi, lo] = [sorted[0], sorted.at(-1)];
  return `ขั้น ${step}: ${hi.model} ${unit}ต่องานสูงกว่า ${lo.model} ${ratio(metric(hi), metric(lo))} (${hi.n} งาน เทียบ ${lo.n} งาน) · ผ่านรอบแรก ${percent(firstPassRate(hi))} เทียบ ${percent(firstPassRate(lo))}${Math.min(hi.n, lo.n) < THIN ? " · ตัวอย่างน้อย" : ""}`;
}

function heaviestStep(cells) {
  const total = (c) => TOKEN_KEYS.reduce((s, k) => s + c.tok[k], 0);
  const bySt = new Map();
  for (const c of cells) bySt.set(c.step, (bySt.get(c.step) ?? 0) + total(c));
  const all = [...bySt.values()].reduce((s, x) => s + x, 0);
  const [step, sum] = [...bySt].sort((a, b) => b[1] - a[1])[0] ?? [];
  if (!all) return "ยังไม่มีข้อมูล token ต่องาน";
  const top = cells.filter((c) => c.step === step).sort((a, b) => total(b) - total(a))[0];
  return `ขั้น ${step} ใช้ token ${percent(sum / all)} ของทั้งหมด (${compact(sum)} จาก ${compact(all)}) · model หลักของขั้นนี้ ${top.model}`;
}

function resultCoverage(cells) {
  const n = cells.reduce((s, c) => s + c.n, 0), reviewed = cells.reduce((s, c) => s + c.review.n, 0);
  const accept = cells.reduce((s, c) => s + c.accept, 0), reject = cells.reduce((s, c) => s + c.reject, 0);
  const worst = cells.filter((c) => c.reject).sort((a, b) => b.reject - a.reject)[0];
  return `มีผลผู้ตรวจผูกกับงาน ${reviewed} จาก ${n} งาน (${percent(n ? reviewed / n : null)}) · ผู้ใช้รับ ${accept} ปฏิเสธ ${reject}${worst ? ` · ปฏิเสธมากสุดที่ ${worst.model} ขั้น ${worst.step} (${worst.reject})` : ""}${reviewed < THIN ? " · ตัวอย่างน้อย" : ""}`;
}

export function observations(cells) {
  return [modelGap(cells), heaviestStep(cells), resultCoverage(cells)];
}

// ขนาดจริงของงาน: token รวมจากข้อความงานเบื้องหลังจบ หรือผลรวม token ที่จดตรง (ไม่ใช้ค่าที่หารเฉลี่ย)
export const actualTokens = (r) => r.total_tokens ?? (r.tokens && !r.tokensEstimated ? TOKEN_KEYS.reduce((s, k) => s + (r.tokens[k] ?? 0), 0) : null);

// ค่าปรับขนาดต่อขั้น k ← 0.6k + 0.4 × (จริง ÷ ประเมิน) เรียงตามเวลา (สูตรจาก lab Multi_Agent_Orchestra ของคอร์ส CWN2026)
export function sizeFactors(runs) {
  const byStep = new Map();
  for (const r of [...runs].sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts))) {
    const real = actualTokens(r);
    if (!(r.estimate_tokens > 0) || !(real > 0)) continue;
    const s = byStep.get(r.step) ?? { step: r.step, n: 0, k: 1 };
    s.n++; s.k = 0.6 * s.k + 0.4 * (real / r.estimate_tokens);
    byStep.set(r.step, s);
  }
  return [...byStep.values()].sort((a, b) => STEP_ORDER.indexOf(a.step) - STEP_ORDER.indexOf(b.step));
}

function sizeSection(runs) {
  const rows = sizeFactors(runs);
  const head = ["", "## ขนาดจริงต่อที่ประเมิน", ""];
  if (!rows.length) return [...head, "ยังไม่มีงานที่ใบสั่งงานมีบรรทัด `ขนาด: <N>k` และมี token จริง", ""];
  return [...head,
    "| ขั้น | งานที่เทียบได้ | จริงต่อประเมิน (k) | ใช้อย่างไร | ป้าย |",
    "|---|---|---|---|---|",
    ...rows.map((s) => `| ${s.step} | ${s.n} | ${s.k.toFixed(2)} | ประเมินชิ้นขั้นนี้ครั้งหน้า × ${s.k.toFixed(2)} | ${s.n < THIN ? "ตัวอย่างน้อย" : ""} |`),
    ""];
}

export function render(runs, prices, meta) {
  const cells = aggregate(runs, prices);
  const unpriced = !prices?.per_mtok || !Object.values(prices.per_mtok).some((p) => Object.values(p).some((v) => v > 0));
  const head = [
    "# รายงานเทียบ model รายขั้น",
    "",
    `> สร้างจาก log ${meta.sources.length} แหล่ง · ${runs.length} งานลูกทีม · อ่านอย่างเดียว ไม่เขียนกลับไปที่ log ที่อ่าน`,
    ...meta.sources.map((s) => `> - ${s.name}: ${s.days} วัน (${s.rough} วันไม่มี runs.jsonl จึงใช้ main.jsonl + tokens.json แบบหยาบ ไม่มีข้อมูลผล)`),
    `> ราคา: ${unpriced ? "ยังไม่มีราคา (references/prices.json ว่าง)" : `${prices.source || "ไม่ระบุแหล่ง"} · ตรวจ ${prices.checked}`}`,
    "",
  ];
  if (!runs.length) return [...head, "ยังไม่มีงานลูกทีมใน log ที่อ่าน", ""].join("\n");
  const table = [
    "| model | ขั้น | งาน | token รวม ใน/ออก/แคช | token ต่องาน ใน/ออก/แคช | ค่าใช้จ่ายรวม~ | เวลาเฉลี่ย | ผ่านรอบแรก | รอบแก้เฉลี่ย | ผู้ใช้ รับ/ปฏิเสธ | คะแนนความคุ้ม | ตัวอย่าง งาน/token/เวลา/ผลตรวจ | ป้าย |",
    "|---|---|---|---|---|---|---|---|---|---|---|---|---|",
    ...cells.map(row),
  ];
  const notes = [
    "",
    "## วิธีอ่าน",
    "",
    "- **คะแนนความคุ้ม** = สัดส่วนที่ผ่านผู้ตรวจรอบแรก ÷ ค่าใช้จ่ายเฉลี่ยต่องาน (ดอลลาร์) · ยิ่งสูงยิ่งคุ้ม · ไม่มีราคาหรือไม่มีผลตรวจ = —",
    "- **ผ่านรอบแรก** และ **รอบแก้** นับต่องานของขั้นนั้น โดยผูกผลผู้ตรวจกับงานล่าสุดก่อนหน้าใน session เดียวกัน (ประมาณ ไม่ใช่ข้อมูลที่ log จดตรง ๆ) · ขั้น review เองไม่มีผลตรวจของตัวเอง",
    "- **ผู้ใช้ รับ/ปฏิเสธ** อนุมานจากคำในข้อความผู้ใช้ผูกกับงานล่าสุดก่อนข้อความนั้น ใช้เป็นสัญญาณ ไม่ใช่คะแนน",
    "- **token ~** = ประมาณ: หารยอดของ agent ชนิดนั้นในวันเท่า ๆ กันให้ทุกงาน · **ค่าใช้จ่าย~** = token × ราคาต่อล้านใน references/prices.json · **inherit (X)** = ไม่ได้ระบุ model ตอนสั่ง ใช้ตามหัวหน้าทีม",
    "- ช่อง token แสดง ใน/ออก/แคช (แคช = อ่าน + เขียน) · ตัวอย่างน้อยกว่า 5 ติดป้าย อย่าใช้ตัดสินใจ",
    "",
    "## ข้อสังเกต",
    "",
    ...observations(cells).map((o, i) => `${i + 1}. ${o}`),
    ...sizeSection(runs),
    ...chooseSections(runs, cells, prices),
  ];
  return [...head, ...table, ...notes].join("\n");
}

export function buildReport(logDirs, prices) {
  const parts = logDirs.map(([name, dir]) => ({ name, ...collectProject(dir, name) }));
  const sources = parts.map((p) => ({ name: p.name, days: p.days.length, rough: p.days.filter((d) => d.rough).length }));
  return render(parts.flatMap((p) => p.runs), prices, { sources });
}
