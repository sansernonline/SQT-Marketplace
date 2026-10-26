#!/usr/bin/env python3
"""ร่างทิศทางภาพ 3 แนวจากโจทย์ไทยหรืออังกฤษ → docs/DESIGN.md + หน้าเทียบ HTML

ผลเป็นจุดเริ่มให้ ui-craft ข้อ 0.1 ไม่ใช่คำตัดสิน · ขั้นเลือกยังเป็นด่านสวย (ui-craft ข้อ 9)
ก่อนเขียน ตรวจ contrast ทั้ง 2 โหมด · สีตั้งต้นของ Tailwind · ฟอนต์ Inter/Geist นำ · ฟอนต์ไทยที่ไม่มีคู่ละติน
แนวที่ไม่ผ่านถูกตัด แล้วหยิบตัวถัดไป · ไม่เขียนทับไฟล์ที่มีอยู่ถ้าไม่ใส่ --force

  python design_draft.py "เว็บขายทองรูปพรรณ ร้านเก่าในเยาวราช" --out docs/DESIGN.md
  python design_draft.py "dental clinic booking site" --industry dental-clinic --html docs/design/dc-design-directions.html
  python design_draft.py "แอปร้านซ่อมโดรน" --extra-palettes web.csv --palettes "web-drone;night-vault"
  python design_draft.py --self-test
"""
import argparse
import csv
import datetime
import html
import re
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from design_search import DATA_DIR, FIXTURES, Corpus, has_thai, read_csv, split_values  # noqa: E402

COLOR_ROLES = ['bg', 'surface', 'text', 'text_muted', 'primary', 'on_primary', 'accent', 'border',
               'success', 'warning', 'danger']
# (สีหน้า, สีพื้น, ขั้นต่ำ) · ข้อความ 4.5:1 · ส่วนประกอบ UI 3:1 (WCAG 2.2 ข้อ 1.4.3 และ 1.4.11)
CONTRAST_PAIRS = [('text', 'bg', 4.5), ('text', 'surface', 4.5), ('text_muted', 'bg', 4.5),
                  ('text_muted', 'surface', 4.5), ('on_primary', 'primary', 4.5), ('primary', 'bg', 3.0),
                  ('danger', 'surface', 3.0)]
# ค่าตั้งต้นของ Tailwind ที่ทำให้หน้าตาเหมือนเทมเพลต (slate · gray · zinc · neutral ทั้งชุด + indigo/violet/purple/blue หลัก)
TAILWIND_DEFAULTS = set('''
f8fafc f1f5f9 e2e8f0 cbd5e1 94a3b8 64748b 475569 334155 1e293b 0f172a 020617
f9fafb f3f4f6 e5e7eb d1d5db 9ca3af 6b7280 4b5563 374151 1f2937 111827 030712
f4f4f5 e4e4e7 d4d4d8 a1a1aa 71717a 52525b 3f3f46 27272a 18181b 09090b
f5f5f5 e5e5e5 d4d4d4 a3a3a3 737373 525252 404040 262626 171717 0a0a0a
818cf8 6366f1 4f46e5 4338ca a78bfa 8b5cf6 7c3aed 6d28d9 a855f7 9333ea 3b82f6 2563eb
'''.split())
OVERUSED_FONTS = re.compile(r'^(inter|geist)\b', re.I)
HYPE_WORDS = re.compile(r'ยกระดับ|ไร้รอยต่อ|ล้ำสมัย|ปฏิวัติ|เหนือระดับ|seamless|elevate|supercharge|unleash|'
                        r'revolutioni[sz]e|cutting-edge|next-level|game-chang', re.I)
PERSONALITY = {'1': ('เครื่องมือทำงาน', 6), '2': ('การเงิน สุขภาพ ราชการ', 8), '3': ('ไลฟ์สไตล์ ช้อปปิ้ง อาหาร', 12),
               '4': ('บันเทิง โซเชียล เกมเบา', 20), '5': ('เด็ก การเรียนรู้', 20), '6': ('พรีเมียม สร้างสรรค์', 2)}
LABELS = ['ก', 'ข', 'ค']
TONE_LINE = 'ผู้ใหญ่หาผ้าใหม่ ให้สะใภ้ใช้คล้องคอ · ปฏิทิน ฎีกา ญาติ ฤดูกาล'


MIN_PRIMARY_DISTANCE = 30  # ระยะ RGB ของสีหลักระหว่าง 2 แนว ต่ำกว่านี้ตาแยกไม่ออก


def rgb(hex_color):
    h = hex_color.strip().lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    return [int(h[i:i + 2], 16) for i in (0, 2, 4)]


def color_distance(a, b):
    return sum((x - y) ** 2 for x, y in zip(rgb(a), rgb(b))) ** 0.5


def luminance(hex_color):
    channels = [c / 255 for c in rgb(hex_color)]
    r, g, b = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    hi, lo = sorted([luminance(a), luminance(b)], reverse=True)
    return (hi + 0.05) / (lo + 0.05)


def palette_problems(modes):
    """คืนรายการปัญหาของพาเลต (ว่าง = ผ่าน) · ตรวจทั้งโหมดสว่างและมืด"""
    problems = []
    for mode in ('light', 'dark'):
        row = modes.get(mode)
        if not row:
            problems.append(f'ไม่มีโหมด {mode}')
            continue
        for role in COLOR_ROLES:
            value = (row.get(role) or '').strip().lower()
            if not re.fullmatch(r'#[0-9a-f]{6}|#[0-9a-f]{3}', value):
                problems.append(f'{mode} {role} ไม่ใช่สี hex ("{value}")')
            elif value.lstrip('#') in TAILWIND_DEFAULTS:
                problems.append(f'{mode} {role} {value} เป็นสีตั้งต้นของ Tailwind')
        if problems:
            continue
        for fg, bg, need in CONTRAST_PAIRS:
            ratio = contrast(row[fg], row[bg])
            if ratio < need:
                problems.append(f'{mode} {fg}/{bg} {ratio:.2f}:1 ต่ำกว่า {need}:1')
    return problems


def families(field):
    return [f.strip() for f in re.split(r'[;+,/]', field or '') if f.strip()]


def has_latin(family, thai_fonts):
    known = thai_fonts.get(family.lower())
    if known:
        return (known.get('has_latin') or '').strip().lower() in ('yes', 'y', 'true', '1', 'มี')
    return not re.search(r'\bthai\b', family, re.I)  # ไม่อยู่ในตารางฟอนต์ไทย และชื่อไม่มี Thai → ถือเป็นฟอนต์ละติน


def font_problems(pair, thai_fonts):
    problems = []
    for role in ('heading', 'body'):
        fams = families(pair.get(role))
        if not fams:
            problems.append(f'{role} ว่าง')
            continue
        if OVERUSED_FONTS.match(fams[0]):
            problems.append(f'{role} ใช้ {fams[0]} เป็นฟอนต์แรก')
        if not any(has_latin(f, thai_fonts) for f in fams):
            problems.append(f'{role} {" + ".join(fams)} ไม่มีคู่ละติน')
    return problems


class Library:
    """ข้อมูลที่ตัวร่างใช้ · โหลดจาก data/ ผ่าน Corpus ตัวเดียวกับตัวค้น"""

    def __init__(self, data_dir):
        self.corpus = Corpus(data_dir)
        self.industries = {r['id']: r for r in self.corpus.rows('industry')}
        self.palettes = {}
        for r in self.corpus.rows('palette'):
            self.palettes.setdefault(r['id'], {})[(r.get('mode') or '').strip().lower()] = r
        self.fonts = {r['id']: r for r in self.corpus.rows('font')}
        self.looks = {r['id']: r for r in self.corpus.rows('look')}
        self.thai_fonts = {r['family'].strip().lower(): r for r in self.corpus.table('thai-fonts.csv')}

    def add_palettes(self, csv_path):
        """พาเลตเพิ่มจาก brand_colors.py --palette · ไม่เข้าดัชนีค้น จึงใช้ได้ผ่าน --palettes เท่านั้น"""
        for r in read_csv(Path(csv_path)):
            self.palettes.setdefault(r['id'], {})[(r.get('mode') or '').strip().lower()] = r

    def ranked(self, domain, query, preferred, pool):
        """id ที่อุตสาหกรรมระบุก่อน → ผลค้นจากคำของอุตสาหกรรม → ที่เหลือทั้งหมด (ไม่ซ้ำ)"""
        found = [r['id'] for r in self.corpus.search(domain, query, 50)]
        out = []
        for i in [*preferred, *found, *pool]:
            if i in pool and i not in out:
                out.append(i)
        return out


def pick_directions(lib, industry):
    """3 แนวที่ look ไม่ซ้ำกัน · ตัดแนวที่พาเลตหรือฟอนต์ไม่ผ่าน แล้วหยิบตัวถัดไป"""
    query = ' '.join([industry.get('name_en', ''), industry.get('keywords_en', '').replace(';', ' '),
                      industry.get('keywords_th', '').replace(';', ' ')])
    looks_pref = split_values(industry.get('looks'))
    pal_pref = split_values(industry.get('palette_ids'))
    font_pref = split_values(industry.get('font_pair_ids'))
    look_pool = lib.ranked('look', query, looks_pref, lib.looks)
    pal_pool = lib.ranked('palette', query, pal_pref, lib.palettes)
    font_pool = lib.ranked('font', query, font_pref, lib.fonts)

    rejected, bad_pal, bad_font = [], {}, {}
    for pid in pal_pool:
        bad_pal[pid] = palette_problems(lib.palettes[pid])
    for fid in font_pool:
        bad_font[fid] = font_problems(lib.fonts[fid], lib.thai_fonts)
    good_pal = [p for p in pal_pool if not bad_pal[p]]
    good_font = [f for f in font_pool if not bad_font[f]]
    for pid in pal_pool:
        if bad_pal[pid]:
            rejected.append(f'พาเลต `{pid}`: {"; ".join(bad_pal[pid][:3])}')
    for fid in font_pool:
        if bad_font[fid]:
            rejected.append(f'คู่ฟอนต์ `{fid}`: {"; ".join(bad_font[fid])}')

    directions = []

    def add(look_id, pal_id, font_id):
        directions.append({'look': lib.looks.get(look_id, {'id': look_id, 'name_th': look_id}),
                           'palette_id': pal_id, 'palette': lib.palettes[pal_id],
                           'font_id': font_id, 'font': lib.fonts[font_id]})

    used = lambda key: [d[key] for d in directions]  # noqa: E731

    def distinct(pal_id):
        """สีหลักห่างจากแนวที่เลือกแล้วพอให้ตาแยกออก · เคยได้ 2 แนวที่สีหลักต่างกันแค่ (2, 4, 15)"""
        mine = lib.palettes[pal_id]['light']['primary']
        return all(color_distance(mine, d['palette']['light']['primary']) >= MIN_PRIMARY_DISTANCE for d in directions)

    # สลับได้เฉพาะพาเลตที่เกี่ยวกับอุตสาหกรรม · เคยสลับคลินิกทันตกรรมไปได้สีแดงเยาวราช
    relevant = set(pal_pref) | {r['id'] for r in lib.corpus.search('palette', query, 8)}

    def swap(pal_id):
        """พาเลตเดิมถ้าแยกออก ไม่งั้นพาเลตที่เกี่ยวและผ่านเกณฑ์ตัวถัดไปที่แยกออก · ไม่มีเลยคืนตัวเดิม"""
        if distinct(pal_id):
            return pal_id
        return next((p for p in good_pal if p in relevant and p not in used('palette_id') and distinct(p)), pal_id)

    # รอบแรก: แนวตามลำดับที่อุตสาหกรรมกำหนด (look · พาเลต · ฟอนต์ ตำแหน่งเดียวกัน)
    for i, look_id in enumerate(looks_pref):
        if len(directions) == 3:
            break
        pal_id = pal_pref[i] if i < len(pal_pref) else None
        font_id = font_pref[i] if i < len(font_pref) else None
        if look_id in [d['look'].get('id') for d in directions]:
            continue
        if pal_id not in good_pal or font_id not in good_font:
            why = 'พาเลตไม่ผ่าน' if pal_id not in good_pal else 'คู่ฟอนต์ไม่ผ่าน'
            rejected.append(f'แนวที่ {i + 1} ({look_id} · {pal_id} · {font_id}) ถูกตัด เพราะ{why}')
            continue
        if swap(pal_id) != pal_id:
            rejected.append(f'แนวที่ {i + 1} เปลี่ยนพาเลต `{pal_id}` เป็น `{swap(pal_id)}` เพราะสีหลักใกล้แนวก่อนหน้า')
            pal_id = swap(pal_id)
        elif not distinct(pal_id):
            rejected.append(f'แนวที่ {i + 1} พาเลต `{pal_id}` สีหลักใกล้แนวก่อนหน้า และไม่มีพาเลตที่เกี่ยวให้สลับ '
                            '· ตอนทำ mockup ให้แยกด้วย accent หรือ look แทน')
        add(look_id, pal_id, font_id)
    # รอบเติม: look ถัดไปที่ยังไม่ใช้ · พาเลตและฟอนต์ที่ยังไม่ใช้ก่อน
    for look_id in look_pool:
        if len(directions) == 3 or not good_pal or not good_font:
            break
        if look_id in [d['look'].get('id') for d in directions]:
            continue
        pal_id = swap(next((p for p in good_pal if p not in used('palette_id')), good_pal[0]))
        font_id = next((f for f in good_font if f not in used('font_id')), good_font[0])
        add(look_id, pal_id, font_id)
    return directions, rejected


def is_thai_rule(row):
    """กฎเฉพาะคนไทย: หมวด thai-* หรือ id ขึ้นต้น th-"""
    category = row.get('category', '').lower()
    return category.startswith('thai') or 'ไทย' in category or row.get('id', '').startswith('th-')


def ux_rules(lib, brief, industry, n=5):
    """กฎ UX ที่เกี่ยวกับโจทย์ · หมวดละไม่เกิน 2 ข้อ · กฎเฉพาะคนไทยได้แต้มต่อเล็กน้อย"""
    context = ' '.join(industry.get(c, '') for c in ('keywords_th', 'keywords_en', 'cautions_th', 'decision_rule_th'))
    found = lib.corpus.search('ux', f'{brief} {context}'.replace(';', ' '), 60, min_coverage=0.02)
    found.sort(key=lambda r: -(r['score'] * (1.15 if is_thai_rule(r['row']) else 1.0)))
    picked, per_category = [], {}
    for r in found:
        category = r['row'].get('category', '')
        if per_category.get(category, 0) < 2:
            picked.append(r['row'])
            per_category[category] = per_category.get(category, 0) + 1
        if len(picked) == n:
            return picked
    extra = [r for r in lib.corpus.rows('ux') if r.get('severity', '').lower() in ('high', 'critical', 'สูง')
             and r not in picked]  # โจทย์สั้นจนได้ไม่ครบ → เติมกฎความรุนแรงสูง กฎไทยก่อน
    extra.sort(key=lambda r: not is_thai_rule(r))
    return picked + extra[:n - len(picked)]


def personality(industry):
    first = (split_values(industry.get('personality')) or [''])[0]
    num = re.match(r'\d', first)
    return PERSONALITY.get(num.group() if num else '', (first or '(ไม่ระบุ)', 8))


def check_hype(text):
    hits = sorted(set(m.group() for m in HYPE_WORDS.finditer(text)))
    if hits:
        raise SystemExit(f'ข้อความที่สร้างมีคำโฆษณา {hits} · แก้ข้อมูลต้นทางก่อน')


def thai_date(day):
    months = 'ม.ค. ก.พ. มี.ค. เม.ย. พ.ค. มิ.ย. ก.ค. ส.ค. ก.ย. ต.ค. พ.ย. ธ.ค.'.split()
    return f'{day.day} {months[day.month - 1]} {day.year + 543}'


def font_line(font):
    parts = [f'หัว {font.get("heading", "")}', f'เนื้อ {font.get("body", "")}']
    if font.get('numeric'):
        parts.append(f'ตัวเลข {font["numeric"]} (ใช้กับตัวเลข · ใน CSS ต่อด้วยฟอนต์เนื้อ)')
    return ' · '.join(parts)


def licence_line(font, thai_fonts):
    # ใบอนุญาตมาจาก thai-fonts.csv เท่านั้น ฟอนต์ละตินล้วนไม่อยู่ในตาราง จึงบอกตรง ๆ ว่ายังไม่ได้ตรวจ
    seen, parts = set(), []
    for role in ('heading', 'body', 'numeric'):
        for fam in families(font.get(role)):
            if fam.lower() in seen:
                continue
            seen.add(fam.lower())
            row = thai_fonts.get(fam.lower())
            lic = (row or {}).get('licence', '').strip()
            if not row or not lic or lic == 'unverified':
                parts.append(f'{fam} ยังไม่ได้ตรวจใบอนุญาต')
            else:
                parts.append(f'{fam} {lic} (ตรวจ {row.get("checked", "-")})')
    return ' · '.join(parts)


def render_markdown(brief, industry, match, directions, rules, rejected, today, thai_fonts):
    name, _ = personality(industry)
    lines = [f'# ทิศทางภาพตั้งต้น · {industry.get("name_th", "")} ({industry.get("name_en", "")})', '',
             f'> ร่างโดย `design-direction-lookup` วันที่ {today.isoformat()} · เป็นจุดเริ่มให้ `ui-craft` ข้อ 0.1 ขั้น 3 '
             'ไม่ใช่คำตัดสิน · ทำ mockup ทั้ง 3 แนว แล้วเลือกที่ด่านสวย (`ui-craft` ข้อ 9)', '',
             '## โจทย์', '', brief, '',
             '## อุตสาหกรรมที่จับได้', '',
             f'- `{industry["id"]}` {industry.get("name_th", "")} · คะแนนค้น {match.get("score", "-")} · '
             f'ครอบคลุม {int(match.get("coverage", 0) * 100)} % ของคำในโจทย์ที่มีในข้อมูล',
             f'- บุคลิกแอป: {name} (`ui-craft/references/app-character.md`)',
             f'- ข้อควรระวัง: {industry.get("cautions_th") or "-"}',
             f'- กฎตัดสิน: {industry.get("decision_rule_th") or "-"}', '',
             '## 3 แนว', '']
    for label, d in zip(LABELS, directions):
        look, font, pal = d['look'], d['font'], d['palette']
        lines += [f'### แนว {label} · {look.get("name_th", "")} ({look.get("name_en", look.get("id", ""))})', '',
                  f'- look `{look.get("id")}` · ความลึก {look.get("depth", "-")} · การเคลื่อนไหว {look.get("motion", "-")} · '
                  f'ความแน่น {look.get("density", "-")}',
                  f'- ฟอนต์ `{d["font_id"]}`: {font_line(font)} · แบบไทย {font.get("thai_style", "-")} · '
                  f'เนื้อเล็กสุด {font.get("min_body_px", "-")}px · line-height {font.get("line_height", "-")}',
                  f'- ใบอนุญาตฟอนต์: {licence_line(font, thai_fonts)}',
                  f'- ข้อห้าม: {look.get("avoid_th") or "-"}', '',
                  f'พาเลต `{d["palette_id"]}` {pal["light"].get("name_th", "")}', '',
                  '| บทบาท | สว่าง | มืด |', '|---|---|---|']
        lines += [f'| {role} | `{pal["light"][role]}` | `{pal["dark"][role]}` |' for role in COLOR_ROLES]
        ratios = [f'{fg}/{bg} {contrast(pal["light"][fg], pal["light"][bg]):.1f} · {contrast(pal["dark"][fg], pal["dark"][bg]):.1f}'
                  for fg, bg, _ in CONTRAST_PAIRS]
        lines += ['', f'contrast (สว่าง · มืด): {" | ".join(ratios)}', '']
    lines += ['## กฎ UX ที่เกี่ยว', '']
    lines += [f'{i}. **{r.get("category", "")}** {r.get("rule_th", "")} · เพราะ{r.get("why_th", "")} (`{r.get("id")}`)'
              for i, r in enumerate(rules, 1)]
    if rejected:
        lines += ['', '## ที่ตัดออกก่อนร่าง', ''] + [f'- {r}' for r in rejected]
    lines += ['', '## ขั้นต่อไป', '',
              '1. เปิดหน้าเทียบ HTML ดูสีและฟอนต์จริงทั้ง 2 โหมด',
              '2. ทำหน้าจอพระเอก + 1 หน้าใช้งานหลักของทั้ง 3 แนวตาม `ui-craft` ข้อ 0.1 ขั้น 3 แล้วเลือกที่ด่านสวย',
              '3. แนวที่เลือก เขียนลงไฟล์ token ของโปรเจกต์ และรัน `no-ai-look/scripts/slop_scan.py` กับ mockup', '']
    return '\n'.join(lines)


def google_font_links(directions, thai_fonts):
    names = []
    for d in directions:
        for role in ('heading', 'body', 'numeric'):
            names += [f for f in families(d['font'].get(role)) if f not in names]
    links = []
    for fam in names:
        weights = (thai_fonts.get(fam.lower()) or {}).get('weights', '')
        nums = [int(x) for x in re.findall(r'\d{3}', weights)]
        if len(nums) == 2 and '-' in weights:
            want = [w for w in (400, 600, 700) if nums[0] <= w <= nums[1]]
        else:
            want = [w for w in (400, 600, 700) if w in nums]
        spec = fam.replace(' ', '+') + (f':wght@{";".join(map(str, want))}' if len(want) > 1 else '')
        links.append(f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family={spec}&amp;display=swap">')
    return '\n'.join(links)


def css_stack(field, fallback):
    fams = families(field)
    return ', '.join([f'"{f}"' for f in fams] + [fallback])


# การ์ดของแต่ละแนวต่างกันตาม depth ของ look (คำแรกที่เจอชนะ) · เดิมทุกแนวใช้การ์ดเดียวกัน แนวที่สีใกล้กันจึงดูเหมือนกัน
DEPTH_STYLES = [  # (คำใน depth, เส้นขอบ, เงา, ตัวคูณมุมโค้ง)
    # 2 แถวแรกต้องมาก่อน 'เงา' เพราะคำอธิบายมีคำว่าเงาอยู่ด้วย ("แทนเงา" · "ไม่มีเงา") เคยได้การ์ดมีเงาผิดแนว
    ('tonal', 'none', 'none', 2),
    ('ไม่มีเงา', 'none', 'none', 0),
    ('ขอบหนา', '2px solid {text}', '4px 4px 0 {text}', 0.5),
    ('เงานุ่ม', 'none', '0 2px 4px {shade}, 0 8px 20px {shade}', 2),
    ('เส้นหนา', '2px solid {border}', '0 3px 0 {border}', 1.5),
    ('เงา', '1px solid {border}', '0 1px 2px {shade}, 0 4px 12px {shade}', 1),
    ('กระดาษ', '1px dashed {border}', 'none', 0),
    ('เส้นบาง', '1px solid {border}', 'none', 0.5),
]
DENSITY_PADDING = [('แน่น', 12), ('โปร่งมาก', 40), ('โปร่ง', 28)]

def card_style(look, p, mode, radius):
    """(css ของการ์ด · มุมโค้งที่ใช้) ตาม depth และ density ของ look"""
    depth, density = look.get('depth', ''), look.get('density', '')
    border, shadow, scale = next((s[1:] for s in DEPTH_STYLES if s[0] in depth), ('1px solid {border}', 'none', 1))
    shade = 'rgba(0,0,0,.12)' if mode == 'light' else 'rgba(0,0,0,.45)'
    fill = lambda s: s.format(text=p['text'], border=p['border'], shade=shade)  # noqa: E731
    pad = next((px for word, px in DENSITY_PADDING if word in density), 20)
    r = round(radius * scale)
    return f'border:{fill(border)};box-shadow:{fill(shadow)};border-radius:{r}px;padding:{pad}px', r


def render_panel(d, mode, industry, brief, today, radius):
    p, font, e = d['palette'][mode], d['font'], html.escape
    card, radius = card_style(d['look'], p, mode, radius)
    head, body = css_stack(font.get('heading'), 'serif'), css_stack(font.get('body'), 'sans-serif')
    # ฟอนต์ตัวเลขส่วนใหญ่ไม่มีอักษรไทย จึงต่อด้วยฟอนต์เนื้อ ให้คำไทยในบรรทัดเดียวกัน (ต.ค. · น.) ใช้ฟอนต์เนื้อแทนฟอนต์ของระบบ
    num = css_stack('; '.join(filter(None, [font.get('numeric'), font.get('body')])), 'sans-serif')
    swatches = ''.join(f'<span class="sw"><i style="background:{p[r]}"></i>{r}<br><code>{p[r]}</code></span>'
                       for r in ('bg', 'surface', 'text', 'primary', 'accent', 'border'))
    status = ''.join(f'<span class="chip" style="color:{p[r]};border-color:{p[r]}">{t}</span>'
                     for r, t in (('success', 'ชำระแล้ว'), ('warning', 'รอตรวจ'), ('danger', 'ยกเลิก')))
    lh = font.get('line_height') or '1.6'
    size = font.get('min_body_px') or '16'
    return f'''<div class="panel" style="background:{p['bg']};color:{p['text']}">
  <p class="mode" style="color:{p['text_muted']}">{'สว่าง' if mode == 'light' else 'มืด'}</p>
  <div class="card" style="background:{p['surface']};{card}">
    <h3 style="font-family:{e(head)};color:{p['text']}">{e(industry.get('name_th', ''))}</h3>
    <p style="font-family:{e(body)};font-size:{e(size)}px;line-height:{e(lh)}">{e(brief)}</p>
    <p style="font-family:{e(body)};font-size:{e(size)}px;line-height:{e(lh)};color:{p['text_muted']}">{TONE_LINE}</p>
    <p class="num" style="font-family:{e(num)}">฿12,450.00 · {thai_date(today)} · 09:30 น.</p>
    <div class="row">
      <button style="background:{p['primary']};color:{p['on_primary']};border-radius:{radius}px;font-family:{e(body)}">ยืนยันคำสั่งซื้อ</button>
      <button style="background:transparent;color:{p['text']};border:1px solid {p['border']};border-radius:{radius}px;font-family:{e(body)}">ดูรายละเอียด</button>
    </div>
    <div class="row">{status}</div>
  </div>
  <div class="swatches" style="color:{p['text_muted']}">{swatches}</div>
</div>'''


def render_html(brief, industry, directions, today, thai_fonts):
    _, radius = personality(industry)
    e = html.escape
    cols = []
    for label, d in zip(LABELS, directions):
        look, font = d['look'], d['font']
        cols.append(f'''<section class="dir">
  <h2>แนว {label} · {e(look.get('name_th', ''))} <small>{e(look.get('name_en', ''))}</small></h2>
  {render_panel(d, 'light', industry, brief, today, radius)}
  {render_panel(d, 'dark', industry, brief, today, radius)}
  <dl>
    <dt>ฟอนต์</dt><dd>{e(font_line(font))}</dd>
    <dt>ความลึก · การเคลื่อนไหว</dt><dd>{e(look.get('depth', '-'))} · {e(look.get('motion', '-'))}</dd>
    <dt>ความแน่น</dt><dd>{e(look.get('density', '-'))}</dd>
    <dt>ข้อห้าม</dt><dd>{e(look.get('avoid_th') or '-')}</dd>
    <dt>token</dt><dd><code>{e(d['palette_id'])}</code> · <code>{e(d['font_id'])}</code> · มุมโค้ง {card_style(look, d['palette']['light'], 'light', radius)[1]}px</dd>
  </dl>
</section>''')
    return f'''<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(industry.get('name_th', ''))} · เทียบ 3 แนว</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;600&amp;family=IBM+Plex+Sans:wght@400;600&amp;display=swap">
{google_font_links(directions, thai_fonts)}
<style>
  body {{ margin: 0; padding: 24px 16px; background: #f4f3ef; color: #1c1b19;
         font-family: "IBM Plex Sans Thai", "IBM Plex Sans", sans-serif; line-height: 1.6; }}
  header {{ max-width: 1200px; margin: 0 auto 24px; }}
  header p {{ margin: 4px 0; color: #4a4843; }}
  .grid {{ display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); max-width: 1200px; margin: 0 auto; }}
  .dir h2 {{ font-size: 18px; margin: 0 0 8px; }}
  .dir h2 small {{ font-weight: 400; color: #4a4843; }}
  .panel {{ padding: 16px; margin-bottom: 8px; border-radius: 8px; }}
  .mode {{ margin: 0 0 8px; font-size: 12px; }}
  .card {{ padding: 16px; }}
  .card h3 {{ margin: 0 0 8px; font-size: 24px; line-height: 1.4; }}
  .card p {{ margin: 0 0 8px; }}
  .num {{ font-variant-numeric: tabular-nums; }}
  .row {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }}
  button {{ padding: 10px 16px; min-height: 44px; font-size: 15px; cursor: pointer; }}
  .chip {{ border: 1px solid; border-radius: 4px; padding: 2px 8px; font-size: 13px; }}
  .swatches {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; font-size: 11px; }}
  .sw i {{ display: block; width: 40px; height: 24px; border: 1px solid rgba(127,127,127,.4); border-radius: 4px; }}
  dl {{ font-size: 14px; margin: 8px 0 0; }}
  dt {{ font-weight: 600; }}
  dd {{ margin: 0 0 6px; }}
</style>
</head>
<body>
<header>
  <h1>{e(industry.get('name_th', ''))} · ทิศทางภาพตั้งต้น 3 แนว</h1>
  <p>โจทย์: {e(brief)}</p>
  <p>จุดเริ่มจาก design-direction-lookup วันที่ {today.isoformat()} · ทำ mockup ทั้ง 3 แนว แล้วเลือกที่ด่านสวยของ ui-craft</p>
</header>
<div class="grid">
{''.join(cols)}
</div>
</body>
</html>
'''


def custom_industry(brief):
    """อุตสาหกรรมชั่วคราวเมื่อไม่มีในข้อมูลแต่มีพาเลตจากเว็บจริงแล้ว · look และคู่ฟอนต์มาจากการค้นด้วยคำในโจทย์"""
    return {'id': 'custom', 'name_th': brief, 'name_en': 'custom', 'keywords_th': brief, 'keywords_en': '',
            'personality': '', 'looks': '', 'palette_ids': '', 'font_pair_ids': ''}


def find_industry(lib, brief, industry_id, has_own_palettes=False):
    if industry_id:
        if industry_id not in lib.industries:
            raise SystemExit(f'ไม่มีอุตสาหกรรม id "{industry_id}"')
        return lib.industries[industry_id], {'score': '-', 'coverage': 1.0}, []
    found = lib.corpus.search('industry', brief, 3)
    if not found and has_own_palettes:
        return custom_industry(brief), {'score': '-', 'coverage': 0.0}, []
    if not found:
        raise SystemExit('ไม่พบอุตสาหกรรมที่ตรงกับโจทย์ · ลองเขียนโจทย์ให้มีชื่อธุรกิจ หรือใส่ --industry <id> '
                         '(ค้นรายชื่อด้วย design_search.py "<คำ>" --domain industry -n 10)')
    return lib.industries[found[0]['id']], found[0], found[1:]


def draft(brief, data_dir, out, html_path, industry_id=None, force=False, today=None,
          palette_ids=None, extra_palettes=None):
    """คืน (directions, rejected, เส้นทางที่เขียน) · ไม่เขียนทับไฟล์ที่มีอยู่ถ้าไม่ force
    palette_ids ใช้แทนพาเลตของอุตสาหกรรม · extra_palettes คือ CSV จาก brand_colors.py --palette"""
    today = today or datetime.date.today()
    lib = Library(data_dir)
    if extra_palettes:
        lib.add_palettes(extra_palettes)
    unknown = [p for p in palette_ids or [] if p not in lib.palettes]
    if unknown:
        raise SystemExit(f'ไม่มีพาเลต id {unknown} · พาเลตจากเว็บต้องใส่ไฟล์ด้วย --extra-palettes')
    industry, match, others = find_industry(lib, brief, industry_id, bool(palette_ids))
    if palette_ids:
        industry = {**industry, 'palette_ids': ';'.join(palette_ids)}
    html_path = Path(html_path or f'docs/design/{industry["id"]}-design-directions.html')
    out = Path(out)
    existing = [str(p) for p in (out, html_path) if p.exists()]
    if existing and not force:
        raise SystemExit(f'มีไฟล์อยู่แล้ว ไม่เขียนทับ: {", ".join(existing)} · ใส่ --force ถ้าตั้งใจ')
    directions, rejected = pick_directions(lib, industry)
    if len(directions) < 3:
        raise SystemExit(f'ได้แนวที่ผ่านแค่ {len(directions)} แนว · ที่ตัดออก: {rejected}')
    rules = ux_rules(lib, brief, industry)
    md = render_markdown(brief, industry, match, directions, rules, rejected, today, lib.thai_fonts)
    page = render_html(brief, industry, directions, today, lib.thai_fonts)
    check_hype(md.replace(brief, ''))
    check_hype(page.replace(html.escape(brief), ''))
    for path, text in ((out, md), (html_path, page)):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding='utf-8')
    if others:
        print('อุตสาหกรรมอันดับถัดไป: ' + ' · '.join(o['id'] for o in others))
    return directions, rejected, (out, html_path)


def self_test():
    checks = []

    def check(name, ok):
        checks.append((name, bool(ok)))

    check('contrast ขาว/ดำ = 21', abs(contrast('#ffffff', '#000000') - 21) < 0.01)
    with tempfile.TemporaryDirectory() as tmp:
        out, page = Path(tmp, 'docs/DESIGN.md'), Path(tmp, 'docs/design/gs-design-directions.html')
        brief = 'เว็บขายทองรูปพรรณ ร้านเก่าในเยาวราช ลูกค้า 35–60 ซื้อผ่านมือถือ'
        dirs, rejected, _ = draft(brief, FIXTURES, out, page, today=datetime.date(2026, 10, 26))
        looks = [d['look']['id'] for d in dirs]
        check('ได้ 3 แนว look ไม่ซ้ำ', len(dirs) == 3 and len(set(looks)) == 3)
        check('พาเลตสี Tailwind ถูกตัด', 'tw-indigo' not in [d['palette_id'] for d in dirs])
        check('พาเลต contrast ต่ำถูกตัด', 'low-contrast' not in [d['palette_id'] for d in dirs])
        check('คู่ฟอนต์ Inter นำถูกตัด', 'inter-pair' not in [d['font_id'] for d in dirs])
        check('Noto Sans Thai ไม่มีคู่ละตินถูกตัด', 'noto-only' not in [d['font_id'] for d in dirs])
        check('บันทึกเหตุที่ตัด', any('Tailwind' in r for r in rejected) and any('ละติน' in r for r in rejected))
        md, html_text = out.read_text(encoding='utf-8'), page.read_text(encoding='utf-8')
        check('DESIGN.md บอกว่าเป็นจุดเริ่ม', 'ไม่ใช่คำตัดสิน' in md and 'ด่านสวย' in md)
        check('DESIGN.md มีกฎ UX 5 ข้อ', len(re.findall(r'^\d\. \*\*', md, re.M)) == 5)
        check('HTML มีตัวอย่างไทยและปุ่ม', TONE_LINE in html_text and '<button' in html_text)
        p = {'text': '#111111', 'border': '#dddddd'}
        check('การ์ดต่างกันตาม look', card_style({'depth': 'ขอบหนา 2px'}, p, 'light', 8)
              != card_style({'depth': 'เงานุ่มสองชั้น', 'density': 'โปร่ง'}, p, 'light', 8)
              and 'box-shadow:none' in card_style({'depth': 'เรียบ ไม่มีเงา'}, p, 'light', 8)[0]
              and 'box-shadow:none' in card_style({'depth': 'tonal surface (แทนเงา)'}, p, 'light', 8)[0])
        check('HTML ไม่มี Inter และไม่มีสี Tailwind', not re.search(r'family=Inter|"Inter"', html_text)
              and not any(f'#{h}' in html_text.lower() for h in TAILWIND_DEFAULTS))
        check('ไม่มีคำโฆษณา', not HYPE_WORDS.search(md + html_text))
        before = out.read_text(encoding='utf-8')
        try:
            draft(brief, FIXTURES, out, page)
            refused = False
        except SystemExit:
            refused = True
        check('ไม่เขียนทับเมื่อไม่ใส่ --force', refused and out.read_text(encoding='utf-8') == before)
        draft('dentist booking site', FIXTURES, out, page, force=True)
        check('--force เขียนทับได้ และค้นอังกฤษได้', 'คลินิกทันตกรรม' in out.read_text(encoding='utf-8'))
        try:
            draft('quantum zebra spaceship', FIXTURES, Path(tmp, 'x.md'), Path(tmp, 'x.html'))
            abstained = False
        except SystemExit:
            abstained = True
        check('โจทย์ไม่ตรงอุตสาหกรรมไหน → หยุด ไม่เดา', abstained and not Path(tmp, 'x.md').exists())
        extra = Path(tmp, 'web-palettes.csv')
        web_rows = [{**r, 'id': 'web-test'} for r in read_csv(FIXTURES / 'palettes.csv') if r['id'] == 'jade-paper']
        with extra.open('w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=list(web_rows[0]))
            writer.writeheader()
            writer.writerows(web_rows)
        dirs, _, _ = draft('quantum zebra spaceship', FIXTURES, Path(tmp, 'c.md'), Path(tmp, 'c.html'),
                           palette_ids=['web-test', 'gold-ink'], extra_palettes=extra)
        check('--palettes กับอุตสาหกรรมที่ไม่มี → ใช้ custom และพาเลตที่ส่งมา', len(dirs) == 3
              and dirs[0]['palette_id'] == 'web-test' and '`custom`' in Path(tmp, 'c.md').read_text(encoding='utf-8'))
    failed = [n for n, ok in checks if not ok]
    for name, ok in checks:
        print(('ผ่าน     ' if ok else 'ไม่ผ่าน  ') + name)
    print(f'self-test: {len(checks) - len(failed)}/{len(checks)} ผ่าน')
    return not failed


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('brief', nargs='?', help='โจทย์ไทยหรืออังกฤษ')
    ap.add_argument('--out', default='docs/DESIGN.md')
    ap.add_argument('--html', help='ค่าตั้งต้น docs/design/<id อุตสาหกรรม>-design-directions.html')
    ap.add_argument('--industry', help='บังคับ id อุตสาหกรรม เมื่อค้นไม่เจอหรือเจอผิด')
    ap.add_argument('--data', default=str(DATA_DIR))
    ap.add_argument('--force', action='store_true', help='เขียนทับไฟล์ที่มีอยู่')
    ap.add_argument('--extra-palettes', help='CSV พาเลตเพิ่ม (ผลของ brand_colors.py --palette)')
    ap.add_argument('--palettes', help='id พาเลตคั่นด้วย ; ใช้แทนพาเลตของอุตสาหกรรม · '
                    'หาอุตสาหกรรมไม่เจอจะใช้อุตสาหกรรมชั่วคราว custom แทนการหยุด')
    ap.add_argument('--self-test', action='store_true')
    args = ap.parse_args()
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if args.self_test:
        sys.exit(0 if self_test() else 1)
    if not args.brief:
        ap.error('ใส่โจทย์ หรือ --self-test')
    directions, rejected, paths = draft(args.brief, args.data, args.out, args.html, args.industry, args.force,
                                        palette_ids=split_values(args.palettes), extra_palettes=args.extra_palettes)
    for label, d in zip(LABELS, directions):
        print(f'แนว {label}: {d["look"].get("id")} · พาเลต {d["palette_id"]} · ฟอนต์ {d["font_id"]}')
    if rejected:
        print(f'ตัดออก {len(rejected)} รายการ (ดูท้าย DESIGN.md)')
    print('เขียนแล้ว: ' + ' · '.join(str(p) for p in paths))


if __name__ == '__main__':
    main()
