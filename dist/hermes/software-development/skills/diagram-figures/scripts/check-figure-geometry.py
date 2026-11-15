"""ตรวจเรขาคณิตของรูป HTML: เส้นต้องเป็นแนวตั้งหรือแนวนอน หักมุมด้วยมุมโค้งเท่านั้น (ห้ามเส้นเฉียง ห้ามโค้งอิสระ)
ป้ายและเลขลำดับไม่ทับกัน และเส้นไม่พาดผ่านตัวหนังสือหรือไอคอน

    python check-figure-geometry.py <ไฟล์ .html หรือโฟลเดอร์>     (exit 0 = ผ่าน)
    python check-figure-geometry.py --self-test                    (ตรวจตัวตรวจเอง · ข้ามถ้าไม่มี playwright/chromium)

ต้องมี playwright (pip install playwright && playwright install chromium)"""
import asyncio, sys
from pathlib import Path
try:
    from playwright.async_api import async_playwright
except ImportError:                      # --self-test below skips instead of crashing
    if sys.argv[1:] != ["--self-test"]:
        raise
    async_playwright = None

JS = r"""() => {
  const R = e => { const r = e.getBoundingClientRect(); return {x0:r.left, y0:r.top, x1:r.right, y1:r.bottom}; };
  const hit = (a, b, m) => a.x0 + m < b.x1 && b.x0 + m < a.x1 && a.y0 + m < b.y1 && b.y0 + m < a.y1;
  const name = e => (e.className && e.className.baseVal === undefined ? e.className : "") + " '" + (e.textContent || "").trim().slice(0, 30) + "'";
  const out = [];
  const st = document.getElementById("stage").getBoundingClientRect();
  const segs = [];
  document.querySelectorAll("svg.wires path.wire").forEach((p, i) => {
    const cmds = [...p.getAttribute("d").matchAll(/([MLAQ])([^MLAQ]*)/g)].map(m => [m[1], m[2].trim().split(/[\s,]+/).map(Number)]);
    if (/[^MLAQ\d.\s,-]/.test(p.getAttribute("d"))) out.push(`wire ${i}: curve command other than a quarter-circle elbow`);
    const pts = cmds.map(([c, v]) => [c, [v[v.length-2] + st.left, v[v.length-1] + st.top], v[0]]);
    for (let k = 1; k < pts.length; k++) {
      const [a, b] = [pts[k-1][1], pts[k][1]];
      if (pts[k][0] === "Q") { const v = cmds[k][1], c = [v[0] + st.left, v[1] + st.top];
        const ok = (Math.abs(c[0]-a[0]) < .5 || Math.abs(c[1]-a[1]) < .5) && (Math.abs(c[0]-b[0]) < .5 || Math.abs(c[1]-b[1]) < .5);
        if (!ok) out.push(`wire ${i}: curve is not a corner elbow at ${a}`);
        continue; }
      if (pts[k][0] === "A") { const r = pts[k][2];
        if (Math.abs(Math.abs(a[0]-b[0]) - r) > 0.5 || Math.abs(Math.abs(a[1]-b[1]) - r) > 0.5) out.push(`wire ${i}: elbow is not a quarter circle at ${a}`);
        continue; }
      if (Math.abs(a[0]-b[0]) > 0.5 && Math.abs(a[1]-b[1]) > 0.5) out.push(`wire ${i}: diagonal segment ${a} -> ${b}`);
      segs.push({i, x0:Math.min(a[0],b[0]), y0:Math.min(a[1],b[1]), x1:Math.max(a[0],b[0]), y1:Math.max(a[1],b[1])});
    }
  });
  const tags = [...document.querySelectorAll(".wire-label .pill, .wire-step .step")];
  const content = [...document.querySelectorAll(".stage .name,.stage .desc,.stage .tile,.stage .ic,.stage h2,.stage li,.stage .note,.stage .box-label,.stage .box-note,.stage .kicker,.stage .tagline,.stage .gain,.stage .callout h3,.stage .callout p,.stage .logo-slot")];
  for (let a = 0; a < tags.length; a++) {
    for (let b = a + 1; b < tags.length; b++) if (hit(R(tags[a]), R(tags[b]), 1)) out.push(`overlap: ${name(tags[a])} x ${name(tags[b])}`);
    for (const c of content) if (hit(R(tags[a]), R(c), 1)) out.push(`overlap: ${name(tags[a])} x ${name(c)}`);
  }
  for (const s of segs) for (const c of content) {
    const r = R(c); if (hit({x0:s.x0-1, y0:s.y0-1, x1:s.x1+1, y1:s.y1+1}, r, 2)) out.push(`wire ${s.i} runs through ${name(c)}`);
  }
  return {wires: document.querySelectorAll("svg.wires path.wire").length, problems: out};
}"""

async def main(folder):
    p = Path(folder)
    files = [p] if p.is_file() else sorted(p.glob("*.html"))
    bad = 0
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page()
        for f in files:
            await pg.goto(f.resolve().as_uri()); await pg.wait_for_timeout(400)
            r = await pg.evaluate(JS)
            print(("OK  " if not r["problems"] else "BAD ") + f"{f.name}: {r['wires']} wires")
            for m in r["problems"]: print("    " + m)
            bad += bool(r["problems"])
        await br.close()
    sys.exit(1 if bad else 0)

PAGE = """<html><body style="margin:0"><div id="stage" class="stage" style="position:relative;width:400px;height:240px">
<div class="name" style="position:absolute;left:150px;top:90px;width:80px;height:20px">Box</div>
<svg class="wires" width="400" height="240" style="position:absolute;left:0;top:0"><path class="wire" d="%s" fill="none" stroke="#000"/></svg>
</div></body></html>"""


def self_test():
    """Three tiny pages: a clean elbow wire passes; a diagonal wire and a wire through a label fail."""
    import tempfile
    if async_playwright is None:
        print("self-test skipped: playwright missing (pip install playwright && playwright install chromium)")
        return
    cases = (("clean", "M 10 20 L 100 20 A 10 10 0 0 1 110 30 L 110 200", 0),
             ("diagonal", "M 10 10 L 100 100", 1),
             ("through-text", "M 10 100 L 390 100", 1))
    with tempfile.TemporaryDirectory() as tmp:
        for name, d, want in cases:
            (Path(tmp) / f"{name}.html").write_text(PAGE % d, encoding="utf-8")
            try:
                asyncio.run(main(str(Path(tmp) / f"{name}.html")))
            except SystemExit as done:
                assert done.code == want, f"{name}: exit {done.code}, wanted {want}"
    print("self-test ok")


if __name__ == "__main__":
    if sys.argv[1:] == ["--self-test"]:
        self_test()
    else:
        asyncio.run(main(sys.argv[1]))
