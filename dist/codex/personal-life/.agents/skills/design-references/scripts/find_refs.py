"""หางานออกแบบต้นแบบจากเว็บที่เก่งงานแต่ละประเภท แล้วถอดสีจากงานที่เลือก · ไม่เก็บสีหรือรูปไว้ในเครื่อง

  python find_refs.py links web "ร้านกาแฟ specialty"         ลิงก์หน้าค้นหาของทุกเว็บในประเภทนั้น (ดู data/sites.csv)
  python find_refs.py icons "coffee" [-n 12]                 ค้นสด Iconify: ไอคอนรายตัวที่ใบอนุญาตใช้เชิงพาณิชย์ได้
  python find_refs.py openverse "paper craft" [-n 10]         ค้นสด Openverse: ภาพ CC ที่ใช้เชิงพาณิชย์ได้
  python find_refs.py palette-from <URL หรือไฟล์รูป> [--out <โฟลเดอร์>]   จับภาพหน้าเว็บแล้วถอดสีหลัก 6 สี
  python find_refs.py board web "ร้านกาแฟ" [--ref <URL หรือรูป> ...] --out <ไฟล์.html>
  python find_refs.py fallback "coffee warm" [-n 8]           คลังสำรอง 2,360 ชุด 8 หน้าที่ · ใช้เมื่อค้นสดไม่ได้เท่านั้น
  python find_refs.py --self-test

ประเภท (type): web · app · dashboard · slide · document · icon · logo · social · illustration · color · font · motion
งานจากเว็บแรงบันดาลใจ (Pinterest · Dribbble · Behance ฯลฯ) ใช้ดูเป็นต้นแบบเท่านั้น ห้ามยกภาพมาใส่งาน
"""
import argparse
import csv
import html
import ipaddress
import json
import socket
import sys
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path

SITES = Path(__file__).resolve().parent.parent / "data" / "sites.csv"
UA = {"User-Agent": "sqt-marketplace design-references (claude code skill)"}
BLOCKED = ("you have been blocked", "access denied", "just a moment", "verify you are human", "attention required", "captcha")
LICENSE_OK = {"MIT", "Apache-2.0", "ISC", "CC0-1.0", "OFL-1.1", "CC-BY-4.0", "CC-BY-3.0", "Unlicense", "BSD-3-Clause"}
# คำไทยที่พบบ่อยในโจทย์ → คำอังกฤษที่เว็บออกแบบใช้ค้น (เป็นคำศัพท์ ไม่ใช่ข้อมูลออกแบบ)
TH = {
    "ร้านกาแฟ": "coffee shop", "กาแฟ": "coffee", "ร้านอาหาร": "restaurant", "อาหาร": "food", "ขนม": "bakery dessert",
    "คลินิก": "clinic", "ทันตกรรม": "dental", "โรงพยาบาล": "hospital", "สุขภาพ": "health", "ความงาม": "beauty",
    "สปา": "spa", "โรงแรม": "hotel", "ท่องเที่ยว": "travel", "อสังหา": "real estate", "คอนโด": "condo", "บ้าน": "home",
    "การเงิน": "finance", "ธนาคาร": "bank", "ลงทุน": "investment", "หุ้น": "stock trading", "ประกัน": "insurance",
    "การศึกษา": "education", "โรงเรียน": "school", "คอร์ส": "online course", "ร้านค้า": "shop", "ขายของ": "ecommerce",
    "แฟชั่น": "fashion", "เสื้อผ้า": "clothing", "ทอง": "gold jewelry", "เครื่องประดับ": "jewelry", "รถ": "car automotive",
    "โลจิสติกส์": "logistics", "ก่อสร้าง": "construction", "กฎหมาย": "law firm", "บัญชี": "accounting", "ราชการ": "government",
    "เทคโนโลยี": "technology", "ซอฟต์แวร์": "software saas", "แอป": "app", "เกม": "game", "เด็ก": "kids", "สัตว์เลี้ยง": "pet",
    "ฟิตเนส": "fitness gym", "กีฬา": "sport", "ดนตรี": "music", "งานแต่ง": "wedding", "ไทย": "thai", "ญี่ปุ่น": "japanese",
    "มินิมอล": "minimal", "หรู": "luxury", "วินเทจ": "vintage", "อบอุ่น": "warm", "สดใส": "vibrant", "ธรรมชาติ": "natural organic",
    "รายงาน": "report", "ใบเสนอราคา": "proposal", "นำเสนอ": "pitch deck", "แดชบอร์ด": "dashboard", "โปสเตอร์": "poster",
    "จองคิว": "booking appointment", "นัดหมาย": "appointment", "ขอทุน": "fundraising pitch", "ระดมทุน": "fundraising",
    "สตาร์ทอัพ": "startup", "สตาร์ทอัป": "startup", "ร้านตัดผม": "barber", "ร้านเสริมสวย": "beauty salon", "ส่งของ": "delivery",
    "ตลาด": "marketplace", "ชุมชน": "community", "องค์กร": "corporate", "โรงงาน": "manufacturing", "เกษตร": "agriculture",
    "พลังงาน": "energy", "ประชุม": "conference event", "สัมมนา": "seminar event", "งานวิ่ง": "running event", "คอนเสิร์ต": "concert",
    "เมนู": "menu", "ป้ายร้าน": "signage", "นามบัตร": "business card", "หน้าปก": "cover", "โบรชัวร์": "brochure", "แคตตาล็อก": "catalog",
}


def keywords(query):
    """แปลงคำไทยเป็นอังกฤษ (รวมคำไทยที่ติดกัน) · คำอังกฤษคงไว้"""
    out = []
    for w in query.split():
        if w in TH:
            out.append(TH[w])
            continue
        rest, hit = w, False
        for th in sorted(TH, key=len, reverse=True):
            if th in rest:
                out.append(TH[th])
                rest = rest.replace(th, " ")
                hit = True
        if not hit or rest.strip():
            out.append(rest.strip() if hit else w)
    return " ".join(dict.fromkeys(x for x in out if x))


def sites(kind=None):
    with SITES.open(encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    return [r for r in rows if not kind or r["type"] == kind]


def links(kind, query):
    q = urllib.parse.quote(keywords(query))
    return [{"site": r["site"], "good_for": r["good_for"], "use": r["use"], "url": r["search_url"].replace("{q}", q)}
            for r in sites(kind)]


def get_json(url):
    req = urllib.request.Request(url, headers=UA)
    for i in range(2):
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.load(r)
        except OSError:
            if i:
                raise


def icons(query, n=12):
    """ค้นทีละคำ (API ของ Iconify หาเจอเมื่อส่งคำเดียว) · ชุดละไม่เกิน 2 ตัว ให้เห็นหลายสไตล์"""
    out, per_set = [], {}
    for word in keywords(query).split() or [query]:
        res = get_json("https://api.iconify.design/search?" + urllib.parse.urlencode({"query": word, "limit": 64}))
        lic = {p: (c.get("license") or {}).get("spdx", "") for p, c in (res.get("collections") or {}).items()}
        for full in res.get("icons", []):
            p, name = full.split(":", 1)
            if lic.get(p) in LICENSE_OK and per_set.get(p, 0) < 2 and len(out) < n:
                per_set[p] = per_set.get(p, 0) + 1
                out.append({"icon": full, "license": lic[p], "svg": f"https://api.iconify.design/{p}/{name}.svg"})
    return out


def openverse(query, n=10):
    q = urllib.parse.urlencode({"q": keywords(query), "license_type": "commercial", "page_size": n})
    res = get_json(f"https://api.openverse.org/v1/images/?{q}")
    return [{"title": r.get("title"), "creator": r.get("creator"),
             "license": f"{r.get('license')} {r.get('license_version') or ''}".strip(), "page": r.get("foreign_landing_url")}
            for r in res.get("results", [])]


def public_url(url):
    """รับเฉพาะ http(s) ที่ชี้ไปเครื่องสาธารณะ กันการจับภาพเครื่องในวงแลน"""
    u = urllib.parse.urlparse(url)
    if u.scheme not in ("http", "https") or not u.hostname:
        return False
    try:
        return all(ipaddress.ip_address(a[4][0]).is_global for a in socket.getaddrinfo(u.hostname, None))
    except (socket.gaierror, ValueError):
        return False


def capture(url, out_png):
    """จับภาพหน้าเว็บ · ทุก request รวม redirect และไฟล์ย่อยต้องไปเครื่องสาธารณะ ไม่งั้นตัดทิ้ง (กัน SSRF และ DNS rebinding)"""
    from playwright.sync_api import sync_playwright
    checked = {}

    def guard(route):
        host = urllib.parse.urlparse(route.request.url).hostname or ""
        if route.request.url.startswith("data:"):
            return route.continue_()
        if host not in checked:
            checked[host] = public_url(route.request.url)
        return route.continue_() if checked[host] else route.abort()

    with sync_playwright() as pw:
        b = pw.chromium.launch()
        t = b.new_page(viewport={"width": 1440, "height": 900})
        t.route("**/*", guard)
        try:
            t.goto(url, timeout=45000, wait_until="load")
        except Exception as e:  # เว็บล่ม หมดเวลา หรือ redirect ไปที่อยู่ภายในแล้วถูกตัด
            b.close()
            raise ValueError(f"เปิด {url} ไม่ได้ ({str(e).splitlines()[0][:120]}) · ถ้าเว็บพาไปที่อยู่ภายในเครื่องจะถูกตัดโดยตั้งใจ")
        if not public_url(t.url):
            b.close()
            raise ValueError(f"{url} พาไปที่อยู่ที่ไม่ใช่เว็บสาธารณะ ({t.url}) จึงไม่จับภาพ")
        t.wait_for_timeout(1500)
        text = (t.inner_text("body") or "")[:3000].lower()
        t.screenshot(path=str(out_png), full_page=True)
        b.close()
    if any(s in text for s in BLOCKED):
        raise ValueError(f"{url} กันบอท ได้หน้าบล็อกแทนเว็บจริง · ให้ผู้ใช้จับภาพหน้าเว็บเอง แล้วส่งไฟล์รูปเข้า palette-from")


def lum(hex_):
    c = [int(hex_[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def contrast(a, b):
    hi, lo = sorted((lum(a), lum(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


# ลำดับเดียวกับ --palette ของ design-direction-lookup (สี 8 ตัวแบบไม่ใส่ชื่อ)
ROLES = ["bg", "surface", "text", "text_muted", "primary", "secondary", "accent", "border"]
ROLE_TH = {"bg": "พื้น", "surface": "พื้นรอง", "border": "เส้นขอบ", "text": "ตัวหนังสือ", "text_muted": "ตัวหนังสือรอง",
           "primary": "สีหลัก", "secondary": "สีรอง", "accent": "สีเน้น"}


def rgb(h):
    return [int(h[i:i + 2], 16) for i in (1, 3, 5)]


def mix(a, b, t):
    """ผสมสี a กับ b ที่สัดส่วน t (0 = a ล้วน)"""
    return "#" + "".join(f"{round(x + (y - x) * t):02x}" for x, y in zip(rgb(a), rgb(b)))


def sat(h):
    c = rgb(h)
    return max(c) - min(c)


def hue(h):
    r, g, b = (x / 255 for x in rgb(h))
    mx, mn = max(r, g, b), min(r, g, b)
    if mx == mn:
        return 0
    d = mx - mn
    return 60 * (((g - b) / d) % 6 if mx == r else (b - r) / d + 2 if mx == g else (r - g) / d + 4)


def roles(cols):
    """จัดสีที่ถอดได้ (เรียงตามพื้นที่) ให้เป็น 8 หน้าที่ · หน้าที่ที่ไม่มีสีตรงสร้างจากการผสมสีที่มี
    พื้น = สีที่กินที่มากสุด · ตัวหนังสือ = contrast สูงสุดกับพื้น · หลัก รอง เน้น = สีอิ่มที่สุด 3 สีที่เฉดต่างกัน"""
    hexes = [h for h, _ in cols]
    bg = hexes[0]
    text = max(hexes, key=lambda h: contrast(h, bg))
    if contrast(text, bg) < 7:  # ไม่มีสีเข้มหรือสว่างพอ ใช้ดำหรือขาวอมสีพื้น
        text = mix(bg, max(("#111111", "#fafafa"), key=lambda e: contrast(e, bg)), 0.92)
    vivid = sorted((h for h in hexes if h not in (bg, text) and sat(h) > 40), key=sat, reverse=True)
    picks = []
    for h in vivid:
        if all(min(abs(hue(h) - hue(p)), 360 - abs(hue(h) - hue(p))) > 25 for p in picks):
            picks.append(h)
    # สีหลักใช้ทำปุ่ม ต้องได้ contrast อย่างน้อย 3:1 กับพื้น (WCAG 1.4.11) · ไม่มีสีไหนถึง ให้เข้มสีที่สดที่สุดเข้าหาสีตัวหนังสือจนถึง
    strong = [h for h in picks if contrast(h, bg) >= 3]
    if strong:
        primary = strong[0]
        picks = [primary] + [h for h in picks if h != primary]
    elif picks:
        primary = next((mix(picks[0], text, t / 10) for t in range(11) if contrast(mix(picks[0], text, t / 10), bg) >= 3), text)
        picks = [primary] + picks
    else:
        primary = mix(text, bg, 0.25)
    secondary = picks[1] if len(picks) > 1 else mix(primary, bg, 0.45)
    accent = picks[2] if len(picks) > 2 else (vivid[1] if len(vivid) > 1 and vivid[1] != secondary else mix(primary, text, 0.35))
    surface = mix(bg, text, 0.05)
    # ตัวหนังสือรองต้องอ่านได้ 4.5:1 ทั้งบนพื้นและพื้นรอง · เริ่มจากจางที่สุดที่ยังผ่าน
    muted = next((mix(text, bg, t / 100) for t in range(40, -1, -2)
                  if min(contrast(mix(text, bg, t / 100), bg), contrast(mix(text, bg, t / 100), surface)) >= 4.5), text)
    out = {"bg": bg, "surface": surface, "text": text, "text_muted": muted,
           "primary": primary, "secondary": secondary, "accent": accent, "border": mix(bg, text, 0.18)}
    return {k: out[k] for k in ROLES}


def palette_from_image(path, k=8):
    """แบ่งสีละเอียด 32 กลุ่มก่อน แล้วรวมกลุ่มที่ใกล้กัน (สีสดพื้นที่น้อยจะไม่ถูกสีพื้นกลืน)
    เก็บ k สีที่ต่างกันจริงเรียงตามพื้นที่ แล้วจัดเป็น 8 หน้าที่พร้อมค่า contrast"""
    from PIL import Image
    img = Image.open(path)
    if img.mode in ("RGBA", "LA", "P"):  # ภาพโปร่งใส วางบนพื้นขาวก่อน ไม่งั้นได้สีที่ซ่อนใต้ส่วนโปร่งใส
        rgba = img.convert("RGBA")
        img = Image.alpha_composite(Image.new("RGBA", rgba.size, "#ffffff"), rgba)
    img = img.convert("RGB")
    img.thumbnail((400, 400))
    q = img.quantize(colors=32, method=Image.Quantize.MAXCOVERAGE)
    pal, counts = q.getpalette(), sorted(q.getcolors(), reverse=True)
    total = sum(c for c, _ in counts)
    merged = []  # [hex, สัดส่วน]
    for c, i in counts:
        h = "#%02x%02x%02x" % tuple(pal[i * 3:i * 3 + 3])
        near = next((m for m in merged if sum((x - y) ** 2 for x, y in zip(rgb(m[0]), rgb(h))) < 28 ** 2), None)
        if near:
            near[1] += c / total
        else:
            merged.append([h, c / total])
    merged.sort(key=lambda m: m[1], reverse=True)
    cols = [(h, a) for h, a in merged if a >= 0.003][:k]
    r = roles(cols)
    if len(cols) < 2:
        warning = "ภาพมีสีเดียว สีอื่นทั้งหมดสร้างจากการผสม ไม่ได้ถอดจากงานจริง · ใช้ภาพงานที่มีหลายสี"
    elif sum(a for h, a in cols if sat(h) <= 30) >= 0.97:
        warning = ("ได้สีเทาเกือบทั้งหมด อาจติดหน้ากันบอท แบนเนอร์คุกกี้ หรือหน้ายังโหลดไม่ขึ้น · "
                   "เปิดภาพดูก่อนใช้ หรือจับภาพหน้าจอเองแล้วส่งไฟล์ภาพ")
    else:
        warning = ""
    return {"colors": cols, "roles": r, "warning": warning, "text_contrast": round(contrast(r["text"], r["bg"]), 1),
            "muted_contrast": round(contrast(r["text_muted"], r["bg"]), 1),
            "primary_contrast": round(contrast(r["primary"], r["bg"]), 1)}


def palette_from(src, out_dir=None):
    path = Path(src)
    if not path.is_file():
        if not public_url(src):
            raise ValueError("ต้องเป็นไฟล์รูป หรือ URL http(s) ของเว็บสาธารณะ")
        out = Path(out_dir or tempfile.mkdtemp())
        out.mkdir(parents=True, exist_ok=True)
        path = out / (urllib.parse.urlparse(src).hostname.replace(".", "-") + ".png")
        capture(src, path)
    return {"source": src, "shot": str(path), **palette_from_image(path)}


def fallback(query, n=8):
    """คลังสำรอง 8 หน้าที่ · ใช้เมื่อค้นสดไม่ได้เท่านั้น"""
    words = keywords(query).lower().split()
    with (SITES.parent / "palettes-fallback.csv").open(encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    tokens = lambda s: set(s.lower().replace("·", " ").split())  # นับคำเต็ม ไม่นับคำที่ซ่อนในคำอื่น
    scored = sorted(((len(set(words) & tokens(r["keywords"])), r) for r in rows), key=lambda x: x[0], reverse=True)
    return [r for s, r in scored[:n] if s]


def board(kind, query, refs, out):
    pals, errs = [], []
    for r in refs:
        try:
            pals.append(palette_from(r, Path(out).parent / "ref-shots"))
        except Exception as e:  # เว็บกันบอทหรือโหลดไม่ขึ้น บอกแล้วทำต่อ
            errs.append(f"{r}: {e}")
    sw = "".join(f'<div class="p"><a href="{html.escape(p["source"])}">{html.escape(p["source"][:60])}</a>'
                 + "".join(f'<span><i style="background:{c}"></i>{ROLE_TH[k]}<br>{c}</span>' for k, c in p["roles"].items())
                 + f'<small>ตัวหนังสือ {p["text_contrast"]}:1 · ตัวหนังสือรอง {p["muted_contrast"]}:1 · สีหลัก {p["primary_contrast"]}:1 (เทียบพื้น)</small></div>'
                 for p in pals)
    ln = "".join(f'<li><a href="{html.escape(l["url"])}" target="_blank">{html.escape(l["site"])}</a> · {html.escape(l["good_for"])} · <em>{html.escape(l["use"])}</em></li>'
                 for l in links(kind, query))
    er = "".join(f"<li>{html.escape(e)}</li>" for e in errs)
    page = f"""<!doctype html><meta charset="utf-8"><title>ต้นแบบ · {html.escape(query)}</title><style>
body{{font:14px system-ui,sans-serif;margin:24px;max-width:1000px;background:#f6f5f2;color:#1b1a22}}
div.p{{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 22px}}div.p a,div.p small{{flex-basis:100%}}div.p small{{opacity:.7}}
div.p span{{width:96px;font-size:11px;opacity:.85}}div.p i{{display:block;height:44px;border-radius:6px;box-shadow:inset 0 0 0 1px #0001}}</style>
<h1>ต้นแบบ {html.escape(kind)}: {html.escape(query)}</h1><p>คำค้น: {html.escape(keywords(query))} · ไม่มีอะไรบันทึกถาวร หน้าเว็บเปิดจากต้นทาง</p>
<h2>สีที่ถอดจากงานที่เลือก ({len(pals)})</h2>{sw or '<p>ยังไม่ได้ใส่ --ref ให้เปิดลิงก์ด้านล่าง เลือกงาน แล้วรันใหม่พร้อม --ref</p>'}{f'<ul>{er}</ul>' if er else ''}
<h2>ค้นในเว็บที่เก่งงานประเภทนี้</h2><ul>{ln}</ul>"""
    Path(out).write_text(page, encoding="utf-8")
    return len(pals), len(errs)


def self_test():
    ok = [("คำไทยติดกันแปลงเป็นอังกฤษ", keywords("ร้านกาแฟมินิมอล") == "coffee shop minimal"),
          ("คำอังกฤษคงไว้", keywords("specialty ร้านกาแฟ") == "specialty coffee shop"),
          ("ทุกประเภทมีอย่างน้อย 2 เว็บ", all(len(sites(k)) >= 2 for k in
                                            "web app dashboard slide document icon logo social illustration color font motion".split())),
          ("ลิงก์ใส่คำค้นแล้ว", all("coffee" in l["url"] or "{q}" not in r["search_url"]
                                   for l, r in zip(links("web", "กาแฟ"), sites("web")))),
          ("ไม่รับ URL ภายในเครื่อง", not public_url("http://127.0.0.1/") and not public_url("file:///c:/x.png"))]
    with tempfile.TemporaryDirectory() as d:
        from PIL import Image
        img = Image.new("RGB", (100, 100), "#f5efe6")
        for x in range(20):
            for y in range(100):
                img.putpixel((x, y), (30, 20, 15))
        for x in range(20, 30):
            for y in range(100):
                img.putpixel((x, y), (200, 70, 30))
        img.save(Path(d) / "t.png")
        p = palette_from_image(Path(d) / "t.png")
        r = p["roles"]
        ok.append(("ถอดสีเป็น 8 หน้าที่ครบ", list(r) == ROLES and all(len(c) == 7 for c in r.values())))
        ok.append(("พื้นสว่าง ตัวหนังสือเข้ม สีหลักคือสีส้มที่ใส่ไว้", r["bg"].startswith("#f") and p["text_contrast"] > 10 and sat(r["primary"]) > 100))
    for name, passed in ok:
        print(f"  {'ผ่าน' if passed else 'ล้ม'} {name}")
    n = sum(p for _, p in ok)
    print(f"\nself-test {n}/{len(ok)} ผ่าน")
    return n == len(ok)


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("cmd", nargs="?", choices=["links", "icons", "openverse", "palette-from", "board", "fallback"])
    ap.add_argument("args", nargs="*")
    ap.add_argument("-n", type=int, default=10)
    ap.add_argument("--ref", action="append", default=[])
    ap.add_argument("--out")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        sys.exit(0 if self_test() else 1)
    kinds = sorted({r["type"] for r in sites()})
    need = {"links": 2, "board": 2, "icons": 1, "openverse": 1, "palette-from": 1, "fallback": 1}
    if not a.cmd or len(a.args) < need[a.cmd]:
        ap.error("ดูวิธีใช้ด้านบน · ประเภท: " + " · ".join(kinds))
    if a.cmd in ("links", "board") and a.args[0] not in kinds:
        ap.error("ประเภทต้องเป็น: " + " · ".join(kinds))
    try:
        if a.cmd == "links":
            for l in links(a.args[0], " ".join(a.args[1:])):
                print(f'{l["site"]:22} {l["url"]}\n{"":22} {l["good_for"]} · {l["use"]}')
        elif a.cmd == "icons":
            for i in icons(" ".join(a.args), a.n):
                print(f'{i["icon"]:40} {i["license"]:12} {i["svg"]}')
        elif a.cmd == "openverse":
            for r in openverse(" ".join(a.args), a.n):
                print(" · ".join(str(v) for v in r.values()))
        elif a.cmd == "palette-from":
            p = palette_from(a.args[0], a.out)
            if p["warning"]:
                print("เตือน: " + p["warning"])
            print("สีที่ถอดได้ (สัดส่วนพื้นที่): " + " · ".join(f"{c} {x:.0%}" for c, x in p["colors"]))
            for k, c in p["roles"].items():
                print(f"  {k:11} {c}  {ROLE_TH[k]}")
            print(f'contrast เทียบพื้น: ตัวหนังสือ {p["text_contrast"]}:1 · ตัวหนังสือรอง {p["muted_contrast"]}:1 · สีหลัก {p["primary_contrast"]}:1 · ภาพ {p["shot"]}')
            print("ส่งเข้า design_draft.py: --palette \"<ชื่อ>:" + ",".join(f"{k}={c}" for k, c in p["roles"].items()) + '"')
        elif a.cmd == "fallback":
            print("คลังสำรอง (ใช้เมื่อค้นสดไม่ได้ · เทรนด์อาจไม่ทันสมัย) · wada = MIT · sd = CC BY 4.0 huggingface-projects/color-palettes-sd")
            for r in fallback(" ".join(a.args), a.n):
                print(f'{r["id"]:10} ' + " ".join(r[k] for k in ROLES) + f'  {r["keywords"][:40]}')
        else:
            n, e = board(a.args[0], " ".join(a.args[1:]), a.ref, a.out or "references-board.html")
            print(f"เขียน {a.out or 'references-board.html'} · ถอดสีได้ {n} งาน · พลาด {e} · เปิดในเบราว์เซอร์")
    except ValueError as e:
        sys.exit(str(e))
    except OSError as e:
        sys.exit(f"ค้นหรือเปิดเว็บไม่ได้ ({e}) · ใช้คำสั่ง links แล้วเปิดเอง")


if __name__ == "__main__":
    main()
