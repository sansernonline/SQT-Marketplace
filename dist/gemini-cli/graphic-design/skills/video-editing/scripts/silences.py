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
    merged = []  # pad เกินครึ่งช่องเงียบทำให้ช่วงทับกัน · รวมเป็นช่วงเดียว
    for s, e in keep:
        if merged and s <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], e))
        else:
            merged.append((s, e))
    return merged


def self_test() -> int:
    """ตรวจ keep_ranges ด้วยตัวเลขที่รู้คำตอบ · มี ffmpeg → สร้างเสียง 1 วิ + เงียบ 1.5 วิ + เสียง 1 วิ แล้ววัดจริง"""
    import shutil
    import tempfile
    cases = [  # (ช่วงเงียบ, ยาวรวม, pad, ที่ต้องได้)
        ([(1.0, 2.5)], 3.5, 0.0, [(0.0, 1.0), (2.5, 3.5)]),
        ([(1.0, 2.5)], 3.5, 0.2, [(0.0, 1.2), (2.3, 3.5)]),
        ([(0.0, 1.0)], 3.0, 0.0, [(1.0, 3.0)]),               # เงียบตั้งแต่ต้นไฟล์
        ([(2.0, None)], 3.0, 0.0, [(0.0, 2.0)]),               # เงียบจนจบไฟล์
        ([], 3.0, 0.15, [(0.0, 3.0)]),                         # ไม่มีช่วงเงียบ
        ([(1.0, 1.4)], 3.0, 0.3, [(0.0, 3.0)]),                # pad เกินครึ่งช่องเงียบ ต้องรวมไม่ซ้อน
    ]
    ok = True
    for gaps, total, pad, want in cases:
        got = [(round(s, 3), round(e, 3)) for s, e in keep_ranges(gaps, total, pad)]
        if got != want:
            ok = False
            print(f"keep_ranges{gaps, total, pad} ได้ {got} ต้องเป็น {want}")
    print("คำนวณช่วงที่เก็บ:", "ผ่าน" if ok else "ไม่ผ่าน", f"({len(cases)} กรณี)")
    if not (shutil.which("ffmpeg") and shutil.which("ffprobe")):
        print("ข้ามการวัดเสียงจริง: ไม่พบ ffmpeg/ffprobe ใน PATH")
    else:
        with tempfile.TemporaryDirectory() as d:
            src = Path(d) / "tone-gap-tone.wav"
            subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                            "-f", "lavfi", "-i", "sine=frequency=440:duration=1",
                            "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono:d=1.5",
                            "-f", "lavfi", "-i", "sine=frequency=440:duration=1",
                            "-filter_complex", "[0][1][2]concat=n=3:v=0:a=1", str(src)], check=True)
            gaps = silences(src, -35.0, 0.7)
            hit = len(gaps) == 1 and abs(gaps[0][0] - 1.0) < 0.1 and gaps[0][1] and abs(gaps[0][1] - 2.5) < 0.1
            print("วัดเสียงจริงด้วย ffmpeg:", "ผ่าน" if hit else f"ไม่ผ่าน ได้ {gaps} ต้องเป็นราว [(1.0, 2.5)]")
            ok = ok and bool(hit)
    print("self-test", "ผ่าน" if ok else "ไม่ผ่าน")
    return 0 if ok else 1


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):  # เครื่องที่ code page ไม่ใช่ UTF-8 พิมพ์ภาษาไทยผ่าน pipe แล้วล้ม
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("src", type=Path, nargs="?")
    ap.add_argument("-o", "--out", type=Path)
    ap.add_argument("--noise", type=float, default=-35.0, help="เกณฑ์เงียบ dB (ค่าตั้งต้น -35)")
    ap.add_argument("--min", type=float, default=0.7, help="ตัดเฉพาะช่วงเงียบที่ยาวกว่านี้ วินาที (ค่าตั้งต้น 0.7)")
    ap.add_argument("--pad", type=float, default=0.15, help="เว้นขอบก่อนและหลังช่วงพูด วินาที (ค่าตั้งต้น 0.15)")
    ap.add_argument("--self-test", action="store_true", help="ทดสอบตัวเอง (ไม่มี ffmpeg ข้ามส่วนวัดเสียงจริง)")
    a = ap.parse_args()
    if a.self_test:
        sys.exit(self_test())
    if not a.src:
        sys.exit("ใส่ path ของไฟล์เสียงหรือวิดีโอ")

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
