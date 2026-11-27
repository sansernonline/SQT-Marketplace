# Skeleton `figure-flow.html` — what the data flows through, in what order

This skeleton answers "what does 1 message (request · job · document) pass through, and in what order?" The skeleton file is at [`assets/figure-flow.html`](../assets/figure-flow.html) · a rendered example is at [`assets/figure-flow-example.png`](../assets/figure-flow-example.png)

```
┌─ figure header ─────────────────────── ①–⑥ meaning of sequence numbers ┐
│ ┌users┐   ┌channels┐    ┌ host machine (grey) ──────────┐   ┌ external services ┐ │
│ │ person │①→│ web    │②→ │ ┌ system .focus (main colour) ┐ │③→ │ AI · API     │ │
│ │ person │①→│ LINE   │②→ │ │ layer · function      │ │   └─────────────┘ │
│ │ person │ →│ back office│ → │ │ layer · function      │ │④→ ┌ data ────────┐ │
│ └────┘   └──────┘    │ └──────────────────────┘ │   │ files · DB   │ │
│                       └─────────────────────────┘   └─────────────┘ │
├─ footnote: meaning of light fill · dashed line · all abbreviations ────┤
```

## Colour — from the project's single main colour

- Change `--accent` in `:root` in one place. The dark shade, light fill and the text colour on the main-colour fill are computed for you. (For a light colour such as yellow, the script switches the text to a dark colour so it stays readable.)
- Find the main colour in the order in `diagram-figures.md` section 5 · to try another colour without editing the file, open `figure-flow.html#accent=0F8B8D`
- **The main colour is used for only 4 things:** the border of the `.focus` box · the system name label · the data path and its sequence numbers · the project name in the figure header
- The rest of the skeleton is neutral grey: dashed groups, host machine boxes, cards. Icons use the 7 existing meaning colours (section 5).

## Rules

- **One direction, left → right**: users → channels → system → things the system calls. If a line must go back, say so in the layer's description (for example "push the reply back to LINE") instead of drawing a return line.
- **Sequence number = the path of 1 message**, not a line number. Lines that happen together share the same number (two incoming channels are both ②) · a branch that does not happen every time (such as reading an image) needs no number.
- **5–9 layers in the system box**, in the order the message passes through them · short layer names, 1–2 lines for each function. If there are more than 9 layers, split into a separate figure of the inside of the system.
- **At most 2 emphasised `.guard` layers**, and explain what they mean in the footnote.
- **Connect a line to the layer that really does the work**, not the edge of the big box. The lines are drawn above the boxes, so the arrowhead reaches the inner layer.
- **Lines that share the same gap must not cross.** Shift the bend with `mx` (a line whose end sits higher gets a smaller `mx`), and render to check every time.
- A label on a line is 1–3 short words saying what flows through (`HTTPS` · `webhook` · `ถาม LLM`) · if the start of the line carries a sequence number, use `lp:"start"` when the final segment is too short
