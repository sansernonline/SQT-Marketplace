"""check_deck.py — เปิดเด็คในเบราว์เซอร์จริง ถ่ายภาพทุกหน้า และหาเนื้อหาที่ล้นกรอบ

    python check_deck.py docs/Project_Presentation-v1.0.html --out _to_delete/deck-check

ได้: หน้าละ 1 ภาพ (p01.png …) · sheet-1.png … (ภาพย่อ 9 หน้าต่อแผ่น ไว้เปิดดูทีเดียว) · รายการปัญหาใน stdout
ปัญหาที่หา: ทั้งหน้าสูงเกิน 1080 (scrollHeight) · ของล้นขอบ 1920×1080 · ทับแถบ foot ด้านล่าง · ข้อความใน card/detail/list ล้นกล่อง · ตัวอักษรเล็กกว่า 16px · รูปโหลดไม่ขึ้น
ต้องมี playwright (pip install playwright && playwright install chromium) และ Pillow
exit 1 เมื่อพบปัญหา
"""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

PROBE = """(s) => {
  const out = [], box = s.getBoundingClientRect(), k = box.width / 1920;
  const foot = 1080 - 120;                              // พื้นที่ของ .foot และ .pg
  const name = el => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '')
    + ' "' + (el.textContent || '').trim().slice(0, 40) + '"';
  if (s.scrollHeight > s.clientHeight + 2) out.push('เนื้อหาล้นหน้า: สูง ' + s.scrollHeight + ' px จาก 1080 (ถูกตัดทิ้งตอนฉาย)');
  for (const el of s.querySelectorAll('*')) {
    if (el.closest('aside,template,.chatlog') || !el.offsetParent) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const x = (r.left - box.left) / k, y = (r.top - box.top) / k, w = r.width / k, h = r.height / k;
    if (x < -1 || y < -1 || x + w > 1921 || y + h > 1081) out.push('ล้นขอบสไลด์: ' + name(el));
    else if (!el.matches('.foot,.pg') && !el.closest('.foot,.pg') && y + h > foot && getComputedStyle(el).position !== 'absolute' && !el.closest('[style*="absolute"]'))
      out.push('ทับแถบล่าง: ' + name(el));
    const cs = getComputedStyle(el);
    if (el.matches('.card,.detail,.list>div,.layer,.box,.toc a,pre') && cs.overflowY !== 'auto' && el.scrollHeight > el.clientHeight + 2)
      out.push('ข้อความล้นกล่อง: ' + name(el));
    if (el.children.length === 0 && el.textContent.trim() && parseFloat(cs.fontSize) < 16 && !el.closest('svg'))
      out.push('ตัวเล็กกว่า 16px: ' + name(el));
    if (el.tagName === 'IMG' && !(el.complete && el.naturalWidth)) out.push('รูปไม่ขึ้น: ' + (el.getAttribute('src') || '').slice(0, 60));
  }
  return [...new Set(out)];
}"""


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("deck", type=Path)
    ap.add_argument("--out", type=Path, default=Path("_to_delete/deck-check"))
    ap.add_argument("--wait", type=int, default=2600, help="มิลลิวินาทีที่รอให้ animation จบก่อนถ่าย")
    a = ap.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    problems = 0
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.goto(a.deck.resolve().as_uri())
        page.wait_for_timeout(1500)                         # รอฟอนต์
        names = page.evaluate("[...document.querySelectorAll('.slide')].map(s=>s.dataset.menu||s.id||'')")
        for n, name in enumerate(names):
            page.evaluate(f"show({n})")
            page.wait_for_timeout(a.wait)
            page.screenshot(path=str(a.out / f"p{n + 1:02d}.png"))
            for issue in page.evaluate(PROBE, page.query_selector_all(".slide")[n]):
                print(f"หน้า {n + 1:02d} {name}: {issue}")
                problems += 1
        browser.close()
    shots = sorted(a.out.glob("p*.png"))
    for s in range(0, len(shots), 9):
        sheet = Image.new("RGB", (480 * 3 + 20, 270 * 3 + 20), "white")
        for j, f in enumerate(shots[s:s + 9]):
            sheet.paste(Image.open(f).resize((480, 270)), ((j % 3) * 490, (j // 3) * 280))
        sheet.save(a.out / f"sheet-{s // 9 + 1}.png")
    print(f"{len(shots)} หน้า · ปัญหา {problems} จุด · ภาพอยู่ที่ {a.out}")
    raise SystemExit(1 if problems else 0)


if __name__ == "__main__":
    main()
