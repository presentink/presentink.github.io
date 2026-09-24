# CLAUDE.md

This file gives guidance to Claude Code (and other contributors) when working in this repository.
本文件为 Claude Code(及其他协作者)在本仓库中工作提供指引。

## Project overview / 项目概述

**EN** — **Present Ink** is the online art portfolio of **Yufan Wang (王聿凡)**, a designer/artist
based in Denmark. The site tells, as a single scrolling narrative, his journey from traditional
Chinese calligraphy to contemporary **calligraphy collage**, blending Eastern and Western
artistic traditions. It is a **static website hosted on GitHub Pages** at `presentink.github.io`.
There is no framework, build step, package manager, or backend.

**中** — **Present Ink** 是艺术家/设计师 **王聿凡(Yufan Wang)** 的在线作品集,作者现居丹麦。
网站以一条"滚动叙事"的主线,讲述他从传统中国书法走向当代**书法拼贴(calligraphy collage)**
的创作历程,融合东西方艺术传统。本站是托管在 **GitHub Pages** 上的**纯静态网站**
(`presentink.github.io`),没有任何框架、构建步骤、包管理器或后端。

## Tech stack / 技术栈

- Plain **HTML + inline CSS + inline JavaScript**. There are **two full pages**: `index.html`
  (English, ~2500 lines) and `zh/index.html` (Chinese, ~2550 lines). Each is self-contained —
  markup, `<style>` and `<script>` all inline.
  纯 **HTML + 内联 CSS + 内联 JavaScript**。共有**两个完整页面**:`index.html`(英文,约 2500 行)
  与 `zh/index.html`(中文,约 2550 行),各自独立,样式与脚本都内联。
- Google Fonts (Eczar, Lora, Inter, Space Grotesk) via `<link>`.
  通过 `<link>` 引入 Google Fonts。
- **Self-hosted Chinese webfonts** in `fonts/` (LXGW WenKai, Zhuque Fangsong, subset `.woff2`),
  declared with `@font-face` in `zh/index.html`.
  中文网页字体**自托管**在 `fonts/`(霞鹜文楷、朱雀仿宋,子集化 `.woff2`),在 `zh/index.html`
  里用 `@font-face` 声明。
- Artwork captions come from **`artwork-metadata.json`**, fetched at runtime.
  作品图注来自运行时 fetch 的 **`artwork-metadata.json`**。

## Repository layout / 仓库结构

```
index.html              # English site / 英文站:markup + <style> + <script>
zh/index.html           # Chinese site / 中文站(资源路径经 data-asset-prefix="../" 解析)
artwork-metadata.json   # Captions/titles/materials/dimensions/year / 图注元数据(双语)
yufan_wang_cv.pdf       # Linked from the hero / 首页链接的 CV(文件名全小写)
serve.py                # No-cache local dev server / 禁缓存的本地开发服务器
hero-video.mp4          # Hero background video / 首页背景视频
hero-video-web.mp4      # Smaller web encode / 体积更小的网页版
hero-poster.webp        # Poster frame / 视频封面帧
favicon.svg  favicon-32.png  apple-touch-icon.png
c1/ … c7/               # Per-chapter image assets (ch.1–7) / 各章节配图(第 1–7 章)
selected_work/          # Selected Work gallery / 精选作品,1.webp … 30.webp
  og-cover.jpg          #   Social share image / 社交分享图
  w1200/                #   Larger variants for the lightbox / 灯箱用大图
fonts/                  # Self-hosted subset woff2 / 自托管子集字体
edited_images/          # Image-edit working files / 修图工作文件(勿删,见下方约定)
  pre_webp/             #   The corrected frames the site was built from / 校正后、上站前的版本
  selected_work_wb_originals/  # BEFORE white balance — visibly blue / 白平衡校正【前】,明显偏蓝
prototypes/             # Old/experimental pages, not shipped / 旧版与试验页,不上线
tests/cross-browser.mjs # Cross-browser smoke test / 跨浏览器冒烟测试
text/                   # Source copy (not loaded at runtime) / 文案原稿(运行时不加载)
  Artist Statement.md   #   EN Brief Intro source / 英文简述原稿
  Artistic narrative.md #   EN narrative / 英文叙述
  艺术叙述.md            #   ZH narrative / 中文叙述
  艺术叙述.pages         #   Apple Pages source / Apple Pages 源文档
  Brief Intro 中英差异.md #   Where EN and ZH intentionally diverge / 中英有意不同步之处
```

## Page structure / 页面结构 (top → bottom)

1. **Hero / 首页** — background video, title "Present Ink", author, tagline, and the public link
   row (Instagram, CV, email, design portfolio). / 背景视频、标题、作者、副标题、公开链接行。
2. **Selected Work / 精选作品** — carousel (prev/next + dots), images auto-discovered from
   `selected_work/`. / 轮播(左右箭头 + 圆点),图片从 `selected_work/` 自动探测。
3. **Brief Intro / 简述** (`.artist-statement`) — the artist statement, five short paragraphs.
   艺术家自述,五个短段。
4. **Longer Story / 长篇** (`.story-index`) — ordered index linking to all seven chapters, with
   per-chapter reading times. / 七章索引,含每章阅读时长与跳转链接。
5. **Seven chapters / 七个章节** (`#chapter1` … `#chapter7`) — each a two-column `.section`
   (text + image grid). / 每章为左右两栏(文字 + 图片网格):
   - I. Beginnings and a Return / 起点与回归
   - II. Large Character Calligraphy / 大字书法
   - III. Line Works / 线条作品
   - IV. Bottlenecks and Reflection / 瓶颈与反思
   - V. The Turning Point: Collage / 转折点:拼贴
   - VI. Calligraphy Collage: Exploration and Methodology / 书法拼贴:探索与方法论
   - VII. Meaning of Calligraphy Collage and Future Directions / 书法拼贴的意义与未来方向
6. **Image overlay / 图片浮层(灯箱)** — full-size view + caption + "View on Instagram" link.
   大图查看 + 图注 + Instagram 链接。

## How images are wired up / 图片接入方式

- **EN** — Chapter images are configured in the `sectionImageData` object in `<script>`
  (72 entries; **all of them now have an `imageSrc`** — there are no placeholders left).
  Captions are **not** hard-coded: `artwork-metadata.json` is fetched at startup and
  `formatArtworkCaption()` assembles `title, workType, materials, dimensions, year`. Fields may be
  either a plain string or a `{ en, zh }` object; `localizedMetadataValue()` picks the side that
  matches the page and falls back to the other. Selected Work images are discovered at runtime by
  `loadFeaturedArtwork()`, which probes `selected_work/{n}.{ext}`. Chapter body text is still
  **hard-coded in HTML**, duplicating `text/Artistic narrative.md`. The two columns are aligned by
  `layoutChapters()` driven by a **single `ResizeObserver`** — the old `generateThumbnails`
  forced-reflow code is gone.
- **中** — 章节图片在 `<script>` 的 `sectionImageData` 中配置(72 项,**现已全部带
  `imageSrc`**,不再有占位框)。图注**不写死**:启动时 fetch `artwork-metadata.json`,由
  `formatArtworkCaption()` 拼成「标题、类型、材料、尺寸、年份」。字段可以是字符串,也可以是
  `{ en, zh }` 对象,`localizedMetadataValue()` 按页面语言取,取不到则回退另一语言。精选作品图由
  `loadFeaturedArtwork()` 在运行时探测 `selected_work/{n}.{ext}` 发现。章节正文仍**硬编码在
  HTML** 中,与 `text/Artistic narrative.md` 重复。两栏对齐由 `layoutChapters()` 配合**单个
  `ResizeObserver`** 完成,旧的 `generateThumbnails` 强制重排代码已移除。

## Local development / 本地开发

No build step. Use the repo's own server — it sends no-cache headers, because Safari will
otherwise keep serving stale files after an edit.
无需构建。用仓库自带的服务器(它会发送禁缓存头;否则 Safari 改完文件仍会拿旧的):

```bash
python3 serve.py          # http://localhost:8000
python3 serve.py 8080     # another port / 换端口
```

Check both languages: `/` and `/zh/`. / 两种语言都要看:`/` 和 `/zh/`。

## Conventions & gotchas / 约定与注意事项

- Keep everything **dependency-free and static** so it runs as-is on GitHub Pages.
  保持**无依赖、纯静态**,确保在 GitHub Pages 上可直接运行。
- **Edit both languages.** A change to `index.html` usually needs the same change in
  `zh/index.html`. Paths there are relative to `zh/`, so assets need `../` — the page sets
  `data-asset-prefix="../"` and the script reads it as `assetPrefix`. Where the two are
  **deliberately** out of sync, record it in `text/` rather than silently fixing it
  (see `text/Brief Intro 中英差异.md`).
  **两个语言版本都要改。** 改 `index.html` 通常要同步改 `zh/index.html`;后者路径相对 `zh/`,
  资源要加 `../`,页面用 `data-asset-prefix="../"` 声明,脚本读作 `assetPrefix`。若是**有意**
  不同步,请记录在 `text/` 里,不要悄悄"修正"。
- **macOS hides case-only renames from git.** The filesystem is case-insensitive
  (`core.ignorecase=true`), so renaming `Foo.pdf` → `foo.pdf` shows up only as a content change and
  the old name gets pushed. Use `git mv -f` and then grep for every reference. GitHub Pages **is**
  case-sensitive, and so is nothing you can test locally — the local server is case-insensitive
  too, so a broken link 404s only in production.
  **macOS 会让 git 看不见"只改大小写"的重命名。** 文件系统大小写不敏感(`core.ignorecase=true`),
  把 `Foo.pdf` 改成 `foo.pdf` 只会显示为内容变更,推上去的还是旧名。要用 `git mv -f`,然后 grep
  出所有引用。GitHub Pages **区分大小写**,而本地服务器不区分——所以断链只会在线上 404,本地测不出。
- Image filenames matter: chapter images are referenced by exact path in `sectionImageData`;
  Selected Work images must be named `1`, `2`, `3`… and `artwork-metadata.json` keys off that
  number via `index`. **Reordering the gallery means renaming files, not reordering code.**
  文件名很关键:章节图按精确路径引用;精选作品图必须命名为 `1`、`2`、`3`…,
  `artwork-metadata.json` 靠 `index` 对应这个编号。**调整展示顺序靠改文件名,不是改代码顺序。**
- **A shoot's numbering is not the gallery's numbering.** Match an artwork to its metadata by
  looking at the image, never by assuming the two sequences line up.
  **拍摄编号不等于站上编号。** 把作品对上元数据要靠看图确认,绝不能假定两套序号一一对应。
- **Never delete image intermediates.** Rejected versions, sample sheets and comparison images all
  stay; new versions go in a new directory and never overwrite. Originals are untouchable.
  **图像中间版本一律保留。** 落选版、样张、对比图都留着;新版本另存新目录,永不覆盖;原图绝对不动。
- Artwork repro (shooting 宣纸 pieces and colour-matching them) has its own runbook outside this
  repo at `~/Downloads/宣纸复制_处理手册.md`, alongside `宣纸复制_处理脚本.py`. Paper-white target is
  (250.5, 248, 244.5). Read it before touching any raw capture.
  作品翻拍(宣纸拍摄与色彩还原)有独立手册,在仓库之外的 `~/Downloads/宣纸复制_处理手册.md`,
  与 `宣纸复制_处理脚本.py` 同目录。纸白目标为 (250.5, 248, 244.5)。动原始翻拍文件前先读它。
- **Gallery images: long side 3000, plus a 1200 copy in `w1200/`, webp `quality=88, method=6`.**
  The files carry no colour profile, so a source tagged Display P3 or Adobe RGB must be
  **converted** to sRGB, never just stripped — stripping oversaturates, which shows up first in
  anything coloured. Replacing an image keeps its number, so the URL does not change and every
  browser will serve its cached copy until a hard reload.
  **画廊图片:长边 3000,另存一份 1200 到 `w1200/`,webp `quality=88, method=6`。**
  文件不带色彩描述,所以 Display P3 或 Adobe RGB 的源必须**转换**成 sRGB,不能直接剥掉描述——
  剥掉会过饱和,彩色部分最先露馅。替换图片会沿用原编号,URL 不变,浏览器一定给缓存,要硬刷新。
- **`edited_images/selected_work_full/` holds the full-size source for every gallery image**,
  named by gallery number, with `来源清单.md` beside it recording where each one came from.
  They were scattered across shoot folders, exhibition applications and desktop copies under
  names that said nothing about the work, so finding one meant a disk-wide image-fingerprint
  search. Like the rest of `edited_images/`, it is gitignored — it never ships, and committing
  it would publish full-resolution artwork and put ~200MB in the history permanently.
  **`edited_images/selected_work_full/` 放着每张画廊图的全尺寸原片**,按画廊编号命名,
  旁边的 `来源清单.md` 记录各自出处。原片散落在拍摄、投展、桌面副本等处,文件名与作品无关,
  找一张要全盘做图像指纹比对。和 `edited_images/` 其余部分一样被 gitignore——不上线,
  提交它等于公开全分辨率作品,还会把约 200MB 永久写进 git 历史。
- **`edited_images/selected_work_wb_originals/` is the set from BEFORE white balance**, despite
  reading like the opposite: those frames are visibly blue (B around 240 against R around 216).
  `edited_images/pre_webp/` holds the corrected versions the site was actually built from.
  **`edited_images/selected_work_wb_originals/` 是白平衡校正【前】的片子**,名字容易读反——
  那些图明显偏蓝(B 约 240,R 约 216)。校正后、真正用来上站的版本在 `edited_images/pre_webp/`。
- **The Chinese fonts are subsets of 954 characters, so new Chinese copy can break them.**
  A character outside the subset renders in the browser's fallback face — `您` did exactly that
  and had to become `你`. After editing Chinese text, check coverage against `fonts/*.woff2`
  (fontTools: compare the page's CJK characters to `TTFont(f).getBestCmap()`), and either reword
  or re-subset the fonts. All three faces carry the same code points.
  **中文字体是 954 字的子集,改中文文案可能撑破它。** 子集外的字会退回浏览器兜底字体——`您`
  就是这样,只好改成 `你`。改完中文后要核对 `fonts/*.woff2` 的覆盖(用 fontTools 把页面里的
  CJK 字符与 `TTFont(f).getBestCmap()` 比对),要么换词,要么重新生成子集。三份字体码位相同。
- Author name is **王聿凡 / Yufan Wang** (note: 聿, not 宇/宇凡).
  作者姓名为 **王聿凡 / Yufan Wang**(注意是"聿",不是"宇/宇凡")。
- Contact email is `presentink.studio@gmail.com` (not the personal address).
  对外邮箱为 `presentink.studio@gmail.com`(不是个人邮箱)。
- Source of truth for copy: `text/Artist Statement.md` (Brief Intro),
  `text/Artistic narrative.md` (EN chapters), `text/艺术叙述.md` (ZH chapters).
  文案以这三个文件为准。
- The debug panel and the `console.log` calls are **gone** — don't reintroduce them.
  调试面板与 `console.log` **均已移除**,不要再加回去。
- `prototypes/` is dead weight kept for reference; don't edit it and don't let greps there mislead
  you. / `prototypes/` 仅供参考,不要改动,grep 时注意别被它误导。
