"""richmenu_check.py — ตรวจ JSON และภาพของ LINE rich menu ในเครื่อง ก่อนยิง API (ไม่ต้องมี token ไม่ใช้เครือข่าย)

    python richmenu_check.py menu.json menu.png      # ตรวจทั้งคู่
    python richmenu_check.py menu.json               # ตรวจเฉพาะ JSON
    python richmenu_check.py --self-test

เพดานอ่านจาก references/richmenu-limits.json (มีวันตรวจ) · ผ่านที่นี่แล้วยังต้องยิง POST /v2/bot/richmenu/validate ก่อนสร้างจริง
ใช้แค่ Python มาตรฐาน · อ่านขนาดภาพจากหัวไฟล์ PNG หรือ JPEG เอง
"""
from __future__ import annotations

import argparse
import json
import struct
import sys
from datetime import date
from pathlib import Path

LIMITS = Path(__file__).resolve().parent.parent / "references" / "richmenu-limits.json"


def image_info(data: bytes) -> tuple[str, int, int] | None:
    """(ชนิด, กว้าง, สูง) จากหัวไฟล์ · อ่านไม่ได้ → None"""
    if data[:8] == b"\x89PNG\r\n\x1a\n" and data[12:16] == b"IHDR":
        w, h = struct.unpack(">II", data[16:24])
        return "png", w, h
    if data[:2] == b"\xff\xd8":
        i = 2
        while i + 9 < len(data):
            if data[i] != 0xFF:
                i += 1
                continue
            marker = data[i + 1]
            if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):  # SOFn มีขนาดภาพ
                h, w = struct.unpack(">HH", data[i + 5:i + 9])
                return "jpeg", w, h
            i += 2 + struct.unpack(">H", data[i + 2:i + 4])[0]
    return None


def check(menu: dict, image: bytes | None, lim: dict) -> list[str]:
    """คืนรายการข้อที่ไม่ผ่าน · ว่าง = ผ่านทุกข้อ"""
    bad = []
    if not isinstance(menu, dict):
        return ["ราก JSON ต้องเป็นออบเจ็กต์ { ... } ที่มี size · chatBarText · areas ไม่ใช่ list หรือค่าเดี่ยว"]
    size = menu.get("size")
    size = size if isinstance(size, dict) else {}
    w, h = size.get("width"), size.get("height")
    if not (isinstance(w, int) and isinstance(h, int)):
        bad.append("size ต้องมี width และ height เป็นจำนวนเต็ม")
        w = h = None
    else:
        lo, hi = lim["width_range"]
        if not lo <= w <= hi:
            bad.append(f"กว้าง {w} px อยู่นอก {lo}-{hi} · ปรับภาพและ size ให้เป็น 2500×1686 หรือ 2500×843")
        if h < lim["min_height"]:
            bad.append(f"สูง {h} px ต่ำกว่า {lim['min_height']}")
        if w / h < lim["min_aspect_ratio"]:
            bad.append(f"สัดส่วน กว้าง/สูง {w / h:.2f} ต่ำกว่า {lim['min_aspect_ratio']} · เมนูแคบเกินไป")
    text = menu.get("chatBarText", "")
    if not isinstance(text, str):
        bad.append("chatBarText ต้องเป็นข้อความ")
        text = ""
    if not text or len(text) > lim["chat_bar_text_max"]:
        bad.append(f"chatBarText {len(text)} ตัว ต้อง 1-{lim['chat_bar_text_max']} ตัว · ย่อข้อความ")
    areas = menu.get("areas")
    if not isinstance(areas, list) or not areas:
        bad.append("ต้องมี areas อย่างน้อย 1 พื้นที่")
        areas = []
    elif len(areas) > lim["max_areas"]:
        bad.append(f"areas {len(areas)} พื้นที่ เกิน {lim['max_areas']} · รวมปุ่มที่ใกล้กัน")
    for n, a in enumerate(areas, 1):
        if not isinstance(a, dict):
            bad.append(f"areas[{n}] ต้องเป็นออบเจ็กต์ที่มี bounds และ action")
            continue
        b = a.get("bounds")
        if not isinstance(b, dict):
            bad.append(f"areas[{n}] ไม่มี bounds เป็นออบเจ็กต์ x y width height")
            continue
        try:
            x, y, bw, bh = (b[k] for k in ("x", "y", "width", "height"))
        except KeyError:
            bad.append(f"areas[{n}] bounds ขาด x y width หรือ height")
            continue
        if not all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in (x, y, bw, bh)):
            bad.append(f"areas[{n}] bounds ต้องเป็นตัวเลขทุกช่อง (x={x!r} y={y!r} width={bw!r} height={bh!r})")
            continue
        if w and (x < 0 or y < 0 or bw <= 0 or bh <= 0 or x + bw > w or y + bh > h):
            bad.append(f"areas[{n}] เกินขอบภาพ {w}×{h} (x={x} y={y} กว้าง={bw} สูง={bh})")
        act = a.get("action")
        if not (isinstance(act, dict) and act.get("type")):
            bad.append(f"areas[{n}] ไม่มี action.type")
    if image is not None:
        if len(image) > lim["max_file_bytes"]:
            bad.append(f"ไฟล์ภาพ {len(image) / 1e6:.2f} MB เกิน {lim['max_file_bytes'] / 1e6:.0f} MB · ลดสีเป็น PNG-8 หรือ JPEG คุณภาพ ~80")
        info = image_info(image)
        if info is None:
            bad.append("อ่านหัวไฟล์ภาพไม่ได้ · ต้องเป็น PNG หรือ JPEG")
        else:
            if info[0] not in lim["image_formats"]:
                bad.append(f"ชนิดภาพ {info[0]} ไม่รองรับ")
            if w and (info[1], info[2]) != (w, h):
                bad.append(f"ภาพ {info[1]}×{info[2]} ไม่ตรงกับ size ใน JSON {w}×{h}")
    return bad


def self_test() -> int:
    lim = json.loads(LIMITS.read_text(encoding="utf-8"))

    def png(w, h, pad=0):
        return (b"\x89PNG\r\n\x1a\n" + struct.pack(">I", 13) + b"IHDR" + struct.pack(">II", w, h)
                + b"\x08\x06\x00\x00\x00" + b"\0" * pad)

    def cell(x, y, w, h):
        return {"bounds": {"x": x, "y": y, "width": w, "height": h}, "action": {"type": "message", "text": "x"}}

    good = {"size": {"width": 2500, "height": 1686}, "chatBarText": "เมนู",
            "areas": [cell(0, 0, 833, 843), cell(833, 0, 834, 843), cell(1667, 0, 833, 843)]}
    jpeg = b"\xff\xd8\xff\xc0\x00\x11\x08" + struct.pack(">HH", 843, 2500) + b"\x03" + b"\0" * 9
    cases = [  # (ชื่อ, เมนู, ภาพ, จำนวนข้อที่ต้องจับ)
        ("JSON ดี + ภาพ PNG ตรงขนาด", good, png(2500, 1686), 0),
        ("พื้นที่เกินขอบภาพ", {**good, "areas": [cell(2000, 0, 833, 843)]}, None, 1),
        ("21 พื้นที่", {**good, "areas": [cell(0, 0, 10, 10)] * 21}, None, 1),
        ("chatBarText 15 ตัว", {**good, "chatBarText": "a" * 15}, None, 1),
        ("ภาพเกิน 1 MB", good, png(2500, 1686, 1_200_000), 1),
        ("ขนาดภาพไม่ตรง JSON", good, png(1200, 810), 1),
        ("ขนาดใน JSON ผิดช่วง (3000×1686)", {**good, "size": {"width": 3000, "height": 1686}}, None, 1),
        ("ราก JSON เป็น list", [], None, 1),
        ("bounds เป็นข้อความ", {**good, "areas": [{"bounds": {"x": "0", "y": 0, "width": 10, "height": 10}, "action": {"type": "message"}}]}, None, 1),
        ("bounds เป็น list · area เป็นตัวเลข", {**good, "areas": [{"bounds": [1], "action": {"type": "message"}}, 5]}, None, 2),
        ("JPEG 2500×843 ตรงกับ size compact", {**good, "size": {"width": 2500, "height": 843}}, jpeg, 0),
    ]
    ok = True
    for name, menu, img, want in cases:
        got = len(check(menu, img, lim))
        ok &= got == want
        print(f"{name}: จับได้ {got} ข้อ (ต้อง {want})", "ผ่าน" if got == want else "ไม่ผ่าน")
    if date.today() > date.fromisoformat(lim["recheck_by"]):
        print(f"เตือน: เพดานตรวจล่าสุด {lim['checked']} เลยกำหนดตรวจซ้ำ {lim['recheck_by']} · เปิดหน้า LINE ตรวจก่อนเชื่อ")
    print("self-test", "ผ่าน" if ok else "ไม่ผ่าน")
    return 0 if ok else 1


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):  # เครื่องที่ code page ไม่ใช่ UTF-8 พิมพ์ภาษาไทยผ่าน pipe แล้วล้ม
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("menu", type=Path, nargs="?")
    ap.add_argument("image", type=Path, nargs="?")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        sys.exit(self_test())
    if not a.menu:
        sys.exit("ใส่ path ของ menu.json (และภาพ .png หรือ .jpg ถ้าจะตรวจภาพ)")
    lim = json.loads(LIMITS.read_text(encoding="utf-8"))
    bad = check(json.loads(a.menu.read_text(encoding="utf-8")), a.image.read_bytes() if a.image else None, lim)
    for line in bad:
        print("ไม่ผ่าน:", line)
    print("ผ่านทุกข้อ · ยังต้องยิง /validate ก่อนสร้างจริง" if not bad else f"ไม่ผ่าน {len(bad)} ข้อ")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
