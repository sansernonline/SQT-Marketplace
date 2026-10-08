# SQT graphic-design — Gemini CLI

> สร้างอัตโนมัติจาก plugins/graphic-design/ โดย scripts/build/build-targets.mjs (v0.3.2) · ห้ามแก้ไฟล์นี้โดยตรง

Creative design beyond product UI — brand kits, AI image and video briefs with style consistency, social media format systems, campaign asset sets, motion basics for non-designers, and a critical design-review checklist. Complements image/video generation plugins by adding the design knowledge layer on top.

ชุดนี้มี skill 14 ตัว · บทบาท 5 บทบาท · คำสั่งสำเร็จรูป 6 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **art-director** — Use when a set of AI-generated images or videos must look like one art director made them. Locks the style — palette, light, composition, lens — and writes generation briefs for whatever image or video tool is installed.
- **brand-keeper** — Use when starting a new brand or when every design comes out looking like a different company. Maintains the brand kit — logo usage, colors, typography, tone — and checks every asset against it before it ships.
- **design-critic** — Use when a design feels off but nobody can say why, or before anything visual ships. Reviews hierarchy, contrast, spacing, alignment and consistency, and names the 2 or 3 fixes that matter most.
- **learning-reviewer** — Use at the end of every multi-step SuperUser task to review how the team worked — user corrections, failed steps, slow spots — and propose up to 3 skill or agent edits with evidence. Writes only its own note and never edits skills.
- **social-creator** — Use when creating posts, ads, or campaign assets for social media. Knows every platform's format system and safe zones, designs for the feed context where the post will actually appear, and ships campaign sets rather than one-off images.
