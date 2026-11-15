# playbook · image-series — AI images that look like one set

Use when: several product images · a week of posts · a storyboard · a character that appears repeatedly · fixing an existing image
Main skills: `brief-to-image` · `style-consistency` · `image-editing-brief` · agent `art-director`

## ขั้นตอน · Steps (copy into the todo as written)

1. Write a style lock sheet per `style-consistency` — color, light, composition, lens, what is forbidden · ใคร: `art-director` ตัวใหม่
2. Write the brief and prompt for each image per `brief-to-image`, with every image citing the same lock sheet · ใคร: `art-director` ตัวใหม่
3. Generate the images through the tool the user has installed. If there is no tool, hand over a brief that is ready to paste · ใคร: `art-director` ตัวใหม่
4. Check (ตรวจ) every image against the lock sheet. For an image that drifts from the style, write an `image-editing-brief` (what to keep · what to change) instead of regenerating the whole image · ใคร: `design-critic` ตัวใหม่ compares against the lock sheet · `art-director` ตัวใหม่ writes the fix brief
5. Regenerate the images that need fixing following the fix brief. If there is no tool, hand over a brief that is ready to paste · ใคร: `art-director` ตัวใหม่
6. Check (ตรวจ) the whole set by running `design-review` on it · ใคร: `design-critic` ตัวใหม่ (อ่านอย่างเดียว · ไม่แก้ไฟล์ — read-only)

## Done when

Every image passes the lock sheet and `design-review`, and the briefs are kept so the set can be regenerated
