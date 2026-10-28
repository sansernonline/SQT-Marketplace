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

// วาดเส้นโค้งระหว่างโหนด หลังฟอนต์โหลดและจัดหน้าเสร็จ (render.py เรียก draw())
// ประกาศเส้นใน HTML: <svg class="wires" data-wires='[["a","b"],["b","c","main"],["c","d","dash"]]'></svg>
// ชนิดเส้น (ช่องที่ 3 รวมกันได้): main = สีของ plugin · dash = เส้นประ · v = แนวตั้งบนลงล่าง · back = ย้อนกลับใต้แถว
// "a" "b" คือ id ของ .dot · คนละคอลัมน์ = โค้ง S ซ้ายไปขวา · คอลัมน์เดียวกัน = เส้นตรงบนลงล่าง · ขึ้นแถวใหม่ = อ้อมขอบขวาแล้วเข้าทางบน
function draw() {
  document.querySelectorAll("svg.wires").forEach(function (svg) {
    var box = svg.parentElement.getBoundingClientRect();
    var list = JSON.parse(svg.dataset.wires || "[]");
    var NS = "http://www.w3.org/2000/svg", out = [];
    var col = getComputedStyle(svg).getPropertyValue("--line").trim() || "#A3ACB9";
    var pc = getComputedStyle(svg).getPropertyValue("--pc").trim() || col;
    svg.innerHTML = "<defs>" + ["l", "m"].map(function (k) {
      return '<marker id="ah-' + k + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
        '<path d="M1 1L9 5L1 9" fill="none" stroke="' + (k === "m" ? pc : col) + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></marker>';
    }).join("") + "</defs>";
    list.forEach(function (w) {
      var a = document.getElementById(w[0]), b = document.getElementById(w[1]);
      if (!a || !b) { console.warn("wire: ไม่พบ", w); return; }
      var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), gap = 10, d;
      var ax = ra.left + ra.width / 2 - box.left, ay = ra.top + ra.height / 2 - box.top;
      var bx = rb.left + rb.width / 2 - box.left, by = rb.top + rb.height / 2 - box.top;
      var r = 14;
      var kind0 = w[2] || "";
      if (kind0.indexOf("v") >= 0) {                // แนวตั้ง: ออกล่างของต้นทาง โค้ง S เข้าบนของปลายทาง (แตกกิ่ง · รวมกิ่ง)
        var ya = ay + ra.height / 2 + gap, yb = by - rb.height / 2 - gap, my = (ya + yb) / 2;
        d = "M" + ax + " " + ya + " C" + ax + " " + my + " " + bx + " " + my + " " + bx + " " + yb;
      } else if (kind0.indexOf("back") >= 0) {      // ย้อนกลับ: ออกล่าง วนใต้แถว แล้วเข้าล่างของปลายทาง
        var yl = Math.max(ay + ra.height / 2, by + rb.height / 2) + 36;
        d = "M" + ax + " " + (ay + ra.height / 2 + gap) + " C" + ax + " " + yl + " " + bx + " " + yl + " " + bx + " " + (by + rb.height / 2 + gap);
      } else if (by - ay > ra.height && bx < ax - 2) {         // ขึ้นแถวใหม่: ออกขวา อ้อมขอบขวาของกรอบ ลงมาเหนือปลายทาง แล้วเข้าทางบน
        var xr = box.width - 24, x0 = ax + ra.width / 2 + gap, ym = rb.top - box.top - 28, yt = by - rb.height / 2 - gap;
        d = "M" + x0 + " " + ay + " H" + (xr - r) + " Q" + xr + " " + ay + " " + xr + " " + (ay + r) +
            " V" + (ym - r) + " Q" + xr + " " + ym + " " + (xr - r) + " " + ym +
            " H" + (bx + r) + " Q" + bx + " " + ym + " " + bx + " " + (ym + r) + " V" + yt;
      } else if (Math.abs(ax - bx) > ra.width) {          // คนละคอลัมน์: ซ้าย → ขวา โค้งแบบ S
        var s = bx > ax ? 1 : -1;
        var x1 = ax + s * (ra.width / 2 + gap), x2 = bx - s * (rb.width / 2 + gap), mx = (x1 + x2) / 2;
        d = "M" + x1 + " " + ay + " C" + mx + " " + ay + " " + mx + " " + by + " " + x2 + " " + by;
      } else {                                      // คอลัมน์เดียวกัน: บน → ล่าง
        var t = by > ay ? 1 : -1;
        var y1 = ay + t * (ra.height / 2 + gap), y2 = by - t * (rb.height / 2 + gap);
        d = "M" + ax + " " + y1 + " L" + bx + " " + y2;
      }
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      var kind = w[2] || "";
      p.setAttribute("class", kind);
      p.setAttribute("marker-end", "url(#ah-" + (kind.indexOf("main") >= 0 ? "m" : "l") + ")");
      svg.appendChild(p);
    });
  });
}
