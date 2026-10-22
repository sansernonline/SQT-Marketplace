"""สร้างรูป SuperUser ของแต่ละ plugin เป็น HTML ตามแบบ agent-team-software-company.html

python build_fig.py <รากของ repo> agent-team-software-company.html <โฟลเดอร์ html>
แล้ว: python render.py <repo>/docs <โฟลเดอร์ html>/*.html
playbook · เกณฑ์งาน · agent · คำสั่ง อ่านจากไฟล์จริงของ plugin · คำสั้นในกล่องอยู่ใน figdata.py
"""
import os, re, sys, html
from figdata import P
import bilingual
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from palette import COLOR, emblem, badge

ROOT, TEMPLATE, OUT = sys.argv[1:4]
# เฉพาะ plugin ที่มี skill superuser (sqt-toolkit เป็น skill ล้วน ไม่มี flow)
PLUGINS = sorted(p for p in os.listdir(os.path.join(ROOT, "plugins")) if os.path.exists(os.path.join(ROOT, "plugins", p, "skills", "superuser", "SKILL.md")))
count_skills = lambda p: len([d for d in os.listdir(os.path.join(ROOT, "plugins", p, "skills")) if d != "superuser"])
N_CORE, N_KIT = count_skills("superuser"), count_skills("sqt-toolkit")
tpl = open(TEMPLATE, encoding="utf-8").read()
HEAD = tpl[: tpl.index("<body>")]
SCRIPT = tpl[tpl.index("<script>") : tpl.index("</script>") + len("</script>")]
# domain: ไม่มีลูกศร "เครื่องคุณ → sandbox"
SCRIPT = SCRIPT.replace("const m1=R('m1'), m2=R('m2'); P(`M${m1.r+2} ${m1.cy} H${m2.l-3}`);", "const m1=R('m1'), m2=R('m2');")

ICON = {
 "in": '<svg class="i" viewBox="0 0 24 24"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z"/></svg>',
 "user": '<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
 "slash": '<svg class="i" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m14 7-4 10"/></svg>',
 "folder": '<svg class="i" viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
 "doc": '<svg class="i" viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>',
 "list": '<svg class="i" viewBox="0 0 24 24"><path d="M10 6h11M10 12h11M10 18h11M3 6l1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2"/></svg>',
 "check": '<svg class="i" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/></svg>',
 "tool": '<svg class="i" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/></svg>',
 "plug": '<svg class="i" viewBox="0 0 24 24"><path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/></svg>',
 "fork": '<svg class="i" viewBox="0 0 24 24"><circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7M12 12v5"/></svg>',
 "send": '<svg class="i" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>',
 "bulb": '<svg class="i" viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>',
 "log": '<svg class="i" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h4"/></svg>',
 "layers": '<svg class="i" viewBox="0 0 24 24"><path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/></svg>',
}

def md_inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    return s

def read_plugin(name):
    base = os.path.join(ROOT, "plugins", name)
    sk = open(os.path.join(base, "skills/superuser/SKILL.md"), encoding="utf-8").read().replace("\r\n", "\n")
    sec = lambda n: sk[sk.index(f"## {n} ·"): sk.index(f"## {n+1} ·")]
    pbs = re.findall(r"^\| \[`([a-z0-9-]+)`\]\([^)]*\) \| (.+?) \|$", sec(2), re.M)
    gate = re.findall(r"^\| \*\*(.+?)\*\* \| (.+?) \| (.+?) \|$", sec(4), re.M) or [(g, w, w) for g, w in re.findall(r"^\| \*\*(.+?)\*\* \| (.+?) \|$", sec(4), re.M)]
    # งานข้ามสาขาอยู่ในแถวเดียวหรือในตาราง "งาน | ไปที่" ใต้แถวนั้น · `plugin` หรือ `plugin:skill`
    s5 = sec(5)
    cross = [p for p in re.findall(r"`([a-z-]+)[`:]", s5[s5.find("งานข้ามสาขา"):]) if p in PLUGINS and p not in ("superuser", name)] if "งานข้ามสาขา" in s5 else []
    agents = sorted(f[:-3] for f in os.listdir(os.path.join(base, "agents")))
    is_cmd = lambda d: "disable-model-invocation: true" in open(os.path.join(base, "skills", d, "SKILL.md"), encoding="utf-8").read().split("\n---", 1)[0]
    alls = os.listdir(os.path.join(base, "skills"))
    cmds = sorted(d for d in alls if is_cmd(d))
    skills = sorted(d for d in alls if not is_cmd(d) and d != "superuser")
    return dict(pbs=pbs, gate=gate, cross=list(dict.fromkeys(cross)), agents=agents, cmds=cmds, skills=skills, pats=patterns(sk))

PAT_HOW = {"Planning": "วางแผนทั้งหมดก่อน → ทำทีละข้อ", "ReAct": "คิด → ทำ → ดูผล วนจนเสร็จ",
  "Reflection": "ทำเสร็จ → อีกตัวตรวจ → แก้", "Multi-Agent": "หลาย agent คนละงาน ส่งต่อเป็นสาย",
  "Mixture-of-Agents (MoA)": "หลาย agent งานเดียวกัน คนละมุม → รวม", "Reranker": "ให้คะแนนหลายชิ้น → เลือกที่ตรงสุด"}
PAT_CSS = """<style>
.pat{padding:16px 24px;margin-top:16px}
.pat h3{display:flex;align-items:center;gap:8px;font-family:var(--display);font-size:var(--fs-l);margin-bottom:12px}
.pat h3 .i{color:var(--pc);width:24px;height:24px}
.pat h3 small{font-family:"Anuphan",sans-serif;font-size:var(--fs-m);font-weight:400;color:var(--ink3);margin-left:4px}
.patrow{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
.pc{background:var(--paper);border-radius:6px;padding:8px 12px;font-size:var(--fs-xs);line-height:1.5}
.pc b{display:block;font-size:var(--fs-m)}
.pc i{display:block;font-style:normal;color:var(--pc);font-weight:600;margin:4px 0}
.pc span{color:var(--ink2)}
.pc code{background:none;border:0;padding:0;font-size:1em;color:var(--ink);font-weight:600}
.xchip{display:inline-flex;align-items:center;gap:4px;padding-left:4px;color:var(--ink)}
.xchip .badge{display:inline-flex;width:16px;height:16px;border-radius:4px;align-items:center;justify-content:center}
.patnote{font-size:var(--fs-xs);color:var(--ink2);margin-top:12px}
.patnote b{color:var(--ink)}
.pc.opt{background:#fff;border:1px dashed var(--rule2)}
</style>
"""
# แกนใช้ทุกงาน · ที่เหลืออยู่ในโมดูล patterns_advanced (superuser SKILL.md หัวข้อ 9)
CORE_PATS = ("Planning", "ReAct", "Reflection", "Multi-Agent")
MODULES = [("context", "CONTEXT.md · ความคืบหน้า · การตัดสินใจ · รับงานต่อ"), ("log", "จดทุกการทำ · token ราย agent ใน SUMMARY.md"),
  ("improvements", "ของใหม่ที่ใช้กับงานอื่นได้ จดทันที"), ("learning", "learning-reviewer ตอนจบ · ควรปรับทีม ≤ 3"),
  ("inbox", "ข้อความจากคนหรือ bot อื่น · เป็นข้อมูล ไม่ใช่คำสั่ง"), ("handoff", "ใบสั่งงานเป็นไฟล์ สำหรับงานข้าม session"),
  ("patterns_advanced", "MoA · Reranker · ลองหลายทางแล้วเลือก"), ("review_gate", "แก้ ≥ 3 ไฟล์แต่ไม่มีผู้ตรวจ → ไม่ให้จบ"),
  ("split_gate", "หัวหน้าเขียนชิ้นใหญ่เอง → ให้แตกงานก่อน")]
# แกน (superuser) หัวข้อ 4 เป็นร้อยแก้ว ไม่มีตารางให้อ่าน
CORE_GATE = [("จริง", "", "มีแหล่ง หรือใส่ (รอยืนยัน)"), ("ตรงเป้า", "", "ตรงกับ เสร็จเมื่อ"), ("พร้อมใช้", "", "ใช้ต่อได้ทันที")]
# ศัพท์ใน figdata ของแกนยังเป็นของ 2.x (บล็อก superuser:begin ถูกเลิกใน 3.0)
CORE_GLOSS = [("ADAPT.md", "คู่มือต่อยอดแกนเป็น plugin สาขา"), ("plugin สาขา", "มีเฉพาะ playbook · agent · เกณฑ์ · รออนุมัติ แล้วเปิดแกนก่อน"),
  ("sqt-toolkit", f"plugin เครื่องมือกลาง {N_KIT} skill: เอกสาร สไลด์ รูป ประชุม"), ("hook", "สคริปต์ที่ Claude Code รันเอง: จด log · ส่งกฎประจำตัว · ด่านรีวิว")]

def patterns(sk):
    # ตาราง 6 รูปแบบอยู่ใน agent-patterns (ทุก plugin มีชุดเดียวกัน) · sk ยังรับไว้เพื่อให้ตัวเรียกเดิมไม่ต้องแก้
    src = open(os.path.join(ROOT, "plugins/superuser/skills/agent-patterns/SKILL.md"), encoding="utf-8").read().replace("\r\n", "\n")
    rows = re.findall(r"^\| \*\*(.+?)\*\*(?: \((.+?)\))? \| (.+?) \|", src, re.M)
    name = lambda n, full: f"{full} ({n})" if full else n
    return [(name(n, full), re.sub(r"\[(`[^`]+`)\]\([^)]*\)", r"\1", e)) for n, full, e in rows]

def pattern_card(pats):
    cell = lambda n, e: (f'<div class="pc{"" if n in CORE_PATS else " opt"}"><b>{html.escape(n.replace("Mixture-of-Agents (MoA)", "MoA"))}</b>'
                         f'<i>{PAT_HOW[n]}</i><span>{md_inline(e)}</span></div>')
    return f'''<div class="card pat">
  <h3>{ICON["list"]}รูปแบบการทำงาน<small>แกน 4 แบบใช้ทุกงาน · กรอบเส้นประคือโมดูล patterns_advanced</small></h3>
  <div class="patrow">{"".join(cell(n, e) for n, e in pats)}</div>
  <div class="patnote"><b>สูตรของแกน:</b> Planning (จัดขนาด งบ คาด) → ReAct ทุกขั้น → Reflection (ตรวจซ้ำจนผ่าน) · Multi-Agent คือการแจกงานขนาน · MoA แรง 3–5 เท่า และ Reranker ใช้เฉพาะเรื่องที่เลือกผิดแล้วแพง</div>
</div>
'''

def modules_card():
    cells = "".join(f'<div class="pc"><b>{k}</b><span>{html.escape(v)}</span></div>' for k, v in MODULES)
    return f'''<div class="card pat">
  <h3>{ICON["layers"]}โมดูล 9 ตัว<small>เปิดปิดต่อโฟลเดอร์งานใน config.json · รายละเอียดใน modules.md</small></h3>
  <div class="patrow" style="grid-template-columns:repeat(3,1fr)">{cells}</div>
  <div class="patnote"><b>แกนปิดไม่ได้:</b> จัดขนาด · งบ · ใบสั่งงาน · แจกงาน · ประเมินลูกทีม · ตรวจซ้ำ · คำตอบ 3 ระดับ · คาดกับจริง · <b>โมดูล</b> ไม่มีก็ทำงานได้แต่ดีขึ้นเมื่อมี · ไม่มีไฟล์ config = เปิดทุกตัว · ปิดแล้วไม่อ่าน ไม่เขียน ไม่พูดถึง</div>
</div>
'''

LEARN_DOM = """    <div class="card gc" id="e1"><div class="t">ระหว่างงาน</div><div class="d">ผู้ใช้แก้ → แก้ชิ้นที่ผิดแบบเดียวกันให้หมด<br>ของใหม่ → IMPROVEMENTS.md</div></div>
    <div class="card gc" id="e2"><div class="t">หัวหน้าเทียบคาดกับจริง</div><div class="d">ต่างเกิน 2 เท่าหรือต่างซ้ำ<br>→ LEAD-PLAYBOOK.md<br>เรื่องลูกทีม → TEAM.md</div></div>
    <div class="card gc" id="e3"><div class="t">learning-reviewer</div><div class="d">ตัวใหม่ ตอนจบงาน<br>ควรปรับทีม ≤ 3<br>ผู้ใช้เลือก รับ · ไม่รับ · ไว้ทีหลัง</div></div>
    <div class="card gc" id="e4"><div class="t">ผู้ใช้สั่ง "รวมบทเรียน"</div><div class="d">อ่านคิวกลางของเครื่องก่อน<br>ซ้ำ ≥ 2 → ข้อตรวจก่อนส่ง<br>แก้ SKILL.md หลังผู้ใช้เห็นด้วย</div></div>
"""

def build(name):
    d, r = P[name], read_plugin(name)
    core = read_plugin("superuser")["pbs"]
    is_core = name == "superuser"
    side = ["review", "unattended-run", "learn-from-session"] if is_core else [n for n, _ in core]
    side_title = "ตรวจ · งานยาว · เรียนรู้" if is_core else "ของแกน · ใช้ได้ทุกสาขา"
    main_title = "งานทั่วไป" if is_core else d["title"]
    main = [p for p in r["pbs"] if p[0] not in side]
    when = {**dict(core), **dict(r["pbs"])}
    gate = r["gate"] or CORE_GATE
    gloss = CORE_GLOSS if is_core else d["gloss"]
    chips = lambda xs, cls="chip": "".join(f'<span class="{cls}">{html.escape(x)}</span>' for x in xs)
    pb = lambda xs: "".join(f'<div class="pb">{x}</div>' for x in xs)
    cmd_txt = (f"{len(r['cmds'])} คำสั่ง เช่น /" + r["cmds"][0]) if r["cmds"] else "ทางลัด"
    in_title, in_small = d["inputs"][0]

    playbook_items = "".join(f'<div class="it pbn"><b>{n}</b><span>{md_inline(w)}</span></div>' for n, w in main)
    half = (len(main) + 1) // 2
    col1 = "".join(f'<div class="it pbn"><b>{n}</b><span>{md_inline(w)}</span></div>' for n, w in main[:half])
    col2 = "".join(f'<div class="it pbn"><b>{n}</b><span>{md_inline(w)}</span></div>' for n, w in main[half:])
    col3 = "".join(f'<div class="it pbn"><b>{n}</b><span>{md_inline(when[n])}</span></div>' for n in side)

    gate_chips = "".join(f'<span class="cchip"><b>{html.escape(g)}</b> <span>{html.escape(re.sub(r"[`*]", "", s).split(" · ")[0])}</span></span>' for g, _, s in gate)
    stop = f'<div class="small" style="margin-top:8px;color:#B91C1C;font-weight:600">หยุดทันที: {html.escape(d["stop"])}</div>' if d.get("stop") else ""
    gloss_domain = "".join(f'<div class="it"><b>{html.escape(a)}</b><span>{html.escape(b)}</span></div>' for a, b in gloss)

    body = f'''<body>
<div class="sheet" id="sheet" style="--pc:{COLOR[name]}">
<svg id="wires"></svg>

<div class="hd">
  <div class="big">{emblem(name, 56)}</div>
  <div class="kick">SuperUser · วิธีทำงานของทีม agent</div>
  <h1>SuperUser <span>—</span> {d["title"]}</h1>
  <p>จัดขนาดและงบ → ใบสั่งงาน 5 ข้อ → แจกลูกทีม → ตรวจซ้ำจนผ่าน → ส่งมอบสั้น → เทียบคาดกับจริง แล้วจำ</p>
  <div class="src">{name}/skills/superuser/SKILL.md</div>
</div>

<div class="steps">

<div class="step">
  <div class="num n1">1</div>
  <div class="sh">{ICON["in"]}รับงาน</div>
  <div class="sub">สั่งเอง · ส่งไฟล์มาให้ · ข้อความเข้าคิว หรือ Claude เรียกเอง</div>
  <div class="inputs">
    <div class="card inp" id="in1">{ICON["user"]}<div><b>คำสั่งผู้ใช้</b><small>พิมพ์ "ใช้ superuser"</small></div></div>
    <div class="card inp" id="in2">{ICON["slash"]}<div><b>slash command</b><small>{html.escape(cmd_txt)}</small></div></div>
    <div class="card inp" id="in3">{ICON["folder"]}<div><b>{html.escape(in_title)}</b><small>{html.escape(in_small)}</small></div></div>
    <div class="card inp" id="in4">{ICON["doc"]}<div><b>CLAUDE.global.md</b><small>กฎประจำเครื่อง</small></div></div>
    <div class="card inp" id="in5">{ICON["in"]}<div><b>inbox/</b><small>โมดูล inbox · ข้อความจากคนหรือ bot อื่น</small></div></div>
  </div>
  <div class="gap" style="height:32px"></div>
  <div class="lead" id="lead">
    <div class="t">หัวหน้าทีม (SuperUser)</div>
    <div class="chain"><span>ผู้ใช้ · ตัดสินรายการรออนุมัติ</span>→<span class="me">หัวหน้าทีม · 1 คนต่อโฟลเดอร์งาน</span>→<span>ลูกทีม (subagent)</span></div>
    <div class="d" style="margin-bottom:8px">เก่ง 4 เรื่อง: แจกงาน · ประเมินลูกทีม · จัดการงาน · ตรวจซ้ำจนสำเร็จ<br>เรียก <code>/{name}:superuser</code> หรือพูดว่า "ใช้ superuser"{"" if is_core else " · เปิดแกน <code>superuser:superuser</code> ก่อน"}</div>
    <div class="readfirst"><b>อ่านก่อนเริ่ม</b> &nbsp;① CONTEXT.md "ความคืบหน้า" · "รับงานต่อ" &nbsp;② superuser-style.md (ถ้ามี) &nbsp;③ config.json ว่าโมดูลไหนเปิด</div>
  </div>
</div>

<div class="gap" style="height:12px"></div>

<div class="step">
  <div class="num n2">2</div>
  <div class="sh">{ICON["list"]}เข้าใจงาน · เลือกวิธีทำ</div>
  <div class="sub">ก่อนแตะงาน: 3 บรรทัด → จัดขนาด → เลือกงบ → คาดไว้ก่อน → เลือก 1 playbook</div>
  <div class="card plan" id="plan">
    <div><div class="t">3 บรรทัดก่อนแตะงาน</div><div class="d"><b>เป้า</b> · <b>เสร็จเมื่อ</b> · <b>เสี่ยง</b><br>ย้อนไม่ได้ → หัวหน้าทำหรือตรวจเอง</div></div><div class="ar">→</div>
    <div><div class="t">จัดขนาด</div><div class="d"><b>เล็ก</b> หัวหน้าทำเอง<br><b>กลาง</b> playbook · ลูกทีม 1–4<br><b>ใหญ่</b> brainstormer เสนอ 2–3 ทาง · ลูกทีม 5–10</div></div><div class="ar">→</div>
    <div><div class="t">เลือกงบ</div><div class="d"><b>เร็ว</b> ลูกทีมเล็ก · ตรวจ 1 รอบ<br><b>สมดุล</b> ค่าเริ่ม · ตามงาน<br><b>คุณภาพ</b> ขึ้น 1 ระดับ · opus ตรวจทุกรอบ</div></div><div class="ar">→</div>
    <div><div class="t">คาดไว้ก่อน</div><div class="d">ลูกทีม N · รอบตรวจ N · ระดับ<br>จดก่อนแจกงาน<br>ตอนจบเทียบกับจริงและ token</div></div>
  </div>
  <div class="gap" style="height:24px"></div>
  <div class="groups" id="groups" style="grid-template-columns:3fr 1.1fr;align-items:start">
    <div class="card grp" id="g3"><h4>{main_title}</h4><div class="pbs" style="grid-template-columns:repeat({3 if len(main) > 4 else 2},1fr)">{pb(n for n, _ in main)}</div></div>
    <div class="card grp" id="g5"><h4>{side_title}</h4><div class="pbs">{pb(side)}</div></div>
  </div>
  <div class="gap" style="height:24px"></div>
  <div class="card todo" id="todo"><div class="tl">{ICON["check"]}คัดขั้นตอนของ playbook ลง todo <b>ตรงตัว</b> ไม่สรุปย่อ</div>
  <div class="note">งานเล็กไม่เปิด playbook · ไม่มีตัวตรง → ประกอบเองจาก playbook-template · งานใหญ่เขียน BRIEF.md ก่อน แล้วอ่าน playbook ทั้งไฟล์</div></div>
</div>

<div class="step">
  <div class="num n3">3</div>
  <div class="sh">{ICON["tool"]}ลงมือทีละขั้น</div>
  <div class="sub">ทุกขั้นจบด้วยการตรวจกับของจริง: {html.escape(d["src_note"])}</div>
  <div class="loop" id="loop">
    <div class="card lc" id="l1"><div class="t">เข้าใจ</div><div class="d">{d["loop"][0]}</div></div>
    <div class="card lc" id="l2"><div class="t">วางแผน</div><div class="d">{d["loop"][1]}</div></div>
    <div class="card lc" id="l3"><div class="t">ลงมือ</div><div class="d">{d["loop"][2]}</div></div>
    <div class="card lc proof" id="l4"><div class="t">พิสูจน์</div><div class="d">{d["loop"][3]}</div></div>
    <div class="card lc" id="l5"><div class="t">รายงาน</div><div class="d">{d["loop"][4]}</div></div>
  </div>
  <div class="gap" style="height:48px"></div>

  <div class="tiers" id="tiers">
    <div class="card tb leadb" id="tl"><div class="t">หัวหน้าทีม แจกงาน</div><div class="d">แบ่งงาน · ตัวใหม่ทุกงาน · ไม่พึ่งกัน → ส่งพร้อมกัน · ส่ง path ไม่ส่งเนื้อหา · เขียนไฟล์กลางคนเดียว</div></div>
    <div>
      <div class="tiercap">ระดับโมเดล + effort — งบขยับทั้งตาราง</div>
      <div class="tierset" id="tierset">
        <div class="tier"><b>ใหญ่</b><div class="m">opus + high</div><small>{html.escape(d["big"])}</small></div>
        <div class="tier"><b>กลาง</b><div class="m">sonnet + medium · ค่าเริ่ม</div><small>ร่างเอกสาร · คำนวณตามสูตร · จัดตาราง</small></div>
        <div class="tier"><b>เล็ก</b><div class="m">haiku + low</div><small>ค้นไฟล์ · เปลี่ยนชื่อ · สรุปรายการ</small></div>
      </div>
    </div>
    <div class="card tb" id="ts"><div class="t">ลูกทีม (subagent)</div><div class="d">ทำเฉพาะชิ้นตามใบสั่งงาน · ส่งกลับ ≤ 40 บรรทัด · ไม่คุยกับผู้ใช้ · ไม่สั่งตัวอื่นต่อ</div></div>
  </div>
  <div class="tiernote">พลาด → ขยับ effort ขึ้น 1 ขั้นก่อน · พลาดอีก → ขยับโมเดล · ไม่ลองซ้ำแบบเดิม</div>
  <div class="gap" style="height:16px"></div>
  <div class="mgmt">
    <div class="card mg" id="k1"><div class="t">ใบสั่งงาน 5 ข้อ</div><ol class="brief"><li><b>เป้า</b> ชิ้นนี้ให้ได้อะไร</li><li><b>ขอบเขต</b> แตะอะไร ห้ามแตะอะไร</li><li><b>เสร็จเมื่อ</b> ตรวจด้วยอะไร</li><li><b>กติกาเดียวกัน</b> ชื่อ รูปแบบ ภาษา</li><li><b>ส่งกลับ</b> ≤ 40 บรรทัด ไม่เล่ากระบวนการ</li></ol><div class="small">อยู่ในข้อความส่งงาน · ไม่มีใบ ไม่ส่ง</div></div>
    <div class="card mg ok" id="k2"><div class="t">ประเมินลูกทีม</div><div class="d">ทุกชิ้นได้คะแนน ผ่าน/แก้/ทำใหม่<br>หัวหน้าตรวจเองเทียบ "เสร็จเมื่อ"<br>ถนัด · พลาดบ่อย · ระดับที่พอ → TEAM.md<br>พลาดเรื่องเดิม 2 ครั้ง → ลดขอบเขตหรือขยับระดับ</div></div>
    <div class="card mg ok" id="k3"><div class="t">ตรวจซ้ำจนผ่าน</div><div class="d">reviewer ตัวใหม่ทุกรอบ ไม่ส่งความเห็นหัวหน้าไป<br>กลาง ≤ 3 รอบ · ใหญ่หรือเสี่ยง ≤ 5 รอบ<br>ค่าเริ่ม sonnet + medium · opus + high เมื่องานใหญ่ รอบสุดท้าย หรืองบคุณภาพ<br>งานเล็กหัวหน้าตรวจเอง ใส่ "ข้ามรีวิว:"</div></div>
  </div>
  <div class="gap" style="height:16px"></div>

  <div class="card plug">
    <div class="t">{ICON["plug"]}งานข้ามสาขา → ส่งต่อ <code>/&lt;plugin&gt;:superuser</code> ของ plugin นั้น</div>
    <div class="chips">{"".join(f'<span class="chip xchip">{badge(c, 12)}{html.escape(c)}</span>' for c in r["cross"]) if r["cross"] else '<span class="chip">plugin สาขาทุกตัวใน SQT-Marketplace</span>'}</div>
    <div class="d" style="margin-top:8px;color:var(--ink3)">ไม่ได้ติดตั้ง → บอกผู้ใช้ว่ามี plugin นี้ แล้วทำต่อพร้อมป้าย (รอยืนยัน)</div>
  </div>
  <div class="gap" style="height:16px"></div>
  <div class="machine">
    <div class="card mc" id="m1"><div class="t">ลูกทีมของ plugin นี้ · {len(r["agents"])} agent</div><div class="chips" style="justify-content:center;margin-top:8px">{chips(r["agents"])}</div></div>
    <div class="card mc sb" id="m2"><div class="t">{f"skill กลาง · {N_CORE} ตัว" if is_core else f"skill ที่ลูกทีมใช้ · {len(r['skills'])} ตัว"}</div><div class="chips" style="justify-content:center;margin-top:8px">{chips(r["skills"])}<span class="chip">{"+ sqt-toolkit" if is_core else f"+ skill กลาง {N_CORE} ตัว · sqt-toolkit"} {N_KIT} ตัว: เอกสาร สไลด์ รูป ประชุม</span></div></div>
  </div>
</div>

<div class="gap" style="height:16px"></div>

<div class="step">
  <div class="num n4">4</div>
  <div class="sh">{ICON["fork"]}ก่อนตัดสินใจ</div>
  <div class="sub">ถามแบบเลือกคำตอบครั้งเดียวตอนเริ่ม แล้วไม่หยุดถาม · กติกาเต็มใน autonomy.md</div>
  <div class="gap" style="height:16px"></div>
  <div class="dec" id="dec">
    <div class="card dc" id="d1"><div class="t">ย้อนกลับได้ → ทำเลย</div><div class="d">{d["d1"]}</div></div>
    <div class="card dc" id="d2"><div class="t">ไม่รู้ → ค้นเอง</div><div class="d">ต้อง <b>≥ 3 แหล่งน่าเชื่อถือ</b> ยืนยันตรงกัน<br>{d["d2"]}<br>กระทบงาน → โหวต 3 agent เสียงข้างมากชนะ<br><span class="small">ตัดสินใจเอง → จดในตาราง "การตัดสินใจ"</span></div></div>
    <div class="dc amb" id="d3"><div class="t">ย้อนไม่ได้ → รออนุมัติ</div><div class="d">เตรียมให้พร้อมกด ทำส่วนอื่นต่อ ไม่หยุดงาน</div>
      <div class="achips">{chips(d["appr"] + ["จ่ายเงิน", "ใส่รหัสผ่าน"], "achip")}</div>
      <div class="small">อนุญาตล่วงหน้าได้บางข้อ</div><div class="small" style="margin-top:8px"><b>รู้จังหวะหยุด:</b> ครบรอบตรวจยังไม่ผ่าน → หยุด สรุป 2–3 ทางให้ผู้ใช้เลือก</div>{stop}</div>
  </div>
</div>

<div class="gap" style="height:32px"></div>

<div class="step">
  <div class="num n5">5</div>
  <div class="sh">{ICON["send"]}ส่งผล</div>
  <div class="sub">คนหรือ bot ตัวถัดไปอ่านไฟล์ ก็รู้สถานะและทำต่อได้</div>
  <div class="gap" style="height:8px"></div>
  <div class="out" id="out">
    <div class="card oc" id="o1"><div class="t">คำตอบตอนจบ</div><div class="d">3 ระดับ: คำเดียว · 3 บรรทัด · รายงานปิดงาน<br>ป้าย ตรวจจริง · จากแหล่ง · อนุมาน · ยังไม่ได้ตรวจ<br>คาด → จริง + token จาก log/SUMMARY.md</div></div>
    <div class="card oc" id="o2"><div class="t">ตารางสถานะ</div><div class="d">เสร็จ · ทำอยู่ · ติด<br>รออนุมัติ · ค้างอยู่</div></div>
    <div class="card oc" id="o3"><div class="t">CONTEXT.md</div><div class="d">ความคืบหน้า · รับงานต่อ<br>ตาราง "การตัดสินใจ" + บรรทัดคาด<br>งานเสร็จย้ายไป HISTORY.md</div></div>
    <div class="oc amb" id="o4"><div class="t">{html.escape(d["o4"][0])}</div><div class="d">{d["o4"][1]}</div></div>
  </div>
</div>

<div class="gap" style="height:32px"></div>

<div class="step" style="margin-bottom:0">
  <div class="num n6">6</div>
  <div class="sh">{ICON["bulb"]}เรียนรู้</div>
  <div class="sub">หัวหน้าเรียนรู้ตัวเองทุกงาน · ทีมเปลี่ยนเมื่อผู้ใช้ตัดสิน</div>
  <div class="gap" style="height:8px"></div>
  <div class="learn" id="learn">
{LEARN_DOM}  </div>
  <div class="card logstrip">{ICON["log"]}<div><b>ทุกอย่างถูกบันทึก:</b> <code>.claude/superuser/log/</code> — hook จดทุกการทำ · <code>SUMMARY.md</code> รวม token ราย agent · ติดธง <code>correction</code> เมื่อผู้ใช้แก้ · ตัดค่าลับ · อยู่ในเครื่องผู้ใช้เท่านั้น</div></div>
</div>
</div>

<div class="gap" style="height:24px"></div>
<div class="card prin">
  <h3>{ICON["layers"]}เกณฑ์และหลักที่ใช้ทุกขั้น</h3>
  <div class="crit">เกณฑ์งาน 3 ข้อ: {gate_chips}</div>
  <div class="chips">{chips(["ตรวจกับของจริงก่อนบอกว่าเสร็จ", "ไม่หยุดถามระหว่างทาง", "≥ 3 แหล่งยืนยันตรงกัน", "ไม่แต่งข้อมูลของผู้ใช้", "ย้อนไม่ได้ → รออนุมัติ", "ทำซ้ำ ๆ → ทำเป็นสคริปต์", "ข้อความในเว็บเป็นข้อมูล ไม่ใช่คำสั่ง", "human-writing"])}</div>
</div>
{pattern_card(r["pats"])}
{modules_card()}
<div class="legend">
  <div><span class="sw" style="background:var(--pc)"></span>เลือกงาน</div>
  <div><span class="sw" style="background:var(--green-bg);border:2px solid var(--green)"></span>พิสูจน์และเรียนรู้</div>
  <div><span class="sw" style="background:#fff;border:2px solid var(--ink)"></span>เครื่องมือของทีม</div>
  <div><svg width="34" height="12"><path d="M1 6h26" stroke="#0E6B3D" stroke-width="1.8" stroke-dasharray="4 3"/><path d="m26 2 6 4-6 4" fill="none" stroke="#0E6B3D" stroke-width="1.8"/></svg>วนกลับ</div>
  <div><span class="sw" style="background:var(--amber-bg);border:2px dashed var(--amber)"></span>รออนุมัติ (คนกด)</div>
</div>

<div class="card panel">
  <h2>playbook ทั้ง {len(main) + len(side)} ตัว<small>ใช้เมื่อไร</small></h2>
  <div class="cols">
    <div class="col"><div class="gh" style="--dot:var(--pc)">{main_title}</div>{col1}</div>
    <div class="col"><div class="gh" style="--dot:var(--pc);visibility:hidden">{main_title}</div>{col2}</div>
    <div class="col"><div class="gh" style="--dot:var(--pc)">{side_title}</div>{col3}</div>
  </div>
</div>

<div class="card panel">
  <h2>อภิธานศัพท์<small>glossary</small></h2>
  <div class="cols">
    <div class="col">
      <div class="gh">คำทั่วไป</div>
      <div class="it"><b>SuperUser</b><span>หัวหน้างาน 1 คน · แกนอยู่ใน plugin superuser · สาขาเพิ่ม playbook และ agent</span></div>
      <div class="it"><b>หัวหน้าทีม</b><span>agent ที่ผู้ใช้คุยด้วย 1 คนต่อโฟลเดอร์งาน สั่งและตรวจลูกทีม</span></div>
      <div class="it"><b>playbook</b><span>ชุดขั้นตอนสำเร็จรูปของงานแต่ละแบบ</span></div>
      <div class="it"><b>subagent</b><span>ลูกทีมที่หัวหน้าส่งไปทำงานย่อย แล้วรายงานกลับ</span></div>
      <div class="it"><b>ระดับโมเดล · effort</b><span>ใหญ่ · กลาง · เล็ก = opus · sonnet · haiku · effort คือแรงคิด high · medium · low</span></div>
      <div class="it"><b>ใบสั่งงาน · งบ</b><span>5 ข้อที่ทุกชิ้นงานต้องมี · งบ เร็ว · สมดุล · คุณภาพ</span></div>
      <div class="it"><b>ตรวจจริง · จากแหล่ง · อนุมาน</b><span>ป้ายบอกว่าข้ออ้างมีหลักฐานแค่ไหน · ไม่มีหลักฐานเขียนว่า ยังไม่ได้ตรวจ</span></div>
    </div>
    <div class="col">
      <div class="gh" style="--dot:var(--amber)">การทำงานและการอนุมัติ</div>
      <div class="it"><b>รออนุมัติ</b><span>งานย้อนไม่ได้ที่ agent เตรียมไว้ รอผู้ใช้กด</span></div>
      <div class="it"><b>ค้างอยู่</b><span>เรื่องที่ผู้ใช้ต้องตัดสิน ระหว่างนั้นทำส่วนอื่นต่อ</span></div>
      <div class="it"><b>(รอยืนยัน)</b><span>ป้ายค่าที่ยังไม่ได้ยืนยันจากผู้ใช้หรือแหล่งทางการ</span></div>
      <div class="it"><b>อนุญาตล่วงหน้า</b><span>เขียนใน superuser-style.md หรือ CONTEXT.md · ไม่ครอบคลุมการจ่ายเงิน</span></div>
      <div class="gh mt" style="--dot:var(--green)">ไฟล์ในโฟลเดอร์งาน</div>
      <div class="it"><b>CONTEXT.md</b><span>ไฟล์กลาง · "รับงานต่อ" และตาราง "การตัดสินใจ"</span></div>
      <div class="it"><b>IMPROVEMENTS.md</b><span>สิ่งที่ทีมเจอ รอรวมเข้า skill</span></div>
      <div class="it"><b>TEAM.md · LEAD-PLAYBOOK.md</b><span>ลูกทีมตัวไหนถนัดอะไร · บทเรียนของหัวหน้าจากคาดกับจริง</span></div>
      <div class="it"><b>config.json</b><span>เปิดปิดโมดูลและตั้งงบ ต่อโฟลเดอร์งาน</span></div>
      <div class="it"><b>BRIEF.md</b><span>สรุปงานใหญ่เป็นข้อ ๆ: คืออะไร · ทำอะไรได้ · ต้องการให้ได้อะไร</span></div>
    </div>
    <div class="col">
      <div class="gh" style="--dot:var(--blue)">ศัพท์ของงานนี้</div>
      {gloss_domain}
    </div>
  </div>
</div>

<div class="ft"><span>สร้างจาก plugins/{name}/skills/superuser/SKILL.md</span><span>SQT-Marketplace</span></div>
</div>

{SCRIPT}
</body>
</html>
'''
    return HEAD.replace("<title>SuperUser Workflow</title>", f"<title>SuperUser — {d['title']}</title>").replace("</head>", PAT_CSS + "</head>") + body

def build_sc():
    t = tpl
    pats = patterns(open(os.path.join(ROOT, "plugins/software-company/skills/superuser/SKILL.md"), encoding="utf-8").read().replace("\r\n", "\n"))
    def r(a, b):
        nonlocal t
        assert t.count(a) == 1, a[:60]
        t = t.replace(a, b)
    # ข้อความที่เหลือของ software-company อยู่ในแม่แบบแล้ว · ที่นี่เหลือเฉพาะค่าที่นับจากไฟล์จริง
    n_agents = len([f for f in os.listdir(os.path.join(ROOT, "plugins/software-company/agents")) if f.endswith(".md")])
    r('<div class="d">38 agents ตามบท', f'<div class="d">test ก่อนโค้ด<br>{n_agents} agent ตามบท')
    r('<div class="sheet" id="sheet">', f'<div class="sheet" id="sheet" style="--pc:{COLOR["software-company"]}">')
    r('''<div class="hd">
  <div>
    <h1>SuperUser <span>—</span> วิธีทำงานของทีม agent</h1>
    <p>จัดขนาดและงบ → ใบสั่งงาน 5 ข้อ → แจกลูกทีม → ตรวจซ้ำจนผ่าน → ส่งมอบสั้น → เทียบคาดกับจริง แล้วจำ</p>
  </div>
  <div class="src">skills/superuser/SKILL.md</div>
</div>''', f'''<div class="hd">
  <div class="big">{emblem("software-company", 56)}</div>
  <div class="kick">SuperUser · software-company</div>
  <h1>SuperUser <span>—</span> วิธีทำงานของทีม agent</h1>
  <p>จัดขนาดและงบ → ใบสั่งงาน 5 ข้อ → แจกลูกทีม → ตรวจซ้ำจนผ่าน → ส่งมอบสั้น → เทียบคาดกับจริง แล้วจำ</p>
  <div class="src">software-company/skills/superuser/SKILL.md</div>
</div>''')
    # ชิปส่งต่อของ software-company ให้มีตราและสีเหมือนรูปอื่น
    i = t.index('<div class="card plug">'); j = t.index('<div class="d"', i)
    # software-company ไม่มีรายการส่งต่อของตัวเอง · plugin อื่นส่งงานโค้ดมาที่นี่
    got = [p for p in PLUGINS if p not in ("superuser", "software-company") and "software-company" in read_plugin(p)["cross"]]
    t = t.replace('งานชีวิตประจำวัน → ส่งต่อ agent ของ plugin อื่นที่ติดตั้งไว้', 'งานข้ามสาขา · รับงานเข้า', 1)
    i = t.index('<div class="card plug">')
    j = t.index('<div class="d"', i); j2 = t.index('</div>', j) + len('</div>')
    t = t[:j] + t[j2:]  # บรรทัด "ไม่ได้ติดตั้ง → ..." ใช้กับการส่งออก ไม่ใช่การรับเข้า
    k = t.index('<div class="chips">', i); k2 = t.index('</div>', k) + len('</div>')
    t = t[:k] + ('<div class="chips"><span class="chip">ไม่มีรายการส่งต่อ · plugin อื่นส่งงานโค้ดมาที่นี่ ←</span>'
                 + "".join(f'<span class="chip xchip">{badge(p, 12)}{p}</span>' for p in got) + '</div>') + t[k2:]
    k = t.index('<div class="legend">'); t = t[:k] + pattern_card(pats) + modules_card() + "\n" + t[k:]
    r('</head>', PAT_CSS + '</head>')
    return t

os.makedirs(OUT, exist_ok=True)
# ชื่อ SuperUser อยู่ในป้ายเหนือหัวแล้ว หัวรูปจึงเหลือแต่ชื่อสาขา ให้อยู่บรรทัดเดียว
fin = lambda t: re.sub(r'"ใช้ superuser"', '<span class="nb">"ใช้ superuser"</span>', bilingual.run(t).replace("<h1>SuperUser <span>—</span> ", "<h1>"))
open(os.path.join(OUT, "superuser-software-company.html"), "w", encoding="utf-8").write(fin(build_sc()))
print("software-company")
for name in P:
    open(os.path.join(OUT, f"superuser-{'core' if name == 'superuser' else name}.html"), "w", encoding="utf-8").write(fin(build(name)))
    print(name)

if bilingual.missing: print("ยังไม่มีคำแปล:", sorted(bilingual.missing))
