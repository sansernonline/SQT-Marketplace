"""สีประจำ plugin + ตราสัญลักษณ์ (SVG) — นิยามที่เดียว ใช้ทั้ง build.py และ flow/build_fig.py

ทุกสีผ่านตัวหนังสือขาวบนพื้นสี ≥ 4.9:1 · สีใกล้กันถูกแยกให้ห่าง (แดงเข้ม/ชมพู/บานเย็น · ฟ้าน้ำทะเล/เขียว · น้ำเงิน/ทอง/เทาน้ำเงิน)
"""

COLOR = {
    "superuser": "#4338CA", "career": "#1D4ED8", "consumer-rights": "#991B1B", "dev-learning": "#0E7490",
    "graphic-design": "#A21CAF", "health-wellness": "#15803D", "home-family": "#C2410C", "online-seller": "#BE185D",
    "personal-life": "#6D28D9", "software-company": "#3B5B7A", "thai-workplace": "#4D7C0F", "trading-finance": "#A16207",
}

# รูปทรงเรขาคณิตง่าย ๆ ใน viewBox 24 × 24 เส้นอย่างเดียว
SHAPE = {
    "superuser": '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="3.5" r="1.5"/><circle cx="12" cy="20.5" r="1.5"/>'
                 '<circle cx="3.5" cy="12" r="1.5"/><circle cx="20.5" cy="12" r="1.5"/><path d="M12 5v4M12 15v4M5 12h4M15 12h4"/>',
    "career": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    "consumer-rights": '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    "dev-learning": '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    "graphic-design": '<circle cx="8" cy="8" r="4.5"/><rect x="12.5" y="12.5" width="8" height="8" rx="1"/><path d="M4 20.5 8 14l4 6.5z"/>',
    "health-wellness": '<path d="M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20z"/><path d="M7 12h3l1.5-2.5 2 5 1.5-2.5h2"/>',
    "home-family": '<path d="M3 11 12 3l9 8"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    "online-seller": '<path d="M5 8h14l-1 13H6z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
    "personal-life": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="12" cy="15.5" r="2"/>',
    "software-company": '<path d="m12 3 9 4.5-9 4.5-9-4.5z"/><path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5"/>',
    "thai-workplace": '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 11h7M9 14h7"/><circle cx="14" cy="18" r="1.6"/>',
    "trading-finance": '<path d="M3 3v18h18"/><path d="m6 15 4-4 3 3 7-7"/><path d="M16 7h4v4"/>',
}


def emblem(plugin, size=24, stroke="#fff"):
    return (f'<svg class="emb" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{stroke}" '
            f'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{SHAPE[plugin]}</svg>')


def badge(plugin, size=24, cls="badge"):
    """ตราบนก้อนสีของ plugin"""
    return f'<span class="{cls}" style="background:{COLOR[plugin]}">{emblem(plugin, size)}</span>'
