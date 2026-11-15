---
name: youtube-thumbnail
description: Use when a YouTube video needs a thumbnail
---

# youtube-thumbnail — YouTube video thumbnails that stay readable on a phone screen

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live references → 3 truly different directions → check `no-ai-look` before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colours and fonts; the search is for this piece's layout) · close the work with the line `ด่านก่อนลงมือ:`

Lives in plugin `graphic-design` · wording follows `human-writing` · owned by agent `social-creator` · sizes for every platform are in `social-formats`, file `references/platform-sizes.md`, YouTube section, which keeps links for live lookup and no numbers.

> **The one rule:** a thumbnail must be understood at stamp size · shrink the image to 168 px wide (about the size in the recommended list on mobile · our own value, not yet measured on every app version) and if you can still read the words on it and tell what the video is about, it can be sent.

## Use when

- Making a new YouTube thumbnail, or fixing a thumbnail people do not click
- Thai text on the thumbnail is too small, sinks into the background, or has tone marks colliding
- Wanting to test several thumbnails to see which is better

## Do not use when (use another, or pair them)

| Job | Use |
|---|---|
| TikTok · Reels · post covers or channel banners | `social-formats` |
| Script or the hook in the first 5 seconds of the video | `speaking-script` · `video-script-to-clip` |
| People or scenes that must be made with AI | `brief-to-image` · `image-generation` |
| A whole series of thumbnails that must look like a set | `style-consistency` · colours and fonts from `brand-kit` |
| Checking the look before sending | `design-review` |
| Starting a thumbnail design that has no direction yet | **Search references first:** take the project's words and search live per `design-references` (plugin `superuser`), type `social`, then pull colours from the chosen work · the stored palette library is for when live search is not possible |

## Steps

1. **Pick the one thing the thumbnail must say.** Let the thumbnail and the video title tell the story together without repeating words · the title gives detail, the thumbnail gives the feeling or the result.
2. **Set up a 16:9 page** at the working size from YouTube Help (see the section "YouTube requirements"), then export as JPG or PNG · the source image may be larger than the working size, up to the maximum that page gives.
3. **Text of at most 3–4 words**, bold, at least about 1/6 of the image height (our own value) · for Thai, leave space above and below the line for tone marks and vowels (line spacing at least 1.3 times the font size · our own value) · use a Thai font that really has a Bold or Black weight, not the regular weight made fake-bold.
4. **Contrast:** text and background differ by at least 4.5:1 (WCAG 2.2 threshold for normal text, the same number as `brand-kit`) · busy background → add a text outline, shadow, or a colour bar behind the text.
5. **Leave the bottom-right corner empty.** YouTube puts the video length badge over that corner (visible on every list page) · keep text and faces on the left or in the middle.
6. **Vertical video:** YouTube makes a 4:5 thumbnail automatically from the 16:9 one on the home and subscriptions pages · put the important part in the middle of the image so it survives the crop.
7. **Shrink to 168 px wide** (with a script or any program) and answer 2 questions: can you read the text · can you tell what it is about · fail → cut words, enlarge the letters, or remove elements.
8. **Filter before upload (for looks, compare in pairs, do not score).** Take the 2–3 thumbnails you made, shrink them to 168 px wide, and have 3–5 people choose pair by pair which thumbnail they would rather click, swapping left and right in every pair. Put the result in the same format as [`references/thumbnail-pairwise.example.json`](references/thumbnail-pairwise.example.json) and run `node <decision-scoring>/scripts/decide.mjs pairwise file.json` (`<decision-scoring>` is the folder of skill `superuser:decision-scoring`) · a close result (the script says below 60%) → send both thumbnails into Test & compare and let YouTube decide, no need to choose yourself · drop a thumbnail that loses clearly · the example in the file is made-up data, run and passed on 2026-10-28
9. **Test several thumbnails (Test & compare)** when the channel has it enabled (table below) · make 2–3 truly different versions of 1 topic (a face vs a product image · with text vs no text), not just different colours.

## YouTube requirements

| Topic | Value | Status |
|---|---|---|
| Size | Ratio 16:9 · Shorts thumbnail 9:16 · maximum size, minimum size and recommended working size: look them up live on the YouTube Help page | Look up live |
| File | Accepted file types, and the file size ceiling for uploading from mobile and from a computer: look them up live on the YouTube Help page | Look up live |
| Right to upload custom thumbnails | Account must be verified first · there is a daily upload limit | Official page |
| Test & compare: how many versions can be tested | Can test thumbnails, titles, or both · look up the maximum number of versions live on the Test & compare page | Look up live |
| Test & compare: who can use it | Channels with advanced features turned on · done in YouTube Studio on a computer · not usable with Shorts · videos made for kids · adult or 18+ videos · private videos · scheduled live streams · Premieres that have not ended | Official page + 1 source |
| Test & compare: how it decides | Uses **watch time share**, not click rate · no clear winner → shows the first version uploaded · the result shows as Winner or Preferred | Confirmed by 3 sources |
| Test & compare: how long it takes | Look up the test length live on the Test & compare page | Look up live |

The test result is decided by watch time, so a thumbnail that lures clicks but makes people leave quickly loses · never promise the user "clicks will go up".

Look up live: the thumbnail size, file limit and Test & compare limits (number of variants, test length, who can use it) at the two YouTube Help pages in the sources section. Look it up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน).

## Worked example

Brief: a cooking channel, video "ต้มยำกุ้งน้ำข้น 15 นาที" (creamy tom yum goong in 15 minutes)

| Step | Do | Result |
|---|---|---|
| One thing | The thumbnail says "fast", the title says the dish | Text on the thumbnail "15 นาที", 2 words |
| Layout | Bowl of tom yum on the left, the cook's face top right, bottom-right corner empty | The length badge covers nothing |
| Shrink to 168 px | "15 นาที" is readable · the orange bowl is visible | ผ่าน (pass) |
| Test | Version A has a face · version B the bowl only | Set up Test & compare, then wait for the result for the length of time the YouTube Help page gives |

## Check before sending

- [ ] 16:9 · size and file are within the ceilings looked up live from YouTube Help (both mobile upload and computer)
- [ ] Text ≤ 4 words, contrast ≥ 4.5:1 · Thai tone marks do not hit the edge or another line
- [ ] Bottom-right corner empty · vertical video has the important part in the middle of the image
- [ ] Shrunk to 168 px wide and still readable
- [ ] The thumbnail matches the real content of the video and does not trick people into clicking · the image, fonts and faces are licensed for use
- [ ] Passes `no-ai-look` item 3

## Sources

- YouTube Help: [Add video thumbnails](https://support.google.com/youtube/answer/72431) (size · file · account verification · 4:5 thumbnail for vertical video · look up live) · [Test & compare thumbnails and titles](https://support.google.com/youtube/answer/13861714) (official)
- Test & compare matches thumbnailtest.com · digit.in · streamlabs.com (thumbnailtest.com still says it is only for beta testers, which is out of date)
- Contrast: [WCAG 2.2 Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) (cited through `brand-kit`, checked 2026-10-06)
- Values marked "our own value" (168 px wide · letters 1/6 of the height · line spacing 1.3 · bottom-right corner) are internal guidelines, not yet measured on real apps
