// วาดแผนกราฟงานเป็นรูป: Mermaid (เปิดบน GitHub ได้) และ HTML ไฟล์เดียวที่มี SVG ของ DAG กับ Gantt · ไม่ใช้ library ภายนอก
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const n1 = (x) => (Number.isInteger(x) ? String(x) : x.toFixed(1));
const isCritical = (a, id) => a.cpm.get(id).float === 0;

// เส้นวิกฤต = ทั้ง 2 ปลายเผื่อได้ 0 และลูกเริ่มทันทีที่พ่อจบ
function criticalEdge(a, from, to) {
  const f = a.cpm.get(from), t = a.cpm.get(to), size = a.tasks.find((x) => x.id === from).size;
  return f.float === 0 && t.float === 0 && Math.abs(t.early - (f.early + size)) < 1e-9;
}

export function toMermaid(a) {
  const safe = (id) => `n_${String(id).replace(/[^\w]/g, "_")}`;
  const label = (t) => `${t.id}${t.title ? ` ${t.title}` : ""}<br/>${t.sizeLabel ? `${t.sizeLabel} ` : ""}${n1(t.size)}k · rank ${n1(a.rank.get(t.id))}`.replace(/"/g, "'");
  return [
    "```mermaid",
    "flowchart LR",
    ...a.tasks.map((t) => `  ${safe(t.id)}["${label(t)}"]`),
    ...a.tasks.flatMap((t) => t.needs.map((n) => `  ${safe(n)} ${criticalEdge(a, n, t.id) ? "==>" : "-->"} ${safe(t.id)}`)),
    "  classDef critical stroke-width:3px,stroke:#c2410c",
    ...a.tasks.filter((t) => isCritical(a, t.id)).map((t) => `  class ${safe(t.id)} critical`),
    "```",
  ].join("\n");
}

// ชั้นของแต่ละชิ้น: วางชิดชิ้นที่รอมันอยู่ (ชั้นสุดท้าย − ทอดที่ยาวที่สุดไปถึงชิ้นท้าย) ชิ้นนอกสายวิกฤตจึงไม่ไปกองซ้ายสุดแล้วลากเส้นยาวทับกล่องอื่น
function levels(a) {
  const depth = new Map(), height = new Map();
  const down = (id) => depth.get(id) ?? depth.set(id, Math.max(-1, ...a.tasks.find((t) => t.id === id).needs.map(down)) + 1).get(id);
  const up = (id) => height.get(id) ?? height.set(id, Math.max(-1, ...a.tasks.filter((t) => t.needs.includes(id)).map((t) => up(t.id))) + 1).get(id);
  a.tasks.forEach((t) => { down(t.id); up(t.id); });
  const last = Math.max(...depth.values());
  const alone = (t) => !t.needs.length && !a.tasks.some((x) => x.needs.includes(t.id));
  return new Map(a.tasks.map((t) => [t.id, alone(t) ? 0 : last - height.get(t.id)]));
}

function dagSvg(a) {
  const W = 190, H = 58, GX = 70, GY = 22, level = levels(a), cols = new Map();
  for (const t of a.tasks) (cols.get(level.get(t.id)) ?? cols.set(level.get(t.id), []).get(level.get(t.id))).push(t);
  const pos = new Map();
  for (const [lv, list] of cols) list.sort((x, y) => a.rank.get(y.id) - a.rank.get(x.id)).forEach((t, i) => pos.set(t.id, { x: 20 + lv * (W + GX), y: 20 + i * (H + GY) }));
  const width = 40 + cols.size * (W + GX) - GX, height = 40 + Math.max(...[...cols.values()].map((l) => l.length)) * (H + GY) - GY;
  const edges = a.tasks.flatMap((t) => t.needs.map((n) => {
    const p = pos.get(n), c = pos.get(t.id), x1 = p.x + W, y1 = p.y + H / 2, x2 = c.x, y2 = c.y + H / 2, mx = (x1 + x2) / 2;
    return `<path class="edge${criticalEdge(a, n, t.id) ? " crit" : ""}" d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2 - 6},${y2}" marker-end="url(#arrow)"/>`;
  }));
  const nodes = a.tasks.map((t) => {
    const { x, y } = pos.get(t.id), f = a.cpm.get(t.id).float;
    return `<g class="node${f === 0 ? " crit" : ""}${t.solo ? " solo" : ""}"><rect x="${x}" y="${y}" width="${W}" height="${H}" rx="8"/>`
      + `<text x="${x + 10}" y="${y + 22}" class="t">${esc(`${t.id}${t.title ? ` ${t.title}` : ""}`.slice(0, 26))}</text>`
      + `<text x="${x + 10}" y="${y + 42}" class="d">${esc(`${t.sizeLabel ? `${t.sizeLabel} ` : ""}${n1(t.size)}k · rank ${n1(a.rank.get(t.id))} · เผื่อ ${f ? n1(f) : "0"}${t.solo ? " · คนเดียว" : ""}`)}</text></g>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="${width}" role="img" aria-label="กราฟงาน"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="arrowhead"/></marker></defs>${edges.join("")}${nodes.join("")}</svg>`;
}

// แถว Gantt: { label, lane, start, end, crit } · หน่วยแกนตามที่ส่งมา (k token ของแผน หรือ นาทีของงานจริง)
function ganttSvg(rows, unit) {
  const LW = 230, BW = 640, RH = 30, end = Math.max(...rows.map((r) => r.end)), scale = BW / end;
  const ticks = Array.from({ length: 6 }, (_, i) => (end * i) / 5);
  const height = 40 + rows.length * RH;
  return `<svg viewBox="0 0 ${LW + BW + 40} ${height}" width="${LW + BW + 40}" role="img" aria-label="ไทม์ไลน์">`
    + ticks.map((v) => `<line class="tick" x1="${LW + v * scale}" y1="10" x2="${LW + v * scale}" y2="${height - 18}"/><text class="d" x="${LW + v * scale}" y="${height - 4}" text-anchor="middle">${n1(v)}${unit}</text>`).join("")
    + rows.map((r, i) => `<text class="t" x="8" y="${20 + i * RH + 18}">${esc(r.label.slice(0, 34))}</text><rect class="bar${r.crit ? " crit" : ""}" x="${LW + r.start * scale}" y="${20 + i * RH + 4}" width="${Math.max(2, (r.end - r.start) * scale)}" height="${RH - 10}" rx="4"/>`).join("")
    + "</svg>";
}

export function planRows(a) {
  const title = (t) => `${t.id}${t.title ? ` ${t.title}` : ""}`;
  return [...a.schedule].sort((x, y) => x.start - y.start || x.lane - y.lane)
    .map((r) => { const t = a.tasks.find((x) => x.id === r.id); return { label: `ลูกทีม ${r.lane} · ${title(t)}`, start: r.start, end: r.end, crit: isCritical(a, r.id) }; });
}

export function toHtml(plan, a, actual) {
  const css = `:root{--bg:#faf8f5;--fg:#1f2328;--muted:#5b6470;--line:#c9ced6;--box:#ffffff;--crit:#c2410c;--bar:#4f6db8}
@media (prefers-color-scheme:dark){:root{--bg:#16181c;--fg:#e8eaed;--muted:#9aa3ad;--line:#3a4049;--box:#1f2329;--crit:#f97316;--bar:#7b97e0}}
body{margin:0;padding:24px 16px;background:var(--bg);color:var(--fg);font:15px/1.6 "Sarabun","Noto Sans Thai","Leelawadee UI",system-ui,sans-serif}
h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:28px 0 8px}p{margin:4px 0;color:var(--muted)}.wrap{overflow-x:auto}
svg{display:block;max-width:none}.node rect{fill:var(--box);stroke:var(--line);stroke-width:1.5}.node.crit rect{stroke:var(--crit);stroke-width:3}.node.solo rect{stroke-dasharray:6 3}
.edge{fill:none;stroke:var(--line);stroke-width:1.5}.edge.crit{stroke:var(--crit);stroke-width:2.5}.arrowhead{fill:var(--muted)}
.t{fill:var(--fg);font-size:13px;font-weight:600}.d{fill:var(--muted);font-size:12px}.tick{stroke:var(--line);stroke-dasharray:2 4}
.bar{fill:var(--bar)}.bar.crit{fill:var(--crit)}`;
  return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(plan.name ?? "แผนกราฟงาน")}</title><style>${css}</style></head><body>
<h1>${esc(plan.name ?? "แผนกราฟงาน")}</h1>
<p>คาด: ลูกทีม ${a.team} · สายวิกฤต ${n1(a.cpLen)}k · กว้างสุด ${a.width} · เร็วขึ้น ${a.speedup.toFixed(1)} เท่า · สีส้ม = สายวิกฤต (เผื่อได้ 0) · กรอบเส้นประ = ทำคนเดียว</p>
<h2>กราฟงาน (DAG)</h2><div class="wrap">${dagSvg(a)}</div>
<h2>ไทม์ไลน์ตามแผน (หน่วย k token)</h2><div class="wrap">${ganttSvg(planRows(a), "k")}</div>
${actual?.rows.length ? `<h2>ไทม์ไลน์ที่เกิดจริง (นาทีจากชิ้นแรก)</h2><p>${esc(actual.summary)}</p><div class="wrap">${ganttSvg(actual.rows, "น.")}</div>` : ""}
</body></html>`;
}
