// Cover generator, round 2 final (base Z, SwipeOS grid from Y, series line from X): cover.html?p=<project>&d=<BRD|SRS|ARCH>&t=<theme>&layer=<all|bg>
// Evolves the round-1 winner with the "Concrete adaptations" in examples/EXAMPLES.md (see ADAPTED.md).
// Every mark is a logo primitive, the real logo, a real mockup screen, or real product data (truth test).
// .live  = editable Word text (hidden in layer=bg) · .fixed = text baked into the background (ribbon, badge).
// data-bg on a block = the flat colour it sits on (plates: pill, band, badge); checks and calibration use it.
const NS = "http://www.w3.org/2000/svg";
const W = 1240, H = 1754, M = 96, CW = W - 2 * M;   // A4 at 150 dpi, 96 px (16 mm) margin on all sides
const q = new URLSearchParams(location.search);
const pid = q.get("p") || "litenet";
const D = (q.get("d") || "SRS").toUpperCase();
const P = PROJECTS[pid];
const T = q.get("t") || P.defaultTheme;
const C = P.themes[T];
const doc = P.docs[D];
const page = document.getElementById("page");
const svg = document.getElementById("art");
if (q.get("layer") === "bg") document.body.classList.add("bg");
page.style.background = C.bg;
const artRects = [];                                 // where art ink is; no text may touch these
const addArt = (x, y, w, h) => artRects.push({ x, y, w, h });

// real logo geometry (unit space of each logo file)
const GEO = {
  litenetCream: "M4 4H18V46H60V60H4Z",
  litenetLime: "M24 4H60V40H46V18H24Z",
  swipeArrow: "M11.909 6.091 17.818 12l-5.909 5.909a2.25 2.25 0 0 0 3.182 3.182l7.5-7.5a2.25 2.25 0 0 0 0-3.182l-7.5-7.5a2.25 2.25 0 0 0-3.182 3.182Z",
  swipeDots: [[2.25, 12, 1.5], [8.5, 12, 2.25]]
};

function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  (parent || svg).appendChild(e);
  return e;
}
function txt(cls, html, style, bg) {
  const d = document.createElement("div");
  d.className = "t " + cls;
  d.innerHTML = html;
  Object.assign(d.style, style);
  if (bg) d.dataset.bg = bg;
  page.appendChild(d);
  return d;
}
const ctx2d = document.createElement("canvas").getContext("2d");
function textW(font, s) { ctx2d.font = font; return ctx2d.measureText(s).width; }
function snapInk(t) {   // put the first glyph's ink (not its side bearing) on x
  ctx2d.font = `${t.getAttribute("font-weight")} ${t.getAttribute("font-size")}px '${t.getAttribute("font-family")}'`;
  t.setAttribute("x", +t.getAttribute("x") + ctx2d.measureText(t.textContent[0]).actualBoundingBoxLeft);
}
const hair = { fill: "none", stroke: C.line, "stroke-width": 2, "vector-effect": "non-scaling-stroke" };
const isThai = s => /[฀-๿]/.test(s);
const bottom = e => e.getBoundingClientRect().bottom;

// ---------- shared blocks ----------
function logo(x, y, h, w) {   // the real logo file; drawn into the background PNG, not Word text
  const img = document.createElement("img");
  img.src = C.logo; img.className = "t logo";
  if (h) img.style.height = h + "px"; if (w) img.style.width = w + "px";
  img.style.top = y + "px"; img.style.left = x + "px";
  page.appendChild(img);
}
function metaRow(rule) {   // doc id + date (+ screen): version and status moved to their own object
  const top = rule + 24, colW = CW / 3;   // fixed column grid, whatever the number of fields
  el("rect", { x: M, y: rule, width: CW, height: 2, fill: C.line });
  let last;
  P.meta.forEach(([lab, val], i) => {
    const thai = isThai(lab);
    txt("live", lab, { left: M + i * colW + "px", top: top + "px", color: C.muted,
      font: thai ? `400 20px/1.5 ${P.fonts.title}` : `500 18px/1.5 ${P.fonts.mono}`, letterSpacing: thai ? "0" : "0.08em" });
    last = txt("live", val(D, doc), { left: M + i * colW + "px", top: top + 32 + "px", color: C.ink,
      font: `500 26px/1.4 ${P.fonts.mono}` });
  });
  return bottom(last);
}
function pill(x, y, label, font, fill, ink, right) {   // version as its own object (TDO 2025 pill tag)
  const t = txt("live", label, { left: x + "px", top: y + "px", color: ink, font }, fill);
  const r = t.getBoundingClientRect(), px = 22, py = 6;
  if (right) t.style.left = x - r.width + "px";
  const left = right ? x - r.width : x;
  el("rect", { x: left - px, y: y - py, width: r.width + 2 * px, height: r.height + 2 * py, rx: (r.height + 2 * py) / 2, fill });
  t.dataset.plate = [left - px, y - py, r.width + 2 * px, r.height + 2 * py].join(",");
  return t;
}

function seriesLine(x, y, color, idColor, bg, right) {   // X: NIST series line above the title, doc id in mono
  const t = txt("live", `${P.series} · <span style="font:500 26px/1.4 ${P.fonts.mono.replace(/"/g, "'")};color:${idColor}">${P.code}-${D}</span>`,
    { left: x + "px", top: y + "px", color, font: `400 26px/1.4 ${P.fonts.latin}` }, bg);
  if (right) t.style.left = x - t.getBoundingClientRect().width + "px";
  return t;
}

// ---------- LiteNet: Stripe Press "Working in Public" field of logo tiles, Thai title largest ----------
const LN_ORDER = [[0, 3], [1, 0], [2, 2], [0, 1], [1, 4], [2, 0], [1, 2], [3, 3], [0, 4], [2, 4], [3, 1]];   // fixed join order
const LN_POLY = {   // the same two logo paths as point lists, for the extrusion
  cream: [[4, 4], [18, 4], [18, 46], [60, 46], [60, 60], [4, 60]],
  lime: [[24, 4], [60, 4], [60, 40], [46, 40], [46, 18], [24, 18]]
};
function sweep(t, pts, d, fill) {   // exact flat extrusion: the face moved by (d,d) plus one quad per edge
  const pt = ([x, y]) => `${x},${y}`;
  el("polygon", { points: pts.map(([x, y]) => pt([x + d, y + d])).join(" "), fill }, t);
  pts.forEach((p, i) => { const n = pts[(i + 1) % pts.length];
    el("polygon", { points: [p, n, [n[0] + d, n[1] + d], [p[0] + d, p[1] + d]].map(pt).join(" "), fill,
      stroke: fill, "stroke-width": 0.3, "stroke-linejoin": "round" }, t); });
}
function tileSolid(g, s, x, y, F) {   // flat extrusion down-right in the side colour, then the face
  const t = el("g", { transform: `translate(${x},${y}) scale(${s})` }, g);
  sweep(t, LN_POLY.cream, 7, F.sideA);
  sweep(t, LN_POLY.lime, 7, F.sideB);
  el("path", { d: GEO.litenetCream, fill: F.a }, t);
  el("path", { d: GEO.litenetLime, fill: F.b }, t);
}
function tileHair(g, s, x, y, F) {   // not yet joined: outlines, lime L pulled apart
  const t = el("g", { transform: `translate(${x},${y}) scale(${s})` }, g);
  const h = Object.assign({}, hair, { stroke: F.line });
  el("path", Object.assign({ d: GEO.litenetCream }, h), t);
  el("path", Object.assign({ d: GEO.litenetLime, transform: "translate(3,-3)" }, h), t);
}
function pageTile() {
  // text first (top), the field takes everything below it and runs off left, right and bottom
  logo(M, M, 0, 232);
  const code = txt("live", D, { left: 0, top: M - 26 + "px", color: C.ink, font: `500 84px/1.2 ${P.fonts.mono}`, letterSpacing: "0.04em" });
  code.style.left = W - M - code.getBoundingClientRect().width + "px";
  pill(W - M, M + 104, P.tag(doc.ver), `700 26px/1.4 ${P.fonts.title}`, C.b, C.pillInk, true);
  seriesLine(M, 292, C.muted, C.b);
  const title = txt("live", doc.th.join("<br>"), { left: M + "px", top: "346px", color: C.ink, font: `700 100px/1.32 ${P.fonts.title}` });
  const en = txt("live", doc.en, { left: M + "px", top: bottom(title) + 14 + "px", color: C.muted, font: `400 30px/1.4 ${P.fonts.latin}` });
  const pr = txt("live", P.promise, { left: M + "px", top: bottom(en) + 10 + "px", color: C.ink2, font: `400 30px/1.5 ${P.fonts.title}` });
  const metaEnd = metaRow(bottom(pr) + 44);
  // the field: 300 px cells, offset so tiles are cut by the left and right edges and run off the bottom
  const top = Math.round(metaEnd + 72), cell = 300, s = cell / 64, x0 = -110;
  const F = P.fields[C.field || P.fieldOf[D]];   // field colour = doc family (brand tokens only)
  el("rect", { x: 0, y: top - 30, width: W, height: H - top + 30, fill: F.bg });
  const g = el("g", {});
  const n = P.joined[D];
  const joined = new Set(LN_ORDER.slice(0, n).map(([r, c]) => r + ":" + c));
  for (let r = 0; r * cell + top < H; r++) for (let c = 0; c < 5; c++) {
    const x = x0 + c * cell, y = top + r * cell;
    (joined.has(r + ":" + c) ? tileSolid : tileHair)(g, s, x, y, F);
  }
  addArt(0, top - 30, W, H - top + 30);
}

// ---------- Telex: real screen crop overlapping an O'Reilly-style title band, corner ribbon ----------
function pageShot() {
  const B = P.bands[doc.band];
  const band = [1100, 1490], cropL = 500, cropT = 320, cropB = 1140;   // the screen runs 40 px into the band
  el("rect", { x: 0, y: band[0], width: W, height: band[1] - band[0], fill: B.band });
  const [sc, sx, sy] = doc.crop;
  const box = document.createElement("div");
  Object.assign(box.style, { position: "absolute", left: cropL + "px", top: cropT + "px", width: W - cropL + "px",
    height: cropB - cropT + "px", overflow: "hidden", background: "#1B1B1B" });
  const img = document.createElement("img");
  img.src = `../../build/shots/telex-${doc.screen}.png`;
  Object.assign(img.style, { position: "absolute", left: -sx * sc + "px", top: -sy * sc + "px", width: 1440 * sc + "px" });
  box.appendChild(img); page.appendChild(box);
  addArt(cropL, cropT, W - cropL, cropB - cropT);
  // edition flag (O'Reilly ribbon idea) as a tab hanging from the top edge: the shape is art, the text is live Word
  // text, because a Word frame cannot turn text 45 degrees. Version + status as one object, nowhere else.
  const tab = txt("live", P.tag(doc.ver), { left: 0, top: M + 10 + "px", color: C.bg, font: `500 26px/1.4 ${P.fonts.mono}`,
    letterSpacing: "0.06em" }, C.ink);
  const tr = tab.getBoundingClientRect(), padX = 30;
  tab.style.left = W - M - padX - tr.width + "px";
  const L = W - M - 2 * padX - tr.width, R = W - M, Bt = M + 10 + tr.height + 40;   // swallowtail tab
  el("path", { d: `M${L},0 H${R} V${Bt} L${(L + R) / 2},${Bt - 22} L${L},${Bt} Z`, fill: C.ink });
  logo(M, M, 0, 300);
  txt("live", P.product, { left: M + "px", top: "212px", color: C.accent, font: `500 22px/1.5 ${P.fonts.mono}` });
  // giant doc code, one letter per line, stacked up from the band (reads at thumbnail size)
  const F = 243, pitch = 190, floor = band[0] - 34;
  const g = el("g", {});
  [...D].forEach((ch, i, arr) => {
    const t = el("text", { x: M, y: floor - (arr.length - 1 - i) * pitch, fill: C.ink, "font-family": "Space Grotesk",
      "font-weight": 600, "font-size": F }, g);
    t.textContent = ch; snapInk(t);
  });
  addArt(M, floor - (D.length - 1) * pitch - 185, 300, (D.length - 1) * pitch + 190);
  seriesLine(M, 1150, B.onBand2, B.onBand, B.band);
  const title = txt("live", doc.en.join("<br>") + `<span style="color:${B.cursor}">_</span>`, { left: M + "px", top: "1206px",
    color: B.onBand, font: `600 88px/1.05 ${P.fonts.title}`, letterSpacing: "-0.02em" }, B.band);
  txt("live", P.promise, { left: M + "px", top: bottom(title) + 22 + "px", color: B.onBand2,
    font: `400 30px/1.5 ${P.fonts.latin}` }, B.band);
  metaRow(1548);
}

// ---------- SwipeOS: Y's gesture pictogram grid (Inclusive toolkit + A Book Apart), drawn from the real hand ----------
// The 12 gestures G01-G12 are the product's gesture set (docs/DATA-DICTIONARY.md 2.7). Each pictogram is posed from the
// mockup's 21 MediaPipe landmarks: same topology, same bone lengths; fingers bend at their 3 joints, the thumb by
// 2-bone reach. Hold poses are turned about 30 degrees so curled fingers read as hooks, not collapsed stubs.
const HB = (P.hand || []).map(([x, y]) => [x - 290, y - 160, 0]);          // wrist at the origin; -z = toward the viewer
const FINGERS = [[5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20]];
const vsub = (a, b) => a.map((v, i) => v - b[i]), vadd = (a, b) => a.map((v, i) => v + b[i]);
const vmul = (a, s) => a.map(v => v * s), vlen = a => Math.hypot(...a), unit = a => vmul(a, 1 / vlen(a));
const vdot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const blen = (a, b) => vlen(vsub(HB[b], HB[a]));
const rotZ = (v, deg) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]]; };
function finger(pts, ch, bend, spread = 0) {   // bend = 3 joint angles in degrees, toward the viewer; lengths kept
  const u = rotZ(unit(vsub(HB[ch[1]], HB[ch[0]])), spread);
  let p = pts[ch[0]], phi = 0;
  for (let k = 1; k < 4; k++) {
    phi += bend[k - 1] * Math.PI / 180;
    p = vadd(p, vmul(vadd(vmul(u, Math.cos(phi)), [0, 0, -Math.sin(phi)]), blen(ch[k - 1], ch[k])));
    pts[ch[k]] = p;
  }
}
function reach(a, t, l1, l2, hint) {   // 2-bone reach from a toward t; the middle joint bends toward hint
  const u = unit(vsub(t, a)), D = Math.min(vlen(vsub(t, a)), (l1 + l2) * 0.999);
  const w = unit(vsub(hint, vmul(u, vdot(hint, u))));
  const ca = (l1 * l1 + D * D - l2 * l2) / (2 * l1 * D), sa = Math.sqrt(Math.max(0, 1 - ca * ca));
  return [vadd(a, vadd(vmul(u, l1 * ca), vmul(w, l1 * sa))), vadd(a, vmul(u, D))];
}
const CURL = [80, 100, 55], PINCH = [30, 50, 35];
function pose(f, thumb, spread = [0, 0, 0, 0]) {   // f = index, middle, ring, pinky: "ext" | "curl" | "pinch"
  const pts = HB.map(p => p.slice());
  FINGERS.forEach((ch, i) => finger(pts, ch, f[i] === "ext" ? [0, 0, 0] : f[i] === "pinch" ? PINCH : CURL, spread[i]));
  const l2 = blen(2, 3), l3 = blen(3, 4);
  if (thumb === "fold") {         // thumb tip across the front of the curled fingers
    const t = vadd(vmul(vadd(pts[7], pts[11]), 0.5), [0, 0, -6]);
    pts[2] = vadd(pts[1], rotZ(vsub(HB[2], HB[1]), 20));
    [pts[3], pts[4]] = reach(pts[2], t, l2, l3, [-1, -0.4, -0.6]);
  } else if (thumb === "side") {  // L: thumb straight out, away from the index
    const a = Math.atan2(HB[4][1] - HB[1][1], HB[4][0] - HB[1][0]) * 180 / Math.PI;
    [2, 3, 4].forEach(j => { pts[j] = vadd(pts[1], rotZ(vsub(HB[j], HB[1]), -172 - a)); });
  } else if (thumb === "pinch") { // thumb tip meets the index tip
    pts[2] = vadd(pts[1], rotZ(vsub(HB[2], HB[1]), 12));
    [pts[3], pts[4]] = reach(pts[2], vadd(pts[8], [0, 0, -1]), l2, l3, [-1, 0.3, -0.5]);
  }
  return pts;
}
const UNIT = 27.4;   // preview units per pictogram unit (wrist to middle tip = 87 units = 3.2)
function view(pts, yaw) {   // turn about the vertical axis, then flatten to 2D
  const r = yaw * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  return pts.map(([x, y, z]) => [(x * c - z * s) / UNIT, y / UNIT]);
}
const OPEN = ["ext", "ext", "ext", "ext"], FIST = ["curl", "curl", "curl", "curl"], POINT = ["ext", "curl", "curl", "curl"];
const TWO = ["ext", "ext", "curl", "curl"];
const SPREAD = [-8, -2, 4, 10];   // a relaxed open palm: fingers fan out a little from the mockup's pose
const PALM = P.hand ? view(pose(OPEN, "ext", SPREAD), 0) : [];
const GESTURES = !P.hand ? [] : [   // G01-G12, docs/DATA-DICTIONARY.md 2.7
  { id: "G01", h: PALM },                                              // open palm (lead gesture)
  { id: "G02", h: PALM, swipe: 180 }, { id: "G03", h: PALM, swipe: 0 },    // swipe left, right
  { id: "G04", h: PALM, swipe: -90 }, { id: "G05", h: PALM, swipe: 90 },   // swipe up, down
  { id: "G06", h: view(pose(POINT, "fold"), 12), rot: -90 },           // index points left
  { id: "G07", h: view(pose(POINT, "fold"), 12), rot: -90, flip: 1 },  // index points right (mirror of G06)
  { id: "G08", h: view(pose(TWO, "fold", [-9, 9, 0, 0]), 15) },        // two fingers up
  { id: "G09", h: view(pose(TWO, "fold", [-9, 9, 0, 0]), 15), rot: 180 },   // two fingers down
  { id: "G10", h: view(pose(FIST, "fold"), 15) },                      // fist, held
  { id: "G11", h: view(pose(POINT, "side"), 15) },                     // L shape
  { id: "G12", h: view(pose(["pinch", "ext", "ext", "ext"], "pinch", SPREAD), 20) }   // thumb + index pinch
];
const dir = a => [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180)];
const add2 = (p, v, s) => [p[0] + v[0] * s, p[1] + v[1] * s];
function pictogram(gs, cx, cy, size, col) {   // Y's pictogram fit, fed with the posed hand
  const c0 = [-0.2, -1.5];
  const rot = (p, a) => { const [c, s] = dir(a); const x = p[0] - c0[0], y = p[1] - c0[1]; return [c0[0] + x * c - y * s, c0[1] + x * s + y * c]; };
  let hp = gs.h.map(p => rot(p, gs.rot || 0)).map(([x, y]) => [gs.flip ? -x : x, y]), mark = null;
  if (gs.swipe !== undefined) {   // swipe = the open hand plus the logo mark (dots + arrow) in the swipe direction
    const v = dir(gs.swipe);
    hp = hp.map(p => [c0[0] + (p[0] - c0[0]) * 0.72 - v[0] * 0.9, c0[1] + (p[1] - c0[1]) * 0.72 - v[1] * 0.9]);
    mark = add2(c0, v, 1.55);
  }
  const all = mark ? hp.concat([add2(mark, [1, 1], 0.95), add2(mark, [-1, -1], 0.95)]) : hp;
  const xs = all.map(p => p[0]), ys = all.map(p => p[1]);
  const f = size / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  const mx = (Math.max(...xs) + Math.min(...xs)) / 2, my = (Math.max(...ys) + Math.min(...ys)) / 2;
  const px = p => [cx + (p[0] - mx) * f, cy + (p[1] - my) * f];
  const g = el("g", {});
  P.bones.forEach(([a, b]) => el("line", { x1: px(hp[a])[0], y1: px(hp[a])[1], x2: px(hp[b])[0], y2: px(hp[b])[1],
    stroke: col, "stroke-width": 7, "stroke-linecap": "round" }, g));
  hp.forEach((p, i) => el("circle", { cx: px(p)[0], cy: px(p)[1], r: [4, 8, 12, 16, 20].includes(i) ? 8 : 5.5, fill: col }, g));
  if (mark) {
    const [x, y] = px(mark), s = 1.9 * f / 24;
    const m = el("g", { transform: `translate(${x},${y}) rotate(${gs.swipe}) scale(${s}) translate(-12,-12)`, fill: col }, g);
    GEO.swipeDots.forEach(([dx, dy, r]) => el("circle", { cx: dx, cy: dy, r }, m));
    el("path", { d: GEO.swipeArrow }, m);
  }
}
function pageGrid() {
  logo(M, M, 48);
  txt("live", P.tagline, { left: M + "px", top: "166px", color: C.muted, font: `500 22px/1.5 ${P.fonts.mono}`, letterSpacing: "0.04em" });
  // round badge (A Book Apart No 15): doc type in the art, the version as live Word text on the badge plate
  const r = 92, bx = W - M - r, by = M + r - 4;
  el("circle", { cx: bx, cy: by, r, fill: C.b });
  const code = txt("fixed", D, { left: 0, top: 0, color: C.bg, font: `700 ${D.length > 3 ? 48 : 58}px/1 'Space Grotesk'` }, C.b);
  const cr = code.getBoundingClientRect();
  code.style.left = bx - cr.width / 2 + "px"; code.style.top = by - cr.height / 2 - 14 + "px";
  const ver = txt("live", `v${doc.ver}`, { left: 0, top: by + 26 + "px", color: C.bg, font: `500 24px/1.2 ${P.fonts.mono}` }, C.b);
  ver.style.left = bx - ver.getBoundingClientRect().width / 2 + "px";
  // 4x3 grid; the tile G<no> is this document's place in the series (docs/README.md table order)
  const top = 300, rowH = 272, colW = CW / 4, hi = doc.no - 1;
  GESTURES.forEach((gs, i) => {
    const cx = M + (i % 4 + 0.5) * colW, cy = top + Math.floor(i / 4) * rowH + 100;
    if (i === hi) el("rect", { x: cx - 112, y: cy - 108, width: 224, height: 216, rx: 36, fill: C.b });
    pictogram(gs, cx, cy, 172, i === hi ? C.bg : C.b);
    const lab = txt("fixed", gs.id, { left: 0, top: cy + 120 + "px", color: i === hi ? C.ink : C.b,
      font: `${i === hi ? 700 : 500} 20px/1.4 ${P.fonts.mono}`, letterSpacing: "0.05em" });
    lab.style.left = cx - lab.getBoundingClientRect().width / 2 + "px";
  });
  const gridEnd = top + 2 * rowH + 100 + 120 + 30;
  addArt(M, top - 10, CW, gridEnd - top + 10);
  const ser = seriesLine(M, gridEnd + 20, C.muted, C.b);
  const rule1 = bottom(ser) + 14;
  el("rect", { x: M, y: rule1, width: CW, height: 3, fill: C.ink });
  const title = txt("live", doc.th.join("<br>"), { left: M + "px", top: rule1 + 22 + "px", color: C.ink, font: `600 68px/1.4 ${P.fonts.title}` });
  const en = txt("live", doc.en, { left: M + "px", top: bottom(title) + 2 + "px", color: C.muted, font: `500 28px/1.4 ${P.fonts.latin}` });
  const rule2 = bottom(en) + 22;
  el("rect", { x: M, y: rule2, width: CW, height: 3, fill: C.ink });
  txt("live", P.promise, { left: M + "px", top: rule2 + 24 + "px", color: C.ink, font: `400 28px/1.5 ${P.fonts.title}` });
  metaRow(1548);
}

// ---------- checks + Word layout (read by render.py) ----------
function lum(col) {
  const v = col.startsWith("#") ? [1, 3, 5].map(i => parseInt(col.slice(i, i + 2), 16)) : col.match(/\d+/g).slice(0, 3).map(Number);
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(v[0]) + 0.7152 * f(v[1]) + 0.0722 * f(v[2]);
}
function ratio(a, b) { const [x, y] = [lum(a), lum(b)].sort((p, q2) => q2 - p); return (x + 0.05) / (y + 0.05); }
function hex(col) { return "#" + col.match(/\d+/g).slice(0, 3).map(n => (+n).toString(16).padStart(2, "0")).join("").toUpperCase(); }
function runStyle(e) {
  const cs = getComputedStyle(e);
  return { family: cs.fontFamily.split(",")[0].replace(/['"]/g, "").trim(), weight: +cs.fontWeight,
    sizePx: parseFloat(cs.fontSize), color: hex(cs.color), letterSpacingPx: parseFloat(cs.letterSpacing) || 0 };
}
const blockBg = e => (e.closest("[data-bg]") || {}).dataset?.bg || C.bg;
function blocks() {   // every live block as runs + box, so the Word builder can place the same text at the same spot
  return [...document.querySelectorAll(".live")].map(e => {
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e), runs = [];
    e.childNodes.forEach(n => {
      if (n.nodeType === 3) runs.push(Object.assign({ text: n.textContent }, runStyle(e)));
      else if (n.nodeName === "BR") runs.push({ br: true });
      else runs.push(Object.assign({ text: n.textContent }, runStyle(n)));
    });
    return { x: r.left, y: r.top, w: r.width, h: r.height, lineHeightPx: parseFloat(cs.lineHeight), bg: blockBg(e), runs };
  });
}
function report() {
  const out = { project: pid, doc: D, theme: T, minContrast: 99, minFontPx: 999, overflow: [], collisions: [] };
  document.querySelectorAll(".live, .fixed, .live span").forEach(e => {
    const cs = getComputedStyle(e), label = (e.textContent || "").slice(0, 30);
    out.minContrast = Math.min(out.minContrast, ratio(cs.color, blockBg(e)));
    out.minFontPx = Math.min(out.minFontPx, parseFloat(cs.fontSize));
    const r = e.getBoundingClientRect();
    if (!e.dataset.edge && (r.right > W - M + 1 || r.left < M - 1 || r.bottom > H - M + 1 || r.top < M - 30)) out.overflow.push(label);
    if (e.classList.contains("fixed")) return;           // fixed text lives inside its own art object
    if (artRects.some(a => r.left < a.x + a.w && r.right > a.x && r.top < a.y + a.h && r.bottom > a.y)) out.collisions.push(label);
  });
  out.minContrast = Math.floor(out.minContrast * 100) / 100;   // floor, never round up
  out.fontsOk = [...new Set([...document.fonts].filter(f => f.status === "loaded").map(f => f.family))];
  return out;
}

async function build() {
  const fam = [`700 100px ${P.fonts.title}`, `600 84px ${P.fonts.title}`, `400 30px ${P.fonts.latin}`, `500 30px ${P.fonts.latin}`,
    `500 26px ${P.fonts.mono}`, `500 84px ${P.fonts.mono}`, "700 100px 'Space Grotesk'", "600 100px 'Space Grotesk'",
    `400 30px ${P.fonts.title}`, `600 26px ${P.fonts.title}`];
  await Promise.all(fam.map(f => document.fonts.load(f, "ABCกขค").catch(() => null)));
  await document.fonts.ready;
  ({ tile: pageTile, shot: pageShot, grid: pageGrid })[P.idea]();
  await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
  await document.fonts.ready;
  window.__report = report();
  window.__layout = { project: pid, doc: D, theme: T, bg: C.bg, blocks: blocks() };
  window.__ready = true;
}
build();
