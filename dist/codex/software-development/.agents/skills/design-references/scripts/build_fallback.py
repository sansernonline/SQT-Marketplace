"""สร้าง data/palettes-fallback.csv ใหม่ (คลังสำรองตอนค้นสดไม่ได้) · รันตอนอัปเดตข้อมูลเท่านั้น

  python build_fallback.py
  python build_fallback.py --self-test

แหล่ง (ตรวจใบอนุญาต 2026-10-27):
  - Wada · mattdesl/dictionary-of-colour-combinations (MIT) · คู่สีจากหนังสือของ Sanzo Wada
  - huggingface-projects/color-palettes-sd (CC BY 4.0) · สีที่ถอดจากภาพพร้อมคำบรรยาย · คัดชุดที่มีสีสว่างหรือมืดพอ
    และสีจัดไม่เกิน 2 สี · 1 คำบรรยายเก็บชุดเดียว
ทุกชุดจัดเป็น 8 หน้าที่ด้วย roles() ตัวเดียวกับ find_refs.py palette-from
"""
import csv
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from find_refs import ROLES, contrast, lum, mix, roles, sat  # noqa: E402

OUT = Path(__file__).resolve().parent.parent / "data" / "palettes-fallback.csv"
WADA = "https://raw.githubusercontent.com/mattdesl/dictionary-of-colour-combinations/master/colors.json"
SD = "https://huggingface.co/datasets/huggingface-projects/color-palettes-sd/resolve/main/data.json"
STOP = set("a an the of by and with in on at to for from painting photo art style artstation trending highly detailed "
           "digital illustration 4k 8k hd hq render octane unreal engine concept beautiful portrait greg rutkowski".split())


def get(url, tries=4):
    req = urllib.request.Request(url, headers={"User-Agent": "sqt-marketplace design-references builder"})
    for i in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code < 500 or i == tries - 1:
                raise
            time.sleep(2 ** i)


def usable(colors):
    """มีสีสว่างหรือมืดพอเป็นพื้นหรือตัวหนังสือ และสีจัดไม่เกิน 2 สี (กันชุดสีตีกัน)"""
    return any(lum(c) > 0.75 or lum(c) < 0.03 for c in colors) and sum(sat(c) > 150 for c in colors) <= 2


def keywords(prompt):
    words = re.findall(r"[a-z]+", prompt.lower())
    return " ".join(dict.fromkeys(w for w in words if len(w) > 2 and w not in STOP))[:120]


def by_area(colors):
    """แหล่งข้อมูลไม่มีสัดส่วนพื้นที่ · พื้นใช้สีที่สว่างที่สุดถ้าสว่างพอ หรือสีที่มืดมากถ้ามี
    ไม่มีทั้งคู่ (เช่นคู่สีของ Wada ที่เป็นสีกลาง) ให้สร้างพื้นอ่อนจากสีที่สว่างที่สุด แล้วสีเดิมทุกสีเป็นสีหลัก รอง เน้น"""
    light, dark = max(colors, key=lum), min(colors, key=lum)
    if lum(light) > 0.6:
        bg = light
    elif lum(dark) < 0.03:
        bg = dark
    else:
        bg = mix(light, "#ffffff", 0.9)
    return [(bg, 1.0)] + [(c, 0.1) for c in colors if c != bg]


def good(r):
    return (contrast(r["text"], r["bg"]) >= 4.5 and contrast(r["primary"], r["bg"]) >= 3
            and min(contrast(r["text_muted"], r["bg"]), contrast(r["text_muted"], r["surface"])) >= 4.5)


def rows():
    wada, combos = get(WADA), {}
    for c in wada:
        for k in c["combinations"]:
            combos.setdefault(k, []).append(c)
    for k in sorted(combos):
        cols = [c["hex"].lower() for c in combos[k]]
        yield {"id": f"wada-{k}", "source": "wada", "keywords": " · ".join(c["name"].lower() for c in combos[k]),
               **roles(by_area(cols))}
    seen = set()
    for row in get(SD):
        kw = keywords(row["data"].get("prompt") or "")
        if not kw or kw in seen:
            continue
        cands = []
        for img in row["data"].get("images") or []:
            cols = [c.lower() for c in img.get("colors") or [] if re.fullmatch(r"#[0-9a-fA-F]{6}", c)]
            if len(cols) >= 4 and usable(cols):
                cands.append((sum(sat(c) > 150 for c in cols), cols))
        if cands:
            seen.add(kw)
            yield {"id": f"sd-{row['id']}", "source": "sd", "keywords": kw, **roles(by_area(min(cands)[1]))}


def self_test():
    r = roles(by_area(["#f5efe6", "#2b1d14", "#c2461a", "#6f8f72"]))
    ok = [("ได้ 8 หน้าที่ครบ", list(r) == ROLES),
          ("พื้นคือสีที่สว่างที่สุด", r["bg"] == "#f5efe6"),
          ("สีหลักได้ contrast อย่างน้อย 3:1 กับพื้น", contrast(r["primary"], r["bg"]) >= 3),
          ("ชุดนีออนตีกันไม่ผ่าน", not usable(["#00ff00", "#ff00ff", "#00ffff", "#ffff00"])),
          ("คำค้นตัดคำทั่วไปออก", keywords("a painting of a Ferrari by Claude Monet") == "ferrari claude monet")]
    for name, passed in ok:
        print(f"  {'ผ่าน' if passed else 'ล้ม'} {name}")
    n = sum(p for _, p in ok)
    print(f"\nself-test {n}/{len(ok)} ผ่าน")
    return n == len(ok)


def main():
    if "--self-test" in sys.argv:
        sys.exit(0 if self_test() else 1)
    allrows = list(rows())
    data = [r for r in allrows if good(r)]  # ตัดชุดที่ตัวหนังสือหรือสีหลักได้ contrast ไม่ถึง
    print(f"ตัดชุดที่ contrast ไม่ถึง {len(allrows) - len(data)} ชุด")
    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["id", "source", "keywords", *ROLES])
        w.writeheader()
        w.writerows(data)
    n_w = sum(r["source"] == "wada" for r in data)
    print(f"เขียน {OUT.name} {len(data)} ชุด (wada {n_w} · sd {len(data) - n_w}) · {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
