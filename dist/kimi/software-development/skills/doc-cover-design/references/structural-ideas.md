# Cover structure styles: pick 1 per project

Read this when doing `SKILL.md` step 1.4. Every style uses the same page system (step 3). Projects on the same machine must not use the same style (step 2).

## Logo-shape style (the default path, won the 2-of-3 vote)

The cover image has only shapes from the real logo's SVG file, enlarged, repeated, cut, or arranged. No illustration, no screenshot, no glow.

| Structure | What it shows | Fits apps that | How to build it | Document type = |
|---|---|---|---|---|
| **Tiling** | Many pieces forming one system | Network · platform · multi-user system | The whole page is a grid of cells the size of the logo tile. A thin-line cell = not joined yet · a solid cell = joined · the giant document code takes 2–3 cells | Number of solid cells (2 → 5 → 11 · order from a seed) |
| **Giant crop** | One thing, its scale and focal point | Single tool · app with one clear symbol | Enlarge the shape until it overflows the page, with the shape's edge landing on a 96 px edge · construction lines and dimension lines from the logo's real units | Camera angle: close-up → whole shape → pulled back to show construction lines |
| **Sequence (chronophotograph, a multiple-exposure image of motion)** | Change over time | Apps with movement, gestures, steps | The logo 6+ times stacked on one line. Past frames are flat colors stepping down one level at a time (not a gradient), the current frame is solid, future frames are thin lines. A frame-number ruler sits under the line | Which frame is solid |
| **Slice / lift layers** | Layers of the system | Systems with many layers (keep for the next project) | Cut the logo into horizontal strips and shift each strip | Number of layers shifted |
| **Stack** | Accumulation | Data · logs · storage | Logos stacked, each offset slightly | Number of pieces in the stack |
| **Fan rotation** | Multiple options | Settings · routing | The logo rotated about one point at equal angles | Angle of the spread |

## Real-screen style (the fallback, wins only for projects where the logo does not say what the app does)

Use it when the logo alone does not say what the app does and the project has a clickable mockup. Take screenshots with playwright at 2x. Hide the mockup's toolbar before shooting.

| Layout | How to do it | Watch out for |
|---|---|---|
| **Oversize crop** (Telex won) | Enlarge the screen 2x so it overflows the top and right edges of the paper. The left column is a magazine masthead. End the document title with the logo's cursor | Crop offsets are in screen pixels (1440 × 900), then multiplied by the scale. No half-cut words at the edge |
| **Tilted plane** | The screen lies tilted as if on a desk, running off the bottom edge | It can easily look like a generic SaaS web page. It must fade out before the data row |
| **Specimen in a frame + magnifier** | The screen is mounted on white paper like a museum piece. The key part is enlarged in a separate frame, pointed to with a CSS selector, not coordinates | The big image must not make people misunderstand the app |

Document type = a different screen each (BRD welcome screen · SRS main screen · ARCH screen showing many parts at once) + a document code that stays readable in the thumbnail.

## Pictogram of what the app really does (won SwipeOS in round 2)

A pictogram grid of the app's whole set of commands or gestures, e.g. hand gestures G01–G12 from the data dictionary, drawn on MediaPipe's 21-point hand landmark skeleton. The cell for the gesture this document discusses is solid. Borrowed from the Microsoft Inclusive Design toolkit. It tells the client "a hand-gesture app" at a glance. Watch out: gestures with bent fingers need real hand proportions, or they look like claws or a broken hand.

## Institutional document-set style (lost round 2 but the easiest to repeat)

In the style of NIST SP · IETF RFC · Apple Platform Security: the document data is the design · thick lines · letter-spaced category bar · lots of white background. Reviewers said: trustworthy but so quiet that every project looks the same. → Use it for print covers or government/security documents, and borrow only the series-name line.

## Art-from-real-data style (a few standout covers, but hard to repeat)

Draw the app's behavior from real data, e.g. 11 real machines on an arc with a tick for each key rotation every 120 seconds · real protocol bytes · 21 hand points passing a real gesture threshold.
Use it when the user wants a single cover with a big "wow" and accepts project-specific code (~200 lines). Watch out for: rotated text labels too tight · numbers a BRD client cannot read · a data row floating in the middle of the page.

## Tried and cut

- Diagonal staircase sequence of thin-line frames → the page looks empty. Changed to one line of solid stacked frames.
- Extruding the square logo into an isometric block → it became a clip-art "tech" 3D image, and the diagonal lines fought the grid.
- A pink-purple-blue gradient cursor following the logo file → a gradient on a dark background is the fingerprint of AI work. Use one flat color.
- A laptop frame around the screenshot · pins pointing at parts of the screen → fake and cluttered.
- A random connection-dot graph on top with the document title at the bottom → the same structure as the old cover.
