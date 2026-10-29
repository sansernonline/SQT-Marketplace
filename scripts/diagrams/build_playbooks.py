"""สร้างรูป playbook แนว "วงกลมบนลายจุด" — 1 playbook = 1 รูป

python scripts/diagrams/build_playbooks.py <โฟลเดอร์ html>
ได้: <plugin>-pb-<playbook>.html ของทุก playbook ที่ plugin นั้นเป็นเจ้าของ (shared = วาดที่ superuser)
สีวงกลม = ผู้ลงมือ (หัวหน้าทีม navy · agent น้ำเงิน · ผู้ใช้เขียว · รออนุมัติ = วงกลวงส้ม) · สี plugin อยู่ที่เส้นหลักกับตรา
จัดหน้าแบบเดียว: รายการบนลงล่าง 1 ขั้นต่อแถว (วง · ชื่อขั้นกับคำอธิบาย · ใครทำและ skill) · เส้นตรงแนวตั้งต่อวง
labels ไม่ครบจำนวนขั้น → ใช้ข้อความจริงตัดสั้นแทน และพิมพ์เตือน
"""
import glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "kit"))
import kit  # noqa: E402
from kit import e, tag, wires, head, legend, page  # noqa: E402

warnings = []
# ส่วนเสริมเฉพาะหน้านี้: เลขขั้นเป็นป้ายมุมวง · กิ่งไป playbook อื่น (รายการแนวตั้ง .vlist .vrow อยู่ใน kit.css)
EXTRA_CSS = """
.dot{position:relative}
.dot .nb2{position:absolute;top:-6px;left:-6px;width:24px;height:24px;border-radius:50%;background:#fff;color:var(--ink);box-shadow:0 0 0 1.5px var(--ink3);font-family:var(--display);font-weight:600;font-size:15px;line-height:24px;text-align:center}
.branch{display:flex;align-items:center;gap:8px;font-size:15px;color:var(--ink2);margin-top:8px}
.branch i{width:32px;height:32px;border-radius:50%;border:2px dashed var(--pc);display:inline-flex;align-items:center;justify-content:center;flex:none;background:#fff}
.branch svg{width:16px;height:16px}
.phase{font-weight:600;font-size:17px;color:var(--pc);border-bottom:1px solid var(--rule);padding:0 0 8px 80px;margin-top:8px}  /* เว้นซ้าย 80px ให้เส้นแนวตั้งของวงผ่านโดยไม่ทับตัวหนังสือ */
.endrow{margin-top:40px;display:flex;gap:20px;align-items:center}
.endrow .card>div{color:var(--ink2)}  /* ไม่ใช้ .endrow span: จะทับสีขาวของป้าย pill */
"""
CUTS = (" · ", " (", ". ", " — ")


def clean(text):
    """ตัด markdown: `code` · **bold** · [ข้อความ](ลิงก์) · เส้น ---"""
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"(?:^|\s)-{3,}(?=\s|$)", " ", text)
    return re.sub(r"\s+", " ", re.sub(r"`|\*\*", "", text)).strip()


def clip(text, limit):
    """ตัดที่ขอบวลี (· ( . —) ก่อนเกิน limit ตัวอักษร ต่อท้าย … · วลีแรกสั้นไปจึงตัดที่ช่องว่าง"""
    text = clean(text)
    if len(text) <= limit:
        return text
    best = max(text.rfind(c, 0, limit) for c in CUTS)
    if best < limit * 0.4:
        best = text.rfind(" ", 0, limit)
    out = text[:best if best > 0 else limit]
    if out.count("(") > out.count(")"):  # ไม่ทิ้งวงเล็บค้าง
        out = out[:out.rfind("(")]
    return out.rstrip(" ·—.,") + "…"


def done_text(raw, limit=165):
    """เกณฑ์จบเมื่อ: เอาย่อหน้าแรก (ก่อนเส้น --- หรือบรรทัดว่าง) · แม่แบบที่เว้นช่องกรอก (… หรือ <…>) เปลี่ยนเป็นชื่อช่อง ·
    ยาวเกิน limit ตัดที่ขอบวลี ไม่ใส่ … (ไม่มีขอบวลีให้ใช้ข้อความเต็ม)"""
    raw = re.split(r"\n\s*(?:---|\n)", raw.strip())[0]
    text = clean(raw)
    labels = re.findall(r"([^\s·:]+):\s*(?:…|<)", text)
    if labels:
        return f"รายงาน {len(labels)} บรรทัด: " + " · ".join(labels)
    if len(text) <= limit:
        return text
    cut = max(text.rfind(" · ", 0, limit), text.rfind(". ", 0, limit))
    return text[:cut].rstrip() if cut > 20 else text


def desc_text(step, limit):
    """คำอธิบายขั้น: ข้อความจริงก่อน "ใคร:" · ยาวเกิน limit ตัดที่ขอบวลี (" · " หรือ ". ") ไม่ใส่ … · ไม่มีขอบวลีให้ตัด = ไม่แสดง"""
    text = clean(step["text"].rpartition(" · ใคร:")[0] or step["text"])
    if len(text) <= limit:
        return text
    cut = max(text.rfind(" · ", 0, limit), text.rfind(". ", 0, limit))
    colon = text.find(": ", 0, cut)
    if colon > 12:  # จุดตัดอยู่กลางรายการหลัง ":" → ตัดก่อน ":" ไม่ให้รายการขาดบางข้อ
        cut = colon
    return text[:cut].rstrip() if cut > 12 else ""


def role_of(s):
    who = s["who"] or {}
    if s["approval"]:
        return "gate"
    if who.get("agents"):
        return "agent"
    if who.get("user") and not who.get("lead"):
        return "user"
    return "core"


def dot(s, i):
    role = role_of(s)
    d = kit.dot(role, id=f"s{i}")
    return role, d[:-6] + f'<span class="nb2">{s["n"]}</span></div>'


def tags_html(s, role):
    who = s["who"] or {}
    out = []
    if who.get("lead") and role != "core":
        out.append(tag("หัวหน้าทีม", "core"))
    out += [tag(a, "agent") for a in who.get("agents", [])]
    if who.get("user") and role != "user":
        out.append(tag("ผู้ใช้", "user"))
    out += [tag(k, "skill") for k in s["skills"]]
    return f'<div class="tags">{"".join(out)}</div>'


def branches(s):
    return "".join(f'<div class="branch"><i>{kit.icon("git-branch")}</i><span>→ {e(p)}</span></div>' for p in s["playbooks"])


def build(plugin, p, lab):
    steps = lab.get("steps") or []
    if len(steps) != len(p["steps"]):
        warnings.append(f"{plugin}/{p['name']}: labels มี {len(steps)} ขั้น แต่ไฟล์จริงมี {len(p['steps'])} — ใช้ข้อความจริงตัดสั้น")
        steps = [clip(s["text"].rpartition(" · ใคร: ")[0] or s["text"], 40) for s in p["steps"]]
    cells, pairs, last_phase, roles = [], [], None, set()
    for i, (s, short) in enumerate(zip(p["steps"], steps)):
        ph = s.get("phase") or None
        if ph and ph != last_phase:
            cells.append(f'<div class="phase">ช่วง: {e(clean(ph))}</div>')
        last_phase = ph
        role, d = dot(s, i)
        roles.add(role)
        tg = tags_html(s, role)
        desc = desc_text(s, 260) or clip(s["text"].rpartition(" · ใคร:")[0] or s["text"], 260)  # การ์ดกว้าง ใส่คำอธิบายเต็มได้ ตัดเฉพาะที่ยาวมาก
        sb = f'<div class="sb">{e(desc)}</div>' if desc and desc != short else ""
        cells.append(f'<div class="vrow">{d}<div class="card"><div class="lb">{e(short)}</div>{sb}</div><div>{tg}{branches(s)}</div></div>')
        if i:
            pairs.append((f"s{i-1}", f"s{i}", "main"))
    gates = sum(1 for s in p["steps"] if s["approval"])
    stats = [(len(p["steps"]), "ขั้น")] + ([(gates, "ขั้นรอผู้ใช้อนุมัติ")] if gates else [])
    body = head(lab.get("short") or p["title"], "ใช้เมื่อ: " + clip(p["when"], 110), plugin,
                f"playbook-{p['name']}.md", stats)
    body += f'<div class="vlist" style="gap:{24 if len(cells) >= 9 else 32}px">{wires(pairs)}{"".join(cells)}</div>'
    body += (f'<div class="endrow">{kit.dot("pc", "check")}<div class="card" style="flex:1"><span class="pill">จบเมื่อ</span>'
             f'<div style="margin-top:8px"><span>{e(done_text(p["done"]))}</span></div></div></div>')
    names = {"core": "หัวหน้าทีม", "agent": "agent", "user": "ผู้ใช้", "gate": "รอผู้ใช้อนุมัติ"}
    for st in p["steps"]:  # บทบาทที่ปรากฏเป็นป้ายก็ต้องมีในคำอธิบาย
        w = st["who"] or {}
        roles |= {r for r, on in (("core", w.get("lead")), ("agent", w.get("agents")), ("user", w.get("user"))) if on}
    items = [(r, names[r]) for r in ("core", "agent", "user", "gate") if r in roles]
    if any(s["skills"] for s in p["steps"]):
        items.append(("skill", "skill ที่ใช้"))
    note = "วงประ = ต่อไป playbook อื่น" if any(s["playbooks"] for s in p["steps"]) else ""
    body += legend(items, note)
    return page(f"{plugin} · {p['name']}", body, plugin).replace("</style>", EXTRA_CSS + "</style>", 1)


if __name__ == "__main__":
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    count = {}
    for f in sorted(glob.glob(os.path.join(HERE, "data", "*.json"))):
        plugin = os.path.basename(f)[:-5]
        data = json.load(open(f, encoding="utf-8"))
        lp = os.path.join(HERE, "labels", f"{plugin}.json")
        labels = json.load(open(lp, encoding="utf-8")) if os.path.exists(lp) else {}
        for p in data["playbooks"]:
            if p["shared"]:
                continue
            html = build(plugin, p, labels.get("playbooks", {}).get(p["name"], {}))
            open(os.path.join(out, f"{plugin}-pb-{p['name']}.html"), "w", encoding="utf-8").write(html)
            count[plugin] = count.get(plugin, 0) + 1
    print(sum(count.values()), "html →", out, count)
    for w in warnings:
        print("เตือน:", w)
