"""check-figure-source.py — ไฟล์ต้นทางของรูปต้องเริ่มจากโครงของ diagram-figures

ใช้:
  python check-figure-source.py docs/figures/src            ไล่ทุก .html ในโฟลเดอร์
  python check-figure-source.py docs/figures/src/fig1.html
  python check-figure-source.py --self-test

ผ่านเมื่อไฟล์มีอย่างใดอย่างหนึ่ง:
  <!-- from diagram-figures/assets/<โครง>.html -->      (บรรทัดที่ผู้เขียนรูปใส่เอง)
  หัวคอมเมนต์ "โครงที่ N · ... — ของ skill `diagram-figures`" ที่ติดมากับโครงทุกตัว

exit 0 = ผ่าน · exit 1 = มีไฟล์ที่ไม่ได้เริ่มจากโครง หรือไม่พบไฟล์ .html เลย
"""
import re
import sys
from pathlib import Path

MARKER = re.compile(r"<!--\s*from\s+diagram-figures/assets/figure-[\w-]+\.html\s*-->"
                    r"|โครงที่\s*\d+\s*·.*ของ skill `diagram-figures`")


def check(text: str) -> bool:
    """True เมื่อไฟล์บอกที่มาว่าเริ่มจากโครงของ diagram-figures"""
    return bool(MARKER.search(text))


def self_test() -> None:
    cases = [
        ("บรรทัด from ผ่าน", check("<!-- from diagram-figures/assets/figure-flow.html -->\n<div>")),
        ("หัวคอมเมนต์ของโครงผ่าน", check("<!--\n  โครงที่ 4 · Flow — ของ skill `diagram-figures`\n-->")),
        ("ไม่มีที่มาถูกจับ", not check("<html><body>kit ของตัวเอง</body></html>")),
        ("from ที่ชี้ไฟล์อื่นถูกจับ", not check("<!-- from my-kit/figure.html -->")),
    ]
    for name, ok in cases:
        print(("✓ " if ok else "✗ ") + name)
    fail = sum(not ok for _, ok in cases)
    print(f"✗ self-test ไม่ผ่าน {fail}/{len(cases)}" if fail else f"✓ self-test ผ่าน {len(cases)}/{len(cases)}")
    sys.exit(1 if fail else 0)


def main(args: list[str]) -> None:
    if args[:1] == ["--self-test"]:
        self_test()
    if not args:
        print(__doc__)
        sys.exit(1)
    files = [f for a in args for f in (sorted(Path(a).rglob("*.html")) if Path(a).is_dir() else [Path(a)])]
    if not files:  # ตรวจศูนย์ไฟล์ = path ผิด ไม่ใช่ผ่าน
        print("✗ ไม่พบไฟล์ .html — path ถูกไหม")
        sys.exit(1)
    bad = [f for f in files if not check(f.read_text(encoding="utf-8"))]
    for f in bad:
        print(f"✗ {f} ไม่ได้เริ่มจากโครงของ diagram-figures — คัดลอก assets/figure-*.html "
              "แล้วใส่ <!-- from diagram-figures/assets/<โครง>.html -->")
    print(f"✗ ไม่ผ่าน {len(bad)}/{len(files)} ไฟล์" if bad else f"✓ ผ่าน — {len(files)} ไฟล์เริ่มจากโครงของ diagram-figures")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main(sys.argv[1:])
