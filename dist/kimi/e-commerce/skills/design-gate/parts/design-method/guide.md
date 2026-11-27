# Design method · any medium

The general order for every design job, whatever the medium: an image or logo, a document or deck, a voice or music track, a video, a screen. The medium-specific parts (`design-references` · `no-ai-look` · `polished-document-style` here, and the type files in graphic-design `design-by-type`) plug into these steps. The owner asked for one medium-neutral method on 2026-11-27, after the CodeRuen logo rounds showed which steps made the difference.

## The 12 steps

### 1 · Brief: what it is, for whom, where it lives
Steps 1–4 fill **one** brief, the 7-field `เนื้อหา:` brief in `design-references` `references/content-to-theme.md` (โปรเจกต์ · เรื่อง · ความหมาย · คนดู · อารมณ์ · ธีม · สี). Do not write a second brief. Write before anything else:
- what the project means: why it exists, what its name says, what people should remember it for (field `โปรเจกต์`);
- what the piece is and what it must make people do;
- who sees or hears it;
- where it will be used, and in what size, length and format;
- what is fixed (brand, deadline, budget, licences).

**Facts vs readings:** a missing fact (name, number, date, price, licence) gets `(รอยืนยัน · ผู้ใช้: <what to give>)`, never a guess. A reading (feeling, theme, what the name means) may be inferred and marked `(เดา)`. Both go in the end-of-job question.

### 2 · Feelings: 2–3 words the audience must get
Short words, not a slogan (CodeRuen: `เร็ว · น่าเชื่อถือ`). Infer them from the business line if the brief is silent, and mark them `(เดา)`. These words are the brief's `อารมณ์` field; pick them from the mood table in `content-to-theme.md` section 3.

### 3 · One meaning per piece
Each direction carries **one** feeling through **one** carrier. It does not have to show the brand name literally. In the CodeRuen rounds, house + code + speed in one mark topped out at 6–7. One meaning from the work desk got "นี่แหละ แบบที่อยากได้เลย". This one meaning is the brief's `ความหมาย` field, and it must fit the `โปรเจกต์` line.

### 4 · Idea map: where the carrier comes from
Fill it before searching:

| Source | Ask |
|---|---|
| The work environment | What tools, objects, sounds and places surround the work? |
| The result for the customer | What do they get at the end? |
| The action | What verb is the work? |
| The name (always check; use as a carrier only if it helps) | What does the name mean or sound like? Read it from the brief's `โปรเจกต์` field; if unknown, mark `(เดา)` and ask only in the end-of-job question. Is there an object or sound in it? |
| Local culture (optional) | Is there a local shape, sound or phrase people know? |

Pair each feeling with 2–3 carriers. For medium-specific carriers, see the table below.

### 5 · Owner's taste and locks
Read `~/.claude/superuser-style.md` (preferred styles + choice log) and the project's locks (brand guide, style lock, sibling pages, voice already chosen). The project beats general taste: a coffee shop gets a coffee look. Keep the owner's taste in what transfers, such as depth, light, one strong focal element, gradients and real textures.

**2nd piece or later of a project:** open the pieces that already passed and the style lock first. The new piece continues that language (stroke, corner, palette roles, type, voice) unless the owner asked for a new look; then make 1 direction in that language plus up to 2 that stretch it, and say which is which.

### 6 · Live references, same industry and same medium
- Search now, not from memory. Use the type's sites, with feeling + carrier + style + industry in the query.
- For each work, note the link, the date, a popularity number if the site shows one, and **what it communicates**. Borrow the craft (proportion, construction, material, timing), never the work itself.
- When the owner asks mid-job for a new element, search 4–8 versions of that element first. The owner picks, or 3 fresh agents vote.
- Details: `design-references` guide.

### 7 · Directions that really differ
- Make 3 directions by default, 5 when the owner asks for a range.
- Each one is a different style **and** structure, not only a colour swap. Give each its own palette when styles must read apart (CodeRuen round 9: a shared palette made 5 styles look like 2).
- Under each direction write one line: `ความหมาย · ตัวสื่อ · สไตล์ · สี · ฟอนต์`.
- **Colour per direction:** start from the brief's `สี` tone and reason. Take the hex from that direction's chosen reference (`design-references` "Steps" item 4), then check it against what colours carry for this audience (`content-to-theme.md` section 4). Write a 1-line reason next to the main and accent colour. Brand-locked → keep the brand colours; the direction only decides which one leads.
- **Type per direction (visuals and documents):** one Thai + Latin pair, or one family in 2 weights, whose look matches the brief's `อารมณ์` (looped Thai for friendly or long body text; loopless for modern, short headlines). Licence checked (OFL or bought). 1-line reason. Pairing list: graphic-design `brand-kit` `references/thai-fonts.md`. Voice and music: the voice persona and the tempo band play this role.
- Lock the style of each direction before making anything.

### 8 · Craft: one language, tested at every real size
- **One language per piece:** one stroke weight, one corner radius, one light direction, one voice, one music key and tempo family.
- **Layout and hierarchy:**
  - one focal point people see first, then a clear reading order (1st → 2nd → 3rd);
  - each level differs clearly in size, weight or colour, not by a little;
  - elements share a grid or edge; related things sit close, unrelated things sit apart;
  - empty space round the focal point; the visual weight feels balanced;
  - check: blur or squint at the real render, and the focal point and reading order must still show within 1 second;
  - audio and video: one main voice or sound in front, everything else under it.
- **Build the plain master first** (flat silhouette, dry voice, wireframe, outline), and make it pass. Add depth, effects and mixing only after.
- **Test at the edges of use:**
  - visuals: 16 px, thumbnail, one ink, reversed;
  - documents: printed page, phone screen;
  - audio: phone speaker, earbuds, loud room;
  - video: muted autoplay with subtitles.
- **Medium craft rules:**
  - Thai typesetting in `human-writing` and `polished-document-style`;
  - loudness and clarity in graphic-design `video-editing` and `narration-th`;
  - depth limits in `design-references` `references/depth-and-light.md`;
  - flat rules in graphic-design `design-by-type/references/flat-design.md`.
- **Everyone can use it (accessibility):**
  - text and key marks reach contrast 4.5:1 (3:1 for large text and icons);
  - meaning never rests on colour alone, so check a colour-blind view;
  - Thai stays legible at the smallest real size, with no broken marks;
  - audio and video carry subtitles, and a voice is clear over the room noise from the edge-of-use test above.

### 9 · Make sure it is ours (originality and clash check)
- Put the piece next to every reference from step 6, at the same size. If one could pass for the other, change the structure, not only the colour (FaoDee round 4: a camera drawn "after" a reference came out too close to it).
- **Logo or name:** search the trademark registers before the owner commits: Thai DIP (`search.ipthailand.go.th`) and WIPO Global Brand Database. Write what you searched and the date. A clash goes to the owner as a choice, not a silent redraw.
- **Music, jingle or voice:** compare with known tracks and voices. Never imitate a named artist's voice or a famous melody.

### 10 · Show it in real use, then a fresh critic
- **Real use:** put the piece where it will live, using real photos or real playback (a sign on a wall, a mug, a phone screen, a printed page, the voice over the actual video, a jingle on a phone speaker). A piece that only looks good on a blank canvas is not done. A piece in a set is also shown next to the passed pieces, and must read as the same family.
- **Fresh critic:** a fresh critic who did not make it checks the real render or recording. Calibrate the critic against the owner's past scores, because critics run 1–2 points high. Send old and new in one call and ask which is better on each criterion.
- **Target:** 8 on the owner's scale (7 with no 0 is the floor for sending, per graphic-design `wow-score.md`). Stop after 2–3 fix rounds and send with the honest score and what is still short.

### 11 · Present, record, hand off
- **Present:** one board or page with every direction, its meaning line, references with links, the critic score, and open items marked `(รอยืนยัน)`. The owner picks. Ask once at the end, as a choice.
- **Record:** write the owner's pick and exact words to the choice log in `~/.claude/superuser-style.md`. A win or a repeated miss also goes to memory.
- **After use (when the owner can tell you):** did the piece do what `ความหมาย` asked (enquiries, clicks, customers' words)? Add 1 line to the choice log, so the next brief starts from what worked.
- **Usage guide with the files:** a one-page guide covering clear space round the mark, minimum size, allowed colours and backgrounds, and don'ts (no stretching, rotating, recolouring, effects, or busy photo backgrounds). For audio, note the target loudness, where each sound plays, and the shortest allowed edit. Without it, people misuse the files.
- **Hand off:** deliver final files in every variant the medium needs, with licences noted:
  - visuals: colour, one ink, reversed, icon sizes, outlined text;
  - documents: editable source plus PDF;
  - audio: WAV master plus MP3/AAC at target loudness, with a subtitle file;
  - video: master plus platform cuts.

### 12 · Read the owner's feedback as fixes
The owner answers with a score and a few words. Turn the words into fixes before redrawing, and say back which fix answers which word.

| Owner says | Usually means | Fix first |
|---|---|---|
| แข็ง · ดูแข็งๆ (stiff) | primitive shapes, no light, everything on a grid | real curves from a reference · one light direction · one overlap or bend |
| ไม่มีมิติ · แบน (flat, no depth) | no layers or shadow, unless a flat style was chosen | depth pass (`depth-and-light.md`), or control the flatness (`flat-design.md`) |
| ไม่สื่อ · ไม่สื่ออะไร (says nothing) | the meaning is not readable in one second | go back to step 3 · one meaning, one carrier from the work environment |
| ไม่สมส่วน (out of proportion) | one part too big or too wide | measure the reference's ratios and redraw to them |
| รายละเอียดเยอะ (too much detail) | parts that vanish at small size | drop to the plain master · keep one accent |
| ดูเละ · เอามารวมกัน (messy, mixed) | two objects stacked | one object per mark, or join them into one shape |
| ไม่ทันสมัย (dated) | category clichés, old type | category map (brainstorm topic 5) · a newer typeface · a cleaner palette |
| research มายัง (did you research?) | drawn from memory | step 6 again: live references from the same industry, and the owner picks |

Record the words and the fix in the choice log, so the next round starts from them.

## Brainstorm topics (feed steps 1–7)

What design teams talk through before a product, brand or piece takes shape (research 2026-11-27, sources at the end). Run it as a short session with the owner, or answer it yourself and show the answers on the board.

| # | Topic | Questions | Medium notes |
|---|---|---|---|
| 1 | Problem and goal | What problem does this solve? What must people do or believe afterwards? Explore wide first, then narrow (Double Diamond: Discover → Define, then Develop → Deliver). | all |
| 2 | Real environment | Where and how is the work really done, and where will the piece be seen or heard? Go and look (or look at real photos and videos): tools on the desk, workarounds, interruptions, the moment of use. People's summaries leave these out (contextual inquiry). | visuals: shelf, street, phone · audio: room noise, speaker · documents: printed or on screen |
| 3 | Brand core | Values, personality, positioning, mission, audience. What is true only of this business? | all |
| 4 | Perception goal | What should people believe after the first encounter? Turn vague words ("premium", "modern") into defined meanings. These become step 2's feelings. | all |
| 5 | Category map | Place competitors on a two-axis map (e.g. traditional ↔ progressive, corporate ↔ human). Which conventions does the category share? Follow them where trust matters (finance, health, law); break them where everyone looks the same. Where is the empty space? Test: if a competitor could say the same thing truthfully, it is not different enough. | visuals: logos, colour, type · audio: competitors' sound logos and voices |
| 6 | Metaphors and carriers | Turn each feeling into images or sounds: "if the brand were a vehicle, typeface, piece of furniture, animal, what would it be?" Then pick carriers from step 4's idea map. | audio: tempo, rhythm, texture, voice persona |
| 7 | Style and design code | Look-and-feel boards (one per direction), then design principles in one line each, then the assets: type, colour, shape, imagery, motion, sound. | per-medium styles in the table below |
| 8 | Touchpoints | Every place it must work: sign, app icon, document, video intro, phone hold music. A sound identity is a system (logo, music, voice, effects), not one jingle. | all |
| 9 | Ideation rules | Defer judgment, quantity before quality, a time limit. Keep early prototypes rough so many ideas survive. "Prototype as if you are right, test as if you are wrong." | all |

## What the steps mean per medium

| Step | Image · logo · poster | Document · deck | Voice · music · sound | Video |
|---|---|---|---|---|
| Carrier ideas (4) | objects and tools from the work: mouse pointer, keycap, terminal | the reader's task: a checklist, a timeline, a map | sounds of the work: keyboard click, notification, machine hum; voice persona | one scene from the customer's day |
| Styles to choose from (7) | flat geometric · soft 3D · monoline · logotype · isometric · depth · flat design · emblem | editorial · corporate profile · data-led · magazine | warm narrator · energetic host · calm expert; acoustic · electronic · orchestral; tempo band | documentary · motion graphics · UGC · cinematic |
| Plain master (8) | flat black silhouette at 16 px | wireframe of the headings and grid | dry voice read with no music | storyboard or animatic |
| Real-use test (10) | wall, mug, laptop, phone, print | printed A4, phone PDF, projector | phone speaker, earbuds, over the real video | muted feed, vertical crop, subtitles on |
| Licences (11) | fonts (OFL or bought), photos (Unsplash or owned) | fonts, images, icons | voice rights, music licence, TTS terms | footage, music, voice |

## Check before sending
- [ ] One 7-field brief written, `โปรเจกต์` first; missing facts marked `(รอยืนยัน · ผู้ใช้/agent/ภายนอก: …)`, readings marked `(เดา)`
- [ ] Every direction has one meaning and a `ความหมาย · ตัวสื่อ · สไตล์ · สี · ฟอนต์` line, with a reason for colour and type
- [ ] Live references opened this round, with links and dates
- [ ] Directions differ in style and structure, not only colour
- [ ] Focal point and reading order survive the blur test; a piece in a set reads as the same family
- [ ] Plain master passed before effects; tested at the edges of use; accessibility checked
- [ ] Compared against every reference at the same size; trademark search noted for a logo or name
- [ ] Shown in real use; a fresh critic scored it against the owner's scale
- [ ] Owner's pick and words recorded, with each word turned into a fix; final files, licences and a usage guide delivered
- [ ] Every open item names who it waits on (`ผู้ใช้` · `agent` · `ภายนอก`), and the answer ends with **ต้องให้คุณทำ** when the user has items

## Sources (viewed 2026-11-27)
- Design Council, Framework for Innovation (Double Diamond): https://www.designcouncil.org.uk/our-resources/framework-for-innovation/
- Nielsen Norman Group, Contextual Inquiry (K. Flaherty, 2020): https://www.nngroup.com/articles/contextual-inquiry/
- Smashing Magazine, From Kickoff To First Concept (A. Sycheva, 2026-07-10): https://smashingmagazine.com/2026/07/how-turn-brand-strategy-into-visual-direction/
- Studio Republic, brand discovery workshop: https://www.studiorepublic.com/blog/a-guide-to-our-brand-discovery-workshop/
- DeSantis Breindel, visual brand audit: https://www.desantisbreindel.com/insights/visual-brand-audit/
- Interaction Design Foundation, Ideate stage: https://ixdf.org/literature/article/stage-3-in-the-design-thinking-process-ideate
- Nielsen Norman Group, Visual Hierarchy in UX (definition): https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- Interaction Design Foundation, Visual Hierarchy: https://ixdf.org/literature/topics/visual-hierarchy
- Figma, What is visual hierarchy (Gestalt basis): https://figma.com/resource-library/what-is-visual-hierarchy/
- Kantar, sonic branding: https://www.kantar.com/inspiration/brands/how-sonic-branding-builds-a-deeper-connection-with-your-audience
