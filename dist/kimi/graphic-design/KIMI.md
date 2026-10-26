# SQT graphic-design — Kimi Code CLI

> สร้างอัตโนมัติจาก plugins/graphic-design/ โดย scripts/build/build-targets.mjs (v0.13.1) · ห้ามแก้ไฟล์นี้โดยตรง

Creative design beyond product UI — brand kits, AI image generation and briefs with style consistency, social media formats, marketplace product images, YouTube thumbnails, print-ready files, campaign sets, LINE rich menus, video editing with Thai subtitles and narration, speaking scripts, motion basics, and a design-review checklist.

ชุดนี้มี skill 54 ตัว · บทบาท 9 บทบาท · คำสั่งสำเร็จรูป 6 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/skill:ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **art-director** — Use when AI images or videos must share one style. Locks palette, light, composition and lens; writes generation briefs.
- **brand-keeper** — Use when starting a brand or when designs look inconsistent. Keeps the brand kit (logo, colours, type, tone).
- **design-critic** — Use when a design feels off or before visuals ship. Reviews hierarchy, contrast, spacing, alignment; names 2–3 fixes.
- **image-artist** — Use when a page, app or slide needs images (hero, product, people). Asks the style; generates, draws SVG or gets photos.
- **social-creator** — Use when creating social media posts, ads or campaign assets. Knows platform formats and safe zones; ships whole sets.
- **video-editor** — Use when footage or narration must become a finished file — cut, Thai subtitles, loudness, export. Works with ffmpeg.
- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
