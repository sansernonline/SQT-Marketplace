# catalog — signals that make work look AI-made (full version)

Extension of `no-ai-look`. Open it when the script reports an unfamiliar rule, or when you must check media the script cannot see.
The "Rule" column is the name in `scripts/slop_scan.py` (empty = checked by the eye gate, item 3.2). The "Source" column uses the codes in section 9. Only items with at least 2 sources are kept, except those marked (1 source).

## Contents

1. [Colors and surfaces](#1--colors-and-surfaces)
2. [Cards, boxes and page structure](#2--cards-boxes-and-page-structure)
3. [Type and headings](#3--type-and-headings)
4. [Motion](#4--motion)
5. [Words on screens, slides and ads](#5--words-on-screens-slides-and-ads)
6. [AI images, logos, posters, posts](#6--ai-images-logos-posters-posts)
7. [Slides, documents, diagrams](#7--slides-documents-diagrams)
8. [Basic quality (not AI, but really broken)](#8--basic-quality)
9. [Sources](#9--sources)

---

## 1 · Colors and surfaces

| Signal | Why it looks AI | Use instead | Rule | Source |
|---|---|---|---|---|
| Purple-blue-cyan or pink gradient | Default from tutorials and frameworks; nobody chose it | 1 brand color tied to the business | `ai-palette` | IM · CM · UN · VP |
| Buttons and links in indigo `#6366f1` | Tailwind's indigo-500, often used by tutorials and AI-generated code (shadcn/ui's default is near-black dark gray, not indigo — checked 22 Oct 2026) | Set your own color tokens | `framework-default` | CM · UN · SK · VP · 21 |
| Gradient text | Decorative emphasis that says nothing | Solid color + size or weight | `gradient-text` | IM · DC |
| Neon/glow shadows on dark backgrounds | The default "cyberpunk" recipe | Reduce glow so the data stands out | `neon-glow` | IM · DC |
| A circular glow behind the content | The most common AI backdrop | Spacing, contrast, clear headings | `radial-halo` | IM · DC |
| Cream/beige background + serif + olive green | "Good taste" that became the new recipe | Choose from the project's context | `cream-palette` | IM · UN · SK |
| Cream background (about `#F4F1EA`) + terracotta accent + high-contrast serif headings as the starting set | The "warm, tasteful" set the model grabs when the brief fixes no colors. Terracotta is close to Anthropic's own brand color, so client work gives it away easily | Colors from the business and the project's real materials · cream is fine when the brand or brief orders it | `cream-palette` in part (catches the cream background, not the terracotta) | AN (1 source · anthropics/skills `frontend-design` Apache-2.0 · checked 2026-10-23) |
| Tinted black (`#111` · `#0B0B0B`) instead of black on every job, with 1 warm accent color as the default | A template's decorating habit applied whatever the subject; looks deliberate but nobody chose it | True black, or a dark shade of a brand color with a reason from the job · note the reason beside the token | | AN (1 source · the template chrome section of `frontend-design` · checked 2026-10-23) |
| Frosted glass across the whole page | Decoration; does not solve a layering problem | Use only for things that really float over content | `glassmorphism` | IM · DC |
| Decorative grid or stripe pattern on the background | Fills empty space with lines | Plain background · grid only for canvas/maps | `grid-bg` `stripes` | IM (1 source) |
| The whole shadcn default set (slate gray · one corner radius across the app · `rounded-2xl shadow-lg p-6` · `max-w-7xl`) | The look of a framework, not a decision | Set tokens for color, corners, shadow, spacing before building | `framework-default` in part | CM · UN · SK · VP · CV |
| Both low contrast and gray on a colored background | Looks "clean" but cannot be read | ≥ 4.5:1 · use a dark shade of the background color | `low-contrast` | IM (1 source) |

## 2 · Cards, boxes and page structure

| Signal | Why it looks AI | Use instead | Rule | Source |
|---|---|---|---|---|
| A thick colored bar on the side of a rounded card | Makes an ordinary card look like a warning | Remove it if it does not show status · a solid-color label | `side-tab` | IM · GD (item 7) |
| Cards inside cards | Too deep; little room left to work | Spacing, type, divider lines | `nested-cards` | IM (1 source) |
| A 1px line + wide shadow on one box | Defines the edge twice | Choose one | `hairline-shadow` | IM (1 source) |
| Corner radius too big for the box | Every card is the same blob | Reduce by box size | `huge-radius` | IM (1 source) |
| A grid of identical icon-heading-text cards | Every item has the same weight | Group · make the important item bigger | | IM · GD |
| Giant number + small label + 3-box stats | A sales-page template | Use numbers when they help explain, with context | | IM (1 source) |
| Fixed page structure: centered hero → 3 cards → customer logos → pricing → FAQ → 4-column footer | The order of a template, not of the page | Build from the page's goal and what the reader must do first | | CM · UN · VP · SK |
| Identical spacing everywhere | Cannot tell what is in the same group | Close within a group, far between groups | | IM (1 source) |
| Everything symmetric, everything centered | No point of intent | Asymmetry · 1 large cell · an off-center hero | | 21 · AN · GA |
| Settings content crammed in a modal | Not enough room | A separate page | | IM (1 source) |

## 3 · Type and headings

| Signal | Why it looks AI | Use instead | Rule | Source |
|---|---|---|---|---|
| Inter/Geist on every job | Makes different products look the same | A font by personality · keep it if it is the brand font | `overused-font` | IM · GD · AN |
| Switching to Space Grotesk on every job instead | The new default | A reason from the project | | UN · SK |
| Giant italic serif | A shortcut to "editorial" | A typeface by the product's personality | `italic-serif-display` | IM (1 source) |
| A small badge above the heading ("Introducing" · "New") | Adds a line that says nothing and looks clickable | Put that word in the heading, or cut it | `eyebrow-badge` | IM (1 source) |
| An icon in a rounded tile above a card heading | The AI feature-card pattern | An icon beside the heading, or remove the tile | `icon-tile` | IM (1 source) |
| Numbers 01/02/03 with no sequence | Clutter that says nothing | Use when there are real steps | `numbered-labels` | IM (1 source) |
| A long display-size heading eating the first screen | No room left to explain | Shorter or smaller | | IM (1 source) |
| Heading and body at close sizes | Cannot be scanned | Clear difference in size, weight, spacing | | IM (1 source) |
| Strongly squeezed letter spacing | Letters touch and are hard to read | Not below -0.03em | `crushed-tracking` | IM (1 source) |
| Emoji in headings or in place of icons | No icon system | One SVG set | `emoji-heading` | CM · UN · WW |
| One thin-line icon set (such as Lucide) at size 16 everywhere | Repeats across every product | Choose a set on purpose · use real screenshots/charts instead | | BL · 2S |

## 4 · Motion

| Signal | Use instead | Rule | Source |
|---|---|---|---|
| fade-up and hover-scale on every piece | Move only what has meaning, 150–300 ms ease-out · a site that must feel alive uses 4 entrance styles in turn, not the same one everywhere (`dynamic-website` in software-development) | | UN · SK · BL |
| A status dot that blinks nonstop | Still · moves when the status changes | `pulsing-dot` | IM (1 source) |
| A blinking cursor in still text | Keep it in typeable fields | `blinking-cursor` | IM (1 source) |
| Text/logos that scroll by themselves | Still, or with a stop button | `marquee` | IM (1 source) |
| Bouncy or stretchy easing | Settle fast · bounce only where it fits the product | `bounce-easing` | IM · GD motion-basics |
| Animating width, spacing, or `transition: all` | transform/opacity | `layout-animation` | IM (1 source) |
| An image that zooms or rotates on hover | Still, unless it says it can be clicked | `hover-zoom-image` | IM (1 source) |
| Content hidden waiting for an animation, and if the script fails it never appears | Visible by default | | IM (1 source) |

## 5 · Words on screens, slides and ads

The main principles are in `human-writing` item 3. This table keeps only what shows up in design work.

| Signal | Use instead | Rule | Source |
|---|---|---|---|
| Broad ad words (supercharge · world-class · seamless · ยกระดับ · ไร้รอยต่อ · ล้ำสมัย) | Say what the user can do and how much better | `buzzword` | IM · WW · 2S |
| "Not a feature. A platform." · "ไม่ใช่แค่… แต่คือ…" | Explain directly | `forced-contrast` | IM · human-writing |
| A long dash in every sentence | English: split into sentences with a full stop · Thai: a space or a new paragraph, no full stop mid-paragraph (`thai-grammar` `f3` `t-dash`) | `em-dash-overuse` | IM · WW |
| Canned opening sentences ("In today's fast-paced world" · "ในยุคดิจิทัลที่…") | Open with what only this product can do | `stock-opener` | 2S · WW |
| Short fragments split by full stops ("Fast. Simple. Powerful.") · sets of 3 · feature names of 2 nouns | A full sentence that carries information | | SJ · CM · WW · OW |
| No names, numbers or dates · claims a competitor could also make | 1 claim only we have, with a number | | 21 · GA · CP |
| Fake proof: a team photo that is not the team · logos that are not clients · invented personas | Real people, real clients only | | 21 · WW · CP |
| Emoji lined up in a promo line | None, or 1 that means something | | WW · CM |
| "theater" used to wave things off | Say what does not work and why | `theater` | IM (1 source) |
| Overly formal words (utilize · facilitate) · stiff connectors (Moreover) · hedges ("It's important to note") | Ordinary words | `stock-opener` in part | WW · TS |
| Thai: wrong register · ครับ/ค่ะ/pronouns that do not fit the reader · literal-translation idioms · English word order · cutting words until curt | Read aloud · register from the table in `human-writing` `references/thai-grammar.md` section 4 · sentence structure per sections 1–2 of the same file · run `scripts/thai_tells.py` of `human-writing` | | 1S · `thai-grammar` |

## 6 · AI images, logos, posters, posts

| Signal | Use instead | Source |
|---|---|---|
| Smooth pore-free skin · every material glossy in the same way | Keep real texture and marks | KR · BK · MF |
| Saturated color, golden or dramatic light in every scene, even indoors | One light source with a reason, matching shadows | BK · GC · KR |
| Teal-orange tone (the shorter the prompt, the more it happens) | Specify the palette, or order it away | FL · 2S |
| Average-looking, perfect, stereotyped people | Details from observation: place, time, what kind of people | BK · KR · CP |
| A showroom-clean scene | Wrinkles, signs of use, ordinary light | MF · KR |
| Wrong physics: shadows not matching light, wrong reflections, bent lines, unrealistic scale | Check by eye before use | KR · MF |
| Hands, teeth, garbled text, crowds with repeated faces | Zoom to 200% to check · put text in a separate layer | KR · FL · MR |
| Using the first image you get without editing | Crop, edit, adjust (1 source, but matches the principle "edit, do not just accept") | CP |
| Clay 3D / isometric / glossy | A style that fits the brand · real photos | 2S · MF · doc-cover-design item 9 |
| Prompting with adjectives ("premium" · "vibrant") | A named style + reference image + hex | MR · VP · CP |
| A gradient circle logo with a hole in the middle · swoosh curves · infinity · circuit patterns | A shape from something specific (DeepSeek's whale · Midjourney's sailboat) | QW · BU |
| Letters that are almost letters, melting, off symmetry, details lost at small size, raster file only | Vector · test at favicon size · real lettering | BU · KR · MR |
| A poster packed edge to edge, no blank space, tiny paragraphs | 1 hero item · lots of white space · cut words so the key word can be big | MR · KR |
| Many fonts and many image styles in one frame (flat + realistic 3D + textured lettering) | 2–3 fonts, one visual language | MR · KR |
| Text embedded in the image | An editable text layer | KR · MR |
| A feed where each post has a different style | One brand system across every post | KR · PN · 2S |
| Floating glowing circles meaning "technology" · stock photos of handshakes · arrows shooting up | The real thing, or empty space | GD (item 7) (1 source) |

## 7 · Slides, documents, diagrams

| Signal | Use instead | Rule | Source |
|---|---|---|---|
| Every slide has one layout with 3–4 bullets of equal length | Change with the content · have some one-sentence pages | | 2S · GA |
| One title pattern across slides (equal length · Title Case · with a colon) | Title = the conclusion (`human-writing` item 6) | | 2S · TS |
| Line icons and middling images that fit any topic | Real photos, charts, screenshots | | 2S · GA |
| No real data, client details or brand | Put in real data, or `(รอยืนยัน)` | | GA · 21 |
| Every bullet starts in bold | Prose, or a plain list | `bold-first-bullets` | TF · TS |
| Emoji before headings · lots of bold · odd bullet symbols | Plain headings · bold in 2–3 places | `emoji-heading` | TS · WW · 2S |
| Over-formatting: lists everywhere, 4 levels of headings, tables in a short note | Merge sections, cut headings | | TS · UM |
| Ending every section with a summary or opinion | End when it has all been said | | TS · WW |
| References or components that do not exist (dead links · fake DOIs · services the system does not have) | Check every one against the source or code | | TS · IL |
| Default-looking Mermaid: self-placed, tangled arrows with no labels, several flows in one picture | The project's house style · a label on every arrow · 1 flow per picture | | YM · IL |
| Lorem text or "ตัวอย่าง" | Realistic content | `lorem` | IM · ui-craft |

## 8 · Basic quality

Not AI signals directly, but really broken, and the script checks them: an input with only a placeholder (`placeholder-label`) · an image with no src (`broken-image`) · a skipped heading level (`skipped-heading`) · text under 11 px (`tiny-text`) · body line spacing under 1.3 (`tight-leading`) · justified alignment (`justified`) · letter-spaced body text (`wide-body-tracking`) · an all-caps paragraph (`all-caps-body`) · a nearly opaque color over an image (`image-overlay`)
Check only from the rendered page (the script cannot see): text overlapped · overflowing its frame · a menu cut off · lines longer than 75 characters · the first column of uneven length · JavaScript errors on load

**Not signals** (the data does not support them; do not hunt to cut): bento grid · mesh/blob gradient backgrounds (UN)

---

## 9 · Sources

Searched Oct 2026

| Code | Source |
|---|---|
| IM | Impeccable — impeccable.style/slop (61 check rules on the web · 62 in the README as of 2026-10-23 · when this catalog was gathered there were 59 + 6 review items) |
| AN | Anthropic frontend-design skill — skills.sh/anthropics/claude-code/frontend-design · the Process section (draft several ASCII layouts, then compare with the brief) from github.com/anthropics/skills/tree/main/skills/frontend-design · Apache-2.0 · seen 2026-11-10 |
| CM | codemyspec.com/blog/vibe-coded-websites-look-the-same |
| UN | claudecodehq.com/playbooks/unslop-ui |
| SK | skills.cat/skills/funboy322/avoid-ai-design |
| VP | vp0.com/blogs/why-does-my-ai-app-look-generic |
| CV | enter.converge.ai/page/en-US/blog/ai-design-sameness |
| 21 | 21st.dev/blog/website-not-look-ai-generated |
| BL | blode.co/writing/you-dont-have-to-make-ai-slop |
| 2S | 2slides.com/blog/can-ai-make-slides-that-dont-look-ai-generated |
| GA | gamma.app/explore/content/guides/what-ai-makes-presentations-that-dont-look-ai-generated |
| CP | creativepool.com (an article on AI images that all look alike) |
| WW | writewithai.substack.com/p/10-dead-giveaways-your-content-screams |
| SJ | seojuice.com/tools/vibe-coded |
| OW | onlinewritingclub.com |
| TS | techspot.com/news/109186 (a summary of the Wikipedia page "Signs of AI writing") |
| TF | tropes.fyi/tropes/bold-first-bullets |
| UM | unmarkdown.com/blog/how-to-make-chatgpt-output-look-professional |
| IL | ilograph.com/blog/posts/diagrams-ai-can-and-cannot-generate |
| YM | yomotherboard.com/?p=585548 |
| KR | krumzi.com/blog/is-this-image-ai-generated |
| BK | ischool.berkeley.edu (Hany Farid on AI images) |
| MF | meltflexai.com/blog/why-ai-renders-look-fake |
| GC | getcoai.com |
| FL | datalab.flitto.com (orange-teal tone in AI images) |
| MR | mikareyes.com (how to spot and fix AI posters) |
| QW | qwe.edu.pl/tutorial/ai-company-logos-look-like-buttholes-2025 |
| BU | bushe.co/answers/how-to-detect-ai-generated-logos |
| PN | postnitro.ai blog |
| 1S | 1stopasia.com/blog/english-to-thai-ai-translation |
| GD | skill `graphic-design` of `software-development` item 7 (this set's original rules) |
