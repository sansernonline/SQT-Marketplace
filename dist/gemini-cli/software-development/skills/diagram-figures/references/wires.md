# Connector wires — details

Open this when writing `WIRES` or fixing a line that goes the wrong way.

**Within the same column**, use the downward arrow `.down` between boxes. Nothing more to write.

**Across columns**, use the `WIRES` list at the end of the file. The script draws the lines after the layout is done:

```js
{from:"n-browser", fs:"r", to:"n-server", ts:"l", tp:0.10, label:"HTTPS 443"}
//    ^source id   ^exit side ^target id  ^entry side ^position on the edge 0=top 1=bottom
```

The calculation happens after layout because box positions depend on the length of the Thai text.
If you write fixed coordinates, one text edit knocks the lines off across the whole figure.

**Rules:**

- **Lines run only vertically or horizontally, and turn with rounded corners.** The `elbow()` function in the skeleton does this itself (horizontal → vertical → horizontal). Use `mx` to shift the bend when several lines share one gap. Do not write a `path` as a straight line from point to point, because when the boxes at the two ends have different heights, the line goes slanted.
- **A label must be narrower than the gap between columns.** Otherwise it covers a box or hides the line. If a label gets longer, raise the `gap` of `.stage` to match.
- Move a label along the line with `lp` (0 = source · 1 = target · omit = middle of the line).
- For a line not yet really connected, use `planned:true` to get a dashed line, and **explain the meaning in the footnote.**
- **No more than 5** cross-column lines per figure, because beyond that the figure turns into a spider web.
- Connect to the **smallest box that is correct**, not the large box around it. If a box is very tall, set `tp` so the line does not aim at the middle of the box.
- A label on a line says **what flows through**, such as `HTTPS 443`, not `เชื่อมต่อ` (connect). If there is nothing to say about a line, leave the label off rather than writing "use".
