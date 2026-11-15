"""tts_cues.py — สร้างเสียงบรรยายไทยจากสคริปต์ทีละซับ ได้ไฟล์เสียง ซับ .srt และเวลาของสไลด์ในรอบเดียว

สคริปต์ (UTF-8):
  - 1 บรรทัด = 1 ซับ · ใช้ | แบ่งบรรทัดในซับเดียว (เครื่องอ่านต่อกัน)
  - บรรทัด [สไลด์ 3] = เปลี่ยนเป็นสไลด์ 3 ก่อนซับถัดไป
  - บรรทัดว่างและบรรทัดที่ขึ้นต้นด้วย # ข้าม
คำอ่าน (--lexicon ไม่บังคับ): .tsv บรรทัดละ คำ<TAB>คำอ่าน เช่น Git<TAB>กิต · เครื่องอ่านตามคำอ่าน ซับยังแสดงคำเดิม
สะกดใหม่ (--respell ไม่บังคับ): .tsv บรรทัดละ คำอ่าน<TAB>คำที่เสียงอ่านถูก เช่น คอนโทรลเลอร์<TAB>คอนโทรเล่อ · ใช้หลังคำอ่าน
  หาคำที่ต้องสะกดใหม่ด้วย term_sample.py ก่อนสร้างทั้งตอน

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


DIGITS = "ศูนย์ หนึ่ง สอง สาม สี่ ห้า หก เจ็ด แปด เก้า".split()
PLACES = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน"]
NUMBER = re.compile(r"(?<![A-Za-z0-9.,])\d{1,3}(?:,\d{3})+(?:\.\d+)?(?![A-Za-z0-9])|(?<![A-Za-z0-9.,])\d+(?:\.\d+)?(?![A-Za-z0-9])")


def _below_million(n):
    out = ""
    for i, ch in enumerate(str(n)[::-1]):
        d = int(ch)
        if d == 0:
            continue
        if i == 0:
            out = ("เอ็ด" if d == 1 and n > 10 else DIGITS[d]) + out
        elif i == 1:
            out = ("" if d == 1 else "ยี่" if d == 2 else DIGITS[d]) + "สิบ" + out
        else:
            out = DIGITS[d] + PLACES[i] + out
    return out


def thai_int(n):
    """จำนวนเต็มเป็นคำไทยทั้งก้อน เช่น 2569 → สองพันห้าร้อยหกสิบเก้า (ล้านขึ้นไปแบ่งซ้ำ)"""
    if n == 0:
        return DIGITS[0]
    hi, lo = divmod(n, 1_000_000)
    return (thai_int(hi) + "ล้าน" if hi else "") + (_below_million(lo) if lo else "")


def numbers_to_thai(s):
    """เลขอารบิกเป็นคำไทยก่อนส่งเครื่องอ่าน · 0 นำหน้า (เบอร์ รหัส) อ่านทีละตัว · ติดตัวอักษรละติน (ESP32) ไม่แตะ"""
    def one(m):
        raw = m.group(0).replace(",", "")
        whole, _, frac = raw.partition(".")
        head = "".join(DIGITS[int(c)] for c in whole) if len(whole) > 1 and whole[0] == "0" else thai_int(int(whole))
        return head + ("จุด" + "".join(DIGITS[int(c)] for c in frac) if frac else "")
    return NUMBER.sub(one, s)


def smooth(s):
    """ตัดช่องว่างระหว่างอักษรไทยกับอักษรไทย ให้เครื่องอ่านต่อเป็นประโยคเดียว · ช่องว่างทำให้เครื่องหยุดหายใจ"""
    return re.sub(r"(?<=[฀-๿])\s+(?=[฀-๿])", "", s)


def read_aloud(text, lexicon, respell):
    """ข้อความที่ส่งเครื่องอ่าน: คำอ่าน → เลขเป็นคำ → ตัดช่องว่างกลางประโยค → สะกดใหม่ (สะกดใหม่เว้นวรรคเองได้จึงอยู่ท้าย)"""
    return spoken_of(smooth(numbers_to_thai(spoken_of(text, lexicon))), respell)


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


def self_test():
    """ตรวจตัวอ่านสคริปต์ คำอ่าน และเวลา โดยไม่เรียกเครื่องอ่านเสียงหรือเครือข่าย · มี ffmpeg → ตรวจการตัดเงียบหัวท้ายด้วย"""
    import shutil
    import tempfile
    checks = []
    with tempfile.TemporaryDirectory() as d:
        script, lex = Path(d) / "ep.txt", Path(d) / "words.tsv"
        script.write_text("# หมายเหตุ ข้าม\n[สไลด์ 2]\nสวัสดีครับ|วันนี้มาลอง Git\n\n[slide 3]\nใช้ GitHub กับ git\n", encoding="utf-8")
        lex.write_text("คำ\tคำอ่าน\nGit\tกิต\nGitHub\tกิตฮับ\n", encoding="utf-8")
        cues = parse_script(script)
        lexicon = load_lexicon(lex)
        checks += [("แบ่งซับและสไลด์", [(c["text"], c["slide"]) for c in cues]
                    == [("สวัสดีครับ\nวันนี้มาลอง Git", 2), ("ใช้ GitHub กับ git", 3)]),
                   ("ข้ามแถวหัวตารางคำอ่าน · คำยาวก่อน", [w for w, _ in lexicon] == ["GitHub", "Git"]),
                   ("แทนคำอ่านทั้งคำ ไม่สนตัวพิมพ์", spoken_of(cues[1]["text"], lexicon) == "ใช้ กิตฮับ กับ กิต"),
                   ("สะกดใหม่หลังแทนคำอ่าน", spoken_of(spoken_of("ใช้ GitHub", lexicon), [("กิตฮับ", "กิ๊ตฮับ")]) == "ใช้ กิ๊ตฮับ"),
                   ("ปีและเลขเป็นคำทั้งก้อน", numbers_to_thai("ปี 2569 มี 1,250,000 บาท 21 ตัว 3.5 โวลต์ เบอร์ 081 ESP32")
                    == "ปี สองพันห้าร้อยหกสิบเก้า มี หนึ่งล้านสองแสนห้าหมื่น บาท ยี่สิบเอ็ด ตัว สามจุดห้า โวลต์ เบอร์ ศูนย์แปดหนึ่ง ESP32"),
                   ("ตัดช่องว่างกลางประโยคไทย คงช่องว่างข้างอักษรละติน", smooth("ปี สองพัน\nห้าร้อย ใช้ Git ได้") == "ปีสองพันห้าร้อยใช้ Git ได้"),
                   ("เวลา .srt", ts(3661.5) == "01:01:01,500" and ts(0.0004) == "00:00:00,000"),
                   ("เวลา data-at ปัดไม่ล้นนาที", mss(59.97) == "1:00.0" and mss(75.25) == "1:15.2")]
        if not shutil.which("ffmpeg"):
            print("ข้ามการตัดเงียบหัวท้าย: ไม่พบ ffmpeg ใน PATH")
        else:
            src, dst = Path(d) / "pad.wav", Path(d) / "pad.48k.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono:d=0.5",
                            "-f", "lavfi", "-i", "sine=frequency=440:duration=1:sample_rate=44100",
                            "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono:d=0.5",
                            "-filter_complex", "[0][1][2]concat=n=3:v=0:a=1", str(src)], check=True)
            to_48k_trimmed(src, dst)
            with wave.open(str(dst), "rb") as w:
                sec, rate = w.getnframes() / w.getframerate(), w.getframerate()
            checks.append((f"ตัดเงียบหัวท้าย 2.0 → {sec:.2f} วินาที ที่ {rate} Hz", rate == SR and 0.95 <= sec <= 1.2))
    for name, ok in checks:
        print(f"{name}:", "ผ่าน" if ok else "ไม่ผ่าน")
    ok = all(ok for _, ok in checks)
    print("self-test", "ผ่าน" if ok else "ไม่ผ่าน")
    return 0 if ok else 1


def main():
    if hasattr(sys.stdout, "reconfigure"):  # เครื่องที่ code page ไม่ใช่ UTF-8 พิมพ์ภาษาไทยผ่าน pipe แล้วล้ม
        sys.stdout.reconfigure(encoding="utf-8")
    if "--self-test" in sys.argv[1:]:
        sys.exit(self_test())
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("script")
    ap.add_argument("-o", "--out", required=True)
    ap.add_argument("--engine", choices=["windows", "edge", "f5"], required=True)
    ap.add_argument("--self-test", action="store_true", help="ทดสอบตัวเอง ไม่สร้างเสียงและไม่ใช้เครือข่าย")
    ap.add_argument("--voice", default="", help="windows: ส่วนหนึ่งของชื่อเสียง (Pattara) · edge: th-TH-NiwatNeural หรือ th-TH-PremwadeeNeural")
    ap.add_argument("--rate", default="+0%", help="edge: ความเร็ว เช่น -10%%")
    ap.add_argument("--lexicon")
    ap.add_argument("--respell", help="คำอ่าน<TAB>คำที่สะกดให้เสียงอ่านถูก · ใช้หลัง --lexicon")
    # ค่าตั้งต้น 4 ตัวนี้ยังไม่ได้วัด · ปรับตามจังหวะของงานได้
    ap.add_argument("--gap", type=float, default=0.25, help="ช่วงเงียบระหว่างซับ (วินาที) ค่าตั้งต้น ยังไม่ได้วัด")
    ap.add_argument("--slide-gap", type=float, default=0.6, help="ช่วงเงียบก่อนซับที่เปลี่ยนสไลด์ ค่าตั้งต้น ยังไม่ได้วัด")
    ap.add_argument("--lead", type=float, default=0.3, help="เงียบก่อนซับแรก (วินาที) ค่าตั้งต้น ยังไม่ได้วัด")
    ap.add_argument("--tail", type=float, default=0.8, help="เงียบหลังซับสุดท้าย (วินาที) ค่าตั้งต้น ยังไม่ได้วัด")
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
    lexicon, respell = load_lexicon(a.lexicon), load_lexicon(a.respell)
    setting = {"windows": a.voice, "edge": f"{a.voice}|{a.rate}", "f5": f"{a.ref}|{a.ref_text}|{a.nfe}|{a.speed}|{a.f5_ckpt}"}[a.engine]
    for c in cues:
        c["spoken"] = read_aloud(c["text"], lexicon, respell)
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
