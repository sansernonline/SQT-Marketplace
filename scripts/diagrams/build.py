"""สร้าง HTML ของรูป diagram ทุกใบจาก data/ + labels/ → โฟลเดอร์ที่ระบุ

python scripts/diagrams/build.py <โฟลเดอร์ html>
ได้: <plugin>-map.html · <plugin>-playbooks.html (ทุก plugin) · marketplace-overview.html · hook-lifecycle.html
ไม่มีคำสั้นใน labels/ → ใช้ข้อความจริงตัดสั้นแทน และพิมพ์เตือน
"""
import glob, html, json, os, re, sys
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
CSS = open(os.path.join(HERE, "style.css"), encoding="utf-8").read()
FONTS = "https://fonts.googleapis.com/css2?family=Anuphan:wght@400;600&family=Bai+Jamjuree:wght@400;600&display=swap"
sys.path.insert(0, HERE)
from palette import COLOR, SHAPE, emblem, badge
TODAY = date.today().isoformat()
# วลีไทยที่คั่นด้วยช่องว่าง ห้ามตัดกลางวลี
NOBREAK = "(function(){var th=/[\u0e00-\u0e7f]/,w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),ns=[];while(w.nextNode())ns.push(w.currentNode);ns.forEach(function(n){var p=n.parentNode;if(!th.test(n.nodeValue)||p.closest('svg,script,style'))return;var f=document.createElement('span');f.className='nbw';n.nodeValue.split(/(\\s+)/).forEach(function(x){if(th.test(x)&&x.length<=20){var s=document.createElement('span');s.className='nb';s.textContent=x;f.appendChild(s);}else f.appendChild(document.createTextNode(x));});p.replaceChild(f,n);});})();"
warnings = []


def e(text):
    return html.escape(str(text), quote=False)


def page(title, body, plugin="superuser"):
    body = re.sub(r'"ใช้ superuser( …)?"', lambda m: f'<span class="nb">{m[0]}</span>', body)
    return (f'<!doctype html><html lang="th"><head><meta charset="utf-8"><title>{e(title)}</title>'
            f'<link href="{FONTS}" rel="stylesheet"><style>{CSS}</style></head>'
            f'<body><div id="sheet" style="--pc:{COLOR.get(plugin, COLOR["superuser"])}">{body}</div><script>{NOBREAK}</script></body></html>')


def header(title, accent, sub, src, plugin="superuser", stats=None, extra=""):
    """ก้อนสีหัวรูป: ป้ายเล็ก · ชื่อตัวใหญ่ · คำอธิบาย · ตัวเลขใหญ่ · ตราใหญ่มุมขวา"""
    nums = ('<div class="stats">' + "".join(f'<div><b>{n}</b>{e(l)}</div>' for n, l in stats) + "</div>") if stats else ""
    return (f'<div class="hero"><div class="big">{emblem(plugin, 56)}</div>'
            f'<div class="kick">{e(accent.lstrip("— "))}</div><h1>{e(title)}</h1><p>{e(sub)}</p>{nums}{extra}'
            f'<div class="src">{e(src)} · สร้างจากไฟล์จริง · {TODAY}</div></div>')


def sec(no, title, sub, body):
    return (f'<div class="sec"><div class="no">{no:02d}</div><div><h2>{e(title)}</h2>'
            f'<div class="sub">{e(sub)}</div></div><div class="body">{body}</div></div>')


def footer(note):
    return f'<div class="ft"><span>{e(note)}</span><span>SQT-Marketplace · scripts/diagrams/</span></div>'


def chips(items, cls):
    return "".join(f'<span class="chip {cls}">{e(i)}</span>' for i in items)


def step(n, color, title, sub, body):
    return sec(n, title, sub, body)


def shorten(text, limit=40):
    text = re.sub(r"`|\*\*|\[|\]\([^)]*\)", "", text)
    return text if len(text) <= limit else text[:limit].rstrip() + "…"


def load(plugin):
    data = json.load(open(os.path.join(HERE, "data", f"{plugin}.json"), encoding="utf-8"))
    path = os.path.join(HERE, "labels", f"{plugin}.json")
    labels = json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {}
    if not labels:
        warnings.append(f"{plugin}: ไม่มี labels/{plugin}.json")
    return data, labels


# ---------- รูปที่ 1 · แผนผัง plugin ----------

CORE_SKILLS = set(json.load(open(os.path.join(HERE, "data", "superuser.json"), encoding="utf-8"))["core_skills"])

def agent_card(a, job):
    plugin_skills = [s for s in a["skills"] if s not in CORE_SKILLS]
    return (f'<div class="card agent{" core" if a["core"] else ""}"><div class="top"><span class="t">{e(a["name"])}</span>'
            f'<span class="model {e(a["model"])}">{e(a["model"] or "—")}</span></div>'
            f'<div class="d">{e(job)}</div><div class="chips">{chips(plugin_skills, "sk")}</div></div>')


def map_grouped(data, labels, jobs, by_name):
    # software-company: 41 agent · 100+ skill → รวมเป็นกลุ่ม แล้วบอกว่ากลุ่ม agent ใช้กลุ่ม skill ไหน
    skill_group = {s: g for g, ss in labels["skill_groups"].items() for s in ss}
    cards = []
    for group, names in labels["agent_groups"].items():
        names = [n for n in names if n in by_name]  # agent กลางอยู่ใน plugin superuser ที่เดียวแล้ว
        if not names or all(by_name[n]["core"] for n in names):
            continue  # ทีมกลางวาดแยกในหัวข้อสุดท้าย
        used = {}
        for n in names:
            for s in by_name[n]["skills"]:
                if s in skill_group:
                    used[skill_group[s]] = used.get(skill_group[s], 0) + 1
        top = [g for g, _ in sorted(used.items(), key=lambda kv: -kv[1])[:4]]
        rows = "".join(f'<div class="mini"><b>{e(n)}</b><span>{e(jobs.get(n, ""))}</span></div>' for n in names)
        cards.append(f'<div class="card grp"><h4>{e(group)} · {len(names)}</h4>{rows}'
                     f'<div class="small" style="margin-top:8px">ใช้ skill กลุ่ม</div><div class="chips">{chips(top, "sk")}</div></div>')
    teams = f'<div class="grid g2">{"".join(cards)}</div>'
    own = set(data["skills"])
    groups = [(g, [x for x in ss if x in own]) for g, ss in labels["skill_groups"].items()]
    skills = "".join(f'<div class="card"><div class="t">{e(g)} <span class="small">· {len(ss)}</span></div>'
                     f'<div class="chips">{chips(ss, "sk")}</div></div>' for g, ss in groups if ss)
    return teams, f'<div class="grid g2">{skills}</div>'


def build_map(plugin):
    data, labels = load(plugin)
    jobs = labels.get("agents", {})
    by_name = {a["name"]: a for a in data["agents"]}
    lead = (f'<div class="lead"><div class="t">หัวหน้าทีม (skill <code>superuser</code>)</div>'
            f'<div class="d">รับงาน → เลือก playbook → แจกงานให้ agent ตัวใหม่ทีละขั้น → ตรวจกับของจริง → ส่งงาน</div></div>')
    commands = (f'<div class="card"><div class="t">คำสั่ง <code>/{plugin}:…</code> ({len(data["commands"])})</div>'
                f'<div class="chips">{chips(["/" + c for c in data["commands"]] or ["—"], "cm")}</div></div>')
    many = len(data["commands"]) > 8
    entry = (f'<div class="grid {"g2" if many else "g3"}" style="margin-bottom:12px">'
             f'<div class="card"><div class="t">พิมพ์ขอตรง ๆ</div><div class="d">"ใช้ superuser …" หรือเล่างาน Claude เลือก skill เอง</div></div>'
             f'{"" if many else commands}'
             f'<div class="card"><div class="t">เรียก agent ตรง</div><div class="d">พูดชื่อ agent หรือให้ Claude เลือกจากคำอธิบาย</div></div>'
             f'</div>{commands + "<div style=height:12px></div>" if many else ""}{lead}')
    domain = [a for a in data["agents"] if not a["core"]]
    su_data, su_labels = load("superuser") if plugin != "superuser" else (data, labels)
    core = [a for a in su_data["agents"] if a["core"]]
    core_jobs = su_labels.get("agents", {})
    if "agent_groups" in labels:
        teams, skill_panel = map_grouped(data, labels, jobs, by_name)
    else:
        teams = f'<div class="grid {"g2" if len(domain) in (2, 4) else "g3"}">{"".join(agent_card(a, jobs.get(a["name"], "")) for a in domain)}</div>' if domain else ""
        used = {s for a in data["agents"] for s in a["skills"]}
        loose = [s for s in data["skills"] if s not in used]
        note = (f'ชิปเส้นประ {len(loose)} ตัว = ไม่มี agent ประจำ หัวหน้าทีมเปิดใช้เอง' if loose else "ทุก skill มี agent ประจำ")
        skill_panel = (f'<div class="card"><div class="chips">{chips([x for x in data["skills"] if x not in loose] or ([] if loose else ["—"]), "sk")}{chips(loose, "sk loose")}</div>'
                       f'<div class="small" style="margin-top:8px">{e(note)}</div></div>')
    core_groups = su_labels.get("skill_groups") or {"skill กลาง": data["core_skills"]}
    core_cards = "".join(f'<div class="card"><div class="t">{e(g)} <span class="small">· {len(ss)}</span></div>'
                         f'<div class="chips">{chips(ss, "ld")}</div></div>' for g, ss in core_groups.items())
    core_panel = (f'<div class="grid g3">{"".join(agent_card(a, core_jobs.get(a["name"], "")) for a in core)}</div>'
                  f'<div class="small" style="margin:12px 0 8px">skill กลาง {len(data["core_skills"])} ตัว ใช้กับงานทุกสาขา — หัวหน้างาน {sum(len(s) for g, s in core_groups.items() if not g.startswith("sqt-toolkit"))} ตัวใน superuser · เอกสารและรูป {sum(len(s) for g, s in core_groups.items() if g.startswith("sqt-toolkit"))} ตัวใน sqt-toolkit</div>'
                  f'<div class="grid g2">{core_cards}</div>'
                  f'<div class="small" style="margin-top:8px">อยู่ใน <code>plugins/superuser</code> และ <code>plugins/sqt-toolkit</code> ที่เดียว · plugin อื่นได้มาทาง <code>dependencies</code> · '
                  f'hook <code>superuser-hook.mjs</code> จดทุกการทำงานลง <code>.claude/superuser/log/</code></div>')
    cross = (f'<div class="card" style="margin-top:12px"><div class="t">งานข้ามสาขา → ส่งต่อ plugin อื่น</div>'
             f'<div class="chips">{handoff(data["cross"])}</div></div>') if data["cross"] else ""
    pbs = data["playbooks"]
    shared = [p["name"] for p in pbs if p["shared"]]
    pb_panel = (f'<div class="card"><div class="chips">'
                f'{chips([p["name"] for p in pbs if not p["shared"]], "pb")}{chips([n + " (ดูที่ superuser)" for n in shared], "pb")}</div><div class="small" style="margin-top:8px">'
                f'ขั้นตอนของแต่ละ playbook อยู่ในรูป docs/plugins/{plugin}/playbooks.png</div></div>')
    body = header(plugin, "— แผนผัง plugin", labels.get("tagline", shorten(data["description"], 90)),
                  f"plugins/{plugin}/ · v{data['version']}", plugin,
                  [(len(data["agents"]), "agent"), (len(data["skills"]) + len(data["core_skills"]), "skill"),
                   (len(data["commands"]), "คำสั่ง"), (len(data["playbooks"]), "playbook")])
    n = 1
    parts = [(("p", "ทางเข้า", "ผู้ใช้เริ่มงานได้ 3 ทาง ทุกทางมาจบที่หัวหน้าทีม"), entry)]
    if teams:
        parts.append((("b", f"ทีม agent ของสาขานี้ · {len(domain)}", "agent ที่หัวหน้าทีมส่งงานให้" + (" · ชิปเขียว = skill ที่ agent นั้นใช้" if "chip sk" in teams else "")), teams))
    if data["skills"]:
        parts.append((("g", f"skill ของสาขานี้ · {len(data['skills'])}", "ความรู้ที่ agent โหลดเมื่อถึงงานนั้น"), skill_panel))
    parts.append((("a", f"playbook · {len(pbs)}", "สูตรงานที่หัวหน้าทีมคัดลง todo ทีละขั้น"), pb_panel))
    parts.append((("", "ทีมกลางและ skill กลาง" if plugin == "superuser" else "ทีมกลางจาก SuperUser",
                   "ใช้ได้ตัวเดียว ทุกสาขา" if plugin == "superuser" else "ได้มาจาก plugin superuser ทาง dependencies"), core_panel + cross))
    body += '<div class="steps">' + "".join(step(i + 1, c, t, s, b) for i, ((c, t, s), b) in enumerate(parts)) + "</div>"
    body += legend([("ld", "หัวหน้าทีม · skill กลาง"), ("ag", "agent"), ("sk", "skill"), ("pb", "playbook · plugin อื่น")])
    body += footer(f"agent {len(data['agents'])} · skill {len(data['skills']) + len(data['core_skills'])} · "
                   f"คำสั่ง {len(data['commands'])} · playbook {len(data['playbooks'])}")
    return page(f"{plugin} map", body, plugin)


def legend(items):
    colors = {"ld": ("var(--ink)", "var(--ink)"), "ag": ("#fff", "var(--pc)"),
              "sk": ("var(--skill-bg)", "var(--skill-line)"), "pb": ("#fff", "var(--rule2);border-style:dashed"),
              "us": ("var(--gate-bg)", "var(--gate-line)")}
    return '<div class="legend">' + "".join(
        f'<div><span class="sw" style="background:{colors[k][0]};border-color:{colors[k][1]}"></span>{e(t)}</div>'
        for k, t in items) + "</div>"


# ---------- รูปที่ 2 · ขั้นตอนของทุก playbook ----------

def step_box(s, label, last, eol=False):
    who = s["who"] or {}
    tags = (chips(["หัวหน้าทีม"], "ld") if who.get("lead") else "") + chips(who.get("agents", []), "ag") \
        + (chips(["ผู้ใช้"], "us") if who.get("user") else "") + chips(s["skills"], "sk") \
        + chips(["/" + c for c in s["commands"]], "cm") + chips(["→ " + p for p in s["playbooks"]], "pb")
    cls = "st" + (" gate" if s["approval"] else "") + (" last" if last else "") + (" eol" if eol else "")
    return f'<div class="{cls}"><div class="n">ขั้น {s["n"]}</div><div class="lb">{e(label)}</div><div class="chips">{tags}</div></div>'


def playbook_card(p, lab):
    steps = lab.get("steps") or []
    if len(steps) != len(p["steps"]):
        warnings.append(f"{p['name']}: labels มี {len(steps)} ขั้น แต่ไฟล์จริงมี {len(p['steps'])} — ใช้ข้อความจริงตัดสั้น")
        steps = [shorten(s["text"].rpartition(" · ใคร: ")[0] or s["text"]) for s in p["steps"]]
    # ขั้นที่มี phase ต่างกัน (เช่น รับงานต่อ / หยุดงาน) แยกเป็นรางของตัวเอง มีหัวช่วงกำกับ
    runs = []
    for st, l in zip(p["steps"], steps):
        if not runs or runs[-1][0] != st.get("phase"):
            runs.append((st.get("phase"), []))
        runs[-1][1].append((st, l))
    def cols(n):  # ไม่ให้เหลือขั้นเดียวโดด ๆ ในแถวสุดท้าย: 5 → 5 · 6 → 3+3 · 7 → 4+3 · 8 → 4+4
        return -(-n // -(-n // 5))
    boxes = "".join((f'<div class="phase">ช่วง: {e(ph)}</div>' if ph else "")
                    + f'<div class="flow" style="grid-template-columns:repeat({cols(len(run))},minmax(0,1fr))">'
                    + "".join(step_box(st, l, i == len(run) - 1, (i + 1) % cols(len(run)) == 0) for i, (st, l) in enumerate(run)) + "</div>"
                    for ph, run in runs)
    return (f'<div class="card pbcard"><div class="pbhd"><span class="name">{e(p["name"])}</span>'
            f'<span class="t">{e(lab.get("short") or p["title"])}</span><span class="cnt"><b>{len(p["steps"])}</b>ขั้น</span></div>'
            f'<div class="when">ใช้เมื่อ: {e(shorten(p["when"], 100000))}</div>{boxes}'
            f'<div class="done"><b>จบเมื่อ</b><span>{e(shorten(p["done"], 100000))}</span></div></div>')


def build_playbooks(plugin):
    data, labels = load(plugin)
    lab = labels.get("playbooks", {})
    groups = {}
    for p in data["playbooks"]:
        if not p["shared"]:
            groups.setdefault(lab.get(p["name"], {}).get("group", "playbook"), []).append(p)
    shared = [p["name"] for p in data["playbooks"] if p["shared"]]
    own = [p for g in groups.values() for p in g]
    stats = [(len(data["playbooks"]), "playbook" + (f" · {', '.join(shared)} วาดที่ superuser" if shared else "")),
             (sum(len(p["steps"]) for p in own), "ขั้นในรูปนี้"),
             (sum(1 for p in own for s in p["steps"] if s["approval"]), "จุดรอผู้ใช้อนุมัติ")]
    body = header(plugin, "ขั้นตอนของ playbook", "ทุกขั้นมาจากไฟล์ playbook จริง · ใครทำ · ใช้ skill ไหน · ตรงไหนต้องรอผู้ใช้",
                  f"plugins/{plugin}/skills/superuser/references/", plugin, stats)
    for g, pbs in groups.items():
        body += f'<div class="gtitle">{e(g)}<small>{len(pbs)} playbook</small></div>'
        body += "".join(playbook_card(p, lab.get(p["name"], {})) for p in pbs)
    if shared:
        body += (f'<div class="small" style="text-align:center">เหมือนต้นฉบับกลางทุกตัวอักษร ไม่วาดซ้ำ: '
                 f'{e(" · ".join(shared))} → ดูรูป docs/plugins/superuser/playbooks.png</div>')
    body += legend([("ld", "หัวหน้าทีมทำเอง"), ("ag", "agent ตัวใหม่"), ("us", "ผู้ใช้ · รออนุมัติ"),
                    ("sk", "skill ที่ใช้"), ("pb", "ต่อไป playbook อื่น")])
    body += footer("อ่านตามรางซ้าย → ขวา สุดแถวขึ้นแถวใหม่ (↵) · ป้ายเหลือง \"รอผู้ใช้อนุมัติ\" = หยุดรอผู้ใช้")
    return page(f"{plugin} playbooks", body, plugin)


# ---------- รูปที่ 3 · ภาพรวม marketplace ----------

def handoff(names):
    return "".join(f'<span class="chip to">{badge(n, 12)}{e(n)}</span>' for n in names)


def receivers(plugin, plugins):
    return [p for p in plugins if p != plugin and plugin in load(p)[0]["cross"]]


def handoff_block(plugin, cross, plugins):
    if cross:
        return f'<div class="small">ส่งต่อ →</div><div class="chips">{handoff(cross)}</div>'
    got = receivers(plugin, plugins)
    return f'<div class="small">ไม่มีรายการส่งต่อ · รับงานจาก {len(got)} plugin ←</div><div class="chips">{handoff(got)}</div>'


def matrix(cross):
    """ตารางใครส่งงานให้ใคร: แถว = ต้นทาง · คอลัมน์ = ปลายทาง · จุดสีของต้นทาง"""
    names = sorted(cross)
    head = "".join(f'<th title="{n}">{badge(n, 16)}</th>' for n in names)
    rows = ""
    for a in names:
        cells = "".join(f'<td>{"<i style=background:" + COLOR[a] + "></i>" if b in cross[a] else ("<b>·</b>" if a != b else "")}</td>' for b in names)
        rows += f'<tr><th class="rh">{badge(a, 16)}<span>{e(a)}</span></th>{cells}<td class="sum">{len(cross[a])}</td></tr>'
    got = "".join(f'<td class="sum">{sum(n in v for v in cross.values())}</td>' for n in names)
    return (f'<table class="mx"><thead><tr><th class="corner">ส่งจาก ↓ · ถึง →</th>{head}<th class="sum">ส่ง</th></tr></thead>'
            f'<tbody>{rows}<tr class="tot"><th class="rh">รับงาน</th>{got}<td></td></tr></tbody></table>')


def network(cross):
    """แผนภาพวงกลม: แกนกลางตรงกลาง · 11 plugin รอบวง · เส้นสี = งานที่ต้นทางส่งต่อให้ปลายทาง"""
    import math
    W, H, cx, cy, R, hub = 896, 480, 448, 240, 180, 64
    names = sorted(cross)
    pos = {n: (cx + R * math.cos(-math.pi / 2 + 2 * math.pi * i / len(names)),
               cy + R * math.sin(-math.pi / 2 + 2 * math.pi * i / len(names))) for i, n in enumerate(names)}
    defs, lines, nodes = [], [], []
    for n in names:
        c = COLOR[n]
        defs.append(f'<marker id="m-{n}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">'
                    f'<path d="M0 0 10 5 0 10z" fill="{c}" fill-opacity=".6"/></marker>')
    for a in names:
        for b in cross[a]:
            if b not in pos:  # ปลายทางที่ไม่อยู่ในวง (เช่น superuser ที่ไม่มีตารางงานข้ามสาขา)
                continue
            (x1, y1), (x2, y2) = pos[a], pos[b]
            mx, my = (x1 + x2) / 2 - cx, (y1 + y2) / 2 - cy
            d = math.hypot(mx, my)
            px, py = (-(y2 - y1), x2 - x1) if d < 1 else (mx, my)
            pl = math.hypot(px, py)
            reach = max(d, hub + 40)
            sgn = 1 if a < b else -1  # ไปกับกลับคนละเส้น
            ox, oy = -(y2 - y1) / math.hypot(x2 - x1, y2 - y1) * 8 * sgn, (x2 - x1) / math.hypot(x2 - x1, y2 - y1) * 8 * sgn
            tx, ty = cx + px / pl * reach + ox, cy + py / pl * reach + oy
            qx, qy = 2 * tx - (x1 + x2) / 2 - cx + cx, 2 * ty - (y1 + y2) / 2
            # หยุดก่อนถึงตรา 22 px
            def pull(x, y, fx, fy, k=26):
                L = math.hypot(fx - x, fy - y); return x + (fx - x) / L * k, y + (fy - y) / L * k
            sx, sy = pull(x1, y1, qx, qy, 30); ex, ey = pull(x2, y2, qx, qy, 34)
            lines.append(f'<path d="M{sx:.1f} {sy:.1f} Q{qx:.1f} {qy:.1f} {ex:.1f} {ey:.1f}" fill="none" stroke="{COLOR[a]}" '
                         f'stroke-width="1.5" stroke-opacity=".35" marker-end="url(#m-{a})"/>')
    spokes = "".join(f'<line x1="{cx}" y1="{cy}" x2="{x:.1f}" y2="{y:.1f}" stroke="#B9B3A6" stroke-width="2" stroke-dasharray="4 6"/>' for x, y in pos.values())
    for n, (x, y) in pos.items():
        right = x >= cx + 4; left = x <= cx - 4
        anchor, lx, ly = ("start", x + 32, y + 5) if right else ("end", x - 32, y + 5) if left else ("middle", x, y - 32)
        nodes.append(f'<rect x="{x - 22:.1f}" y="{y - 22:.1f}" width="44" height="44" rx="10" fill="{COLOR[n]}"/>'
                     f'<g transform="translate({x - 14:.1f} {y - 14:.1f}) scale(1.1667)" fill="none" stroke="#fff" stroke-width="1.8" '
                     f'stroke-linecap="round" stroke-linejoin="round">{SHAPE[n]}</g>'
                     f'<text x="{lx:.1f}" y="{ly:.1f}" text-anchor="{anchor}" font-size="15" font-weight="600" fill="#1A1B22">{e(n)}</text>')
    core = (f'<circle cx="{cx}" cy="{cy}" r="{hub}" fill="{COLOR["superuser"]}"/><circle cx="{cx}" cy="{cy}" r="{hub + 6}" fill="none" stroke="{COLOR["superuser"]}" stroke-width="2"/>'
            f'<g transform="translate({cx - 20} {cy - 36}) scale(1.6667)" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{SHAPE["superuser"]}</g>'
            f'<text x="{cx}" y="{cy + 26}" text-anchor="middle" font-size="15" font-weight="600" fill="#fff">superuser</text>'
            f'<text x="{cx}" y="{cy + 44}" text-anchor="middle" font-size="13" fill="#fff">แกนกลาง</text>')
    return (f'<svg class="net" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="Anuphan, sans-serif">'
            f'<defs>{"".join(defs)}</defs>{spokes}{"".join(lines)}{core}{"".join(nodes)}</svg>')


def build_overview(plugins):
    cards, totals = [], [0, 0, 0, 0]
    for plugin in plugins:
        data, labels = load(plugin)
        nums = [len(data["agents"]), len(data["skills"]) + len(data["core_skills"]), len(data["commands"]), len(data["playbooks"])]
        totals = [a + b for a, b in zip(totals, nums)]
        if plugin == "superuser":
            continue
        cards.append(f'<div class="card plug" style="--pc:{COLOR[plugin]}"><div class="cap">{badge(plugin, 28)}'
                     f'<span class="t">{e(plugin)}</span><span class="v">v{e(data["version"])}</span></div><div class="in">'
                     f'<div class="d">{e(labels.get("tagline", ""))}</div>'
                     f'<div class="nums">' + "".join(f'<div><b>{n}</b>{l}</div>' for n, l in zip(nums, ["agent", "skill", "คำสั่ง", "playbook"])) + '</div>'
                     f'<div class="handoff">{handoff_block(plugin, data["cross"], plugins)}</div></div></div>')
    core, _ = load("superuser")
    cards.append(f'<div class="card hubcard"><div class="row">{badge("superuser", 28)}<div class="t">plugins/superuser — ต้นฉบับกลาง</div></div>'
                 f'<div class="d">skill {" · ".join(core["core_skills"])} · agent brainstormer · reviewer · learning-reviewer · hook บันทึกงาน</div>'
                 '<div class="d"><code>scripts/sync/sync-superuser.mjs</code> คัดลอกชุดนี้ไปทุก plugin</div></div>')
    cross = {p: load(p)[0]["cross"] for p in plugins if p != "superuser"}
    net = (f'<div class="card netcard">{network(cross)}<div class="netkey">'
           f'<span><i class="k sync"></i>sync แกนกลางไปทุก plugin</span>'
           f'<span><i class="k hand"></i>งานข้ามสาขา {sum(len(v) for v in cross.values())} เส้น · สีเส้น = plugin ต้นทาง · หัวลูกศรชี้ plugin ที่รับงาน</span></div>'
           f'<div class="mxwrap"><div class="t">ใครส่งงานให้ใคร</div>{matrix(cross)}</div></div>')
    grid = f'<div class="grid g3">{"".join(cards)}</div>'
    metro = '<div class="metro">' + "".join(
        f'<div class="stn"><div class="dot"></div><div class="t">{a}</div><div class="small">{b}</div></div>' for a, b in [
            ("plugins/", "ต้นฉบับ"), ("validate", '<span class="nb">check/validate-marketplace</span>'), ("sync", "sync-docs · sync-superuser"),
            ("dist/", "build-targets: claude.ai · Codex · Gemini"), ("ติดตั้ง", "install-marketplace.ps1")]) + "</div>"
    strip = '<div class="strip">' + "".join(badge(p, 20) for p in plugins if p != "superuser") + "</div>"
    body = header("SQT-Marketplace", "ภาพรวม marketplace", "12 plugin ใช้แกน SuperUser เดียวกัน แต่ละตัวเติม agent · skill · playbook ของสาขาตัวเอง",
                  "plugins/*/.claude-plugin/plugin.json", "superuser",
                  [(totals[0], "agent"), (totals[1], "skill"), (totals[2], "คำสั่ง"), (totals[3], "playbook"), (len(plugins), "plugin")])
    body = body.replace('<div class="hero">', '<div class="hero ink short">', 1)
    body += sec(1, "แกนกลางเดียว · 11 สาขาส่งงานถึงกัน", "แก้ที่ plugins/superuser ที่เดียว แล้วรัน sync · งานที่เกินสาขาตัวเอง หัวหน้าทีมส่งต่อให้ plugin ที่ถนัด", net)
    body += sec(2, "plugin ของแต่ละสาขา · 11", "แถบสี + ตรา = plugin นั้น · ตัวเลข = จำนวนของในตัว (รวมของกลาง)", grid)
    body += sec(3, "จาก plugins/ ไปถึงเครื่องผู้ใช้", "ตรวจ → sync → build ด้วย build-dist.cmd คลิกเดียว", metro)
    body += footer("ตัวเลขในก้อนหัวรวมทุก plugin นับซ้ำของกลางในทุก plugin · ชิปตราเล็กใต้ \"ส่งต่อ\" = plugin ที่รับงานข้ามสาขา")
    return page("marketplace overview", body)


# ---------- รูปที่ 4 · hook ทำงานอย่างไร (อ่านจาก superuser-hook.mjs) ----------

def build_hook():
    def box(cls, title, text, side=""):
        s = f'<div class="side">{e(side)}</div>' if side else ""
        return f'<div class="box {cls}"><div class="t">{title}</div><div class="d">{text}</div>{s}</div>'
    down = '<div class="down">↓</div>'
    events = '<div class="grid g4">' + "".join(box("ev", ev, e(t)) for ev, t in [
        ("SessionStart", "เปิด session"), ("UserPromptSubmit", "ผู้ใช้ส่งข้อความ"),
        ("PostToolUse", "เครื่องมือทำงานเสร็จ"), ("PostToolUseFailure", "เครื่องมือล้ม")]) + "</div>"
    flow = '<div class="vflow">' + down.join([
        box("", "รัน node superuser-hook.mjs", "รับข้อมูลเหตุการณ์ทาง stdin · ตั้งเวลาไว้ 10 วินาที"),
        box("dec", "โปรเจกต์มี <code>.claude/superuser/</code> ไหม", "ไล่หาขึ้นไปทีละโฟลเดอร์ไม่เกิน 25 ชั้น · ข้ามโฟลเดอร์ home · รองรับ <code>.superuser/</code> แบบเก่า",
            "ไม่มี → ออกเงียบ ๆ (hook ไม่สร้างโฟลเดอร์ทีมเอง)"),
        box("dec", "plugin อื่นจดเหตุการณ์นี้ไปแล้วหรือยัง", "สร้างไฟล์ล็อกใน <code>_to_delete/superuser-lock/</code> จาก hash ของเหตุการณ์ · ช่วงละ 3 วินาที · ล็อกเกิน 2 นาทีลบทิ้ง",
            "มีตัวอื่นจดแล้ว → ออก (ติดตั้งหลาย plugin ก็ไม่จดซ้ำ)"),
        box("", "สร้างบันทึก 1 บรรทัด", "เวลา · session · agent · โมเดล · เครื่องมือ · เป้าหมาย · สำเร็จไหม · "
            "ตัดค่าลับออกก่อน (คีย์ · token · รหัสผ่าน · JWT) · ส่งงานให้ subagent → จดบทบาทและโมเดล · "
            "ข้อความผู้ใช้ที่มีคำอย่าง \"ไม่ใช่ · ผิด · ทำใหม่\" → ติดธง <code>correction: true</code>"),
        box("out", "เขียนต่อท้าย <code>log/&lt;วันที่&gt;/&lt;agent&gt;.jsonl</code>", "1 ไฟล์ต่อ agent ต่อวัน · อัปเดต <code>state.json</code> (โมเดลของแต่ละ agent · inbox ที่เห็นแล้ว)"),
        box("dec", "เป็นหัวหน้าทีม และมีเรื่องต้องบอกไหม", "เปิด session → เตือนให้อ่าน <code>CONTEXT.md</code> หัวข้อ \"รับงานต่อ\" · "
            "มีไฟล์ใหม่ใน <code>inbox/</code> → บอกจำนวนและชื่อ", "subagent ไม่ได้รับข้อความนี้"),
        box("out", "ส่งข้อความกลับเข้า context ของ Claude", "<code>hookSpecificOutput.additionalContext</code> · error ทุกอย่างถูกจับ แล้วออกด้วย 0 งานหลักไม่ล้มเพราะ hook"),
    ]) + "</div>"
    readers = '<div class="grid g3">' + "".join(box("out", a, e(b)) for a, b in [
        ("learning-reviewer", "ตอนจบงาน อ่านบรรทัดที่ correction: true และขั้นที่ล้ม → เสนอแก้ skill ไม่เกิน 3 ข้อ"),
        ("หัวหน้าทีม", "เปิด session ใหม่ อ่าน CONTEXT.md แล้วรับงานต่อจากที่ค้างไว้"),
        ("ผู้ใช้", "เปิด log ดูว่า agent ไหนทำอะไร ใช้โมเดลอะไร ล้มตรงไหน")]) + "</div>"
    body = header("SuperUser hook", "— ทำงานอย่างไร", "ไฟล์เดียวกันทุก plugin · จดทุกการทำงาน · บอกหัวหน้าทีมเมื่อมีงานรอ",
                  "plugins/*/hooks/hooks.json · superuser-hook.mjs")
    body += '<div class="steps">'
    body += step(1, "p", "เหตุการณ์ที่ทำให้ hook ทำงาน", "ตั้งไว้ใน hooks.json · PostToolUse ทุกเครื่องมือ (matcher *)", events)
    body += step(2, "a", "ทางเดินของเหตุการณ์ 1 ครั้ง", "กล่องเหลือง = จุดตัดสินใจ · ตัวหนังสือเหลือง = ทางที่ออกก่อน", flow)
    body += step(3, "g", "ใครอ่านสิ่งที่ hook จดไว้", "log คือหลักฐานของรอบเรียนรู้", readers)
    body += "</div>" + footer("ทุกอย่างอยู่ในเครื่องผู้ใช้ ไม่มีการส่งออกนอกเครื่อง")
    return page("superuser hook", body)


if __name__ == "__main__":
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    plugins = sorted(os.path.basename(f)[:-5] for f in glob.glob(os.path.join(HERE, "data", "*.json")))
    files = {"marketplace-overview": build_overview(plugins), "hook-lifecycle": build_hook()}
    for plugin in plugins:
        files[f"{plugin}-map"] = build_map(plugin)
        files[f"{plugin}-playbooks"] = build_playbooks(plugin)
    for name, content in files.items():
        open(os.path.join(out, f"{name}.html"), "w", encoding="utf-8").write(content)
    print(f"{len(files)} html → {out}")
    for w in warnings:
        print("เตือน:", w)
