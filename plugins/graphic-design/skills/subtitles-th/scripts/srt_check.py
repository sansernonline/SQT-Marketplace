"""srt_check.py — ตรวจไฟล์ซับ .srt ภาษาไทยก่อนฝังหรืออัปโหลด

    python srt_check.py episode.srt
    python srt_check.py episode.srt --max-chars 35 --max-cps 17 --self-test

ตรวจ: UTF-8 · เลขลำดับ · รูปแบบเวลา · เริ่มก่อนจบ · ไม่ทับกัน · เวลาบนจอ 5/6–7 วินาที · ไม่เกิน 2 บรรทัด
· บรรทัดละไม่เกิน 35 ตัว และอ่านไม่เกิน 17 ตัวต่อวินาที (ไม่นับวรรณยุกต์และสระบนล่าง)
· เครื่องหมายในบทพูด: ไม่ปิดด้วยจุด · ไม่มี ? หรือขีด · "..." ให้เป็น … ตัวเดียว
ตัวเลขตามตาราง Caption and on-screen text rules ของ skill video-script-to-clip (Netflix Thai Timed Text Style Guide)
ใช้แค่ Python มาตรฐาน · exit 1 เมื่อเจอปัญหา
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

TIME = re.compile(r"^(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})$")
# สระบน สระล่าง วรรณยุกต์ และเครื่องหมายที่ซ้อนบนตัวอื่น ไม่กินที่ในบรรทัด
STACKED = set("ัิีึืฺุู็่้๊๋์ํ๎")


def width(text: str) -> int:
    return sum(1 for ch in text if ch not in STACKED)


def seconds(h, m, s, ms) -> float:
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000


def check(text: str, max_chars: int, max_cps: float, min_dur: float, max_dur: float) -> list[str]:
    problems, prev_end = [], 0.0
    blocks = [b for b in re.split(r"\n\s*\n", text.replace("\r\n", "\n").strip()) if b.strip()]
    for n, block in enumerate(blocks, 1):
        lines = block.split("\n")
        where = f"ซับที่ {n}"
        if lines[0].strip() != str(n):
            problems.append(f"{where}: เลขลำดับเป็น '{lines[0].strip()}' ควรเป็น {n}")
        m = TIME.match(lines[1].strip()) if len(lines) > 1 else None
        if not m:
            problems.append(f"{where}: บรรทัดเวลาไม่ใช่รูปแบบ 00:00:00,000 --> 00:00:00,000")
            continue
        start, end = seconds(*m.groups()[:4]), seconds(*m.groups()[4:])
        body = [l for l in lines[2:] if l.strip()]
        dur = end - start
        if end <= start:
            problems.append(f"{where}: เวลาจบไม่หลังเวลาเริ่ม")
        if start < prev_end:
            problems.append(f"{where}: เริ่มก่อนซับก่อนหน้าจบ ({start:.3f} < {prev_end:.3f})")
        if dur < min_dur:
            problems.append(f"{where}: อยู่บนจอ {dur:.2f} วินาที สั้นกว่า {min_dur:.2f}")
        if dur > max_dur:
            problems.append(f"{where}: อยู่บนจอ {dur:.2f} วินาที นานกว่า {max_dur:.0f}")
        if not body:
            problems.append(f"{where}: ไม่มีข้อความ")
        if len(body) > 2:
            problems.append(f"{where}: {len(body)} บรรทัด เกิน 2")
        for line in body:
            if width(line) > max_chars:
                problems.append(f"{where}: บรรทัดยาว {width(line)} ตัว เกิน {max_chars} · '{line}'")
            if line.rstrip().endswith("."):
                problems.append(f"{where}: ปิดประโยคด้วยจุด · '{line}'")
            if re.search(r"[?]|\s[-–—]\s|^[-–—]", line):
                problems.append(f"{where}: มี ? หรือขีดในบทพูด · '{line}'")
            if "..." in line:
                problems.append(f"{where}: ใช้ ... ให้เปลี่ยนเป็น … ตัวเดียว")
        if dur > 0 and body:
            cps = sum(width(l) for l in body) / dur
            if cps > max_cps:
                problems.append(f"{where}: อ่าน {cps:.1f} ตัวต่อวินาที เกิน {max_cps:g} — แบ่งซับหรือตัดคำ")
        prev_end = max(prev_end, end)
    return problems


def self_test() -> int:
    good = ("1\n00:00:00,500 --> 00:00:02,800\nสวัสดีครับ วันนี้มาลองฝังซับไทย\n\n"
            "2\n00:00:03,000 --> 00:00:06,500\nผู้ใหญ่ใจดี น้ำแข็งใส ก๋วยเตี๋ยว\nบรรทัดที่สอง ติ๊กต่อก\n")
    bad = ("1\n00:00:00,000 --> 00:00:00,400\nสั้นเกินไปนะครับ.\n\n"
           "3\n00:00:00,300 --> 00:00:09,000\nทับซับก่อนหน้าและนานเกิน 7 วินาที ใช่ไหม?\nบรรทัด 2\nบรรทัด 3\n")
    ok_good = check(good, 35, 17, 5 / 6, 7) == []
    found = check(bad, 35, 17, 5 / 6, 7)
    want = ["สั้นกว่า", "ปิดประโยคด้วยจุด", "เลขลำดับ", "เริ่มก่อน", "นานกว่า", "เกิน 2", "? หรือขีด"]
    missed = [w for w in want if not any(w in p for p in found)]
    print("ของดีไม่เตือน:", "ผ่าน" if ok_good else check(good, 35, 17, 5 / 6, 7))
    print("ของเสียจับได้:", len(found), "จุด · พลาด:", missed or "-")
    print("ความกว้าง 'ก๋วยเตี๋ยว' =", width("ก๋วยเตี๋ยว"), "(ต้องเป็น 7)")
    ok = ok_good and not missed and width("ก๋วยเตี๋ยว") == 7
    print("self-test", "ผ่าน" if ok else "ไม่ผ่าน")
    return 0 if ok else 1


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):  # เครื่องที่ code page ไม่ใช่ UTF-8 พิมพ์ภาษาไทยผ่าน pipe แล้วล้ม
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("srt", type=Path, nargs="?")
    ap.add_argument("--max-chars", type=int, default=35)
    ap.add_argument("--max-cps", type=float, default=17)
    ap.add_argument("--min-dur", type=float, default=5 / 6)
    ap.add_argument("--max-dur", type=float, default=7)
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        sys.exit(self_test())
    if not a.srt:
        sys.exit("ใส่ path ของไฟล์ .srt")
    raw = a.srt.read_bytes()
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        sys.exit("ไฟล์ไม่ใช่ UTF-8 — บันทึกใหม่เป็น UTF-8 ก่อน (YouTube และ libass อ่าน UTF-8)")
    problems = check(text, a.max_chars, a.max_cps, a.min_dur, a.max_dur)
    for p in problems:
        print(p)
    print(f"{a.srt.name}: {'ผ่าน' if not problems else f'เจอ {len(problems)} จุด'}")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
