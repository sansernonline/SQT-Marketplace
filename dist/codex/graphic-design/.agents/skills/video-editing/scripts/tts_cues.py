"""tts_cues.py — สร้างเสียงบรรยายไทยจากสคริปต์ทีละซับ ได้ไฟล์เสียง ซับ .srt และเวลาของสไลด์ในรอบเดียว

สคริปต์ (UTF-8):
  - 1 บรรทัด = 1 ซับ · ใช้ | แบ่งบรรทัดในซับเดียว (เครื่องอ่านต่อกัน)
  - บรรทัด [สไลด์ 3] = เปลี่ยนเป็นสไลด์ 3 ก่อนซับถัดไป
  - บรรทัดว่างและบรรทัดที่ขึ้นต้นด้วย # ข้าม
คำอ่าน (--lexicon ไม่บังคับ): .tsv บรรทัดละ คำ<TAB>คำอ่าน เช่น Git<TAB>กิต · เครื่องอ่านตามคำอ่าน ซับยังแสดงคำเดิม

ใช้:
  python tts_cues.py ep01.txt -o out --engine windows                     # ร่าง: เสียงที่มากับ Windows
  python tts_cues.py ep01.txt -o out --engine edge --lexicon words.tsv    # ต้อง pip install edge-tts
  python tts_cues.py ep01.txt -o out --engine f5 --f5-python <F5>/venv/Scripts/python.exe \\
      --f5-root <F5> --ref me.wav --ref-text "ข้อความที่พูดในไฟล์ me.wav ตรงทุกคำ"

ได้: out/narration.wav (48 kHz mono) · out/narration.srt · out/cues.json (เวลาทุกซับ + data-at ของสไลด์)
     out/cues/ เก็บเสียงทีละซับ · รันซ้ำแล้วสร้างใหม่เฉพาะซับที่ข้อความหรือค่าตั้งเปลี่ยน
"""
import argparse
import asyncio
import hashlib
import json
import re
import subprocess
import sys
import time
import wave
from pathlib import Path

HERE = Path(__file__).resolve().parent
SR = 48000
SLIDE = re.compile(r"^\[(?:สไลด์|slide)\s*(\d+)\]$", re.I)
MIN_SUB, MAX_SUB = 0.9, 7.0  # ซับอยู่บนจอ 5/6–7 วินาที ตามตาราง caption ของ video-script-to-clip


def parse_script(path):
    cues, pending = [], None
    for raw in Path(path).read_text(encoding="utf-8-sig").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        m = SLIDE.match(line)
        if m:
            pending = int(m.group(1))
            continue
        cues.append({"text": "\n".join(p.strip() for p in line.split("|")), "slide": pending})
        pending = None
    if not cues:
        sys.exit("สคริปต์ไม่มีบรรทัดให้อ่าน")
    return cues


def load_lexicon(path):
    if not path:
        return []
    pairs = []
    for line in Path(path).read_text(encoding="utf-8-sig").splitlines():
        if "\t" not in line or line.startswith("#"):
            continue
        word, reading = (s.strip() for s in line.split("\t", 1))
        if word and reading and word.lower() not in ("คำ", "word"):  # ข้ามแถวว่างและแถวหัวตาราง
            pairs.append((word, reading))
    return sorted(pairs, key=lambda p: -len(p[0]))  # คำยาวก่อน กัน GitHub ถูกแทนเป็น กิต+Hub


def spoken_of(text, lexicon):
    s = " ".join(text.split("\n"))
    for word, reading in lexicon:
        if re.fullmatch(r"[A-Za-z0-9.+# -]+", word):  # คำละติน (รวมศัพท์หลายคำ): แทนเฉพาะทั้งคำ ไม่สนตัวพิมพ์
            s = re.sub(rf"(?<![A-Za-z0-9]){re.escape(word)}(?![A-Za-z0-9])", lambda _m: reading, s, flags=re.I)
        else:
            s = s.replace(word, reading)
    return s


EXT = {"windows": ".wav", "edge": ".mp3", "f5": ".wav"}


def synth_windows(jobs, out, voice):
    jobfile = out / "windows-jobs.json"
    jobfile.write_text(json.dumps(jobs, ensure_ascii=False), encoding="utf-8")
    subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(HERE / "windows_tts.ps1"),
                    "-Jobs", str(jobfile), "-OutDir", str(out), "-Voice", voice or ""], check=True)


def synth_edge(jobs, out, voice, rate):
    try:
        import edge_tts
    except ImportError:
        sys.exit("ยังไม่มี edge-tts · ติดตั้งใน venv ของงานก่อน: python -m pip install edge-tts")

    async def one(job):
        for attempt in range(3):  # บริการตอบ "No audio was received" เป็นพัก ๆ · ข้อความเดิมลองใหม่แล้วผ่าน (ทดสอบ 2026-10-24)
            try:
                part = out / f"{job['id']}.mp3.part"  # เขียนเสร็จค่อยเปลี่ยนชื่อ ไฟล์ค้างจากรอบที่ล้มจะไม่ถูกนับว่าเสร็จ
                await edge_tts.Communicate(job["text"], voice or "th-TH-NiwatNeural", rate=rate).save(str(part))
                part.replace(out / f"{job['id']}.mp3")
                return
            except Exception as e:  # noqa: BLE001  ลองใหม่ทุกความผิดพลาดของเครือข่ายและบริการ
                err = e
                await asyncio.sleep(2 * (attempt + 1))
        sys.exit(f"edge-tts สร้างไม่ได้ 3 ครั้ง ({type(err).__name__}): {job['text']}")

    async def run():
        for job in jobs:
            await one(job)
    asyncio.run(run())


def synth_f5(jobs, out, a):
    if not (a.f5_python and a.f5_root and a.ref and a.ref_text):
        sys.exit("--engine f5 ต้องมี --f5-python --f5-root --ref --ref-text (เสียงต้นแบบต้องเป็นเสียงของคุณเองหรือมีหนังสือยินยอม)")
    jobfile = out / "f5-jobs.json"
    jobfile.write_text(json.dumps(jobs, ensure_ascii=False), encoding="utf-8")
    subprocess.run([a.f5_python, "-I", str(HERE / "f5_worker.py"), "--root", a.f5_root, "--ckpt", a.f5_ckpt,
                    "--jobs", str(jobfile), "--out", str(out), "--ref", a.ref, "--ref-text", a.ref_text,
                    "--nfe", str(a.nfe), "--speed", str(a.speed)], check=True)


def to_48k_trimmed(src, dst):
    # ตัดช่วงเงียบหัวท้ายของแต่ละซับ (เหลือ 50 ms) ให้ช่องว่างระหว่างซับเท่ากันทุกเครื่องเสียง
    trim = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05"
    part = dst.with_name(dst.name.replace(".48k.wav", ".48k.part.wav"))  # แปลงเสร็จค่อยเปลี่ยนชื่อ ไฟล์ค้างจะไม่ถูกใช้ซ้ำ
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-af", f"{trim},areverse,{trim},areverse",
                    "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", str(part)], check=True)
    part.replace(dst)


def ts(sec):
    ms = int(round(sec * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def mss(sec):
    t = round(sec, 1)  # ปัดก่อนแยกนาที ไม่ให้ 59.97 กลายเป็น 0:60.0
    return f"{int(t // 60)}:{t % 60:04.1f}"


def main():
    if hasattr(sys.stdout, "reconfigure"):  # เครื่องที่ code page ไม่ใช่ UTF-8 พิมพ์ภาษาไทยผ่าน pipe แล้วล้ม
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("script")
    ap.add_argument("-o", "--out", required=True)
    ap.add_argument("--engine", choices=["windows", "edge", "f5"], required=True)
    ap.add_argument("--voice", default="", help="windows: ส่วนหนึ่งของชื่อเสียง (Pattara) · edge: th-TH-NiwatNeural หรือ th-TH-PremwadeeNeural")
    ap.add_argument("--rate", default="+0%", help="edge: ความเร็ว เช่น -10%%")
    ap.add_argument("--lexicon")
    ap.add_argument("--gap", type=float, default=0.25, help="ช่วงเงียบระหว่างซับ (วินาที)")
    ap.add_argument("--slide-gap", type=float, default=0.6, help="ช่วงเงียบก่อนซับที่เปลี่ยนสไลด์")
    ap.add_argument("--lead", type=float, default=0.3)
    ap.add_argument("--tail", type=float, default=0.8)
    ap.add_argument("--f5-python")
    ap.add_argument("--f5-root")
    ap.add_argument("--f5-ckpt", default="hf://VIZINTZOR/F5-TTS-THAI/model_1000000.pt")
    ap.add_argument("--ref")
    ap.add_argument("--ref-text")
    ap.add_argument("--nfe", type=int, default=32)
    ap.add_argument("--speed", type=float, default=1.0)
    a = ap.parse_args()

    out = Path(a.out)
    cache = out / "cues"
    cache.mkdir(parents=True, exist_ok=True)
    cues = parse_script(a.script)
    lexicon = load_lexicon(a.lexicon)
    setting = {"windows": a.voice, "edge": f"{a.voice}|{a.rate}", "f5": f"{a.ref}|{a.ref_text}|{a.nfe}|{a.speed}|{a.f5_ckpt}"}[a.engine]
    for c in cues:
        c["spoken"] = spoken_of(c["text"], lexicon)
        c["id"] = hashlib.sha1(f"{a.engine}|{setting}|{c['spoken']}".encode()).hexdigest()[:12]

    # ใช้ซ้ำทั้งไฟล์ที่แปลงแล้วและไฟล์ดิบที่สร้างเสร็จก่อนงานล้ม (F5 บน CPU สร้างช้า ไม่ควรเริ่มใหม่ทั้งตอน)
    raw = lambda i: cache / f"{i}{EXT[a.engine]}"  # noqa: E731
    pending = list({c["id"]: c for c in cues if not (cache / f"{c['id']}.48k.wav").exists()}.values())
    todo = [{"id": c["id"], "text": c["spoken"]} for c in pending if not (raw(c["id"]).exists() and raw(c["id"]).stat().st_size)]
    t0 = time.time()
    if todo:
        {"windows": lambda: synth_windows(todo, cache, a.voice),
         "edge": lambda: synth_edge(todo, cache, a.voice, a.rate),
         "f5": lambda: synth_f5(todo, cache, a)}[a.engine]()
    for c in pending:
        if not (raw(c["id"]).exists() and raw(c["id"]).stat().st_size):
            sys.exit(f"ไม่ได้เสียงของซับ: {c['text']}")
        to_48k_trimmed(raw(c["id"]), cache / f"{c['id']}.48k.wav")
    made = time.time() - t0

    t, pcm, slides = a.lead, bytearray(int(round(a.lead * SR)) * 2), [{"slide": 1, "at": 0.0}]
    for i, c in enumerate(cues):
        if i:
            gap = a.slide_gap if c["slide"] else a.gap
            if c["slide"]:
                slides.append({"slide": c["slide"], "at": round(t + gap / 2, 2)})
            pcm += bytes(int(round(gap * SR)) * 2)
            t += gap
        elif c["slide"] and c["slide"] != 1:
            slides[0]["slide"] = c["slide"]
        with wave.open(str(cache / f"{c['id']}.48k.wav"), "rb") as w:
            frames = w.readframes(w.getnframes())
        c["start"], c["end"] = round(t, 3), round(t + len(frames) / 2 / SR, 3)
        pcm += frames
        t = c["end"]
    pcm += bytes(int(round(a.tail * SR)) * 2)
    total = len(pcm) / 2 / SR
    with wave.open(str(out / "narration.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(bytes(pcm))

    lines, long_cues = [], []
    for i, c in enumerate(cues):
        nxt = cues[i + 1]["start"] - 0.05 if i + 1 < len(cues) else total
        sub_end = min(max(c["end"], c["start"] + MIN_SUB), nxt)
        if c["end"] - c["start"] > MAX_SUB:
            long_cues.append(i + 1)
        lines += [str(i + 1), f"{ts(c['start'])} --> {ts(sub_end)}", c["text"], ""]
    (out / "narration.srt").write_text("\n".join(lines), encoding="utf-8")
    for s in slides:
        s["data_at"] = mss(s["at"])
    (out / "cues.json").write_text(json.dumps({"engine": a.engine, "total": round(total, 3), "slides": slides,
                                               "cues": [{k: c[k] for k in ("text", "spoken", "start", "end", "slide")} for c in cues]},
                                              ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"{len(cues)} ซับ · สร้างใหม่ {len(todo)} · ใช้ซ้ำ {len(cues) - len(todo)} · {made:.1f} วินาที · เสียงรวม {total:.2f} วินาที")
    print("data-at: " + " · ".join(f"สไลด์ {s['slide']}={s['data_at']}" for s in slides))
    if long_cues:
        print(f"ซับที่ยาวเกิน {MAX_SUB:.0f} วินาที: {long_cues} · แบ่งบรรทัดในสคริปต์แล้วรันใหม่")


if __name__ == "__main__":
    main()
