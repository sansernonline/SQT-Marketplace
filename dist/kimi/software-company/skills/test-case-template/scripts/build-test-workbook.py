"""Build qa/<CODE>-test-cases.xlsx: an Overview tab plus one tab per module, in mockup screen order.

Input is one flat table (.csv or the first sheet of an .xlsx) with a header row. Needed columns:
id, module, fr, title, type, result. Any other columns are kept in order.
Columns test_result (what actually happened) and evidence (GIF or screenshot file) are added after result if missing.

  python build-test-workbook.py cases.csv qa/PRJ-test-cases.xlsx
  python build-test-workbook.py cases.xlsx qa/PRJ-test-cases.xlsx --mockup mockup/PRJ-mockup.html --topics topics.json
  python build-test-workbook.py ... --brand 7C3AED --head-fill E4DCFD --ink 2E1065     # project colours (doc-theme)
  python build-test-workbook.py cases.csv qa/PRJ-test-cases.xlsx --results qa/evidence/<run-id>/results.csv

--results: results.csv from test-evidence/scripts/make_evidence.py (id, result, test_result, evidence). Fills those
columns by id; evidence becomes a link relative to the workbook (--evidence-dir, default: the folder of results.csv).

--mockup adds a `screen` column after `fr` (from each <section class="screen" id="s-NN-…" data-title="… — Name"
data-fr="FR-001,…">) and orders tabs by the first screen each module touches.
--topics: {"sessions": {"tab": "Sessions", "scope": "Saving and opening sessions"}, ...}; key order wins over mockup order.
Never keeps an "all cases" tab: results recorded in two places drift apart. Overview counts results with COUNTIF.
Needs: pip install openpyxl
"""
import argparse, collections, csv, json, re, sys
import openpyxl
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

RESULTS = {'Pass': 'D1FAE5', 'Fail': 'FEE2E2', 'Blocked': 'FEF3C7', 'Not run': 'EEEEF2'}
WIDTH = {'id': 14, 'module': 14, 'fr': 12, 'screen': 26, 'title': 48, 'type': 11, 'priority': 9, 'level': 11,
         'preconditions': 30, 'steps': 60, 'test_data': 30, 'expected': 50, 'result': 10, 'test_result': 45, 'evidence': 24,
         'notes': 30}


def read_rows(path):
    if path.lower().endswith('.csv'):
        with open(path, encoding='utf-8-sig', newline='') as f:
            rows = list(csv.reader(f))
    else:
        rows = [list(r) for r in openpyxl.load_workbook(path, read_only=True).worksheets[0].iter_rows(values_only=True)]
    return [str(h).strip() for h in rows[0]], [r for r in rows[1:] if any(v not in (None, '') for v in r)]


def screens_by_fr(path):
    out = collections.defaultdict(list)
    for tag in re.findall(r'<section\b[^>]*\bclass="screen"[^>]*>', open(path, encoding='utf8').read()):
        m, t, f = re.search(r'id="s-(\d\d)', tag), re.search(r'data-title="([^"]*)"', tag), re.search(r'data-fr="([^"]*)"', tag)
        if m and f:
            for fr in filter(None, f[1].split(',')):
                out[fr].append(f'{m[1]} ' + (t[1].split(' — ')[-1] if t else ''))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('out'); ap.add_argument('--mockup'); ap.add_argument('--topics')
    ap.add_argument('--brand', default='7C3AED'); ap.add_argument('--head-fill', default='E4DCFD'); ap.add_argument('--ink', default='2E1065')
    ap.add_argument('--font', default='Calibri')
    ap.add_argument('--results'); ap.add_argument('--evidence-dir')
    a = ap.parse_args()

    head, data = read_rows(a.src)
    need = {'id', 'module', 'fr', 'title', 'type', 'result'} - set(head)
    if need:
        sys.exit(f'missing columns: {sorted(need)}')
    col = head.index
    for k, after in (('test_result', 'result'), ('evidence', 'test_result')):
        if k not in head:
            at = col(after) + 1
            head.insert(at, k)
            data = [list(r[:at]) + [''] + list(r[at:]) for r in data]
    data = [list(r) + [''] * (len(head) - len(r)) for r in data]
    ev_dir = None
    if a.results:
        import os
        from pathlib import Path
        res = {r['id'].strip(): r for r in csv.DictReader(open(a.results, encoding='utf-8-sig'))}
        ev_dir = Path(a.evidence_dir or Path(a.results).parent)
        for r in data:
            got = res.get(str(r[col('id')]).strip())
            if got:
                for k in ('result', 'test_result', 'evidence'):
                    r[col(k)] = got.get(k, '')
        rel = lambda name: Path(os.path.relpath((ev_dir / name).resolve(), Path(a.out).resolve().parent)).as_posix()
    if a.mockup:
        scr = screens_by_fr(a.mockup)
        head.insert(col('fr') + 1, 'screen')
        data = [list(r[:col('screen')]) + [' · '.join(scr.get(r[col('fr')], [])) or 'no screen'] + list(r[col('screen'):]) for r in data]
    by_mod = collections.defaultdict(list)
    for r in data:
        by_mod[r[col('module')]].append(r)

    topics = json.load(open(a.topics, encoding='utf8')) if a.topics else {}
    def main_screen(m):  # the screen most of this module's cases sit on
        c = collections.Counter(s[:2] for r in by_mod[m] for s in str(r[col('screen')]).split(' · ') if s[:2].isdigit())
        return (c.most_common(1)[0][0] if c else '99', m)
    order = [m for m in topics if m in by_mod] + sorted((m for m in by_mod if m not in topics), key=main_screen if a.mockup else str)

    F, INK, MUTED = a.font, a.ink, '6B6880'
    head_fill, zebra = PatternFill('solid', fgColor=a.head_fill), PatternFill('solid', fgColor='F7F5FD')
    head_rule, row_rule = Border(bottom=Side('medium', color=a.brand)), Border(bottom=Side('thin', color='E6E3EF'))

    def titles(ws, title, sub):
        ws['A1'], ws['A2'] = title, sub
        ws['A1'].font, ws['A2'].font = Font(F, size=16, bold=True, color=INK), Font(F, size=10, color=MUTED)

    def header(ws, row, names):
        for c, n in enumerate(names, 1):
            cell = ws.cell(row, c, n)
            cell.font, cell.fill, cell.border = Font(F, bold=True, color=INK), head_fill, head_rule
            cell.alignment = Alignment(vertical='center', wrap_text=True)
        ws.row_dimensions[row].height = 22

    wb = openpyxl.Workbook(); ov = wb.active; ov.title = 'Overview'
    RES, HR, stats = get_column_letter(col('result') + 1), 4, []
    for m in order:
        cases, info = by_mod[m], topics.get(m, {})
        tab = (info.get('tab') or str(m).replace('-', ' ').capitalize())[:31]
        ws = wb.create_sheet(tab)
        scr_list = sorted({s for r in cases for s in str(r[col('screen')]).split(' · ') if s != 'no screen'}) if a.mockup else []
        sub = '. '.join(x for x in [info.get('scope', ''), 'Mockup screens: ' + ' · '.join(scr_list) if scr_list else ''] if x)
        titles(ws, f'{tab} — {len(cases)} test cases', sub)
        header(ws, HR, head)
        for i, r in enumerate(cases):
            for c, v in enumerate(r, 1):
                cell = ws.cell(HR + 1 + i, c, v)
                cell.font, cell.border = Font(F, size=10, color='1F1D2B', bold=(c == 1)), row_rule
                cell.alignment = Alignment(vertical='top', wrap_text=True)
                if i % 2:
                    cell.fill = zebra
                if head[c - 1] == 'evidence' and v and ev_dir:
                    cell.hyperlink, cell.font = rel(v), Font(F, size=10, color=a.brand, underline='single')
        last = HR + len(cases)
        for c, h in enumerate(head, 1):
            ws.column_dimensions[get_column_letter(c)].width = WIDTH.get(h, 14)
        ws.freeze_panes, ws.auto_filter.ref = ws.cell(HR + 1, 2), f'A{HR}:{get_column_letter(len(head))}{last}'
        dv = DataValidation(type='list', formula1='"' + ','.join(RESULTS) + '"', allow_blank=True)
        dv.add(f'{RES}{HR + 1}:{RES}{last}'); ws.add_data_validation(dv)
        for word, color in RESULTS.items():
            ws.conditional_formatting.add(f'{RES}{HR + 1}:{RES}{last}', FormulaRule(
                formula=[f'${RES}{HR + 1}="{word}"'], fill=PatternFill('solid', fgColor=color, bgColor=color), font=Font(bold=True)))
        types = collections.Counter(r[col('type')] for r in cases)
        not_built = sum(1 for r in cases if str(r[col('title')]).startswith('[not built]'))
        stats.append((tab, ' · '.join(scr_list), len(cases), types, not_built, f"'{tab}'!{RES}{HR + 1}:{RES}{last}"))

    seen = {r[col('type')] for r in data}
    kinds = [k for k in ('normal', 'boundary', 'negative', 'permission') if k in seen] + sorted(seen - {'normal', 'boundary', 'negative', 'permission'})
    titles(ov, f'Test cases — {len(data)} cases in {len(stats)} topics',
           'One tab per topic' + (', in the order of the mockup screens' if a.mockup else '') +
           '. Record the result in each tab; this page counts them.')
    cols = ['Topic'] + (['Mockup screens'] if a.mockup else []) + ['Cases'] + [k.capitalize() for k in kinds] + ['Not built'] + list(RESULTS) + ['Not recorded']
    header(ov, HR, cols)
    for i, (tab, scr, n, types, nb, rng) in enumerate(stats):
        vals = [tab] + ([scr] if a.mockup else []) + [n] + [types[k] for k in kinds] + [nb] + \
               [f'=COUNTIF({rng},"{w}")' for w in RESULTS] + [f'=COUNTBLANK({rng})']
        for c, v in enumerate(vals, 1):
            cell = ov.cell(HR + 1 + i, c, v)
            cell.font, cell.border = Font(F, size=10, color='1F1D2B'), row_rule
            cell.alignment = Alignment(vertical='top', wrap_text=(a.mockup and c == 2))
            if i % 2:
                cell.fill = zebra
        link = ov.cell(HR + 1 + i, 1)
        link.hyperlink, link.font = f"#'{tab}'!A1", Font(F, size=10, bold=True, color=a.brand, underline='single')
    tot = HR + len(stats) + 1
    ov.cell(tot, 1, 'Total').font = Font(F, bold=True, color=INK)
    first_num = 3 if a.mockup else 2
    for c in range(1, len(cols) + 1):
        if c >= first_num:
            L = get_column_letter(c)
            ov.cell(tot, c, f'=SUM({L}{HR + 1}:{L}{tot - 1})').font = Font(F, bold=True, color=INK)
        ov.cell(tot, c).border = Border(top=Side('medium', color=a.brand))
    for c, h in enumerate(cols, 1):
        ov.column_dimensions[get_column_letter(c)].width = {'Topic': 16, 'Mockup screens': 70}.get(h, max(8, len(h) + 3))
    ov.freeze_panes, ov.sheet_view.showGridLines = f'A{HR + 1}', False
    ov.sheet_properties.tabColor = a.brand
    wb.save(a.out)
    print(f'{a.out}: {len(data)} cases, {len(stats)} tabs + Overview')


if __name__ == '__main__':
    main()
