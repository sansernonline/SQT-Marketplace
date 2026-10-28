"""สีประจำ plugin + ไอคอน — นิยามที่เดียว ใช้ร่วมใน kit/ · build.py · build_playbooks.py · flow/build_flow.py

ไอคอนอ่านจาก plugins/<plugin>/assets/icon.svg (ไอคอนประจำ plugin ตัวจริง) · สีประจำ plugin คือสีล่างของกรอบไอคอน
เข้มขึ้นจนตัวหนังสือขาวบนพื้นสีได้ ≥ 4.9:1 · plugin ที่ยุบไปแล้ว (ข้อมูลเก่ายังอ้างชื่อ) ใช้ของ plugin ที่รับไป
"""
import base64
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PLUGINS = ["superuser", "software-company", "e-commerce", "trading-finance", "personal-life", "graphic-design"]
MERGED = {"career": "personal-life", "health-wellness": "personal-life", "home-family": "personal-life",
          "consumer-rights": "e-commerce", "online-seller": "e-commerce"}


def _icon(plugin):
    with open(os.path.join(ROOT, "plugins", MERGED.get(plugin, plugin), "assets", "icon.svg"), encoding="utf-8") as f:
        return f.read()


def _lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def _on_white(h, target=4.9):
    """เข้มสีทีละนิดจนตัวหนังสือขาวบนสีนี้ได้ contrast ตามเป้า"""
    rgb = [int(h[i:i + 2], 16) for i in (1, 3, 5)]
    for k in range(60):
        c = "#" + "".join(f"{round(v * (1 - k / 80)):02x}" for v in rgb)
        if 1.05 / (_lum(c) + 0.05) >= target:
            return c
    return c


def _color(plugin):
    stops = re.findall(r'stop-color="(#[0-9a-fA-F]{6})"', _icon(plugin))
    return _on_white(stops[1])  # สีล่างของกรอบ


COLOR = {p: _color(p) for p in PLUGINS}
COLOR.update({old: COLOR[new] for old, new in MERGED.items()})


def icon_uri(plugin):
    return "data:image/svg+xml;base64," + base64.b64encode(_icon(plugin).encode("utf-8")).decode("ascii")


def emblem(plugin, size=24, stroke=None):
    """ไอคอนประจำ plugin ตัวจริง (มีกรอบสีในตัว) · stroke คงไว้ให้โค้ดเดิมเรียกได้"""
    return f'<img class="emb" src="{icon_uri(plugin)}" width="{size}" height="{size}" alt="">'


def badge(plugin, size=24, cls="badge"):
    """ไอคอนในบรรทัด · ไอคอนมีกรอบสีอยู่แล้ว จึงไม่ใส่พื้นสีซ้อน"""
    return f'<span class="{cls}" style="background:none;border:none">{emblem(plugin, size)}</span>'

