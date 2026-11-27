"""sticker_check.py — ตรวจไฟล์สติกเกอร์หรืออีโมจิ LINE ในเครื่องก่อนอัปโหลดไป Creators Market (ไม่ใช้เครือข่าย)

    python sticker_check.py DIR --kind static          # โฟลเดอร์ที่มี main.png tab.png 01.png 02.png ...
    python sticker_check.py a.png b.png --kind animated
    python sticker_check.py DIR --kind emoji
    python sticker_check.py --self-test

ชื่อ main.png และ tab.png ถือเป็นภาพหลักและภาพแท็บ (ธรรมเนียมของสคริปต์นี้) ไฟล์อื่นเป็นภาพสติกเกอร์
เพดานอ่านจาก references/sticker-limits.json (มีวันตรวจ) · ใช้แค่ Python มาตรฐาน อ่าน PNG/APNG เอง
ผ่านที่นี่แล้วยังต้องผ่านการตรวจของ LINE เอง (เนื้อหา ลิขสิทธิ์ ฟอนต์) สคริปต์ตรวจเฉพาะตัวเลขและพื้นโปร่ง
ตรวจพิกเซลจริง (พื้นโปร่ง ขอบเนื้อหา) เฉพาะ PNG แบบ RGBA 8 บิต · แบบอื่นตรวจแค่ว่ามีช่องโปร่งไหม
"""
from __future__ import annotations

import argparse
import json
import struct
import sys
import tempfile
import zlib
from datetime import date
from pathlib import Path

LIMITS = Path(__file__).resolve().parent.parent / "references" / "sticker-limits.json"
SIG = b"\x89PNG\r\n\x1a\n"


def chunks(data: bytes):
    i = 8
    while i + 8 <= len(data):
        n = struct.unpack(">I", data[i:i + 4])[0]
        yield data[i + 4:i + 8], data[i + 8:i + 8 + n]
        i += 12 + n


def read_png(data: bytes) -> dict | None:
    """ขนาด · ชนิดสี · มีช่องโปร่งไหม · APNG (เฟรม รอบ วินาที) · ขอบเนื้อหาจริง (เฉพาะ RGBA 8 บิต)"""
    if data[:8] != SIG:
        return None
    info = {"alpha": False, "frames": 1, "plays": None, "seconds": 0.0, "apng": False, "bbox": None, "transparent": None}
    idat = b""
    for kind, body in chunks(data):
        if kind == b"IHDR":
            info["w"], info["h"], info["depth"], info["ctype"] = struct.unpack(">IIBB", body[:10])
            info["alpha"] = info["ctype"] in (4, 6)
        elif kind == b"tRNS":
            info["alpha"] = True
        elif kind == b"acTL":
            info["apng"] = True
            info["frames"], info["plays"] = struct.unpack(">II", body[:8])
        elif kind == b"fcTL":
            num, den = struct.unpack(">HH", body[20:24])
            info["seconds"] += num / (den or 100)
        elif kind == b"IDAT":
            idat += body
    if "w" not in info:
        return None
    if info["ctype"] == 6 and info["depth"] == 8 and idat:
        info.update(alpha_scan(zlib.decompress(idat), info["w"], info["h"]))
    return info


def alpha_scan(raw: bytes, w: int, h: int) -> dict:
    """ถอดฟิลเตอร์ PNG แล้วหาขอบของพิกเซลที่ไม่โปร่งใส · bbox=(x0,y0,x1,y1) หรือ None ถ้าโปร่งทั้งภาพ"""
    bpp, stride = 4, w * 4
    prev = bytearray(stride)
    x0, y0, x1, y1 = w, h, -1, -1
    transparent = 0
    p = 0
    for y in range(h):
        f = raw[p]
        line = bytearray(raw[p + 1:p + 1 + stride])
        p += 1 + stride
        for i in range(stride):
            a = line[i - bpp] if i >= bpp else 0
            b = prev[i]
            c = prev[i - bpp] if i >= bpp else 0
            if f == 1:
                line[i] = (line[i] + a) & 255
            elif f == 2:
                line[i] = (line[i] + b) & 255
            elif f == 3:
                line[i] = (line[i] + (a + b) // 2) & 255
            elif f == 4:
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                pr = a if pa <= pb and pa <= pc else (b if pb <= pc else c)
                line[i] = (line[i] + pr) & 255
        prev = line
        for x in range(w):
            if line[x * 4 + 3] == 0:
                transparent += 1
            else:
                x0, x1 = min(x0, x), max(x1, x)
                y0, y1 = min(y0, y), max(y1, y)
    return {"bbox": None if x1 < 0 else (x0, y0, x1, y1), "transparent": transparent}


def check_file(path: Path, kind: str, role: str, lim: dict) -> list[str]:
    bad = []
    data = path.read_bytes()
    n = path.name
    if len(data) > lim["max_file_bytes"]:
        bad.append(f"{n}: ไฟล์ {len(data) / 1e6:.2f} MB เกิน 1 MB")
    info = read_png(data)
    if info is None:
        return bad + [f"{n}: ไม่ใช่ไฟล์ PNG (LINE รับเฉพาะ .png)"]
    k = lim[kind]
    w, h = info["w"], info["h"]
    if w % 2 or h % 2:
        bad.append(f"{n}: {w}×{h} ต้องกว้างและสูงเป็นเลขคู่")
    if kind == "emoji":
        if (w, h) != tuple(k["size"]):
            bad.append(f"{n}: {w}×{h} ต้อง {k['size'][0]}×{k['size'][1]}")
    elif role in ("main", "tab"):
        if (w, h) != tuple(k[role]):
            bad.append(f"{n}: {w}×{h} ต้อง {k[role][0]}×{k[role][1]} ({role})")
    elif w > k["sticker_max"][0] or h > k["sticker_max"][1]:
        bad.append(f"{n}: {w}×{h} เกินสูงสุด {k['sticker_max'][0]}×{k['sticker_max'][1]}")
    if not info["alpha"]:
        bad.append(f"{n}: ไม่มีช่องโปร่งใส (พื้นหลังต้องโปร่ง)")
    elif info["transparent"] is not None:
        if info["bbox"] is None:
            bad.append(f"{n}: โปร่งใสทั้งภาพ")
        elif info["transparent"] == 0:
            bad.append(f"{n}: มีช่องโปร่งแต่ไม่มีพิกเซลโปร่งเลย พื้นหลังยังทึบ")
    if kind == "static" and role == "sticker" and info["bbox"]:
        x0, y0, x1, y1 = info["bbox"]
        m = min(x0, y0, w - 1 - x1, h - 1 - y1)
        if m < lim["margin_px"] // 2:
            bad.append(f"{n}: เนื้อหาชิดขอบ {m} px · LINE แนะนำเว้นราว {lim['margin_px']} px (เตือน)")
    if kind == "animated" and role == "sticker":
        if not info["apng"]:
            bad.append(f"{n}: ไม่ใช่ APNG (ไม่พบ acTL)")
        else:
            lo, hi = k["frames"]
            if not lo <= info["frames"] <= hi:
                bad.append(f"{n}: {info['frames']} เฟรม ต้อง {lo}-{hi}")
            plays = info["plays"]
            lo, hi = k["loops"]
            if plays == 0 or not lo <= plays <= hi:
                bad.append(f"{n}: วนซ้ำ {plays or 'ไม่จำกัด'} รอบ ต้อง {lo}-{hi}")
            total = info["seconds"] * (plays or 1)
            if total > k["max_seconds"] + 1e-6:
                bad.append(f"{n}: เล่นรวม {total:.2f} วินาที เกิน {k['max_seconds']}")
    return bad


def check_set(files: list[Path], kind: str, lim: dict) -> list[str]:
    bad, stickers = [], []
    for f in files:
        role = {"main.png": "main", "tab.png": "tab"}.get(f.name.lower(), "sticker")
        if role == "sticker":
            stickers.append(f)
        bad += check_file(f, kind, role, lim)
    if kind == "emoji":
        lo, hi = lim["emoji"]["counts_regular"]
        if not lo <= len(stickers) <= hi:
            bad.append(f"อีโมจิธรรมดา {len(stickers)} ภาพ ต้อง {lo}-{hi} (ชุดตัวอักษรมีจำนวนอื่น ตรวจเองที่หน้า LINE)")
    else:
        if len(stickers) not in lim[kind]["counts"]:
            bad.append(f"สติกเกอร์ {len(stickers)} ภาพ ต้องเป็นหนึ่งใน {lim[kind]['counts']}")
        names = {f.name.lower() for f in files}
        for need in ("main.png", "tab.png"):
            if need not in names:
                bad.append(f"ไม่พบ {need} (ภาพ{'หลัก' if need == 'main.png' else 'แท็บ'})")
    return bad


# ---- ตัวสร้างไฟล์ทดสอบ ----

def _ck(t: bytes, b: bytes) -> bytes:
    return struct.pack(">I", len(b)) + t + b + struct.pack(">I", zlib.crc32(t + b) & 0xFFFFFFFF)


def _png(w, h, pixel, ctype=6, extra=b""):
    """PNG RGBA 8 บิต · pixel(x,y) คืน (r,g,b,a) · ctype=2 ทำ RGB ไม่มีช่องโปร่ง"""
    n = 4 if ctype == 6 else 3
    raw = b"".join(b"\x00" + b"".join(bytes(pixel(x, y)[:n]) for x in range(w)) for y in range(h))
    return (SIG + _ck(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, ctype, 0, 0, 0)) + extra
            + _ck(b"IDAT", zlib.compress(raw)) + _ck(b"IEND", b""))


def _actl(frames, plays):
    return _ck(b"acTL", struct.pack(">II", frames, plays))


def _fctl(num, den):
    return _ck(b"fcTL", struct.pack(">IIIIIHHBB", 0, 10, 10, 0, 0, num, den, 0, 0))


def self_test() -> int:
    lim = json.loads(LIMITS.read_text(encoding="utf-8"))

    def art(x, y, size=(100, 80), m=20):  # สี่เหลี่ยมแดงกลางภาพ เว้นขอบ m
        return (255, 0, 0, 255) if m <= x < size[0] - m and m <= y < size[1] - m else (0, 0, 0, 0)

    good = _png(100, 80, art)
    cases = [  # (ชื่อ, ไฟล์, ชนิด, บทบาท, จำนวนข้อที่ต้องจับ)
        ("สติกเกอร์ 100×80 ดี", good, "static", "sticker", 0),
        ("พื้นทึบ (จับ 2 ข้อ: ไม่มีพิกเซลโปร่ง และชิดขอบ)", _png(100, 80, lambda x, y: (255, 255, 255, 255)), "static", "sticker", 2),
        ("ไม่มีช่องโปร่ง (RGB)", _png(100, 80, lambda x, y: (1, 2, 3, 255), ctype=2), "static", "sticker", 1),
        ("ขนาดเลขคี่ 101×81", _png(101, 81, lambda x, y: art(x, y, (101, 81))), "static", "sticker", 1),
        ("ใหญ่เกิน 400×320", _png(400, 320, lambda x, y: art(x, y, (400, 320))), "static", "sticker", 1),
        ("เนื้อหาชิดขอบ", _png(100, 80, lambda x, y: (0, 0, 0, 0) if (x, y) == (50, 40) else (255, 0, 0, 255)), "static", "sticker", 1),
        ("ภาพหลักต้อง 240×240", good, "static", "main", 1),
        ("อีโมจิ 180×180 ดี", _png(180, 180, lambda x, y: art(x, y, (180, 180))), "emoji", "sticker", 0),
        ("APNG 8 เฟรม 2 รอบ 0.1 วิ", _png(100, 80, art, extra=_actl(8, 2) + _fctl(1, 10)), "animated", "sticker", 0),
        ("APNG 3 เฟรม", _png(100, 80, art, extra=_actl(3, 2) + _fctl(1, 10)), "animated", "sticker", 1),
        ("APNG ยาวเกิน 4 วินาที", _png(100, 80, art, extra=_actl(8, 4) + _fctl(15, 10)), "animated", "sticker", 1),
        ("PNG นิ่งส่งเป็น animated", good, "animated", "sticker", 1),
    ]
    ok = True
    with tempfile.TemporaryDirectory() as d:
        for i, (name, data, kind, role, want) in enumerate(cases):
            p = Path(d) / f"t{i}.png"
            p.write_bytes(data)
            got = len(check_file(p, kind, role, lim))
            ok &= got == want
            print(f"{name}: จับได้ {got} ข้อ (ต้อง {want})", "ผ่าน" if got == want else "ไม่ผ่าน")
        big = Path(d) / "big.png"
        big.write_bytes(good + b"\0" * 1_100_000)
        got = len(check_file(big, "static", "sticker", lim))
        ok &= got == 1
        print(f"ไฟล์เกิน 1 MB: จับได้ {got} ข้อ (ต้อง 1)", "ผ่าน" if got == 1 else "ไม่ผ่าน")
        sd = Path(d) / "set"
        sd.mkdir()
        (sd / "main.png").write_bytes(_png(240, 240, lambda x, y: art(x, y, (240, 240))))
        (sd / "tab.png").write_bytes(_png(96, 74, lambda x, y: art(x, y, (96, 74), 12)))
        for i in range(7):
            (sd / f"{i + 1:02d}.png").write_bytes(good)
        got = len(check_set(sorted(sd.glob("*.png")), "static", lim))
        ok &= got == 1
        print(f"ชุด 7 ภาพ: จับได้ {got} ข้อ (ต้อง 1)", "ผ่าน" if got == 1 else "ไม่ผ่าน")
        (sd / "08.png").write_bytes(good)
        got = len(check_set(sorted(sd.glob("*.png")), "static", lim))
        ok &= got == 0
        print(f"ชุด 8 ภาพครบ: จับได้ {got} ข้อ (ต้อง 0)", "ผ่าน" if got == 0 else "ไม่ผ่าน")
    if date.today() > date.fromisoformat(lim["recheck_by"]):
        print(f"เตือน: เพดานตรวจล่าสุด {lim['checked']} เลยกำหนด {lim['recheck_by']} · เปิดหน้า LINE ตรวจก่อนเชื่อ")
    print("self-test", "ผ่าน" if ok else "ไม่ผ่าน")
    return 0 if ok else 1


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("paths", type=Path, nargs="*")
    ap.add_argument("--kind", choices=["static", "animated", "emoji"], default="static")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        sys.exit(self_test())
    if not a.paths:
        sys.exit("ใส่โฟลเดอร์หรือไฟล์ .png และ --kind static|animated|emoji")
    lim = json.loads(LIMITS.read_text(encoding="utf-8"))
    files = sorted(f for p in a.paths for f in (p.glob("*.png") if p.is_dir() else [p]))
    bad = check_set(files, a.kind, lim)
    for line in bad:
        print("ไม่ผ่าน:", line)
    print(f"ตรวจ {len(files)} ไฟล์ · " + ("ผ่านทุกข้อ · LINE ยังตรวจเนื้อหาและลิขสิทธิ์เอง" if not bad else f"ไม่ผ่าน {len(bad)} ข้อ"))
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
