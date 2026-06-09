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

- Plain **HTML + inline CSS + inline JavaScript**, all inside a single `index.html` (~2200 lines).
  纯 **HTML + 内联 CSS + 内联 JavaScript**,全部写在单个 `index.html` 内(约 2200 行)。
- Google Fonts (Eczar, Lora, Inter) via `<link>`. / 通过 `<link>` 引入 Google Fonts。
- Static image/video assets served directly from the repo. / 图片、视频等静态资源直接由仓库提供。

## Repository layout / 仓库结构

```
index.html              # The entire site / 整个网站:markup + <style> + <script>
hero-video.mp4          # Hero autoplay background video / 首页自动播放背景视频
README.md               # One-line description / 一行简介
.gitignore
c1/ c2/ c3/ c4/         # Per-chapter image assets (ch.1–4) / 各章节配图(第 1–4 章)
featured_artwork/       # Hero carousel images / 首页轮播图,命名 1.jpg, 2.JPG, 3.jpg ...
text/                   # Source narrative drafts (not loaded at runtime) / 叙述原稿(运行时不加载)
  Artistic narrative.md # English narrative / 英文叙述(与正文章节一致)
  艺术叙述.md            # Chinese narrative / 中文叙述
  艺术叙述.pages         # Apple Pages source / Apple Pages 源文档
```

## Page structure / 页面结构 (top → bottom in `index.html`)

1. **Hero / 首页** — `hero-video.mp4` background, title "Present Ink", author, tagline, scroll cue.
   背景视频、标题、作者、副标题、向下滚动提示。
2. **Featured Artwork / 精选作品** — carousel (prev/next + dots), images auto-discovered from
   `featured_artwork/`. / 轮播(左右箭头 + 圆点),图片从 `featured_artwork/` 自动探测。
3. **Seven chapters / 七个章节** (`#chapter1` … `#chapter7`) — each a two-column `.section`
   (text + image grid). / 每章为左右两栏(文字 + 图片网格):
   - I. Beginnings and a Return / 起点与回归
   - II. Large Character Calligraphy / 大字书法
   - III. Line Works / 线条作品
   - IV. Bottlenecks and Reflection / 瓶颈与反思
   - V. The Turning Point: Collage / 转折点:拼贴
   - VI. Calligraphy Collage: Exploration and Methodology / 书法拼贴:探索与方法论
   - VII. Meaning of Calligraphy Collage and Future Directions / 书法拼贴的意义与未来方向
4. **Image overlay / 图片浮层(灯箱)** — full-size view + caption + "View on Instagram" link.
   大图查看 + 图注 + Instagram 链接。
5. **Debug panel / 调试面板** — a "Debug Info" toggle button and panel (dev aid). / 开发辅助。

## How images are wired up / 图片接入方式

- **EN** — Chapter images are configured in the `sectionImageData` object in `<script>`. Each
  entry is `{ id, caption, placeholder, label, imageSrc }`. Entries **without** `imageSrc` render
  as a placeholder box (several chapters are still placeholders). The chapter body text is
  **hard-coded in HTML** and duplicates `text/Artistic narrative.md`. Featured carousel images are
  discovered at runtime by `loadFeaturedArtwork()`, which probes `featured_artwork/{n}.{ext}`.
  A large JS block (`generateThumbnails` / `generateThumbnailsForSection`) measures text height to
  align the two columns, using many forced reflows — the main source of technical debt
  (see `IMPROVEMENTS.md`).
- **中** — 章节图片在 `<script>` 里的 `sectionImageData` 对象中配置,每项为
  `{ id, caption, placeholder, label, imageSrc }`;**没有 `imageSrc`** 的项会显示为占位框
  (目前多个章节仍是占位)。章节正文**硬编码在 HTML 中**,与 `text/Artistic narrative.md` 重复。
  首页轮播图由 `loadFeaturedArtwork()` 在运行时通过探测 `featured_artwork/{n}.{ext}` 发现。
  一大段 JS(`generateThumbnails` / `generateThumbnailsForSection`)通过测量文字高度来对齐两栏,
  使用大量强制重排,是主要技术债(见 `IMPROVEMENTS.md`)。

## Local development / 本地开发

No build step. Serve the folder so relative paths and image loading behave like production.
无需构建。建议以本地服务器方式打开,使相对路径与图片加载和线上一致:

```bash
python3 -m http.server 8000
# open / 打开 http://localhost:8000
```

## Conventions & gotchas / 约定与注意事项

- Keep everything **dependency-free and static** so it runs as-is on GitHub Pages.
  保持**无依赖、纯静态**,确保在 GitHub Pages 上可直接运行。
- Image filenames matter: chapter images are referenced by exact path in `sectionImageData`;
  featured images must be named `1`, `2`, `3`… (extension may vary, incl. uppercase).
  文件名很关键:章节图按精确路径引用;精选图必须命名为 `1`、`2`、`3`…(后缀可不同,含大写)。
- Author name is **王聿凡 / Yufan Wang** (note: 聿, not 宇/宇凡).
  作者姓名为 **王聿凡 / Yufan Wang**(注意是"聿",不是"宇/宇凡")。
- There is currently a lot of `console.log` and a visible debug panel; review `IMPROVEMENTS.md`
  before shipping. / 目前有大量 `console.log` 和可见的调试面板;上线前请先看 `IMPROVEMENTS.md`。
- Source of truth for copy: `text/Artistic narrative.md` (EN) and `text/艺术叙述.md` (ZH).
  文案以这两个文件为准。
