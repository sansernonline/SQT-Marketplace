"""Build the start page of a single-file mockup: hero, find box, one card per screen with a picture.

The mockup needs:
  - one <section class="screen" id="s-NN-slug" data-title="Product — Screen name" data-fr="FR-001,FR-002"> per screen
  - a start section (id="s-start") holding the two markers <!-- start-page:begin --> and <!-- start-page:end -->
Everything between the markers is replaced on each run (HTML, its <style> and <script>), so re-run after any screen changes.

  python mockup-start-page.py mockup/PRJ-mockup.html --config mockup/start-page.json
  python mockup-start-page.py mockup/PRJ-mockup.html --config ... --no-thumbs     # skip pictures (no playwright needed)

Config (all keys optional):
  {"product": "Telex", "fr_total": 290, "srs": "docs/PRJ-SRS-v0.3-DRAFT.docx",
   "logo": "<svg class=\"mk\" viewBox=\"0 0 64 64\"><use href=\"#logo\"/></svg>",
   "links": [{"label": "Open main window", "href": "#s-01-main-window", "primary": true}],
   "topics": [{"name": "Terminal", "screens": ["01", "04"]}],
   "blurbs": {"01": "Tabs, session tree and status bar"},
   "hide": ".mock-switcher,.mock-fr"}
Pictures need: pip install playwright pillow && playwright install chromium
"""
import argparse, base64, html, io, json, pathlib, re, sys

BEGIN, END = '<!-- start-page:begin -->', '<!-- start-page:end -->'

CSS = '''
#s-start{--st-bg:var(--bg-base,var(--win-bg,#1c1c1c));--st-card:var(--bg-surface,var(--win-card,#2b2b2b));--st-line:var(--border,var(--win-divider,#3d3d3d));
 --st-text:var(--text-primary,var(--win-text,#fff));--st-muted:var(--text-muted,var(--win-text-secondary,#c5c5c5));--st-accent:var(--accent,var(--win-accent,#2A78D6));
 --st-link:var(--accent-light,var(--win-accent-text,#6CA6EF));--st-mono:var(--font-mono,Consolas,monospace)}
#s-start .st{display:flex;flex-direction:column;gap:24px;padding:24px 32px 32px;overflow:auto;flex:1;min-width:0}
#s-start .st>*{width:100%;max-width:1680px;margin-inline:auto;flex-shrink:0}
#s-start .st-hero{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:24px;align-items:center;padding:32px;border:1px solid var(--st-line);border-radius:12px;overflow:hidden;background:var(--st-card)}
#s-start .st-hero .mk{width:88px;height:88px;border-radius:20px}
#s-start .st-ht{display:flex;flex-direction:column;gap:8px;min-width:0}
#s-start .st-ht h1{margin:0;font-size:28px;line-height:36px;font-weight:600;color:var(--st-text)}
#s-start .st-ht p{margin:0;color:var(--st-muted);max-width:72ch}
#s-start .st-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
#s-start .st-acts a{display:inline-flex;align-items:center;height:32px;padding:0 12px;border:1px solid var(--st-line);border-radius:4px;color:var(--st-text);text-decoration:none;background:var(--st-bg)}
#s-start .st-acts a.primary{background:var(--st-accent);border-color:var(--st-accent);color:#fff;font-weight:600}
#s-start .st-stats{display:grid;grid-template-columns:repeat(2,minmax(120px,1fr));gap:8px;margin:0}
#s-start .st-stats div{padding:12px 16px;border:1px solid var(--st-line);border-radius:8px;background:var(--st-bg)}
#s-start .st-stats dt{font-size:12px;color:var(--st-muted)}
#s-start .st-stats dd{margin:0;font-size:28px;line-height:36px;font-weight:600;color:var(--st-text)}
#s-start .st-stats small{font-size:14px;color:var(--st-muted);font-weight:400}
#s-start .st-find{position:sticky;top:-24px;z-index:5;display:flex;align-items:center;gap:12px;padding:12px 0;background:var(--st-bg)}
#s-start .st-find label{flex:1;max-width:640px;display:flex;align-items:center;height:40px;padding:0 12px;border:1px solid var(--st-line);border-radius:8px;background:var(--st-card)}
#s-start .st-find label:focus-within{border-color:var(--st-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--st-accent) 25%,transparent)}
#s-start .st-find input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--st-text);font:inherit}
#s-start .st-find kbd{font-family:var(--st-mono);font-size:12px;padding:1px 7px;border:1px solid var(--st-line);border-radius:4px;color:var(--st-muted)}
#s-start .st-find output,#s-start .st-none{font-size:12px;color:var(--st-muted)}
#s-start .st-none{text-align:center;padding:24px 0}
#s-start .st-topic{display:flex;flex-direction:column;gap:8px}
#s-start .st-topic h2{margin:0;font-size:14px;font-weight:600;color:var(--st-text)}
#s-start .st-topic h2 span{font-weight:400;font-size:12px;color:var(--st-muted);margin-left:8px}
#s-start .st-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px}
#s-start .st-card{display:flex;flex-direction:column;border:1px solid var(--st-line);border-radius:8px;overflow:hidden;background:var(--st-card);color:var(--st-text);text-decoration:none;transition:border-color .12s}
#s-start .st-card:hover{border-color:var(--st-accent)}
#s-start .st-card:focus-visible{outline:2px solid var(--st-link);outline-offset:2px}
#s-start .st-th{display:block;aspect-ratio:16/10;overflow:hidden;border-bottom:1px solid var(--st-line);background:var(--st-bg)}
#s-start .st-th img{display:block;width:100%;height:100%;object-fit:cover;object-position:top left}
#s-start .st-th .l,:root[data-theme="light"] #s-start .st-th .d{display:none}
:root[data-theme="light"] #s-start .st-th .l{display:block}
#s-start .st-row{display:flex;gap:12px;align-items:flex-start;padding:12px 16px}
#s-start .st-no{flex:0 0 36px;height:36px;display:grid;place-items:center;border-radius:8px;background:var(--st-accent);color:#fff;font:600 13px var(--st-mono)}
#s-start .st-tx{display:flex;flex-direction:column;gap:2px;min-width:0}
#s-start .st-tx small{font-size:12px;color:var(--st-muted)}
#s-start .st-tx code{font:11px var(--st-mono);color:var(--st-link);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#s-start [hidden]{display:none!important}
@media (max-width:900px){#s-start .st-hero{grid-template-columns:1fr}#s-start .st{padding:16px}}
'''

JS = r'''
(() => {
  const box = document.getElementById('st-find'); if (!box) return;
  const cards = [...document.querySelectorAll('#s-start .st-card')], topics = [...document.querySelectorAll('#s-start .st-topic')];
  const out = document.getElementById('st-found'), none = document.getElementById('st-none');
  const hit = (q, w) => !/^\d+$/.test(w) ? q.includes(w)
    : w.length <= 2 ? q.startsWith(w.padStart(2, '0') + ' ') || q.includes(' ' + w.padStart(3, '0')) : q.includes(' ' + w);
  const run = () => {
    const words = box.value.toLowerCase().split(/\s+/).map(w => w.replace(/^fr-?/, '')).filter(Boolean);
    let n = 0;
    for (const c of cards) { c.hidden = !words.every(w => hit(c.dataset.q, w)); n += !c.hidden; }
    for (const t of topics) t.hidden = !t.querySelector('.st-card:not([hidden])');
    out.textContent = n === cards.length ? n + ' screens' : n + ' of ' + cards.length + ' screens';
    none.hidden = n > 0;
  };
  box.addEventListener('input', run);
  box.addEventListener('keydown', e => {
    if (e.key === 'Escape') { box.value = ''; run(); }
    if (e.key === 'Enter') cards.find(c => !c.hidden)?.click();
  });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !document.getElementById('s-start').hidden && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { e.preventDefault(); box.focus(); }
  });
})();
'''


def attr(tag, name):
    m = re.search(name + r'="([^"]*)"', tag)
    return html.unescape(m[1]) if m else ''


def fr_range_text(frs):
    """FR-001,FR-002,FR-003,FR-007 -> '001–003, 007'"""
    nums = sorted({int(f.split('-')[-1]) for f in frs if re.search(r'\d+$', f)})
    out, i = [], 0
    while i < len(nums):
        j = i
        while j + 1 < len(nums) and nums[j + 1] == nums[j] + 1:
            j += 1
        out.append(f'{nums[i]:03d}' if j == i else f'{nums[i]:03d}' + ('–' if j > i + 1 else ', ') + f'{nums[j]:03d}')
        i = j + 1
    return ', '.join(out)


def thumbs(path, ids, hide):
    from playwright.sync_api import sync_playwright
    from PIL import Image
    uri, shots = pathlib.Path(path).resolve().as_uri(), {}
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900})
        for theme in ('dark', 'light'):
            for sid in ids:
                pg.goto(uri + ('?theme=light' if theme == 'light' else '') + '#' + sid); pg.wait_for_timeout(350)
                pg.add_style_tag(content=hide + '{display:none!important}')
                im = Image.open(io.BytesIO(pg.screenshot())).convert('RGB').resize((400, 250), Image.LANCZOS)
                buf = io.BytesIO(); im.save(buf, 'WEBP', quality=62, method=6)
                shots[sid, theme] = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
        b.close()
    return shots


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('mockup'); ap.add_argument('--config'); ap.add_argument('--no-thumbs', action='store_true')
    a = ap.parse_args()
    cfg = json.loads(pathlib.Path(a.config).read_text(encoding='utf8')) if a.config else {}
    src = pathlib.Path(a.mockup).read_text(encoding='utf8')
    if src.count(BEGIN) != 1 or src.count(END) != 1:
        sys.exit(f'put {BEGIN} and {END} once each inside <section id="s-start">, where the page body goes')

    screens = {}
    for tag in re.findall(r'<section\b[^>]*\bclass="screen"[^>]*>', src):
        m = re.search(r'id="(s-(\d\d)[^"]*)"', tag)
        if not m:
            continue
        name = attr(tag, 'data-title').split(' — ')[-1] or m[1]
        screens[m[2]] = dict(id=m[1], name=name, frs=[f for f in attr(tag, 'data-fr').split(',') if f])
    if not screens:
        sys.exit('no <section class="screen" id="s-NN-…"> found')
    topics = cfg.get('topics') or [{'name': 'Screens', 'screens': sorted(screens)}]
    missing = sorted(set(screens) - {n for t in topics for n in t['screens']})
    if missing:
        topics.append({'name': 'Other screens', 'screens': missing})
    shots = {} if a.no_thumbs else thumbs(a.mockup, [s['id'] for s in screens.values()], cfg.get('hide', '.mock-switcher,.mock-fr'))

    def card(n):
        s, blurb = screens[n], html.escape(cfg.get('blurbs', {}).get(n, ''))
        fr = fr_range_text(s['frs'])
        q = ' '.join([n, s['name'], blurb] + [f.split('-')[-1] for f in s['frs']]).lower().replace('"', '')
        th = ''.join(f'<img class="{t[0]}" alt="" loading="lazy" src="{shots[s["id"], t]}">' for t in ('dark', 'light') if (s['id'], t) in shots)
        return (f'<a class="st-card" href="#{s["id"]}" data-q="{html.escape(q)}">' + (f'<span class="st-th">{th}</span>' if th else '')
                + f'<span class="st-row"><span class="st-no">{n}</span><span class="st-tx"><b>{html.escape(s["name"])}</b>'
                + (f'<small>{blurb}</small>' if blurb else '') + (f'<code title="FR {fr}">FR {fr}</code>' if fr else '') + '</span></span></a>')

    with_fr = {f for s in screens.values() for f in s['frs']}
    total = cfg.get('fr_total')
    stats = [('Screens', str(len(screens))), ('FRs with a screen', f'{len(with_fr)}' + (f'<small>/{total}</small>' if total else '')),
             ('States per screen', str(cfg.get('states', 5))), ('Topics', str(len(topics)))]
    links = ''.join(f'<a class="{"primary" if l.get("primary") else ""}" href="{html.escape(l["href"])}">{html.escape(l["label"])}</a>' for l in cfg.get('links', []))
    srs = f' FR means Functional Requirement in <code>{html.escape(cfg["srs"])}</code>.' if cfg.get('srs') else ''
    body = (f'<style>{CSS}</style>\n<div class="st">\n<header class="st-hero">{cfg.get("logo", "")}<div class="st-ht">'
            f'<h1>{html.escape(cfg["product"]) + " · " if cfg.get("product") else ""}{len(screens)} screens you can click</h1>'
            f'<p>Every screen has 5 states: empty, loading, error, partial and success. Switch them with the state switcher, or add <code>?state=error</code> after the screen address.{srs}</p>'
            f'<div class="st-acts">{links}</div></div><dl class="st-stats">' + ''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in stats) + '</dl></header>\n'
            '<div class="st-find" role="search"><label><input id="st-find" type="search" autocomplete="off" aria-describedby="st-found" '
            'placeholder="Find a screen: name, number or FR"></label><kbd>/</kbd><output id="st-found">' + f'{len(screens)} screens</output></div>\n'
            '<p class="st-none" id="st-none" hidden>No screen matches.</p>\n'
            + '\n'.join(f'<section class="st-topic"><h2>{html.escape(t["name"])}<span>{len(t["screens"])}</span></h2><div class="st-cards">'
                        + ''.join(card(n) for n in t['screens'] if n in screens) + '</div></section>' for t in topics)
            + f'\n</div>\n<script>{JS}</script>\n')
    i, j = src.index(BEGIN) + len(BEGIN), src.index(END)
    pathlib.Path(a.mockup).write_text(src[:i] + '\n' + body + src[j:], encoding='utf8', newline='')
    print(f'start page: {len(screens)} screens, {len(topics)} topics, {len(shots)} pictures')


if __name__ == '__main__':
    main()
