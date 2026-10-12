# SQT graphic-design — Gemini CLI

> สร้างอัตโนมัติจาก plugins/graphic-design/ โดย scripts/build/build-targets.mjs (v0.3.2) · ห้ามแก้ไฟล์นี้โดยตรง

Creative design beyond product UI — brand kits, AI image and video briefs with style consistency, social media format systems, campaign asset sets, motion basics for non-designers, and a critical design-review checklist. Complements image/video generation plugins by adding the design knowledge layer on top.

ชุดนี้มี skill 14 ตัว · บทบาท 5 บทบาท · คำสั่งสำเร็จรูป 6 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **art-director** — Use when AI-generated images or videos must look like one art director made them. Locks the style (palette, light, composition, lens), writes generation briefs.
- **brand-keeper** — Use when starting a new brand or when designs look like different companies. Maintains the brand kit (logo, colors, type, tone) and checks assets against it.
- **design-critic** — Use when a design feels off or before anything visual ships. Reviews hierarchy, contrast, spacing, alignment and consistency; names the 2 or 3 key fixes.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked and propose up to 3 skill or agent edits with evidence. Writes only its own note.
- **social-creator** — Use when creating posts, ads or campaign assets for social media. Knows platform formats and safe zones, and ships campaign sets, not one-off images.
