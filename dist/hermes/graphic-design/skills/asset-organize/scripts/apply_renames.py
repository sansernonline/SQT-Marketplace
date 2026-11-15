"""apply_renames.py — ทำตามแผนใน rename-log.csv อย่างปลอดภัย: ตรวจก่อน · ค่าตั้งต้นไม่แตะไฟล์ · ทำเป็นสำเนา ไม่ย้ายของเดิม

    python apply_renames.py rename-log.csv                 # ตรวจแผนอย่างเดียว (dry-run) พิมพ์สิ่งที่จะทำ
    python apply_renames.py rename-log.csv --apply         # ผ่านทุกข้อแล้วคัดลอกเป็นชื่อใหม่ · ต้นฉบับอยู่ครบ
    python apply_renames.py rename-log.csv --undo          # ลบสำเนาที่ --apply ทำไว้ (เฉพาะที่ยังเหมือนต้นฉบับทุกไบต์)
    python apply_renames.py --self-test

rename-log.csv: แถวหัว `old,new` (คอลัมน์อื่นเช่น note ถูกเก็บไว้ไม่แตะ) · path เทียบกับ --root (ค่าตั้งต้น = โฟลเดอร์ของไฟล์ csv)
ตรวจ: ต้นทางหาย · ชื่อใหม่ซ้ำกันเอง · ชื่อใหม่ชนไฟล์ที่มีอยู่ · ชื่อใหม่เท่าชื่อเดิม · มีข้อผิด → ไม่ทำเลยแม้แต่ไฟล์เดียว
เตือน (ไม่หยุดงาน): ตัวพิมพ์ใหญ่ ช่องว่าง ตัวอักษรไทย คำต้องห้าม (final new latest edit copy) ตามกติกาใน SKILL.md
--apply เขียน <csv>.applied.csv ไว้ให้ --undo · ใช้แค่ Python มาตรฐาน
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import re
import shutil
import sys
import tempfile
from pathlib import Path

BANNED = re.compile(r"(?:^|[-_.])(final|new|latest|edit|copy)(?:[-_.]|$)", re.I)


def read_plan(csv_path: Path) -> list[tuple[str, str]]:
    with csv_path.open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    if not rows or not {"old", "new"} <= set(rows[0]):
        sys.exit(f"{csv_path} ต้องมีแถวหัว old,new · แก้หัวคอลัมน์แล้วรันใหม่")
    return [(r["old"].strip(), r["new"].strip()) for r in rows if r["old"].strip() or r["new"].strip()]


def validate(plan: list[tuple[str, str]], root: Path) -> tuple[list[str], list[str]]:
    """คืน (ข้อผิด, คำเตือน)"""
    errors, warns = [], []
    seen: dict[str, str] = {}
    for old, new in plan:
        if not old or not new:
            errors.append(f"แถวว่างครึ่งแถว: old={old!r} new={new!r}")
            continue
        if not (root / old).is_file():
            errors.append(f"ต้นทางหาย: {old}")
        if old == new:
            errors.append(f"ชื่อใหม่เท่าชื่อเดิม: {old}")
        if not (root / new).resolve().is_relative_to(root.resolve()):
            errors.append(f"ชื่อใหม่ออกนอกโฟลเดอร์ราก: {new} · ใช้ path ที่อยู่ใต้ root เท่านั้น")
            continue
        key = Path(new).as_posix().lower()  # Windows/Mac แยกตัวพิมพ์ไม่ออก จึงนับว่าชน
        if key in seen:
            errors.append(f"ชื่อใหม่ซ้ำกัน: {new} (จาก {seen[key]} และ {old})")
        seen[key] = old
        if (root / new).exists() and old != new:
            errors.append(f"ชื่อใหม่ชนไฟล์ที่มีอยู่แล้ว: {new}")
        name = Path(new).name
        if name != name.lower() or " " in name or re.search(r"[฀-๿]", name) or BANNED.search(name):
            warns.append(f"ชื่อไม่ตรงกติกา (ตัวพิมพ์เล็ก · ไม่มีช่องว่างหรือไทย · ไม่มี final/new/latest/edit/copy): {new}")
    return errors, warns


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def apply(plan: list[tuple[str, str]], root: Path, log: Path) -> int:
    done = []
    for old, new in plan:
        dst = root / new
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(root / old, dst)
        if sha(root / old) != sha(dst):
            sys.exit(f"คัดลอก {old} → {new} แล้วไม่ตรงกับต้นฉบับ · หยุด ตรวจดิสก์ · สำเนาที่ทำไปแล้วลบด้วย --undo")
        done.append((old, new))
        with log.open("w", encoding="utf-8", newline="") as f:  # เขียนทุกไฟล์ ล้มกลางทางก็ยัง undo ได้ · csv.writer ครอบชื่อที่มีจุลภาค
            w = csv.writer(f)
            w.writerow(["old", "new"])
            w.writerows(done)
    return len(done)


def undo(root: Path, log: Path) -> int:
    if not log.exists():
        sys.exit(f"ไม่พบ {log} · ยังไม่เคย --apply หรือบันทึกถูกลบ")
    removed = 0
    for old, new in read_plan(log):
        src, dst = root / old, root / new
        if dst.is_file() and src.is_file() and sha(src) == sha(dst):
            dst.unlink()
            removed += 1
        else:
            print(f"ข้าม {new}: ไม่มีสำเนา หรือต้นฉบับหายหรือเปลี่ยนไปแล้ว · ไม่ลบเพื่อกันของหาย")
    return removed


def self_test() -> int:
    ok = True
    with tempfile.TemporaryDirectory() as d:
        root = Path(d)
        for n in ("a.png", "b.png", "c.png", "d.png", "e.png", "Final Copy.png"):
            (root / n).write_bytes(n.encode())
        before = sorted(p.name for p in root.iterdir())
        bad_plan = [("a.png", "x-a.png"), ("b.png", "x-b.png"), ("c.png", "x-b.png"),  # ชื่อใหม่ซ้ำ
                    ("gone.png", "x-gone.png"),                                      # ต้นทางหาย
                    ("d.png", "e.png"),                                              # ชนไฟล์ที่มีอยู่
                    ("Final Copy.png", "Final New.png")]                             # ผิดกติกา แต่ไม่ใช่ข้อผิด → เตือน
        errors, warns = validate(bad_plan, root)
        hit = len(errors) == 3 and len(warns) == 1
        out_err, _ = validate([("a.png", "../out.png")], root)
        hit &= len(out_err) == 1 and "ออกนอก" in out_err[0]
        ok &= hit
        print(f"แผนเสีย: ข้อผิด {len(errors)} (ต้อง 3: ชื่อซ้ำ · ต้นทางหาย · ชนไฟล์เดิม) เตือน {len(warns)} (ต้อง 1) · ../out.png ถูกปฏิเสธ:", "ผ่าน" if hit else "ไม่ผ่าน")
        csv_path = root / "rename-log.csv"
        csv_path.write_text("old,new\n" + "".join(f"{o},{n}\n" for o, n in bad_plan), encoding="utf-8")
        sys.argv = ["x", str(csv_path)]  # dry-run ผ่าน main จริง ต้องล้มและไม่แตะไฟล์
        try:
            main()
            code = 0
        except SystemExit as e:
            code = e.code
        untouched = sorted(p.name for p in root.iterdir() if p.name != "rename-log.csv") == before
        ok &= bool(code) and untouched
        print("dry-run แผนเสีย: ออกด้วยข้อผิดและไม่แตะไฟล์:", "ผ่าน" if code and untouched else "ไม่ผ่าน")
        good = [("a.png", "02-exports/camp-hero-ig-v01.png"), ("b.png", "02-exports/camp-menu-ig-v01.png")]
        errors, _ = validate(good, root)
        log = root / "applied.csv"
        n = apply(good, root, log) if not errors else 0
        copied = all((root / new).is_file() and (root / old).is_file() for old, new in good)
        ok &= n == 2 and copied
        print(f"--apply แผนดี: คัดลอก {n}/2 ต้นฉบับอยู่ครบ:", "ผ่าน" if n == 2 and copied else "ไม่ผ่าน")
        (root / good[0][1]).write_bytes(b"edited")  # สำเนาที่ถูกแก้แล้ว undo ต้องไม่ลบ
        removed = undo(root, log)
        kept = (root / good[0][1]).is_file() and not (root / good[1][1]).exists()
        ok &= removed == 1 and kept
        print(f"--undo: ลบ {removed} (ต้อง 1) ไม่ลบสำเนาที่ถูกแก้:", "ผ่าน" if removed == 1 and kept else "ไม่ผ่าน")
        (root / "c,d.png").write_bytes(b"comma")  # ชื่อมีจุลภาค ต้อง undo ได้
        comma = [("c,d.png", "02-exports/camp,x-ig-v01.png")]
        log2 = root / "applied2.csv"
        apply(comma, root, log2)
        r2 = undo(root, log2)
        ok &= r2 == 1 and not (root / comma[0][1]).exists()
        print(f"--undo ชื่อมีจุลภาค: ลบ {r2} (ต้อง 1):", "ผ่าน" if r2 == 1 else "ไม่ผ่าน")
    print("self-test", "ผ่าน" if ok else "ไม่ผ่าน")
    return 0 if ok else 1


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):  # เครื่องที่ code page ไม่ใช่ UTF-8 พิมพ์ภาษาไทยผ่าน pipe แล้วล้ม
        sys.stdout.reconfigure(encoding="utf-8")
    if "--self-test" in sys.argv[1:]:
        sys.exit(self_test())
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("csv", type=Path)
    ap.add_argument("--root", type=Path, help="โฟลเดอร์ที่ path ใน csv อ้างถึง (ค่าตั้งต้น = โฟลเดอร์ของ csv)")
    ap.add_argument("--apply", action="store_true", help="คัดลอกจริง (ไม่ใส่ = ตรวจอย่างเดียว)")
    ap.add_argument("--undo", action="store_true", help="ลบสำเนาที่ --apply ทำไว้")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    root = a.root or a.csv.resolve().parent
    log = a.csv.with_suffix(".applied.csv")
    if a.undo:
        print(f"ลบสำเนา {undo(root, log)} ไฟล์ · ต้นฉบับไม่ถูกแตะ")
        return
    plan = read_plan(a.csv)
    errors, warns = validate(plan, root)
    for w in warns:
        print("เตือน:", w)
    if errors:
        sys.exit("\n".join(f"ผิด: {e}" for e in errors) + f"\nไม่ทำอะไรเลย · แก้ {a.csv.name} แล้วรันใหม่")
    print(f"แผน {len(plan)} ไฟล์ ผ่านทุกข้อ")
    if not a.apply:
        for old, new in plan:
            print(f"  จะคัดลอก {old} → {new}")
        print("ยังไม่แตะไฟล์ใด · ใส่ --apply เพื่อทำจริง")
        return
    n = apply(plan, root, log)
    print(f"คัดลอก {n}/{len(plan)} ไฟล์ · ต้นฉบับอยู่ครบ · บันทึกย้อนกลับ {log.name}")


if __name__ == "__main__":
    main()
