# UI Demo — Remotion Recreation

A frame-accurate Remotion recreation of the "UI Demo" kinetic-typography motion
design reference (Pinterest pin `36099234508296370`, 36 s, 16:9, ~30 fps).

Everything is rendered programmatically in React/TypeScript — there are no
image or video assets. The watercolor background, kinetic text, hand-drawn
ellipses, mock chat/preferences/message UIs, animated progress bar, and the
coin-flip "Done" check are all built with CSS/SVG inside Remotion.

## Run it

```bash
npm install
npm run studio    # open in Remotion Studio
npm run render    # render out/video.mp4 (1920×1080 @ 30fps, 36 s)
npm run typecheck # tsc --noEmit
```

## Project structure

```
src/
  index.ts                    Remotion entry point (registerRoot)
  Root.tsx                    Registers the UIDemo composition (1920×1080, 30 fps)
  UIDemo.tsx                  Master timeline — every scene as a timed <Sequence>
  lib/
    fonts.ts                  Google-font loading (Jakarta, Bree, Roboto, Inter)
    theme.ts                  Video config, colors, easings, animation helpers
  components/
    WatercolorBg.tsx          Full-length watercolor background + blur bumps
    primitives.tsx            WordIn, exit hook, sketch ellipse, cursor, caret
    StageZoom.tsx             Gold "Stage N" zoom-in text
    MorphText.tsx             Blur-morph headline (in → hold → out)
    icons.tsx                 SVG icons for the mock UI panels
  scenes/
    intro.tsx                 "UI Demo", "Smart Workflow", "Clean ready interface"
    stage1.tsx                Stage 1 — "User Request" + chat prompt UI
    stage2.tsx                Stage 2 — "Select Options" + preferences panel
    stage3.tsx                Stage 3 — "Analyzing", "Final Output", message form
    finale.tsx                Progress bar → coin-flip "Done" + end card
audio/
  gen_music.py                Synthesizes the 36 s ambient music bed (numpy)
public/
  music-bed.wav               The generated soundtrack (played by the composition)
out/
  video.mp4                   Final render (soundtrack embedded)
```

**About the music:** the reference video's own song is third-party licensed
music, so it is not reused. The soundtrack here is an original ambient
corporate bed (pads, plucks, sub bass, air) synthesized from scratch by
`audio/gen_music.py` into `public/music-bed.wav`, and the composition plays it
directly — so `npm run render` produces the final video with sound in one step.

```bash
python3 audio/gen_music.py   # regenerate public/music-bed.wav if needed
```

## How the timing was matched

The reference was downloaded and sampled at 3 fps (110 frames) plus seven
30 fps bursts around the tricky transitions. Every scene boundary in
`src/UIDemo.tsx` is an absolute frame number derived from those samples
(reference measurements are in 736×414 px and rescaled through the `R()`
helper in `src/lib/theme.ts`). Colors were probed per-pixel from the
reference frames.

## Scene map (30 fps frames)

| Frames | Scene |
|--------|-------|
| 0–12 | Watercolor background intro |
| 12–70 | "UI Demo" word-stagger in, scale-down blur out |
| 58–122 | "Process Visual" → "Visual Layout" blur-morph swaps |
| 112–182 | "Smart Workflow" scale-up + hand-drawn ellipse |
| 176–260 | "Clean" giant→small zoom, then "ready interface" |
| 252–354 | Gold "Stage 1" zoom + "User Request" typewriter |
| 346–416 | Chat prompt UI (typing, cursor, send click) |
| 408–514 | Gold "Stage 2" + "Select Options" + ellipse |
| 506–594 | "Setup Preferences" panel (select, scroll, Continue) |
| 584–662 | "Analyzing input" → "UI Ready" morphs |
| 654–724 | Gold "Stage 3" → "Final Output" |
| 716–796 | "Your Message" form (typing + camera tilt) |
| 788–832 | "Visual Layout" reprise |
| 824–962 | Progress bar 0→100 → collapse → coin-flip "Done" ✓ |
| 954–1080 | Gold "UI Demo" end card + rights footer |
