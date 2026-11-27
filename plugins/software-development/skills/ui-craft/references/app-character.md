# App character — choose color, corners, density and motion from how the app is used

An app used for serious work should be plain and calm. An entertainment app should be bright and playful. Choose **1 character** before drawing the first page, then use the same set of values for everything in the project: the mockup, the mockup's home page, the document cover and the logo.

Comparison image: [`../assets/app-character-sheet.webp`](../assets/app-character-sheet.webp) shows the same list card in the 6 characters. The HTML source is at [`../assets/app-character-sheet.html`](../assets/app-character-sheet.html) and can be used as a starting point.

## 1 · Choose from 4 questions (answer from the Business Requirements Document (BRD) or the user's request)

| Question | Leans plain and calm | Leans bright and playful |
|---|---|---|
| Who uses it | Working people, experts | General public, teenagers, children |
| How often and how long | Every day, several hours a day | Occasionally, a few minutes at a time |
| What is lost if they tap wrong | Money, data, health, work | Almost nothing |
| Where it is used | Desk, large screen | Phone, while traveling |

**If the answers conflict, the question "what is lost if they tap wrong" wins.** For example, a finance app for teenagers uses character 2 and may add a secondary color that is 1 level brighter, but the corner radius, density and tone must still be character 2.

## 2 · The 6 characters

| | 1 Work tool | 2 Finance, health, government | 3 Lifestyle, shopping, food | 4 Entertainment, social, casual games | 5 Children, learning | 6 Premium, creative |
|---|---|---|---|---|---|---|
| Examples | dev tool, admin, ERP, terminal | bank, insurance, hospital, e-service | restaurant, travel, shopping | music, video, chat, quiz | learning app, skill game | fashion, portfolio, luxury hotel |
| Neutral color share of area | 85–90% | 80% | 70% | 50–60% | 60% | 85–90% (white, black) |
| Brand color | 1 color, medium saturation | 1 deep color, low saturation (blue, dark green) | 1 warm color + 1–2 secondary | 2–4 highly saturated colors, gradients allowed | bright but soft colors + 1 dark color for buttons | none, or 1 metallic color (gold) |
| Default theme | dark for dev tool, light for admin | light | light, warm background | light, or gradient | light | dark, or plain white |
| Corner radius | 4–8px | 8–10px | 12–16px | 20–24px or capsule | 20–28px | 0–2px |
| Density (`ui-craft` section 8) | dense 32–36px | normal 44px | airy 48px | airy 50px | very airy 56–60px | airy, with a lot of empty space |
| Type | plain sans, body 13–14px, weights 400/600 | sans, body 15–16px | sans, body 15px, bold headings | rounded sans (Nunito etc.), heading 800 | large rounded headings, body 18px and up | serif headings, thin sans body |
| Icons | line, 16px, single color | line, in a light-colored box | full color or emoji | in a gradient circle, emoji allowed | large 40px and up, full color | the fewest, or none |
| Shadow | none, use lines | thin line | soft warm shadow | brand-colored shadow | thick border instead of shadow | none |
| Motion (`ui-craft` section 7) | 100–150ms, response only | 150ms, the least | 200ms | 250–400ms, bounce allowed | celebrate on success | slow 300ms fade |
| Illustration | none | very little | photos lead | drawings, mascot | mascot, stars, rewards | large photos |
| Message tone | direct, short, technical terms allowed | polite, clear, no alarming terms | friendly | playful, emoji allowed | easy words, praise often | few words, chosen words |

Choose the brand's tone axis and level of polish per `graphic-design` section 2, then compare with this table. If they do not fit (for example a "challenging" brand in a character-2 app), tell the user.

## 3 · What does not change in any character

- **Color contrast:** text must pass 4.5:1 and large text 3:1 (`ui-craft` section 5), especially text on gradient or pastel backgrounds
- **Scale:** use one spacing scale and one type scale for the whole app; the character changes only the chosen values
- **5 states:** every screen must have all 5 states; an error message in a playful app must still say what happened and what to do next
- **Status colors:** keep the usual meanings; red means error; never use a brand color that happens to be red for a normal button
- **Motion:** must be switchable off per `prefers-reduced-motion`
- **Playful does not mean cluttered:** a screen still has only one important thing (`ui-craft` section 3)

## 4 · Record it so every piece follows it

- Write the chosen character as the first-line comment of the token file, for example `/* app-character: 1 work-tool */`, and put it in the `ตัดสินใจเอง` (decided on my own) table in `docs/BUILD-PLAN.md` with the answers to the 4 questions
- **Word documents (`document-design`):** use the same brand color set, but the document body stays formal, because the readers are the approvers. Apps of character 4–5 may change only the cover, which can use brighter colors and rounder corners.
- **Logo (`graphic-design`):** the shape must lean the same way. Characters 1–2 use a square block with rounded edges. Characters 4–5 use very round shapes or a mascot.
