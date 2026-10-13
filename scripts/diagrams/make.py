"""สร้างรูปทั้งชุดในคำสั่งเดียว → docs/plugins/

python scripts/diagrams/make.py            ทุกรูป (38 รูป + หน้า README)
python scripts/diagrams/make.py career     เฉพาะ plugin ที่ระบุ (ยังสร้างภาพรวมและ hook ใหม่ด้วย)

ขั้น: extract.py → build.py + flow/build_fig.py (HTML) → render.py (PNG) → ย้ายเข้าโฟลเดอร์ของแต่ละ plugin → pages.py
ไฟล์กลางทางอยู่ใน _to_delete/diagrams/
"""
import glob, os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
WORK = os.path.join(ROOT, "_to_delete", "diagrams")
DOCS = os.path.join(ROOT, "docs", "plugins")


def run(*args, cwd=ROOT):
    subprocess.run([sys.executable, *args], cwd=cwd, check=True)


def target(name):
    # ชื่อไฟล์ HTML → ที่อยู่ใน docs/plugins/
    if name in ("marketplace-overview", "hook-lifecycle"):
        return os.path.join(DOCS, f"{name}.png")
    if name.startswith("superuser-"):
        plugin = name[len("superuser-"):]
        return os.path.join(DOCS, "superuser" if plugin == "core" else plugin, "flow.png")
    plugin, _, kind = name.rpartition("-")
    return os.path.join(DOCS, plugin, f"{kind}.png")


if __name__ == "__main__":
    only = set(sys.argv[1:])
    html, png = os.path.join(WORK, "html"), os.path.join(WORK, "png")
    shutil.rmtree(WORK, ignore_errors=True)
    run(os.path.join(HERE, "extract.py"))
    run(os.path.join(HERE, "build.py"), html)
    run("build_fig.py", ROOT, "template.html", html, cwd=os.path.join(HERE, "flow"))
    files = sorted(glob.glob(os.path.join(html, "*.html")))
    if only:
        keep = lambda f: any(p in os.path.basename(f) for p in only | {"marketplace-overview", "hook-lifecycle"})
        files = [f for f in files if keep(f)]
    run(os.path.join(HERE, "render.py"), png, *files)
    for f in files:
        name = os.path.basename(f)[:-5]
        dest = target(name)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copyfile(os.path.join(png, f"{name}.png"), dest)
    run(os.path.join(HERE, "pages.py"))
    print(f"{len(files)} รูป → {DOCS}")
