# Improvements / TODO · 改进清单

Tracked improvement list for **presentink.github.io**, grouped by priority.
**presentink.github.io** 的改进清单,按优先级分组。
Check items off (`- [x]`) as they're done. / 完成后把 `- [ ]` 改成 `- [x]`。

Legend / 图例: 🔴 high impact 高优先 · 🟠 code quality 代码质量 · 🟡 content/UX 内容体验 · ⚪ nice-to-have 可选

---

## 🔴 P0 — Biggest impact on real visitors / 对访客影响最大

- [ ] **Compress images / 压缩图片.** Several images are 3–5 MB each (e.g. `c2/5a_early_attemps.jpg`
  ~5.2 MB, `featured_artwork/1.jpg` ~3.9 MB); `c2/` alone is ~25 MB. Resize (long edge ~2000 px),
  convert to **WebP**, target 200–400 KB each.
  多张图片单张 3–5 MB(`c2/` 单文件夹约 25 MB)。缩放(长边约 2000px)、转 **WebP**,单张控制在 200–400 KB。
- [ ] **Optimize the hero video / 优化首页视频.** `hero-video.mp4` is ~10 MB and autoplays. Compress
  it, add a `poster`, and consider a static image (no autoplay video) on mobile.
  `hero-video.mp4` 约 10 MB 且自动播放。压缩、加 `poster` 海报图;手机端考虑用静态图代替自动播放视频。
- [ ] **Lazy-load offscreen images / 懒加载非首屏图片.** Add `loading="lazy"` (currently used in only
  one place). / 给非首屏图片加 `loading="lazy"`(目前全站仅 1 处使用)。
- [ ] **Add SEO + social meta to `<head>` / 补充 SEO 与社交分享 meta.** Only charset/viewport/title
  exist now. / 目前只有 charset/viewport/title。补:
  - [ ] `<meta name="description">`
  - [ ] Open Graph (`og:title`, `og:description`, `og:image`, `og:url`)
  - [ ] Twitter Card
  - [ ] `favicon`
  - [ ] More descriptive `<title>` / 更具体的标题
    (e.g. `Present Ink — Yufan Wang | Calligraphy & Collage`)

## 🟠 P1 — Code quality / technical debt · 代码质量与技术债

- [ ] **Replace JS equal-height logic with CSS / 用 CSS 替代等高 JS.**
  `generateThumbnails` / `generateThumbnailsForSection` (~500 lines) measures text height with
  ~57 forced reflows + Safari/Chrome workarounds. CSS Grid/Flexbox/`aspect-ratio` can do this
  natively. / 这约 500 行只为两栏等高,用了约 57 次强制重排,CSS 即可原生实现,可删数百行。
- [ ] **Stop probing the network for featured images / 不要用网络探测发现精选图.**
  `loadFeaturedArtwork()` requests many `featured_artwork/{n}.{ext}` combos. Use an explicit list.
  改为像章节那样写明确的图片清单数组。
- [ ] **Remove debug code before shipping / 上线前清理调试代码.**
  - [ ] ~50 `console.log` statements / 约 50 处 `console.log`(多带 emoji)。
  - [ ] The visible "Debug Info" toggle + panel and `Debug Information` block / 可见的调试面板与区块。
  - [ ] `DEBUG_MODE`, `updateDebugPanel`, related scaffolding / 相关调试设施。
- [ ] **Review the injected Cloudflare script / 检查注入的 Cloudflare 脚本.**
  `/cdn-cgi/scripts/.../email-decode.min.js` 404s off Cloudflare; confirm if needed.
  该脚本在非 Cloudflare 环境(如本地/GitHub Pages)会 404,确认是否需要。
- [ ] **Split the single 2200-line `index.html` / 拆分单文件** into `index.html` + `style.css` + `main.js`.
- [ ] **De-duplicate chapter copy / 正文去重.** Body text is in HTML *and* `text/Artistic narrative.md`.
  Pick one source of truth. / 正文同时存在于 HTML 与 md,确定唯一来源。

## 🟡 P2 — Content / UX · 内容与体验

- [ ] **Add the missing artwork images / 补齐缺失的作品图.** These entries have no `imageSrc` and show
  as placeholders — notably the collage chapters, the climax of the story.
  以下配置项无 `imageSrc`,显示为占位框 —— 尤其是拼贴章节,正是叙事高潮:
  - [ ] Ch.4 / 第四章: `img_4_1`
  - [ ] Ch.5 / 第五章: `img_5_1`–`img_5_4`（转折点 the turning point）
  - [ ] Ch.6 / 第六章: `img_6_1`–`img_6_6`
  - [ ] Ch.7 / 第七章: `img_7_1`–`img_7_5`
- [ ] **Add an About / Contact section / 增加关于与联系方式** (email, location, Instagram). The overlay's
  "View on Instagram →" link is `href="#"`. / 邮箱、所在地、Instagram;浮层中的 Instagram 链接现为空。
- [ ] **Add navigation / 增加导航** so visitors can jump between the 7 chapters. / 让访客可在 7 章间跳转。
- [ ] **Add artwork metadata / 补充作品信息** (title / year / dimensions / medium). / 标题/年份/尺寸/材料。

## 🟡 P3 — Accessibility & polish · 无障碍与细节

- [ ] **Provide `alt` text / 提供 `alt` 文本** for dynamic images (reuse `caption`; also helps SEO).
  动态图片补 `alt`(复用 `caption`,也利于 SEO)。
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
