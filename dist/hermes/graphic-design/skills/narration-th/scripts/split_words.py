"""split_words.py — find and fix words that edge-tts splits inside a sentence (Thai has no spaces, so the
voice guesses word edges; a loanword such as แทปเล็ต comes out as แทป|เล็ต and sounds choppy).

  check  every line of a script: print the lexicon/respell readings the voice splits into 2+ words
  make   one line's audio with fixes:
           --splice WORD=SAMPLE   cut WORD as said in SAMPLE (where it stays one word) into the line
           --speedup A,B=TEMPO    play the stretch from just before A to the end of B faster, same pitch
                                  (spelled-out letters such as พี-โอ-เอส: --speedup โอ,เอส=1.2)

Use:
  python split_words.py check ep01.txt --lexicon words.tsv [--respell respell.tsv] [--voice th-TH-NiwatNeural --rate=-5%]
  python split_words.py make -o line.mp3 --text "ทีมรับออเดอร์ผ่านแทปเล็ตส่งเข้าเครื่องพี-โอ-เอส" \\
      --splice "แทปเล็ต=แบบที่สี่, แทปเล็ต, ทีมรับออเดอร์" --speedup "โอ,เอส=1.2"
  python split_words.py --self-test
Needs: pip install edge-tts numpy · ffmpeg on PATH. Same text + voice + rate gives the same audio (measured
0.999 waveform match 2026-11-26), so an approved SAMPLE is reproduced exactly when its text is reused.
"""
import argparse
import asyncio
import re
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
R = 24000          # edge-tts mp3 rate
FADE_IN = 0.015    # owner-approved joint (2026-11-26): fade in, decay kept to -45 dB (≤ 0.2 s), 80 ms fade out, 60 ms gap
FADE_OUT = 0.08
TAIL_DB, TAIL_MAX, GAP = 45, 0.2, 0.06


async def _speak(text, voice, rate, retries=6):
    import edge_tts
    for _ in range(retries):
        audio, marks = bytearray(), []
        try:
            async for ch in edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary").stream():
                if ch["type"] == "audio":
                    audio += ch["data"]
                elif ch["type"] == "WordBoundary":
                    marks.append((ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7, ch["text"]))
            if audio:
                return bytes(audio), marks
        except edge_tts.exceptions.NoAudioReceived:
            pass
        await asyncio.sleep(1.5)
    raise RuntimeError(f"no audio: {text}")


def speak(text, voice, rate):
    return asyncio.run(_speak(text, voice, rate))


def span(marks, word):
    """(start, end, number of marks) of word, also when the voice split it over neighbouring marks."""
    for i in range(len(marks)):
        joined = ""
        for j in range(i, len(marks)):
            joined += marks[j][2]
            if joined == word:
                return marks[i][0], marks[j][1], j - i + 1
            if not word.startswith(joined):
                break
    return None


def pcm(mp3_bytes):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", "-", "-f", "s16le", "-ac", "1", "-ar", str(R), "-"],
                         input=mp3_bytes, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32)


def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)


def quietest(a, t0, t1, win=0.005):
    """Sample index of the quietest 5 ms between t0 and t1 seconds: the softest place to cut."""
    w = int(win * R)
    starts = range(max(0, int(t0 * R)), max(int(t0 * R) + 1, min(len(a) - w, int(t1 * R))), max(1, w // 2))
    return min(starts, key=lambda i: float(np.sum(a[i:i + w] ** 2))) + w // 2


def fade(x, seconds, out):
    n = min(len(x), int(seconds * R))
    ramp = np.linspace(0, 1, n, dtype=np.float32)
    if out:
        x[-n:] *= ramp[::-1]
    else:
        x[:n] *= ramp
    return x


def stretch(x, tempo):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(R), "-ac", "1", "-i", "-",
                          "-af", f"atempo={tempo}", "-f", "f32le", "-"],
                         input=x.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def splice_edit(a, marks, word, sample_audio, sample_marks):
    """Swap the split word in the line for the one-word take from the sample, at the same loudness."""
    found, own = span(marks, word), next((m for m in sample_marks if m[2] == word), None)
    if not found or not own:
        return None
    s0, s1 = int(own[0] * R), int(own[1] * R)
    floor, end = rms_db(sample_audio[s0:s1]) - TAIL_DB, s1
    while end < min(len(sample_audio), s1 + int(TAIL_MAX * R)) and rms_db(sample_audio[end:end + 240]) > floor:
        end += 240                                    # keep the word's natural decay
    piece = sample_audio[s0:end].copy()
    i0, i1 = quietest(a, found[0] - 0.04, found[0] + 0.01), quietest(a, found[1] - 0.01, found[1] + 0.07)
    piece *= 10 ** ((rms_db(a[i0:i1]) - rms_db(piece)) / 20)
    piece = fade(fade(piece, FADE_IN, out=False), FADE_OUT, out=True)
    return i0, i1, np.concatenate([piece, np.zeros(int(GAP * R), np.float32)]), FADE_IN


def speedup_edits(a, marks, first, last, tempo):
    edits = []
    for k in range(1, len(marks) - 1):
        if marks[k][2] == first and marks[k + 1][2] == last:
            start = max(marks[k - 1][0], marks[k][0] - 0.25)   # the letter before may share a mark with the word before it
            i0 = quietest(a, start - 0.03, start + 0.02)
            i1 = quietest(a, marks[k + 1][1] - 0.01, marks[k + 1][1] + 0.06)
            edits.append((i0, i1, fade(fade(stretch(a[i0:i1], tempo), 0.008, out=False), 0.008, out=True), 0.008))
    return edits


def apply(a, edits):
    for i0, i1, new, edge in sorted(edits, key=lambda e: e[0], reverse=True):   # right to left keeps positions valid
        a = np.concatenate([fade(a[:i0].copy(), edge, out=True), new, fade(a[i1:].copy(), edge, out=False)])
    return a


def write_mp3(a, path):
    wav = Path(path).with_suffix(".tmp.wav")
    with wave.open(str(wav), "wb") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(R)
        f.writeframes(np.clip(a, -32768, 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-b:a", "96k", str(path)], check=True)
    wav.unlink()


def make(a):
    audio, marks = speak(a.text, a.voice, a.rate)
    line, edits = pcm(audio), []
    for item in a.splice:
        word, sample = item.split("=", 1)
        s_audio, s_marks = speak(sample, a.voice, a.rate)
        e = splice_edit(line, marks, word, pcm(s_audio), s_marks)
        print(f"splice {word}:", "done" if e else "not found in line or not one word in sample")
        edits += [e] if e else []
    for item in a.speedup:
        pair, tempo = item.rsplit("=", 1)
        first, last = pair.split(",")
        found = speedup_edits(line, marks, first, last, float(tempo))
        print(f"speedup {pair} x{tempo}: {len(found)} place(s)")
        edits += found
    write_mp3(apply(line, edits), a.out)


def check(a):
    sys.path.insert(0, str(HERE))
    from tts_cues import load_lexicon, parse_script, read_aloud
    lexicon, respell = load_lexicon(a.lexicon), load_lexicon(a.respell)
    terms = {t.replace(" ", "") for _, t in lexicon + respell}
    bad = 0
    for n, cue in enumerate(parse_script(a.script), 1):
        said = read_aloud(cue["text"], lexicon, respell, keep_spaces=a.keep_spaces)
        _, marks = speak(said, a.voice, a.rate)
        for t in sorted(t for t in terms if t in said.replace(" ", "")):
            s = span(marks, t)
            if s and s[2] > 1:
                bad += 1
                parts = "|".join(m[2] for m in marks if s[0] <= m[0] < s[1])
                print(f"line {n}: {t} -> {parts}")
    print(f"{bad} split term(s)" if bad else "no split terms")
    return 1 if bad else 0


def self_test():
    marks = [(0.0, 0.2, "ผ่าน"), (0.2, 0.4, "แทป"), (0.4, 0.55, "เล็ต"), (0.55, 0.8, "ส่ง")]
    tone = np.concatenate([np.zeros(int(0.2 * R)), np.full(int(0.6 * R), 1000.0)]).astype(np.float32)
    checks = [("split word found over 2 marks", span(marks, "แทปเล็ต") == (0.2, 0.55, 2)),
              ("one-mark word", span(marks, "ส่ง") == (0.55, 0.8, 1)),
              ("missing word", span(marks, "พอส") is None),
              ("cut lands in silence", quietest(tone, 0.1, 0.3) < int(0.2 * R)),
              ("edit shortens audio", len(apply(tone.copy(), [(100, 2100, np.zeros(1000, np.float32), 0.001)])) == len(tone) - 1000)]
    for name, ok in checks:
        print(f"{name}:", "pass" if ok else "FAIL")
    ok = all(ok for _, ok in checks)
    print("self-test", "pass" if ok else "FAIL")
    return 0 if ok else 1


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if "--self-test" in sys.argv[1:]:
        sys.exit(self_test())
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    for name in ("check", "make"):
        p = sub.add_parser(name)
        p.add_argument("--voice", default="th-TH-NiwatNeural")
        p.add_argument("--rate", default="-5%")
    c = sub.choices["check"]
    c.add_argument("script")
    c.add_argument("--lexicon")
    c.add_argument("--respell")
    c.add_argument("--keep-spaces", action="store_true", help="same as tts_cues.py --keep-spaces")
    m = sub.choices["make"]
    m.add_argument("--text", required=True)
    m.add_argument("-o", "--out", required=True)
    m.add_argument("--splice", action="append", default=[], help="WORD=SAMPLE TEXT")
    m.add_argument("--speedup", action="append", default=[], help="FIRST,LAST=TEMPO")
    a = ap.parse_args()
    sys.exit(check(a) if a.cmd == "check" else make(a))


if __name__ == "__main__":
    main()
