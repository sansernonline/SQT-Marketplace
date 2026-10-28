// ไทย: ห่อทีละคำด้วย span ที่ไม่ตัดบรรทัด แล้วให้ตัดได้เฉพาะระหว่างคำ (ตัดตามพจนานุกรมของ Intl.Segmenter)
// คำนำหน้า (ผู้ การ ความ ข้อ …) รวมกับคำถัดไปเป็นก้อนเดียว · ชื่อ skill · agent (a-b-c) ห้ามตัดที่ขีด (U+2011)
(function () {
  var PRE = { "ผู้": 1, "การ": 1, "ความ": 1, "ข้อ": 1, "ต่อ": 1, "นัก": 1, "ใบ": 1, "หลัก": 1, "งบ": 1 };
  var th = /[ก-๛]/, seg = new Intl.Segmenter("th", { granularity: "word" }), nodes = [];
  var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n;
  while ((n = w.nextNode())) if (!n.parentNode.closest("script,style,svg")) nodes.push(n);
  nodes.forEach(function (n) {
    var t = n.nodeValue.replace(/([a-z0-9])-(?=[a-z0-9])/g, "$1‑");
    if (!th.test(t)) { n.nodeValue = t; return; }
    var parts = [], buf = "";
    Array.from(seg.segment(t)).forEach(function (s) {
      var x = s.segment;
      if (/^\s+$/.test(x)) { if (buf) parts.push(buf); buf = ""; parts.push(x); return; }
      buf += x;
      if (!PRE[x]) { parts.push(buf); buf = ""; }
    });
    if (buf) parts.push(buf);
    var f = document.createElement("span");  // ครอบทั้งข้อความ: ในกล่อง flex แต่ละคำจะไม่กลายเป็นชิ้นแยกที่มี gap คั่น
    parts.forEach(function (p) {
      if (th.test(p)) { var sp = document.createElement("span"); sp.className = "nb"; sp.textContent = p; f.appendChild(sp); }
      else f.appendChild(document.createTextNode(p));
    });
    n.parentNode.replaceChild(f, n);
  });
})();

// วาดเส้นระหว่างโหนดด้วย D3 หลังฟอนต์โหลดและจัดหน้าเสร็จ (render.py เรียก draw()) · เส้นตั้งหรือนอนเท่านั้น หักมุมฉาก ไม่มีเส้นโค้งหรือเส้นเฉียง
// ประกาศเส้นใน HTML: <svg class="wires" data-wires='[["a","b"],["b","c","main"],["c","d","dash"]]'></svg>
// ชนิดเส้น (ช่องที่ 3 รวมกันได้): main = สีของ plugin · dash = เส้นประ · back = ย้อนขึ้นทางช่องซ้ายของวง · t = ลำต้น (ลงตรงจากต้นทาง แล้วเลี้ยวเข้าข้างปลายทาง)
// "a" "b" คือ id ของ .dot · แนวเดียวกัน = เส้นตรง · ปลายทางอยู่ต่ำกว่า = ลงก่อน เลี้ยวกลางทาง แล้วลงเข้าบน (หลายเส้นจากแถวเดียวกันรวมเป็นราง)
function route(ra, rb, kind, box, ga, gb) {
  var gap = 8, has = function (k) { return kind.split(" ").indexOf(k) >= 0; };
  var ax = Math.round(ra.left + ra.width / 2 - box.left), ay = Math.round(ra.top + ra.height / 2 - box.top);
  var bx = Math.round(rb.left + rb.width / 2 - box.left), by = Math.round(rb.top + rb.height / 2 - box.top);
  var ha = ra.height / 2, hb = rb.height / 2, wa = ra.width / 2, wb = rb.width / 2, s;
  if (has("back")) {                                    // ออกซ้ายของต้นทาง ขึ้นตามช่องซ้าย แล้วเข้าซ้ายของปลายทาง
    var xl = Math.min(ax - wa, bx - wb) - 28;
    return [[ax - wa - gap, ay], [xl, ay], [xl, by], [bx - wb - gap, by]];
  }
  if (has("t") && Math.abs(ax - bx) > 2) {              // ลงตรงจากใต้ต้นทาง แล้วเลี้ยวเข้าข้างปลายทาง
    s = bx > ax ? 1 : -1;
    return [[ax, ay + ha + gap], [ax, by], [bx - s * (wb + gap), by]];
  }
  if (Math.abs(ay - by) < 3) {                          // แถวเดียวกัน: เส้นนอน
    s = bx > ax ? 1 : -1;
    return [[ax + s * (wa + gap), ay], [bx - s * (wb + gap), by]];
  }
  if (by > ay) {                                        // ปลายทางต่ำกว่า: ลง → นอน → ลง
    var y1 = ay + ha + gap, y2 = by - hb - gap;
    if (Math.abs(ax - bx) < 3) return [[ax, y1], [ax, y2]];
    // รางนอนวัดจากปลายทาง (หลายเส้นจากการ์ดสูงไม่เท่ากันรวมเป็นระดับเดียว) · ต้นหรือปลายอยู่ในกรอบกลุ่ม → รางอยู่นอกกรอบ
    var aBot = ga ? ga.bottom - box.top : ay + ha, bTop = gb ? gb.top - box.top : by - hb;
    var ym = Math.round(Math.max(aBot + 16, bTop - (gb ? 20 : 28)));
    return [[ax, y1], [ax, ym], [bx, ym], [bx, y2]];
  }
  s = bx > ax ? 1 : -1;                                 // ปลายทางสูงกว่า (ไม่ใช่ back): นอน → ขึ้น → นอน
  var x1 = ax + s * (wa + gap), x2 = bx - s * (wb + gap), xm = Math.round((x1 + x2) / 2);
  return [[x1, ay], [xm, ay], [xm, by], [x2, by]];
}

function draw() {
  d3.selectAll("svg.wires").each(function (_, n) {
    var svg = d3.select(this), box = this.parentElement.getBoundingClientRect();
    var list = JSON.parse(this.dataset.wires || "[]"), css = getComputedStyle(this);
    var col = css.getPropertyValue("--line").trim() || "#94A3B8";
    var pc = css.getPropertyValue("--pc").trim() || col;
    svg.selectAll("*").remove();
    var defs = svg.append("defs");
    [["l", col], ["m", pc]].forEach(function (m) {
      defs.append("marker").attr("id", "ah-" + m[0] + n).attr("viewBox", "0 0 10 10").attr("refX", 8).attr("refY", 5)
        .attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto-start-reverse")
        .append("path").attr("d", "M1 1L9 5L1 9Z").attr("fill", m[1]).attr("stroke", m[1]).attr("stroke-width", 1.2).attr("stroke-linejoin", "round");
    });
    var line = d3.line().curve(d3.curveLinear);
    list.forEach(function (w, i) {
      var a = document.getElementById(w[0]), b = document.getElementById(w[1]);
      if (!a || !b) { console.warn("wire: ไม่พบ", w); return; }
      // กรอบกลุ่มที่ล้อมต้นทางหรือปลายทาง (ไม่นับกรอบที่ล้อมทั้งสองฝั่ง)
      var grp = function (x, y) { var g = x.closest(".group"); return g && !g.contains(y) ? g.getBoundingClientRect() : null; };
      var kind = w[2] || "", pts = route(a.getBoundingClientRect(), b.getBoundingClientRect(), kind, box, grp(a, b), grp(b, a));
      var main = kind.split(" ").indexOf("main") >= 0;
      svg.append("path").attr("d", line(pts)).attr("class", kind).attr("stroke", main ? pc : col)
        .attr("marker-end", "url(#ah-" + (main ? "m" : "l") + n + ")");
    });
  });
}
