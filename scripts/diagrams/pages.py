"""เขียนหน้า README ของรูป → docs/plugins/README.md และ docs/plugins/<plugin>/README.md

python scripts/diagrams/pages.py
อ่านจาก data/ + labels/ (รัน extract.py ก่อน) · เขียนทับหน้าเดิมทุกครั้ง อย่าแก้หน้าพวกนี้ด้วยมือ
"""
import glob, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.abspath(os.path.join(HERE, "..", "..", "docs", "plugins"))
NOTE = "<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->\n\n"


def series(plugin, sub):
    """รูปในโฟลเดอร์ย่อย (flow/ · playbooks/) เรียงตามชื่อไฟล์"""
    return sorted(os.path.basename(f) for f in glob.glob(os.path.join(DOCS, plugin, sub, "*.png")))


def load(plugin):
    data = json.load(open(os.path.join(HERE, "data", f"{plugin}.json"), encoding="utf-8"))
    path = os.path.join(HERE, "labels", f"{plugin}.json")
    return data, (json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {})


def plugin_page(plugin, data, labels):
    pbs = labels.get("playbooks", {})
    shared = " (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md))"
    pngs = set(series(plugin, "playbooks"))
    short = lambda p: pbs.get(p["name"], {}).get("short", p["title"])
    link = lambda p: f"[`{p['name']}`](#pb-{p['name']})" if f"{p['name']}.png" in pngs else f"`{p['name']}`"
    rows = "\n".join(f"| {link(p)} | {short(p)}{shared if p['shared'] else ''} | {len(p['steps'])} |" for p in data["playbooks"])
    # flow/<k>-<ชื่อ>.png · ชื่อหลังเลขลำดับเป็นคำอธิบายสั้นของรูป
    flow = "\n\n".join(f"![SuperUser ขั้น {f[:-4].replace('-', ' ', 1)}](flow/{f})" for f in series(plugin, "flow"))
    pb_imgs = "\n\n".join(f'<a id="pb-{p["name"]}"></a>\n\n### {short(p)} · `{p["name"]}`\n\n![{short(p)}](playbooks/{p["name"]}.png)'
                          for p in data["playbooks"] if f"{p['name']}.png" in pngs)
    images = (f"## แผนผัง plugin\n\nเรื่องเข้ามาทางไหน ไปถึง agent ไหน ใช้ skill อะไร\n\n![แผนผัง plugin](map.png)\n\n"
              f"## SuperUser ทำงานอย่างไร\n\nหัวหน้าทีมรับงาน → จัดขนาด → แจกงาน → ตรวจซ้ำจนผ่าน → ส่งมอบ → เรียนรู้\n\n{flow}")
    cross = " · ".join(f"[`{c}`](../{c}/README.md)" for c in data["cross"]) or "—"
    return (f"{NOTE}# {plugin}\n\n{labels.get('tagline', '')}\n\n"
            f"agent {len(data['agents'])} · skill {len(data['skills']) + len(data['core_skills'])}"
            + (f" (ของ plugin {len(data['skills'])} · ของกลางจาก superuser {len(data['core_skills'])})" if data['core_skills'] else "")
            + " · "
            f"คำสั่ง {len(data['commands'])} · playbook {len(data['playbooks'])} · ส่งงานต่อให้ {cross}\n\n"
            f"[← ทุก plugin](../README.md) · ต้นฉบับ: [`plugins/{plugin}/`](../../../plugins/{plugin}/)\n\n"
            f"{images}\n\n## playbook ทั้งหมด\n\n| playbook | ทำอะไร | ขั้น |\n|---|---|---|\n{rows}\n\n{pb_imgs}\n")


def index_page(plugins):
    rows = []
    for plugin in plugins:
        data, labels = load(plugin)
        name = f"`{plugin}` (แกนกลาง)" if plugin == "superuser" else f"`{plugin}`"
        links = f"[แผนผัง]({plugin}/map.png) · flow {len(series(plugin, 'flow'))} รูป · playbook {len(series(plugin, 'playbooks'))} รูป"
        rows.append(f"| [{name}]({plugin}/README.md) | {labels.get('tagline', '')} | {links} |")
    return (f"{NOTE}# รูปของทุก plugin\n\nรูปทั้งหมดสร้างจากไฟล์จริงใน `plugins/` ด้วย `scripts/diagrams/` · "
            f"แก้ plugin แล้วสร้างใหม่ได้ (ดู [scripts/README.md](../../scripts/README.md) หัวข้อ 6)\n\n"
            f"## ภาพรวม\n\n![ภาพรวม marketplace](marketplace-overview.png)\n\n"
            f"## hook ทำงานอย่างไร\n\n![hook](hook-lifecycle.png)\n\n"
            f"## แต่ละ plugin\n\nแต่ละโฟลเดอร์มี `map.png` แผนผัง plugin · `flow/` วิธีทำงานของ SuperUser เป็นชุดรูปเรียงขั้น · "
            f"`playbooks/` playbook ละ 1 รูป\n\n| plugin | ทำอะไร | รูป |\n|---|---|---|\n" + "\n".join(rows) +
            "\n\n## สีในรูป\n\n| สี | หมายถึง |\n|---|---|\n"
            "| สีประจำ plugin | ตรา · เลขขั้น · เส้นทางหลักของ plugin นั้น |\n"
            "| วงม่วง | ผู้ใช้ · ทางเข้าของงาน |\n"
            "| วงกรมท่า | หัวหน้าทีม · ของกลางจาก superuser |\n"
            "| วงฟ้า · วงเขียวอมฟ้า | agent · skill |\n"
            "| วงกลวงขอบส้ม | ขั้นที่หยุดรอผู้ใช้อนุมัติ หรือผู้ใช้ต้องกดเอง |\n")


if __name__ == "__main__":
    plugins = sorted(os.path.basename(f)[:-5] for f in glob.glob(os.path.join(HERE, "data", "*.json")))
    # superuser ขึ้นก่อน เพราะเป็นแกนของทุกตัว
    plugins.sort(key=lambda p: p != "superuser")
    for plugin in plugins:
        os.makedirs(os.path.join(DOCS, plugin), exist_ok=True)
        open(os.path.join(DOCS, plugin, "README.md"), "w", encoding="utf-8").write(plugin_page(plugin, *load(plugin)))
    open(os.path.join(DOCS, "README.md"), "w", encoding="utf-8").write(index_page(plugins))
    print(f"{len(plugins) + 1} หน้า → {DOCS}")
