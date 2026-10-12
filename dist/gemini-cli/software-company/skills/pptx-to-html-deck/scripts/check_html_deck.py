"""check_html_deck.py — เปิดเด็คที่แปลงจาก .pptx ในเบราว์เซอร์จริง ถ่ายทุกหน้า แล้วหาจุดที่แปลงไม่ตรง

    python check_html_deck.py deck.html --out _to_delete/deck-check [--pptx deck.pptx]

ได้: p01.png … · sheet-1.png … (9 หน้าต่อแผ่น) · รายการปัญหาใน stdout · exit 1 เมื่อพบปัญหา
ปัญหาที่หา: ข้อความล้นกล่องเดิมของ PowerPoint เกิน 16px (ฟอนต์ต่างจากเครื่องที่ทำ .pptx) · ข้อความล้นขอบสไลด์ · รูปไม่ขึ้น
· ชิ้นที่แปลงไม่ได้ · JavaScript error · กด → จากหน้าแรกแล้วไม่ถึงหน้าสุดท้ายครบทุกขั้น
--pptx ใส่ไฟล์ต้นทาง = เทียบจำนวนหน้า และจำนวนขั้น On Click
ต้องมี playwright (pip install playwright && playwright install chromium) และ Pillow
"""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

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


def main() -> None:
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
        presses = 0
        while presses < 2000 and not page.evaluate("i===S.length-1&&st>=steps(S[i])"):
            page.keyboard.press("ArrowRight")
            presses += 1
        expect = len(names) - 1 + sum(steps)
        if presses != expect:
            print(f"กด → {presses} ครั้งถึงท้ายเด็ค · ควรเป็น {expect} (หน้า {len(names)} · ขั้น {sum(steps)})")
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
