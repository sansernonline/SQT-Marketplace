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

# CSS เฉพาะรูป map · overview · hook (ของ kit ยังไม่มี: เลย์เอาต์ map · แถวของขั้นใน hook · วงตรา)
EXTRA_CSS = """<style>
.stage{position:relative}
.stage.tb{display:flex;flex-direction:column;gap:56px}
.entry{max-width:640px}
.entry .icard{align-self:stretch;justify-content:center}
.agg{margin-left:76px}  /* เยื้องให้ลำต้นจากวงหัวหน้าทีมลงมาทางซ้ายนอกกรอบ */
.agl{display:flex;flex-direction:column;gap:16px}
.vrow .lb .tag{margin-left:8px;vertical-align:middle}
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
.dot.emb{background:var(--pc);overflow:hidden}
.dot.emb img{width:118%;height:118%;flex:none;display:block}
.fan.p5{gap:12px}
.fan.p5 .icard{padding:14px 8px;align-self:stretch;justify-content:flex-start}
.fan.p5 .sb{max-width:none}
.fan.p5 .to{margin-top:6px;border-top:1px solid var(--rule);padding-top:6px}
</style>"""


def agent_skills(a):
    return [s for s in a["skills"] if s not in CORE_SKILLS]


def names_line(names, k=2):
    """รายชื่อ agent ในบรรทัดเล็ก: แต่ละชื่อห้ามตัดที่ขีด"""
    return " · ".join(f'<span class="nb">{e(n)}{"&nbsp;…" if len(names) > k and i == k - 1 else ""}</span>' for i, n in enumerate(names[:k]))


def agent_row(aid, name_html, sub_html, tag_html=""):
    return (f'<div class="vrow wide">{K.dot("agent", "bot", id=aid)}'
            f'<div class="card"><div class="lb">{name_html}{tag_html}</div><div class="sb">{sub_html}</div></div></div>')


def icard(label, sub, role, ico, id="", cls="col", extra=""):
    """การ์ดขาวมีวงไอคอน · เส้นต่อเข้าขอบการ์ด (id อยู่ที่การ์ด)"""
    return (f'<div class="card icard {cls}" id="{id}">{K.dot(role, ico)}'
            f'<div><div class="lb">{e(label)}</div><div class="sb">{sub}</div>{extra}</div></div>')


def build_map(plugin):
    data, labels = load(plugin)
    jobs = labels.get("agents", {})
    su_data, _ = load("superuser") if plugin != "superuser" else (data, labels)
    is_su = plugin == "superuser"
    n_pb = sum(not p["shared"] for p in data["playbooks"])
    n_shared = len(data["playbooks"]) - n_pb
    n_cmd = len(data["commands"])
    agents = data["agents"] if is_su else [a for a in data["agents"] if not a["core"]]

    # แถวบน: ทางเข้า (วงม่วง = ผู้ใช้)
    ents = [("พิมพ์ขอตรง ๆ", "เล่างานได้เลย")]
    if n_cmd:
        ents.append(("สั่งด้วยคำสั่ง", f'<span class="nb">/{e(plugin)}:…</span><br>มี {n_cmd} คำสั่ง'))
    ents.append(("เรียก agent ตรง", "พูดชื่อ agent ได้เลย"))
    top = K.group("ทางเข้า", f'<div class="fan" style="grid-template-columns:repeat({len(ents)},minmax(0,1fr))">'
                  + "".join(icard(t, s, "user", "user", id=f"en{i}") for i, (t, s) in enumerate(ents)) + "</div>", "entry")
    # แถวหัวหน้าทีม: วง plugin + การ์ดขอบสี plugin
    extra_pb = f' <span class="nb">(+{n_shared} ของกลาง)</span>' if n_shared else ""
    lead = (f'<div class="vrow wide">{K.dot("pc", "users", id="focal")}'
            f'<div class="card hub" style="width:auto;margin:0"><div class="lb">{e(plugin)} · หัวหน้าทีม</div>'
            f'<div class="sb">หัวหน้าทีมรับงาน เลือกจาก {n_pb} playbook{extra_pb} แล้วส่งงานให้ agent ตัวใหม่ทีละขั้น</div></div></div>')
    # รายการ agent
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
    unit = "กลุ่ม" if "agent_groups" in labels else "ตัว"
    stage = f'{top}{lead}' + K.group(f"agent {len(ids)} {unit}", f'<div class="agl">{rows}</div>', "agg")

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
            + K.group("skill ที่ agent ใช้", f'<div class="row" style="grid-template-columns:{"1fr" if is_su else "2.2fr 1fr"}">{sk_node}{core_node}</div>') + "</div>")

    pairs = [(f"en{i}", "focal", "main") for i in range(len(ents))] + [("focal", a, "t") for a in ids]
    stats = [(len(agents), "agent"), (len(own), "skill")]
    if not is_su:
        stats.append((len(data["core_skills"]), "skill กลาง (ใช้ร่วม)"))
    if n_cmd:
        stats.append((n_cmd, "คำสั่ง"))
    stats.append((n_pb, "playbook" + (f" (+{n_shared} ของกลาง)" if n_shared else "")))
    body = K.head(plugin, labels.get("tagline", ""), plugin, f"plugins/{plugin}/ · v{data['version']}", stats)
    body += f'<div class="stage tb">{K.wires(pairs)}{stage}</div>{band}'
    body += K.legend([("user", "ผู้ใช้", "user"), ("pc", "plugin · หัวหน้าทีม", "users"), ("agent", "agent", "bot"), ("skill", "skill", "book-open")])
    if not is_su:
        leg = f'<span><div class="dot emb" style="--pc:{COLOR["superuser"]}">{emblem("superuser", 18)}</div>ของกลางจาก superuser</span>'
        body = body[:body.rindex("</div>")] + leg + "</div>"
    return K.page(f"{plugin} map", EXTRA_CSS + body, plugin)


# ---------- รูปที่ 3 · ภาพรวม marketplace ----------
# 1 รูป = 1 คำถาม: "6 plugin ใช้แกนกลางเดียวกันอย่างไร และส่งงานถึงกันที่ไหน"

def build_overview(plugins):
    """บนลงล่าง: การ์ดแกนกลางอยู่บน การ์ดสาขา 5 ใบอยู่ล่าง · การส่งงานหากันเขียนเป็นข้อความในการ์ด ไม่ลากเส้นไขว้"""
    ring = [p for p in ["e-commerce", "personal-life", "graphic-design", "software-company", "trading-finance"] if p in plugins]
    D = {p: load(p)[0] for p in plugins}
    cross = {p: [t for t in D[p]["cross"] if t in ring] for p in ring}
    su = D["superuser"]

    def pbn(d):
        return sum(not p["shared"] for p in d["playbooks"])

    emb = lambda p, size, cls="": f'<div class="dot {cls} emb" style="--pc:{COLOR[p]}">{emblem(p, size)}</div>'
    hub = (f'<div class="card icard hub" id="su" style="--pc:{COLOR["superuser"]}">{emb("superuser", 56, "lg")}'
           f'<div><div class="lb">superuser · แกนกลาง</div>'
           f'<div class="sb">hook · skill กลาง {len(su["core_skills"])} · agent กลาง {len(su["agents"])}<br>ทุก plugin ใช้ร่วมกัน</div></div></div>')
    cards = []
    for k, p in enumerate(ring):
        d = D[p]
        to = ('<div class="to"><div class="sb">ส่งงานต่อให้</div>' + "".join(f'<div class="sb"><span class="nb">{e(t)}</span></div>' for t in cross[p]) + "</div>") if cross[p] else ""
        cards.append(f'<div class="card icard col" id="p{k}" style="--pc:{COLOR[p]}">{emb(p, 56, "lg")}'
                     f'<div><div class="lb">{e(p)}</div><div class="sb">agent {len(d["agents"])} · skill {len(d["skills"])}<br>playbook {pbn(d)}</div>{to}</div></div>')
    n_hand = len({frozenset((a, b)) for a in ring for b in cross[a]})
    body = K.head("SQT-Marketplace", f"{len(plugins)} plugin ใช้แกนกลางเดียวกัน แต่ละสาขาเติมของสาขาตัวเอง", "superuser",
                  "plugins/*/.claude-plugin/plugin.json",
                  [(len(plugins), "plugin"), (len(su["core_skills"]), "skill กลาง"), (len(su["agents"]), "agent กลาง"), (n_hand, "คู่ plugin ส่งงานหากัน")])
    pairs = [("su", "ring", "main")]  # ทุก plugin สาขาใช้แกนเดียวกัน → เส้นเดียวเข้ากรอบกลุ่ม
    fan = f'<div class="fan p5" style="grid-template-columns:repeat({len(ring)},minmax(0,1fr))">{"".join(cards)}</div>'
    body += f'<div class="stage tb">{K.wires(pairs)}{hub}{K.group(f"plugin สาขา {len(ring)} ตัว", fan, id="ring")}</div>'
    body += K.legend([], note="ในการ์ด: ส่งงานต่อให้ = plugin ที่รับงานต่อจากสาขานั้น · ตัวเลขในการ์ดไม่นับของกลาง")
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
