"""Draft docs/DESIGN.md from the CSS a project already has: tokens, colours, fonts, sizes, spacing, radius, shadows.

  python design_tokens.py mockup/ src/                     # print the draft
  python design_tokens.py mockup/ --out docs/DESIGN.md      # write it (refuses to overwrite without --force)
  python design_tokens.py --self-test

What it gives: what the code really uses, counted, plus drift against ui-craft (more than 5 font sizes,
spacing off the 4px scale, too many colours or radii). It does not pick the look — a person or the
ui-craft step 0 / 0.1 does that, then edits the draft. No dependencies beyond the Python standard library.
"""
import argparse, collections, pathlib, re, sys

EXTS = {'.html', '.htm', '.css', '.scss', '.less', '.jsx', '.tsx', '.vue', '.svelte', '.astro'}
SKIP_DIRS = {'node_modules', 'dist', 'build', '.git', '_to_delete', '.next', 'out', 'vendor', 'coverage'}
TOP = 12
SCALE = {0, 4, 8, 12, 16, 24, 32, 48, 64}  # ui-craft ข้อ 1

VAR = re.compile(r'(--[\w-]+)\s*:\s*([^;}{]+)')
COLOR = re.compile(r'#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|oklab)\([^)]*\)')
DECL = re.compile(r'(?<![\w-])(font-family|font-size|padding(?:-\w+)?|margin(?:-\w+)?|gap|row-gap|column-gap|border-radius|box-shadow)\s*:\s*([^;}{]+)')
MEDIA = re.compile(r'@media[^{]*\((?:min|max)-width\s*:\s*([\d.]+(?:px|em|rem))\)')
LENGTH = re.compile(r'-?[\d.]+(?:px|rem|em)\b')

def css_of(path, src):
    if path.suffix.lower() in ('.css', '.scss', '.less'): return src
    return '\n'.join(re.findall(r'<style[^>]*>(.*?)</style>', src, re.S | re.I) + ['x{%s}' % s for s in re.findall(r'style="([^"]*)"', src)])

def files(paths):
    for p in map(pathlib.Path, paths):
        if p.is_file(): yield p
        elif p.is_dir():
            for f in sorted(p.rglob('*')):
                if f.suffix.lower() in EXTS and not (set(f.parts) & SKIP_DIRS) and '.min.' not in f.name: yield f

def px(v):
    n = float(re.match(r'-?[\d.]+', v).group())
    return n * 16 if v.endswith('rem') or v.endswith('em') else n

def collect(sources):
    c = {k: collections.Counter() for k in ('color', 'font', 'size', 'space', 'radius', 'shadow', 'media')}
    tokens = {}
    for src in sources:
        src = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
        for name, val in VAR.findall(src): tokens.setdefault(name, val.strip())
        body = VAR.sub('', src)
        for m in COLOR.findall(body): c['color'][m.lower()] += 1
        for prop, val in DECL.findall(body):
            val = val.strip()
            if 'var(' in val: continue
            if prop == 'font-family': c['font'][val.split(',')[0].strip(' "\'')] += 1
            elif prop == 'font-size': c['size'][val] += 1
            elif prop == 'border-radius': c['radius'][val] += 1
            elif prop == 'box-shadow': c['shadow'][val] += 1
            else:
                for v in LENGTH.findall(val): c['space'][v] += 1
        for w in MEDIA.findall(src): c['media'][w] += 1
    return tokens, c

def drift(c):
    out = []
    sizes = [s for s in c['size'] if LENGTH.fullmatch(s)]
    if len(sizes) > 5: out.append(f'ขนาดตัวอักษร {len(sizes)} ขนาด (ui-craft ข้อ 2 ให้ไม่เกิน 5) → ยุบเหลือสเกลเดียว')
    off = sorted({v for v in c['space'] if abs(px(v)) > 2 and abs(px(v)) not in SCALE}, key=px)
    if off: out.append(f'ระยะห่างนอกสเกล 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64: {", ".join(off[:8])} (ui-craft ข้อ 1 · ข้อยกเว้นของแพลตฟอร์มอยู่ใน references/scales.md) → ปัดเข้าสเกล')
    if len(c['color']) > 12: out.append(f'ใช้สีตรง ๆ {len(c["color"])} ค่า → รวมเป็น token สีตามบทบาท (พื้น · ตัวอักษร · เส้น · accent · สถานะ)')
    if len(c['radius']) > 3: out.append(f'มุมโค้ง {len(c["radius"])} แบบ → เหลือ 2–3 ค่าตามขนาดกล่อง')
    if len(c['shadow']) > 3: out.append(f'เงา {len(c["shadow"])} แบบ → เหลือ 2–3 ระดับ (ui-craft ข้อ 4)')
    if len(c['font']) > 2: out.append(f'ฟอนต์ {len(c["font"])} ตระกูล → หัวข้อ 1 + เนื้อหา 1 พอ')
    return out

def table(head, counter, key=None):
    rows = counter.most_common() if key is None else sorted(counter.items(), key=lambda kv: key(kv[0]))
    if not rows: return f'_ไม่พบ{head}_\n'
    lines = [f'| {head} | ใช้กี่ครั้ง |', '|---|---|'] + [f'| `{k}` | {n} |' for k, n in rows[:TOP]]
    if len(rows) > TOP: lines.append(f'| …อีก {len(rows) - TOP} ค่า | |')
    return '\n'.join(lines) + '\n'

def render(tokens, c, n_files, roots):
    tok = '\n'.join(['| token | ค่า |', '|---|---|'] + [f'| `{k}` | `{v}` |' for k, v in list(tokens.items())[:40]]) if tokens else '_ยังไม่มี CSS custom property — เริ่มจากตารางด้านล่างแล้วตั้งชื่อตามบทบาท_'
    issues = '\n'.join(f'- {d}' for d in drift(c)) or '- ไม่พบความกระจัดกระจายที่นับได้'
    by_px = lambda v: px(v) if LENGTH.fullmatch(v) else 9999
    return f"""# DESIGN — ร่างจากโค้ด (รอคนแก้)

> สร้างด้วย `ui-craft/scripts/design_tokens.py` จาก {n_files} ไฟล์ใน {', '.join(roots)} · ตัวเลขคือสิ่งที่โค้ดใช้จริง ไม่ใช่สิ่งที่ควรเป็น
> ขั้นต่อไป: เลือกบุคลิกแอปและทิศทางภาพ (ui-craft ข้อ 0 · 0.1) แล้วแก้ไฟล์นี้ให้เหลือค่าที่ตั้งใจใช้ · ลบหัวข้อ "ความกระจัดกระจาย" เมื่อแก้ครบ

## บุคลิกและทิศทางภาพ
(รอยืนยัน) — 1 ใน 6 บุคลิกของ `ui-craft/references/app-character.md` · คำ 3 คำที่อยากให้คนรู้สึก · แอปอ้างอิง 1–2 ตัว

## token ที่มีอยู่
{tok}

## สี
{table('สี', c['color'])}
## ฟอนต์
{table('ฟอนต์', c['font'])}
## ขนาดตัวอักษร
{table('ขนาด', c['size'], by_px)}
## ระยะห่าง (padding · margin · gap)
{table('ระยะ', c['space'], by_px)}
## มุมโค้ง
{table('มุม', c['radius'], by_px)}
## เงา
{table('เงา', c['shadow'])}
## จุดตัดหน้าจอ (breakpoint)
{table('ความกว้าง', c['media'], by_px)}
## ความกระจัดกระจาย
{issues}
"""

def self_test():
    css = """:root{--bg:#fff;--accent:#0a7}
    body{font-family:"IBM Plex Sans Thai",sans-serif;color:#222;font-size:16px}
    h1{font-size:32px} h2{font-size:24px} h3{font-size:20px} small{font-size:12px} .x{font-size:13px} .y{font-size:15px}
    .card{padding:16px 18px;margin:0 0 24px;border-radius:8px;box-shadow:0 1px 2px #0002;color:var(--accent)}
    @media (min-width: 768px){.card{gap:12px}}"""
    html = '<div style="padding:8px;color:#ff0000">x</div><style>.b{border-radius:12px}</style>'
    tokens, c = collect([css, css_of(pathlib.Path('a.html'), html)])
    d = drift(c)
    checks = [
        ('token', tokens == {'--bg': '#fff', '--accent': '#0a7'}),
        ('สีจาก style และ :root ไม่นับซ้ำ', c['color']['#ff0000'] == 1 and '#fff' not in c['color']),
        ('ข้าม var()', '#0a7' not in c['color']),
        ('ฟอนต์', c['font']['IBM Plex Sans Thai'] == 1),
        ('ระยะ', c['space']['16px'] == 1 and c['space']['18px'] == 1 and c['space']['8px'] == 1),
        ('breakpoint', c['media']['768px'] == 1),
        ('เตือนขนาดเกิน 5', any('ขนาดตัวอักษร 7' in x for x in d)),
        ('เตือนนอกสเกล', any('18px' in x and '16px' not in x for x in d)),
        ('render', '## ความกระจัดกระจาย' in render(tokens, c, 2, ['t'])),
    ]
    for name, ok in checks: print(('ผ่าน ' if ok else 'ล้ม  ') + name)
    bad = sum(not ok for _, ok in checks)
    print(f'self-test {len(checks) - bad}/{len(checks)}')
    return 1 if bad else 0

def main():
    if hasattr(sys.stdout, 'reconfigure'): sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser(description='Draft DESIGN.md from existing CSS')
    ap.add_argument('paths', nargs='*'); ap.add_argument('--out'); ap.add_argument('--force', action='store_true')
    ap.add_argument('--self-test', action='store_true')
    a = ap.parse_args()
    if a.self_test: return self_test()
    if not a.paths: ap.error('ใส่ path ของไฟล์หรือโฟลเดอร์')
    fl = list(files(a.paths))
    if not fl: print('ไม่พบไฟล์ UI (ตรวจ 0 ไฟล์ = ผิด ไม่ใช่ผ่าน)'); return 2
    tokens, c = collect(css_of(f, f.read_text(encoding='utf-8', errors='replace')) for f in fl)
    md = render(tokens, c, len(fl), a.paths)
    if not a.out: print(md); return 0
    out = pathlib.Path(a.out)
    if out.exists() and not a.force: print(f'{out} มีอยู่แล้ว · ไม่เขียนทับ (ใส่ --force ถ้าตั้งใจ)'); return 2
    out.parent.mkdir(parents=True, exist_ok=True); out.write_text(md, encoding='utf-8')
    print(f'เขียน {out} จาก {len(fl)} ไฟล์ · ความกระจัดกระจาย {len(drift(c))} ข้อ'); return 0

if __name__ == '__main__':
    sys.exit(main())
