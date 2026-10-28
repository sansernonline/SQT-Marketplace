"""สร้างพาเลต 2 โหมด (light · dark) ตามคอลัมน์ของ data/palettes.csv จากสีแบรนด์ที่พบข้ามหลายเว็บ

ใช้จาก brand_colors.py --palette · สีหลักและ accent เลื่อนเฉดจากของจริงเสมอ เพื่อไม่ให้หน้าตาเหมือนแบรนด์ใดแบรนด์หนึ่ง
"""
import colorsys
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_data import COLUMNS, TAILWIND_HEX  # noqa: E402
from design_draft import color_distance, contrast, palette_problems, rgb  # noqa: E402

HUE_SHIFT_DEGREES = 8  # เลื่อนเฉดพอให้ไม่ใช่สีของแบรนด์ แต่ยังอยู่ในโทนเดียวกับวงการ
SAME_COLOR_ACROSS_SITES = 48  # ระยะ RGB ที่ถือว่า 2 เว็บใช้สีเดียวกัน · หลวมกว่าการรวมสีในเว็บเดียว
MIN_ACCENT_DISTANCE = 60
MAX_BUTTON_LIGHTNESS = 0.85  # สีอ่อนกว่านี้เป็นพื้นรองของแบรนด์ ไม่ใช่สีปุ่ม · เคยได้ accent ฟ้าจัดจาก #D8DFFD
STATUS_HUES = {'success': 140, 'warning': 32, 'danger': 4}


def to_hls(hex_color):
    return colorsys.rgb_to_hls(*(c / 255 for c in rgb(hex_color)))


def to_hex(hue, lightness, saturation):
    """hue เป็นองศา · ถ้าตรงสีตั้งต้นของ Tailwind ให้ขยับความสว่างนิดเดียวจนพ้น"""
    while True:
        r, g, b = colorsys.hls_to_rgb((hue % 360) / 360, lightness, saturation)
        value = '#{:02X}{:02X}{:02X}'.format(*(round(c * 255) for c in (r, g, b)))
        if value.lower() not in TAILWIND_HEX:
            return value
        lightness += 0.004 if lightness < 0.5 else -0.004


def shift_until(hue, saturation, lightness, step, is_ok):
    """เลื่อนความสว่างทีละ step จนผ่าน is_ok · ไม่ผ่านจนสุดช่วงคืนค่าสุดท้าย"""
    value = to_hex(hue, lightness, saturation)
    while not is_ok(value) and 0.02 < lightness < 0.98:
        lightness += step
        value = to_hex(hue, lightness, saturation)
    return value


def common_colors(sites):
    """สีแบรนด์ที่หลายเว็บใช้ร่วมกัน เรียงตามจำนวนเว็บ แล้วตามน้ำหนักรวม (น้ำหนักต่อเว็บถูกทำให้รวมเป็น 1)"""
    groups = []
    for site in sites:
        total = sum(c['weight'] for c in site['brand']) or 1
        for color in site['brand']:
            if to_hls(color['hex'])[1] > MAX_BUTTON_LIGHTNESS:
                continue
            group = next((g for g in groups if color_distance(g['hex'], color['hex']) < SAME_COLOR_ACROSS_SITES), None)
            if group is None:
                group = {'hex': color['hex'], 'hosts': [], 'weight': 0.0}
                groups.append(group)
            group['weight'] += color['weight'] / total
            if site['host'] not in group['hosts']:
                group['hosts'].append(site['host'])
    return sorted(groups, key=lambda g: (-len(g['hosts']), -g['weight']))


def pick_primary_and_accent(groups):
    primary = groups[0]
    accent = next((g for g in groups[1:] if color_distance(g['hex'], primary['hex']) >= MIN_ACCENT_DISTANCE), None)
    return primary, accent


def light_row(hue, saturation, accent_hue, accent_saturation):
    bg = to_hex(hue, 0.975, 0.18)
    surface = to_hex(hue, 0.995, 0.2)
    on_primary = to_hex(hue, 0.99, 0.2)
    row = {'bg': bg, 'surface': surface, 'on_primary': on_primary,
           'text': to_hex(hue, 0.13, 0.3), 'text_muted': to_hex(hue, 0.36, 0.15), 'border': to_hex(hue, 0.5, 0.12)}
    row['primary'] = shift_until(hue, saturation, 0.5, -0.01, lambda c: contrast(on_primary, c) >= 4.6)
    row['accent'] = shift_until(accent_hue, accent_saturation, 0.5, -0.01, lambda c: contrast(c, bg) >= 3.2)
    for role, status_hue in STATUS_HUES.items():
        row[role] = shift_until(status_hue, 0.65, 0.45, -0.01, lambda c: contrast(c, surface) >= 4.6)
    return row


def dark_row(hue, saturation, accent_hue, accent_saturation):
    bg = to_hex(hue, 0.08, 0.25)
    surface = to_hex(hue, 0.12, 0.22)
    row = {'bg': bg, 'surface': surface, 'on_primary': bg,
           'text': to_hex(hue, 0.92, 0.15), 'text_muted': to_hex(hue, 0.7, 0.1), 'border': to_hex(hue, 0.42, 0.12)}
    row['primary'] = shift_until(hue, saturation, 0.5, 0.01, lambda c: contrast(c, bg) >= 4.6)
    row['accent'] = shift_until(accent_hue, accent_saturation, 0.5, 0.01, lambda c: contrast(c, bg) >= 3.2)
    for role, status_hue in STATUS_HUES.items():
        row[role] = shift_until(status_hue, 0.6, 0.5, 0.01, lambda c: contrast(c, surface) >= 4.6)
    return row


def build_palette(palette_id, sites, fetched_on):
    """คืน (แถว light, แถว dark) ตามคอลัมน์ palettes.csv · ไม่มีสีแบรนด์เลยหรือพาเลตไม่ผ่าน → SystemExit"""
    usable = [s for s in sites if s['brand']]
    if not usable:
        raise SystemExit('ไม่มีเว็บที่ดึงสีแบรนด์ได้ จึงสร้างพาเลตไม่ได้ · ลองเว็บอื่นในวงการ หรือถอดสีจากงานต้นแบบแล้วส่งด้วย design_draft.py --palette')
    primary, accent = pick_primary_and_accent(common_colors(usable))
    hue, _, saturation = to_hls(primary['hex'])
    hue_degrees = hue * 360 + HUE_SHIFT_DEGREES
    if accent:
        accent_hue, _, accent_saturation = to_hls(accent['hex'])
        accent_degrees = accent_hue * 360 + HUE_SHIFT_DEGREES
    else:  # ทุกเว็บใช้โทนเดียว → accent เป็นสีตรงข้ามค่อนข้างสงบ
        accent_degrees, accent_saturation = hue_degrees + 150, 0.5
    saturation, accent_saturation = min(max(saturation, 0.35), 0.8), min(max(accent_saturation, 0.35), 0.8)
    hosts = ' '.join(s['host'] for s in usable)
    accent_note = (f'accent จาก {accent["hex"]} ({" ".join(accent["hosts"])})' if accent
                   else 'accent คิดเป็นสีตรงข้าม เพราะทุกเว็บใช้โทนเดียว')
    notes = (f'สีจากเว็บจริง ดึงวันที่ {fetched_on}: {hosts} · primary จาก {primary["hex"]} '
             f'(พบใน {len(primary["hosts"])} เว็บ) · {accent_note} · เลื่อนเฉด +{HUE_SHIFT_DEGREES} องศา '
             'และปรับความสว่างให้ผ่าน contrast จึงไม่ตรงกับสีของแบรนด์ใด')
    common = {'id': palette_id, 'name_th': f'สีจากเว็บจริง {palette_id}', 'keywords': ';'.join(s['host'] for s in usable),
              'notes_th': notes}
    light = {**common, 'mode': 'light', **light_row(hue_degrees, saturation, accent_degrees, accent_saturation)}
    dark = {**common, 'mode': 'dark', **dark_row(hue_degrees, saturation, accent_degrees, accent_saturation)}
    problems = palette_problems({'light': light, 'dark': dark})
    if problems:
        raise SystemExit(f'พาเลตที่สร้างไม่ผ่าน: {problems}')
    columns = COLUMNS['palettes.csv']
    return [{c: light[c] for c in columns}, {c: dark[c] for c in columns}]


def palette_from_roles(palette_id, roles, fetched_on):
    """สี 8 หน้าที่ (bg surface text text_muted primary secondary accent border) ที่ถอดจากงานจริง → (light, dark)
    light ใช้สีที่ให้มาตรง ๆ · on_primary และสีสถานะคิดให้ผ่าน contrast · dark คิดจากเฉดของ primary และ accent
    secondary ไม่มีช่องในตาราง จึงบันทึกใน notes_th"""
    light = {r: roles[r].upper() for r in ('bg', 'surface', 'text', 'text_muted', 'primary', 'accent', 'border')}
    light['on_primary'] = max((light['surface'], light['text']), key=lambda c: contrast(c, light['primary']))
    for role, hue in STATUS_HUES.items():
        light[role] = shift_until(hue, 0.65, 0.45, -0.01, lambda c: contrast(c, light['surface']) >= 4.6)
    p_hue, _, p_sat = to_hls(light['primary'])
    a_hue, _, a_sat = to_hls(light['accent'])
    dark = dark_row(p_hue * 360, p_sat, a_hue * 360, a_sat)
    secondary = roles.get('secondary')
    notes = (f'สีจากงานจริงที่ผู้ใช้ส่ง วันที่ {fetched_on} · โหมดสว่างตามสีที่ส่ง · on_primary สีสถานะ และโหมดมืด'
             f'คิดให้ผ่าน contrast' + (f' · secondary {secondary.upper()} (ไม่มีช่องในตาราง)' if secondary else ''))
    common = {'id': palette_id, 'name_th': f'สีจากงานจริง {palette_id}', 'keywords': palette_id, 'notes_th': notes}
    rows = [{**common, 'mode': 'light', **light}, {**common, 'mode': 'dark', **dark}]
    problems = palette_problems({r['mode']: r for r in rows})
    if problems:
        raise SystemExit(f'พาเลต "{palette_id}" ไม่ผ่าน: {problems}')
    return [{c: r[c] for c in COLUMNS['palettes.csv']} for r in rows]


def self_test():
    """python brand_palette.py --self-test · ตรวจ common_colors กับ palette_from_roles (build_palette มี test ใน brand_colors.py)"""
    sites = [{'host': 'a.test', 'brand': [{'hex': '#B5462A', 'weight': 5}, {'hex': '#0E7C86', 'weight': 2}]},
             {'host': 'b.test', 'brand': [{'hex': '#B8482C', 'weight': 3}]}]
    groups = common_colors(sites)
    assert groups[0]['hosts'] == ['a.test', 'b.test'] and groups[0]['hex'] == '#B5462A', groups   # สีใกล้กันรวมเป็นกลุ่มเดียว
    primary, accent = pick_primary_and_accent(groups)
    assert accent and accent['hex'] == '#0E7C86', accent
    assert common_colors([{'host': 'x', 'brand': [{'hex': '#D8DFFD', 'weight': 5}]}]) == []        # สีอ่อนไม่ใช่สีปุ่ม
    roles = {'bg': '#FAF7F2', 'surface': '#FFFFFF', 'text': '#2B1D18', 'text_muted': '#6B5A52',
             'primary': '#B5462A', 'secondary': '#E8B04B', 'accent': '#0E7C86', 'border': '#E6DDD3'}
    light, dark = palette_from_roles('roles-test', roles, '2026-10-28')
    assert (light['mode'], dark['mode']) == ('light', 'dark') and light['primary'] == '#B5462A'
    assert not palette_problems({'light': light, 'dark': dark})
    assert contrast(light['on_primary'], light['primary']) >= 4.5 and contrast(dark['text'], dark['bg']) >= 7
    assert '#E8B04B' in light['notes_th'] and '2026-10-28' in light['notes_th']
    low = dict(roles, text_muted='#DDDDDD')                    # text_muted อ่านไม่ออกบนพื้น → ต้องไม่ผ่านเงียบ ๆ
    try:
        palette_from_roles('bad', low, '2026-10-28')
        raise AssertionError('พาเลตที่ contrast ต่ำต้องถูกปฏิเสธ')
    except SystemExit as stop:
        assert 'ไม่ผ่าน' in str(stop)
    print('self-test ok')


if __name__ == '__main__':
    if sys.argv[1:] == ['--self-test']:
        self_test()
    else:
        print('ใช้: python brand_palette.py --self-test (ไฟล์นี้ถูกเรียกจาก brand_colors.py --palette)')
