#!/usr/bin/env python3
"""ค้นข้อมูลออกแบบ (อุตสาหกรรม · พาเลต · ฟอนต์ · look · กฎ UX · กราฟ · landing · stack) ด้วยคำไทยหรืออังกฤษ

BM25 เขียนเอง · ตัดคำไทยด้วยพจนานุกรมจากคอลัมน์ keywords ของทุกไฟล์ (เลือกคำยาวสุดก่อน)
ตัวอักษรไทยที่ไม่อยู่ในพจนานุกรมแตกเป็นคู่ตัวอักษร (bigram) · คำค้นขยายด้วยตารางคำพ้องไทย-อังกฤษ
คะแนนหรือความครอบคลุมต่ำเกินไป → ตอบว่าไม่พบที่ตรง ไม่เดา · Python stdlib ล้วน

  python design_search.py "ร้านทองออนไลน์" --domain industry
  python design_search.py "date picker" --domain ux -n 5 --json
  python design_search.py "ฟอร์ม" --domain stack --stack blazor
  python design_search.py --eval ../references/relevance-cases.json
  python design_search.py --self-test
"""
import argparse
import csv
import json
import math
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA_DIR = HERE.parent / 'data'
FIXTURES = HERE / 'fixtures'

# domain → (ไฟล์, คอลัมน์น้ำหนัก 2, คอลัมน์น้ำหนัก 1, คอลัมน์ที่แสดง)
DOMAINS = {
    'industry': ('industries.csv', ['name_th', 'name_en', 'keywords_th', 'keywords_en'], ['personality'], ['name_th', 'name_en']),
    'palette': ('palettes.csv', ['name_th', 'keywords'], ['notes_th'], ['name_th', 'primary', 'accent']),
    'font': ('font-pairs.csv', ['heading', 'body', 'keywords'], ['thai_style', 'notes_th'], ['heading', 'body', 'thai_style']),
    'look': ('looks.csv', ['name_th', 'name_en', 'keywords'], ['depth', 'density'], ['name_th', 'name_en']),
    'ux': ('ux-rules.csv', ['keywords_th', 'keywords_en', 'category'], ['rule_th', 'platform'], ['category', 'rule_th']),
    'chart': ('charts.csv', ['keywords', 'data_shape', 'goal'], ['chart', 'thai_notes'], ['goal', 'chart']),
    'landing': ('landing.csv', ['goal_th', 'keywords'], ['sections', 'cta_th'], ['goal_th', 'sections']),
    'stack': (None, ['topic', 'keywords'], ['rule_th', 'do'], ['topic', 'rule_th']),
}
KEYWORD_COLUMNS = {'keywords', 'keywords_th', 'keywords_en', 'name_th', 'topic', 'category', 'goal_th',
                   'data_shape', 'goal', 'thai_style'}

# กลุ่มคำพ้อง ไทย ↔ อังกฤษ · คำในกลุ่มเดียวกันขยายหากัน (น้ำหนักต่ำกว่าคำที่พิมพ์มา)
SYNONYM_GROUPS = [
    'ร้านทอง|ทอง|ทองคำ|gold|jewelry|jewellery', 'เครื่องประดับ|jewelry|jewellery',
    'ร้านกาแฟ|คาเฟ่|กาแฟ|cafe|coffee', 'ร้านอาหาร|อาหาร|restaurant|food', 'เบเกอรี่|ขนม|bakery|dessert',
    'คลินิก|clinic', 'ทันตกรรม|ทำฟัน|ฟัน|dental|dentist', 'โรงพยาบาล|hospital', 'สุขภาพ|health|healthcare',
    'ร้านยา|ยา|pharmacy|drugstore', 'ความงาม|บิวตี้|beauty|cosmetics', 'สปา|นวด|spa|massage',
    'ฟิตเนส|ยิม|fitness|gym', 'สัตว์เลี้ยง|pet', 'ธนาคาร|bank|banking', 'การเงิน|finance|fintech',
    'ประกัน|insurance', 'สหกรณ์|cooperative', 'ราชการ|รัฐ|หน่วยงานรัฐ|government|public', 'อสังหา|คอนโด|บ้าน|property|realestate',
    'โรงแรม|ที่พัก|hotel|resort', 'ท่องเที่ยว|ทัวร์|travel|tour', 'การศึกษา|โรงเรียน|คอร์ส|เรียน|education|school|course',
    'เด็ก|kids|children', 'เกม|game|gaming', 'แฟชั่น|เสื้อผ้า|fashion|apparel', 'ดอกไม้|florist|flower',
    'ร้านค้าออนไลน์|อีคอมเมิร์ซ|ขายของออนไลน์|ecommerce|shop|store', 'ขาย|sell|shop', 'ซื้อ|buy|purchase',
    'ตะกร้า|cart', 'ชำระเงิน|จ่ายเงิน|checkout|payment', 'พร้อมเพย์|promptpay', 'จองคิว|จอง|นัดหมาย|booking|appointment',
    'ลงทะเบียน|สมัคร|register|signup', 'เข้าสู่ระบบ|ล็อกอิน|login|signin', 'มือถือ|โทรศัพท์|mobile|phone',
    'แอป|แอพ|app|application', 'เว็บ|เว็บไซต์|website|web|site', 'แดชบอร์ด|dashboard', 'แอดมิน|หลังบ้าน|admin|backoffice',
    'ฟอร์ม|form', 'ปุ่ม|button', 'วันที่|ปฏิทิน|date|calendar', 'พ.ศ.|พศ|buddhist', 'ที่อยู่|address', 'บัตรประชาชน|nationalid|idcard',
    'ตาราง|table', 'กราฟ|แผนภูมิ|chart|graph', 'แนวโน้ม|trend', 'สัดส่วน|proportion|share', 'เปรียบเทียบ|เทียบ|compare|comparison',
    'ยอดขาย|รายได้|sales|revenue', 'สี|พาเลต|color|colour|palette', 'ฟอนต์|ตัวอักษร|แบบอักษร|font|typeface|typography',
    'มีหัว|looped', 'ไม่มีหัว|loopless', 'มืด|ดาร์ก|dark', 'สว่าง|light', 'หรู|พรีเมียม|luxury|premium|upscale',
    'เรียบ|มินิมอล|minimal|clean|simple', 'ขี้เล่น|สนุก|playful|fun', 'ทางการ|formal|corporate', 'อบอุ่น|warm', 'นิตยสาร|magazine|editorial',
    'ผู้สูงอายุ|สูงวัย|คนแก่|elderly|senior', 'การเข้าถึง|accessibility|a11y', 'เคลื่อนไหว|อนิเมชัน|แอนิเมชัน|motion|animation',
    'กระจก|glass', 'หัตถกรรม|งานมือ|craft|handmade', 'ไทย|thai', 'ไลน์|line', 'ข้อผิดพลาด|error', 'ค้นหา|search',
    'แจ้งเตือน|notification|alert', 'โหลด|loading', 'ว่างเปล่า|empty', 'รูปภาพ|ภาพ|image|photo', 'ราคา|price|pricing',
    'สินค้า|product', 'รีวิว|review', 'ตัดบรรทัด|ตัดคำ|linebreak|wrap', 'ขนส่ง|จัดส่ง|delivery|shipping|logistics',
    'โรงงาน|การผลิต|factory|manufacturing', 'เกษตร|ฟาร์ม|agriculture|farm', 'กฎหมาย|ทนาย|law|legal|lawyer',
    'วัด|ศาสนา|temple|religion', 'กีฬา|sport|sports', 'ดนตรี|เพลง|music', 'ข่าว|news', 'รับสมัครงาน|หางาน|job|jobs|recruitment',
    'ประกาศ|announcement', 'บริจาค|donation|charity', 'อีเวนต์|งานอีเวนต์|event', 'รถ|รถยนต์|car|automotive',
]
STOPWORDS = set('ที่ และ ของ ใน ให้ เป็น การ แบบ อยาก ได้ มี กับ สำหรับ หรือ ไม่ คือ จะ ก็ ทำ ด้วย แล้ว ซึ่ง โดย '
                'ความ ผ่าน อยากได้ ต้องการ หน่อย ช่วย the a an of for and or to in on with my our we i is are '
                'need needs want wants that this'.split())
# คำไทยทั่วไปที่ใส่พจนานุกรมไว้ให้ตัดโจทย์ได้ถูกที่ (ไม่ได้ใช้ให้คะแนน)
COMMON_TH = ('เว็บ เว็บไซต์ แอป แอพ ร้าน ขาย ซื้อ ลูกค้า มือถือ ใช้ งาน หน้า ระบบ ออนไลน์ เก่า ใหม่ ปี อายุ คน '
             'โทน ภาษาไทย ไทย บริษัท องค์กร บริการ เมนู ข้อมูล จัดการ ผู้ใช้ วัยรุ่น ครอบครัว').split()

THAI_DEPENDENT = set(chr(c) for c in [0x0E31, *range(0x0E34, 0x0E3B), *range(0x0E47, 0x0E4F)])
THAI_LEADING = set('เแโใไ')
TOKEN_RE = re.compile(r'[฀-๿]+|[a-z0-9]+(?:[.\-][a-z0-9]+)*')
ABSTAIN_COVERAGE = 0.25
BIGRAM_WEIGHT = 0.4
SYNONYM_WEIGHT = 0.6


def read_csv(path):
    with open(path, encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))


def normalize(text):
    """ตัวพิมพ์เล็ก · ตัดจุดในตัวย่อไทย (พ.ศ. → พศ)"""
    return re.sub(r'(?<=[฀-๿])\.', '', (text or '').lower())


def split_values(value):
    return [v.strip() for v in re.split(r'[;|]', value or '') if v.strip()]


def stem(word):
    """ตัดพหูพจน์อังกฤษแบบง่าย (contracts → contract · stories → story) ให้คำค้นกับข้อมูลตรงกัน"""
    if word in ('news', 'series', 'ios', 'sms', 'kpis'):
        return word
    if len(word) > 4 and word.endswith('ies'):
        return word[:-3] + 'y'
    if len(word) > 3 and word.endswith('s') and not word.endswith(('ss', 'us', 'is')):
        return word[:-1]
    return word


class Tokenizer:
    """ตัดคำไทยด้วยพจนานุกรม (คำยาวสุดก่อน) · ละตินตัดตามตัวอักษร-ตัวเลข"""

    def __init__(self, words):
        self.words = {w for w in words if re.search(r'[฀-๿]', w) and len(w) > 1}
        self.max_len = max((len(w) for w in self.words), default=1)

    def is_boundary(self, run, i):
        if i == 0 or i == len(run):
            return True
        return run[i] not in THAI_DEPENDENT and run[i - 1] not in THAI_LEADING

    def longest_word(self, run, i, exclude=None):
        if not self.is_boundary(run, i):
            return None
        for size in range(min(self.max_len, len(run) - i), 1, -1):
            piece = run[i:i + size]
            if piece != exclude and piece in self.words and self.is_boundary(run, i + size):
                return piece
        return None

    def split_compound(self, word):
        """คำประสมที่ประกอบด้วยคำในพจนานุกรมทั้งคำ → คืนคำย่อย (ร้านทอง → ร้าน ทอง)"""
        parts, i = [], 0
        while i < len(word):
            piece = self.longest_word(word, i, exclude=word)
            if not piece:
                return []
            parts.append(piece)
            i += len(piece)
        return parts

    def thai(self, run):
        """คืน [(token, เป็นคำในพจนานุกรมไหม)]"""
        out, unknown, i = [], '', 0

        def flush():
            nonlocal unknown
            chars = unknown.replace('ๆ', '').replace('ฯ', '')
            out.extend((chars[k:k + 2], False) for k in range(len(chars) - 1))
            unknown = ''

        while i < len(run):
            word = self.longest_word(run, i)
            if word:
                flush()
                out.append((word, True))
                out.extend((p, True) for p in self.split_compound(word))
                i += len(word)
            else:
                unknown += run[i]
                i += 1
        flush()
        return out

    def tokens(self, text):
        """คืน [(token, เป็นคำเต็มไหม)] · bigram ไทยเป็นคำไม่เต็ม"""
        out = []
        for m in TOKEN_RE.finditer(normalize(text)):
            tok = m.group()
            if re.match(r'[฀-๿]', tok):
                out.extend(self.thai(tok))
            else:
                parts = [stem(p) for p in re.split(r'[.\-]', tok)]
                out.extend((p, True) for p in parts if p)
                if len(parts) > 1:
                    out.append((''.join(parts), True))
        return [(t, whole) for t, whole in out if t not in STOPWORDS]


def synonym_map(tokenize_word):
    table = {}
    for group in SYNONYM_GROUPS:
        members = [tokenize_word(w) for w in group.split('|')]
        for m in members:
            table.setdefault(m, set()).update(x for x in members if x != m)
    return table


class Corpus:
    """ข้อมูลทุกไฟล์ในโฟลเดอร์ data · สร้างพจนานุกรมไทยร่วมกันครั้งเดียว"""

    def __init__(self, data_dir=DATA_DIR):
        self.data_dir = Path(data_dir)
        self.tables = {}
        words = set(COMMON_TH)
        for group in SYNONYM_GROUPS:
            words.update(normalize(w) for w in group.split('|'))
        for path in sorted(self.data_dir.rglob('*.csv')):
            for row in read_csv(path):
                for col, value in row.items():
                    if col in KEYWORD_COLUMNS:
                        for v in split_values(value):
                            words.add(normalize(v))
                            words.update(normalize(v).split())
        self.tokenizer = Tokenizer(words)
        self.synonyms = synonym_map(lambda w: normalize(w).replace(' ', ''))
        self.indexes = {}

    def table(self, rel):
        if rel not in self.tables:
            path = self.data_dir / rel
            self.tables[rel] = read_csv(path) if path.exists() else []
        return self.tables[rel]

    def rows(self, domain, stack=None):
        return self.table(domain_file(domain, stack))

    def index(self, domain, stack=None):
        key = (domain, stack)
        if key not in self.indexes:
            self.indexes[key] = Index(self, domain, stack)
        return self.indexes[key]

    def search(self, domain, query, n=3, stack=None, min_coverage=None):
        return self.index(domain, stack).search(query, n, min_coverage)


def domain_file(domain, stack=None):
    if domain not in DOMAINS:
        raise SystemExit(f'ไม่รู้จัก domain "{domain}" · ใช้ได้: {", ".join(DOMAINS)}')
    if domain == 'stack':
        if not stack:
            raise SystemExit('domain stack ต้องใส่ --stack <ชื่อ> เช่น --stack blazor')
        return f'stacks/{stack}.csv'
    return DOMAINS[domain][0]


class Index:
    """BM25 (k1 1.5 · b 0.75) · แถวที่ id ซ้ำ (พาเลต 2 โหมด) รวมเป็นเอกสารเดียว"""
    K1, B = 1.5, 0.75

    def __init__(self, corpus, domain, stack=None):
        self.corpus = corpus
        _, strong, weak, self.show = DOMAINS[domain]
        rows = corpus.rows(domain, stack)
        if not rows and domain == 'stack':
            names = sorted(p.stem for p in (corpus.data_dir / 'stacks').glob('*.csv'))
            raise SystemExit(f'ไม่มีไฟล์ stack "{stack}" · มี: {", ".join(names) or "(ยังไม่มี)"}')
        self.docs = {}
        for row in rows:
            doc = self.docs.setdefault(row.get('id', ''), {'rows': [], 'tf': {}})
            doc['rows'].append(row)
            for col in strong + weak:
                weight = 2 if col in strong else 1
                for tok, _ in corpus.tokenizer.tokens(row.get(col, '').replace(';', ' ')):
                    doc['tf'][tok] = doc['tf'].get(tok, 0) + weight
        for doc in self.docs.values():
            doc['len'] = sum(doc['tf'].values())
        self.avg_len = sum(d['len'] for d in self.docs.values()) / max(len(self.docs), 1)
        self.df = {}
        for doc in self.docs.values():
            for tok in doc['tf']:
                self.df[tok] = self.df.get(tok, 0) + 1

    def idf(self, tok):
        n, df = len(self.docs), self.df.get(tok, 0)
        return math.log(1 + (n - df + 0.5) / (df + 0.5)) if df else 0.0

    def query_terms(self, query):
        """คืน [(concept, {token: น้ำหนัก})] · 1 concept = 1 คำที่พิมพ์มา + คำพ้อง"""
        concepts = []
        for tok, whole in self.corpus.tokenizer.tokens(query):
            terms = {tok: 1.0 if whole else BIGRAM_WEIGHT}
            for syn in self.corpus.synonyms.get(tok, ()):
                for s, _ in self.corpus.tokenizer.tokens(syn):
                    terms.setdefault(s, SYNONYM_WEIGHT)
            if all(c != tok for c, _ in concepts):
                concepts.append((tok, terms))
        return concepts

    def score(self, doc, concepts):
        total, covered, possible = 0.0, 0.0, 0.0
        for tok, terms in concepts:
            best_idf = max(self.idf(t) for t in terms)
            if best_idf == 0:
                continue  # คำนี้ไม่มีในข้อมูลเลย ไม่นับเข้าความครอบคลุม
            concept_weight = best_idf * max(terms.values())
            possible += concept_weight
            hit = 0.0
            for t, w in terms.items():
                tf = doc['tf'].get(t, 0)
                if tf:
                    norm = tf * (self.K1 + 1) / (tf + self.K1 * (1 - self.B + self.B * doc['len'] / self.avg_len))
                    total += w * self.idf(t) * norm
                    hit = max(hit, w * self.idf(t))
            covered += min(hit, concept_weight)
        return total, (covered / possible if possible else 0.0)

    def search(self, query, n=3, min_coverage=None):
        """min_coverage ต่ำกว่าค่าตั้งต้นใช้ได้เมื่อคำค้นยาวและต้องการหลายผล (ตัวร่างหากฎ UX จากโจทย์ทั้งย่อหน้า)"""
        floor = ABSTAIN_COVERAGE if min_coverage is None else min_coverage
        concepts = self.query_terms(query)
        results = []
        for doc_id, doc in self.docs.items():
            total, coverage = self.score(doc, concepts)
            if total > 0 and coverage >= floor:
                results.append({'id': doc_id, 'score': round(total, 3), 'coverage': round(coverage, 2),
                                'row': doc['rows'][0], 'rows': doc['rows']})
        results.sort(key=lambda r: (-r['score'], r['id']))
        return results[:n]


def has_thai(text):
    return bool(re.search(r'[฀-๿]', text))


def print_results(domain, query, results, show):
    if not results:
        print(f'ไม่พบที่ตรงกับ "{query}" ใน {domain} · ลองคำอื่น 2–5 คำ (ไทยหรืออังกฤษ) หรือเปลี่ยน domain · ห้ามแต่งผลเอง')
        return
    for rank, r in enumerate(results, 1):
        detail = ' · '.join(r['row'].get(c, '') for c in show if r['row'].get(c))
        print(f'{rank}. {r["id"]}  (คะแนน {r["score"]} · ครอบคลุม {int(r["coverage"] * 100)} %)  {detail}')


def run_eval(corpus, path):
    cases = json.loads(Path(path).read_text(encoding='utf-8'))['cases']
    groups, misses = {}, []
    for case in cases:
        ids = [r['id'] for r in corpus.search(case['domain'], case['query'], 3, case.get('stack'))]
        hit = any(e in ids for e in case['expect_ids'])
        lang = 'th' if has_thai(case['query']) else 'en'
        for key in (case['split'], f'{case["split"]}/{lang}'):
            g = groups.setdefault(key, [0, 0])
            g[0] += hit
            g[1] += 1
        if not hit:
            misses.append(f'  [{case["split"]}] {case["domain"]} "{case["query"]}" คาด {case["expect_ids"]} ได้ {ids or "ไม่พบ"}')
    for key in sorted(groups):
        ok, total = groups[key]
        print(f'{key:<18} {ok}/{total} = {ok / total * 100:.1f} %')
    if misses:
        print('ไม่ติด 3 อันดับแรก:')
        print('\n'.join(misses))
    holdout = groups.get('holdout', [0, 1])
    return holdout[0] / holdout[1]


def self_test():
    corpus = Corpus(FIXTURES)
    tok = corpus.tokenizer
    checks = []

    def check(name, ok):
        checks.append((name, ok))

    words = [t for t, _ in tok.tokens('ร้านกาแฟมินิมอล')]
    check('ตัดคำไทยติดกัน ร้านกาแฟ + มินิมอล', 'ร้านกาแฟ' in words and 'มินิมอล' in words)
    check('คำประสมแตกคำย่อย ร้านทอง → ทอง', 'ทอง' in [t for t, _ in tok.tokens('ร้านทอง')])
    check('ไม่ตัดกลางพยางค์ (ท่องเที่ยว ไม่ได้คำว่า ทอง)', 'ทอง' not in [t for t, _ in tok.tokens('ท่องเที่ยว')])
    check('ละตินมีขีด e-commerce → ecommerce', 'ecommerce' in [t for t, _ in tok.tokens('E-commerce')])

    def top(domain, q, stack=None):
        res = corpus.search(domain, q, 3, stack)
        return res[0]['id'] if res else None

    check('ไทยหาอุตสาหกรรม', top('industry', 'เว็บขายทองรูปพรรณ ร้านเก่าในเยาวราช') == 'gold-shop')
    check('อังกฤษหาแถวไทยผ่านคำพ้อง', top('industry', 'coffee shop website') == 'coffee-shop')
    check('อังกฤษ dentist → dental-clinic', top('industry', 'dentist booking site') == 'dental-clinic')
    check('ไทยหากฎ UX พ.ศ.', top('ux', 'ช่องวันที่ปีพ.ศ.') == 'th-date-be')
    check('อังกฤษหากฎ UX ปุ่ม', top('ux', 'touch target size for elderly') == 'touch-target')
    check('พาเลต 2 โหมดรวมเป็น 1 ผล', len([r for r in corpus.search('palette', 'gold', 5) if r['id'] == 'gold-ink']) == 1)
    check('stack blazor', top('stack', 'ฟอร์ม validation', 'blazor') == 'blazor-form')
    check('กราฟแนวโน้ม', top('chart', 'ยอดขายรายเดือน แนวโน้ม') == 'trend-line')
    check('ไม่พบ → งดตอบ (อังกฤษมั่ว)', corpus.search('industry', 'quantum zebra spaceship', 3) == [])
    check('ไม่พบ → งดตอบ (ไทยมั่ว)', corpus.search('industry', 'ภูเขาไฟระเบิดกลางทะเลสาบ', 3) == [])
    failed = [n for n, ok in checks if not ok]
    for name, ok in checks:
        print(('ผ่าน     ' if ok else 'ไม่ผ่าน  ') + name)
    print(f'self-test: {len(checks) - len(failed)}/{len(checks)} ผ่าน')
    return not failed


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('query', nargs='?')
    ap.add_argument('--domain', default='industry', choices=list(DOMAINS))
    ap.add_argument('--stack')
    ap.add_argument('-n', type=int, default=3)
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--data', default=str(DATA_DIR), help='โฟลเดอร์ข้อมูล (ค่าตั้งต้น ../data)')
    ap.add_argument('--eval', metavar='CASES_JSON')
    ap.add_argument('--self-test', action='store_true')
    args = ap.parse_args()
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if args.self_test:
        sys.exit(0 if self_test() else 1)
    corpus = Corpus(args.data)
    if args.eval:
        run_eval(corpus, args.eval)
        return
    if not args.query:
        ap.error('ใส่คำค้น หรือ --eval หรือ --self-test')
    results = corpus.search(args.domain, args.query, args.n, args.stack)
    if args.json:
        print(json.dumps([{k: r[k] for k in ('id', 'score', 'coverage', 'rows')} for r in results],
                         ensure_ascii=False, indent=2))
    else:
        print_results(args.domain, args.query, results, DOMAINS[args.domain][3])


if __name__ == '__main__':
    main()
