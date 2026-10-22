"""
ค้นและดึงไอคอนจากคลัง tech-icons.zip (8,602 ไอคอน) ของ skill `diagram-figures`

ไม่ต้องติดตั้งอะไร ใช้ Python มาตรฐาน · คลังอยู่ไฟล์เดียวข้างสคริปต์นี้ ไม่ต้องแตกทั้งก้อน

  python find-icon.py kafka redis                 ค้นชื่อ → แสดง path ในคลัง (คำละไม่เกิน 20 ตัว)
  python find-icon.py --group brands docker       ค้นเฉพาะกลุ่ม (cloud · platform · brands · devtools · ui)
  python find-icon.py --copy cloud/aws/compute/ec2.png brands/docker.svg --to docs/figures/icons
                                                  ดึงเฉพาะไฟล์ที่ใช้ไปไว้ข้างรูป (ชื่อไฟล์เดิม ไม่มีโฟลเดอร์ย่อย)
  python find-icon.py --groups                    แสดงรายการกลุ่มทั้งหมด (GROUPS.md)
  python find-icon.py --colors docker nginx       รหัสสีทางการของโลโก้จาก brands/colors.json
"""
import argparse, json, os, sys, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ZIP = os.path.join(HERE, "tech-icons.zip")
ROOT = "tech-icons/"


def open_zip():
    if not os.path.exists(ZIP):
        sys.exit(f"ไม่เจอคลังไอคอน {ZIP}")
    return zipfile.ZipFile(ZIP)


def icons(z):
    return [n[len(ROOT):] for n in z.namelist() if n.lower().endswith((".svg", ".png"))]


def main():
    ap = argparse.ArgumentParser(description="ค้นและดึงไอคอนจาก tech-icons.zip")
    ap.add_argument("terms", nargs="*", help="คำค้น เช่น kafka")
    ap.add_argument("--group", help="ค้นเฉพาะกลุ่ม: cloud · platform · brands · devtools · ui")
    ap.add_argument("--copy", nargs="+", metavar="PATH", help="path ในคลังที่ต้องการดึงออกมา")
    ap.add_argument("--to", default=".", help="โฟลเดอร์ปลายทางของ --copy (ค่าเริ่ม: โฟลเดอร์ปัจจุบัน)")
    ap.add_argument("--groups", action="store_true", help="แสดง GROUPS.md")
    ap.add_argument("--colors", nargs="+", metavar="SLUG", help="รหัสสีทางการของโลโก้")
    a = ap.parse_args()
    z = open_zip()

    if a.groups:
        print(z.read(ROOT + "GROUPS.md").decode("utf-8"))
        return

    if a.colors:
        colors = json.loads(z.read(ROOT + "brands/colors.json").decode("utf-8"))
        for slug in a.colors:
            c = colors.get(slug)
            print(f"{slug}\t{c['hex']}\t{c['title']}" if c else f"{slug}\tไม่มีในคลัง")
        return

    if a.copy:
        os.makedirs(a.to, exist_ok=True)
        names = set(z.namelist())
        for p in a.copy:
            src = ROOT + p.strip("/")
            if src not in names:
                print(f"ไม่มี {p} — ค้นด้วย: python find-icon.py {os.path.splitext(os.path.basename(p))[0]}")
                continue
            dst = os.path.join(a.to, os.path.basename(src))
            with open(dst, "wb") as f:
                f.write(z.read(src))
            print(f"{p} → {dst}")
        return

    if not a.terms:
        ap.print_help()
        return

    pool = icons(z)
    if a.group:
        pool = [p for p in pool if p.startswith(a.group.strip("/") + "/")]
    for term in a.terms:
        hits = [p for p in pool if term.lower() in os.path.basename(p).lower()]
        hits.sort(key=lambda p: (len(os.path.basename(p)), p))
        print(f"# {term} — เจอ {len(hits)} ตัว" + (" (แสดง 20 ตัวแรก)" if len(hits) > 20 else ""))
        for p in hits[:20]:
            print(f"  {p}")


if __name__ == "__main__":
    main()
