# User experience (UX) spec outputs — user flow and interaction spec

Text parts of a UX spec that sit beside the clickable HTML mockup (`mockup/<CODE>-mockup.html`) — moved from agent `ux-designer` (2026-10-14). Wireframe pictures inside a .md spec: ASCII and inline SVG templates are in skill `markdown-visuals` (`references/ascii-patterns.md`, `references/svg-snippets.md`).

## User Flow
```markdown
## User Flow: <task name>

**Goal:** <what user wants to accomplish>
**Entry point:** <where they start>

1. User lands on Page A
2. Clicks "Get Started"
3. Sees Form B with fields: ...
4. Submits → System validates
   - Right: Success → Page C with confirmation
   - Wrong: Error → Inline error, focus on first invalid field
5. User reaches goal at Page C
```

## Interaction Spec
```markdown
## Component: <name>

**States:**
- Default
- Hover
- Focus
- Active/Pressed
- Disabled
- Loading
- Error

**Behavior:**
- On click: ...
- On hover: ...
- On error: ...

**Accessibility:**
- ARIA label: ...
- Keyboard: Tab to focus, Enter to activate
- Screen reader: announces "..."
```
