# Font voice

Used in `SKILL.md` section 0.1 step 3 · the type must convey the same mood as the color and layout (rounded type leans friendly, angular type leans fast and strong). If the font voice does not match the project's basics, the page looks inconsistent even when the color and layout are right · every font pair in the table is in `design-direction-lookup/data/font-pairs.csv`, column `voice`, with a checked license

## Choose from the project basics, not from the maker's taste

Ask one question at a time. The first question with a clear answer gives the voice to use.

1. **Does the brand already have a font?** Yes → use the brand's font and stop at this question
2. **What should the product make people feel in the first second?** (friendly · fast and strong · trustworthy · luxurious · playful), then look at the table below
3. **Who reads, and for how long?** Elderly readers, long documents and government forms: readability beats mood → `formal` for the body text, while the headings may still use the voice from question 2
4. **Does the chosen look force anything?** Use the "type" column in [`web-looks.md`](web-looks.md); for example neobrutalism leans `angular` · luxury leans `classic` · claymorphism and playful lean `rounded`

Once you have the voice, pass `--voice <value>` into `design_draft.py`; direction (a) gets that voice's font pair · direction (c) (bolder) may try an adjacent voice (`modern` → `angular` or `rounded`) but must not jump to the opposite voice, for example a bank using `hand`

## The 6 voices

The shapes in the "look" column come from `notes_th` of `thai-fonts.csv` · the cautions come from `font-pairs.csv` and `no-ai-look`

| voice | Look | Use when the project basics are | Pairs in data (all pairs) | Watch out |
|---|---|---|---|---|
| `rounded` (soft round) | Rounded heads, thick round, or friendly geometric shapes (Mitr thick round · K2D rounded · Kodchasan wide round heads · LINE Seed round · Niramit soft curves · Prompt geometric) | food, cafe, clinic, education, shop chat, community | `mitr-sarabun` · `line-seed` · `line-seed-sarabun` · `kodchasan-k2d` · `k2d-plex-health` · `niramit-warm` · `prompt-noto-looped` | finance and legal work have no pair of this voice in the data (use `modern` or `classic`) · `line-seed` must be self-hosted and must not imply it belongs to LINE |
| `angular` (fast angular) | Squared heads (Bai Jamjuree) or cut-corner squares (Chakra Petch) · Kanit has no cut-end heads and goes as thick as 900; it sits in this group because it is used for promotion and sports headings | games, esports, sports, automotive, industry, sale promotions, work meant to excite | `chakra-plex` · `bai-jamjuree-plex` · `kanit-sarabun` | use at headings; body text in every pair is a plain face (Plex · Sarabun) · Kanit is heavily reused in Thai work; choose it when the brand really needs a heavy heading |
| `modern` (plain modern) | No heads (loopless) · IBM Plex Sans Thai is designed to pair with Latin Plex · Anuphan geometric · Noto Sans Thai must declare a Noto Sans pair | business software, developer tools, fintech, startups, back office, banks, multilingual systems, Android apps | `plex-sans` · `dense-admin` · `noto-sans` · `dev-terminal` · `anuphan-plex` · `anuphan-sarabun` · `anuphan-krub` · `google-sans-android` | once you choose this, the direction's boldness must come from elsewhere (heading size · hero image) · `google-sans-android` makes it look like Google; use it when the app really lives on Android |
| `formal` (readable, formal) | Has heads (looped) for long body text, elderly readers and official documents · Atkinson Hyperlegible clearly separates I l 1 O 0 | government, hospital, insurance, elderly users, long forms, low-vision users | `sarabun-gov` · `noto-looped` · `plex-looped-read` · `atkinson-access` | use mainly for body text; headings may use the voice from question 2 |
| `classic` (classic luxury) | Has heads, traditional Thai type forms, serif or stroke contrast (Trirong high contrast · Taviraj serif · Chonburi didone · Fahkwang medium contrast · Thasadith plain strokes · Pridi slab serif · Maitree serif for long reading) | hotel, spa, beauty, gold shop, fashion, media, books, law, ceremonies, weddings | `trirong-taviraj` · `trirong-sarabun` · `chonburi-luxe` · `fahkwang-athiti` · `thasadith-athiti` · `charmonman-ceremony` · `taviraj-legal` · `noto-serif-editorial` · `maitree-longform` · `pridi-news` | giant italic serif is an AI shortcut (`no-ai-look` `italic-serif-display`) · never use Chonburi below 24px |
| `hand` (handwriting) | Handwriting (Mali children's hand · Itim round heads · Sriracha marker pen · Playpen) or slanted shop-sign heads (Pattaya) · mostly a single weight | children's work, learning, crafts, street food, cafe, bakery | `mali-kids` · `playpen-kids` · `itim-craft` · `sriracha-prompt` · `pattaya-mitr` | 1 handwriting spot per page, the rest in a readable face · never use Sriracha and Pattaya for body text |

## Check before sending

- Turn off the color and look at a black-and-white screenshot: does the heading still convey the same mood as the hero-screen sentence (section 0.1 step 1)? · If not, the font voice does not match
- The box corner radius leans the same way as the type: `rounded` pairs with round corners · `angular` pairs with small or cut corners · rounded type in very square boxes, or angular type in very round cards, needs a reason from the brand
- Zoom in on large Thai type to check the upper vowels and tone marks per `no-ai-look` item 8 · bold headings with tight line-height often make tone marks hit the line above
