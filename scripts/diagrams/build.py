"""สร้าง HTML ของรูป diagram ทุกใบจาก data/ + labels/ → โฟลเดอร์ที่ระบุ

python scripts/diagrams/build.py <โฟลเดอร์ html>
ได้: <plugin>-map.html (ทุก plugin) · marketplace-overview.html · hook-lifecycle.html · รูป playbook อยู่ที่ build_playbooks.py
ไม่มี labels/<plugin>.json → พิมพ์เตือน
"""
import glob, html, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from palette import COLOR, emblem
warnings = []


def e(text):
    return html.escape(str(text), quote=False)


def load(plugin):
    data = json.load(open(os.path.join(HERE, "data", f"{plugin}.json"), encoding="utf-8"))
    path = os.path.join(HERE, "labels", f"{plugin}.json")
    labels = json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {}
    if not labels:
        warnings.append(f"{plugin}: ไม่มี labels/{plugin}.json")
    return data, labels



# ---------- รูปที่ 1 · แผนผัง plugin (วงกลมบนลายจุด) ----------
# 1 รูป = 1 คำถาม: "ใน plugin นี้มีอะไร และคำขอของผู้ใช้ไปถึงตัวไหน"
# ซ้าย → ขวา: ทางเข้า 3 ทาง รวมเข้าหัวหน้าทีม แล้วแตกไปหา agent ทุกตัว · ใต้ลงมาคือ skill

from kit import kit as K  # noqa: E402  (ชิ้นส่วนกลางของรูปแนววงกลม)

CORE_SKILLS = set(json.load(open(os.path.join(HERE, "data", "superuser.json"), encoding="utf-8"))["core_skills"])

# CSS เฉพาะรูป map · overview · hook (kit ยังไม่มี: คอลัมน์ของ map · แถว agent · แถวของขั้น · วงกลมตรา)
EXTRA_CSS = """<style>
.stage{position:relative}
.cols{display:grid;grid-template-columns:176px 200px 1fr;column-gap:72px;align-items:center;position:relative;z-index:1}
.stack{display:flex;flex-direction:column;gap:32px;align-items:center}
.stack.ag{align-items:stretch;gap:16px}
.cols .node .sb{max-width:200px}
.cols .stack:nth-child(2) .node .sb{max-width:168px}
.arow{display:flex;gap:16px;align-items:center}
.arow .tx{min-width:0}
.arow .lb{font-weight:600;font-size:17px;line-height:1.4;display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center}
.arow .sb{font-size:15px;color:var(--ink3);line-height:1.5}
.nb{white-space:nowrap}
.band{position:relative;z-index:1;margin-top:48px;padding-top:24px;border-top:1px solid var(--rule)}
.band .cap{font-size:15px;color:var(--ink3);margin-bottom:24px}
.band .row{display:grid;gap:16px;justify-items:center;align-items:start}
.node.wide .sb{max-width:480px}
.node .tags{margin-top:2px}
.step{display:grid;grid-template-columns:96px 1fr;align-items:start;position:relative}
.step .dotcol{display:flex;justify-content:center}
.step .tx{padding:4px 0 0 8px}
.step .tx .lb{font-weight:600;font-size:17px;line-height:1.5}
.step .tx .sb{font-size:15px;color:var(--ink2);line-height:1.6;max-width:700px}
.step .tx .exit{margin-top:6px;font-size:15px;color:var(--ink3);display:flex;gap:8px;align-items:baseline}
.dot.dec{background:#fff;color:var(--pc);box-shadow:inset 0 0 0 3px var(--pc)}
.hookcol{display:flex;flex-direction:column;gap:40px;position:relative;z-index:1}
.ov{position:relative;height:var(--h)}
.ov .node{position:absolute;transform:translateX(-50%);z-index:2}
.ov svg.arcs{color:var(--line);position:absolute;inset:0;width:100%;height:100%;overflow:visible;z-index:0}
.ov .pn{position:absolute;display:flex;align-items:center;gap:12px;z-index:2;white-space:nowrap}
.ov .pn.l{flex-direction:row-reverse;text-align:right}
.ov .pn .lb{font-weight:600;font-size:17px;line-height:1.4}
.ov .pn .sb{font-size:15px;color:var(--ink3);line-height:1.5}
.ov .topn{position:absolute;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;text-align:center;gap:0;z-index:2;white-space:nowrap}
.ov .topn .lb{font-weight:600;font-size:17px;line-height:1.4}
.ov .topn .sb{font-size:15px;color:var(--ink3);line-height:1.5;margin-bottom:8px}
.ov .lab{position:absolute;width:190px;z-index:2}
.ov .lab.l{text-align:right}
.ov .lab .lb{font-weight:600;font-size:17px;line-height:1.4}
.ov .lab .sb{font-size:15px;color:var(--ink3);line-height:1.5}
.ov .cl{background:var(--bg);padding:4px 10px;border-radius:8px}
.dot.emb{background:var(--pc);overflow:hidden}
.dot.emb img{width:118%;height:118%;flex:none;display:block}
</style>"""


def agent_skills(a):
    return [s for s in a["skills"] if s not in CORE_SKILLS]


def names_line(names, k=2):
    """รายชื่อ agent ในบรรทัดเล็ก: แต่ละชื่อห้ามตัดที่ขีด"""
    return " · ".join(f'<span class="nb">{e(n)}{"&nbsp;…" if len(names) > k and i == k - 1 else ""}</span>' for i, n in enumerate(names[:k]))


def agent_row(aid, name_html, sub_html, tag_html=""):
    return (f'<div class="arow" id="{aid}w"><div class="dot agent" id="{aid}">{K.icon("bot")}</div>'
            f'<div class="tx"><div class="lb">{name_html}{tag_html}</div><div class="sb">{sub_html}</div></div></div>')


def build_map(plugin):
    data, labels = load(plugin)
    jobs = labels.get("agents", {})
    su_data, _ = load("superuser") if plugin != "superuser" else (data, labels)
    is_su = plugin == "superuser"
    n_pb = sum(not p["shared"] for p in data["playbooks"])
    n_shared = len(data["playbooks"]) - n_pb
    n_cmd = len(data["commands"])
    agents = data["agents"] if is_su else [a for a in data["agents"] if not a["core"]]

    # คอลัมน์ 1: ทางเข้า (วงกลมเขียว = ผู้ใช้)
    ents = [("พิมพ์ขอตรง ๆ", "เล่างานได้เลย")]
    if n_cmd:
        ents.append(("สั่งด้วยคำสั่ง", f'<span class="nb">/{e(plugin)}:…</span><br>มี {n_cmd} คำสั่ง'))
    ents.append(("เรียก agent ตรง", "พูดชื่อ agent ได้เลย"))
    col1 = "".join(f'<div class="node"><div class="dot user" id="en{i}">{K.icon("user")}</div><div class="lb">{e(t)}</div><div class="sb">{s}</div></div>'
                   for i, (t, s) in enumerate(ents))
    # คอลัมน์ 2: จุดเด่น = plugin สีของ plugin (หัวหน้าทีม)
    n_ag = sum(len([n for n in v if n in {a["name"] for a in agents}]) for v in labels["agent_groups"].values()) if "agent_groups" in labels else len(agents)
    extra_pb = f' <span class="nb">(+{n_shared} ของกลาง)</span>' if n_shared else ""
    col2 = K.node(plugin, "pc", ico="users", size="lg", id="focal",
                  extra=f'<div class="sb">หัวหน้าทีมรับงาน เลือกจาก {n_pb} playbook{extra_pb} แล้วส่งงานให้ agent ตัวใหม่ทีละขั้น</div>')
    # คอลัมน์ 3: agent
    rows, ids = "", []
    if "agent_groups" in labels:
        have = {a["name"] for a in agents}
        for i, (g, names) in enumerate(labels["agent_groups"].items()):
            names = [n for n in names if n in have]
            if names:
                ids.append(f"ag{i}")
                rows += agent_row(f"ag{i}", e(g), f'{len(names)} agent · {names_line(names)}')
    else:
        for i, a in enumerate(agents):
            ids.append(f"ag{i}")
            sk = agent_skills(a)
            tg = K.tag(f"{len(sk)} skill", "skill") if sk else K.tag("ใช้ skill กลาง", "core")
            rows += agent_row(f"ag{i}", f'<span class="nb">{e(a["name"])}</span>', e(jobs.get(a["name"], "")), tg)
    stage = f'<div class="cols"><div class="stack">{col1}</div><div class="stack">{col2}</div><div class="stack ag">{rows}</div></div>'

    # แถบ skill
    own = data["core_skills"] if is_su else data["skills"]
    groups = labels.get("skill_groups")
    gtags = ""
    if groups:
        ownset = set(own)
        counts = [(g, len([x for x in ss if x in ownset])) for g, ss in groups.items()]
        placed = {x for ss in groups.values() for x in ss}
        rest = len([x for x in own if x not in placed])  # skill ที่ labels ยังไม่จัดกลุ่ม: นับจาก data ไม่ให้ยอดหาย
        if rest:
            warnings.append(f"{plugin}: skill {rest} ตัวยังไม่อยู่ใน skill_groups ของ labels/{plugin}.json")
            counts.append(("ยังไม่จัดกลุ่ม", rest))
        gtags = '<div class="tags">' + "".join(K.tag(f"{g} · {n}") for g, n in counts if n) + "</div>"
    sk_node = K.node(f"skill {'กลางของทุก plugin' if is_su else 'ของ plugin นี้'} {len(own)} ตัว", "skill",
                     "แบ่งตามหน้าที่ · เลขท้ายคือจำนวน" if groups else "agent เปิดอ่านเมื่อถึงงานนั้น", extra=gtags).replace('class="node"', 'class="node wide"', 1)
    core_node = "" if is_su else (f'<div class="node"><div class="dot emb" style="--pc:{COLOR["superuser"]}">{emblem("superuser", 56)}</div><div class="lb">ของกลางจาก superuser</div>'
                                  f'<div class="sb">skill {len(data["core_skills"])} · agent {len([a for a in su_data["agents"] if a["core"]])} ใช้ร่วมทุก plugin</div></div>')
    band = (f'<div class="band"><div class="cap">ความรู้: skill คือคู่มือที่ agent เปิดอ่านก่อนลงมือ</div>'
            f'<div class="row" style="grid-template-columns:{"1fr" if is_su else "2.2fr 1fr"}">{sk_node}{core_node}</div></div>')

    pairs = [(f"en{i}", "focal", "") for i in range(len(ents))] + [("focal", a, "") for a in ids]
    stats = [(len(agents), "agent"), (len(own), "skill")]
    if not is_su:
        stats.append((len(data["core_skills"]), "skill กลาง (ใช้ร่วม)"))
    if n_cmd:
        stats.append((n_cmd, "คำสั่ง"))
    stats.append((n_pb, "playbook" + (f" (+{n_shared} ของกลาง)" if n_shared else "")))
    body = K.head(plugin, labels.get("tagline", ""), plugin, f"plugins/{plugin}/ · v{data['version']}", stats)
    body += f'<div class="stage">{K.wires(pairs)}{stage}</div>{band}'
    body += K.legend([("user", "ผู้ใช้", "user"), ("pc", "plugin · หัวหน้าทีม", "users"), ("agent", "agent", "bot"), ("skill", "skill", "book-open")]
                     )
    if not is_su:
        body = body + ""
        leg = leg_core = f'<span><div class="dot emb" style="--pc:{COLOR["superuser"]}">{emblem("superuser", 18)}</div>ของกลางจาก superuser</span>'
        body = body[:body.rindex("</div>")] + leg + "</div>"
    return K.page(f"{plugin} map", EXTRA_CSS + body, plugin)


# ---------- รูปที่ 3 · ภาพรวม marketplace ----------
# 1 รูป = 1 คำถาม: "6 plugin ใช้แกนกลางเดียวกันอย่างไร และส่งงานถึงกันที่ไหน"

def emblem_circle(plugin, size=80):
    return emblem(plugin, size)


def build_overview(plugins):
    """วงรอบแกนกลาง: เรียงให้ 9 เส้นส่งงานไม่ตัดกัน (ข้างใน 2 เส้นจากวงบนสุด · ข้างนอก 2 เส้นอ้อมใต้วง · ที่เหลือเป็นเส้นสั้นตามวง)"""
    import math
    W, cx, cy, RX, RY = 864, 432, 300, 240, 190
    want = ["e-commerce", "personal-life", "graphic-design", "software-company", "trading-finance"]
    ring = [p for p in want if p in plugins]
    n = len(ring)
    pos = [(cx + RX * math.sin(2 * math.pi * k / n), cy - RY * math.cos(2 * math.pi * k / n)) for k in range(n)]
    D = {p: load(p)[0] for p in plugins}
    cross = {p: [t for t in D[p]["cross"] if t in ring] for p in ring}
    R, r = 44, 24

    def trim(a, b, k):  # จุดบนขอบวง a ที่หันไปทาง b
        l = math.hypot(b[0] - a[0], b[1] - a[1])
        return a[0] + (b[0] - a[0]) / l * k, a[1] + (b[1] - a[1]) / l * k

    marks = lambda both, to_b: (' marker-start="url(#m-g)"' if (both or not to_b) else "") + (' marker-end="url(#m-g)"' if (both or to_b) else "")
    arcs, edges = [], sorted({tuple(sorted((ring.index(a), ring.index(b)))) for a in ring for b in cross[a]})
    outer = {}
    for i, j in edges:
        a, b = ring[i], ring[j]
        both = a in cross[b] and b in cross[a]
        to_b = b in cross[a]
        d = min(j - i, n - (j - i))
        pa, pb = pos[i], pos[j]
        if d == 1:      # เส้นสั้นตามวง โค้งออกนอกนิดหน่อย
            mx, my = (pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2
            ox, oy = mx - cx, my - cy
            ol = math.hypot(ox, oy)
            q = (mx + ox / ol * 22, my + oy / ol * 22)
            s, t = trim(pa, q, R), trim(pb, q, R + 4)
            path = f"M{s[0]:.1f} {s[1]:.1f} Q{q[0]:.1f} {q[1]:.1f} {t[0]:.1f} {t[1]:.1f}"
        elif i == 0:    # เส้นลัดข้างในจากวงบนสุด (ผ่านข้างแกนกลาง ไม่ผ่านป้าย)
            s, t = trim(pa, pb, R), trim(pb, pa, R + 4)
            path = f"M{s[0]:.1f} {s[1]:.1f} L{t[0]:.1f} {t[1]:.1f}"
        else:           # เส้นอ้อมนอกวง ใต้ป้ายของวงล่าง
            k = len(outer)
            outer[(i, j)] = k
            XA, XL, YA = cx + 345 + 50 * k, cx - 345 - 50 * k, cy + 305 + 40 * k
            y0 = pa[1] + 22 - 20 * k
            ye = pb[1] + (0 if pb[0] > cx - 200 and pb[1] > cy else 14)
            sx = pa[0] + math.sqrt(max(R * R - (22 - 20 * k) ** 2, 0)) + 4
            ex = pb[0] - R - 4 if pb[0] < cx else pb[0] + R + 4
            path = (f"M{sx:.1f} {y0:.1f} H{XA - r} Q{XA} {y0:.1f} {XA} {y0 + r:.1f} V{YA - r} Q{XA} {YA} {XA - r} {YA} H{XL + r} "
                    f"Q{XL} {YA} {XL} {YA - r} V{ye + r:.1f} Q{XL} {ye:.1f} {XL + r} {ye:.1f} H{ex:.1f}")
        arcs.append(f'<path d="{path}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"{marks(both, to_b)}/>')

    def pbn(d):
        return sum(not p["shared"] for p in d["playbooks"])
    su = D["superuser"]
    nodes = [f'<div class="node" style="left:{cx}px;top:{cy - 56}px">'
             f'<div class="dot emb" style="width:112px;height:112px;--pc:{COLOR["superuser"]}">{emblem_circle("superuser")}</div>'
             f'<div class="cl"><div class="lb">superuser</div><div class="sb">แกนกลาง · hook<br>skill {len(su["core_skills"])} · agent {len(su["agents"])}</div></div></div>']
    for k, p in enumerate(ring):
        x, y = pos[k]
        d = D[p]
        circ = f'<div class="dot lg emb" style="--pc:{COLOR[p]}">{emblem_circle(p)}</div>'
        one = f'agent {len(d["agents"])} · skill {len(d["skills"])} · playbook {pbn(d)}'
        two = f'agent {len(d["agents"])} · skill {len(d["skills"])}<br>playbook {pbn(d)}'
        if k == 0:
            nodes.append(f'<div class="topn" style="left:{x:.1f}px;top:{y + 40:.1f}px"><div class="lb">{e(p)}</div><div class="sb">{one}</div>{circ}</div>')
        else:
            nodes.append(f'<div class="node" style="left:{x:.1f}px;top:{y - 40:.1f}px">{circ}'
                         + ("" if y > cy else "") + "</div>")
            txt = f'<div class="lb">{e(p)}</div><div class="sb">{two}</div>'
            if y > cy + 20:   # วงล่าง: ป้ายใต้วง
                nodes[-1] = nodes[-1][:-6] + f'{txt}</div>'
            elif x > cx:      # วงบนขวา: ป้ายอยู่ขวาเหนือเส้นกลางวง
                nodes.append(f'<div class="lab" style="left:{x + 52:.1f}px;top:{y - 80:.1f}px">{txt}</div>')
            else:
                nodes.append(f'<div class="lab l" style="right:{W - x + 52:.1f}px;top:{y - 80:.1f}px">{txt}</div>')
    H = cy + 365
    n_hand = len(edges)
    body = K.head("SQT-Marketplace", f"{len(plugins)} plugin ใช้แกนกลางเดียวกัน แต่ละสาขาเติมของสาขาตัวเอง", "superuser",
                  "plugins/*/.claude-plugin/plugin.json",
                  [(len(plugins), "plugin"), (len(su["core_skills"]), "skill กลาง"), (len(su["agents"]), "agent กลาง"), (n_hand, "คู่ plugin ส่งงานหากัน")])
    defs = ('<marker id="m-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            '<path d="M1 1L9 5L1 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></marker>')
    body += (f'<div class="ov" style="--h:{H}px"><svg class="arcs" viewBox="0 0 {W} {H}"><defs>{defs}</defs>{"".join(arcs)}</svg>{"".join(nodes)}</div>')
    body += K.legend([], note="เส้นเทา = คู่ plugin ส่งงานหากัน (หัวลูกศรสองด้านคือส่งได้ทั้งสองทาง) · ตัวเลขข้างวงไม่นับของกลาง")
    return K.page("marketplace overview", EXTRA_CSS + body, "superuser")


# ---------- รูปที่ 4 · hook ทำงานอย่างไร (อ่านจาก superuser-hook.mjs) ----------
# 1 รูป = 1 คำถาม: "hook ทำอะไรกับเหตุการณ์ 1 ครั้ง"

def build_hook():
    def step(i, role, ico, title, text, exit_=""):
        ex = f'<div class="exit">{K.tag("ออก")}<span>{exit_}</span></div>' if exit_ else ""
        return (f'<div class="step"><div class="dotcol">{K.dot(role, ico, "lg" if role == "pc" else "", id=f"h{i}")}</div>'
                f'<div class="tx"><div class="lb">{title}</div><div class="sb">{text}</div>{ex}</div></div>')
    t1 = (f'<div class="step"><div class="dotcol">{K.dot("user", "terminal", id="h0")}</div><div class="tx"><div class="lb">เหตุการณ์ 4 แบบเรียก hook (ตั้งไว้ใน hooks.json)</div>'
          f'<div class="tags" style="justify-content:flex-start;margin-top:4px">{"".join(K.tag(x, "user") for x in ["SessionStart", "UserPromptSubmit", "PostToolUse", "PostToolUseFailure"])}</div>'
          f'<div class="sb">เปิด session · ผู้ใช้ส่งข้อความ · เครื่องมือทำงานเสร็จ · เครื่องมือล้ม</div></div></div>')
    steps = [
        step(1, "pc", "workflow", "รัน superuser-hook.mjs", "รับข้อมูลเหตุการณ์ทาง stdin · ตั้งเวลาไว้ 10 วินาที"),
        step(2, "dec", "git-branch", "โปรเจกต์มี <code>.claude/superuser/</code> ไหม", "ไล่หาขึ้นไปทีละโฟลเดอร์ไม่เกิน 25 ชั้น · ข้ามโฟลเดอร์ home",
             "ไม่มี → hook ไม่สร้างโฟลเดอร์ทีมเอง"),
        step(3, "dec", "git-branch", "plugin อื่นจดเหตุการณ์นี้แล้วหรือยัง", "เทียบจาก hash ของเหตุการณ์ในช่วง 3 วินาที · ไฟล์ล็อกเกิน 2 นาทีลบทิ้ง",
             "มีตัวอื่นจดแล้ว → ติดตั้งหลาย plugin ก็ไม่จดซ้ำ"),
        step(4, "agent", "file-text", "สร้างบันทึก 1 บรรทัด", "เวลา · session · agent · โมเดล · เครื่องมือ · เป้าหมาย · สำเร็จไหม · ตัดค่าลับ (คีย์ token รหัสผ่าน JWT) ออกก่อน · "
             "ข้อความที่มีคำอย่าง \"ไม่ใช่ · ผิด · ทำใหม่\" ติดธง <code>correction: true</code>"),
        step(5, "agent", "file-text", "เขียนต่อท้าย <code>log/&lt;วันที่&gt;/&lt;agent&gt;.jsonl</code>", "1 ไฟล์ต่อ agent ต่อวัน · อัปเดต <code>state.json</code> · learning-reviewer อ่านบรรทัดที่ติดธงตอนจบงาน"),
        step(6, "dec", "git-branch", "เป็นหัวหน้าทีม และมีเรื่องต้องบอกไหม", "เปิด session → เตือนให้อ่านหัวข้อ \"รับงานต่อ\" ใน <code>CONTEXT.md</code> · มีไฟล์ใหม่ใน <code>inbox/</code> → บอกจำนวนและชื่อ",
             "subagent ไม่ได้รับข้อความนี้"),
        step(7, "user", "message-square", "ส่งข้อความกลับเข้า context ของ Claude", "ผ่าน <code>hookSpecificOutput.additionalContext</code> · error ทุกอย่างถูกจับแล้วออกด้วย 0 งานหลักไม่ล้มเพราะ hook"),
    ]
    pairs = [("h0", "h1", "main")] + [(f"h{i}", f"h{i + 1}", "main" if i in (1, 4) else "") for i in range(1, 7)]
    body = K.head("SuperUser hook", "เหตุการณ์ 1 ครั้งผ่านอะไรบ้าง ตั้งแต่ hook เริ่มจนถึงข้อความที่ Claude ได้รับ", "superuser",
                  "plugins/*/hooks/hooks.json · superuser-hook.mjs")
    body += f'<div class="stage">{K.wires(pairs)}<div class="hookcol">{t1}{"".join(steps)}</div></div>'
    body += K.legend([("user", "เหตุการณ์เข้า", "terminal"), ("pc", "hook", "workflow"), ("dec", "จุดตัดสินใจ", "git-branch"),
                      ("agent", "จดบันทึก", "file-text"), ("user", "ข้อความกลับ", "message-square")],
                     note="ทุกอย่างอยู่ในเครื่องผู้ใช้ ไม่ส่งออกนอกเครื่อง")
    return K.page("superuser hook", EXTRA_CSS + body, "superuser")


if __name__ == "__main__":
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    plugins = sorted(os.path.basename(f)[:-5] for f in glob.glob(os.path.join(HERE, "data", "*.json")))
    files = {"marketplace-overview": build_overview(plugins), "hook-lifecycle": build_hook()}
    for plugin in plugins:
        files[f"{plugin}-map"] = build_map(plugin)
    for name, content in files.items():
        open(os.path.join(out, f"{name}.html"), "w", encoding="utf-8").write(content)
    print(f"{len(files)} html → {out}")
    for w in warnings:
        print("เตือน:", w)
