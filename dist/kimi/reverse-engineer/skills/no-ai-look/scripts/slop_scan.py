"""Scan UI source (HTML · CSS · JSX/TSX · Vue · Svelte) for AI-slop tells and basic quality problems.

  python slop_scan.py mockup/                 # folder or files · prints a table
  python slop_scan.py src/ --json             # machine-readable
  python slop_scan.py src/ --min P2           # show only P0..P2
  python slop_scan.py --self-test             # prove every rule still fires

Levels: P0 broken / unusable · P1 hard to read · P2 strong AI tell · P3 look again (may be intentional)
Exit code 1 when any P0 or P1 is found (use as a gate) · 0 otherwise.

A finding is a reason to look, not an order to change. Keep an intentional choice by writing
  /* slop-ok: <rule-id> <reason> */   in CSS   or   <!-- slop-ok: <rule-id> <reason> -->   in HTML
anywhere in the same file. The reason is shown in the report so reviewers can see it.
No dependencies beyond the Python standard library.
"""
import argparse, json, pathlib, re, sys
from html.parser import HTMLParser

EXTS = {'.html', '.htm', '.css', '.scss', '.less', '.jsx', '.tsx', '.vue', '.svelte', '.astro'}
SKIP_DIRS = {'node_modules', 'dist', 'build', '.git', '_to_delete', '.next', 'out', 'vendor', 'coverage'}
LEVELS = ['P0', 'P1', 'P2', 'P3']

HINT = {
    'gradient-text':     ('P2', 'ตัวอักษรไล่สี → ใช้สีทึบสีเดียว เน้นด้วยขนาดหรือน้ำหนักแทน'),
    'ai-palette':        ('P2', 'ไล่สีม่วง-น้ำเงิน-ฟ้า → สร้างพาเลตจากสีแบรนด์ของโปรเจกต์'),
    'radial-halo':       ('P2', 'แสงฟุ้งวงกลมหลังเนื้อหา → ลบ แล้วนำสายตาด้วยระยะห่างและหัวข้อ'),
    'glassmorphism':     ('P3', 'กระจกฝ้า → ใช้เฉพาะของที่ลอยทับเนื้อหาจริง (เมนู · แถบบนที่เลื่อนทับ)'),
    'neon-glow':         ('P2', 'เงาเรืองแสงสี → ลบ glow หรือใช้เงาดำจาง ๆ เฉพาะของที่ลอย'),
    'side-tab':          ('P2', 'แถบสีหนาข้างการ์ดโค้ง → ลบ ถ้าไม่ได้บอกสถานะ/คำเตือน · ใช้พื้นสีทึบหรือป้ายแทน'),
    'hairline-shadow':   ('P2', 'เส้น 1px + เงากว้างบนกล่องเดียว → เลือกอย่างเดียว'),
    'huge-radius':       ('P3', 'มุมโค้งใหญ่เกินขนาดกล่อง → ลดให้เข้ากับขนาด (การ์ดทั่วไป 8–16px)'),
    'grid-bg':           ('P2', 'พื้นหลังลายกริดตกแต่ง → ใช้พื้นเรียบ เก็บกริดไว้กับ canvas/แผนที่'),
    'stripes':           ('P2', 'ลายทางซ้ำ → ใช้พื้นเรียบ'),
    'overused-font':     ('P3', 'Inter/Geist เป็นฟอนต์แรก → เลือกฟอนต์ตามบุคลิกแอป (คงไว้ได้ถ้าเป็นฟอนต์แบรนด์)'),
    'italic-serif-display': ('P2', 'หัวข้อเซอริฟตัวเอียงขนาดใหญ่ → เลือกแบบอักษรตามบุคลิกสินค้า'),
    'crushed-tracking':  ('P2', 'บีบระยะตัวอักษรแรงเกิน → คลายให้ไม่ต่ำกว่า -0.03em'),
    'wide-body-tracking': ('P1', 'ถ่างตัวอักษรในเนื้อหา → เก็บไว้กับป้ายสั้นตัวพิมพ์ใหญ่เท่านั้น'),
    'all-caps-body':     ('P1', 'ย่อหน้าตัวพิมพ์ใหญ่ทั้งหมด → ใช้ sentence case'),
    'justified':         ('P1', 'จัดชิดสองข้าง → ชิดซ้าย (ภาษาไทยยิ่งห่างเป็นรู)'),
    'tight-leading':     ('P1', 'ระยะบรรทัดเนื้อหาแน่นเกิน → เริ่มที่ 1.5 (ไทย +0.1)'),
    'tiny-text':         ('P1', 'ตัวอักษรเล็กกว่า 11px → ขั้นต่ำ 11 · เนื้อหาหลัก 13–16'),
    'pulsing-dot':       ('P2', 'จุดกระพริบวนไม่หยุด → ให้นิ่ง ขยับเฉพาะตอนสถานะเปลี่ยนจริง'),
    'blinking-cursor':   ('P2', 'เคอร์เซอร์กระพริบในข้อความนิ่ง → ลบ เก็บไว้ในช่องที่พิมพ์ได้'),
    'marquee':           ('P2', 'ตัวอักษร/โลโก้เลื่อนเอง → ให้นิ่ง หรือมีปุ่มหยุด'),
    'bounce-easing':     ('P2', 'easing เด้งเลยเป้า → ease-out ธรรมดา 150–250ms'),
    'layout-animation':  ('P3', 'animate ขนาด/ระยะ → ใช้ transform/opacity · เลี่ยง transition: all'),
    'hover-zoom-image':  ('P3', 'รูปซูม/หมุนเมื่อชี้ → ให้นิ่ง เว้นแต่บอกว่ากดได้'),
    'em-dash-overuse':   ('P2', 'ขีดยาวถี่ในข้อความหน้าจอ → แยกเป็นประโยคด้วยจุด'),
    'buzzword':          ('P2', 'คำโฆษณากว้าง ๆ → บอกว่าผู้ใช้ทำอะไรได้ ได้อะไรดีขึ้น'),
    'forced-contrast':   ('P2', 'ประโยคตัดคม "ไม่ใช่ X แต่คือ Y" → อธิบายตรง ๆ'),
    'theater':           ('P3', 'เรียกสิ่งต่าง ๆ ว่า theater → บอกว่าอะไรไม่ได้ผลและเพราะอะไร'),
    'eyebrow-badge':     ('P2', 'ป้ายเล็กเหนือหัวข้อหลัก → ลบ หรือย้ายคำที่มีประโยชน์เข้าหัวข้อ'),
    'icon-tile':         ('P2', 'ไอคอนในกรอบมนเหนือหัวข้อการ์ด → วางไอคอนข้างหัวข้อ หรือเอากรอบออก'),
    'numbered-labels':   ('P3', 'เลข 01/02/03 หน้าหัวข้อ → ใช้เฉพาะเมื่อมีลำดับจริง'),
    'nested-cards':      ('P2', 'การ์ดซ้อนการ์ด → ใช้ระยะห่าง ตัวอักษร หรือเส้นคั่นแทน'),
    'skipped-heading':   ('P1', 'ข้ามระดับหัวข้อ → h1 → h2 → h3 ตามโครงหน้า'),
    'broken-image':      ('P0', 'รูปไม่มี src หรือเป็นรูปจำลอง → ใส่รูปจริง หรือเอาออก'),
    'lorem':             ('P0', 'ข้อความ Lorem/ตัวอย่าง → ใช้เนื้อหาสมจริง'),
    'placeholder-label': ('P0', 'ช่องกรอกมีแค่ placeholder ไม่มี label → ใส่ label ที่มองเห็น'),
    'low-contrast':      ('P1', 'สีตัวอักษรกับพื้นต่างกันไม่ถึง 4.5:1 → เข้มขึ้น/อ่อนลงจนผ่าน'),
    'cream-palette':     ('P3', 'พื้นครีม/เบจ → คงไว้ได้ถ้าเป็นของแบรนด์ ไม่ใช่เพราะเคยชิน'),
    'image-overlay':     ('P3', 'ทับรูปด้วยสีทึบเกือบเต็ม → ลดความทึบ หรือเอารูปออก'),
    'emoji-heading':     ('P2', 'อีโมจิในหัวข้อหรือแทนไอคอน → ใช้ชุดไอคอน SVG ชุดเดียว หรือไม่ใส่'),
    'bold-first-bullets': ('P3', 'ทุกข้อในรายการขึ้นต้นด้วยตัวหนา → เขียนเป็นร้อยแก้ว หรือรายการธรรมดา'),
    'framework-default': ('P3', 'สีตั้งต้นของ framework (indigo/violet ของ Tailwind/shadcn) → ตั้ง token สีแบรนด์เอง'),
    'stock-opener':      ('P2', 'ประโยคเปิดสำเร็จรูป → เปิดด้วยสิ่งที่สินค้านี้ทำได้คนเดียว พร้อมตัวเลข'),
}

PURPLE = re.compile(r'#(7c3aed|8b5cf6|a855f7|6366f1|9333ea|a78bfa|c084fc|4f46e5|7e22ce|6d28d9)\b|\b(purple|violet|indigo|fuchsia)\b', re.I)
BLUECYAN = re.compile(r'#(22d3ee|06b6d4|3b82f6|0ea5e9|60a5fa|38bdf8|2563eb|67e8f9|ec4899|db2777)\b|\b(cyan|blue|aqua|pink)\b', re.I)
BUZZ = re.compile(r'\b(supercharge\w*|world[- ]class|next[- ]gen(eration)?|enterprise[- ]grade|game[- ]chang\w+|cutting[- ]edge|revolutioni[sz]\w*|unleash\w*|seamless(ly)?|effortless(ly)?|elevate your|unlock the power|best[- ]in[- ]class)\b|ยกระดับ|ครบจบในที่เดียว|ล้ำสมัย|ปฏิวัติวงการ|ไร้รอยต่อ', re.I)
FORCED = re.compile(r'\bnot (just )?(a|an) [^.<>]{1,40}\.\s*(it\'s )?(a|an) [^.<>]{1,40}\.|ไม่ใช่แค่[^<>]{1,40}\s*แต่(คือ|เป็น)', re.I)
LOREM = re.compile(r'lorem ipsum|dolor sit amet|ข้อความตัวอย่าง', re.I)
PLACEHOLDER_IMG = re.compile(r'placeholder\.com|placehold\.co|placehold\.it|dummyimage|via\.placeholder|picsum\.photos', re.I)
EYEBROW = re.compile(r'class="[^"]*\b(eyebrow|kicker|overline|badge|pill|chip|tag-line)\b[^"]*"[^>]*>[^<]{0,40}</[a-z]+>\s*(<[^>]+>\s*){0,3}<h1\b', re.I | re.S)
ICON_TILE = re.compile(r'class="[^"]*\b(icon-(tile|box|wrap|bg|badge|circle)|feature-icon)\b[^"]*"[^>]*>.{0,300}?</(div|span)>\s*<h[2-4]\b', re.I | re.S)
NUMLABEL = re.compile(r'>\s*0[1-9]\s*<')
OPENER = re.compile(r"in today's (fast[- ]paced|digital|ever[- ]changing)|it'?s (important|worth) (to note|noting)|look no further|whether you'?re a|ในยุคดิจิทัล(ที่|ปัจจุบัน)|ในโลกที่เปลี่ยนแปลง(อย่าง)?รวดเร็ว", re.I)
EMOJI = re.compile('[\U0001F300-\U0001FAFF\u2600-\u27BF\u2B50\u2B06\u2934\u2935]')
TW = [(re.compile(r'\bbg-clip-text\b[^"\']*\btext-transparent\b|\btext-transparent\b[^"\']*\bbg-clip-text\b'), 'gradient-text'),
      (re.compile(r'\bfrom-(purple|violet|indigo|fuchsia)-\d+\b[^"\']*\bto-(blue|cyan|sky|pink)-\d+'), 'ai-palette'),
      (re.compile(r'\bbackdrop-blur(-\w+)?\b'), 'glassmorphism'),
      (re.compile(r'\banimate-ping\b'), 'pulsing-dot'),
      (re.compile(r'\banimate-bounce\b'), 'bounce-easing'),
      (re.compile(r'\b(bg|text|border|ring)-(indigo|violet)-(500|600)\b'), 'framework-default'),
      (re.compile(r'#6366f1\b', re.I), 'framework-default')]

def strip_comments(css):
    return re.sub(r'/\*.*?\*/', lambda m: '\n' * m.group(0).count('\n'), css, flags=re.S)

def blocks(css):
    """Yield (selector, body, line) for innermost rule blocks."""
    for m in re.finditer(r'([^{};]+)\{([^{}]*)\}', css):
        yield m.group(1).strip(), m.group(2), css.count('\n', 0, m.start(2)) + 1

def px(v):
    m = re.match(r'\s*(-?\d*\.?\d+)\s*(px|rem|em)?', v)
    if not m: return None
    n = float(m.group(1)); u = m.group(2) or 'px'
    return n * 16 if u in ('rem', 'em') else n

def prop(body, name):
    m = re.findall(r'(?:^|;|\s)' + re.escape(name) + r'\s*:\s*([^;]+)', body, re.I)
    return m[-1].strip() if m else None

def hex_rgb(h):
    h = h.lstrip('#')
    if len(h) == 3: h = ''.join(c * 2 for c in h)
    if len(h) != 6: return None
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def lum(rgb):
    def ch(c):
        c /= 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

TEXT_SEL = re.compile(r'(^|[\s,>])(body|p|li|article|main|\.(text|body|content|prose|desc\w*|copy|lead))\b', re.I)

def scan_css(css, out):
    css = strip_comments(css)
    for m in re.finditer(r'(-webkit-)?background-clip\s*:\s*text', css, re.I):
        out('gradient-text', css.count('\n', 0, m.start()) + 1)
    for m in re.finditer(r'repeating-(linear|radial)-gradient', css, re.I):
        out('stripes', css.count('\n', 0, m.start()) + 1)
    for m in re.finditer(r'@keyframes\s+([\w-]*(pulse|ping|glow|breath)[\w-]*)', css, re.I):
        if re.search(re.escape(m.group(1)) + r'[^;]*infinite', css): out('pulsing-dot', css.count('\n', 0, m.start()) + 1)
    for m in re.finditer(r'@keyframes\s+([\w-]*(blink|caret|cursor)[\w-]*)', css, re.I):
        out('blinking-cursor', css.count('\n', 0, m.start()) + 1)
    for m in re.finditer(r'@keyframes\s+([\w-]*(marquee|ticker|scroll-x|logos?-scroll)[\w-]*)', css, re.I):
        out('marquee', css.count('\n', 0, m.start()) + 1)
    for m in re.finditer(r'cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)', css):
        if float(m.group(2)) > 1 or float(m.group(4)) > 1 or float(m.group(2)) < 0 or float(m.group(4)) < 0:
            out('bounce-easing', css.count('\n', 0, m.start()) + 1)
    for m in re.finditer(r'@keyframes\s+[\w-]*(bounce|elastic|wobble|jello|rubber)', css, re.I):
        out('bounce-easing', css.count('\n', 0, m.start()) + 1)
    for sel, body, line in blocks(css):
        low = body.lower()
        bg = (prop(body, 'background') or '') + ' ' + (prop(body, 'background-image') or '')
        if 'linear-gradient' in bg and PURPLE.search(bg) and BLUECYAN.search(bg): out('ai-palette', line)
        if re.search(r'radial-gradient\([^;]*transparent', bg, re.I) and not re.search(r'\b(button|btn|input|icon)\b', sel, re.I):
            out('radial-halo', line)
        if re.search(r'backdrop-filter\s*:\s*[^;]*blur', low): out('glassmorphism', line)
        for sh in filter(None, [prop(body, 'box-shadow'), prop(body, 'text-shadow')]):
            g = re.search(r'\b0(px)?\s+0(px)?\s+(\d+)px(\s+\d+px)?\s+(#[0-9a-f]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|var\(--[\w-]*(accent|glow|neon|primary|brand)[\w-]*\))', sh, re.I)
            if g and int(g.group(3)) >= 12 and not re.search(r'rgba?\(\s*0\s*,\s*0\s*,\s*0', g.group(5)) and g.group(5).lower() not in ('#000', '#000000'):
                out('neon-glow', line)
        side = re.search(r'border-(left|inline-start)\s*:\s*(\d+)px\s+solid', low) or re.search(r'border-(left|inline-start)-width\s*:\s*(\d+)px', low)
        rad = prop(body, 'border-radius')
        if side and int(side.group(2)) >= 3 and rad and (px(rad) or 0) > 0: out('side-tab', line)
        bd = prop(body, 'border'); sh = prop(body, 'box-shadow') or ''
        blur = [int(x) for x in re.findall(r'\b\d+px\s+(\d+)px', sh)]
        if bd and re.match(r'\s*1px', bd) and blur and max(blur) >= 24: out('hairline-shadow', line)
        if rad and '%' not in rad:
            r = px(rad)
            if r and 28 <= r < 900 and not re.search(r'pill|chip|avatar|badge|btn|button|tag|toggle|switch|dot', sel, re.I): out('huge-radius', line)
        if bg.count('linear-gradient') >= 2 and re.search(r'1px', bg) and prop(body, 'background-size'): out('grid-bg', line)
        ff = prop(body, 'font-family')
        if ff and re.match(r'\s*["\']?(Inter|Geist)\b', ff, re.I): out('overused-font', line)
        fs = prop(body, 'font-size'); size = px(fs) if fs and 'clamp' not in fs and 'var(' not in fs else None
        if fs and 'clamp(' in fs:
            nums = [px(x) for x in re.findall(r'[\d.]+(?:px|rem)', fs)]
            size = max(n for n in nums if n) if any(nums) else None
        if prop(body, 'font-style') == 'italic' and ff and re.search(r'serif|playfair|instrument|fraunces|dm serif|cormorant|garamond', ff, re.I) and not re.search(r'sans', ff, re.I) and size and size >= 40:
            out('italic-serif-display', line)
        ls = prop(body, 'letter-spacing')
        if ls:
            v = re.match(r'\s*(-?[\d.]+)\s*(em|px|rem)?', ls)
            if v:
                n = float(v.group(1)); u = v.group(2) or 'px'
                em = n if u == 'em' else n / (size or 16)
                if em <= -0.04: out('crushed-tracking', line)
                if em >= 0.08 and 'uppercase' not in low and TEXT_SEL.search(sel): out('wide-body-tracking', line)
        if 'text-transform' in low and 'uppercase' in low and TEXT_SEL.search(sel) and not re.search(r'label|eyebrow|caption|tag|badge|th\b|nav', sel, re.I):
            out('all-caps-body', line)
        if re.search(r'text-align\s*:\s*justify', low): out('justified', line)
        lh = prop(body, 'line-height')
        if lh and TEXT_SEL.search(sel) and re.fullmatch(r'\s*[\d.]+\s*', lh) and float(lh) < 1.3: out('tight-leading', line)
        if size is not None and 0 < size < 11 and not re.search(r'sr-only|visually-hidden', sel, re.I): out('tiny-text', line)
        if re.search(r'transition\s*:\s*[^;]*\b(width|height|margin|padding|top|left|all)\b', low): out('layout-animation', line)
        if ':hover' in sel and re.search(r'\bimg\b|image|photo|thumb', sel, re.I) and re.search(r'transform\s*:\s*[^;]*(scale|rotate)', low):
            out('hover-zoom-image', line)
        col = prop(body, 'color'); bgc = prop(body, 'background-color') or (bg.strip() if re.fullmatch(r'\s*#[0-9a-fA-F]{3,6}\s*', bg) else None)
        if col and bgc:
            a, b = re.fullmatch(r'\s*(#[0-9a-fA-F]{3,6})\s*', col), re.fullmatch(r'\s*(#[0-9a-fA-F]{3,6})\s*', bgc)
            if a and b:
                ra, rb = hex_rgb(a.group(1)), hex_rgb(b.group(1))
                if ra and rb and contrast(ra, rb) < 4.5 and not (size and size >= 19): out('low-contrast', line)
        if bgc or re.search(r'(^|[\s,])(body|html|:root|main)\b', sel):
            for h in re.findall(r'#[0-9a-fA-F]{6}\b', (bgc or '') + ' ' + bg):
                r, g, b = hex_rgb(h)
                if r >= 0xF0 and g >= 0xE6 and 0xD0 <= b <= 0xEE and r - b >= 10 and re.search(r'(^|[\s,])(body|html|:root|main)\b', sel):
                    out('cream-palette', line); break
        if 'url(' in bg and re.search(r'gradient\([^;]*rgba\([^)]*,\s*0?\.(8[5-9]|9\d?)\s*\)', bg): out('image-overlay', line)

class Html(HTMLParser):
    def __init__(self, out):
        super().__init__(convert_charrefs=True)
        self.out = out; self.cards = []; self.stack = []; self.last_h = 0
        self.labels_for = set(); self.in_label = 0; self.inputs = []; self.text = []; self.skip = 0
        self.in_h = 0; self.lists = []; self.li_first = None
    def line(self): return self.getpos()[0]
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); cls = a.get('class') or a.get('classname') or ''
        if tag in ('script', 'style'): self.skip += 1
        is_card = bool(re.search(r'(^|\s)([\w-]*card)(\s|$)', cls)) and not re.search(r'card-(body|header|footer|title|text|img|content|actions|meta)', cls)
        if tag not in ('img', 'input', 'br', 'hr', 'meta', 'link', 'source'):
            if is_card and any(self.cards): self.out('nested-cards', self.line())
            self.stack.append(tag); self.cards.append(is_card)
        if tag in ('ul', 'ol'): self.lists.append([0, 0, self.line()])
        if tag == 'li' and self.lists: self.lists[-1][0] += 1; self.li_first = 'li'
        elif self.li_first == 'li':
            if tag in ('strong', 'b') and self.lists: self.lists[-1][1] += 1
            self.li_first = None
        if re.fullmatch(r'h[1-6]', tag):
            self.in_h += 1
            n = int(tag[1])
            if self.last_h and n > self.last_h + 1: self.out('skipped-heading', self.line())
            self.last_h = n
        if tag == 'img':
            src = (a.get('src') or '').strip()
            if (not src or src == '#' or PLACEHOLDER_IMG.search(src)) and not a.get('data-src') and not a.get('srcset'):
                self.out('broken-image', self.line())
        if tag == 'label':
            self.in_label += 1
            if a.get('for'): self.labels_for.add(a['for'])
        if tag in ('input', 'textarea') and (a.get('type') or 'text') not in ('hidden', 'submit', 'button', 'checkbox', 'radio', 'search', 'image', 'reset'):
            if a.get('placeholder') and not self.in_label and not a.get('aria-label') and not a.get('aria-labelledby'):
                self.inputs.append((a.get('id'), self.line()))
        if tag == 'marquee': self.out('marquee', self.line())
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.skip = max(0, self.skip - 1)
        if tag == 'label': self.in_label = max(0, self.in_label - 1)
        if re.fullmatch(r'h[1-6]', tag): self.in_h = max(0, self.in_h - 1)
        if tag in ('ul', 'ol') and self.lists:
            n, b, ln = self.lists.pop()
            if n >= 3 and b == n: self.out('bold-first-bullets', ln)
        if tag in self.stack:
            while self.stack:
                t = self.stack.pop(); self.cards.pop()
                if t == tag: break
    def handle_data(self, d):
        if d.strip(): self.li_first = None
        if not self.skip and d.strip():
            self.text.append((d, self.line()))
            if self.in_h and EMOJI.search(d): self.out('emoji-heading', self.line())
    def finish(self):
        for i, ln in self.inputs:
            if not i or i not in self.labels_for: self.out('placeholder-label', ln)
        for d, ln in self.text:
            if d.count('—') >= 2 or (d.count('—') >= 1 and len(d) < 60 and d.strip().count(' ') < 12 and d.count('—') * 80 > len(d)):
                if d.count('—') >= 2: self.out('em-dash-overuse', ln)
            if BUZZ.search(d): self.out('buzzword', ln)
            if FORCED.search(d): self.out('forced-contrast', ln)
            if re.search(r'\btheat(er|re)\b', d, re.I): self.out('theater', ln)
            if LOREM.search(d): self.out('lorem', ln)
            if OPENER.search(d): self.out('stock-opener', ln)

def scan_text(path, src):
    found = []; ok = {}
    for m in re.finditer(r'slop-ok:\s*([\w-]+)\s*([^*>]*)', src):
        ok[m.group(1)] = m.group(2).strip(' -') or '(ไม่ได้ให้เหตุผล)'
    def out(rule, line):
        found.append({'file': str(path), 'line': line, 'rule': rule, 'level': HINT[rule][0], 'hint': HINT[rule][1], 'kept': ok.get(rule)})
    ext = pathlib.Path(path).suffix.lower()
    if ext in ('.css', '.scss', '.less'):
        scan_css(src, out)
    else:
        for m in re.finditer(r'(<style[^>]*>)(.*?)</style>', src, re.S | re.I):
            off = src.count('\n', 0, m.start(2))
            scan_css(m.group(2), lambda r, l, off=off: out(r, l + off))
        for m in re.finditer(r'style="([^"]*)"', src):
            ln = src.count('\n', 0, m.start()) + 1
            scan_css('x{' + m.group(1) + '}', lambda r, l, ln=ln: out(r, ln))
        for pat, rule in ((EYEBROW, 'eyebrow-badge'), (ICON_TILE, 'icon-tile')):
            for m in pat.finditer(src): out(rule, src.count('\n', 0, m.start()) + 1)
        for pat, rule in TW:
            for m in pat.finditer(src): out(rule, src.count('\n', 0, m.start()) + 1)
        nums = list(NUMLABEL.finditer(src))
        if len(nums) >= 3: out('numbered-labels', src.count('\n', 0, nums[0].start()) + 1)
        p = Html(out)
        try:
            p.feed(re.sub(r'\{[^{}]*\}', ' ', src) if ext in ('.jsx', '.tsx') else src); p.close(); p.finish()
        except Exception:
            pass
        if re.search(r'fonts\.googleapis\.com/css2?\?family=(Inter|Geist)\b', src): out('overused-font', 1)
    seen = set(); uniq = []
    for f in found:
        k = (f['line'], f['rule'])
        if k not in seen: seen.add(k); uniq.append(f)
    return uniq

def files(paths):
    for p in map(pathlib.Path, paths):
        if p.is_file(): yield p
        elif p.is_dir():
            for f in sorted(p.rglob('*')):
                if f.suffix.lower() in EXTS and not (set(f.parts) & SKIP_DIRS) and '.min.' not in f.name: yield f

def report(found, as_json, min_level):
    found = [f for f in found if LEVELS.index(f['level']) <= LEVELS.index(min_level)]
    found.sort(key=lambda f: (LEVELS.index(f['level']), f['file'], f['line']))
    if as_json:
        print(json.dumps(found, ensure_ascii=False, indent=2)); return found
    if not found:
        print('ไม่พบสัญญาณ AI slop หรือปัญหาพื้นฐาน · ยังต้องดูด้วยตา (ข้อที่ตรวจจากโค้ดไม่ได้อยู่ใน references/catalog.md)'); return found
    print('| ระดับ | ไฟล์:บรรทัด | กฎ | แก้ยังไง |\n|---|---|---|---|')
    for f in found:
        hint = f['hint'] + (f" · **ตั้งใจ:** {f['kept']}" if f['kept'] else '')
        print(f"| {f['level']} | {f['file']}:{f['line']} | `{f['rule']}` | {hint} |")
    c = {l: sum(1 for f in found if f['level'] == l and not f['kept']) for l in LEVELS}
    print(f"\nรวม P0 {c['P0']} · P1 {c['P1']} · P2 {c['P2']} · P3 {c['P3']} (ไม่นับข้อที่ระบุว่าตั้งใจ)")
    return found

BAD = {
    'bad.css': '''
.title{background:linear-gradient(90deg,#7c3aed,#22d3ee);-webkit-background-clip:text;color:transparent}
.hero{background:radial-gradient(60% 60% at 50% 0,rgba(124,58,237,.4),transparent 70%)}
.glass{backdrop-filter:blur(12px)}
.neon{box-shadow:0 0 24px #22d3ee}
.card{border-left:4px solid #7c3aed;border-radius:12px}
.ghost{border:1px solid #eee;box-shadow:0 12px 48px rgba(0,0,0,.08)}
.blob{border-radius:44px}
.grid{background-image:linear-gradient(#eee 1px,transparent 1px),linear-gradient(90deg,#eee 1px,transparent 1px);background-size:24px 24px}
.st{background:repeating-linear-gradient(45deg,#eee 0 2px,transparent 2px 8px)}
body{font-family:Inter,sans-serif;background:#faf6ee}
.display{font-family:"Playfair Display",serif;font-style:italic;font-size:72px}
.tight{letter-spacing:-0.06em}
p{letter-spacing:.12em;line-height:1.1;text-align:justify}
.text{text-transform:uppercase}
.fine{font-size:9px}
@keyframes pulse{50%{opacity:.4}} .dot{animation:pulse 2s infinite}
@keyframes blink{50%{opacity:0}}
@keyframes marquee{to{transform:translateX(-50%)}}
.modal{transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.grow{transition:width .3s}
.thumb img:hover{transform:scale(1.1)}
.muted{color:#aaaaaa;background-color:#ffffff}
.photo{background:linear-gradient(rgba(0,0,0,.94),rgba(0,0,0,.94)),url(a.jpg)}
''',
    'bad.html': '''<html><body>
<span class="eyebrow">Introducing</span>
<h1>Supercharge your workflow</h1>
<h3>Skipped</h3>
<div class="feature"><div class="icon-tile">✦</div><h3>Automate</h3></div>
<span>01</span><span>02</span><span>03</span>
<div class="card"><div class="card">inner</div></div>
<img src="">
<img src="https://via.placeholder.com/300">
<input placeholder="Email">
<p>It works — really well — for teams.</p>
<p>Not a feature. A platform.</p>
<p>We killed the growth theater.</p>
<p>Lorem ipsum dolor sit amet</p>
<h2>🚀 Features</h2>
<ul><li><strong>Fast</strong> loads</li><li><strong>Safe</strong> data</li><li><strong>Easy</strong> setup</li></ul>
<p>In today's fast-paced world, teams need more.</p>
<button class="bg-indigo-600 text-white">Go</button>
</body></html>''',
}
GOOD = {
    'good.css': '''
body{font-family:"IBM Plex Sans Thai",sans-serif;color:#1a1a1a;background-color:#ffffff;line-height:1.6}
.card{border:1px solid #e5e5e5;border-radius:8px;padding:16px}
.btn{transition:background-color .15s ease-out;border-radius:999px}
.label{font-size:12px;letter-spacing:.06em;text-transform:uppercase}
h1{font-size:32px;letter-spacing:-0.02em}
''',
    'good.html': '''<html><body><h1>ส่งใบเสนอราคาภายใน 2 นาที</h1><h2>ขั้นตอน</h2>
<label for="e">อีเมล</label><input id="e" placeholder="name@company.co.th">
<label>ชื่อ <input placeholder="สมชาย"></label>
<img src="hero.webp" alt="ทีมงาน"><p>กรอกชื่อลูกค้า เลือกสินค้า แล้วกดส่ง</p></body></html>''',
    'kept.css': '/* slop-ok: glassmorphism แถบบนเลื่อนทับเนื้อหาจริง */\n.topbar{backdrop-filter:blur(8px)}',
}

def self_test():
    got = set()
    for name, src in BAD.items(): got |= {f['rule'] for f in scan_text(name, src)}
    missing = sorted(set(HINT) - got)
    false = [f for n, s in GOOD.items() if n != 'kept.css' for f in scan_text(n, s)]
    kept = scan_text('kept.css', GOOD['kept.css'])
    ok = not missing and not false and kept and all(f['kept'] for f in kept)
    print(f"กฎทั้งหมด {len(HINT)} · จับได้ {len(got & set(HINT))}")
    if missing: print('ไม่ยิง:', ', '.join(missing))
    for f in false: print('จับผิด (ไฟล์ดี):', f['file'], f['line'], f['rule'])
    if not (kept and all(f['kept'] for f in kept)): print('slop-ok ไม่ทำงาน')
    print('self-test ผ่าน' if ok else 'self-test ล้ม')
    return 0 if ok else 1

def main():
    if hasattr(sys.stdout, 'reconfigure'): sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser(description='Scan UI source for AI-slop tells')
    ap.add_argument('paths', nargs='*'); ap.add_argument('--json', action='store_true')
    ap.add_argument('--min', default='P3', choices=LEVELS); ap.add_argument('--self-test', action='store_true')
    a = ap.parse_args()
    if a.self_test: return self_test()
    if not a.paths: ap.error('ใส่ path ของไฟล์หรือโฟลเดอร์')
    fl = list(files(a.paths))
    if not fl:
        print('ไม่พบไฟล์ UI ให้ตรวจ (ตรวจ 0 ไฟล์ = ผิด ไม่ใช่ผ่าน) · ดู path อีกครั้ง'); return 2
    found = []
    for f in fl:
        found += scan_text(f, f.read_text(encoding='utf-8', errors='replace'))
    shown = report(found, a.json, a.min)
    if not a.json: print(f'ตรวจ {len(fl)} ไฟล์')
    return 1 if any(f['level'] in ('P0', 'P1') and not f['kept'] for f in shown) else 0

if __name__ == '__main__':
    sys.exit(main())
