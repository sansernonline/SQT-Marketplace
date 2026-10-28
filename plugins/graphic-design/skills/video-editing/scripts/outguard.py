"""outguard.py — กันสคริปต์ในโฟลเดอร์นี้เขียนทับไฟล์ผลลัพธ์ที่มีอยู่แล้ว (ใช้ร่วมกันโดย silences · loudnorm2 · slides_to_video)

เขียนทับได้เมื่อผู้ใช้ใส่ --force เท่านั้น · ไม่ใส่ → ออกพร้อมเสนอชื่อใหม่ (name-v02.mp4)
"""
from __future__ import annotations

import sys
from pathlib import Path


def next_free(out: Path) -> Path:
    n = 2
    while (cand := out.with_name(f"{out.stem}-v{n:02d}{out.suffix}")).exists():
        n += 1
    return cand


def refuse_overwrite(out: Path | None, force: bool) -> None:
    if out is not None and out.exists() and not force:
        sys.exit(f"{out} มีอยู่แล้ว ไม่เขียนทับ · ใช้ชื่อใหม่เช่น {next_free(out)} หรือใส่ --force ถ้าตั้งใจทับ")


def expect_refusal(script: Path, args: list[str], out: Path) -> bool:
    """ใช้ใน self-test: สร้างไฟล์ผลลัพธ์ปลอม แล้วรันสคริปต์ ต้องถูกปฏิเสธและไฟล์เดิมไม่ถูกแตะ"""
    import subprocess
    out.write_bytes(b"keep")
    r = subprocess.run([sys.executable, str(script), *args], capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    return r.returncode != 0 and "--force" in r.stderr and out.read_bytes() == b"keep"


if __name__ == "__main__":
    import tempfile
    with tempfile.TemporaryDirectory() as d:
        o = Path(d) / "a.mp4"
        refuse_overwrite(o, False)  # ยังไม่มีไฟล์ ต้องผ่าน
        o.write_bytes(b"x")
        (Path(d) / "a-v02.mp4").write_bytes(b"x")
        ok = next_free(o).name == "a-v03.mp4"
        try:
            refuse_overwrite(o, False)
            ok = False
        except SystemExit:
            pass
        refuse_overwrite(o, True)
        print("self-test", "ผ่าน" if ok else "ไม่ผ่าน")
        sys.exit(0 if ok else 1)
