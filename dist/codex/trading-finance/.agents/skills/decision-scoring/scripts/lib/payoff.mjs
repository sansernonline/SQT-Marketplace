import { num, oneOf, list } from "./check.mjs";

// ผลไม่แน่นอน: ตารางผลลัพธ์ ตัวเลือก × สถานการณ์ → ค่าคาดหวัง (ถ้ารู้โอกาส) และ minimax regret (ถ้าไม่รู้หรือย้อนไม่ได้)
export function payoff({ options, scenarios, table, better = "high" }) {
  list(options, "options"); list(scenarios, "scenarios"); oneOf(better, ["high", "low"], "better");
  for (const o of options) {
    if (table?.[o]?.length !== scenarios.length) throw new Error(`table.${o} ต้องมี ${scenarios.length} ค่า ตามจำนวน scenarios`);
    table[o].forEach((v, j) => num(v, `table.${o}[${j}]`));
  }
  for (const x of scenarios) if (x.p !== undefined) num(x.p, `scenarios ${x.name}: p`, { min: 0 });
  const sign = better === "low" ? -1 : 1;
  const pSum = scenarios.reduce((s, x) => s + (x.p ?? 0), 0);
  const hasP = scenarios.every((x) => typeof x.p === "number") && Math.abs(pSum - 1) < 0.01;
  const best = scenarios.map((_, j) => Math.max(...options.map((o) => sign * table[o][j])));
  const rows = options.map((o) => {
    const regret = scenarios.map((_, j) => best[j] - sign * table[o][j]);
    return {
      name: o,
      ev: hasP ? scenarios.reduce((s, x, j) => s + x.p * table[o][j], 0) : null,
      worst: sign > 0 ? Math.min(...table[o]) : Math.max(...table[o]),
      maxRegret: Math.max(...regret),
      regret,
    };
  });
  const pick = (key, dir) => [...rows].sort((a, b) => dir * (a[key] - b[key]))[0].name;
  return {
    rows, hasP, pSum,
    evBest: hasP ? pick("ev", -sign) : null,
    regretBest: pick("maxRegret", 1),
    worstBest: pick("worst", -sign),
  };
}

export function renderPayoff(r, { scenarios, table, better = "high" }) {
  const f = (x) => (Math.abs(x) >= 1000 ? Math.round(x).toLocaleString("en-US") : +x.toFixed(2));
  const lines = [
    `| ตัวเลือก | ${scenarios.map((s) => `${s.name}${typeof s.p === "number" ? ` (โอกาส ${s.p})` : ""}`).join(" | ")} | ค่าคาดหวัง | แย่สุด | เสียดายมากสุด |`,
    "|---|" + scenarios.map(() => "---|").join("") + "---|---|---|",
    ...r.rows.map((o) => `| ${o.name} | ${table[o.name].map(f).join(" | ")} | ${o.ev === null ? "—" : f(o.ev)} | ${f(o.worst)} | ${f(o.maxRegret)} |`),
    "",
    `ค่าในตาราง: ${better === "low" ? "ยิ่งน้อยยิ่งดี (เช่น ต้นทุน)" : "ยิ่งมากยิ่งดี (เช่น เงินที่ได้)"} · เสียดาย = ห่างจากตัวเลือกที่ดีที่สุดของสถานการณ์นั้นเท่าไร`,
  ];
  if (!r.hasP) lines.push(`ไม่มีค่าคาดหวัง เพราะโอกาสไม่ครบทุกสถานการณ์หรือรวมไม่เป็น 1 (รวม ${+r.pSum.toFixed(2)})`);
  const agree = !r.hasP || r.evBest === r.regretBest;
  lines.push("", agree
    ? `**ผล:** ${r.regretBest}${r.hasP ? " ดีสุดทั้งค่าคาดหวังและเสียดายน้อยสุด" : " เสียดายน้อยสุดเมื่อไม่รู้โอกาส"}`
    : `**ผล: 2 เกณฑ์ไม่ตรงกัน** ค่าคาดหวังเลือก ${r.evBest} · เสียดายน้อยสุดเลือก ${r.regretBest} · ย้อนกลับได้และทำซ้ำบ่อย ใช้ค่าคาดหวัง · ย้อนไม่ได้หรือโอกาสเป็นแค่การเดา ใช้เสียดายน้อยสุด`);
  return lines.join("\n");
}
