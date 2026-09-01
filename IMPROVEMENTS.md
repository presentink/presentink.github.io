# Improvements / TODO · 改进清单

Tracked improvement list for **presentink.github.io**, grouped by priority.
**presentink.github.io** 的改进清单,按优先级分组。
Check items off (`- [x]`) as they're done. / 完成后把 `- [ ]` 改成 `- [x]`。

Legend / 图例: 🔴 high impact 高优先 · 🟠 code quality 代码质量 · 🟡 content/UX 内容体验 · ⚪ nice-to-have 可选

---

## Status / 进度 (2026-09-01)

Chapters IV--VII now carry the artist's own work — the placeholder boxes are gone. Loading was the
last thing standing between the site and a visitor: the carousel took 4.3 seconds to show anything,
and almost none of that was downloading. It is 247ms now. /
第 IV--VII 章已补齐艺术家本人的作品,占位框全部消失。加载是最后一道障碍:轮播原本要 4.3 秒才显示第一张,
而其中几乎没有时间花在下载上;现在是 247ms。

```
                改前        改后
first screen    49.5 MB     0.82 MB (phone) · 2.61 MB (retina desktop)
carousel        4276 ms     247 ms
open an image   ~500 ms     1 ms after hover
repository      215 MB      103 MB
```

Still open, in rough order of what a visitor would notice: the 10 MB autoplaying hero video, a
favicon, and the artwork metadata (title / year / medium). /
仍待处理,按访客可感知程度排序:10MB 自动播放的首页视频、favicon、作品信息(标题/年份/材料)。

---

## Status / 进度 (2026-08-23)

The **text ↔ image layout rewrite is done and shipped** — see `REFACTOR_PLANS.md` for the write-up
and `tests/cross-browser.mjs` for the three-engine test. `index.html` went from 2246 to 1604 lines.
**图文布局重构已完成并合入**,记录见 `REFACTOR_PLANS.md`,三引擎测试见 `tests/cross-browser.mjs`;
`index.html` 由 2246 行降到 1604 行。

**Media status** — the first WebP delivery pass is shipped, reducing the images served by the site
from about 55 MB to 12 MB while retaining the originals. The hero video remains the 10 MB master;
responsive image variants and a video poster remain later work. / **媒体状态** ——首轮 WebP 网页副本
已上线，网站实际传输图片约从 55 MB 降至 12 MB，原图仍保留。首页视频仍为 10 MB 母版；响应式图片与视频
poster 留待后续处理。

**Sequencing decision / 工作顺序（2026-08-23）:** media optimization, Cloudflare email cleanup,
SEO/social metadata, and the featured-artwork manifest are deliberately deferred. The active
priority is to add the missing artist-owned images for chapters IV--VII, because those chapters
are the narrative climax and currently render as placeholders. /
**工作顺序（2026-08-23）:** 图片/视频优化、Cloudflare 邮箱清理、SEO/社交 meta、精选作品清单均明确后置；
当前优先补齐第 IV--VII 章缺失的艺术家作品图，因为它们承载叙事高潮，目前仍显示为占位框。

**Shipped on 2026-08-24 / 2026-08-24 已完成:** added the artist's public links (Instagram, CV,
email, and design portfolio), stored `Yufan_Wang_CV.pdf`, added an Artist Statement and its source
file at `text/Artist Statement.md`, and added the seven-chapter `The Full Journey` index with
per-chapter reading times and jump links. Updated the visual type hierarchy with Space Grotesk for
secondary metadata, refined the hero and section title scale, and replaced the Cloudflare-obfuscated
email with a direct `mailto:` link. /
**2026-08-24 已完成:** 增加艺术家的公开链接(Instagram、CV、邮箱、设计作品集),存入
`Yufan_Wang_CV.pdf`,新增 Artist Statement 及其原稿`text/Artist Statement.md`,并增加含阅读时间
和章节跳转的七章 `The Full Journey` 索引。次级信息改用 Space Grotesk,调整 Hero 与章节标题层级,
并以直接 `mailto:` 链接替换 Cloudflare 混淆邮箱。

**Bilingual site / 双语页面（2026-08-25）:** English remains the default at `/`; Chinese is a
complete static page at `/zh/`, using `text/艺术叙述.md` as its narrative source. Both pages share
the same assets and interaction logic. `EN / 中文` appears at the end of both link menus, and preserves
the current `#chapter…` anchor when switching. When changing shared UI or JavaScript, update both
`index.html` and `zh/index.html`; narrative copy should continue to be maintained in the two files
under `text/`. /
**双语页面（2026-08-25）:** 英文默认页为 `/`，中文完整静态页为 `/zh/`，正文以
`text/艺术叙述.md` 为来源。两页共用素材与交互逻辑。两处链接菜单末尾均为 `EN / 中文`，切换时会保留
当前 `#chapter…` 锚点。修改共用 UI 或 JavaScript 时需同步更新 `index.html` 与 `zh/index.html`；正文继续
以 `text/` 下的中英文原稿维护。

**Shipped on 2026-08-25 / 2026-08-25 已完成:** fixed the Selected Works lightbox by giving it its
own explicit image list and navigation sequence, rather than creating a temporary chapter thumbnail.
Removed the mobile-only gallery initialization scroll-to-top so `#chapter…` links and restored reading
positions remain intact. Inline JavaScript parsing and `git diff --check` passed. A local server is
available on port 8001; real browser click testing remains to be run because Playwright is not available
in the current environment. /
**2026-08-25 已完成:** Selected Works 灯箱现使用独立、明确的图片列表与翻页顺序，不再临时创建章节缩略图。
移除了手机端图库初始化时的强制回顶，因此 `#chapter…` 跳转与恢复的阅读位置可以保留。内联 JavaScript
解析及 `git diff --check` 已通过。本地服务可在 8001 端口访问；2026-08-25 已由用户在真实手机视图中验证
章节深链接不会回顶，Selected Works 灯箱可正常打开与翻页。Playwright 自动化验证仍可在后续补跑。

### Media delivery plan / 媒体加载优化计划（2026-08-25）— superseded / 已被取代

> **Superseded by the 2026-09-01 pass below.** The figures here describe a set of about 55 MB of
> sources; roughly sixty artworks were added afterwards and the sources grew to 215 MB, so the
> caps and totals recorded in this section no longer describe what the site serves. Kept for the
> reasoning behind the original choices. / **已被下方 2026-09-01 的处理取代。** 本节数字基于当时约
> 55 MB 的源图；此后新增约六十张作品，源图增至 215 MB，故本节的尺寸上限与体积统计已不再反映线上情况。
> 保留此节是为了记录当初的取舍依据。

Goal: reduce transfer size without changing the artist's originals or making a visible quality trade-off.
The current JPG/JPEG files and `hero-video.mp4` remain untouched as masters; the website will use
separate, high-quality web derivatives that can be replaced or rolled back independently. /
目标：降低传输体积，不修改艺术家的原始文件，也不接受可见的画质牺牲。现有 JPG/JPEG 与 `hero-video.mp4`
保留为母版；网站改用独立的高质量网页副本，因此可以单独替换或回退。

- [x] Create high-quality WebP derivatives beside the existing image files. / 已为现有图片生成高质量 WebP 副本。
- [x] Selected Works: cap the long edge at 2560 px for Retina gallery and lightbox viewing.
  / Selected Works 长边限制在 2560 px，保证 Retina 画廊与灯箱观看。
- [x] Chapter images: cap the long edge at 2000 px, retaining enough resolution for the lightbox.
  / 章节图片长边限制在 2000 px，保留灯箱所需的细节。
- [x] Encode a 1080p web copy of the hero video; retain the current 1080p master and compare before
  accepting a smaller file. The CRF 20 test increased the file from 10 MB to 16 MB, so it is rejected
  and the original remains active. / 已测试输出 1080p 首页视频网页副本；CRF 20 测试反而从 10 MB 增至
  16 MB，因此不采用，网站继续使用原视频。
- [x] Point the website to verified WebP derivatives. The image derivatives total 12.17 MB, compared
  with 55.02 MB for their original JPG/JPEG sources. / 网站已改为引用通过路径与尺寸校验的 WebP 副本；
  图片副本共 12.17 MB，原 JPG/JPEG 共 55.02 MB。
- [ ] Later: add responsive `srcset` variants only if the first high-quality web pass looks correct.
  / 后续：首轮高质量网页版本确认无误后，再考虑补充响应式 `srcset`。

### Media delivery / 媒体加载（2026-09-01）

A second pass, sized against what the page can actually display rather than against a round number.
/ 第二轮处理，尺寸依据页面实际显示能力而非取整数字。

- [x] **Two sizes per chapter artwork / 章节图两档尺寸.** A grid cell is at most ~220 CSS px, so it
  loads a 600px thumbnail; the full file is fetched only when the lightbox opens. Thumbnails are
  sized by their **short** edge — the cell is square and uses `object-fit: cover`, so sizing by the
  long edge left a 1152x5084 scroll with a 136px-wide thumbnail. / 格子最多约 220 CSS px，故加载
  600px 缩略图，完整版仅在打开浮层时下载。缩略图按**短边**定尺寸：格子是正方形且用 `object-fit: cover`，
  按长边会让 1152x5084 的细长图只剩 136px 宽。
- [x] **Sizing rules / 尺寸规则.** Long edge capped at 3000px (what a 16" retina display can show in
  the lightbox); short edge held at 1200px minimum so a 2600x13533 scroll is not squeezed to 576px
  wide; no resize at all unless it saves more than 15%, so 73 of 104 images keep their original
  pixels. Quality 90 — PSNR 40.6-43.1 dB, and indistinguishable from the source at 2x magnification
  on the ink edges, where ringing would show first. / 长边上限 3000px；短边保底 1200px；缩放不足 15%
  则不缩，104 张中 73 张保持原始像素。质量 90，PSNR 40.6–43.1 dB，2 倍放大看墨迹边缘与原图无法区分。
- [x] **A 1200px carousel copy / 轮播 1200px 副本.** The carousel is 345 CSS px on a phone, which at
  3x asks for ~1035 device pixels against a 3000px file. Chosen in JS, not `srcset`, because srcset
  needs each candidate's true pixel width and the gallery discovers its files at runtime — several
  are only 888px wide. / 手机上轮播宽 345 CSS px，3 倍密度需约 1035 设备像素，却在下载 3000px 文件。
  用 JS 判断而非 `srcset`，因为 srcset 需要每个候选的真实像素宽度，而轮播是运行时探测发现文件的。
- [x] **EXIF orientation baked into the pixels / EXIF 方向烤进像素.** WebP drops the tag; three images
  carried `Orientation=6` and would have rendered rotated 90 degrees. / WebP 不保留该标签，三张图带
  `Orientation=6`，否则会转 90 度。

```
sources kept out of the repo   215 MB   edited_images/pre_webp/
served                         103 MB   91.8 full + 6.3 thumbnails + 5.3 carousel
first screen   phone 0.82 MB · desktop retina 2.61 MB
whole page     phone 6.94 MB · desktop retina 8.93 MB
```

- [ ] `hero-video.mp4` is still the 10 MB master and still autoplays; a `poster` and a smaller
  mobile path remain open. / 首页视频仍是 10MB 母版且自动播放；`poster` 与手机端更轻的方案仍待处理。

### Index audit / 主体审阅（2026-08-24）

The current narrative structure is sound: Hero → Featured Artwork → Artist Statement →
The Full Journey → chapters. Before further visual tuning or adding new material, resolve the
visitor-facing interaction defects below. Media optimization and missing artist-owned material
remain deliberately deferred, as agreed. /
目前的叙事结构已经成立：Hero → Featured Artwork → Artist Statement → The Full Journey → 章节正文。
继续微调视觉或补充新素材前，优先处理下列会影响访客使用的交互问题。图片/视频优化及缺失的艺术家素材仍按约定后置。

- [x] **P1 — Fix Featured Artwork lightbox opening / 修复精选作品灯箱打开失败。** Completed
  2026-08-25. The overlay now receives an explicit list of Selected Works and navigates only within
  that list; chapter images retain their own sequence. No temporary thumbnail is created.
  已于 2026-08-25 完成。灯箱现在使用明确的 Selected Works 列表，并只在其中翻页；章节图片保持自身顺序，
  不再创建临时缩略图。
- [x] **P1 — Preserve mobile deep links and reading position / 保留手机端深链接与阅读位置。** Completed
  2026-08-25. Removed the gallery initialization code that scrolled mobile visitors to the top.
  已于 2026-08-25 完成。已移除图库初始化时将手机访客强制带回顶部的代码。
- [x] **P1 — Make image interaction keyboard-accessible / 让图片交互支持键盘。** Completed and
  manually verified on 2026-08-25 for the Hero control, Selected Works, real chapter images, and
  the overlay. Clickable controls now expose roles, focus states, and Enter/Space handling; the
  overlay traps Tab and restores focus when it closes. Keyword ↔ image linking in the incomplete
  chapters remains a content-dependent follow-up, because those targets are still placeholders.
  已于 2026-08-25 完成并人工验证 Hero、Selected Works、已有真实章节图片和灯箱的键盘操作。可点击控件
  现具备语义、焦点状态和 Enter/Space 操作；灯箱会约束 Tab 焦点并在关闭后恢复焦点。缺图章节的关键词↔图片
  联动仍待素材补齐后完善，因为对应目标目前仍是占位框。
- [x] **P2 — Keep reading-time copy in one source / 集中维护阅读时间文案。** Completed 2026-08-25.
  `chapterReadingTimes` is now the single source for every chapter time and the total in the
  introduction. / 已于 2026-08-25 完成。`chapterReadingTimes` 现为各章时长与引言总时长的唯一来源。
- [ ] **P3 — Test the live page, not only the prototype / 测试真实首页而非仅 prototype。** Set the
  browser suite default target to `/`, then add assertions for Featured Artwork opening, mobile
  deep links, and keyboard/focus behavior.
  浏览器测试默认目标应设为 `/`，并补充精选作品打开、手机深链接、键盘/焦点操作测试。

---

## 🔴 P0 — Biggest impact on real visitors / 对访客影响最大

- [x] **Compress images / 压缩图片.** Done 2026-09-01: 215 MB of sources become 103 MB served, and
  the page transfers 0.82 MB on a phone. See the Media delivery section above for the sizing rules.
  完成:源图 215MB → 实际传输 103MB,手机首屏 0.82MB。尺寸规则见上方媒体章节。
  <!-- original note kept for context / 保留原始记录: -->
  <!-- Several images are 3–5 MB each (e.g. `c2/5a_early_attemps.jpg`
  ~5.2 MB, `featured_artwork/1.jpg` ~3.9 MB); `c2/` alone is ~25 MB. -->
- [ ] **Optimize the hero video / 优化首页视频.** `hero-video.mp4` is ~10 MB and autoplays. Compress
  it, add a `poster`, and consider a static image (no autoplay video) on mobile.
  `hero-video.mp4` 约 10 MB 且自动播放。压缩、加 `poster` 海报图;手机端考虑用静态图代替自动播放视频。
- [x] **Lazy-load offscreen images / 懒加载非首屏图片.** Every chapter thumbnail is now built with
  `loading="lazy"`. Verified: 7 images load on the first screen, all 20 after scrolling.
  章节缩略图现已全部带 `loading="lazy"`。实测:首屏加载 7 张,滚动后 20 张全部加载。
- [x] **Add SEO + social meta to `<head>` / 补充 SEO 与社交分享 meta.** Completed 2026-08-25 for
  description, canonical URL, Open Graph, Twitter Card, and a more descriptive title. Verified
  present 2026-09-01. `og:image` points at `selected_work/og-cover.jpg`, a JPG kept deliberately
  because some social platforms still do not read WebP. /
  2026-08-25 已补充 description、canonical URL、Open Graph、Twitter Card 与更准确的标题；
  2026-09-01 复查确认在位。`og:image` 指向 `selected_work/og-cover.jpg`,刻意保留 JPG,
  因为部分社交平台仍不支持 WebP。
- [ ] **Add a favicon / 增加站点图标.** Still open, waiting on a suitable artist-owned mark. /
  仍待处理,等有合适的艺术家自有标识。

## 🟠 P1 — Code quality / technical debt · 代码质量与技术债

- [x] **Replace the JS equal-height logic / 重写等高逻辑.** Done 2026-08-23, though *not* with pure
  CSS — the row-to-phrase mapping genuinely needs measurement. 539 lines became 159, 77 forced
  layout reads became 6, and the browser sniffing plus the resize→reload are gone. Verified in
  Blink, Gecko and WebKit by `tests/cross-browser.mjs`. See `REFACTOR_PLANS.md` §5.
  已于 2026-08-23 完成,但**不是**用纯 CSS —— 行与关键词的映射确实需要测量。539 行 → 159 行,
  强制布局读取 77 处 → 6 处,浏览器嗅探与 resize 整页刷新已移除,并由三引擎测试验证。
- [x] **Stop the probing from costing anything / 让探测不再有代价.** Done 2026-09-01, though not by
  writing an explicit list — the "drop a numbered file in the folder" workflow was worth keeping.
  Two fixes instead: `testImage()` created `new Image()` and set `src`, downloading the whole file to
  answer a yes/no question, and now sends `HEAD`; and the loop ran one index at a time, 62 round
  trips in sequence. Index 1 is probed alone and rendered at once, the rest go out in parallel.
  First slide visible went from 4276ms to 247ms at 60ms of latency per request.
  已完成,但没有改成写死清单 —— 保留了"把编号文件丢进文件夹就能用"的工作方式。改了两处:`testImage()`
  原本用 `new Image()` 试探,等于完整下载整图,现改为 `HEAD`;探测原本串行 62 次,现改为先单独探测第 1 张
  并立即显示,其余并行。首图显示从 4276ms 降到 247ms。
  <!-- original note / 原始记录: -->
  <!--
  `loadFeaturedArtwork()` requests many `selected_work/{n}.{ext}` combos. Use an explicit list. -->
- [x] **Remove debug code before shipping / 上线前清理调试代码.**
  - [x] All 50 `console.*` statements removed / 50 处 `console.*` 全部移除。
  - [x] The "Debug Info" toggle, panel and its CSS removed / 调试按钮、面板及其 CSS 已移除。
  - [x] `DEBUG_MODE`, `updateDebugPanel`, `debugLog` removed / 相关调试设施已移除。
- [x] **Remove the injected Cloudflare email script / 移除 Cloudflare 邮箱脚本.** Replaced the
  GitHub-Pages-incompatible decoder and obfuscated markup with the direct public email link
  `mailto:presentink.studio@gmail.com`.
  已移除不兼容 GitHub Pages 的解码脚本与混淆邮箱,改为公开的直接邮箱链接。
- [ ] **Split the single 2300-line `index.html` / 拆分单文件** into `index.html` + `style.css` + `main.js`.
  (1604 after the layout rewrite; back to ~2300 as the artwork, the Chinese page support and
  the loading logic were added. / 布局重构后为 1604 行;随作品、中文页支持与加载逻辑增加回到约 2300 行。)
- [ ] **De-duplicate chapter copy / 正文去重.** Body text is in HTML *and* `text/Artistic narrative.md`.
  Pick one source of truth. / 正文同时存在于 HTML 与 md,确定唯一来源。
  - [x] Removed a paragraph that appeared **twice** at the start of ch.VII — two drafts of the same
    passage, identical in the middle two sentences. Kept the later, tighter version.
    已删除第七章开头**重复出现**的一段(同一段的两版草稿,中间两句逐字相同),保留后写的、更紧凑的一版。
  - [ ] ⚠️ Both drafts still sit back-to-back in `text/Artistic narrative.md` — re-syncing from the
    source would bring the duplicate back. / ⚠️ 两版草稿在原稿中仍前后相邻,若从原稿重新同步会把重复段带回来。

## 🟡 P2 — Content / UX · 内容与体验

- [x] **Add the missing artwork images / 补齐缺失的作品图.** Done 2026-08-31. Every configured
  artwork now has a file — 72 across the seven chapters, no placeholders left anywhere. The
  collage chapters, which were the emptiest and carry the climax of the story, gained c5 (8),
  c6 (11) and c7 (22). / 已完成:七章共 72 张图,全部有对应文件,不再有任何占位框。拼贴章节
  新增 c5 八张、c6 十一张、c7 二十二张。
  - [x] Keyword ↔ image linking re-tested with the real images in place: the lightbox now stays
    within the phrase it was opened from, and the grid fills to the next phrase and hides the
    rest behind a "+N" badge. / 已用真实图片重测联动:浮层只在所在关键词组内浏览,网格填至下一个
    关键词为止,多出的收进 "+N" 角标。
- [ ] **Add an About section / 增加关于页面段落.** The Artist Statement now covers the practice;
  add a distinct about section only if a fuller biography is needed. /
  Artist Statement 已说明创作实践;若需要更完整履历,再增加独立的关于段落。
- [x] **Add public contact links / 增加公开联系链接.** The Hero now links to Instagram, CV, direct
  email, and the design portfolio; the footer email is also direct. /
  Hero 已提供 Instagram、CV、直接邮箱、设计作品集链接;页脚邮箱也已改为直接链接。
- [x] **Add navigation / 增加导航.** `The Full Journey` provides an ordered index with reading times
  and direct jump links to all 7 chapters. /
  `The Full Journey` 已提供含阅读时间的顺序索引,可直接跳至全部 7 章。
- [ ] **Add artwork metadata / 补充作品信息** (title / year / dimensions / medium). / 标题/年份/尺寸/材料。

## 🟡 P3 — Accessibility & polish · 无障碍与细节

- [x] **Provide `alt` text / 提供 `alt` 文本.** Every chapter thumbnail now carries `alt=caption`.
  章节缩略图现已全部带 `alt`(复用 `caption`)。
- [ ] **Add a `poster` to the hero video / 给首页视频加 `poster`**; keep autoplay media muted/controllable.
- [ ] **Mark up language / 标注语言** for mixed Chinese/English content (`lang` attributes).

## 📌 Decisions worth remembering / 已定的取舍(别再重新讨论)

Things that look like defects but are deliberate. / 看起来像缺陷,其实是有意为之。

- **Historical and other artists' works are not colour-corrected / 古代与他人作品不做白平衡.**
  Nine images sit far outside the site's ±8 colour range on purpose, because the warmth belongs to
  the original object rather than to the photograph: `img_1_1` (Yan Zhenqing rubbing, +26),
  `img_2_2b` (Inoue, +13), `img_2_6` (Wang Dongling, +30), `img_2_7` (Huaisu cursive, +66),
  `img_6_2` (Wang Duo scroll, +72), `img_6_3a` (Wang Xizhi, +29), `img_6_7` (+49). Neutralising them
  would make an aged rubbing look like fresh paper. / 这九张刻意留在色温范围之外,泛黄是原件本身的特征,
  校正反而失真。
- **The image grid may run a little past its text / 图栏可能略长于文字.** A phrase fills the rows
  between itself and the next phrase; the first image of a phrase is placed even where there is no
  room, so that every phrase shows something. That can push one row past the last. Everything beyond
  what fits is reachable in the lightbox behind the "+N" badge. / 每个关键词填到下一个关键词之前为止;
  为保证每个关键词至少显示一张,首图即使没位置也会放,因此可能多出一行。放不下的都在浮层里,由 "+N" 角标提示。
- **The carousel discovers its files by probing, and that is kept on purpose / 轮播靠探测发现文件,
  这是刻意保留的.** An explicit manifest would be faster still, but probing is what lets a numbered
  file dropped into `selected_work/` appear without editing any code. The cost was removed rather
  than the mechanism. / 写死清单会更快,但探测才使得"把编号文件丢进 `selected_work/` 就能用"成立。
  去掉的是它的代价,不是机制本身。

---

## ⚪ Backlog / nice-to-have · 待办与可选

- [ ] Replace the generic `test` commit messages going forward. / 今后用有意义的 commit message。
- [ ] Consider a small build step (image optimization, minification) if maintenance grows.
  维护量变大时可考虑加轻量构建(图片优化、压缩)。
- [ ] Fix filename typo `early_attemps` → `early_attempts` (and update references).
  修正文件名拼写 `early_attemps` → `early_attempts`(并更新引用)。

---

## 🧰 Future Claude Code skills (candidates) · 未来可考虑的 skill(候选)

Not needed yet. If a workflow below becomes frequent, turn it into a skill under
`.claude/skills/<name>/SKILL.md`. Listed roughly by usefulness.
暂时都不需要。若下列某个工作流变得高频,可在 `.claude/skills/<name>/SKILL.md` 下做成 skill。
大致按实用度排序。

- [ ] **`add-artwork` — add / update an artwork image / 添加或更新作品图.** Most useful. Steps:
  compress + convert to WebP (long edge ~2000 px, 200–400 KB) → place in `c1`–`c4` or
  `featured_artwork/` → name correctly (featured must be `1`,`2`,`3`…; chapter images set
  `imageSrc` in `sectionImageData`) → add `alt`/`caption` and `loading="lazy"`.
  最实用。压缩转 WebP → 放入对应文件夹 → 正确命名(精选图 `1/2/3…`;章节图在 `sectionImageData` 设 `imageSrc`)
  → 补 `alt`/`caption` 与 `loading="lazy"`。
- [ ] **`optimize-images` — batch image optimization / 批量图片优化.** Scan the repo for oversized
  images, resize + convert to WebP, report before/after sizes. / 扫描超大图片,批量缩放转 WebP,输出前后体积对比。
- [ ] **`preflight` — pre-publish checklist / 上线前检查.** Verify no `console.log` / debug panel
  ships, no broken image references in `sectionImageData`, SEO/OG meta present, all `imageSrc`
  files exist. / 确认无 `console.log`/调试面板,`sectionImageData` 无失效图引用,SEO/OG meta 齐全,图片路径都存在。
- [ ] **`add-chapter` — add a narrative chapter / 新增叙事章节.** Insert a `.section` block in HTML,
  add a `sectionImageData` entry, and keep `text/*.md` in sync. / 在 HTML 插入章节块、添加 `sectionImageData` 条目,并同步 `text/*.md`。
- [ ] **`sync-narrative` — sync copy with `text/*.md` / 正文与 `text/*.md` 同步.** Reconcile the
  hard-coded chapter text with the EN/ZH source files. / 协调硬编码正文与中英文原稿,保持一致。
