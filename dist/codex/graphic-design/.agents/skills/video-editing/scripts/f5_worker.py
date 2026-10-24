"""f5_worker.py — สร้างเสียงทีละซับด้วย F5-TTS-THAI (เลียนเสียงจากคลิปต้นแบบ) · tts_cues.py เรียกให้
ต้องรันด้วย python ของ venv ที่ติดตั้ง F5-TTS-THAI (โปรแกรมนั้นใช้ torch ของมันเอง):
  <F5>/venv/Scripts/python.exe -I f5_worker.py --root <F5> --jobs jobs.json --out dir --ref me.wav --ref-text "..."
ค่าตาม f5_tts_webui.py ของ F5-TTS-THAI: โมเดล v1 · cfg 2 · cross fade 0.15 · ตัดตัวอักษรต่อท่อน 250
(ค่าตั้งต้นของฟังก์ชัน infer_tts · ช่องในหน้าเว็บตั้ง 300 · ซับแต่ละซับสั้นกว่านี้มากจึงไม่ถูกตัด)
ไม่แก้ไฟล์ของโปรแกรมที่ติดตั้ง
"""
import argparse
import json
import sys
import time
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
import torchaudio


def _load_with_soundfile(uri, *args, **kwargs):
    # torchaudio 2.9 ขึ้นไปอ่านไฟล์ผ่าน torchcodec ซึ่งต้องมี DLL ของ FFmpeg รุ่น shared · ffmpeg.exe แบบไฟล์เดียวไม่พอ
    data, sr = sf.read(str(uri), dtype="float32", always_2d=True)
    return torch.from_numpy(np.ascontiguousarray(data.T)), sr


torchaudio.load = _load_with_soundfile  # มีผลเฉพาะใน process นี้

from cached_path import cached_path  # noqa: E402  (ต้อง import หลังแทน torchaudio.load)
from f5_tts.cleantext.th_normalize import normalize_text  # noqa: E402
from f5_tts.infer.utils_infer import (infer_process, load_model, load_vocoder,  # noqa: E402
                                      preprocess_ref_audio_text, remove_silence_for_generated_wav)
from f5_tts.model import DiT  # noqa: E402
from f5_tts.model.utils import seed_everything  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument("--root", required=True, help="โฟลเดอร์ที่ติดตั้ง F5-TTS-THAI (มี vocab/vocab.txt)")
ap.add_argument("--ckpt", default="hf://VIZINTZOR/F5-TTS-THAI/model_1000000.pt")
ap.add_argument("--jobs", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--ref", required=True)
ap.add_argument("--ref-text", required=True)
ap.add_argument("--nfe", type=int, default=32)
ap.add_argument("--speed", type=float, default=1.0)
ap.add_argument("--seed", type=int, default=42)
a = ap.parse_args()
if hasattr(sys.stdout, "reconfigure"):  # เครื่องที่ code page ไม่ใช่ UTF-8 พิมพ์ผ่าน pipe แล้วล้ม
    sys.stdout.reconfigure(encoding="utf-8")

t0 = time.time()
cfg = dict(dim=1024, depth=22, heads=16, ff_mult=2, text_dim=512, text_mask_padding=False, conv_layers=4, pe_attn_head=1)
model = load_model(DiT, cfg, str(cached_path(a.ckpt)), vocab_file=str(Path(a.root) / "vocab/vocab.txt"), use_ema=True)
vocoder = load_vocoder()
ref_audio, ref_text = preprocess_ref_audio_text(a.ref, a.ref_text)
print(f"f5 load {time.time() - t0:.1f} s · gpu {torch.cuda.is_available()}", flush=True)

for job in json.loads(Path(a.jobs).read_text(encoding="utf-8")):
    t0 = time.time()
    seed_everything(a.seed)
    wave, sr, _ = infer_process(ref_audio, ref_text, normalize_text(job["text"]), model, vocoder,
                                cross_fade_duration=0.15, nfe_step=a.nfe, speed=a.speed, cfg_strength=2, set_max_chars=250)
    part = Path(a.out) / f"{job['id']}.part.wav"  # เขียนเสร็จค่อยเปลี่ยนชื่อ ไฟล์ค้างจากรอบที่ถูกหยุดจะไม่ถูกนับว่าเสร็จ
    sf.write(part, wave, sr)
    remove_silence_for_generated_wav(str(part))
    part.replace(Path(a.out) / f"{job['id']}.wav")
    print(f"f5 {job['id']}: {time.time() - t0:.1f} s", flush=True)
