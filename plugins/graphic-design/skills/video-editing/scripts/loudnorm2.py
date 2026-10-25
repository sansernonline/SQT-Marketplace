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
    return parse_json(err)


def parse_json(stderr: str) -> dict:
    """ดึงบล็อก JSON ก้อนสุดท้ายที่ loudnorm พิมพ์ไว้ท้าย stderr"""
    return json.loads(stderr[stderr.rindex("{"):stderr.rindex("}") + 1])


def self_test() -> int:
    """ตรวจตัวอ่าน JSON ด้วยข้อความตัวอย่าง · มี ffmpeg → สร้างเสียง 3 วิ ปรับเป็น -16 LUFS แล้ววัดซ้ำ"""
    import shutil
    import tempfile
    sample = ('[Parsed_loudnorm_0 @ 0x1] \n{\n\t"input_i" : "-27.31",\n\t"input_tp" : "-9.02",\n'
              '\t"input_lra" : "0.00",\n\t"input_thresh" : "-37.31",\n\t"target_offset" : "0.12"\n}\n')
    m = parse_json(sample)
    ok = m["input_i"] == "-27.31" and m["target_offset"] == "0.12"
    print("อ่าน JSON ของ loudnorm:", "ผ่าน" if ok else f"ไม่ผ่าน ได้ {m}")
    if not shutil.which("ffmpeg"):
        print("ข้ามการวัดเสียงจริง: ไม่พบ ffmpeg ใน PATH")
    else:
        with tempfile.TemporaryDirectory() as d:
            src, out = Path(d) / "quiet.wav", Path(d) / "norm.wav"
            ffmpeg(["-loglevel", "error", "-y", "-f", "lavfi", "-i", "sine=frequency=440:duration=3",
                    "-af", "volume=-20dB", str(src)])
            first = measure(src, -16.0, -1.5, 11.0)
            af = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={first['input_i']}:measured_TP={first['input_tp']}:"
                  f"measured_LRA={first['input_lra']}:measured_thresh={first['input_thresh']}:"
                  f"offset={first['target_offset']}:linear=true")
            ffmpeg(["-y", "-i", str(src), "-af", af, "-ar", "48000", str(out)])
            after = float(measure(out, -16.0, -1.5, 11.0)["input_i"])
            hit = abs(after - -16.0) <= 1.0
            print(f"ปรับจริงด้วย ffmpeg: ก่อน {first['input_i']} → หลัง {after:.1f} LUFS (เป้า -16 ±1):",
                  "ผ่าน" if hit else "ไม่ผ่าน")
            ok = ok and hit
    print("self-test", "ผ่าน" if ok else "ไม่ผ่าน")
    return 0 if ok else 1


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):  # เครื่องที่ code page ไม่ใช่ UTF-8 พิมพ์ภาษาไทยผ่าน pipe แล้วล้ม
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("src", type=Path, nargs="?")
    ap.add_argument("out", type=Path, nargs="?")
    ap.add_argument("--target", type=float, default=-16.0, help="ความดังรวมเป้าหมาย LUFS (ค่าตั้งต้น -16)")
    ap.add_argument("--tp", type=float, default=-1.5, help="เพดาน true peak dBTP (ค่าตั้งต้น -1.5)")
    ap.add_argument("--lra", type=float, default=11.0, help="ช่วงความดังเป้าหมาย LU (ค่าตั้งต้น 11)")
    ap.add_argument("--measure", action="store_true", help="วัดอย่างเดียว")
    ap.add_argument("--self-test", action="store_true", help="ทดสอบตัวเอง (ไม่มี ffmpeg ข้ามส่วนวัดเสียงจริง)")
    a = ap.parse_args()
    if a.self_test:
        sys.exit(self_test())
    if not a.src:
        sys.exit("ใส่ path ของไฟล์เสียงหรือวิดีโอ")

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
