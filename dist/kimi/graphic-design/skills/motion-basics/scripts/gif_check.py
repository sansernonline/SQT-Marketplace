"""gif_check.py — อ่านขนาด น้ำหนัก เฟรม fps ความยาวของ GIF (หรือ WebM/MP4 ผ่าน ffprobe) แล้วเทียบเพดานที่ผู้ใช้ส่งเข้ามา

    python gif_check.py out.gif                                   # รายงานอย่างเดียว
    python gif_check.py out.gif --max-mb 5 --max-width 480 --max-seconds 6 --max-fps 15 --max-frames 120
    python gif_check.py out.webm --max-mb 2                       # ต้องมี ffprobe ใน PATH
    python gif_check.py --self-test

สคริปต์ไม่ฝังเพดานของปลายทางใด ๆ (เพดานของ LINE OA, Shopee, อีเมล ยังไม่ได้ตรวจกับหน้าทางการ) · ผู้ใช้เปิดหน้าช่วยเหลือของปลายทาง
แล้วส่งตัวเลขผ่าน --max-* เอง · ไม่ส่งเพดาน = รายงานตัวเลขอย่างเดียว ไม่ตัดสินผ่านหรือไม่ผ่าน
GIF อ่านเองจากหัวไฟล์ (ไม่ต้องมี dependency) · ไฟล์อื่นเรียก ffprobe · ไม่ใช้เครือข่าย
เขียนใหม่เองทั้งหมด ไม่ได้คัดลอกโค้ดของ anthropics/skills slack-gif-creator
"""
from __future__ import annotations

import argparse
import json
import shutil
import struct
import subprocess
import sys
import tempfile
from pathlib import Path


def skip_sub_blocks(data: bytes, i: int) -> int:
    while i < len(data) and data[i] != 0:
        i += data[i] + 1
    return i + 1


def read_gif(data: bytes) -> dict:
    """กว้าง สูง จำนวนเฟรม วินาทีรวม (ต่อรอบ) และจำนวนรอบวน (0 = ไม่จำกัด · None = ไม่มีส่วนขยาย NETSCAPE = เล่นรอบเดียว)"""
    if data[:6] not in (b"GIF87a", b"GIF89a"):
        raise ValueError("ไม่ใช่ไฟล์ GIF")
    w, h, flags = struct.unpack("<HHB", data[6:11])
    i = 13 + (3 * 2 ** ((flags & 7) + 1) if flags & 0x80 else 0)
    frames, centis, loops, delay = 0, 0, None, 10
    while i < len(data):
        b = data[i]
        if b == 0x21:  # extension
            label = data[i + 1]
            if label == 0xF9:  # graphic control: หน่วงเป็นร้อยละวินาที
                delay = struct.unpack("<H", data[i + 4:i + 6])[0]
            elif label == 0xFF and data[i + 3:i + 14] == b"NETSCAPE2.0" and data[i + 15] == 1:
                loops = struct.unpack("<H", data[i + 16:i + 18])[0]
            i = skip_sub_blocks(data, i + 2)
        elif b == 0x2C:  # image
            frames += 1
            centis += delay if delay > 0 else 10  # เบราว์เซอร์ส่วนใหญ่ถือ 0 เป็น 0.1 วินาที
            delay = 10
            f = data[i + 9]
            i += 10 + (3 * 2 ** ((f & 7) + 1) if f & 0x80 else 0)
            i = skip_sub_blocks(data, i + 1)  # ข้าม LZW min code size 1 ไบต์ แล้วข้ามบล็อกข้อมูล
        elif b == 0x3B:
            break
        else:
            raise ValueError(f"โครงสร้าง GIF ผิดที่ไบต์ {i}")
    return {"width": w, "height": h, "frames": frames, "seconds": centis / 100, "loops": loops}


def read_ffprobe(path: Path) -> dict:
    exe = shutil.which("ffprobe")
    if not exe:
        raise RuntimeError("ไม่ใช่ GIF และไม่พบ ffprobe ใน PATH · ติดตั้ง ffmpeg หรือส่งเป็น .gif")
    out = subprocess.run(
        [exe, "-v", "error", "-select_streams", "v:0", "-count_frames", "-show_entries",
         "stream=width,height,nb_read_frames,duration:format=duration", "-of", "json", str(path)],
        capture_output=True, text=True, check=True).stdout
    j = json.loads(out)
    s = j["streams"][0]
    dur = float(s.get("duration") or j["format"].get("duration") or 0)
    return {"width": s["width"], "height": s["height"], "frames": int(s["nb_read_frames"]), "seconds": dur, "loops": None}


def judge(info: dict, size_bytes: int, lim: dict) -> list[str]:
    """คืนรายการข้อที่เกินเพดานที่ส่งมา · ว่าง = ไม่เกิน (หรือไม่ได้ส่งเพดาน)"""
    fps = info["frames"] / info["seconds"] if info["seconds"] else 0.0
    rows = [
        ("น้ำหนัก MB", size_bytes / 1e6, lim.get("max_mb")),
        ("กว้าง px", info["width"], lim.get("max_width")),
        ("ความยาว วินาที", info["seconds"], lim.get("max_seconds")),
        ("fps", fps, lim.get("max_fps")),
        ("จำนวนเฟรม", info["frames"], lim.get("max_frames")),
    ]
    return [f"{name} {val:.2f} เกินเพดาน {cap}" for name, val, cap in rows if cap is not None and val > cap]


def report(path: Path, lim: dict) -> tuple[dict, list[str]]:
    data = path.read_bytes()
    info = read_gif(data) if data[:3] == b"GIF" else read_ffprobe(path)
    return info, judge(info, len(data), lim)


def _gif(w, h, delays, loops=0):
    """GIF ทดสอบ: จอ w×h · เฟรมละ 1×1 พิกเซล · delays เป็นร้อยละวินาทีของแต่ละเฟรม"""
    out = b"GIF89a" + struct.pack("<HHBBB", w, h, 0x80, 0, 0) + b"\x00\x00\x00\xff\xff\xff"
    if loops is not None:
        out += b"\x21\xff\x0bNETSCAPE2.0\x03\x01" + struct.pack("<H", loops) + b"\x00"
    for d in delays:
        out += b"\x21\xf9\x04\x00" + struct.pack("<H", d) + b"\x00\x00"
        out += b"\x2c" + struct.pack("<HHHHB", 0, 0, 1, 1, 0) + b"\x02\x02\x44\x01\x00"
    return out + b"\x3b"


def self_test() -> int:
    ok = True

    def expect(name, cond):
        nonlocal ok
        ok &= bool(cond)
        print(f"{name}:", "ผ่าน" if cond else "ไม่ผ่าน")

    g = _gif(480, 270, [10] * 12)  # 12 เฟรม เฟรมละ 0.1 วินาที = 1.2 วินาที = 10 fps
    info = read_gif(g)
    expect("อ่านขนาด 480×270", (info["width"], info["height"]) == (480, 270))
    expect("นับ 12 เฟรม", info["frames"] == 12)
    expect("ความยาว 1.2 วินาที", abs(info["seconds"] - 1.2) < 1e-9)
    expect("วนไม่จำกัด (loops=0)", info["loops"] == 0)
    expect("ไม่ส่งเพดาน = ไม่ตัดสิน", judge(info, len(g), {}) == [])
    expect("เกินกว้าง 400 → จับ 1 ข้อ", len(judge(info, len(g), {"max_width": 400})) == 1)
    expect("เกินเฟรม 10 และ fps 5 → จับ 2 ข้อ", len(judge(info, len(g), {"max_frames": 10, "max_fps": 5})) == 2)
    expect("ไม่เกินเพดานที่กว้างพอ", judge(info, len(g), {"max_mb": 1, "max_width": 480, "max_seconds": 2, "max_fps": 10, "max_frames": 12}) == [])
    expect("น้ำหนักเกิน", len(judge(info, 6_000_000, {"max_mb": 5})) == 1)
    expect("delay 0 นับเป็น 0.1 วินาที", abs(read_gif(_gif(10, 10, [0, 0]))["seconds"] - 0.2) < 1e-9)
    expect("ไม่มี NETSCAPE → loops None", read_gif(_gif(10, 10, [5], loops=None))["loops"] is None)
    try:
        read_gif(b"not a gif")
        expect("ไฟล์ไม่ใช่ GIF ต้อง error", False)
    except ValueError:
        expect("ไฟล์ไม่ใช่ GIF ต้อง error", True)
    ff, fp = shutil.which("ffmpeg"), shutil.which("ffprobe")
    if ff and fp:
        with tempfile.TemporaryDirectory() as d:
            gif, webm = Path(d) / "t.gif", Path(d) / "t.webm"
            src = ["-f", "lavfi", "-i", "testsrc=size=160x90:rate=10:duration=2"]
            subprocess.run([ff, "-v", "error", "-y", *src, str(gif)], check=True)
            subprocess.run([ff, "-v", "error", "-y", *src, "-c:v", "libvpx-vp9", str(webm)], check=True)
            gi, _ = report(gif, {})
            expect("ffmpeg GIF 160×90 · 20 เฟรม · 2 วินาที", (gi["width"], gi["frames"], round(gi["seconds"])) == (160, 20, 2))
            wi, bad = report(webm, {"max_width": 100})
            expect("WebM ผ่าน ffprobe · กว้าง 160 · เกินเพดาน 100 จับ 1 ข้อ", wi["width"] == 160 and len(bad) == 1)
    else:
        print("ข้ามส่วนทดสอบกับ ffmpeg (ไม่พบ ffmpeg/ffprobe ใน PATH)")
    print("self-test", "ผ่าน" if ok else "ไม่ผ่าน")
    return 0 if ok else 1


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("file", type=Path, nargs="?")
    ap.add_argument("--max-mb", type=float)
    ap.add_argument("--max-width", type=int)
    ap.add_argument("--max-seconds", type=float)
    ap.add_argument("--max-fps", type=float)
    ap.add_argument("--max-frames", type=int)
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        sys.exit(self_test())
    if not a.file:
        sys.exit("ใส่ path ของ .gif (หรือ .webm .mp4) · เพดานส่งผ่าน --max-mb --max-width --max-seconds --max-fps --max-frames")
    lim = {k: v for k, v in vars(a).items() if k.startswith("max_") and v is not None}
    info, bad = report(a.file, lim)
    size = a.file.stat().st_size
    fps = info["frames"] / info["seconds"] if info["seconds"] else 0
    loops = {None: "รอบเดียว/ไม่ระบุ", 0: "วนไม่จำกัด"}.get(info["loops"], f"{info['loops']} รอบ")
    print(f"{info['width']}×{info['height']} px · {size / 1e6:.2f} MB · {info['frames']} เฟรม · {fps:.1f} fps · {info['seconds']:.2f} วินาที · {loops}")
    for line in bad:
        print("เกินเพดาน:", line)
    if bad:
        print("ลดตามลำดับ: fps (10-12) และความกว้างก่อน · ตัดความยาวต่อ · ลดจำนวนสีเป็นอย่างสุดท้าย (ดู motion-basics หัวข้อ Export)")
    elif not lim:
        print("ไม่ได้ส่งเพดาน จึงไม่ตัดสิน · เปิดหน้าช่วยเหลือของปลายทางแล้วส่ง --max-*")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
