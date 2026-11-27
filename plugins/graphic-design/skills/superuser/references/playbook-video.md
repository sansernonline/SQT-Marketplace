# playbook · video — short video and motion work

Use when: Reels · TikTok · Shorts · video ads · animated text · animated logos · editing and adding subtitles from existing footage
Main principles: superuser `design-gate/parts/design-method/guide.md` · the medium's principle file in [`design-principles`](../../design-principles/SKILL.md)
Main skills: `video-script-to-clip` · `motion-basics` · `style-consistency` · `video-editing` · `narration-th` · `subtitles-th`

## ขั้นตอน (Steps) (copy into the todo exactly)

1. Write the 7-field `เนื้อหา:` brief per `design-method` steps 1–4 (reuse `โปรเจกต์` from `DESIGN.md`); its `ความหมาย` is the main message, then write a 3-second hook for it · ใคร: `social-creator` ตัวใหม่ (hook text and script) · the motion shot list and the shot-by-shot brief belong to `art-director`
2. Make a shot list per `video-script-to-clip`: picture · on-screen text · sound · timing · ใคร: `art-director` ตัวใหม่
3. Set the motion rhythm per `motion-basics`: define timing in milliseconds · choose the easing curve (the pattern of speeding up and slowing down) · keep on-screen text up long enough to read · ใคร: `art-director` ตัวใหม่
4. Write the shot-by-shot brief for the video tool or for shooting on a phone · ใคร: `art-director` ตัวใหม่
5. Once footage or audio exists: cut, join, adjust loudness, pair slides with audio, and export per `video-editing` · Thai subtitles per `subtitles-th` · if the user will not record audio → generate narration from the script per `narration-th` (gives subtitles and slide timing in one round) · a job that delivers only a brief skips this step · ใคร: `video-editor` ตัวใหม่
6. Check (ตรวจ) the cut against [`design-principles/references/video.md`](../../design-principles/references/video.md), and that the Thai subtitles can be read in time at the real speed, that text does not fall outside the platform's safe zone, and that the exported file (if any) has the length and loudness that were measured · ใคร: `design-critic` ตัวใหม่ (อ่านอย่างเดียว · ไม่แก้ไฟล์ — read-only, does not edit files)

## Done when

The shot list and brief are complete for every shot, and the Thai subtitles pass the reading-speed check · with step 5 → the exported file passes `srt_check.py` and the loudness values hit the platform's target
