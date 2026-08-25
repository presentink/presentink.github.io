# Improvements / TODO · 改进清单

Tracked improvement list for **presentink.github.io**, grouped by priority.
**presentink.github.io** 的改进清单,按优先级分组。
Check items off (`- [x]`) as they're done. / 完成后把 `- [ ]` 改成 `- [x]`。

Legend / 图例: 🔴 high impact 高优先 · 🟠 code quality 代码质量 · 🟡 content/UX 内容体验 · ⚪ nice-to-have 可选

---

## Status / 进度 (2026-08-23)

The **text ↔ image layout rewrite is done and shipped** — see `REFACTOR_PLANS.md` for the write-up
and `tests/cross-browser.mjs` for the three-engine test. `index.html` went from 2246 to 1604 lines.
**图文布局重构已完成并合入**,记录见 `REFACTOR_PLANS.md`,三引擎测试见 `tests/cross-browser.mjs`;
`index.html` 由 2246 行降到 1604 行。

**Biggest remaining item is still P0 image weight** — `c2/` and `c3/` are ~22 MB each and the hero
video is ~10 MB. Nothing about that changed. / **最大的遗留项仍是 P0 图片体积** ——
`c2/`、`c3/` 各约 22MB,首页视频约 10MB,这部分完全未动。

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

### Media delivery plan / 媒体加载优化计划（2026-08-25）

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
- [ ] **P2 — Keep reading-time copy in one source / 集中维护阅读时间文案。** The chapter times and
  “about 25 minutes” introduction are hand-maintained in separate markup. Move them to one small
  chapter data structure, or review them whenever the narrative copy changes.
  每章时间与“约 25 分钟”的说明目前分散手工维护；可集中进一个小型章节数据结构，或每次改正文时一并复核。
- [ ] **P3 — Test the live page, not only the prototype / 测试真实首页而非仅 prototype。** Set the
  browser suite default target to `/`, then add assertions for Featured Artwork opening, mobile
  deep links, and keyboard/focus behavior.
  浏览器测试默认目标应设为 `/`，并补充精选作品打开、手机深链接、键盘/焦点操作测试。

---

## 🔴 P0 — Biggest impact on real visitors / 对访客影响最大

- [ ] **Compress images / 压缩图片.** Several images are 3–5 MB each (e.g. `c2/5a_early_attemps.jpg`
  ~5.2 MB, `featured_artwork/1.jpg` ~3.9 MB); `c2/` alone is ~25 MB. Resize (long edge ~2000 px),
  convert to **WebP**, target 200–400 KB each.
  多张图片单张 3–5 MB(`c2/` 单文件夹约 25 MB)。缩放(长边约 2000px)、转 **WebP**,单张控制在 200–400 KB。
- [ ] **Optimize the hero video / 优化首页视频.** `hero-video.mp4` is ~10 MB and autoplays. Compress
  it, add a `poster`, and consider a static image (no autoplay video) on mobile.
  `hero-video.mp4` 约 10 MB 且自动播放。压缩、加 `poster` 海报图;手机端考虑用静态图代替自动播放视频。
- [x] **Lazy-load offscreen images / 懒加载非首屏图片.** Every chapter thumbnail is now built with
  `loading="lazy"`. Verified: 7 images load on the first screen, all 20 after scrolling.
  章节缩略图现已全部带 `loading="lazy"`。实测:首屏加载 7 张,滚动后 20 张全部加载。
- [ ] **Add SEO + social meta to `<head>` / 补充 SEO 与社交分享 meta.** Only charset/viewport/title
  exist now. / 目前只有 charset/viewport/title。补:
  - [ ] `<meta name="description">`
  - [ ] Open Graph (`og:title`, `og:description`, `og:image`, `og:url`)
  - [ ] Twitter Card
  - [ ] `favicon`
  - [ ] More descriptive `<title>` / 更具体的标题
    (e.g. `Present Ink — Yufan Wang | Calligraphy & Collage`)

## 🟠 P1 — Code quality / technical debt · 代码质量与技术债

- [x] **Replace the JS equal-height logic / 重写等高逻辑.** Done 2026-08-23, though *not* with pure
  CSS — the row-to-phrase mapping genuinely needs measurement. 539 lines became 159, 77 forced
  layout reads became 6, and the browser sniffing plus the resize→reload are gone. Verified in
  Blink, Gecko and WebKit by `tests/cross-browser.mjs`. See `REFACTOR_PLANS.md` §5.
  已于 2026-08-23 完成,但**不是**用纯 CSS —— 行与关键词的映射确实需要测量。539 行 → 159 行,
  强制布局读取 77 处 → 6 处,浏览器嗅探与 resize 整页刷新已移除,并由三引擎测试验证。
- [ ] **Stop probing the network for featured images / 不要用网络探测发现精选图.**
  `loadFeaturedArtwork()` requests many `featured_artwork/{n}.{ext}` combos. Use an explicit list.
  改为像章节那样写明确的图片清单数组。
- [x] **Remove debug code before shipping / 上线前清理调试代码.**
  - [x] All 50 `console.*` statements removed / 50 处 `console.*` 全部移除。
  - [x] The "Debug Info" toggle, panel and its CSS removed / 调试按钮、面板及其 CSS 已移除。
  - [x] `DEBUG_MODE`, `updateDebugPanel`, `debugLog` removed / 相关调试设施已移除。
- [x] **Remove the injected Cloudflare email script / 移除 Cloudflare 邮箱脚本.** Replaced the
  GitHub-Pages-incompatible decoder and obfuscated markup with the direct public email link
  `mailto:presentink.studio@gmail.com`.
  已移除不兼容 GitHub Pages 的解码脚本与混淆邮箱,改为公开的直接邮箱链接。
- [ ] **Split the single 1600-line `index.html` / 拆分单文件** into `index.html` + `style.css` + `main.js`.
  (Was 2246 lines before the layout rewrite. / 布局重构前为 2246 行。)
- [ ] **De-duplicate chapter copy / 正文去重.** Body text is in HTML *and* `text/Artistic narrative.md`.
  Pick one source of truth. / 正文同时存在于 HTML 与 md,确定唯一来源。
  - [x] Removed a paragraph that appeared **twice** at the start of ch.VII — two drafts of the same
    passage, identical in the middle two sentences. Kept the later, tighter version.
    已删除第七章开头**重复出现**的一段(同一段的两版草稿,中间两句逐字相同),保留后写的、更紧凑的一版。
  - [ ] ⚠️ Both drafts still sit back-to-back in `text/Artistic narrative.md` — re-syncing from the
    source would bring the duplicate back. / ⚠️ 两版草稿在原稿中仍前后相邻,若从原稿重新同步会把重复段带回来。

## 🟡 P2 — Content / UX · 内容与体验

- [ ] **Add the missing artwork images / 补齐缺失的作品图.** These entries have no `imageSrc` and show
  as placeholders — notably the collage chapters, the climax of the story.
  以下配置项无 `imageSrc`,显示为占位框 —— 尤其是拼贴章节,正是叙事高潮:
  - [ ] Ch.4 / 第四章: `img_4_1`
  - [ ] Ch.5 / 第五章: `img_5_1`–`img_5_4`（转折点 the turning point）
  - [ ] Ch.6 / 第六章: `img_6_1`–`img_6_6`
  - [ ] Ch.7 / 第七章: `img_7_1`–`img_7_5`
  - [ ] Re-test and refine keyword ↔ image highlighting once each real image is added.
    补入每张真实图片后，重新测试并完善关键词↔图片高亮联动。
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
