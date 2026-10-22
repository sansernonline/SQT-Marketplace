"""
เรนเดอร์ภาพ HTML ออกเป็น PNG — ของ skill `diagram-figures`

ติดตั้งครั้งเดียว:
    pip install playwright
    playwright install chromium

ใช้กับโปรเจกต์ (แบบหลัก) — คัดลอกไฟล์นี้ไปไว้ที่ docs/figures/render.py ข้างโฟลเดอร์ src/
    python docs/figures/render.py                  # ทุกไฟล์ใน docs/figures/src/
    python docs/figures/render.py arch-01 fsd-02   # เฉพาะชื่อที่ระบุ (ไม่ต้องใส่ .html)
    python render-figure.py docs/figures/src       # เรียกจาก skill ตรง ๆ โดยชี้โฟลเดอร์ต้นทาง
  ได้ 2 ฉบับต่อรูป:
    <out>/<ชื่อ>.png      ฉบับเต็ม มีหัวรูป — เปิดเดี่ยว · สไลด์
    <out>/doc/<ชื่อ>.png  ฉบับวางในเอกสาร (?embed=1 → <html class="embed"> ซ่อน .head) — คำบรรยายใน Word บอกชื่อรูปแล้ว
  แล้วตรวจข้อความทุกรูป: ตัวอักษรเล็กกว่า --min-px · ป้ายตกบรรทัด · ข้อความล้นกล่องหรือล้นผ้าใบ · ป้ายทับกัน
  exit 1 ถ้าเจอปัญหา · ค่า --min-px คิดจากขนาดที่วางจริง (SKILL.md ข้อ 4) ค่าตั้งต้น 26px = 9pt บนหน้าแนวนอน

ใช้กับไฟล์เดียว (แบบเดิม):
    python render-figure.py figure-template.html figure.png 2
    python render-figure.py "figure-flow.html#accent=E10613&dark" fig-dark.png 2   # สีหลัก + พื้นเข้ม

ตัวคูณ 2 = ภาพคมพอสำหรับสไลด์และงานพิมพ์ · 1 = เบลอเมื่อซูม อย่าใช้
ถ่ายเฉพาะกล่อง .sheet ไม่เอาพื้นที่ว่างรอบนอก
"""
import argparse
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
EMBED_CSS = "html.embed .head{display:none}"   # ทางสำรอง ถ้า css ของโปรเจกต์ยังไม่ได้ซ่อนหัวรูปเอง

PROBE = r"""(MIN) => {
  const sheet = document.querySelector(".sheet").getBoundingClientRect();
  let min = 999, minEl = "";
  const small = [], wrapped = [], outside = [];
  const box = e => e.getBoundingClientRect(), txt = e => "'" + e.textContent.trim().slice(0, 32) + "'";
  for (const el of document.querySelectorAll(".sheet *")) {
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!own || !el.getClientRects().length) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize), r = box(el);
    if (fs < min) { min = fs; minEl = txt(el); }
    if (fs < MIN) small.push(fs + "px " + txt(el));
    const card = el.closest(".card");
    if (card && (r.right > box(card).right + 1 || r.left < box(card).left - 1)) outside.push("card " + txt(el));
    if (r.right > sheet.right + 1 || r.left < sheet.left - 1) outside.push("sheet " + txt(el));
  }
  for (const el of document.querySelectorAll(".stage .name,.stage .desc,.stage .tag,.stage li,.lname,.wire-label,.box-label")) {
    const lines = Math.round(box(el).height / parseFloat(getComputedStyle(el).lineHeight));
    const breaks = el.querySelectorAll("br").length + (el.textContent.match(/\n/g) || []).length;
    if (el.matches(".desc,li") && !breaks) continue;   // ย่อหน้าที่ไม่ได้กำหนดบรรทัดเอง ตัดบรรทัดได้ตามปกติ
    const want = breaks + 1;
    if (lines > want) wrapped.push(txt(el) + " " + lines + ">" + want);
  }
  const hit = (a, b) => a.left + 1 < b.right && b.left + 1 < a.right && a.top + 1 < b.bottom && b.top + 1 < a.bottom;
  const tags = [...document.querySelectorAll(".wire-label,.wire-step .step")];
  const blocks = [...document.querySelectorAll(".stage .card,.zone .box-label")];
  tags.forEach((a, i) => {
    for (const b of blocks.concat(tags.slice(i + 1))) if (hit(box(a), box(b))) outside.push("overlap " + txt(a) + " x " + txt(b));
  });
  return {min, minEl, small, wrapped, outside, w: Math.round(sheet.width), h: Math.round(sheet.height)};
}"""


def shoot(page, url, out, embed=False):
    page.goto(url)
    if embed:
        page.evaluate("document.documentElement.classList.add('embed')")
        page.add_style_tag(content=EMBED_CSS)
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(500)                     # ให้สคริปต์ลากเส้นหลังโหลดฟอนต์เสร็จ
    if page.query_selector(".sheet") is None:
        raise SystemExit(f"ไม่พบ .sheet ใน {url}")
    out.parent.mkdir(parents=True, exist_ok=True)
    page.locator(".sheet").screenshot(path=str(out))


def render_folder(src, out, names, min_px, scale):
    files = [src / f"{n.removesuffix('.html')}.html" for n in names] or sorted(src.glob("*.html"))
    bad = 0
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 2000, "height": 1200}, device_scale_factor=scale)
        page.on("console", lambda m: print("   console:", m.text) if m.type in ("error", "warning") else None)
        for f in files:
            for tag, query, target in (("full", "", out), ("doc ", "?embed=1", out / "doc")):
                shoot(page, f.as_uri() + query, target / f"{f.stem}.png", embed=bool(query))
                r = page.evaluate(PROBE, min_px)
                print(f"{tag} {f.stem}: {r['w']}x{r['h']} min={r['min']}px {r['minEl']}")
                for kind in ("small", "wrapped", "outside"):
                    for m in r[kind]:
                        bad += 1
                        print(f"   {kind}: {m}")
        browser.close()
    print(f"problems: {bad}")
    return 1 if bad else 0


def render_one(src, out, scale):
    path, _, frag = src.partition("#")             # figure-flow.html#accent=E10613&dark
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(device_scale_factor=scale)
        page.on("console", lambda m: print("console:", m.text))   # เห็นคำเตือนเรื่อง id ที่หาไม่เจอ
        shoot(page, Path(path).resolve().as_uri() + ("#" + frag if frag else ""), Path(out))
        browser.close()
    print("เขียนไฟล์แล้ว", out)
    return 0


def main(argv):
    if argv and argv[0].partition("#")[0].endswith(".html"):
        return render_one(argv[0], argv[1] if len(argv) > 1 else "figure.png", float(argv[2]) if len(argv) > 2 else 2)
    ap = argparse.ArgumentParser(description="render ทั้งโฟลเดอร์รูป: ฉบับเต็ม + ฉบับวางในเอกสาร แล้วตรวจข้อความ")
    ap.add_argument("names", nargs="*", help="ชื่อรูปที่จะ render (ว่าง = ทุกไฟล์) หรือโฟลเดอร์ต้นทางเป็นตัวแรก")
    ap.add_argument("--out", type=Path, help="โฟลเดอร์ผลลัพธ์ (ค่าตั้งต้น = แม่ของโฟลเดอร์ต้นทาง)")
    ap.add_argument("--min-px", type=float, default=26, help="ตัวอักษรเล็กสุดที่ยอมได้บนผ้าใบ (SKILL.md ข้อ 4)")
    ap.add_argument("--scale", type=float, default=2)
    a = ap.parse_intermixed_args(argv)
    names = a.names
    src = HERE / "src"
    if names and Path(names[0]).is_dir():
        src, names = Path(names[0]).resolve(), names[1:]
    if not src.is_dir():
        raise SystemExit(f"ไม่พบโฟลเดอร์ต้นทาง {src} — ชี้โฟลเดอร์เป็นอาร์กิวเมนต์แรก หรือวางไฟล์นี้ข้าง src/")
    return render_folder(src, a.out or src.parent, names, a.min_px, a.scale)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.exit(main(sys.argv[1:]))
