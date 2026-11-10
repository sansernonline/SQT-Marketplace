"""build_deck.py — รวม shell + slides เป็นไฟล์ .html ไฟล์เดียว เปิดได้แบบไม่ต่อเน็ต (ยกเว้นฟอนต์)

    python build_deck.py slides.html -o docs/Project_Presentation-v1.0.html --title "ชื่อเด็ค"
    python build_deck.py slides.html -o out.html --brand <สีหลัก>,<สีสว่าง> --data data.json --css extra.css --js extra.js

- รูปที่ slides อ้างด้วย path ในเครื่อง (src="...") ถูกฝังเป็น data URI เฉพาะไฟล์รูปที่อยู่ใต้โฟลเดอร์ slides หรือโฟลเดอร์ที่รันคำสั่ง · ไฟล์อื่นถูกข้ามและรายงานว่าหาไม่เจอ · รูปกว้างเกิน --max-width ถูกย่อเป็น JPEG
- --brand สีหลัก,สีสว่าง[,สีรอง] → แทน --accent/--accent2(/--accent3) และคำนวณ --accent-deep/--accent-tint ให้
- --theme bright → พื้นสว่าง + ปก/หน้าเปิดส่วน/หน้าปิดเป็นพื้นสีแบรนด์ทึบ (assets/theme-bright.css) · สีเน้นถูกปรับจนอ่านได้ 4.5:1
  <section data-tone="2"> ใช้สีรองแทนสีหลักทั้งแผ่น
- --data ไฟล์ JSON ใส่ไว้ที่ตัวแปร DATA ในหน้า สำหรับ JS เพิ่มเติมที่อ่านข้อมูล
ต้องมี Pillow ถ้าจะย่อรูป

    python build_deck.py --self-test       # สร้างเด็คจาก assets/slides-example.html แล้วนับหน้า รูปฝัง สี ชื่อ
"""
from __future__ import annotations

import argparse
import base64
import io
import json
import mimetypes
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
SHELL = HERE.parent / "assets" / "shell.html"


def data_uri(path: Path, max_width: int) -> str:
    """รูปเล็กฝังตรง · รูปกว้างเกินย่อเป็น JPEG 80% ให้ไฟล์ไม่บวม · SVG ฝังเป็นข้อความ"""
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    raw = path.read_bytes()
    if mime in ("image/png", "image/jpeg") and max_width:
        try:
            from PIL import Image
            im = Image.open(io.BytesIO(raw))
            if im.width > max_width:
                im = im.resize((max_width, round(im.height * max_width / im.width)), Image.LANCZOS)
                buf = io.BytesIO()
                if im.mode in ("RGBA", "LA", "P"):        # รูปโปร่งใส (โลโก้) เก็บเป็น PNG
                    im.save(buf, "PNG", optimize=True)
                else:
                    im.convert("RGB").save(buf, "JPEG", quality=80, optimize=True)
                    mime = "image/jpeg"
                raw = buf.getvalue()
        except ImportError:
            pass
    return f"data:{mime};base64,{base64.b64encode(raw).decode()}"


def embed_images(html: str, base: Path, max_width: int) -> tuple[str, list[str]]:
    missing = []

    def swap(m):
        src = m.group(2)
        if re.match(r"(data:|https?:|//)", src):
            return m.group(0)
        path = (base / src).resolve()
        mime = mimetypes.guess_type(path.name)[0] or ""
        inside = any(path.is_relative_to(root) for root in (base.resolve(), Path.cwd().resolve()))
        if not path.exists() or not mime.startswith("image/") or not inside:
            missing.append(src)                          # ฝังเฉพาะรูป ใต้โฟลเดอร์ slides หรือโฟลเดอร์โปรเจกต์
            return m.group(0)
        return f'{m.group(1)}{data_uri(path, max_width)}{m.group(3)}'

    return re.sub(r'(<img\b[^>]*?\bsrc=")([^"]+)(")', swap, html), missing


BRIGHT_CSS = HERE.parent / "assets" / "theme-bright.css"
WHITE, INK = "ffffff", "1d1f24"


def shade(hex6: str, k: float, toward: str = "09090a") -> str:
    """ผสมสีแบรนด์กับสีพื้น: k = สัดส่วนสีแบรนด์"""
    a, b = [int(hex6[i:i + 2], 16) for i in (0, 2, 4)], [int(toward[i:i + 2], 16) for i in (0, 2, 4)]
    return "#" + "".join(f"{round(x * k + y * (1 - k)):02x}" for x, y in zip(a, b))


def contrast(a: str, b: str) -> float:
    def lum(h):
        f = lambda c: c / 12.92 if c <= .03928 else ((c + .055) / 1.055) ** 2.4
        r, g, bl = (f(int(h.lstrip("#")[i:i + 2], 16) / 255) for i in (0, 2, 4))
        return .2126 * r + .7152 * g + .0722 * bl
    x, y = sorted((lum(a), lum(b)), reverse=True)
    return (x + .05) / (y + .05)


def readable_on(bg: str, color: str, target: float = 4.5) -> str:
    """ผสมสีเข้าหาดำทีละนิดจนอ่านได้บนพื้นสว่าง bg · ใช้เป็นสีตัวอักษรเน้น (--accent2) ของธีมสว่าง"""
    k, out = 1.0, "#" + color
    while contrast(out, bg) < target and k > .3:
        k -= .05
        out = shade(color, k, "000000")
    return out


def on_colour(fill: str) -> str:
    """สีตัวอักษรบนพื้นสีแบรนด์ทึบ: ตัวแรกที่ได้ 4.5:1 จากขาว → เกือบดำ → ดำ (ดำได้ ≥ 4.58 กับทุกสีที่ขาวไม่ถึง)"""
    for ink in (WHITE, INK, "000000"):
        if contrast(ink, fill) >= 4.5:
            return "#" + ink
    return "#" + max((WHITE, "000000"), key=lambda c: contrast(c, fill))


def brand_css(spec: str, theme: str = "dark") -> str:
    """spec = สีหลัก,สีสว่าง[,สีรอง] · ธีมเข้มคำนวณ deep/tint เข้าหาพื้นมืด · ธีมสว่างคำนวณเข้าหาขาว"""
    parts = [c.strip().lstrip("#") for c in spec.split(",") if c.strip()]
    main, light = (parts + parts)[:2]
    third = parts[2] if len(parts) > 2 else main
    if theme != "bright":
        return (f":root{{--accent:#{main};--accent2:#{light};--accent-deep:{shade(main, .2)};"
                f"--accent-tint:{shade(main, .12)}}}")  # ธีมเข้มคงผลเดิมทุกไบต์ · สีรองและพื้นทึบใช้กับธีม bright
    panel = shade(main, .06, WHITE)
    return (f":root{{--bg:#{WHITE};--panel:{panel};--line:{shade(main, .2, WHITE)};"
            f"--text:#{INK};--soft:#3a3e46;--muted:#4f5560;--dim:#626873;"
            f"--ok:#17803d;--warn:#a85a00;--blue:#1d5fbf;"
            f"--accent:#{main};--accent2:{readable_on(panel, light)};"
            f"--accent-deep:{shade(main, .22, WHITE)};--accent-tint:{shade(main, .1, WHITE)};"
            f"--accent3:#{third};--accent3-hi:{readable_on(panel, third)};"
            f"--accent3-deep:{shade(third, .22, WHITE)};--accent3-tint:{shade(third, .1, WHITE)};"
            f"--on-accent:{on_colour(main)};--on-accent3:{on_colour(third)};"
            f"--on-accent-panel:rgba(255,255,255,.16);--on-accent-line:rgba(255,255,255,.35)}}")


def build(slides: Path, out: Path, title: str, brand: str | None, data: Path | None,
          css: Path | None, js: Path | None, max_width: int, theme: str = "dark") -> list[str]:
    body, missing = embed_images(slides.read_text(encoding="utf-8"), slides.parent, max_width)
    if theme == "bright" and not brand:
        brand = "2A78D6,1F5FAF"  # สีประจำบ้านบนพื้นขาว · ไม่มีสีของงานเลยเท่านั้น
    extra_css = ((brand_css(brand, theme) if brand else "")
                 + (BRIGHT_CSS.read_text(encoding="utf-8") if theme == "bright" else "")
                 + (css.read_text(encoding="utf-8") if css else ""))
    page = (SHELL.read_text(encoding="utf-8")
            .replace("<!--TITLE-->", title)
            .replace("<!--SLIDES-->", body)
            .replace("/*EXTRA_CSS*/", extra_css)
            .replace("/*EXTRA_JS*/", js.read_text(encoding="utf-8") if js else "")
            .replace("/*DATA*/null", json.dumps(json.loads(data.read_text(encoding="utf-8")), ensure_ascii=False)
                     if data else "null"))
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8")
    return missing


def self_test() -> int:
    import tempfile
    example = HERE.parent / "assets" / "slides-example.html"
    src = example.read_text(encoding="utf-8")
    with tempfile.TemporaryDirectory() as tmp:
        out = Path(tmp) / "deck.html"
        missing = build(example, out, "Self Test Deck", "2A78D6,5B9BE6", None, None, None, 1600)
        page = out.read_text(encoding="utf-8")
        bad = Path(tmp) / "bad.html"
        bad.write_text('<section class="slide"><img src="no-such.png"></section>', encoding="utf-8")
        missing_bad = build(bad, Path(tmp) / "bad-out.html", "x", None, None, None, None, 1600)
        build(example, Path(tmp) / "bright.html", "x", "FFD166,FFD166,0E8F86", None, None, None, 1600, "bright")
        bright = (Path(tmp) / "bright.html").read_text(encoding="utf-8")
    accent2 = re.search(r"--accent2:(#[0-9a-fA-F]{6})", bright).group(1)
    panel = re.search(r"--panel:(#[0-9a-fA-F]{6})", bright).group(1)
    count = lambda h: len(re.findall(r'<section[^>]*class="slide', h))
    checks = {
        "จำนวนหน้าเท่าต้นฉบับ": count(page) == count(src) > 0,
        "ชื่อเด็คอยู่ใน <title>": "<title>Self Test Deck</title>" in page,
        "สีแบรนด์ลงใน CSS": "--accent:#2A78D6" in page and "--accent-deep:#" in page,
        "รูปในเครื่องถูกฝังเป็น data URI": 'src="example-logo.png"' not in page and 'src="data:image/png;base64,' in page,
        "ไม่มีรูปหาย": missing == [],
        "รูปที่ไม่มีถูกรายงาน": missing_bad == ["no-such.png"],
        "ไม่เหลือ placeholder": not re.search(r"<!--(TITLE|SLIDES)-->|/\*EXTRA_CSS\*/", page),
        "ธีมสว่าง: พื้นขาวและปกเป็นพื้นสีแบรนด์ทึบ": "--bg:#ffffff" in bright and ".slide.hero,.slide.close,.divider{background:var(--accent)" in bright,
        "ธีมสว่าง: สีเหลืองอ่อนถูกเข้มขึ้นจนอ่านได้บนการ์ด": contrast(accent2, panel) >= 4.5,
        "ธีมสว่าง: บนพื้นเหลืองใช้ตัวอักษรเข้ม": "--on-accent:#1d1f24" in bright,
        "ธีมสว่าง: หัวเรื่องบนหน้าสีทึบใช้สี on-accent (สีจาก body ไม่สืบทอดค่าใหม่)": "background:var(--accent);color:var(--on-accent)" in bright,
        "ธีมสว่าง: ตัวอักษรบนพื้นทึบได้ ≥ 4.5:1 ทุกสีที่ทดสอบ": all(
            contrast(on_colour(c), c) >= 4.5 for c in ("E4572E", "0E8F86", "E8344E", "2A78D6", "D9534F", "FFD166", "7B2CBF")),
        "ธีมสว่าง: สีรองลง --accent3": "--accent3:#0E8F86" in bright,
    }
    for name, ok in checks.items():
        print("ok  " if ok else "FAIL", name)
    print(f"self-test {sum(checks.values())}/{len(checks)}")
    return 0 if all(checks.values()) else 1


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("slides", type=Path, help="ไฟล์ที่มีแต่ <section class=\"slide\"> เรียงกัน")
    ap.add_argument("-o", "--out", type=Path, required=True)
    ap.add_argument("--title", default="Presentation")
    ap.add_argument("--brand", help="สีหลัก,สีสว่าง[,สีรอง] ของงาน (hex ไม่มี #) เช่น 2A78D6,5B9BE6 · หาด้วย presentation-design/scripts/source_palette.py")
    ap.add_argument("--theme", choices=["dark", "bright"], default="dark",
                    help="bright = พื้นสว่าง ปกและหน้าเปิดส่วนเป็นพื้นสีแบรนด์ทึบ (เด็คใหม่ใช้ตัวนี้ เว้นแต่งานต้นทางเป็นพื้นเข้ม)")
    ap.add_argument("--data", type=Path, help="JSON → ตัวแปร DATA")
    ap.add_argument("--css", type=Path, help="CSS เพิ่มของเด็คนี้")
    ap.add_argument("--js", type=Path, help="JS เพิ่มของเด็คนี้ (ใช้ S · show() · DATA ได้)")
    ap.add_argument("--max-width", type=int, default=1600, help="ย่อรูปที่กว้างเกินนี้ (0 = ไม่ย่อ)")
    a = ap.parse_args()
    missing = build(a.slides, a.out, a.title, a.brand, a.data, a.css, a.js, a.max_width, a.theme)
    size = a.out.stat().st_size / 1e6
    print(f"wrote {a.out} · {size:.1f} MB")
    if missing:
        raise SystemExit("ไม่พบรูป: " + ", ".join(missing))


if __name__ == "__main__":
    import sys
    sys.exit(self_test()) if "--self-test" in sys.argv else main()
