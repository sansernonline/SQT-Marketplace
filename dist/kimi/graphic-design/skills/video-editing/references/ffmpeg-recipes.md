# ffmpeg recipes · video-editing

Open this when changing aspect ratio or tuning the silence-cutting flags.

## Landscape to portrait 1080×1920

Crop the center of the picture:

```
-vf "crop=ih*9/16:ih,scale=1080:1920"
```

Keep the full picture on a blurred background:

```
-filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]" -map "[v]" -map 0:a
```

## `silences.py` flags

- `--noise`: lower than the quietest speech but higher than the room's noise floor. The script default is -35 dB; ffmpeg's own default of -60 dB is too strict for an ordinary recording room.
- `--min`: the shortest silence to cut (script 0.7 second; ffmpeg 2 seconds).
- `--pad`: margin left around speech (0.15 second) so the first and last syllables are not clipped.
