# Export as a GIF or WebM · motion-basics

## Export as a GIF or WebM

Use when the destination wants a small moving file (email, chat, a web page) instead of a video post. Two passes for GIF, because one pass uses a fixed palette and bands badly. Commands run on ffmpeg 9.0.2 (tested 2026-10-28 on a 2 s test clip: GIF 246 KB at 480 px wide, 12 fps; WebM 21 KB):

```bash
ffmpeg -i in.mp4 -vf "fps=12,scale=480:-1:flags=lanczos,palettegen" pal.png
ffmpeg -i in.mp4 -i pal.png -lavfi "fps=12,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse" out.gif
ffmpeg -i in.mp4 -c:v libvpx-vp9 -b:v 0 -crf 33 -an out.webm      # WebM (VP9), no sound
```

- The file size grows with width, fps and length: lower fps (10–12) and width first, trim the clip second, cut colours last · default values here are untested starting points
- GIF has no sound and only 256 colours per frame; a gradient or photo looks worse than the same clip as WebM or MP4. Offer MP4 or WebM first where the destination plays video
- Never overwrite the source; name the output with the version (`name-v02.gif`)
- Size ceilings per destination (email, chat apps, Shopee and others): (รอยืนยัน) not checked against an official page yet. Open the destination's own help page before promising a size, and record the date
- Check the result: `python scripts/gif_check.py out.gif --max-mb <n> --max-width <px> --max-seconds <s> --max-fps <n>` prints width × height, MB, frames, fps, seconds and loops, and lists what is over the ceilings you pass · it hard-codes no ceiling, so open the destination's help page and pass the numbers · `.webm` and `.mp4` need `ffprobe` on the PATH · `--self-test` runs it on files it builds itself (tested 2026-11-10, 14 of 14)
