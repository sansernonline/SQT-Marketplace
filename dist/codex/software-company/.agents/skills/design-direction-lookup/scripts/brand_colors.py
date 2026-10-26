#!/usr/bin/env python3
"""ดูสีแบรนด์จากเว็บธุรกิจจริงในวงการ แล้วสร้างพาเลตใหม่ให้ design_draft.py ใช้

อ่านแค่ HTML หน้าแรกและ CSS ที่หน้านั้นลิงก์ไว้ (ไม่เกิน 5 ไฟล์) · ไม่รัน JavaScript จากหน้าเว็บ
หน้าที่ต้องรัน JavaScript ก่อนถึงจะมีเนื้อ ตัวนี้บอกว่าดึงไม่ได้ ไม่เดาสี

  python brand_colors.py https://a.co.th https://b.com [--json]
  python brand_colors.py https://a.co.th https://b.com --palette web-dental > _to_delete/web-dental.csv
  python brand_colors.py --self-test
Python stdlib เท่านั้น
"""
import argparse
import colorsys
import csv
import datetime
import http.client
import ipaddress
import json
import re
import socket
import sys
import time
import urllib.request
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))
from brand_palette import build_palette, common_colors  # noqa: E402
from check_data import COLUMNS, Report, check_palettes  # noqa: E402
from design_draft import color_distance, contrast, palette_problems, rgb  # noqa: E402

USER_AGENT = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
              'Chrome/130.0 Safari/537.36')
TIMEOUT_SECONDS = 10  # ต่อการรอแต่ละครั้ง
TOTAL_SECONDS_PER_FILE = 20
MAX_BYTES = 2 * 1024 * 1024
READ_CHUNK_BYTES = 64 * 1024
MAX_CSS_CHARS = 300_000  # เพดาน CSS ที่ส่งเข้า regex · สีหลักของเว็บอยู่ในช่วงต้นเกือบทุกครั้ง
MAX_STYLESHEETS = 5
SAME_COLOR_DISTANCE = 24  # ระยะ RGB ที่ถือว่าเป็นสีเดียวกันในเว็บเดียว
TOP_BRAND_COLORS = 4
WEIGHT_BRAND_VARIABLE = 10
WEIGHT_THEME_COLOR = 6
WEIGHT_PROPERTY = 1
MIN_TEXT_CHARS = 200  # ตัวอักษรน้อยกว่านี้และไม่มีสี = หน้าที่ต้องรัน JavaScript ก่อนถึงจะมีเนื้อ
BRAND_VARIABLE = re.compile(r'^--(?:[\w-]*-)?(primary|brand|accent|main|theme|secondary|highlight)\b', re.I)
# ตัวแปรที่ชื่อมีคำแบรนด์แต่ไม่ใช่สีแบรนด์: ของ library (Bootstrap · Swiper · WordPress · Tailwind) และสีสถานะ
NOT_BRAND_VARIABLE = re.compile(r'^--(bs|swiper|wp|tw)-|error|danger|success|warning|info', re.I)
COLOR_PROPERTY = re.compile(r'^(background|color$|border|fill$|stroke$|outline)', re.I)
# ชื่อ property จำกัด 60 ตัว · ไม่จำกัดแล้วคำยาวที่ไม่มี : ทำให้ regex ช้าแบบกำลังสอง (40,000 ตัวใช้ 15 วินาที)
DECLARATION = re.compile(r'([-\w]{1,60})\s*:\s*([^;{}]+)')
COLOR_VALUE = re.compile(r'#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)', re.I)
VARIABLE_USE = re.compile(r'var\(\s*(--[\w-]+)[^)]*\)')
CSS_COMMENT = re.compile(r'/\*.*?(?:\*/|\Z)', re.S)  # คอมเมนต์ไม่ปิดกินถึงท้ายครั้งเดียว
FETCH_ERRORS = (OSError, ValueError, http.client.HTTPException)
# สีตั้งต้นที่ library ใส่มาให้ทุกเว็บ ไม่ใช่สีที่ธุรกิจเลือก · Bootstrap 4–5 · Swiper · ชุดสีของ WordPress core
LIBRARY_DEFAULT_COLORS = set('''
#0D6EFD #6EA8FE #9EC5FE #CFE2FF #031633 #6610F2 #6F42C1 #D63384 #DC3545 #FD7E14 #FFC107 #198754 #20C997 #0DCAF0
#007BFF #28A745 #17A2B8 #007AFF
#CF2E2E #FF6900 #FCB900 #7BDCB5 #00D084 #8ED1FC #0693E3 #ABB8C3 #EB144C #F78DA7 #9B51E0
'''.split())


def check_url(url):
    """รับเฉพาะ http/https · กันไม่ให้หน้าเว็บพาไปอ่านไฟล์ในเครื่อง"""
    parts = urlparse(url)
    if parts.scheme not in ('http', 'https') or not parts.hostname:
        raise ValueError(f'รับเฉพาะ http หรือ https: {url}')
    public_ip(parts.hostname)


def public_ip(host):
    """IP ที่จะเชื่อมต่อจริง · ทุก IP ของชื่อนี้ต้องเป็นที่อยู่สาธารณะ กันการพาไปเครือข่ายภายใน"""
    addresses = [info[4][0] for info in socket.getaddrinfo(host, None)]
    if not addresses or not all(ipaddress.ip_address(a).is_global for a in addresses):
        raise ValueError(f'ไม่ดึงที่อยู่ในเครือข่ายภายใน: {host}')
    return addresses[0]


# เชื่อมต่อด้วย IP ที่ตรวจแล้ว ไม่ให้ urllib แปลงชื่อใหม่ตอนเชื่อมต่อ (กัน DNS rebinding) · HTTPS ยังตรวจใบรับรองกับชื่อโดเมน
class PinnedHTTPConnection(http.client.HTTPConnection):
    def connect(self):
        self.sock = socket.create_connection((public_ip(self.host), self.port), self.timeout)


class PinnedHTTPSConnection(http.client.HTTPSConnection):
    def connect(self):
        sock = socket.create_connection((public_ip(self.host), self.port), self.timeout)
        self.sock = self._context.wrap_socket(sock, server_hostname=self.host)


class PinnedHTTPHandler(urllib.request.HTTPHandler):
    def http_open(self, req):
        return self.do_open(PinnedHTTPConnection, req)


class PinnedHTTPSHandler(urllib.request.HTTPSHandler):
    def https_open(self, req):
        return self.do_open(PinnedHTTPSConnection, req)


class CheckedRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        check_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


# ProxyHandler({}) ปิด proxy ของเครื่อง เพราะผ่าน proxy แล้วตรวจ IP ปลายทางไม่ได้
OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}), PinnedHTTPHandler, PinnedHTTPSHandler,
                                     CheckedRedirect)


def fetch_text(url):
    check_url(url)
    request = urllib.request.Request(url, headers={'User-Agent': USER_AGENT, 'Accept-Language': 'th,en;q=0.8'})
    deadline = time.monotonic() + TOTAL_SECONDS_PER_FILE
    with OPENER.open(request, timeout=TIMEOUT_SECONDS) as response:
        charset = response.headers.get_content_charset() or 'utf-8'
        body = read_until(response, deadline)
    try:
        return body.decode(charset, errors='replace')
    except LookupError:
        return body.decode('utf-8', errors='replace')


def read_until(response, deadline):
    """อ่านทีละก้อนจนครบ 2 MB หรือหมดไฟล์ · เกินเวลารวมต่อไฟล์ → TimeoutError (เว็บที่ส่งช้าทีละนิดจะไม่ค้าง)"""
    chunks, size = [], 0
    while size < MAX_BYTES:  # simple: ตัดที่ 2 MB · CSS ส่วนที่เกินมักไม่ใช่สีหลัก
        if time.monotonic() > deadline:
            raise TimeoutError(f'อ่านเกิน {TOTAL_SECONDS_PER_FILE} วินาที')
        chunk = response.read(min(READ_CHUNK_BYTES, MAX_BYTES - size))
        if not chunk:
            break
        chunks.append(chunk)
        size += len(chunk)
    return b''.join(chunks)


class PageParser(HTMLParser):
    """เก็บ theme-color · ลิงก์ CSS · CSS ในหน้า · จำนวนตัวอักษรที่คนเห็น"""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.theme_colors, self.stylesheets, self.css = [], [], []
        self.text_chars = 0
        self.inside = None

    def handle_starttag(self, tag, attrs):
        a = {k: v or '' for k, v in attrs}
        if tag == 'meta' and a.get('name', '').lower() == 'theme-color':
            self.theme_colors.append(a.get('content', ''))
        elif tag == 'link' and 'stylesheet' in a.get('rel', '').lower() and a.get('href'):
            self.stylesheets.append(a['href'])
        if a.get('style'):
            self.css.append(f'x{{{a["style"]}}}')
        if tag in ('style', 'script', 'noscript'):
            self.inside = tag

    def handle_endtag(self, tag):
        if tag == self.inside:
            self.inside = None

    def handle_data(self, data):
        if self.inside == 'style':
            self.css.append(data)
        elif self.inside is None:
            self.text_chars += len(data.strip())


def parse_color(text):
    """'#abc' · 'rgb(1 2 3)' · 'hsl(10, 50%, 40%)' → '#RRGGBB' · โปร่งใสหรืออ่านไม่ออกคืน None"""
    text = text.strip().lower()
    if text.startswith('#'):
        digits = text[1:]
        if len(digits) in (3, 4):
            digits = ''.join(c * 2 for c in digits)
        if len(digits) not in (6, 8) or digits[6:] == '00':
            return None
        return '#' + digits[:6].upper()
    numbers = re.findall(r'[\d.]+%?', text)
    if len(numbers) < 3 or (len(numbers) > 3 and float(numbers[3].rstrip('%')) == 0):
        return None
    values = [float(n.rstrip('%')) for n in numbers[:3]]
    if text.startswith('hsl'):
        r, g, b = colorsys.hls_to_rgb(values[0] % 360 / 360, values[2] / 100, values[1] / 100)
        channels = [r * 255, g * 255, b * 255]
    else:
        channels = [v * 2.55 if n.endswith('%') else v for v, n in zip(values, numbers)]
    return '#' + ''.join(f'{min(255, round(c)):02X}' for c in channels)


def is_neutral(hex_color):
    """เกือบขาว เกือบดำ หรือเทาที่ความอิ่มสีต่ำ · ไม่นับเป็นสีแบรนด์"""
    _, lightness, saturation = colorsys.rgb_to_hls(*(c / 255 for c in rgb(hex_color)))
    return lightness > 0.93 or lightness < 0.15 or saturation < 0.15


def resolve_variables(value, variables):
    return VARIABLE_USE.sub(lambda m: variables.get(m.group(1).lower(), ''), value)


def merge_votes(votes):
    """รวมสีที่ระยะ RGB < 24 เข้าสีที่หนักกว่า · คืนเรียงจากหนักไปเบา"""
    by_hex = {}
    for hex_color, weight, source in votes:
        entry = by_hex.setdefault(hex_color, {'hex': hex_color, 'weight': 0, 'sources': Counter()})
        entry['weight'] += weight
        entry['sources'][source] += weight
    merged = []
    for entry in sorted(by_hex.values(), key=lambda e: -e['weight']):
        home = next((m for m in merged if color_distance(m['hex'], entry['hex']) < SAME_COLOR_DISTANCE), None)
        if home is None:
            merged.append(entry)
        else:
            home['weight'] += entry['weight']
            home['sources'].update(entry['sources'])
    return sorted(merged, key=lambda e: -e['weight'])


def tally_colors(css, theme_colors):
    votes = [(c, WEIGHT_THEME_COLOR, 'theme-color') for c in map(parse_color, theme_colors) if c]
    declarations = DECLARATION.findall(CSS_COMMENT.sub('', css[:MAX_CSS_CHARS]))
    variables = {name.lower(): value for name, value in declarations if name.startswith('--')}
    backgrounds, texts = Counter(), Counter()
    for name, value in declarations:
        name = name.lower()
        if BRAND_VARIABLE.match(name) and not NOT_BRAND_VARIABLE.search(name):
            weight, source = WEIGHT_BRAND_VARIABLE, f'ตัวแปร {name}'
        elif COLOR_PROPERTY.match(name):
            weight, source = WEIGHT_PROPERTY, 'ความถี่'
        else:
            continue
        for color in filter(None, map(parse_color, COLOR_VALUE.findall(resolve_variables(value, variables)))):
            if color in LIBRARY_DEFAULT_COLORS:
                continue
            if not is_neutral(color):
                votes.append((color, weight, source))
            elif name.startswith('background'):
                backgrounds[color] += 1
            elif name == 'color':
                texts[color] += 1
    brand = [{'hex': e['hex'], 'weight': e['weight'], 'sources': dict(e['sources'])}
             for e in merge_votes(votes)[:TOP_BRAND_COLORS]]
    background = backgrounds.most_common(1)[0][0] if backgrounds else None
    # สีขาวบนปุ่มก็นับเป็น color จึงเลือกสีที่อ่านออกบนพื้นที่พบ ไม่ใช่แค่สีที่พบบ่อยสุด
    readable = [c for c, _ in texts.most_common() if not background or contrast(c, background) >= 4.5]
    return {'brand': brand, 'background': background, 'text': (readable or [None])[0]}


def analyze_site(url, fetch, fetched_on):
    """ผลของเว็บเดียว · ดึงไม่ได้หรือไม่มีสีแบรนด์ ใส่เหตุใน problem และ brand ว่าง"""
    site = {'url': url, 'host': urlparse(url).hostname or url, 'fetched_on': fetched_on, 'stylesheets': 0,
            'brand': [], 'background': None, 'text': None, 'problem': None}
    page = PageParser()
    try:
        page.feed(fetch(url))
    except FETCH_ERRORS as error:
        site['problem'] = f'ดึงหน้าไม่ได้: {error}'
        return site
    css = list(page.css)
    for href in page.stylesheets[:MAX_STYLESHEETS]:
        try:
            css.append(fetch(urljoin(url, href)))
            site['stylesheets'] += 1
        except FETCH_ERRORS:
            continue  # CSS บางไฟล์ดึงไม่ได้ ยังใช้ไฟล์ที่เหลือได้
    site.update(tally_colors('\n'.join(css), page.theme_colors))
    if not site['brand']:
        site['problem'] = ('หน้าเว็บส่ง HTML เกือบเปล่า ต้องรัน JavaScript ก่อนถึงจะมีเนื้อและสี จึงดึงสีไม่ได้'
                           if page.text_chars < MIN_TEXT_CHARS else 'ไม่พบสีแบรนด์ใน HTML และ CSS ที่ดึงได้')
    return site


def format_site(site):
    lines = [f'{site["url"]} (ดึง {site["fetched_on"]} · CSS {site["stylesheets"]} ไฟล์)']
    if site['problem']:
        return '\n'.join(lines + [f'  ดึงไม่ได้: {site["problem"]}'])
    for i, color in enumerate(site['brand'], 1):
        sources = ', '.join(f'{s} {w}' if s == 'ความถี่' else s for s, w in color['sources'].items())
        lines.append(f'  {i}. {color["hex"]} น้ำหนัก {color["weight"]} · {sources}')
    lines.append(f'  พื้น {site["background"] or "-"} · ตัวอักษร {site["text"] or "-"}')
    return '\n'.join(lines)


def write_palette_csv(rows, stream):
    writer = csv.DictWriter(stream, fieldnames=COLUMNS['palettes.csv'], lineterminator='\n')
    writer.writeheader()
    writer.writerows(rows)


SAMPLE_HTML = '''<!doctype html><html><head>
<meta name="theme-color" content="#0E7C86">
<link rel="stylesheet" href="/main.css">
<style>:root{--primary:#B5462A;--text-dark:#1a1a1a}
body{background:#ffffff;color:#222222} .btn{background:var(--primary)} .tag{color:#B8482C}
.line{border-color:#cccccc} p{color:#777777} h1{color:#222222}
.lib{--bs-primary:#2A6FB0;--button-primary-error-bg:#C0392B}
.b1{color:#ffffff} .b2{color:#fff} .b3{color:#FFF} .swiper{color:#007AFF}</style>
</head><body><h1>คลินิกทันตกรรมตัวอย่าง</h1><p>''' + 'ข้อความเนื้อหาของหน้า ' * 20 + '''</p></body></html>'''
SAMPLE_CSS = '.card{background:#F4F1EA;border:1px solid #2F6B4F} a{color:#2F6B4F} a:hover{color:rgb(47 107 79)}'
SECOND_HTML = ('<html><head><style>:root{--brand-color:hsl(166, 56%, 28%)} .hero{background:#E3A33B}</style></head>'
               '<body><p>' + 'ร้านกาแฟตัวอย่าง ' * 30 + '</p></body></html>')
EMPTY_HTML = ('<html><head><title>app</title></head>'
              '<body><div id="root"></div><script src="/app.js"></script></body></html>')


class SlowResponse:
    """ส่งทีละ 1 ไบต์ทุก 10 มิลลิวินาทีไม่มีที่สิ้นสุด แบบเว็บที่ลากเวลา"""

    def __init__(self):
        self.reads = 0

    def read(self, _size):
        self.reads += 1
        time.sleep(0.01)
        return b'x'


def self_test():
    pages = {'https://a.test/': SAMPLE_HTML, 'https://a.test/main.css': SAMPLE_CSS,
             'https://b.test/': SECOND_HTML, 'https://c.test/': EMPTY_HTML}

    def fake_fetch(url):
        if url not in pages:
            raise OSError(f'ไม่มีหน้า {url}')
        return pages[url]

    checks = []

    def check(name, ok):
        checks.append((name, bool(ok)))

    today = '2026-10-26'
    a, b, empty = (analyze_site(u, fake_fetch, today) for u in ('https://a.test/', 'https://b.test/', 'https://c.test/'))
    hexes = [c['hex'] for c in a['brand']]
    check('อ่านสีได้หลายแบบ', parse_color('rgb(181 70 42)') == '#B5462A' and parse_color('#abc') == '#AABBCC'
          and parse_color('hsl(0, 100%, 50%)') == '#FF0000' and parse_color('rgba(0,0,0,0)') is None)
    check('จับ theme-color', any('theme-color' in c['sources'] for c in a['brand']) and '#0E7C86' in hexes)
    check('ตัวแปร --primary น้ำหนักสูงสุด', hexes[:1] == ['#B5462A'] and 'ตัวแปร --primary' in a['brand'][0]['sources'])
    check('ตัดขาว ดำ เทา ออกจากสีแบรนด์', not {'#FFFFFF', '#222222', '#CCCCCC', '#777777', '#1A1A1A'} & set(hexes))
    check('จดสีพื้นและสีตัวอักษรที่อ่านออกบนพื้นแยก', a['background'] == '#FFFFFF' and a['text'] == '#222222')
    check('ตัดสีตั้งต้นและตัวแปรของ library และสีสถานะ', not {'#007AFF', '#2A6FB0', '#C0392B'} & set(hexes))
    check('รวมสีที่ใกล้กัน', '#B8482C' not in hexes and 'ความถี่' in a['brand'][0]['sources'])
    check('อ่าน CSS ที่ลิงก์ไว้', a['stylesheets'] == 1 and '#2F6B4F' in hexes)
    check('หน้า HTML เปล่าบอกว่าดึงไม่ได้', not empty['brand'] and 'JavaScript' in (empty['problem'] or ''))
    check('วันที่ดึงอยู่ในผล', a['fetched_on'] == today and today in format_site(a))
    refused = []
    for url in ('file:///etc/passwd', 'ftp://a.test/x', 'javascript:alert(1)', 'http://127.0.0.1/'):
        try:
            check_url(url)
        except ValueError:
            refused.append(url)
    check('ไม่รับ scheme อื่นและที่อยู่ภายใน', len(refused) == 4)
    rows = build_palette('web-test', [a, b, empty], today)
    modes = {r['mode']: r for r in rows}
    report = Report()
    check_palettes([{**r, '_where': 'test'} for r in rows], report)
    check('พาเลตที่สร้างผ่าน palette_problems และ check_data', not palette_problems(modes) and not report.errors)
    check('ไม่คัดลอกสีแบรนด์ตรง ๆ', modes['light']['primary'] not in hexes and modes['dark']['primary'] not in hexes)
    check('notes_th บอกเว็บและวันที่', 'a.test' in rows[0]['notes_th'] and today in rows[0]['notes_th']
          and 'เลื่อนเฉด' in rows[0]['notes_th'])
    started = time.monotonic()
    tally_colors('a' * 40_000 + '/*' * 20_000 + ' x' * 400_000, [])
    check('CSS ยาวผิดรูปใช้เวลาไม่เกิน 1 วินาที', time.monotonic() - started < 1)
    slow = SlowResponse()
    try:
        read_until(slow, time.monotonic() + 0.05)
        timed_out = False
    except TimeoutError:
        timed_out = True
    check('อ่านช้าเกินเวลารวมต่อไฟล์ถูกตัด', timed_out and slow.reads < 50)
    check('สีอ่อนมากไม่ถูกใช้เป็นสีปุ่ม', common_colors([{'host': 'x', 'brand': [{'hex': '#D8DFFD', 'weight': 5}]}]) == [])
    for name, ok in checks:
        print(('ผ่าน     ' if ok else 'ไม่ผ่าน  ') + name)
    failed = [n for n, ok in checks if not ok]
    print(f'self-test: {len(checks) - len(failed)}/{len(checks)} ผ่าน')
    return not failed


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('urls', nargs='*', help='หน้าแรกของเว็บธุรกิจจริง (http/https)')
    ap.add_argument('--json', action='store_true', help='พิมพ์ผลเป็น JSON')
    ap.add_argument('--palette', metavar='ID', help='สร้างพาเลต 2 แถวเป็น CSV (ผลต่อเว็บย้ายไป stderr)')
    ap.add_argument('--self-test', action='store_true')
    args = ap.parse_args()
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding='utf-8')
    if args.self_test:
        sys.exit(0 if self_test() else 1)
    if not args.urls:
        ap.error('ใส่ URL อย่างน้อย 1 เว็บ หรือ --self-test')
    fetched_on = datetime.date.today().isoformat()
    sites = [analyze_site(url, fetch_text, fetched_on) for url in args.urls]
    report_stream = sys.stderr if args.palette else sys.stdout
    if args.json:
        print(json.dumps(sites, ensure_ascii=False, indent=2), file=report_stream)
    else:
        print('\n\n'.join(format_site(s) for s in sites), file=report_stream)
    if args.palette:
        write_palette_csv(build_palette(args.palette, sites, fetched_on), sys.stdout)


if __name__ == '__main__':
    main()
