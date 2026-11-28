# Figma as the source (figma-to-code)

The customer sends a Figma file → read it through Figma's Model Context Protocol (MCP) server and convert it into our HTML mockup · use together with `SKILL.md` section 0 (the project's look wins) and the tokens in `ui-craft` part `web-app-design` → `references/tokens.md`
The tools, plans and quotas come from Figma's documentation, opened and checked 2026-10-23 (the "Sources" table) · Figma itself writes that quotas can change at any time; open the same pages again before proposing a plan to the customer

## Contents

1. [Use Figma or skip it](#1--use-figma-or-skip-it)
2. [Figma MCP server comes in 2 kinds](#2--figma-mcp-server-comes-in-2-kinds)
3. [Pull order, one screen at a time](#3--pull-order-one-screen-at-a-time)
4. [variables → our tokens](#4--variables--our-tokens)
5. [component → mockup HTML](#5--component--mockup-html)
6. [Visual check after conversion](#6--visual-check-after-conversion)
7. [Prohibitions](#7--prohibitions) · [Sources](#sources)

## 1 · Use Figma or skip it

| The file you got | Do |
|---|---|
| Uses components · variables · auto layout · clearly named layers | Pull through MCP per sections 3–5 |
| Flat drawing (names like `Frame1268` `Group5` · no variables · fixed positioning) | Skip MCP · export images to `_to_delete/figma-shots/` and use them as the reference app per section 0.1, then draw the mockup yourself |
| Got only a view link, our account has no permission on the file | MCP reads only files our account has permission on · ask the customer to invite us to the file, or ask for an export |
| The project has a mockup or already-delivered code | The existing look wins (section 0) · use Figma only to see which pages were added |
| Need only colors and fonts | Ask the designer for a style guide or the color values; no need to set up MCP |
| The only account available has just a View or Collab seat | Quota is 20 calls per month (section 2) · the order in section 3 uses about 4–6 calls per screen, so only a few pages can be viewed · ask for a Dev seat or ask for exported images instead |

## 2 · Figma MCP server comes in 2 kinds

The official name now is "Figma MCP server" · it is the channel that lets an agent call Figma's tools

| | remote (recommended by Figma) | desktop |
|---|---|---|
| Address | `https://mcp.figma.com/mcp`, no need to open the app | `http://127.0.0.1:3845/mcp` through the Figma desktop app: open a file → Dev Mode with nothing selected → Enable desktop MCP server |
| Plans and seats | All plans: Starter · Professional · Education · Organization · Government · Enterprise | Dev or Full seat on the Professional · Education · Organization · Government · Enterprise plans |
| Write back to canvas | Yes · outside drafts it needs a Full seat · free during beta, later billed by usage | No |
| Connect to Claude Code | `claude plugin install figma@claude-plugins-official` (also gets Figma's skill) or `claude mcp add --transport http figma https://mcp.figma.com/mcp`, then `/mcp` → Authenticate → Allow access in the browser | `claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp`, then reopen Claude Code |
| Note | Connects only clients in the Figma MCP catalog | Figma for Government can use only this kind |

The quota of the read tools applies to both kinds (write tools such as `add_code_connect_map` `create_new_file` `generate_figma_design` and `whoami` do not count)

| Seat | Starter | Professional · Education | Organization | Enterprise |
|---|---|---|---|---|
| View · Collab | 20 calls/month | 20 calls/month | 20 calls/month | 20 calls/month |
| Dev · Full | none | 200 calls/day · 10 calls/minute | 200 calls/day · 15 calls/minute | 600 calls/day · 20 calls/minute |

## 3 · Pull order, one screen at a time

1. `get_metadata` pulls the short outline of a frame first · a large frame makes it slow, errors, or returns an incomplete result, so pick one part at a time (card · header bar · side bar)
2. `get_screenshot` takes an image of that part and keeps it in `_to_delete/figma-shots/` for the visual comparison in section 6
3. `get_variable_defs` pulls the variables and styles that part uses · say plainly "give me the names and values of the variables", because the agent picks a tool from the instruction, and a broad instruction may return code instead
4. `get_design_context` pulls the code of that part · ask for "plain HTML + CSS", because the default is React + Tailwind
5. The customer has a library → `search_design_system` looks for existing components · variables · styles before creating new ones

Need the variables of the whole file: the Variables REST API works only for a Full seat on the Enterprise plan · other plans pull part by part with `get_variable_defs` and merge them yourself

## 4 · variables → our tokens

Write the values into `:root` of the css file the mockup `<link>`s, in that one place (section 0) · put the Figma variable name as a comment beside the value so it can be traced back · components use only `var(--…)`

| In Figma | Our token | Watch out |
|---|---|---|
| Primary button color · link · selected tab | `--brand` | must pass 4.5:1 (section 5) · if it fails, adjust the shade and note it under **ตัดสินใจเอง** (decided on my own) |
| Page background · card background | `--bg` · `--surface` | card differs from the background by 2–4% (section 4) |
| Lines | `--line` · `--line-strong` | lines are lighter than you think |
| Corner radius | `--radius` · `--radius-sm` · `--radius-pill` | 2–3 values · inside items have a smaller radius than outside |
| Spacing | the scale 4 8 12 16 24 32 48 64 (section 1) | round a value outside the scale to the nearest value, and note it |
| Font size | 5 sizes (section 2) | file has more than 5 sizes → merge |
| Font | `--font` | a font with no Thai letters must be followed by `Noto Sans Thai` |
| Shadow | `--shadow` · `--shadow-lg` | use on things that really float · still cards get no shadow, except a look whose depth language says so (soft SaaS on a landing page) |
| Chart colors · status pill | the data color set and pills in `tokens.md` | a color that signals status must be paired with an icon or text |

## 5 · component → mockup HTML

- **Mockup first, always** (section 0): a new page = a new `<section>` in the existing `mockup/<code>-mockup.html` file, not a React project
- The code from `get_design_context` is raw material; keep the structure (order · groups · text), drop the Tailwind classes, and use the classes the mockup already has (button · card · table · pill)
- A repeated component becomes a class once; do not copy the code per instance
- Real images from Figma are pulled with `download_assets` (remote only) · icons use the platform's set
- Sample text: if Figma's is realistic, use it · if it is Lorem or "Text", replace it with real data per section 0.1
- The 5 states (section 6): a state Figma does not have, draw yourself, then note "not in Figma" in the mockup's control box
- The customer already ties components to real code with Code Connect → `get_code_connect_map` says which component pairs with which code; use it when writing real code, not when making a mockup

## 6 · Visual check after conversion

| Check | How |
|---|---|
| Overall matches Figma | Screenshot the mockup at the same width as the frame and place it beside the image from `get_screenshot` |
| Thai fonts | The browser may use a fallback font in place of the Figma font → look for floating vowels and tone marks and wrong line breaks |
| Long text | Put in the longest real Thai text and see that it does not overflow buttons and table headings |
| Shrink the window | Figma's auto layout is not our responsive design → shrink to 3 sizes |
| contrast · 1 solid button · spacing in scale | The section 9 checklist |
| Beauty gate (`ด่านสวย`) | Section 9 · use the Figma image as the reference app image at the same size |

## 7 · Prohibitions

- Sending the React + Tailwind code from MCP straight as the mockup
- Raw color or spacing values from Figma in components
- Pulling a whole large frame in one go
- Doing the whole system with a View or Collab seat, then running out of quota midway
- Putting a Figma password or token into the repo (the connection uses a browser login)

## Sources

| Topic | URL (opened and checked 2026-10-23) |
|---|---|
| Name · remote vs desktop · plans that can use it | https://developers.figma.com/docs/figma-mcp-server/ · https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server |
| Connect to Claude Code, remote | https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/ |
| desktop server | https://developers.figma.com/docs/figma-mcp-server/local-server-installation/ |
| Quota | https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/ |
| Tool list · React + Tailwind default | https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/ |
| Large frames · agent picks the wrong tool · organizing the file for good results | https://developers.figma.com/docs/figma-mcp-server/avoid-large-frames/ · .../variables-vs-code/ · .../structure-figma-file/ |
| Variables REST API (Enterprise) | https://developers.figma.com/docs/rest-api/variables/ |
