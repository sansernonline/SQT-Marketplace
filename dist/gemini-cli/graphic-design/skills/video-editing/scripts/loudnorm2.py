"""loudnorm2.py — ปรับความดังของเสียงทั้งไฟล์แบบ 2 รอบ (EBU R128) ด้วย ffmpeg loudnorm

    python loudnorm2.py in.wav out.wav --target -16 --tp -1.5 --lra 11
    python loudnorm2.py in.mp4 out.mp4 --target -14          # ไฟล์วิดีโอ: คัดลอกภาพเดิม เข้ารหัสเสียงใหม่เป็น AAC
    python loudnorm2.py in.wav --measure                    # วัดอย่างเดียว ไม่เขียนไฟล์

รอบ 1 วัดค่า · รอบ 2 ใส่ค่าที่วัดได้กลับเข้าไป · บรรทัด "Normalization Type" บอกผล:
Linear = เพิ่มหรือลดเสียงทั้งไฟล์เท่ากัน (ไม่บีบช่วงดังเบา) · Dynamic = ffmpeg บีบช่วงดังเบาให้ถึงเป้า
ใช้แค่ Python มาตรฐาน + ffmpeg ใน PATH
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

VIDEO_EXT = {".mp4", ".mov", ".mkv", ".m4v", ".webm"}


def ffmpeg(args: list[str]) -> str:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *args], capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    if r.returncode != 0:
        sys.exit(r.stderr[-2000:])
    return r.stderr


def measure(src: Path, target: float, tp: float, lra: float) -> dict:
    err = ffmpeg(["-i", str(src), "-af", f"loudnorm=I={target}:TP={tp}:LRA={lra}:print_format=json", "-f", "null", "-"])
    return json.loads(err[err.rindex("{"):err.rindex("}") + 1])


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("src", type=Path)
    ap.add_argument("out", type=Path, nargs="?")
    ap.add_argument("--target", type=float, default=-16.0, help="ความดังรวมเป้าหมาย LUFS (ค่าตั้งต้น -16)")
    ap.add_argument("--tp", type=float, default=-1.5, help="เพดาน true peak dBTP (ค่าตั้งต้น -1.5)")
    ap.add_argument("--lra", type=float, default=11.0, help="ช่วงความดังเป้าหมาย LU (ค่าตั้งต้น 11)")
    ap.add_argument("--measure", action="store_true", help="วัดอย่างเดียว")
    a = ap.parse_args()

    m = measure(a.src, a.target, a.tp, a.lra)
    print(f"วัดได้: {m['input_i']} LUFS · true peak {m['input_tp']} dBTP · LRA {m['input_lra']} LU")
    if a.measure:
        return
    if a.out is None:
        sys.exit("ใส่ชื่อไฟล์ผลลัพธ์ หรือใช้ --measure")
    af = (f"loudnorm=I={a.target}:TP={a.tp}:LRA={a.lra}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:"
          "linear=true:print_format=summary")
    codec = ["-c:v", "copy", "-c:a", "aac", "-b:a", "192k"] if a.src.suffix.lower() in VIDEO_EXT else []
    err = ffmpeg(["-y", "-i", str(a.src), "-af", af, "-ar", "48000", *codec, str(a.out)])
    for line in err.splitlines():
        if line.strip().startswith(("Output Integrated", "Output True Peak", "Normalization Type")):
            print(line.strip())


if __name__ == "__main__":
    main()
