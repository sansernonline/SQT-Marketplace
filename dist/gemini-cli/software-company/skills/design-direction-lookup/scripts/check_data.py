#!/usr/bin/env python3
"""ตรวจชุดข้อมูลของ design-direction-lookup (data/*.csv) ก่อนเข้า repo

  python check_data.py [--data <โฟลเดอร์>] [--today YYYY-MM-DD]
  python check_data.py --self-test

ตรวจ: คอลัมน์ครบ · id ไม่ซ้ำ · อ้าง id ข้ามไฟล์มีจริง · contrast WCAG 2.2 ทุกพาเลตทั้ง 2 โหมด ·
ไม่มีค่าสีตั้งต้นของ Tailwind · ฟอนต์ไทยในคู่ฟอนต์มีใน thai-fonts.csv และมีละตินคู่ ·
ไม่ใช้ฟอนต์ที่ no-ai-look นับว่าใช้ซ้ำจนเป็นหน้าตา AI · วันตรวจเก่ากว่า 365 วันเตือน
exit 0 = ไม่มี error · exit 1 = มี error (คำเตือนไม่ทำให้ล้ม)
Python stdlib เท่านั้น
"""
import argparse
import csv
import datetime as dt
import re
import sys
import tempfile
from pathlib import Path

COLUMNS = {
    'thai-fonts.csv': ['family', 'style', 'weights', 'has_latin', 'licence', 'source_url', 'checked', 'notes_th'],
    'font-pairs.csv': ['id', 'heading', 'body', 'numeric', 'thai_style', 'keywords', 'min_body_px', 'line_height',
                       'size_note_th', 'notes_th', 'checked'],
    'looks.csv': ['id', 'name_th', 'name_en', 'keywords', 'depth', 'motion', 'density', 'avoid_th'],
    'palettes.csv': ['id', 'name_th', 'keywords', 'mode', 'bg', 'surface', 'text', 'text_muted', 'primary',
                     'on_primary', 'accent', 'border', 'success', 'warning', 'danger', 'notes_th'],
    'industries.csv': ['id', 'name_th', 'name_en', 'keywords_th', 'keywords_en', 'personality', 'looks',
                       'palette_ids', 'font_pair_ids', 'cautions_th', 'decision_rule_th'],
}
# ชุดกฎ (ux-rules · charts · landing · stacks/*.csv) · ทุกช่องห้ามว่าง
RULE_COLUMNS = {
    'ux-rules.csv': ['id', 'category', 'rule_th', 'why_th', 'keywords_th', 'keywords_en', 'severity', 'platform', 'source'],
    'charts.csv': ['id', 'data_shape', 'goal', 'chart', 'avoid', 'thai_notes', 'keywords'],
    'landing.csv': ['id', 'goal_th', 'keywords', 'sections', 'cta_th', 'notes_th'],
}
STACK_COLUMNS = ['id', 'topic', 'rule_th', 'do', 'dont', 'keywords', 'source']
SEVERITIES = {'high', 'medium', 'low'}
PLATFORMS = {'all', 'web', 'mobile', 'desktop'}
SKILL_NAME = re.compile(r'(?:[a-z0-9-]+:)?([a-z0-9][a-z0-9-]*)')
PLUGINS_DIR = Path(__file__).resolve().parents[4]
COLOR_ROLES = COLUMNS['palettes.csv'][4:15]
# (ข้อความ, พื้น, ขั้นต่ำ, บังคับ) · WCAG 2.2 ข้อ 1.4.3 ข้อความ 4.5:1 · ข้อ 1.4.11 ขอบของช่องกรอก 3:1
CONTRAST_RULES = [('text', 'bg', 4.5, True), ('text', 'surface', 4.5, True), ('text_muted', 'bg', 4.5, True),
                  ('on_primary', 'primary', 4.5, True), ('border', 'bg', 3.0, False)]
THAI_STYLES = {'looped', 'loopless', 'display', 'mono'}
PAIR_STYLES = {'looped', 'loopless', 'mixed', 'display'}
HAS_LATIN = {'yes', 'no', 'varies', 'unverified'}
# ชื่อบุคลิกตาม ui-craft/references/app-character.md ข้อ 2
PERSONALITIES = {'1 เครื่องมือทำงาน', '2 การเงิน สุขภาพ ราชการ', '3 ไลฟ์สไตล์ ช้อปปิ้ง อาหาร',
                 '4 บันเทิง โซเชียล เกมเบา', '5 เด็ก การเรียนรู้', '6 พรีเมียม สร้างสรรค์'}
# Inter/Geist: no-ai-look slop_scan.py กฎ overused-font · Roboto/Poppins/Montserrat: ค่าตั้งต้นที่เจอบ่อยในงาน AI
OVERUSED_FONTS = {'inter', 'geist', 'roboto', 'poppins', 'montserrat'}
MIN_REFS = 3
MAX_AGE_DAYS = 365

# Tailwind CSS v3 default palette ทุกเฉด 50–950 (tailwindcss/src/public/colors.js) · v4 ใช้ oklch ที่แปลงมาจากชุดเดียวกัน
_TW = {
    'slate': 'f8fafc f1f5f9 e2e8f0 cbd5e1 94a3b8 64748b 475569 334155 1e293b 0f172a 020617',
    'gray': 'f9fafb f3f4f6 e5e7eb d1d5db 9ca3af 6b7280 4b5563 374151 1f2937 111827 030712',
    'zinc': 'fafafa f4f4f5 e4e4e7 d4d4d8 a1a1aa 71717a 52525b 3f3f46 27272a 18181b 09090b',
    'neutral': 'fafafa f5f5f5 e5e5e5 d4d4d4 a3a3a3 737373 525252 404040 262626 171717 0a0a0a',
    'stone': 'fafaf9 f5f5f4 e7e5e4 d6d3d1 a8a29e 78716c 57534e 44403c 292524 1c1917 0c0a09',
    'red': 'fef2f2 fee2e2 fecaca fca5a5 f87171 ef4444 dc2626 b91c1c 991b1b 7f1d1d 450a0a',
    'orange': 'fff7ed ffedd5 fed7aa fdba74 fb923c f97316 ea580c c2410c 9a3412 7c2d12 431407',
    'amber': 'fffbeb fef3c7 fde68a fcd34d fbbf24 f59e0b d97706 b45309 92400e 78350f 451a03',
    'yellow': 'fefce8 fef9c3 fef08a fde047 facc15 eab308 ca8a04 a16207 854d0e 713f12 422006',
    'lime': 'f7fee7 ecfccb d9f99d bef264 a3e635 84cc16 65a30d 4d7c0f 3f6212 365314 1a2e05',
    'green': 'f0fdf4 dcfce7 bbf7d0 86efac 4ade80 22c55e 16a34a 15803d 166534 14532d 052e16',
    'emerald': 'ecfdf5 d1fae5 a7f3d0 6ee7b7 34d399 10b981 059669 047857 065f46 064e3b 022c22',
    'teal': 'f0fdfa ccfbf1 99f6e4 5eead4 2dd4bf 14b8a6 0d9488 0f766e 115e59 134e4a 042f2e',
    'cyan': 'ecfeff cffafe a5f3fc 67e8f9 22d3ee 06b6d4 0891b2 0e7490 155e75 164e63 083344',
    'sky': 'f0f9ff e0f2fe bae6fd 7dd3fc 38bdf8 0ea5e9 0284c7 0369a1 075985 0c4a6e 082f49',
    'blue': 'eff6ff dbeafe bfdbfe 93c5fd 60a5fa 3b82f6 2563eb 1d4ed8 1e40af 1e3a8a 172554',
    'indigo': 'eef2ff e0e7ff c7d2fe a5b4fc 818cf8 6366f1 4f46e5 4338ca 3730a3 312e81 1e1b4b',
    'violet': 'f5f3ff ede9fe ddd6fe c4b5fd a78bfa 8b5cf6 7c3aed 6d28d9 5b21b6 4c1d95 2e1065',
    'purple': 'faf5ff f3e8ff e9d5ff d8b4fe c084fc a855f7 9333ea 7e22ce 6b21a8 581c87 3b0764',
    'fuchsia': 'fdf4ff fae8ff f5d0fe f0abfc e879f9 d946ef c026d3 a21caf 86198f 701a75 4a044e',
    'pink': 'fdf2f8 fce7f3 fbcfe8 f9a8d4 f472b6 ec4899 db2777 be185d 9d174d 831843 500724',
    'rose': 'fff1f2 ffe4e6 fecdd3 fda4af fb7185 f43f5e e11d48 be123c 9f1239 881337 4c0519',
}
TAILWIND_HEX = {'#' + h for shades in _TW.values() for h in shades.split()}
HEX = re.compile(r'#[0-9a-fA-F]{6}')


def split_values(field):
    return [v.strip() for v in (field or '').split(';') if v.strip()]


def font_parts(field):
    """'Noto Sans Thai + Noto Sans' → ['Noto Sans Thai', 'Noto Sans'] · ตัดหมายเหตุในวงเล็บทิ้ง"""
    return [re.sub(r'\(.*?\)', '', p).strip() for p in re.split(r'[+;]', field or '') if p.strip()]


def luminance(hex_color):
    def channel(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (int(hex_color[i:i + 2], 16) for i in (1, 3, 5))
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def contrast(a, b):
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def is_cream(hex_color):
    """เกณฑ์เดียวกับ no-ai-look slop_scan.py กฎ cream-palette"""
    r, g, b = (int(hex_color[i:i + 2], 16) for i in (1, 3, 5))
    return r >= 0xF0 and g >= 0xE6 and 0xD0 <= b <= 0xEE and r - b >= 10


class Report:
    def __init__(self):
        self.errors, self.warnings = [], []

    def error(self, where, msg):
        self.errors.append(f'{where}: {msg}')

    def warn(self, where, msg):
        self.warnings.append(f'{where}: {msg}')


def load(data_dir, report, columns=COLUMNS):
    tables = {}
    for name, cols in columns.items():
        path = data_dir / name
        if not path.exists():
            report.error(name, 'ไม่มีไฟล์')
            tables[name] = []
            continue
        with path.open(encoding='utf-8-sig', newline='') as f:
            reader = csv.DictReader(f)
            if reader.fieldnames != cols:
                report.error(name, f'คอลัมน์ไม่ตรง ต้องเป็น {",".join(cols)} ได้ {",".join(reader.fieldnames or [])}')
            rows = list(reader)
        for i, row in enumerate(rows, start=2):
            row['_where'] = f'{name}:{i}'
            if None in row or any(v is None for v in row.values()):
                report.error(row['_where'], 'จำนวนช่องไม่เท่าหัวตาราง (มีจุลภาคเกินหรือขาด)')
        tables[name] = rows
    return tables


def check_unique(rows, key, report):
    seen = {}
    for row in rows:
        k = key(row)
        if not k or not k[0]:
            report.error(row['_where'], 'id ว่าง')
        elif k in seen:
            report.error(row['_where'], f'id {k} ซ้ำกับ {seen[k]}')
        else:
            seen[k] = row['_where']
    return seen


def check_date(row, report, today):
    try:
        d = dt.date.fromisoformat(row.get('checked', ''))
    except ValueError:
        report.error(row['_where'], f'checked "{row.get("checked")}" ไม่ใช่วันที่ YYYY-MM-DD')
        return
    if d > today:
        report.error(row['_where'], f'checked {d} อยู่ในอนาคต')
    elif (today - d).days > MAX_AGE_DAYS:
        report.warn(row['_where'], f'ตรวจล่าสุด {d} เกิน {MAX_AGE_DAYS} วัน ตรวจซ้ำ')


def check_thai_fonts(rows, report, today):
    check_unique(rows, lambda r: (r['family'].strip().lower(),), report)
    for r in rows:
        w = r['_where']
        if r['style'] not in THAI_STYLES:
            report.error(w, f'style "{r["style"]}" ต้องเป็น {"|".join(sorted(THAI_STYLES))}')
        if r['has_latin'] not in HAS_LATIN:
            report.error(w, f'has_latin "{r["has_latin"]}" ต้องเป็น {"|".join(sorted(HAS_LATIN))}')
        if not r['licence'].strip():
            report.error(w, 'licence ว่าง (ตรวจไม่ได้ให้ใส่ unverified)')
        elif r['licence'] == 'unverified':
            report.warn(w, f'{r["family"]} ยังไม่ได้ตรวจใบอนุญาต')
        if not r['source_url'].startswith('https://'):
            report.error(w, 'source_url ต้องเป็นลิงก์ https')
        check_date(r, report, today)
    return {r['family'].strip().lower(): r for r in rows}


def check_font_pairs(rows, fonts, report, today):
    for r in rows:
        w = r['_where']
        for role in ('heading', 'body', 'numeric'):
            parts = font_parts(r[role])
            if not parts:
                report.error(w, f'{role} ว่าง')
                continue
            for p in parts:
                if p.lower() in OVERUSED_FONTS:
                    report.error(w, f'{role} ใช้ {p} ซึ่งเป็นฟอนต์ที่ใช้ซ้ำจนเป็นหน้าตา AI (no-ai-look overused-font)')
            if role == 'numeric':
                continue
            thai = fonts.get(parts[0].lower())
            if not thai:
                report.error(w, f'{role} ฟอนต์แรก "{parts[0]}" ต้องเป็นฟอนต์ไทยที่มีใน thai-fonts.csv')
            elif thai['has_latin'] != 'yes' and len(parts) < 2:
                report.error(w, f'{role} {parts[0]} has_latin={thai["has_latin"]} ต้องระบุฟอนต์ละตินคู่ เช่น "{parts[0]} + Noto Sans"')
            elif thai['licence'] == 'unverified':
                report.warn(w, f'{role} ใช้ {parts[0]} ที่ยังไม่ได้ตรวจใบอนุญาต')
        if r['thai_style'] not in PAIR_STYLES:
            report.error(w, f'thai_style "{r["thai_style"]}" ต้องเป็น {"|".join(sorted(PAIR_STYLES))}')
        try:
            if not 12 <= float(r['min_body_px']) <= 24:
                report.error(w, f'min_body_px {r["min_body_px"]} นอกช่วง 12–24')
            if not 1.3 <= float(r['line_height']) <= 2.0:
                report.error(w, f'line_height {r["line_height"]} นอกช่วง 1.3–2.0 (ไทยต้องมีที่ให้สระบนล่าง)')
        except ValueError:
            report.error(w, 'min_body_px หรือ line_height ไม่ใช่ตัวเลข')
        check_date(r, report, today)


def check_palettes(rows, report):
    modes = {}
    for r in rows:
        w = f'{r["_where"]} {r["id"]}/{r["mode"]}'
        modes.setdefault(r['id'], []).append(r['mode'])
        if r['mode'] not in ('light', 'dark'):
            report.error(w, f'mode "{r["mode"]}" ต้องเป็น light|dark')
        bad = False
        for role in COLOR_ROLES:
            v = r[role].strip()
            if not HEX.fullmatch(v):
                report.error(w, f'{role} "{v}" ไม่ใช่ #RRGGBB')
                bad = True
            elif v.lower() in TAILWIND_HEX:
                report.error(w, f'{role} {v} เป็นสีตั้งต้นของ Tailwind')
        if bad:
            continue
        for fg, bg, need, hard in CONTRAST_RULES:
            ratio = contrast(r[fg], r[bg])
            if ratio < need:
                (report.error if hard else report.warn)(w, f'{fg}/{bg} {ratio:.2f}:1 ต่ำกว่า {need}:1')
        if r['mode'] == 'light' and is_cream(r['bg']):
            report.warn(w, f'bg {r["bg"]} เป็นพื้นครีม (no-ai-look cream-palette) ต้องมีเหตุผลจากวัสดุใน notes_th')
    for pid, ms in modes.items():
        if sorted(ms) != ['dark', 'light']:
            report.error(f'palettes.csv {pid}', f'ต้องมี light และ dark อย่างละ 1 แถว ได้ {ms}')
    return set(modes)


def check_refs(row, col, valid, report):
    ids = split_values(row[col])
    for i in ids:
        if i not in valid:
            report.error(row['_where'], f'{col} อ้าง "{i}" ที่ไม่มีจริง')
    if len(set(ids)) < MIN_REFS:
        report.error(row['_where'], f'{col} ต้องมีอย่างน้อย {MIN_REFS} ตัวที่ไม่ซ้ำ ได้ {len(set(ids))}')


def check_industries(rows, looks, palettes, pairs, report):
    for r in rows:
        w = r['_where']
        for p in split_values(r['personality']):
            if p not in PERSONALITIES:
                report.error(w, f'personality "{p}" ไม่ตรงชื่อใน app-character.md')
        if not split_values(r['personality']):
            report.error(w, 'personality ว่าง')
        if len(split_values(r['keywords_th'])) < 2:
            report.error(w, 'keywords_th ต้องมีอย่างน้อย 2 คำ คั่นด้วย ;')
        check_refs(r, 'looks', looks, report)
        check_refs(r, 'palette_ids', palettes, report)
        check_refs(r, 'font_pair_ids', pairs, report)


def skill_exists(name):
    return any(PLUGINS_DIR.glob(f'*/skills/{name}/SKILL.md'))


def check_rule_sets(data_dir, report):
    """ux-rules · charts · landing · stacks/*.csv"""
    stack_files = sorted((data_dir / 'stacks').glob('*.csv')) if (data_dir / 'stacks').is_dir() else []
    if not stack_files:
        report.error('stacks/', 'ไม่มีไฟล์ stack')
    columns = dict(RULE_COLUMNS, **{f'stacks/{p.name}': STACK_COLUMNS for p in stack_files})
    tables = load(data_dir, report, columns)
    unverified = 0
    seen = {}
    for name, rows in tables.items():
        group = 'stacks' if name.startswith('stacks/') else name
        for r in rows:
            w = r['_where']
            empty = [c for c in columns[name] if not (r.get(c) or '').strip()]
            if empty:
                report.error(w, f'ช่องว่าง: {",".join(empty)}')
            key = (group, r.get('id'))
            if key in seen:
                report.error(w, f'id {r.get("id")} ซ้ำกับ {seen[key]}')
            else:
                seen[key] = w
            if 'severity' in r and r['severity'] and r['severity'] not in SEVERITIES:
                report.error(w, f'severity "{r["severity"]}" ต้องเป็น {"|".join(sorted(SEVERITIES))}')
            if 'platform' in r and r['platform'] and r['platform'] not in PLATFORMS:
                report.error(w, f'platform "{r["platform"]}" ต้องเป็น {"|".join(sorted(PLATFORMS))}')
            src = (r.get('source') or '').strip()
            if 'source' not in columns[name] or not src:
                continue
            if src == 'unverified':
                unverified += 1
            elif re.fullmatch(r'https?://\S+', src):
                pass
            elif SKILL_NAME.fullmatch(src):
                if not skill_exists(SKILL_NAME.fullmatch(src).group(1)):
                    report.error(w, f'source "{src}" ไม่ใช่ชื่อ skill ที่มีใน plugins/')
            else:
                report.error(w, f'source "{src}" ต้องเป็นลิงก์ http(s) · ชื่อ skill · หรือ unverified')
    if unverified:
        report.warn('ชุดกฎ', f'source = unverified {unverified} แถว ยังไม่มีแหล่งอ้าง')
    return {n: len(rows) for n, rows in tables.items()}


def run(data_dir, today):
    report = Report()
    t = load(Path(data_dir), report)
    fonts = check_thai_fonts(t['thai-fonts.csv'], report, today)
    check_unique(t['font-pairs.csv'], lambda r: (r['id'],), report)
    check_font_pairs(t['font-pairs.csv'], fonts, report, today)
    check_unique(t['looks.csv'], lambda r: (r['id'],), report)
    check_unique(t['palettes.csv'], lambda r: (r['id'], r['mode']), report)
    palettes = check_palettes(t['palettes.csv'], report)
    check_unique(t['industries.csv'], lambda r: (r['id'],), report)
    check_industries(t['industries.csv'], {r['id'] for r in t['looks.csv']}, palettes,
                     {r['id'] for r in t['font-pairs.csv']}, report)
    counts = {n: len(rows) for n, rows in t.items()}
    counts.update(check_rule_sets(Path(data_dir), report))
    return report, counts


# ---------- self-test ----------

GOOD = {
    'thai-fonts.csv': [
        'IBM Plex Sans Thai,loopless,100;700,yes,OFL-1.1,https://github.com/google/fonts/tree/main/ofl/ibmplexsansthai,{d},ok',
        'Noto Sans Thai,loopless,100;900,varies,OFL-1.1,https://github.com/google/fonts/tree/main/ofl/notosansthai,{d},ok',
    ],
    'font-pairs.csv': [
        'p1,IBM Plex Sans Thai,IBM Plex Sans Thai,IBM Plex Mono,loopless,tech,16,1.6,ok,ok,{d}',
        'p2,Noto Sans Thai + Noto Sans,Noto Sans Thai + Noto Sans,Noto Sans,loopless,neutral,16,1.7,ok,ok,{d}',
        'p3,IBM Plex Sans Thai,Noto Sans Thai + Noto Sans,IBM Plex Mono,loopless,mix,16,1.7,ok,ok,{d}',
    ],
    'looks.csv': [f'l{i},ก,l,k,flat,100ms,dense,x' for i in (1, 2, 3)],
    'palettes.csv': [f'c{i},ก,k,light,#F7F7F4,#FFFFFE,#1A1C1A,#5E605C,#1B4D3E,#FAFAF8,#A0522D,#8A8A86,#2E6B3A,#8A5300,#A3241B,ok'
                     for i in (1, 2, 3)] +
                    [f'c{i},ก,k,dark,#121412,#1C1E1C,#EDEDE8,#A8AAA5,#7FC2A4,#121412,#D08A5F,#6E706B,#7CC48A,#E0B050,#F08A7E,ok'
                     for i in (1, 2, 3)],
    'industries.csv': ['i1,ร้าน,shop,ร้าน;ค้า,shop,3 ไลฟ์สไตล์ ช้อปปิ้ง อาหาร,l1;l2;l3,c1;c2;c3,p1;p2;p3,x,x'],
    'ux-rules.csv': ['u1,form,กฎ,เหตุ,ฟอร์ม,form,high,all,https://www.w3.org/TR/WCAG22/',
                     'u2,form,กฎ,เหตุ,ฟอร์ม,form,low,web,ui-craft',
                     'u3,form,กฎ,เหตุ,ฟอร์ม,form,medium,mobile,unverified'],
    'charts.csv': ['c1,time series,trend,line,pie,พ.ศ.,trend'],
    'landing.csv': ['g1,ขายของ,shop,hero;proof;cta,สั่งเลย,x'],
    'stacks/react.csv': ['r1,form,กฎ,do,dont,react,https://react.dev/'],
    'stacks/flutter.csv': ['f1,form,กฎ,do,dont,flutter,software-company:mobile-app-design'],
}
HEADERS = dict(COLUMNS, **RULE_COLUMNS, **{'stacks/react.csv': STACK_COLUMNS, 'stacks/flutter.csv': STACK_COLUMNS})

# (ชื่อกรณี · ไฟล์ · แถวที่แทนแถวแรก · ข้อความที่ต้องเจอใน error)
BAD = [
    ('Noto ไม่มีละตินคู่', 'font-pairs.csv', 'p1,Noto Sans Thai,IBM Plex Sans Thai,IBM Plex Mono,loopless,x,16,1.6,x,x,{d}', 'ต้องระบุฟอนต์ละตินคู่'),
    ('Inter', 'font-pairs.csv', 'p1,IBM Plex Sans Thai,Noto Sans Thai + Inter,IBM Plex Mono,loopless,x,16,1.6,x,x,{d}', 'Inter'),
    ('ฟอนต์ไทยไม่มีในรายการ', 'font-pairs.csv', 'p1,Kanit,IBM Plex Sans Thai,IBM Plex Mono,loopless,x,16,1.6,x,x,{d}', 'thai-fonts.csv'),
    ('สี Tailwind', 'palettes.csv', 'c1,ก,k,light,#F7F7F4,#FFFFFE,#1A1C1A,#5E605C,#4F46E5,#FAFAF8,#A0522D,#8A8A86,#2E6B3A,#8A5300,#A3241B,x', 'Tailwind'),
    ('contrast ตก', 'palettes.csv', 'c1,ก,k,light,#F7F7F4,#FFFFFE,#1A1C1A,#B0B0AC,#1B4D3E,#FAFAF8,#A0522D,#8A8A86,#2E6B3A,#8A5300,#A3241B,x', 'text_muted/bg'),
    ('อ้าง id ไม่มี', 'industries.csv', 'i1,ร้าน,shop,ร้าน;ค้า,shop,3 ไลฟ์สไตล์ ช้อปปิ้ง อาหาร,l1;l2;zz,c1;c2;c3,p1;p2;p3,x,x', 'อ้าง "zz"'),
    ('อ้างไม่ถึง 3', 'industries.csv', 'i1,ร้าน,shop,ร้าน;ค้า,shop,3 ไลฟ์สไตล์ ช้อปปิ้ง อาหาร,l1;l1;l2,c1;c2;c3,p1;p2;p3,x,x', 'อย่างน้อย 3'),
    ('บุคลิกผิดชื่อ', 'industries.csv', 'i1,ร้าน,shop,ร้าน;ค้า,shop,ขายของ,l1;l2;l3,c1;c2;c3,p1;p2;p3,x,x', 'personality'),
    ('id ซ้ำ', 'looks.csv', 'l2,ก,l,k,flat,100ms,dense,x', 'ซ้ำ'),
    ('คอลัมน์ขาด', 'looks.csv', None, 'คอลัมน์ไม่ตรง'),
    ('severity ผิด', 'ux-rules.csv', 'u1,form,กฎ,เหตุ,ฟอร์ม,form,critical,all,ui-craft', 'severity'),
    ('platform ผิด', 'ux-rules.csv', 'u1,form,กฎ,เหตุ,ฟอร์ม,form,high,tv,ui-craft', 'platform'),
    ('ช่องว่าง', 'charts.csv', 'c1,time series,,line,pie,พ.ศ.,trend', 'ช่องว่าง: goal'),
    ('source ไม่ใช่ลิงก์', 'stacks/react.csv', 'r1,form,กฎ,do,dont,react,ดูในเอกสาร', 'source'),
    ('skill ไม่มีจริง', 'stacks/react.csv', 'r1,form,กฎ,do,dont,react,no-such-skill-xyz', 'ไม่ใช่ชื่อ skill'),
    ('id ซ้ำข้ามไฟล์ stack', 'stacks/react.csv', 'f1,form,กฎ,do,dont,react,https://react.dev/', 'ซ้ำ'),
    ('คอลัมน์ landing ผิด', 'landing.csv', None, 'คอลัมน์ไม่ตรง'),
]


def write_set(folder, d, override=None):
    (folder / 'stacks').mkdir(exist_ok=True)
    for name, rows in GOOD.items():
        header = ','.join(HEADERS[name])
        rows = [r.replace('{d}', d) for r in rows]
        if override and override[0] == name:
            if override[1] is None:
                header = header.rsplit(',', 1)[0]
            else:
                rows[0] = override[1].replace('{d}', d)
        (folder / name).write_text(header + '\n' + '\n'.join(rows) + '\n', encoding='utf-8')


def self_test():
    today = dt.date(2026, 10, 26)
    failed = 0
    with tempfile.TemporaryDirectory() as tmp:
        folder = Path(tmp)
        write_set(folder, today.isoformat())
        rep, _ = run(folder, today)
        if rep.errors:
            failed += 1
            print('FAIL ชุดดีควรได้ error 0:', *rep.errors, sep='\n  ')
        else:
            print('ok   ชุดดี error 0')
        unv = any('unverified 1 แถว' in w for w in rep.warnings)
        print(('ok  ' if unv else 'FAIL') + ' source unverified → เตือน 1 แถว ไม่ใช่ error')
        failed += not unv
        write_set(folder, '2024-01-01')
        rep, _ = run(folder, today)
        stale = [w for w in rep.warnings if 'เกิน 365' in w]
        print(('ok  ' if stale and not rep.errors else 'FAIL') + ' วันตรวจเก่า → เตือน ไม่ใช่ error')
        failed += not (stale and not rep.errors)
        for label, name, row, expect in BAD:
            write_set(folder, today.isoformat(), (name, row))
            rep, _ = run(folder, today)
            hit = any(expect in e for e in rep.errors)
            print(('ok  ' if hit else 'FAIL') + f' {label} → error มีคำว่า "{expect}"')
            if not hit:
                failed += 1
                print('     ได้:', rep.errors)
    for a, b, want in (('#000000', '#FFFFFF', 21.0), ('#777777', '#FFFFFF', 4.48)):
        got = round(contrast(a, b), 2)
        print(('ok  ' if got == want else 'FAIL') + f' contrast {a}/{b} = {got} (ต้อง {want})')
        failed += got != want
    print('self-test ' + ('ผ่าน' if not failed else f'ล้ม {failed} ข้อ'))
    return 1 if failed else 0


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('--data', default=str(Path(__file__).resolve().parent.parent / 'data'))
    ap.add_argument('--today', help='วันที่ใช้เทียบอายุข้อมูล (ค่าเริ่มต้น วันนี้)')
    ap.add_argument('--self-test', action='store_true')
    args = ap.parse_args()
    if args.self_test:
        return self_test()
    today = dt.date.fromisoformat(args.today) if args.today else dt.date.today()
    report, counts = run(args.data, today)
    for e in report.errors:
        print('ERROR', e)
    for w in report.warnings:
        print('WARN ', w)
    print(' · '.join(f'{n} {c} แถว' for n, c in counts.items()))
    print(f'error {len(report.errors)} · เตือน {len(report.warnings)}')
    return 1 if report.errors else 0


if __name__ == '__main__':
    sys.exit(main())
