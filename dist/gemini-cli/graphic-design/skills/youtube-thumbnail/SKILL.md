---
name: youtube-thumbnail
description: Use when a YouTube video needs a thumbnail
---

# youtube-thumbnail — YouTube video thumbnails that stay readable on a phone screen

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live references → 3 truly different directions → check `no-ai-look` before sending. Follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colours and fonts; the search is for this piece's layout). Close the work with the line `ด่านก่อนลงมือ:`.

> **One rule:** a thumbnail must be understood at stamp size. Shrink the image to 168 px wide (about the size in the recommended list on mobile; our own value, not yet measured on every app version). If you can still read the words and tell what the video is about, it can be sent.

## Use when
- Making a new YouTube thumbnail, or fixing one people do not click
- Thai text on the thumbnail is too small, sinks into the background, or has colliding tone marks
- Testing several thumbnails to see which is better

Not for: TikTok · Reels · post covers · channel banners → `social-formats` (sizes for every platform: its `references/platform-sizes.md`, YouTube section) · video script or first-5-second hook → `speaking-script` · `video-script-to-clip` · AI-made people or scenes → `brief-to-image` · `image-generation` · a series that must look like a set → `style-consistency` + `brand-kit` · look check before sending → `design-review`. The owner is agent `social-creator`.

## Steps
1. **Pick the one thing the thumbnail must say.** Thumbnail and title tell the story together without repeating words: the title gives detail, the thumbnail gives the feeling or the result. If there is no direction yet, search references live first per `design-references` (type `social`), then pull colours from the chosen work; the stored palette library is for when live search is not possible.
2. **Set up a 16:9 page** at the working size from YouTube Help (look up live; see the reference), export JPG or PNG. The source may be larger, up to the maximum that page gives.
3. **Text of at most 3–4 words**, bold, at least about 1/6 of the image height (our own value). For Thai, leave space above and below the line for tone marks and vowels (line spacing at least 1.3 times the font size; our own value). Use a Thai font that really has Bold or Black, not fake-bold.
4. **Contrast:** text and background differ by at least 4.5:1 (WCAG 2.2 normal text, same as `brand-kit`). Busy background: add a text outline, shadow, or colour bar behind the text.
5. **Leave the bottom-right corner empty** (the video length badge covers it). Keep text and faces left or middle.
6. **Vertical video:** YouTube makes a 4:5 thumbnail from the 16:9 one on home and subscriptions pages, so put the important part in the middle.
7. **Shrink to 168 px wide** and ask: can you read the text, can you tell what it is about. If not, cut words, enlarge letters, or remove elements.
8. **Filter before upload (compare in pairs, do not score).** Shrink the 2–3 thumbnails to 168 px wide and have 3–5 people choose pair by pair which they would rather click, swapping left and right in every pair. Put the result in the format of [`references/thumbnail-pairwise.example.json`](references/thumbnail-pairwise.example.json) and run `node <decision-scoring>/scripts/decide.mjs pairwise file.json` (`<decision-scoring>` is the folder of skill `superuser:decision-scoring`). If the result is close (the script says below 60%), send both into Test & compare and let YouTube decide. Drop a thumbnail that loses clearly.
9. **Test & compare** when the channel has it enabled: make 2–3 truly different versions of 1 topic (a face vs a product image · with text vs no text), not just different colours. YouTube decides by **watch time share**, not click rate, so a thumbnail that lures clicks but makes people leave loses. Never promise the user "clicks will go up". Look up live the limits (versions, test length, who can use it) at the YouTube Help page; if the page will not open, mark the value (รอยืนยัน).

## Check before done
- 16:9 · size and file within the ceilings looked up live from YouTube Help (mobile and computer upload)
- Text ≤ 4 words, contrast ≥ 4.5:1 · Thai tone marks do not hit the edge or another line
- Bottom-right corner empty · vertical video has the important part in the middle
- Shrunk to 168 px wide and still readable
- Matches the real content of the video and does not trick people into clicking · image, fonts and faces are licensed
- Passes `no-ai-look` item 3

## References
- [`references/youtube-requirements.md`](references/youtube-requirements.md) — open for YouTube's size, file and account rules, Test & compare details, or the worked example
- [`references/thumbnail-pairwise.example.json`](references/thumbnail-pairwise.example.json) — input format for step 8
- [`references/sources.md`](references/sources.md) — open when re-checking sources
