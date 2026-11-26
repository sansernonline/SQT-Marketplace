import { num, list } from "./check.mjs";

// ตรวจอีกรอบคุ้มไหม (marginal value): ค่าของข้อที่คาดว่ารอบหน้าจะเจอ เทียบกับราคาของ 1 รอบ
// ข้อสูงยังเหลือ = ต้องตรวจซ้ำเสมอ (กฎเหล็ก) · เพดานรอบเป็นกฎเหล็กเหมือนเดิม · ค่าตั้งต้น ข้อสูง 3 · ข้อกลาง 1 · ราคารอบ 2 (หน่วยเดียวกับข้อกลาง)
const DEFAULTS = { value: { high: 3, medium: 1 }, round_cost: 2, first_decay: 0.5 };

export function review({ rounds, cap, value: given = {}, round_cost = DEFAULTS.round_cost }) {
  const value = { ...DEFAULTS.value, ...given };
  list(rounds, "rounds"); num(cap, "cap", { above: 0 }); num(round_cost, "round_cost", { above: 0 });
  num(value.high, "value.high", { min: 0 }); num(value.medium, "value.medium", { min: 0 });
  rounds.forEach((r, i) => { num(r.high ?? 0, `rounds[${i}].high`, { min: 0 }); num(r.medium ?? 0, `rounds[${i}].medium`, { min: 0 }); });
  const v = rounds.map((r) => (r.high ?? 0) * value.high + (r.medium ?? 0) * value.medium);
  const last = rounds.at(-1), n = rounds.length, now = v.at(-1);
  const decay = n >= 2 ? (v[n - 2] > 0 ? now / v[n - 2] : 0) : DEFAULTS.first_decay;
  const expectNext = now * decay;
  const base = { values: v, decay, expectNext, round_cost };
  if (!(last.high ?? 0) && !(last.medium ?? 0)) return { ...base, action: "pass", why: "ไม่เหลือข้อสูงและกลาง" };
  if (n >= cap) return { ...base, action: "stuck", why: `ครบเพดาน ${cap} รอบแล้ว` };
  // ตรงกับกฎ "หยุดก่อนเพดานเมื่อไม่คืบ" ใน team-roles: 2 รอบติดกันแล้วค่าของข้อที่พบไม่ลดลง
  if (n >= 2 && now >= v[n - 2]) return { ...base, action: "stuck", why: `ค่าของข้อที่พบไม่ลดลง (${v[n - 2]} → ${now}) วิธีเดิมไม่คืบ` };
  if (last.high) return { ...base, action: "again", why: `ยังมีข้อสูง ${last.high} ข้อ ต้องให้ผู้ตรวจตัวใหม่ดูการแก้` };
  if (expectNext < round_cost) return { ...base, action: "fix-and-close", why: `เหลือแต่ข้อกลาง และค่าที่คาดว่ารอบหน้าจะเจอ ${+expectNext.toFixed(2)} ต่ำกว่าราคารอบ ${round_cost}` };
  return { ...base, action: "again", why: `ค่าที่คาดว่ารอบหน้าจะเจอ ${+expectNext.toFixed(2)} ยังคุ้มราคารอบ ${round_cost}` };
}

const ACTION = {
  pass: "ผ่าน ปิดงานได้",
  again: "ตรวจอีกรอบด้วยผู้ตรวจตัวใหม่",
  "fix-and-close": "แก้ข้อกลางที่เหลือ แล้วให้ผู้ตรวจตัวใหม่ระดับเล็กดูแค่ diff ของการแก้ (ไม่ตรวจทั้งงานซ้ำ) ผ่านแล้วปิดงาน",
  stuck: "หยุดวน ติดป้าย `ติด` รายงานข้อที่เหลือและทางเลือกให้ผู้ใช้",
};

export function renderReview(r, { rounds }) {
  return [
    "| รอบ | ข้อสูง | ข้อกลาง | ค่าของข้อที่พบ |", "|---|---|---|---|",
    ...rounds.map((x, i) => `| ${i + 1} | ${x.high ?? 0} | ${x.medium ?? 0} | ${r.values[i]} |`),
    "",
    `อัตราลดต่อรอบ ${+r.decay.toFixed(2)} · คาดว่ารอบหน้าจะเจอค่า ${+r.expectNext.toFixed(2)} · ราคา 1 รอบ ${r.round_cost}`,
    "",
    `**ผล:** ${ACTION[r.action]} · ${r.why}`,
  ].join("\n");
}
