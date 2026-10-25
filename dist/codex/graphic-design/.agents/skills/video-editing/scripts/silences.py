"""silences.py — หาช่วงเงียบในเสียงหรือวิดีโอ แล้วตัดออก (เหลือช่วงพูดต่อกัน)

    python silences.py in.wav                              # พิมพ์ช่วงเงียบและช่วงที่จะเก็บ
    python silences.py in.mp4 -o tight.mp4 --min 0.8       # ตัดช่วงเงียบที่ยาวเกิน 0.8 วินาที
    python silences.py in.wav --noise -40 --pad 0.2        # เสียงพื้นเบามาก ลดเกณฑ์ · เว้นขอบช่วงพูด 0.2 วินาที

--noise คือเกณฑ์เงียบ (dB) · ตั้งให้ต่ำกว่าเสียงพูดเบาสุดแต่สูงกว่าเสียงพื้นห้อง: ดูค่า mean_volume จาก
`ffmpeg -i in.wav -af volumedetect -f null -` ก่อน แล้วลองที่ราว 10 dB ใต้ mean_volume
ใช้แค่ Python มาตรฐาน + ffmpeg/ffprobe ใน PATH
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path


def silences(src: Path, noise: float, min_len: float) -> list[tuple[float, float]]:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(src), "-af",
                        f"silencedetect=noise={noise}dB:d={min_len}", "-f", "null", "-"],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    return list(zip(starts, ends + [None] * (len(starts) - len(ends))))


def duration(src: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(src)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def has_video(src: Path) -> bool:
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=index",
                          "-of", "csv=p=0", str(src)], capture_output=True, text=True).stdout
    return bool(out.strip())


def keep_ranges(gaps, total: float, pad: float) -> list[tuple[float, float]]:
    keep, cur = [], 0.0
    for s, e in gaps:
        e = total if e is None else e
        if s - cur > 0.05:
            keep.append((cur, min(s + pad, total)))
        cur = max(e - pad, 0.0)
    if total - cur > 0.05:
        keep.append((cur, total))
    return keep


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("src", type=Path)
    ap.add_argument("-o", "--out", type=Path)
    ap.add_argument("--noise", type=float, default=-35.0, help="เกณฑ์เงียบ dB (ค่าตั้งต้น -35)")
    ap.add_argument("--min", type=float, default=0.7, help="ตัดเฉพาะช่วงเงียบที่ยาวกว่านี้ วินาที (ค่าตั้งต้น 0.7)")
    ap.add_argument("--pad", type=float, default=0.15, help="เว้นขอบก่อนและหลังช่วงพูด วินาที (ค่าตั้งต้น 0.15)")
    a = ap.parse_args()

    total = duration(a.src)
    gaps = silences(a.src, a.noise, a.min)
    keep = keep_ranges(gaps, total, a.pad)
    print(f"ยาว {total:.2f} วินาที · ช่วงเงียบ {len(gaps)} ช่วง")
    for s, e in gaps:
        print(f"  เงียบ {s:7.2f} → {('จบไฟล์' if e is None else f'{e:7.2f}')}")
    kept = sum(e - s for s, e in keep)
    print(f"เก็บ {len(keep)} ช่วง รวม {kept:.2f} วินาที (ตัดออก {total - kept:.2f})")
    if not a.out:
        return
    if not keep:
        sys.exit("ไม่เหลือช่วงพูดเลย — เกณฑ์ --noise สูงเกินไป")
    video = has_video(a.src)
    parts, labels = [], []
    for n, (s, e) in enumerate(keep):
        parts.append(f"[0:a]atrim={s:.3f}:{e:.3f},asetpts=PTS-STARTPTS[a{n}]")
        if video:
            parts.append(f"[0:v]trim={s:.3f}:{e:.3f},setpts=PTS-STARTPTS[v{n}]")
            labels.append(f"[v{n}][a{n}]")
        else:
            labels.append(f"[a{n}]")
    concat = f"{''.join(labels)}concat=n={len(keep)}:v={1 if video else 0}:a=1"
    concat += "[v][a]" if video else "[a]"
    graph = ";".join(parts + [concat])
    maps = ["-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac",
            "-b:a", "192k"] if video else ["-map", "[a]"]
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(a.src),
                    "-filter_complex", graph, *maps, str(a.out)], check=True)
    print(f"เขียน {a.out} · ยาว {duration(a.out):.2f} วินาที")


if __name__ == "__main__":
    main()
