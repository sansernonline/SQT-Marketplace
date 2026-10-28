import { num, list } from "./check.mjs";

// จัดลำดับงาน 3 แบบ: rice (ผลิตภัณฑ์ · บั๊ก) · wsjf (งานที่ช้าแล้วเสียของ) · eisenhower (งานส่วนตัว · อีเมล · ปฏิทิน)
const FORMULAS = {
  rice: { need: ["reach", "impact", "confidence", "effort"], calc: (x) => (x.reach * x.impact * x.confidence) / x.effort, text: "คนที่โดน × ผลกระทบ × ความมั่นใจ ÷ แรงงาน" },
  wsjf: { need: ["value", "time", "risk", "size"], calc: (x) => (x.value + x.time + x.risk) / x.size, text: "(คุณค่า + ความเร่งด่วนตามเวลา + ลดความเสี่ยง) ÷ ขนาดงาน" },
  eisenhower: { need: ["urgent", "important", "minutes"], calc: (x) => (x.urgent * x.important) / x.minutes, text: "ด่วน × สำคัญ ÷ นาทีที่ใช้ (ด่วนและสำคัญให้คะแนน 1–5)" },
};
const QUADRANT = (x) => (x.important >= 3 ? (x.urgent >= 3 ? "ทำเลย" : "นัดเวลาทำ") : (x.urgent >= 3 ? "ให้คนอื่นทำหรือทำสั้น ๆ" : "ตัดทิ้ง"));
const Q_ORDER = ["ทำเลย", "นัดเวลาทำ", "ให้คนอื่นทำหรือทำสั้น ๆ", "ตัดทิ้ง"];

// must_first: true = ข้อที่ทำให้ผลผิดหรือไม่ปลอดภัย ขึ้นก่อนเสมอไม่ว่าคะแนนเท่าไร (แบบเดียวกับ must ของ knapsack)
export function priority({ method, items }) {
  const f = FORMULAS[method];
  if (!f) throw new Error(`method ต้องเป็น ${Object.keys(FORMULAS).join(" · ")}`);
  for (const it of list(items, "items")) {
    if (typeof it !== "object") throw new Error(`items ต้องเป็นอ็อบเจกต์ (ได้ ${JSON.stringify(it)})`);
    for (const k of f.need) num(it[k], `${it.name}: ${k}`, { min: 0 });
    num(it[f.need.at(-1)], `${it.name}: ${f.need.at(-1)}`, { above: 0 });
    if (method === "rice" && it.confidence > 1) throw new Error(`${it.name}: confidence ใส่เป็นสัดส่วน 0–1 (80% = 0.8)`);
    if (method === "rice" && (it.impact < 0.25 || it.impact > 3)) throw new Error(`${it.name}: impact ต้องอยู่ในช่วง 0.25–3 (ได้ ${it.impact}) · ใช้ 3 มาก · 2 สูง · 1 กลาง · 0.5 ต่ำ · 0.25 น้อยมาก`);
    if (it.must_first !== undefined && typeof it.must_first !== "boolean") throw new Error(`${it.name}: must_first ใส่ true หรือ false (ได้ ${JSON.stringify(it.must_first)})`);
  }
  // ชื่อซ้ำยังคิดได้ แต่ตารางจะมี 2 แถวชื่อเดียวกันจนชี้ผิดตัว จึงเตือนให้แก้ชื่อ
  const names = items.map((it) => it.name);
  const warnings = [...new Set(names.filter((n, i) => names.indexOf(n) !== i))].map((n) => `ชื่อซ้ำ: ${n} · ตั้งชื่อให้ต่างกันแล้วรันใหม่`);
  const rows = items.map((it) => ({ ...it, score: f.calc(it), quadrant: method === "eisenhower" ? QUADRANT(it) : null }));
  rows.sort((a, b) => Boolean(b.must_first) - Boolean(a.must_first)
    || (method === "eisenhower" ? Q_ORDER.indexOf(a.quadrant) - Q_ORDER.indexOf(b.quadrant) : 0) || b.score - a.score);
  return { method, formula: f.text, need: f.need, rows, warnings };
}

export function renderPriority(r) {
  const q = r.method === "eisenhower";
  return [
    `| ลำดับ | งาน | ${r.need.join(" | ")} |${q ? " กลุ่ม |" : ""} คะแนน |`,
    "|---|---|" + r.need.map(() => "---|").join("") + (q ? "---|" : "") + "---|",
    ...r.rows.map((it, i) => `| ${i + 1} | ${it.name}${it.must_first ? " (ขึ้นก่อน)" : ""} | ${r.need.map((k) => it[k]).join(" | ")} |${q ? ` ${it.quadrant} |` : ""} ${+it.score.toFixed(2)} |`),
    "",
    `สูตร: ${r.formula}${q ? " · เรียงตามกลุ่มก่อน แล้วตามคะแนนในกลุ่ม · สำคัญหรือด่วนตั้งแต่ 3 ขึ้นไปนับว่าใช่" : ""}${r.rows.some((it) => it.must_first) ? " · ข้อ (ขึ้นก่อน) อยู่บนสุดโดยไม่ดูคะแนน" : ""}`,
    ...(r.warnings ?? []).map((w) => `คำเตือน: ${w}`),
  ].join("\n");
}
