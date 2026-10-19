"""Turn test-run screenshots into one captioned GIF per test case, plus results.csv and a Markdown report.

  python make_evidence.py <run.json> --out qa/evidence/<run-id> --report qa/reports/<run-id>-test-report.md
  python make_evidence.py --self-test

run.json (paths are relative to run.json):
{
  "run": {"id": "2026-10-18-r1", "project": "Pillo PMS", "build": "v0.4.2", "env": "staging · Chrome 130",
          "tester": "qa-tester", "date": "2026-10-18"},
  "cases": [
    {"id": "TC-LOGIN-001", "title": "เข้าสู่ระบบด้วยรหัสผ่านถูกต้อง", "result": "Pass",
     "expected": "เข้าแดชบอร์ด", "actual": "เข้าแดชบอร์ดได้ แสดงชื่อผู้ใช้",
     "issue": "", "bug": "",
     "steps": [{"image": "TC-LOGIN-001/01.png", "caption": "เปิดหน้าเข้าสู่ระบบ"},
               {"image": "TC-LOGIN-001/04.png", "caption": "กดเข้าสู่ระบบ → เข้าแดชบอร์ด",
                "box": [430, 452, 420, 18]}]}
  ]
}
result: Pass | Fail | Blocked | Not run.  box (optional): x, y, w, h in screenshot pixels, drawn as a red frame.

Output per case: <id>.gif (header bar: id · title · step n/N · result badge; caption band under the screenshot;
closing result card) and, for Fail/Blocked, <id>-fail.png (the last step at full colour, since GIF has 256 colours).
results.csv columns: id, result, test_result, evidence — feed it to build-test-workbook.py --results
or record_results.py. Needs: pip install pillow
"""
import argparse, csv, json, os, sys, unicodedata
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, features

HERE = Path(__file__).resolve().parent
FONT_DIR = HERE.parent / 'assets' / 'fonts'
WIDTH = 1280                      # every frame is scaled to this width
HEAD_PX, CAP_PX = 24, 28          # font size at 1280 px wide → still ≥ 15 px when shown 800 px wide
INK, BAR, MUTED = '#FFFFFF', '#18181B', '#A1A1AA'
BADGE = {'Pass': ('#16A34A', 'PASS'), 'Fail': ('#DC2626', 'FAIL'), 'Blocked': ('#D97706', 'BLOCKED'),
         'Not run': ('#71717A', 'NOT RUN')}
THAI_WORD = {'Pass': 'ผ่าน', 'Fail': 'ไม่ผ่าน', 'Blocked': 'ติดขัด', 'Not run': 'ยังไม่ได้รัน'}
LAYOUT = ImageFont.Layout.RAQM if features.check('raqm') else ImageFont.Layout.BASIC


_FONTS = {}


def font(weight, size):
    """Sarabun for Thai and Latin; a DejaVu subset for arrows and check marks Sarabun lacks."""
    key = (weight, size)
    if key not in _FONTS:
        name = {'regular': 'Sarabun-Regular.ttf', 'bold': 'Sarabun-SemiBold.ttf'}[weight]
        _FONTS[key] = (ImageFont.truetype(str(FONT_DIR / name), size, layout_engine=LAYOUT),
                       ImageFont.truetype(str(FONT_DIR / 'Symbols-DejaVuSans.ttf'), round(size * 0.9), layout_engine=LAYOUT))
    return _FONTS[key]


SYMBOL = lambda ch: '\u2190' <= ch <= '\u21ff' or ch in '\u2713\u2714\u2717\u2718\u26a0' or '\u25b2' <= ch <= '\u25bc'


def runs(text, f):
    out = []
    for ch in text:
        g = f[1] if SYMBOL(ch) else f[0]
        if out and out[-1][1] is g:
            out[-1][0] += ch
        else:
            out.append([ch, g])
    return out


def tlen(d, text, f):
    return sum(d.textlength(t, font=g) for t, g in runs(text, f))


def put(d, x, y, text, f, fill, align='left', middle=False):
    """Draw text on one baseline. y is the top of the line, or its middle when middle=True."""
    asc, desc = f[0].getmetrics()
    base = y + (asc - desc) / 2 if middle else y + asc
    w = tlen(d, text, f)
    x = {'left': x, 'center': x - w / 2, 'right': x - w}[align]
    for t, g in runs(text, f):
        d.text((x, base), t, font=g, fill=fill, anchor='ls')
        x += d.textlength(t, font=g)


def clusters(text):
    """Split into characters, keeping Thai vowel and tone marks on their base letter."""
    out = []
    for ch in text:
        if out and (unicodedata.combining(ch) or ch == '\u0e31' or '\u0e34' <= ch <= '\u0e3a' or '\u0e47' <= ch <= '\u0e4e'):
            out[-1] += ch
        else:
            out.append(ch)
    return out


def wrap(d, text, f, width):
    """Wrap on spaces; a run with no spaces (Thai) that is too long breaks between letters."""
    lines, cur = [], ''
    for word in text.split(' '):
        trial = (cur + ' ' + word).strip()
        if tlen(d, trial, f) <= width:
            cur = trial
            continue
        if cur:
            lines.append(cur)
        cur = ''
        for c in clusters(word):
            if tlen(d, cur + c, f) > width and cur:
                lines.append(cur); cur = ''
            cur += c
    if cur:
        lines.append(cur)
    return lines or ['']


def fit(img):
    if img.width == WIDTH:
        return img.convert('RGB'), 1.0
    k = WIDTH / img.width
    return img.convert('RGB').resize((WIDTH, round(img.height * k)), Image.LANCZOS), k


HEAD_H = HEAD_PX * 2 + 8


def header(d, case, step_label):
    pad, mid = 20, HEAD_H / 2
    d.rectangle([0, 0, WIDTH, HEAD_H], fill=BAR)
    color, word = BADGE.get(case['result'], BADGE['Not run'])
    fb, fr = font('bold', HEAD_PX), font('regular', HEAD_PX)
    bw = tlen(d, word, fb) + 28
    d.rounded_rectangle([WIDTH - pad - bw, 12, WIDTH - pad, HEAD_H - 12], 6, fill=color)
    put(d, WIDTH - pad - bw / 2, mid, word, fb, INK, 'center', True)
    sw = tlen(d, step_label, fr)
    put(d, WIDTH - pad - bw - 16, mid, step_label, fr, MUTED, 'right', True)
    put(d, pad, mid, case['id'], fb, INK, middle=True)
    x = pad + tlen(d, case['id'], fb) + 14
    room = WIDTH - pad - bw - 32 - sw - x
    title = case.get('title', '')
    while title and tlen(d, title, fr) > room:
        title = title[:-2] + '…'
    put(d, x, mid, title, fr, '#E4E4E7', middle=True)


def frame(shot, case, caption, step_label, cap_lines, box=None):
    img, k = fit(shot)
    line_h = round(CAP_PX * 1.55)
    out = Image.new('RGB', (WIDTH, HEAD_H + img.height + cap_lines * line_h + 28), BAR)
    out.paste(img, (0, HEAD_H))
    d = ImageDraw.Draw(out)
    header(d, case, step_label)
    if box:
        x, y, w, h = [v * k for v in box]
        d.rectangle([x - 8, HEAD_H + y - 8, x + w + 8, HEAD_H + y + h + 8], outline='#DC2626', width=4)
    fc = font('regular', CAP_PX)
    for i, line in enumerate(wrap(d, caption, fc, WIDTH - 48)[:cap_lines]):
        put(d, 24, HEAD_H + img.height + 14 + i * line_h, line, fc, INK)
    return out


def result_card(base, case):
    """Closing frame: the last step dimmed, with a card that says the result and, if failed, why."""
    out = Image.blend(base, Image.new('RGB', base.size, '#000000'), 0.72)
    d = ImageDraw.Draw(out)
    color, word = BADGE.get(case['result'], BADGE['Not run'])
    big, fb, fr, fs = font('bold', 56), font('bold', HEAD_PX), font('regular', CAP_PX), font('regular', HEAD_PX)
    inner, line_h, small_h = 640, round(CAP_PX * 1.5), round(HEAD_PX * 1.5)
    main = wrap(d, case.get('issue') or case.get('actual') or '', fr, inner)[:3]
    extra = []
    if case['result'] in ('Fail', 'Blocked'):
        for label, key in (('คาดว่า', 'expected'), ('ที่เกิดจริง', 'actual')):
            if case.get(key):
                extra += wrap(d, f'{label}: {case[key]}', fs, inner)[:2]
    h = 40 + 70 + 44 + len(main) * line_h + (16 + len(extra) * small_h if extra else 0) + 36
    cx, top = WIDTH / 2, (base.height - h) / 2
    d.rounded_rectangle([cx - 360, top, cx + 360, top + h], 14, fill=BAR, outline=color, width=4)
    y = top + 40
    put(d, cx, y, f"{THAI_WORD.get(case['result'], '')} · {word}", big, color, 'center'); y += 70
    put(d, cx, y, case['id'], fb, MUTED, 'center'); y += 44
    for line in main:
        put(d, cx, y, line, fr, INK, 'center'); y += line_h
    y += 16 if extra else 0
    for line in extra:
        put(d, cx, y, line, fs, '#D4D4D8', 'center'); y += small_h
    return out


def hold_ms(caption):
    return max(2000, min(6000, 1200 + 45 * len(caption)))


def build_gif(case, base_dir, out_dir):
    steps = case.get('steps') or []
    if not steps:
        return None
    shots = [Image.open(base_dir / s['image']) for s in steps]
    probe = ImageDraw.Draw(Image.new('RGB', (1, 1)))
    cap_lines = min(2, max(len(wrap(probe, s.get('caption', ''), font('regular', CAP_PX), WIDTH - 48)) for s in steps))
    frames, ms = [], []
    for i, (s, shot) in enumerate(zip(steps, shots), 1):
        frames.append(frame(shot, case, s.get('caption', ''), f'ขั้น {i}/{len(steps)}', cap_lines, s.get('box')))
        ms.append(hold_ms(s.get('caption', '')))
    frames.append(result_card(frames[-1], case)); ms.append(3500)
    out_dir.mkdir(parents=True, exist_ok=True)
    gif = out_dir / f"{case['id']}.gif"
    pal = [f.quantize(colors=255, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE) for f in frames]
    pal[0].save(gif, save_all=True, append_images=pal[1:], duration=ms, loop=0, optimize=True, disposal=1)
    if case['result'] in ('Fail', 'Blocked'):
        frames[-2].save(out_dir / f"{case['id']}-fail.png")
    return gif


def rel(path, start):
    return Path(os.path.relpath(path, start)).as_posix()


def write_report(meta, cases, gifs, report):
    report.parent.mkdir(parents=True, exist_ok=True)
    count = {k: sum(c['result'] == k for c in cases) for k in BADGE}
    done = count['Pass'] + count['Fail'] + count['Blocked']
    rate = f"{count['Pass'] / done:.0%}" if done else '-'
    L = [f"# รายงานผลทดสอบ — {meta.get('project', '')} {meta.get('build', '')}".rstrip(), '',
         f"**รอบ:** {meta.get('id', '')} · **วันที่:** {meta.get('date', '')} · **สภาพแวดล้อม:** {meta.get('env', '')} · "
         f"**ผู้ทดสอบ:** {meta.get('tester', '')}", '',
         '## สรุป', '',
         '| ทั้งหมด | ผ่าน | ไม่ผ่าน | ติดขัด | ยังไม่ได้รัน | อัตราผ่าน (ของที่รัน) |', '|---|---|---|---|---|---|',
         f"| {len(cases)} | {count['Pass']} | {count['Fail']} | {count['Blocked']} | {count['Not run']} | {rate} |", '',
         '**ข้อสรุป:** (รอยืนยัน — หัวหน้าทีมหรือ qa-tester เขียน 1–2 ประโยค: ปล่อยได้ไหม · ติดอะไร)', '',
         '## ผลรายเคส', '', '| เคส | เรื่อง | ผล | ผลที่ได้จริง | หลักฐาน |', '|---|---|---|---|---|']
    for c in cases:
        g = gifs.get(c['id'])
        ev = f"[{g.name}]({rel(g, report.parent)})" if g else '-'
        L.append(f"| {c['id']} | {c.get('title', '')} | {THAI_WORD.get(c['result'], c['result'])} | "
                 f"{(c.get('actual') or '').replace('|', '/')} | {ev} |")
    bad = [c for c in cases if c['result'] in ('Fail', 'Blocked')]
    L += ['', '## เคสที่ไม่ผ่านหรือติดขัด', '']
    if not bad:
        L.append('ไม่มี')
    for c in bad:
        g = gifs.get(c['id'])
        L += [f"### {c['id']} — {c.get('title', '')}", '',
              f"- **ผล:** {THAI_WORD[c['result']]}",
              f"- **คาดว่า:** {c.get('expected', '(รอยืนยัน)')}",
              f"- **ที่เกิดจริง:** {c.get('actual', '(รอยืนยัน)')}",
              f"- **ปัญหา:** {c.get('issue') or '(รอยืนยัน)'}",
              f"- **บั๊ก:** {c.get('bug') or 'ยังไม่ได้เปิด'}", '']
        if g:
            L += [f"![{c['id']}]({rel(g, report.parent)})", '']
    skipped = [c for c in cases if c['result'] == 'Not run']
    if skipped:
        L += ['## ยังไม่ได้รัน', ''] + [f"- {c['id']} — {c.get('title', '')}: {c.get('issue') or '(รอยืนยัน) เหตุผล'}" for c in skipped] + ['']
    report.write_text('\n'.join(L) + '\n', encoding='utf-8')


def run(run_json, out_dir, report):
    data = json.loads(Path(run_json).read_text(encoding='utf-8'))
    base, meta, cases = Path(run_json).resolve().parent, data.get('run', {}), data['cases']
    bad = [c.get('id') for c in cases if c.get('result') not in BADGE]
    if bad:
        sys.exit(f'result must be one of {list(BADGE)}: {bad}')
    if LAYOUT != ImageFont.Layout.RAQM:
        print('warning: Pillow has no raqm here, so Thai vowel and tone marks may overlap. '
              'Run in the project Docker sandbox (Linux) or put fribidi.dll on PATH (Windows), then rerun.')
    gifs = {}
    for c in cases:
        g = build_gif(c, base, out_dir)
        if g:
            gifs[c['id']] = g
            print(f"{g}  {g.stat().st_size // 1024} KB")
    with open(out_dir / 'results.csv', 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f)
        w.writerow(['id', 'result', 'test_result', 'evidence'])
        for c in cases:
            g = gifs.get(c['id'])
            w.writerow([c['id'], c['result'], c.get('issue') or c.get('actual', ''), g.name if g else ''])
    if report:
        write_report(meta, cases, gifs, Path(report))
        print(report)
    print(f"{out_dir / 'results.csv'}  ({len(cases)} cases, layout {'raqm' if LAYOUT == ImageFont.Layout.RAQM else 'basic'})")


def self_test():
    import tempfile
    tmp = Path(tempfile.mkdtemp())
    for i, c in enumerate(['#FFFFFF', '#E4E4E7']):
        Image.new('RGB', (1440, 900), c).save(tmp / f's{i}.png')
    cases = [{'id': 'TC-X-001', 'title': 'ทดสอบภาษาไทย ที่ยาวมากจนต้องตัดบรรทัด', 'result': 'Fail', 'actual': 'ข้อความผิด',
              'issue': 'ปุ่มบันทึกไม่ทำงานเมื่อกดครั้งที่สอง', 'steps': [
                  {'image': 's0.png', 'caption': 'เปิดหน้าตั้งค่า'},
                  {'image': 's1.png', 'caption': 'กดบันทึก → ' + 'ข้อความยาวมาก' * 12, 'box': [10, 10, 100, 40]}]},
             {'id': 'TC-X-002', 'title': 'ไม่มีภาพ', 'result': 'Not run', 'steps': []}]
    (tmp / 'run.json').write_text(json.dumps({'run': {'id': 't'}, 'cases': cases}, ensure_ascii=False), encoding='utf-8')
    run(tmp / 'run.json', tmp / 'ev', tmp / 'rep' / 'r.md')
    gif = Image.open(tmp / 'ev' / 'TC-X-001.gif')
    assert gif.n_frames == 3 and gif.width == WIDTH, (gif.n_frames, gif.width)
    assert (tmp / 'ev' / 'TC-X-001-fail.png').exists()
    rows = list(csv.DictReader(open(tmp / 'ev' / 'results.csv', encoding='utf-8-sig')))
    assert [r['evidence'] for r in rows] == ['TC-X-001.gif', ''], rows
    md = (tmp / 'rep' / 'r.md').read_text(encoding='utf-8')
    assert '../ev/TC-X-001.gif' in md and '## ยังไม่ได้รัน' in md
    print('self-test passed')


if __name__ == '__main__':
    if '--self-test' in sys.argv:
        self_test(); sys.exit()
    ap = argparse.ArgumentParser()
    ap.add_argument('run_json'); ap.add_argument('--out', required=True); ap.add_argument('--report')
    a = ap.parse_args()
    run(a.run_json, Path(a.out), a.report)
