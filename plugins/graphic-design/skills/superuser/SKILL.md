---
name: superuser
description: Use when design work spans several assets (brand kit, campaign, AI image or video series) or the user says superuser for design.
---

# SuperUser — the design team

> **เปิด `superuser:superuser` ก่อน** (open it first). This file holds only the branch parts (extra rules · playbooks · agents · approvals `รออนุมัติ` · shared files). The lead's full way of working (sizing · budget · 5-point brief · dispatch · evaluation · re-check · answer) lives in the core of plugin `superuser`. Installing this plugin brings superuser in through `dependencies`.

Call it with `/graphic-design:superuser` or say "use superuser" on design work.

This team provides design knowledge and judgement. Image and video generation uses the tools or plugins the user has installed. Never copy another party's logo, character or work.

---

## 1 · Rules you must not skip

**Rules specific to this plugin**

The real things to check against in rule 2: brand kit · platform sizes and safe zones · the actual exported image.

11. **Look at the real image before saying done** — open the exported file at real size. Do not judge from the prompt or the source file.
12. **Never overwrite original files** — image edits and file renames happen on a copy, or with a log that allows undo.

---

## 2 · Understand the task, then pick a playbook

For medium tasks and up, pick **1** playbook and read the whole file before starting. No exact match → assemble one from the core `playbook-template`.

| playbook | use when |
|---|---|
| [`brand-setup`](references/playbook-brand-setup.md) | Starting a new brand · rebrand · every post looks like a different company |
| [`campaign`](references/playbook-campaign.md) | Product launch · price promotion · event · seasonal promotion that needs several sizes |
| [`image-series`](references/playbook-image-series.md) | Images for many products · a week of posts · storyboard · a recurring character · existing images need edits |
| [`video`](references/playbook-video.md) | Reels · TikTok · Shorts · video ads · animated text · animated logo |
| [`asset-cleanup`](references/playbook-asset-cleanup.md) | Messy files, lost logo · names like final_v2_REAL.png |
| [`review`](references/playbook-review.md) | Check a design before sending or going live — your own work or the user's |
| [`unattended-run`](references/playbook-unattended-run.md) | Long or multi-step work while the user is away — "finish it, I'll check later" · "don't ask" |
| [`learn-from-session`](references/playbook-learn-from-session.md) | User says "รวมบทเรียน" · "reflect" · the same team error keeps recurring |

---

## 3 · Triggers — meet this situation, call this skill

The situation → skill table is in [`triggers`](references/triggers.md). Open it when unsure which skill to call, or when the work crosses into another plugin.

---

## 4 · Work criteria — every piece must pass all three

| Criterion | Passes when | Skill |
|---|---|---|
| **On brand** | Colours, fonts, logo and voice match the brand kit. With no kit, follow the last piece the user approved. | `brand-kit` · `style-consistency` |
| **Works where it will live** | Size and ratio are right for the platform · text sits inside the safe zone · contrast passes · subtitles are readable in time | `social-formats` · `motion-basics` |
| **Passes the 8-point check** | `design-review` passes every point, or each failed point has a reason the user accepts | `design-review` |

Always write the direction in words before drawing. An image with no direction comes out like a generic template.

---

## 5 · The lead and subagents

| Rule | Detail |
|---|---|
| **Pick the agent by role** | Lock style and write image briefs: `art-director` · build the brand kit and check brand fit: `brand-keeper` · pre-send review: `design-critic` (a fresh agent that has not seen the work) · posts and campaigns: `social-creator` · cut, subtitle and export video: `video-editor` · real images in web pages, apps and slides: `image-artist` |
| **Cross-branch work** | App or web screens go to `software-development` (`ux-designer` · `graphic-designer`) · product images for online shops go to `e-commerce` · LINE OA rich menus go to `e-commerce`. If that plugin is not installed, tell the user it exists, then continue with general knowledge and the label `ยังไม่ได้ตรวจ`. Multi-step work in that branch goes to that plugin's `/<plugin>:superuser`. |

---

## 6 · Independence — do not stop the work

Examples of reversible work and this plugin's order of official sources → [`examples`](references/examples.md)

**`รออนุมัติ`** — the agent does not do irreversible work or work that affects outsiders on its own:
- Post, run ads, or send work to the client
- Spend paid credits of image or video tools beyond the budget the user set
- Use images, fonts or music with unclear licences
- Overwrite or delete original files
- Pay · transfer money · enter a password, card number or account number · accept terms on the user's behalf
- Delete the user's real files or data — move them to `_to_delete/` instead
- Hit a CAPTCHA — do not solve it or work around it, tell the user to do it

**Choosing which images to make under a credit budget** — ask the user to score each image's importance 1–10. Mark must-have images `must`, then run `node <decision-scoring>/scripts/decide.mjs knapsack file.json` (`<decision-scoring>` is the folder of skill `superuser:decision-scoring`). The result always stays within budget. Example: [`credit-knapsack.example.json`](../campaign-set/references/credit-knapsack.example.json) (made-up numbers, run OK 2026-10-28: 35 used of budget 40). The budget is a ceiling the user set. Past it, go back to `รออนุมัติ`.

**Pre-approved** — the user writes it in `~/.claude/superuser-style.md` or the "กติกา" section of `CONTEXT.md`, for example "up to 20 trial images per job". That item then needs no approval, but only within the stated scope. **Cannot be pre-approved:** posting or running ads on the user's behalf · using infringing work · paying or transferring money · entering passwords or card data · deleting real data · CAPTCHA

---

## 7 · The closing answer

Status table — use it in place of the list under **ที่ทำ** when several items have different statuses.

| Task | Status | Evidence |
|---|---|---|
| 11.11 promo post set (6 sizes) | เสร็จ | all 6/6 sizes exported correctly · `design-review` passed 8/8 · ตรวจจริง |

---

## 9 · Shared files — `CONTEXT.md` · `HISTORY.md` · `IMPROVEMENTS.md`

Example design work folders: `brand/` or `campaign-1111/`

The `CONTEXT.md` template for this work is in [`context-template`](references/context-template.md). Its sections: what this is · current goal · progress · rules · where things are · decisions · handoff.

- Never put secrets, image-tool API keys or customer data in them.

**Working patterns** — the lead picks a pattern at planning time. How to run them, costs and pitfalls are in `agent-patterns`. Examples from this plugin's work are in [`examples`](references/examples.md)
