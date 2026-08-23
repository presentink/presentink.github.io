# Core Feature — Text ↔ Image Linked Narrative
# 核心功能 —— 图文双向锚定叙事系统

**Present Ink** is built around a reading experience rather than a conventional
gallery: significant phrases in the artist's narrative are connected to the
artwork that gives them form. The text leads; the image grid answers it.

本网站的核心不是传统作品墙，而是一种阅读体验：叙事中的关键句与对应作品相连，文字引导阅读，右侧图像网格
作出回应。

This document describes the implementation currently shipped in `index.html`.
For the old implementation and the design experiments that led here, see
[`REFACTOR_PLANS.md`](REFACTOR_PLANS.md) and
[`prototypes/0-original-index.html`](prototypes/0-original-index.html).

---

## 1. What the feature guarantees / 功能保证

1. **Narrative alignment.** An artwork is placed at, or below, the row of the
   phrase that introduces it. It never appears before its context in the text.
2. **Bidirectional linking.** Hovering a highlighted phrase lights up its
   linked image(s); hovering an image lights up the phrase that references it.
3. **Expandable viewing.** Clicking a real artwork image, or a linked phrase
   that has a real image, opens the lightbox.
4. **Deliberate whitespace.** The image column is a complete square grid whose
   height tracks its text column. Empty cells are intentional visual rhythm,
   not missing markup.

1. **叙事对齐。** 作品图位于介绍它的文字行，或该行以下，绝不抢在语境之前出现。
2. **双向联动。** 悬停关键词点亮对应图；悬停图片点亮对应关键词。
3. **可展开查看。** 点击真实作品图，或点击有真实作品图的关键词，可打开灯箱。
4. **有意留白。** 图片栏是随文字高度变化的完整方格网，空格是视觉节奏的一部分，不是漏写的内容。

## 2. Data contract / 数据约定

The connection is declared in two places that must agree.

```html
<span class="hl" data-link="img_2_2a img_2_2b">
  giant single-character works
</span>
```

```js
{
  id: 'img_2_2a',
  caption: 'Inoue writing process',
  placeholder: 'Inoue<br>writing',
  label: 'Process',
  imageSrc: 'c2/2a_inoue_writing.jpg'
}
```

| Item | Rule |
|---|---|
| Highlight | A `.hl[data-link]` value is a space-separated list of image ids. One phrase may link to several images. |
| Artwork item | `sectionImageData` in `index.html` supplies the matching `id`, caption, label, placeholder, and optional `imageSrc`. |
| Real artwork | An item with `imageSrc` renders an image with `alt=caption` and `loading="lazy"`. |
| Placeholder | An item without `imageSrc` renders its label and placeholder text. It remains linkable when referenced by a phrase. |
| Identity | Every image id should be unique across the page and must exactly match the related `data-link` value. |

`caption` is reused as the thumbnail alt text and the overlay caption. Write it as a concise,
human-readable description rather than a filename.

## 3. Current layout architecture / 当前布局架构

The production implementation begins at `// ===== CHAPTER IMAGE GRID =====` in
`index.html`. It was rebuilt on 2026-08-23 to preserve the mosaic while removing
the old forced-reflow loop, browser sniffing, and resize-to-reload workaround.

```text
sectionImageData + .hl[data-link]
              │
              ▼
initChapterImages()
  creates persistent thumbnail elements
              │
              ▼
layoutChapters()
  READ: measure every chapter
  WRITE: paint every image grid
              │
              ▼
initializeHighlightLinking()
  text hover/click ⇄ image hover/click
              │
              ▼
overlay / lightbox
```

### 3.1 Persistent thumbnails

`buildThumb(data)` creates every configured thumbnail once and stores it in
`thumbIndex` by image id. Later layout passes move those same elements rather
than creating new ones. Consequently, interaction listeners are installed once
and cannot accumulate on resize.

`markUnlinkedPlaceholders()` finds placeholder entries that no text phrase
references and marks them inert and visually subdued. Placeholder entries that
are referenced remain visible in the narrative map.

### 3.2 Batched measure → paint layout

`layoutChapters()` intentionally separates browser reads from writes:

1. `measureSection(grid)` reads the text height, computed grid columns, gap,
   padding, cell size, and highlight positions for one chapter.
2. Once every chapter has a plan, `paintSection(plan)` writes the cells in their
   final order.

For every linked image, `paintSection()` chooses the nearest compatible row at
or below the highlight. If that row is full, it moves downward until a free cell
is found. The grid grows when a late phrase needs additional rows. Images not
explicitly referenced by a phrase occupy the earliest remaining cells; all other
cells become inert filler cells.

This sequence avoids the former feedback loop in which a stretched CSS grid
made the text column appear as tall as the image column. The CSS rule
`align-items: start` on `.section` is part of that fix and should be preserved.

### 3.3 Responsive updates

`initChapterImages()` creates a single `ResizeObserver` over `.section-text`.
When copy wraps differently, the observer asks `layoutChapters()` to recompute
the grid. `document.fonts.ready` triggers a final pass after web fonts settle.

No code may rely on user-agent detection or refresh the page after a resize.
Those were removed deliberately and are regressions if reintroduced.

## 4. Interaction behavior / 交互行为

`initializeHighlightLinking()` installs the shared behavior once:

| Reader action | Result |
|---|---|
| Hover a highlighted phrase | The phrase receives `.active`; every linked thumbnail receives `.linked`. |
| Hover a linked thumbnail | Its linked phrase and its image group receive the same active styles. |
| Click a highlighted phrase | Opens the first linked thumbnail with a real `<img>`. A placeholder alone does not open the overlay. |
| Click a real thumbnail | Opens that work in the overlay. |

The overlay uses `openOverlay()`, `updateOverlay()`, `navOverlay()`, and
`closeOverlay()`. It locks body scrolling while open, supports click-outside
closing, and supports `Escape`, left arrow, and right arrow. Its previous/next
sequence covers all configured chapter thumbnails, not merely the current
chapter.

## 5. Known content gap / 当前内容缺口

The mechanism is complete, but the narrative climax needs its artwork:

- Chapter IV: `img_4_1`
- Chapter V: `img_5_1` through `img_5_4`
- Chapter VI: `img_6_1` through `img_6_6`
- Chapter VII: `img_7_1` through `img_7_5`

These 16 records intentionally have no `imageSrc` yet, and the repository has
no corresponding files. To complete them, add the supplied artwork to an
appropriate static folder, set each exact `imageSrc`, and then verify the
text-to-image alignment at desktop and mobile widths. Do not substitute generic
or AI-generated imagery for the artist's work.

## 6. Change checklist / 修改检查清单

When adding or changing artwork:

1. Add the actual image file without renaming unrelated existing media.
2. Update the matching `sectionImageData` item with the exact path, caption,
   and label.
3. Confirm every `data-link` id resolves to a configured item.
4. Run `python3 serve.py` and inspect the affected chapter at desktop and
   mobile widths.
5. For layout or interaction edits, run the three-engine suite when available:

   ```bash
   python3 serve.py
   TARGET=/ PW_HOME=/tmp/pw node tests/cross-browser.mjs
   ```

The suite checks the live page across Blink, Gecko, and WebKit for overflow,
two-column stability, square cells, text-height fill, phrase alignment,
idempotent resizing, hover linking, and overlay interaction.

## 7. Non-goals / 非目标

- The grid is not intended to become a free-floating sidenote layout.
- The two columns must not stack into a conventional text-then-gallery view.
- A framework is not required for this feature; the static GitHub Pages model
  remains the intended deployment model.
- Media compression, email markup cleanup, SEO metadata, and the featured
  carousel manifest are separate maintenance tasks. They must not distract from
  completing the missing narrative artwork first.
