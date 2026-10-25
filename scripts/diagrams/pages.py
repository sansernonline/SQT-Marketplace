"""เขียนหน้า README ของรูป → docs/plugins/README.md และ docs/plugins/<plugin>/README.md

python scripts/diagrams/pages.py
อ่านจาก data/ + labels/ (รัน extract.py ก่อน) · เขียนทับหน้าเดิมทุกครั้ง อย่าแก้หน้าพวกนี้ด้วยมือ
"""
import glob, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.abspath(os.path.join(HERE, "..", "..", "docs", "plugins"))
NOTE = "<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->\n\n"
IMAGES = [
    ("flow.png", "SuperUser ทำงานอย่างไร", "หัวหน้าทีมรับงาน → เลือก playbook → แจกงานทีละขั้น → ตรวจก่อนตัดสินใจ → ส่งผล → เรียนรู้"),
    ("map.png", "แผนผัง plugin", "มี agent ไหน ใช้ skill อะไร มีคำสั่งอะไร และส่งงานต่อให้ plugin ไหน"),
    ("playbooks.png", "ขั้นตอนของ playbook", "แต่ละ playbook ทำกี่ขั้น ใครทำขั้นไหน ใช้ skill ไหน ตรงไหนรอผู้ใช้"),
]


def load(plugin):
    data = json.load(open(os.path.join(HERE, "data", f"{plugin}.json"), encoding="utf-8"))
    path = os.path.join(HERE, "labels", f"{plugin}.json")
    return data, (json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {})


def plugin_page(plugin, data, labels):
    pbs = labels.get("playbooks", {})
    shared = " (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md))"
    rows = "\n".join(f"| `{p['name']}` | {pbs.get(p['name'], {}).get('short', p['title'])}{shared if p['shared'] else ''} | {len(p['steps'])} |"
                     for p in data["playbooks"])
    images = "\n\n".join(f"## {title}\n\n{text}\n\n![{title}]({file})" for file, title, text in IMAGES)
    cross = " · ".join(f"[`{c}`](../{c}/README.md)" for c in data["cross"]) or "—"
    return (f"{NOTE}# {plugin}\n\n{labels.get('tagline', '')}\n\n"
            f"agent {len(data['agents'])} · skill {len(data['skills']) + len(data['core_skills'])}"
            + (f" (ของ plugin {len(data['skills'])} · ของกลางจาก superuser {len(data['core_skills'])})" if data['core_skills'] else "")
            + " · "
            f"คำสั่ง {len(data['commands'])} · playbook {len(data['playbooks'])} · ส่งงานต่อให้ {cross}\n\n"
            f"[← ทุก plugin](../README.md) · ต้นฉบับ: [`plugins/{plugin}/`](../../../plugins/{plugin}/)\n\n"
            f"{images}\n\n## playbook ทั้งหมด\n\n| playbook | ทำอะไร | ขั้น |\n|---|---|---|\n{rows}\n")


def index_page(plugins):
    rows = []
    for plugin in plugins:
        data, labels = load(plugin)
        name = f"`{plugin}` (แกนกลาง)" if plugin == "superuser" else f"`{plugin}`"
        links = " · ".join(f"[{t}]({plugin}/{f})" for f, t in (("flow.png", "flow"), ("map.png", "map"), ("playbooks.png", "playbooks")))
        rows.append(f"| [{name}]({plugin}/README.md) | {labels.get('tagline', '')} | {links} |")
    return (f"{NOTE}# รูปของทุก plugin\n\nรูปทั้งหมดสร้างจากไฟล์จริงใน `plugins/` ด้วย `scripts/diagrams/` · "
            f"แก้ plugin แล้วสร้างใหม่ได้ (ดู [scripts/README.md](../../scripts/README.md) หัวข้อ 6)\n\n"
            f"## ภาพรวม\n\n![ภาพรวม marketplace](marketplace-overview.png)\n\n"
            f"## hook ทำงานอย่างไร\n\n![hook](hook-lifecycle.png)\n\n"
            f"## แต่ละ plugin\n\nแต่ละโฟลเดอร์มี 3 รูป: `flow.png` วิธีทำงานของ SuperUser · `map.png` แผนผัง plugin · "
            f"`playbooks.png` ขั้นตอนของ playbook\n\n| plugin | ทำอะไร | รูป |\n|---|---|---|\n" + "\n".join(rows) +
            "\n\n## สีในรูป\n\n| สี | หมายถึง |\n|---|---|\n"
            "| สีประจำ plugin | หัวรูป · ไอคอน · เส้นนำสายตาของ plugin นั้น |\n"
            "| กรอบเส้นประ + ป้าย \"รอผู้ใช้อนุมัติ\" | ขั้นที่หยุดรอผู้ใช้ หรือผู้ใช้ต้องกดเอง |\n"
            "| ชิป skill · agent · playbook | ชื่อจริงในไฟล์ ค้นใน `plugins/` ได้ตรงตัว |\n")


if __name__ == "__main__":
    plugins = sorted(os.path.basename(f)[:-5] for f in glob.glob(os.path.join(HERE, "data", "*.json")))
    # superuser ขึ้นก่อน เพราะเป็นแกนของทุกตัว
    plugins.sort(key=lambda p: p != "superuser")
    for plugin in plugins:
        os.makedirs(os.path.join(DOCS, plugin), exist_ok=True)
        open(os.path.join(DOCS, plugin, "README.md"), "w", encoding="utf-8").write(plugin_page(plugin, *load(plugin)))
    open(os.path.join(DOCS, "README.md"), "w", encoding="utf-8").write(index_page(plugins))
    print(f"{len(plugins) + 1} หน้า → {DOCS}")
