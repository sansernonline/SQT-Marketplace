"""ดึงข้อเท็จจริงของทุก plugin จากไฟล์จริง → scripts/diagrams/data/<plugin>.json

python scripts/diagrams/extract.py
อ่าน: agents/*.md · skills/*/SKILL.md · skills/superuser/references/playbook-*.md
ไม่เดาอะไร — ข้อความสั้นในกล่องอยู่ใน labels/<plugin>.json (คนหรือ agent เขียน)
"""
import json, os, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(os.path.dirname(__file__), "data")
# skill กลาง = รายการ SHARED_ONLY_IN_SUPERUSER (plugin superuser) ใน sync-superuser.mjs — ทุก plugin ได้ทาง dependencies + skill superuser
_SYNC = open(os.path.join(ROOT, "scripts", "sync", "sync-superuser.mjs"), encoding="utf-8").read()
def _list(const):
    return tuple(re.findall(r'"skills/([a-z0-9-]+)"', _SYNC.split(f"export const {const}", 1)[1].split("];", 1)[0]))
SHARED = _list("SHARED_ONLY_IN_SUPERUSER")
CORE = ("superuser",) + SHARED
CORE_AGENTS = ("brainstormer", "reviewer", "learning-reviewer")
TICKS = re.compile(r"`/?([a-z0-9:-]+)`")


def read(path):
    return open(path, encoding="utf-8").read().replace("\r\n", "\n")


def frontmatter(text):
    if not text.startswith("---"):
        return {}, text
    head, body = text[3:].split("\n---", 1)
    meta = dict(re.findall(r"^([a-z-]+):\s*(.*)$", head, re.M))
    return meta, body


def read_skills(base):
    skills, commands = [], []
    for name in sorted(os.listdir(os.path.join(base, "skills"))):
        meta, _ = frontmatter(read(os.path.join(base, "skills", name, "SKILL.md")))
        (commands if meta.get("disable-model-invocation") == "true" else skills).append(name)
    return skills, commands


def read_agents(base, known):
    agents = []
    agents_dir = os.path.join(base, "agents")  # plugin ที่ไม่มี agents/ ข้าม
    for f in sorted(os.listdir(agents_dir)) if os.path.isdir(agents_dir) else []:
        meta, body = frontmatter(read(os.path.join(base, "agents", f)))
        used = [s for s in dict.fromkeys(TICKS.findall(body)) if s in known]
        agents.append(dict(name=f[:-3], model=meta.get("model", ""), core=f[:-3] in CORE_AGENTS,
                           description=meta.get("description", ""), skills=used))
    return agents


def parse_who(who, agents):
    # "หัวหน้าทีม (เรื่องเสี่ยง: `security-engineer` ตัวใหม่)" → lead + agent ที่อยู่ใน backtick
    named = [a for a in TICKS.findall(who) if a in agents]
    return dict(lead="หัวหน้าทีม" in who, user="ผู้ใช้" in who, agents=named, raw=who)


def read_playbook(path, skills, commands, agents, playbooks):
    text = re.sub(r"<!--.*?-->", "", read(path))  # ไม่ให้ป้ายบล็อก sync ไปโผล่ในรูป
    title = text.split("\n", 1)[0]
    m = re.match(r"# playbook · ([a-z0-9-]+) — (.+)", title)
    when = re.search(r"^ใช้เมื่อ: (.+)$", text, re.M)
    done = re.search(r"## จบเมื่อ\n+(.+?)(\n## |\Z)", text, re.S)
    steps, current, phase = [], None, ""
    # บาง playbook มีหลายช่วง เช่น "## ขั้นตอน — รับงานต่อ" กับ "## ขั้นตอน — หยุดงาน" ที่นับ 1 ใหม่ทุกช่วง
    for line in text[text.index("\n## ขั้นตอน"):].split("\n## จบเมื่อ")[0].split("\n"):
        section = re.match(r"^## ขั้นตอน(?: — ([^(]+?))?\s*(\(|$)", line)
        if section:
            phase = (section.group(1) or "").strip()
            continue
        head = re.match(r"^(\d+)\. (.+)$", line)
        if head:
            current = dict(n=int(head.group(1)), text=head.group(2), sub=[], phase=phase)
            steps.append(current)
        elif current and line.strip().startswith("- "):
            current["sub"].append(line.strip()[2:])
    for s in steps:
        body, _, who = s["text"].rpartition(" · ใคร: ")
        full = (body or s["text"]) + " " + " ".join(s["sub"])
        names = TICKS.findall(full)
        s.update(
            who=parse_who(who, agents) if body else None,
            skills=[n for n in dict.fromkeys(names) if n in skills],
            commands=[n.split(":")[-1] for n in dict.fromkeys(names) if n.split(":")[-1] in commands and ":" in n],
            playbooks=[n for n in dict.fromkeys(names) if n in playbooks],
            # ขั้นที่ส่งของเข้าคิว "รออนุมัติ" หรือให้ผู้ใช้ลงมือเอง · รายงานที่แค่ "บอกว่ารออนุมัติอะไร" ไม่นับ
            approval=bool(re.search(r'(ลง|อยู่ใน|ไว้ใน) "รออนุมัติ"|ผู้ใช้อนุมัติ|ผู้ใช้กด|ผู้ใช้ยืนยัน', full)) or bool(who and "ผู้ใช้" in who),
        )
    return dict(name=m.group(1) if m else os.path.basename(path)[9:-3], title=m.group(2) if m else title,
                when=when.group(1) if when else "", done=re.sub(r"\s*\n\s*-\s+", " · ", "\n" + done.group(1).strip()).strip(" ·\n") if done else "", steps=steps)


def read_plugin(name):
    base = os.path.join(ROOT, "plugins", name)
    skills, commands = read_skills(base)
    meta = json.loads(read(os.path.join(base, ".claude-plugin", "plugin.json")))
    agents = read_agents(base, set(skills) | set(commands))
    ref = os.path.join(base, "skills", "superuser", "references")
    files = sorted(f for f in os.listdir(ref) if f.startswith("playbook-") and f != "playbook-template.md") if os.path.isdir(ref) else []
    pb_names = {f[9:-3] for f in files}
    names = {a["name"] for a in agents}
    playbooks = [read_playbook(os.path.join(ref, f), set(skills), set(commands), names, pb_names) for f in files]
    core_ref = os.path.join(ROOT, "plugins", "superuser", "skills", "superuser", "references")
    for pb, f in zip(playbooks, files):
        # เหมือนต้นฉบับกลางทุกตัวอักษร → วาดครั้งเดียวในรูปของ superuser
        same = os.path.exists(os.path.join(core_ref, f)) and read(os.path.join(ref, f)) == read(os.path.join(core_ref, f))
        pb["shared"] = same and name != "superuser"
    su = os.path.join(base, "skills", "superuser", "SKILL.md")
    handoff = re.search(r"\*\*งานข้ามสาขา\*\* \| (.+?) \|", read(su)) if os.path.exists(su) else None
    # ปลายทางงานข้ามสาขานับเฉพาะ plugin ที่อยู่ในชุดรูป (มี skill superuser)
    plugins = {p for p in os.listdir(os.path.join(ROOT, "plugins")) if os.path.exists(os.path.join(ROOT, "plugins", p, "skills", "superuser", "SKILL.md"))}
    cross = [p for p in dict.fromkeys(TICKS.findall(handoff.group(1))) if p in plugins] if handoff else []
    return dict(plugin=name, version=meta.get("version", ""), description=meta.get("description", ""), cross=cross,
                skills=[s for s in skills if s not in CORE], core_skills=list(CORE),
                commands=commands, agents=agents, playbooks=playbooks)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name in sorted(os.listdir(os.path.join(ROOT, "plugins"))):
        # plugin ที่ไม่มี skill superuser ไม่มี agent playbook หรือ flow ให้วาด → ไม่อยู่ในชุดรูป
        if not os.path.exists(os.path.join(ROOT, "plugins", name, "skills", "superuser", "SKILL.md")):
            continue
        data = read_plugin(name)
        with open(os.path.join(OUT, f"{name}.json"), "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        steps = sum(len(p["steps"]) for p in data["playbooks"])
        print(f"{name:18} agents={len(data['agents']):3} skills={len(data['skills']):3} "
              f"commands={len(data['commands']):2} playbooks={len(data['playbooks']):2} steps={steps}")
