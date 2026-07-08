# Core Feature — Text ↔ Image Linked Narrative
# 核心功能 —— 图文双向锚定叙事系统

This document describes the signature, bespoke feature of **presentink.github.io**: a system that
binds each highlighted phrase in the narrative to its corresponding artwork image, keeps them
**vertically aligned** at any window size, and lets the reader move between text and image in
**both directions**. Everything else on the site (carousel, chapter markup) is conventional — this
is the part that is hand-built and worth documenting.

本文件描述 **presentink.github.io** 的招牌自研功能:把叙事正文里每个高亮关键词与对应作品图**显式绑定**,
在**任意窗口尺寸下保持两者垂直对齐**,并支持读者在文字与图片之间**双向**联动。站内其他部分
(轮播、章节结构)都很常规——唯有这一块是纯手工打造,值得单独成文。

All code lives inline in `index.html`. Line numbers below refer to that file.
全部代码内联在 `index.html` 中,下文行号均指该文件。

---

## 1. Data model / 数据模型

The feature is driven by **one source of truth**: a `data-link` string that connects text spans to
image ids.
整个功能由**单一数据源**驱动:用 `data-link` 字符串把文字片段与图片 id 关联起来。

### 1.1 Highlighted text spans / 高亮文字片段 (in HTML body)

```html
<span class="hl" data-link="img_2_2a img_2_2b">giant single-character works …</span>
```

- `class="hl"` — marks the phrase as an interactive highlight. / 标记为可交互高亮短语。
- `data-link` — a **space-separated list** of image ids this phrase points to. One phrase can link
  to **multiple** images. / **空格分隔**的图片 id 列表;一个短语可连**多张**图。

### 1.2 Image config / 图片配置 (`sectionImageData`, `index.html:998`)

Per chapter (`1`–`7`), an ordered array of image objects:
每章(`1`–`7`)一个有序数组,元素为图片对象:

```js
{ id: 'img_2_1', caption: '…', placeholder: 'Inoue<br>book', label: 'Key influence', imageSrc: 'c2/1_book.jpg' }
```

| Field / 字段 | Meaning / 含义 |
|---|---|
| `id` | Unique id, matched against `data-link`. / 唯一 id,与 `data-link` 对应。 |
| `caption` | Overlay caption + `alt` text. / 浮层图注 + `alt` 文本。 |
| `placeholder` | Text shown in the placeholder box (supports `<br>`). / 占位框内文字(支持 `<br>`)。 |
| `label` | Small corner label on the thumbnail. / 缩略图角标。 |
| `imageSrc` | Path to the real image. **If absent → renders as a placeholder box.** / 真实图片路径;**缺失即渲染为占位框**。 |

> Chapters 5–7 (and `img_4_1`) currently have **no `imageSrc`** → their linked highlights point to
> placeholder boxes. / 第 5–7 章(及 `img_4_1`)目前**无 `imageSrc`**,其关联高亮指向占位框。

---

## 2. Feature 1 — Row-level vertical alignment / 功能一:行级垂直对齐

**Goal / 目标:** the image that illustrates a phrase sits at roughly the **same vertical height**
as that phrase, and stays aligned no matter how the window is resized.
让配图与其关键词处于大致**相同的垂直高度**,且窗口如何缩放都保持对齐。

Because the left (text) and right (image) columns have different natural heights, the right column
is **regenerated dynamically** so that its thumbnail rows map onto the text's real layout.
由于左(文字)右(图片)两栏自然高度不同,右栏是**动态重新生成**的,使其缩略图的"行"映射到文字的真实排版。

### 2.1 Orchestrator — `generateThumbnails()` (`index.html:1092`)

1. Detect browser (Safari/Chrome via UA). / 检测浏览器。
2. **Throttle:** `minInterval = 100ms`. If called too soon, it clears any `pendingGenerate` and
   defers via `setTimeout`. / **节流**:100ms 内重复调用则清除 `pendingGenerate` 并延后执行。
3. For each `.section-images[data-section]`: / 对每个图片栏:
   - `textSection = section.previousElementSibling` (the matching text column). / 取相邻的文字栏。
   - Force reflow (`textSection.offsetHeight`), then **double `requestAnimationFrame`** to let layout
     settle before measuring. / 强制重排后用**双重 rAF** 等布局稳定再测量。
   - Measure `textHeight = textSection.offsetHeight`. / 测量文字栏高度。
   - Decide `gridCols`: `window.innerWidth <= 600 → 1`, else `2`; **double-checked** by creating a
     temporary `.section-images` and reading its computed `grid-template-columns`.
     决定列数(≤600px 为 1 列,否则 2 列),并用临时元素读取实际 CSS 网格列数**二次确认**。
   - If `textHeight === 0` → retry after 200ms. / 高度为 0 则 200ms 后重试。
   - Call `generateThumbnailsForSection(...)`.

### 2.2 Per-section builder — `generateThumbnailsForSection()` (`index.html:1216`)

**a) Re-measure text height / 重新测量文字高度**
- Clears `section.innerHTML`, forces reflow, toggles `height: auto` ↔ `''` to force multiple
  reflows, awaits `requestAnimationFrame`, then re-reads height.
  清空图片栏、强制多次重排(`height` 在 `auto`/`''` 间切换)、等 rAF,再重新读高度。
- Takes **6 alternative measurements** (`offsetHeight`, `clientHeight`, `scrollHeight`,
  `boundingRect.height`, computed `height`, inner height) and, if they diverge by >10%, logs a
  measurement-inconsistency warning. / 取 **6 种测量方式**,若彼此差异 >10% 记录不一致告警。
- Contains a **Safari WebKit height-correction** block (factor `0.42`/`0.65`) that is **currently
  disabled** (`if (false && isSafari)`, `index.html:1393`) — kept as documented scaffolding for the
  known WebKit-vs-Blink font-height difference (WebKit reports 1.6–2.7× taller).
  含 **Safari 高度校正**代码块(系数 0.42/0.65),**当前禁用**;保留用于记录 WebKit 与 Blink 字体高度差异
  (WebKit 测得高 1.6–2.7 倍)。

**b) Detect columns & thumb size / 探测列数与缩略图尺寸**
- Inserts **two hidden test thumbs**, measures their positions: if their `top` differs by <5px they
  are on one line → **2 columns**, otherwise **1 column** (position-based detection overrides the
  breakpoint guess). / 插入**两个隐藏测试缩略图**,若二者 `top` 差 <5px 判为**同一行=2 列**,否则 **1 列**
  (以实测位置为准,覆盖断点推测)。
- `actualThumbSize = thumbHeight + gap` (gap read from computed `gap`/`row-gap`, default 8).
  行高 = 缩略图高 + 间距。

**c) Row count / 行数计算**
- `calculatedRows = ceil(finalTextHeight / actualThumbSize)` — rows needed to match text height.
  匹配文字高度所需行数。
- `minRowsForImages = ceil(sectionData.length / actualCols)` — rows needed to fit all images.
  容纳全部图片所需行数。
- `minRequiredRows = max(2, minRowsForImages)`; `finalRows = max(minRequiredRows, calculatedRows)`.
- **No artificial cap** — the grid is allowed to be as tall as the text demands.
  **不设人为上限**——网格高度由文字长度决定。
- `totalThumbs = finalRows * actualCols`.

**d) Map highlights → rows / 高亮映射到行 (`index.html:1514`)**
- For each `.hl` in the text: / 对文字里每个 `.hl`:
  - `relativeY = hl.top - textSection.top + scrollTop` (position relative to the text column).
  - `rowIndex = floor(relativeY / actualThumbSize)`, clamped to `[0, finalRows-1]`.
  - Parse `data-link` ids → look up their image objects in `sectionData`.
- **First pass (position assignment):** place each linked image into its highlight's row. If that
  row is full (`>= actualCols`), search outward — `row`, then `row±1`, `row±2` … — until a slot is
  found. Images are de-duplicated via a `usedImageIds` set; placed images are removed from
  `remainingImages`; an unplaceable image logs a warning.
  **第一遍(按位置分配):** 把每张关联图放进其高亮所在行;该行已满则向 `row±offset` 逐圈外扩寻找空位;
  用 `usedImageIds` 去重;放好的从 `remainingImages` 移除;实在放不下则告警。

**e) Render grid / 渲染网格 (`index.html:1597`)**
- Loop `totalThumbs` times. For thumb `i`: `row = floor(i / actualCols)`.
  - If `rowImageMapping[row]` has an image → use it (`shift()`).
  - Else if any `remainingImages` left → use the next one.
  - Else → build an **empty filler cell** (`setupEmptyThumb`).
  循环生成:优先用该行映射到的图片;否则用剩余图片;都没有则填**空白占位格**以维持网格对齐。
- After building, re-run `initializeHighlightLinking()` after 100ms (thumbs are new DOM).
  生成后延迟 100ms 重新绑定联动(缩略图是新 DOM)。

### 2.3 Responsiveness / 响应式重算 — why alignment survives resize

The whole thing is **recomputed on layout change**, so alignment is never hard-coded:
整套逻辑在**布局变化时重算**,对齐从不写死:

- `window load` → `generateThumbnails()` (`index.html:1682`). / 加载即生成。
- `DOMContentLoaded` / already-ready → `initializeHighlightLinking()` + `generateThumbnails()`
  (`index.html:1868`). / DOM 就绪时绑定并生成。
- **Desktop resize** (`index.html:1712`): mobile ignored; debounced 300ms; a *significant* change
  (>10px width or >50px height) triggers — **Chrome regenerates thumbnails**, **Safari reloads the
  page** (`window.location.reload()`, its workaround for the WebKit measurement drift).
  **桌面 resize**:忽略移动端;300ms 防抖;显著变化(宽 >10px 或高 >50px)时——**Chrome 重新生成**,
  **Safari 整页刷新**(规避 WebKit 测量漂移)。
- **Mobile orientationchange** (`index.html:1690`): 500ms delay — Safari reloads, Chrome regenerates.
  **移动端旋转**:延迟 500ms——Safari 刷新,Chrome 重新生成。

> ⚠️ **Technical-debt note.** The measurement path uses ~57 forced reflows and browser-specific
> hacks (temp elements, page reloads, disabled correction factors). See `IMPROVEMENTS.md` P1 — this
> is the top refactor candidate (CSS Grid / `ResizeObserver` + batched reads).
> **技术债提示**:测量路径约 57 次强制重排 + 浏览器 hack;见 `IMPROVEMENTS.md` P1,是首要重构对象。

---

## 3. Feature 2 — Bidirectional highlight linking / 功能二:双向高亮联动

`initializeHighlightLinking()` (`index.html:1762`) wires each highlight to its image(s) **both ways**.
把每个高亮与其图片做**双向**绑定。

For each `.hl`, resolve `targets = data-link ids → elements`, then attach:
对每个 `.hl`,把 `data-link` 解析成目标元素,并绑定:

| Interaction / 交互 | Effect / 效果 | Code |
|---|---|---|
| Hover **highlight** / 悬停**文字** | text → `.active`; all linked thumbs → `.linked` | `1771` |
| Hover **thumbnail** / 悬停**图片** | its highlight → `.active`; all its thumbs → `.linked` (reverse) | `1781` |
| Click **highlight** / 点击**文字** | opens the **first non-placeholder** linked image in the overlay | `1794` |

So: read a keyword and the matching artwork is right beside it; hover either side and the other
lights up; click to enlarge. One phrase linking to several images lights **all** of them at once.
于是:读到关键词旁边就是配图;悬停任一侧另一侧点亮;点击放大。一词多图会**同时**点亮全部。

### Visual states (CSS) / 视觉状态

- `.hl` (`index.html:295`): tinted background + underline + bold; `:hover/.active` → stronger accent.
  高亮底色+下划线+加粗;激活态加深为主题色。
- `.thumb.linked` / `.thumb.placeholder-only.linked` (`index.html:374,380`): accent border + shadow +
  `scale(1.02)` — the "lit up" look. / 主题色边框 + 阴影 + 轻微放大,即"点亮"外观。
- `.thumb:hover` (`index.html:345`): 3px accent border, scale, shadow. / 悬停高亮。

---

## 4. Placeholder & filler handling / 占位与填充处理

Because the grid can have more cells than real images, several cell types exist:
网格格子数可能多于真实图片,因此存在多种格子类型:

- **Real image** (`setupThumb`, `imageSrc` present, `index.html:1637`): `<img>` + label; clickable →
  overlay. / **真实图片**:图片 + 角标;可点击进浮层。
- **Linked placeholder** (`imageSrc` absent but some `.hl` links to its id): placeholder box; kept
  interactive so its highlight can still light it (`.linked`). It scans **all** `[data-link]` to
  decide if it is linked (`index.html:1652`). / **有关联的占位框**:无图但被某高亮引用,保留可联动。
- **Unlinked placeholder** (`.placeholder-only.unlinked`, `index.html:352`): dimmed to `opacity 0.3`,
  `pointer-events: none` — a dead cell. / **无关联占位框**:淡化、不可交互。
- **Empty filler** (`setupEmptyThumb`, `index.html:1674`): a `•` cell that only pads the grid to keep
  rows aligned with the text. / **空白填充格**:仅用于补齐网格、维持与文字的行对齐。

---

## 5. Feature 3 — Overlay / lightbox / 功能三:浮层灯箱

Opened from a thumbnail (`onclick="openOverlay(this)"`) or by clicking a highlight.
由缩略图点击或高亮点击打开。

- `openOverlay(el)` (`index.html:1817`): refreshes `allThumbs = .thumb[id]`, sets `currentIndex`,
  shows overlay (`display:flex` + `.visible`), locks body scroll. / 刷新缩略图列表、定位当前项、显示浮层、锁滚动。
- `updateOverlay()` (`index.html:1839`): shows the full image (max `90vw`/`85vh`) or, for a
  placeholder, its caption text; sets caption; sets Instagram link to
  `https://www.instagram.com/presentink/`. / 显示原图或占位图注,设置图注与 Instagram 链接。
- `navOverlay(dir)` (`index.html:1834`): **wrap-around** prev/next across **all** thumbs (not just
  the current chapter). / 在**全部**缩略图间**循环**上一张/下一张。
- Close: background click (`index.html:1856`) or `closeOverlay()` (fade out, restore scroll).
- **Keyboard** (`index.html:1861`, only while open): `Esc` close · `←` prev · `→` next.
  **键盘**:Esc 关闭 · ← 上一张 · → 下一张。

---

## 6. End-to-end flow / 全流程串联

```
sectionImageData (per-chapter images)
        +
<span class="hl" data-link="…">   ← single source of truth / 单一数据源
        │
        ▼
generateThumbnails()  ──▶  generateThumbnailsForSection()
  • measure text column height (many reflows)
  • detect columns + thumb size (test thumbs)
  • rows = max(fit-all-images, match-text-height)
  • map each highlight → row (by pixel position), overflow-search
  • render grid: mapped image → remaining image → empty filler
        │
        ▼
initializeHighlightLinking()   ← re-run after each build
  • hover text ⇄ hover image   (.active / .linked)
  • click text → openOverlay(first real image)
        │
        ▼
Overlay / lightbox
  • full image + caption + Instagram link
  • prev/next (wrap) + keyboard (Esc/←/→)

on resize / orientationchange  →  recompute everything (Chrome) or reload (Safari)
                                   → alignment holds at any window size
```

---

## 7. Function index / 函数索引

| Function / 函数 | Line | Role / 作用 |
|---|---|---|
| `generateThumbnails()` | 1092 | Orchestrator: throttle, per-section measure, dispatch. / 编排与节流。 |
| `generateThumbnailsForSection()` | 1216 | Measure text, compute rows, map highlights, render grid. / 核心生成。 |
| `setupThumb()` | 1631 | Render a real-image or placeholder thumbnail. / 渲染图片/占位缩略图。 |
| `setupEmptyThumb()` | 1674 | Render an inert filler cell. / 渲染空白填充格。 |
| `initializeHighlightLinking()` | 1762 | Bidirectional hover/click wiring. / 双向联动绑定。 |
| `openOverlay()` / `updateOverlay()` / `navOverlay()` / `closeOverlay()` | 1817–1837 | Lightbox. / 灯箱。 |
| resize / orientationchange handlers | 1690, 1712 | Recompute or reload on layout change. / 布局变化时重算/刷新。 |

---

## 8. Caveats & related debt / 注意事项与相关技术债

- `DEBUG_MODE` (`index.html:1052`) gates verbose logging + the on-screen debug panel; ~46 `console.log`
  still ship. / 调试开关与面板;仍有约 46 处 `console.log`。
- The Safari correction factor is disabled but left in code; Safari currently **reloads** on resize
  instead. / Safari 校正已禁用,改为 resize 时**整页刷新**。
- Measurement relies on many forced reflows — the #1 refactor target in `IMPROVEMENTS.md` (P1).
  测量依赖大量强制重排——`IMPROVEMENTS.md` P1 首要重构项。
- Any refactor **must preserve** the two guarantees: (1) highlight→image row alignment at any width,
  (2) bidirectional hover/click linking. / 任何重构都**必须保留**两条保证:任意宽度下的行对齐、双向联动。
</content>
</invoke>
