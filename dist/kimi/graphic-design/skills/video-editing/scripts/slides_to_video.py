"""slides_to_video.py — ต่อภาพสไลด์กับเสียงบรรยายเป็นวิดีโอ ตามเวลา data-at ของแต่ละแผ่น

    python slides_to_video.py deck.html frames/ narration.wav -o episode.mp4
    python slides_to_video.py deck.html frames/ narration.wav -o episode.mp4 --check   # พิมพ์ตารางเวลาอย่างเดียว

- deck.html  เด็คที่ build แล้วจาก html-slide-deck · ทุก <section class="slide"> มี data-at="m:ss" = เวลาที่ควรถึงแผ่นนั้น
- frames/    ภาพ p01.png p02.png … จาก check_deck.py (1920×1080) จำนวนเท่ากับสไลด์
- แผ่นที่ n แสดงตั้งแต่ data-at ของมันถึง data-at ของแผ่นถัดไป · แผ่นสุดท้ายแสดงจนเสียงจบ
ใช้แค่ Python มาตรฐาน + ffmpeg/ffprobe ใน PATH
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

SECTION = re.compile(r"<section\b([^>]*)>", re.I)
ATTR = re.compile(r'([\w-]+)\s*=\s*"([^"]*)"')


def slide_starts(deck: Path) -> list[float]:
    """เวลาเริ่มของทุกสไลด์ตามลำดับในไฟล์ (วินาที)"""
    starts = []
    for tag in SECTION.finditer(deck.read_text(encoding="utf-8")):
        attrs = dict(ATTR.findall(tag.group(1)))
        if "slide" not in attrs.get("class", "").split():
            continue
        at = attrs.get("data-at")
        if at is None:
            sys.exit(f"สไลด์ลำดับที่ {len(starts) + 1} ไม่มี data-at — ใส่เวลาให้ครบทุกแผ่นก่อน")
        parts = [float(p) for p in at.split(":")]
        starts.append(sum(v * 60 ** i for i, v in enumerate(reversed(parts))))
    if not starts:
        sys.exit("ไม่พบ <section class=\"slide\"> ในไฟล์ — ใช้ไฟล์ที่ build แล้ว ไม่ใช่ไฟล์เนื้อหา")
    bad = [i + 1 for i in range(1, len(starts)) if starts[i] <= starts[i - 1]]
    if bad:
        sys.exit(f"data-at ต้องเพิ่มขึ้นทุกแผ่น · แผ่นที่ผิด: {bad}")
    return starts


def media_seconds(path: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("deck", type=Path)
    ap.add_argument("frames", type=Path)
    ap.add_argument("audio", type=Path)
    ap.add_argument("-o", "--out", type=Path, default=Path("episode.mp4"))
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--check", action="store_true", help="พิมพ์ตารางเวลาแล้วจบ ไม่สร้างวิดีโอ")
    a = ap.parse_args()

    starts = slide_starts(a.deck)
    frames = sorted(a.frames.glob("p[0-9][0-9].png"))
    if len(frames) != len(starts):
        sys.exit(f"สไลด์ {len(starts)} แผ่น แต่ภาพ {len(frames)} ไฟล์ — รัน check_deck.py ใหม่กับเด็คเดียวกัน")
    total = media_seconds(a.audio)
    if starts[-1] >= total:
        sys.exit(f"แผ่นสุดท้ายเริ่ม {starts[-1]:.1f} วินาที แต่เสียงยาวแค่ {total:.1f} วินาที — แก้ data-at หรือเสียง")
    ends = starts[1:] + [total]
    if starts[0] > 0:
        print(f"แผ่นแรกเริ่มที่ {starts[0]:.1f} วินาที · ให้แผ่นแรกขึ้นตั้งแต่วินาทีที่ 0 แทน")
        starts[0] = 0.0
    print("แผ่น | เริ่ม | ยาว (วินาที)")
    for n, (s, e) in enumerate(zip(starts, ends), 1):
        print(f"{n:>4} | {s:>6.1f} | {e - s:>6.1f}")
    print(f"รวม {total:.1f} วินาที")
    if a.check:
        return

    listing = a.out.with_suffix(".frames.txt")
    lines = []
    for f, s, e in zip(frames, starts, ends):
        lines += [f"file '{f.resolve().as_posix()}'", f"duration {e - s:.3f}"]
    lines.append(f"file '{frames[-1].resolve().as_posix()}'")  # concat demuxer ใช้ duration ของแผ่นสุดท้ายเมื่อมีไฟล์ซ้ำต่อท้าย
    listing.write_text("\n".join(lines) + "\n", encoding="utf-8")
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
           "-f", "concat", "-safe", "0", "-i", str(listing), "-i", str(a.audio),
           "-vf", f"fps={a.fps},format=yuv420p", "-c:v", "libx264", "-tune", "stillimage", "-crf", "20",
           # -t ตัดที่ความยาวเสียงพอดี · -shortest อย่างเดียวยังเหลือภาพเกินราว 1–2 วินาทีเมื่อมี filter
           "-c:a", "aac", "-b:a", "192k", "-t", f"{total:.3f}", "-movflags", "+faststart", str(a.out)]
    subprocess.run(cmd, check=True)
    listing.unlink()
    print(f"เขียน {a.out} · ยาว {media_seconds(a.out):.2f} วินาที (เสียง {total:.2f})")


if __name__ == "__main__":
    main()
