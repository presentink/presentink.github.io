# CODEX.md

## Codex handover / 接管说明

**Present Ink** is the static GitHub Pages portfolio of **Yufan Wang (王聿凡)**.
It is a single scrolling narrative about the path from Chinese calligraphy to
contemporary calligraphy collage. Preserve the artist's name exactly: **王聿凡**
(not 王宇凡) / **Yufan Wang**.

This file records the current, post-refactor state for Codex. `AGENTS.md` and
`CLAUDE.md` are useful historical orientation, but parts of both describe the
old implementation and should not be treated as the current technical truth.

## Current architecture

- The live site is dependency-free HTML, CSS, and JavaScript in `index.html`.
- `index.html` is about 1600 lines after the 2026-08-23 layout rewrite.
- Static media lives in `c1/` through `c4/`, `featured_artwork/`, and
  `hero-video.mp4`.
- The English and Chinese narrative drafts live in `text/`. The live body copy
  is still hard-coded in `index.html`; update both deliberately until a single
  source of truth is introduced.
- `serve.py` starts a cache-free local server. Use it for browser checks:

  ```bash
  python3 serve.py
  # http://localhost:8000/
  ```

## Text-to-image layout

The central interaction is not a conventional image gallery: highlighted
phrases in the narrative and corresponding images form a bidirectional map.
Hovering either side highlights its counterpart; clicking an image opens the
overlay.

The current production implementation begins at `// ===== CHAPTER IMAGE GRID =====`
in `index.html`. Its important functions are:

- `buildThumb()` creates persistent thumbnail nodes and wires image interaction.
- `measureSection()` reads the section geometry once.
- `paintSection()` assigns the CSS grid placement in one write phase.
- `layoutChapters()` schedules the complete layout pass.
- `initChapterImages()` creates the image grids from `sectionImageData`.
- `initializeHighlightLinking()` owns text/image hover linkage.

The rewrite intentionally retained JavaScript measurement: matching images to
specific phrases requires their rendered positions. Do not reintroduce browser
user-agent sniffing, resize-triggered page reloads, per-thumbnail resize
handlers, debug panels, or `console.*` logging.

`ResizeObserver` and `document.fonts.ready` already trigger layout updates.
Keep DOM reads grouped before DOM writes, and verify resizing is idempotent.

## Media conventions

- Chapter artwork is configured in `sectionImageData` in `index.html`.
  Each item may have `id`, `caption`, `placeholder`, `label`, and `imageSrc`.
- An entry without `imageSrc` intentionally renders as a placeholder.
- Images created by `buildThumb()` must retain meaningful `alt` text and
  `loading="lazy"`.
- Featured artwork is still discovered by probing numbered filenames at runtime
  (`featured_artwork/{n}.{ext}`). This is known technical debt; replace it with
  an explicit manifest when touching the carousel.
- Do not rename or move existing media without updating all exact references.

## Verification

For code that changes layout or interaction, run the local server and then the
three-engine Playwright suite when its external test runtime is available:

```bash
python3 serve.py
PW_HOME=/tmp/pw node tests/cross-browser.mjs
```

By default the test targets the filled-grid prototype. Use `TARGET=/` to test
the live page. It covers Blink, Gecko, and WebKit across eight viewport widths,
including overflow, column stability, square cells, highlight alignment,
resize idempotence, hover linking, and overlay clicks.

For smaller content-only changes, at minimum confirm referenced files exist,
load the local page, and inspect `git diff` plus `git status --short` before
handing work back.

## Current priorities

**Active priority:** complete the missing artist-owned artwork for chapters
IV--VII, especially the collage chapters that carry the narrative climax. There
are 16 configured entries without an `imageSrc`; do not replace them with
generic or AI-generated imagery.

**Explicitly deferred until later:**

- Optimize the large images and 10 MB hero video. Preserve quality, resize
  sensibly, and prefer WebP for new optimized image assets when this work starts.
- Add SEO/social metadata, a favicon, and a descriptive document title.
- Replace the featured-artwork runtime probing with an explicit image list.

Also reconcile `text/Artistic narrative.md` with the live copy before any broad
copy synchronization; it still preserves an old duplicate Ch. VII draft.

## 2026-08-24 content and navigation baseline

- The Hero includes public links to Instagram, `Yufan_Wang_CV.pdf`, direct email,
  and the design portfolio.
- `text/Artist Statement.md` is the source copy for the Artist Statement section.
- `The Full Journey` is an ordered index linking to every chapter. Its reading
  times total 25 minutes; update the total and the individual labels together
  whenever chapter copy materially changes.
- The Cloudflare email decoder is gone. Use only the direct public email
  `presentink.studio@gmail.com` when updating contact markup.

## Documentation status

- `IMPROVEMENTS.md` is the working prioritized backlog and accurately records
  the latest refactor.
- `REFACTOR_PLANS.md` documents the prototype decision and final outcome.
- `CORE_FEATURE.md` documents the current post-refactor layout and interaction
  behavior.
- `prototypes/0-original-index.html` preserves the pre-rewrite production page.
  The remaining prototypes are comparative experiments, not the live site.

## Working rules

- Keep the site static and GitHub Pages compatible. Do not add a framework,
  build system, or production runtime dependency without an explicit decision.
- Make narrow, reversible edits; preserve unrelated work in a dirty tree.
- Use `apply_patch` for manual edits.
- Use `rg` for repository searches.
- Before changing visual behavior, inspect both desktop and mobile. This site
  is deliberately a narrative art experience, so visual rhythm matters as much
  as functional correctness.
