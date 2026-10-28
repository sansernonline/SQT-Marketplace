"""ชิ้นส่วน HTML ของรูปแนว "วงกลมบนลายจุด" — ใช้ร่วมทุกรูป (map · playbook · flow · ภาพรวม)

ไอคอนจาก lucide-static 0.460.0 (ISC · kit/icons/LICENSE) · ไม่วาดไอคอนเอง
"""
import html, os, sys
from datetime import date

KIT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(KIT))
from palette import COLOR, emblem  # noqa: E402

CSS = open(os.path.join(KIT, "kit.css"), encoding="utf-8").read()
JS = open(os.path.join(KIT, "kit.js"), encoding="utf-8").read()
FONTS = "https://fonts.googleapis.com/css2?family=Anuphan:wght@400;600&family=Bai+Jamjuree:wght@600&display=swap"
TODAY = date.today().isoformat()
# บทบาท → ไอคอน (ใช้ชื่อเดียวกันทุกรูป)
ROLE_ICON = {"user": "user", "agent": "bot", "skill": "book-open", "core": "users", "gate": "hand", "pc": "layers"}


def e(text):
    return html.escape(str(text), quote=False)


def icon(name):
    svg = open(os.path.join(KIT, "icons", f"{name}.svg"), encoding="utf-8").read()
    return svg[svg.index("<svg"):].replace('width="24"', "").replace('height="24"', "")


def dot(role="core", ico=None, size="", id="", num=None):
    """วงกลม 1 วง · num แทนไอคอนด้วยเลขขั้น"""
    inner = f'<span class="n">{num}</span>' if num is not None else icon(ico or ROLE_ICON.get(role, "workflow"))
    return f'<div class="dot {role} {size}"{f" id={chr(34)}{id}{chr(34)}" if id else ""}>{inner}</div>'


def node(label, role="core", sub="", ico=None, size="", id="", num=None, extra=""):
    return (f'<div class="node">{dot(role, ico, size, id, num)}<div class="lb">{e(label)}</div>'
            + (f'<div class="sb">{e(sub)}</div>' if sub else "") + extra + "</div>")


def tag(text, role=""):
    return f'<span class="tag {role}"><i></i>{e(text)}</span>'


def wires(pairs):
    """pairs = [(from_id, to_id, "main"|"dash"|""), ...] → svg ที่ kit.js วาด"""
    import json
    return f"<svg class=\"wires\" data-wires='{json.dumps([list(p) for p in pairs])}'></svg>"


def head(title, sub, plugin, src, stats=()):
    st = "".join(f"<span><b>{n}</b>{e(l)}</span>" for n, l in stats)
    return (f'<div class="head">{emblem(plugin, 56)}<div><h1>{e(title)}</h1><p>{e(sub)}</p>'
            + (f'<div class="stats">{st}</div>' if st else "")
            + f'<div class="src">{e(src)} · <span class="nb">สร้างจากไฟล์จริง {TODAY}</span></div></div></div>')


LEGEND_ROLES = [("user", "ผู้ใช้"), ("core", "หัวหน้าทีม"), ("agent", "agent"), ("skill", "skill"), ("gate", "รอผู้ใช้อนุมัติ")]


def legend(roles=LEGEND_ROLES, note=""):
    """roles = [(บทบาท, คำ) หรือ (บทบาท, คำ, ไอคอน)] · ใส่เฉพาะที่มีในรูปจริง และไอคอนต้องตรงกับที่วาด"""
    items = "".join(f'<span>{dot(r[0], r[2] if len(r) > 2 else None)}{e(r[1])}</span>' for r in roles)
    return f'<div class="legend">{items}{f"<span>{e(note)}</span>" if note else ""}</div>'


def page(title, body, plugin="superuser"):
    pc = COLOR.get(plugin, COLOR["superuser"])
    return (f'<!doctype html><html lang="th"><head><meta charset="utf-8"><title>{e(title)}</title>'
            f'<link href="{FONTS}" rel="stylesheet"><style>{CSS}</style></head>'
            f'<body><div id="sheet" style="--pc:{pc}">{body}'
            f'<div class="foot"><span>SQT-Marketplace</span><span>scripts/diagrams/</span></div></div>'
            f"<script>{JS}</script></body></html>")
