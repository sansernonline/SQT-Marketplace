"""check_html_deck.py — เปิดเด็คที่แปลงจาก .pptx ในเบราว์เซอร์จริง ถ่ายทุกหน้า แล้วหาจุดที่แปลงไม่ตรง

    python check_html_deck.py deck.html --out _to_delete/deck-check [--pptx deck.pptx]

ได้: p01.png … · sheet-1.png … (9 หน้าต่อแผ่น) · รายการปัญหาใน stdout · exit 1 เมื่อพบปัญหา
ปัญหาที่หา: ข้อความล้นกล่องเดิมของ PowerPoint เกิน 16px (ฟอนต์ต่างจากเครื่องที่ทำ .pptx) · ข้อความล้นขอบสไลด์ · รูปไม่ขึ้น
· ชิ้นที่แปลงไม่ได้ · JavaScript error · กด → จากหน้าแรกแล้วไม่ถึงหน้าสุดท้ายครบทุกขั้น
--pptx ใส่ไฟล์ต้นทาง = เทียบจำนวนหน้า และจำนวนขั้น On Click
ต้องมี playwright (pip install playwright && playwright install chromium) และ Pillow

    python check_html_deck.py --self-test   # สร้างเด็คตัวอย่าง ต้องผ่าน · ใส่กล่อง "แปลงไม่ได้" เข้าไป ต้องถูกจับได้
ไม่มี playwright / Pillow / chromium → self-test ข้ามและบอกชัด
"""
from __future__ import annotations

import argparse
from pathlib import Path

import sys

try:
    from PIL import Image
    from playwright.sync_api import sync_playwright
except ImportError:                                           # --self-test ต้องบอกชัดว่าข้าม ไม่ใช่ล้ม
    if "--self-test" in sys.argv:
        print("SKIP self-test: ไม่มี playwright หรือ Pillow (pip install playwright pillow && playwright install chromium)")
        raise SystemExit(0)
    raise SystemExit("ต้องมี playwright และ Pillow: pip install playwright pillow && playwright install chromium")

PROBE = """(s) => {
  const out = [], box = s.getBoundingClientRect(), k = box.width / s.offsetWidth;
  const W = s.offsetWidth, H = s.offsetHeight;
  const name = el => (el.textContent || el.getAttribute('src') || '').trim().slice(0, 40);
  for (const el of s.querySelectorAll('.s')) {
    const r = el.getBoundingClientRect(); if (!r.width && !r.height) continue;
    const x = (r.left - box.left) / k, y = (r.top - box.top) / k;
    const tx = el.querySelector(':scope > .tx');
    // ภาพตกแต่งล้นขอบได้ (ตั้งใจ bleed) · ข้อความล้นขอบ = ตัวหาย
    if (tx && tx.textContent.trim() && (x < -2 || y < -2 || x + r.width / k > W + 2 || y + r.height / k > H + 2)) out.push('ข้อความล้นขอบสไลด์: ' + name(el));
    // ล้นเล็กน้อย (≤ 16px) PowerPoint ก็วาดเลยกล่องแบบเดียวกัน · เกินนั้น = ฟอนต์ในเครื่องนี้กว้างกว่าเครื่องที่ทำ .pptx
    if (tx && (tx.scrollHeight - tx.clientHeight) / k > 16 && !tx.style.whiteSpace)
      out.push(`ข้อความล้นกล่อง ${Math.round((tx.scrollHeight - tx.clientHeight) / k)}px: ` + name(el));
    if (el.matches('.unsupported')) out.push(el.textContent.trim());
  }
  for (const img of s.querySelectorAll('img')) if (!(img.complete && img.naturalWidth)) out.push('รูปไม่ขึ้น');
  return [...new Set(out)];
}"""


def self_test() -> int:
    """เด็คปกติ → exit 0 และ 3 หน้า · เด็คที่มีกล่องแปลงไม่ได้ → exit 1"""
    import subprocess
    import tempfile
    from click_steps import sample_deck
    here = Path(__file__).resolve()
    with tempfile.TemporaryDirectory() as tmp:
        t = Path(tmp)
        pptx, good, bad = sample_deck(t / "t.pptx"), t / "good.html", t / "bad.html"
        subprocess.run([sys.executable, "-B", str(here.with_name("pptx_to_html.py")), str(pptx), "-o", str(good)],
                       check=True, capture_output=True)
        html = good.read_text(encoding="utf-8")
        bad.write_text(html.replace("</section>", '<div class="s unsupported">แปลงไม่ได้: ทดสอบ</div></section>', 1), encoding="utf-8")

        def run(deck, *extra):
            return subprocess.run([sys.executable, "-B", str(here), str(deck), "--out", str(t / deck.stem), "--wait", "300", *extra],
                                  capture_output=True, text=True, encoding="utf-8")
        try:
            ok, no = run(good, "--pptx", str(pptx)), run(bad)
        except OSError as e:
            print(f"SKIP self-test: {e}")
            return 0
        if "BrowserType.launch" in ok.stderr:
            print("SKIP self-test: ไม่มี chromium (playwright install chromium)")
            return 0
        checks = {
            "เด็คปกติ exit 0": ok.returncode == 0,
            "เด็คปกติ: 3 หน้า · ขั้นรวม 2 · ปัญหา 0": "3 หน้า · ขั้นรวม 2 · ปัญหา 0" in ok.stdout,
            "ถ่ายครบ 3 ภาพ + แผ่นรวม": len(list((t / "good").glob("p*.png"))) == 3 and (t / "good" / "sheet-1.png").exists(),
            "เด็คที่มีกล่องแปลงไม่ได้ exit 1": no.returncode == 1 and "แปลงไม่ได้" in no.stdout,
        }
    for name, good_ in checks.items():
        print("ok  " if good_ else "FAIL", name)
    if not all(checks.values()):
        print(ok.stdout[-400:], ok.stderr[-400:])
    print(f"self-test {sum(checks.values())}/{len(checks)}")
    return 0 if all(checks.values()) else 1


def main() -> None:
    if "--self-test" in sys.argv:
        raise SystemExit(self_test())
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("deck", type=Path)
    ap.add_argument("--out", type=Path, default=Path("_to_delete/deck-check"))
    ap.add_argument("--pptx", type=Path, help="ไฟล์ต้นทาง ไว้เทียบจำนวนหน้าและขั้น")
    ap.add_argument("--wait", type=int, default=2600, help="มิลลิวินาทีที่รอให้ animation จบก่อนถ่าย")
    a = ap.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    problems, errors = 0, []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(a.deck.resolve().as_uri())
        page.wait_for_timeout(1200)
        names = page.evaluate("S.map(s=>s.dataset.menu||'')")
        steps = page.evaluate("S.map(steps)")
        inserted = page.evaluate("S.map(s=>!!s.dataset.inserted)")
        for n, name in enumerate(names):
            page.evaluate(f"show({n},true)")                    # เข้าแบบถอยหลัง = เห็นทุกขั้นของหน้า
            page.wait_for_timeout(a.wait)
            page.screenshot(path=str(a.out / f"p{n + 1:02d}.png"))
            for issue in page.evaluate(PROBE, page.query_selector_all(".slide")[n]):
                print(f"หน้า {n + 1:02d} {name[:30]}: {issue}")
                problems += 1
        page.evaluate("show(0)")
        downs = rights = 0                                      # ↓ เปิดขั้นในหน้า · → เปลี่ยนหน้า (ขั้นกลับเป็น 0)
        while downs + rights < 2000:
            while downs < 2000 and page.evaluate("st<steps(S[i])"):
                page.keyboard.press("ArrowDown")
                downs += 1
            if page.evaluate("i===S.length-1"):
                break
            page.keyboard.press("ArrowRight")
            rights += 1
            if page.evaluate("st") != 0:
                print(f"หน้า {rights + 1:02d}: เข้าหน้าใหม่แล้ว player ไม่ reset เป็นขั้น 0")
                problems += 1
        if (rights, downs) != (len(names) - 1, sum(steps)):
            print(f"กด → {rights} · ↓ {downs} ครั้งถึงท้ายเด็ค · ควรเป็น → {len(names) - 1} · ↓ {sum(steps)}")
            problems += 1
        browser.close()
    if a.pptx:
        from pptx import Presentation
        from pptx_to_html import click_steps
        prs = Presentation(str(a.pptx))
        src = [len(set(click_steps(s).values())) for s in prs.slides]
        own = [n for n, ins in zip(steps, inserted) if not ins]   # ไม่นับหน้าที่แทรกด้วย --insert
        if src != own:
            print(f"ต่างจากต้นทาง: หน้า {len(src)} → {len(own)} · ขั้นต่อหน้า {src} → {own}")
            problems += 1
    for e in errors:
        print("JavaScript error:", e)
        problems += 1
    shots = sorted(a.out.glob("p*.png"))
    for s in range(0, len(shots), 9):
        sheet = Image.new("RGB", (480 * 3 + 20, 270 * 3 + 20), "white")
        for j, f in enumerate(shots[s:s + 9]):
            im = Image.open(f)
            im.thumbnail((480, 270))
            sheet.paste(im, ((j % 3) * 490, (j // 3) * 280))
        sheet.save(a.out / f"sheet-{s // 9 + 1}.png")
    print(f"{len(shots)} หน้า · ขั้นรวม {sum(steps)} · ปัญหา {problems} จุด · ภาพอยู่ที่ {a.out}")
    raise SystemExit(1 if problems else 0)


if __name__ == "__main__":
    main()
