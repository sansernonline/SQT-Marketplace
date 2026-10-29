"""สร้างรูปทั้งชุดในคำสั่งเดียว → docs/plugins/

python scripts/diagrams/make.py            ทุกรูป + หน้า README
python scripts/diagrams/make.py trading-finance   เฉพาะ plugin ที่ระบุ (ยังสร้างภาพรวมและ hook ใหม่ด้วย)

ขั้น: extract.py → build.py (map · ภาพรวม · hook) + build_playbooks.py (playbook ละรูป) + flow/build_flow.py (flow เป็นชุด)
+ compare/build_compare.py (รูปตารางเทียบ → docs/<ชื่อ>.png)
→ render.py (PNG) → ย้ายเข้าโฟลเดอร์ของแต่ละ plugin → pages.py
ผังโฟลเดอร์: docs/plugins/<plugin>/map.png · flow/<k>-<ชื่อ>.png · playbooks/<playbook>.png
ไฟล์กลางทางอยู่ใน _to_delete/diagrams/
"""
import glob, os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
WORK = os.path.join(ROOT, "_to_delete", "diagrams")
DOCS = os.path.join(ROOT, "docs", "plugins")
COMPARE = {os.path.basename(f)[:-5] for f in glob.glob(os.path.join(HERE, "compare", "*.json"))}


def run(*args, cwd=ROOT):
    subprocess.run([sys.executable, *args], cwd=cwd, check=True)


def target(name):
    # ชื่อไฟล์ HTML → ที่อยู่ใน docs/plugins/ · รูปเทียบ (compare/*.json) อยู่ที่ docs/ ตรง ๆ
    if name in COMPARE:
        return os.path.join(ROOT, "docs", f"{name}.png")
    if name in ("marketplace-overview", "hook-lifecycle"):
        return os.path.join(DOCS, f"{name}.png")
    if "-flow-" in name:  # superuser-<plugin>-flow-<k>-<ชื่อ> · plugin core = superuser เอง
        head, _, rest = name.partition("-flow-")
        plugin = head[len("superuser-"):]
        return os.path.join(DOCS, "superuser" if plugin == "core" else plugin, "flow", f"{rest}.png")
    if "-pb-" in name:  # <plugin>-pb-<playbook>
        plugin, _, pb = name.partition("-pb-")
        return os.path.join(DOCS, plugin, "playbooks", f"{pb}.png")
    plugin, _, kind = name.rpartition("-")  # <plugin>-map
    return os.path.join(DOCS, plugin, f"{kind}.png")


if __name__ == "__main__":
    only = set(sys.argv[1:])
    html, png = os.path.join(WORK, "html"), os.path.join(WORK, "png")
    shutil.rmtree(WORK, ignore_errors=True)
    run(os.path.join(HERE, "extract.py"))
    run(os.path.join(HERE, "build.py"), html)
    run(os.path.join(HERE, "build_playbooks.py"), html)
    run(os.path.join(HERE, "flow", "build_flow.py"), ROOT, html)
    run(os.path.join(HERE, "compare", "build_compare.py"), html)
    files = sorted(glob.glob(os.path.join(html, "*.html")))
    if only:
        keep = lambda f: any(p in os.path.basename(f) for p in only | {"marketplace-overview", "hook-lifecycle"})
        files = [f for f in files if keep(f)]
    run(os.path.join(HERE, "render.py"), png, *files)
    # ล้างชุด flow/ และ playbooks/ ของ plugin ที่สร้างใหม่ ไม่ให้รูปของขั้นที่ถูกลบค้าง
    for d in {os.path.dirname(target(os.path.basename(f)[:-5])) for f in files}:
        if os.path.basename(d) in ("flow", "playbooks"):
            shutil.rmtree(d, ignore_errors=True)
    locked = []
    for f in files:
        name = os.path.basename(f)[:-5]
        dest = target(name)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        try:
            shutil.copyfile(os.path.join(png, f"{name}.png"), dest)
        except OSError:  # รูปเปิดค้างในโปรแกรมดูรูป (Windows ล็อกไฟล์) → ข้ามแล้วทำต่อ ไม่ให้รูปที่เหลือหายเพราะล้างโฟลเดอร์ไปแล้ว
            locked.append(dest)
    run(os.path.join(HERE, "pages.py"))
    print(f"{len(files) - len(locked)} รูป → {DOCS}")
    if locked:
        print("เตือน: เขียนทับไม่ได้ (ปิดโปรแกรมที่เปิดรูปอยู่แล้วรันใหม่):", *locked, sep="\n  ")
        sys.exit(1)
