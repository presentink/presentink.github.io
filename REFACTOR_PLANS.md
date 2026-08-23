# Refactor Plans — Simplifying the Text ↔ Image Linked Narrative
# 重构方案存档 —— 简化"图文双向锚定叙事"核心功能

Companion to [`CORE_FEATURE.md`](CORE_FEATURE.md). That file documents **how the feature works
today**; this file documents **how it could be rebuilt more simply and reliably**, with a focus on
**cross-browser / cross-platform** robustness. Prototypes for the visual options live in
[`prototypes/`](prototypes/).

本文件是 [`CORE_FEATURE.md`](CORE_FEATURE.md) 的姊妹篇:前者记录**当前实现**,本文件记录**如何用更简洁、
更稳的方式重建**,重点是**跨浏览器/跨平台**。三种视觉方向的原型见 [`prototypes/`](prototypes/)。

---

## ✅ Outcome (2026-08-23) — what was actually built / 最终结论:实际做了什么

The rewrite is **done and shipped into `index.html`**: 539 lines of layout code became 159,
77 forced-layout reads became 6, and the browser sniffing, the `location.reload()` on resize and
the debug panel are gone. `index.html` went from 2246 to 1604 lines. The frozen "before" page is
kept at [`prototypes/0-original-index.html`](prototypes/0-original-index.html) for comparison, and
[`tests/cross-browser.mjs`](tests/cross-browser.mjs) asserts the layout in Blink, Gecko and WebKit.
重构**已完成并合入 `index.html`**:布局代码 539 行 → 159 行,强制布局读取 77 处 → 6 处,浏览器嗅探、
resize 整页刷新、调试面板全部移除,`index.html` 由 2246 行降到 1604 行。改造前的页面冻结在
`prototypes/0-original-index.html` 供对照,`tests/cross-browser.mjs` 在三个引擎中验证布局。

**Two claims in this document were tested and proved WRONG. They are corrected in place below —
read the corrections before reusing any of this analysis.**
**本文件中有两处论断经实测被证伪,已在下文就地更正 —— 复用本文分析前请先看更正说明。**

| Claim / 原论断 | Verdict / 结论 |
|---|---|
| §0 "anchor each image to its highlight and the fill-to-text-height problem disappears" / "锚定到关键词,填满等高的问题就消失" | ❌ **Wrong.** The filled grid *is* the design; the empty cells are deliberate narrative rhythm. Prototypes 1 and 3 were rejected on sight for dropping it. / **错误。** 填满网格正是设计本身,空格子是刻意的叙事节奏。原型 1、3 因此被否决。 |
| §0 "WebKit reports text heights 1.6–2.7× Blink's — a font-rendering difference" / "WebKit 文字高度是 Blink 的 1.6–2.7 倍,是字体渲染差异" | ❌ **Wrong.** All three engines agree to the pixel at every width. The real cause was a measurement feedback loop (see below). / **错误。** 三引擎在每个宽度下逐像素一致。真因是测量反馈环。 |

**The real root cause / 真正的根因** — `.section` is a CSS grid, and grid's default
`align-items: stretch` sized `.section-text` to the whole row, i.e. to `max(text, images)`. So
measuring the text measured the image column back (494px vs the true 340px). That is why the old
code had to empty the grid before measuring, and why it looked engine-dependent: the two engines
merely differed in *when* the stale value was read. Fix: `align-items: start` on `.section`, drop
`min-height: 100%` from `.section-images`.
`.section` 是 CSS grid,默认 `align-items: stretch` 把 `.section-text` 拉伸到整行高(即
`max(文字, 图栏)`),于是"测文字"测到的是图栏倒灌回来的高度(494px vs 真实 340px)。这就是旧代码必须
先清空图栏再测量的原因,也是它看起来像引擎差异的原因 —— 两个引擎只是**读到过期值的时机**不同。
修法:`.section` 加 `align-items: start`,`.section-images` 去掉 `min-height: 100%`。

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

**~~Key insight~~ / ~~关键洞察~~ — ❌ DISPROVEN:** ~~if each image is **anchored directly to its
highlight**, problem 1 disappears entirely — no rows, no columns, no cell math, no filler cells.~~
~~若把每张图**直接锚定到它的关键词**,问题 1 彻底消失——不再需要行、列、格子计算、填充格。~~

> **Correction / 更正:** problem 1 is not incidental complexity, it is **the design**. The grid
> filling to the text height, the cell size changing with the window, and the empty cells are all
> intended: *"有时候不需要那么多图片来说明"*. Dropping the grid (prototypes 1 and 3) was rejected
> immediately on inspection. The rebuild keeps the mosaic and simplifies only *how* it is computed.
> 问题 1 不是附带的复杂度,而是**设计本身**:网格填满至文字高度、格子随窗口变化、空格子作为叙事留白,
> 都是刻意的。放弃网格的原型 1、3 一看即被否决。重构保留网格,只简化**计算方式**。

**~~Cross-browser insight~~ / ~~跨浏览器洞察~~ — ❌ DISPROVEN:** ~~the current code positions via
summed `getBoundingClientRect` heights, which is exactly where **WebKit (Safari) and Blink (Chrome)
diverge** (1.6–2.7× font-height differences), forcing the Safari reload.~~ Using `element.offsetTop`
(integer, relative to `offsetParent`) is **stable across all engines** and removes the need for any
browser special-casing.

> **Correction / 更正:** the engines do **not** diverge. Measured across 8 widths in Blink, Gecko
> and WebKit, column count, cell size and row count are identical to the pixel. The 1.6–2.7×
> figure came from reading a text height that had been inflated by the stretch feedback loop above;
> the engines only differed in *when* they read the stale value. No browser special-casing of any
> kind is needed — the shipped code contains zero user-agent checks.
> 三引擎并无分歧:在 8 个宽度下实测,列数、格子边长、行数逐像素一致。1.6–2.7 倍这个数字来自读取被
> 拉伸反馈环撑大的文字高度,引擎之间只是**读到过期值的时机**不同。完全不需要任何浏览器特判,
> 上线代码中没有一处 user-agent 判断。

~~当前代码用 `getBoundingClientRect` 高度累加定位,而这正是 **WebKit 与 Blink 分歧最大处**(字体高度差
1.6–2.7 倍),逼出了 Safari 刷新。~~改用 `element.offsetTop`(整数、相对 `offsetParent`)则**所有引擎一致**,
无需任何浏览器特判。

---

## 1. Technology options / 技术方案(按推荐度)

### ⚠️ A. Stay Web, anchor with `offsetTop` + `ResizeObserver` (~~RECOMMENDED~~ — NOT CHOSEN)
### ⚠️ A. 仍用 Web,`offsetTop` + `ResizeObserver` 锚定(~~推荐~~ —— 未采用)

> **Why not / 为何未采用:** this is prototype 1. It abandons the filled grid, so the images stop
> forming a mosaic and run past the end of the chapter. Rejected on sight. What *was* kept from
> this option is its engineering core — one `ResizeObserver`, batched read→write, no browser
> special-casing — applied to the grid instead of to free-floating figures.
> 这就是原型 1。它放弃了填满网格,图片不再成阵、并会一路排到章节之外,一看即被否决。**被保留下来的**
> 是它的工程内核:单个 `ResizeObserver`、先批量读再批量写、无浏览器特判 —— 只是作用于网格而非浮动图片。

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

| # | Visual / 视觉 | Best tech / 适配技术 | Prototype file / 原型 | Verdict / 结论 |
|---|---|---|---|---|
| 1 | Images sit precisely beside their phrase, whitespace between / 图片精确贴关键词,间留白 | **A** (offsetTop + ResizeObserver) | `prototypes/1-anchored-whitespace.html` | ❌ rejected — no grid, images overrun the chapter / 无网格,图片溢出章节 |
| 2 | Filled square mosaic, aligned to text / 填满的方块网格,与文字对齐 | Simplified grid (1 observer) / 简化网格 | `prototypes/2-filled-grid.html` | ✅ **chosen and shipped** / **已采用并合入** |
| 3 | Margin sidenotes, zero JS / 页边边注,零 JS | **C** (CSS-only) | `prototypes/3-css-sidenotes.html` | ❌ rejected — figures overlap the text at narrow widths / 窄屏下压住正文 |

All three keep the two invariants below. / 三者都保留下述两条不变量。

**Prototype 2 needed two fixes before it matched the design / 原型 2 达标前修了两处:** its image
column was a fixed `320px` (so cells never shrank with the window — it must be a **percentage**),
and it collapsed to one column under 760px (so images fell below the text — the two columns must
**never stack**).
它的图栏原本写死 `320px`(格子不随窗口缩小 —— 必须用**百分比**),且在 760px 以下塌成一栏
(图片掉到文字下方 —— 两栏**绝不能塌陷**)。

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

**Migration status / 迁移状态 (2026-08-23):** all of the above is done except image compression
(still P0, untouched). `loading="lazy"` and `alt` are now on every chapter thumbnail.
除图片压缩(仍是 P0,未动)外,上述各项均已完成;章节缩略图已全部带 `loading="lazy"` 与 `alt`。

---

## 5. Traps found only by testing / 只有测试才能发现的坑

Four defects survived code review and were caught by
[`tests/cross-browser.mjs`](tests/cross-browser.mjs). Three of them existed in the **original**
implementation too — the rewrite did not introduce them, it exposed them.
四个缺陷躲过了人工审阅,由测试脚本抓出;其中三个在**原实现**里同样存在 —— 重构没有引入它们,只是把它们照了出来。

1. **`grid.clientWidth` includes horizontal padding.** The computed square was 239px while the
   browser drew 223px, so every row boundary drifted. Subtract `paddingLeft/Right`.
   `clientWidth` 含左右 padding:JS 算出 239px,浏览器实际画 223px,每行边界都在漂。需减去 padding。
2. **Symmetric collision search placed images ABOVE their phrase.** Searching `[row+n, row-n]`
   meant a full row could be filled from above, showing the artwork before the sentence that
   introduces it. Search downward only. / 上下对称找空位会把图片放到关键词上方,即配图先于句子出现。只向下找。
3. **Row count was treated as a cap.** A phrase near the end of a chapter carrying three images
   had nowhere below to put the third. The row count derived from the text must be a **minimum** —
   let the grid grow. / 行数被当成上限:章节末尾挂三张图的关键词放不下第三张。文字算出的行数应为**下限**,不够就让网格长高。
4. **Rounding down biased every image upward.** Snapping a phrase to the row it *starts in* pushed
   all 36 images above their phrase (avg drift 91px, worst 225px). Snapping to the **nearest** row
   halves the error (avg 58px, worst 115px) and removes the bias.
   向下取整让全部 36 张图偏上(平均 91px,最差 225px);改为**就近取整**后误差减半(平均 58px,最差 115px)且无偏。

Two of the test's own assertions were also wrong at first — worth remembering, since a test that
is wrong in the *strict* direction wastes as much time as a missing one:
测试自身也有两条断言一开始就是错的 —— 值得记住,因为**过严**的断言和缺失的断言一样浪费时间:

- "an image must never sit above its phrase" is impossible under row bucketing: the image is pinned
  to the row's top edge while the phrase can fall anywhere inside that row. The bound is *half a
  row*, not zero. / "图片绝不能在关键词上方"在按行分桶下不可能成立:图片贴行顶,关键词可落在行内任意位置。界限是**半行**,不是零。
- Hover assertions raced `.hover()`'s auto-scroll: the scroll moves whatever is under the cursor,
  so the failure jumped between engines at random. Settle the scroll, then verify the pointer is
  really on the element. / hover 断言在和 `.hover()` 的自动滚动赛跑:滚动改变鼠标下的元素,失败会在引擎间随机跳。
  需先滚定,再确认指针确实落在元素上。
</content>
