# Refactor Plans — Simplifying the Text ↔ Image Linked Narrative
# 重构方案存档 —— 简化"图文双向锚定叙事"核心功能

Companion to [`CORE_FEATURE.md`](CORE_FEATURE.md). That file documents **how the feature works
today**; this file documents **how it could be rebuilt more simply and reliably**, with a focus on
**cross-browser / cross-platform** robustness. Prototypes for the visual options live in
[`prototypes/`](prototypes/).

本文件是 [`CORE_FEATURE.md`](CORE_FEATURE.md) 的姊妹篇:前者记录**当前实现**,本文件记录**如何用更简洁、
更稳的方式重建**,重点是**跨浏览器/跨平台**。三种视觉方向的原型见 [`prototypes/`](prototypes/)。

---

## 0. Root-cause of the current complexity / 当前复杂度的根因

The current code conflates **two independent problems**:
当前代码把**两个本无关联的问题**捆在一起:

1. **Fill the right column to equal the text height** (a full mosaic of square cells + filler cells).
   **把右栏用方块网格填满到与文字等高**(含空白填充格)。
2. **Put a given image at the vertical position of its highlight** (the actual value for the reader).
   **让某张图出现在其关键词的垂直位置**(对读者真正有价值的部分)。

Problem 1 forces: measure total text height → derive rows → derive columns → derive cell size →
generate every grid cell. That is the source of ~500 lines, ~57 forced reflows, six measurement
methods, and the Safari full-page-reload hack.
问题 1 迫使:测文字总高 → 推行数 → 推列数 → 推格子尺寸 → 生成整格网格。这就是约 500 行、约 57 次强制重排、
6 种测量法、以及 Safari 整页刷新 hack 的来源。

**Key insight / 关键洞察:** if each image is **anchored directly to its highlight**, problem 1
disappears entirely — no rows, no columns, no cell math, no filler cells.
若把每张图**直接锚定到它的关键词**,问题 1 彻底消失——不再需要行、列、格子计算、填充格。

**Cross-browser insight / 跨浏览器洞察:** the current code positions via summed
`getBoundingClientRect` heights, which is exactly where **WebKit (Safari) and Blink (Chrome)
diverge** (1.6–2.7× font-height differences), forcing the Safari reload. Using `element.offsetTop`
(integer, relative to `offsetParent`) is **stable across all engines** and removes the need for any
browser special-casing.
当前代码用 `getBoundingClientRect` 高度累加定位,而这正是 **WebKit 与 Blink 分歧最大处**(字体高度差
1.6–2.7 倍),逼出了 Safari 刷新。改用 `element.offsetTop`(整数、相对 `offsetParent`)则**所有引擎一致**,
无需任何浏览器特判。

---

## 1. Technology options / 技术方案(按推荐度)

### ✅ A. Stay Web, anchor with `offsetTop` + `ResizeObserver` (RECOMMENDED)
### ✅ A. 仍用 Web,`offsetTop` + `ResizeObserver` 锚定(推荐)

Replace the whole measure-and-generate-grid with absolute-positioned figures whose `top` equals
their highlight's `offsetTop`, recomputed by a single `ResizeObserver` with **batched reads then
writes** (no interleaved reflow thrash). Add a ~10-line collision pass so close figures don't
overlap.
把整套"测量+生成网格"换成:图片绝对定位,`top` = 对应关键词的 `offsetTop`;由单个 `ResizeObserver`
在**先批量读、再批量写**下重算(不交错、无重排风暴);加约 10 行防重叠。

```js
const GAP = 12;
function layout(chapter) {
  const figLayer = chapter.querySelector('.fig-layer');
  // READ phase — one pass, no writes interleaved
  const items = [...figLayer.querySelectorAll('.fig')].map(fig => {
    const hl = chapter.querySelector(`.hl[data-link~="${fig.dataset.id}"]`);
    return { fig, y: hl ? hl.offsetTop : chapter.scrollHeight };
  }).sort((a, b) => a.y - b.y);
  // WRITE phase — collision-aware placement
  let prevBottom = -Infinity;
  for (const { fig, y } of items) {
    const top = Math.max(y, prevBottom + GAP);
    fig.style.transform = `translateY(${top}px)`;
    prevBottom = top + fig.offsetHeight;
  }
}
const ro = new ResizeObserver(() => document.querySelectorAll('.chapter').forEach(layout));
document.querySelectorAll('.chapter').forEach(c => ro.observe(c.querySelector('.text')));
```

| Aspect / 维度 | Value / 结论 |
|---|---|
| Lines of code / 代码量 | ~40 (vs ~500) |
| Forced reflows / 强制重排 | 0 (batched read→write) |
| Browser special-casing / 浏览器特判 | none — no Safari reload / 无,取消 Safari 刷新 |
| Alignment precision / 对齐精度 | exact to the phrase (not a row bucket) / 精确到关键词 |
| Hosting / 托管 | unchanged static GitHub Pages / 静态托管不变 |
| Support / 支持度 | universal (`offsetTop`, `ResizeObserver`, transforms) / 全浏览器 |

### 🌟 B. CSS Anchor Positioning (near-zero JS, FUTURE)
### 🌟 B. CSS 锚点定位(近乎零 JS,面向未来)

The browser primitive purpose-built for "pin element B beside element A":
浏览器为"把 B 钉在 A 旁边"新增的原生能力:

```css
.hl { anchor-name: --img_2_6; }
figure[data-id="img_2_6"] {
  position: absolute;
  position-anchor: --img_2_6;
  top: anchor(top);
  right: 0;
}
```

Tracks the phrase automatically on resize/zoom with essentially no JavaScript.
resize/缩放全自动跟随,几乎无需 JS。

- **Support (early 2026):** Chrome/Edge 125+ stable ✅ · Safari — Technology Preview, **not yet in
  stable** ⚠️ · Firefox — behind flag / in progress ⚠️. Therefore usable only as **progressive
  enhancement** with an A-style JS fallback. Does **not** meet the "works on all browsers today"
  goal on its own. / 支持度(2026 初):Chrome/Edge 稳定;Safari 仅预览版;Firefox 标志位内。故只能作**渐进增强**
  (配 A 方案 JS 回退),单独无法满足"当前全平台可用"。

### 🧩 C. CSS-only sidenotes (Tufte pattern, ZERO JS for layout)
### 🧩 C. 纯 CSS 边注(Tufte 模式,布局零 JS)

Place each `<figure>` **immediately after its `<span class="hl">` in the DOM**, then use
`position: absolute` with only `right`/`width` set (no `top`). The element keeps its **in-flow
vertical position** (its static top ≈ the phrase's line) but is pushed into the right gutter.
Zero measurement, zero JS, all engines.
把每个 `<figure>` **在 DOM 里紧跟其 `<span class="hl">`**,再用 `position: absolute` 只设 `right`/`width`
(不设 `top`)。元素**保持在流中的垂直位置**(静态 top ≈ 关键词所在行),同时被推到右侧留白区。零测量、零 JS、全引擎。

```css
.chapter { position: relative; }
.body { margin-right: 340px; }
.sidenote { position: absolute; right: 0; width: 300px; /* top:auto keeps flow position */ }
@media (max-width: 700px) { .body { margin-right: 0; } .sidenote { position: static; width: auto; } }
```

- **Trade-off / 代价:** pure CSS cannot auto-avoid collisions, so densely-spaced notes may overlap.
  Aesthetic shifts from "filled mosaic" to "margin figures". / 纯 CSS 无法自动避让,密集关键词处可能重叠;
  风格从"填满网格"变为"页边配图"。

### D. Different framework (Astro / Svelte)? — not for this problem / 换框架?——非本问题所需

Alignment is a **CSS layout problem**, not a framework problem; a framework does not simplify it.
Value of Astro/Svelte is only **maintainability**: data-driven chapters, component per section,
static-HTML output (Astro ships zero client JS by default — a great GitHub Pages fit). Consider
**only if the site grows**; the alignment core is written the same way regardless.
对齐是 **CSS 布局问题**,不是框架问题,换框架不会让它更简单。Astro/Svelte 的价值只在**可维护性**
(数据驱动章节、组件化、静态输出;Astro 默认零客户端 JS,契合 GitHub Pages)。**仅当站点变大时**再考虑;
对齐核心的写法与框架无关。

---

## 2. Visual directions (to prototype) / 视觉方向(待原型对比)

The tech choice above depends on which **visual result** is wanted. Three prototypes are built:
技术选择取决于想要哪种**视觉效果**,故构建三个原型:

| # | Visual / 视觉 | Best tech / 适配技术 | Prototype file / 原型 |
|---|---|---|---|
| 1 | Images sit precisely beside their phrase, whitespace between / 图片精确贴关键词,间留白 | **A** (offsetTop + ResizeObserver) | `prototypes/1-anchored-whitespace.html` |
| 2 | Filled square mosaic, aligned to text / 填满的方块网格,与文字对齐 | Simplified grid (offsetTop, 1 observer) / 简化网格 | `prototypes/2-filled-grid.html` |
| 3 | Margin sidenotes, zero JS / 页边边注,零 JS | **C** (CSS-only) | `prototypes/3-css-sidenotes.html` |

All three keep the two invariants below. / 三者都保留下述两条不变量。

---

## 3. Invariants any refactor MUST preserve / 任何重构必须保留的不变量

1. **Highlight → image vertical alignment** at any window width. / 任意宽度下关键词↔图片的垂直对齐。
2. **Bidirectional hover + click-to-overlay linking** (`data-link` ⇄ image `id`).
   **双向 hover + 点击进浮层联动**。

These are implemented once in the shared `prototypes/linking.js` and reused by all prototypes, so
the prototypes differ **only** in the alignment algorithm.
这两条在共享的 `prototypes/linking.js` 里实现一次,三原型共用,故它们**仅**在对齐算法上有区别。

---

## 4. Migration notes / 迁移注意事项

- Keep the **single source of truth**: `sectionImageData` + `data-link`. Only the right-column
  builder changes. / 保留**单一数据源**,只改右栏构建器。
- Delete on migration: `generateThumbnailsForSection`'s measurement block, the disabled Safari
  correction, the test-thumb column detection, the filler-cell logic, the resize→reload path, and
  ~46 `console.log` + the debug panel (`IMPROVEMENTS.md` P1). / 迁移时删除:测量块、禁用的 Safari 校正、
  测试缩略图判列、填充格逻辑、resize→reload、约 46 处 log 与调试面板。
- `loading="lazy"` + `alt=caption` should be added to figures during the rewrite (P0/P3).
  重写时顺带给图片补 `loading="lazy"` 与 `alt`。
- Images are still oversized (P0) — orthogonal to this refactor but worth doing together.
  图片仍超大(P0),与本重构正交,建议一并处理。
</content>
