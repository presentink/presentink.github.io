# presentink.github.io
Yufan Wang's Art Portfolio

A static, dependency-free portfolio site hosted on GitHub Pages. The whole site is `index.html`.

## Run locally / 本地运行

No build step. Serve the folder so relative paths and image loading behave like production.
无需构建。以本地服务器打开,使相对路径与图片加载和线上一致:

```bash
python3 serve.py          # http://localhost:8000
```

`serve.py` is `http.server` plus `Cache-Control: no-store`, because Safari otherwise keeps
serving a stale `base.css` / `sample.js` after an edit. / `serve.py` 就是 `http.server` 加上禁用缓存
的响应头 —— 否则 Safari 改完文件仍会加载旧的 `base.css` / `sample.js`。

Then open / 然后打开:

- Site / 主站: <http://localhost:8000/>
- Prototypes / 原型:
  - <http://localhost:8000/prototypes/1-anchored-whitespace.html>
  - <http://localhost:8000/prototypes/2-filled-grid.html>
  - <http://localhost:8000/prototypes/3-css-sidenotes.html>

## Cross-browser tests / 跨浏览器测试

`tests/cross-browser.mjs` runs the layout assertions in **Blink, Gecko and WebKit** (the engine
Safari uses). The site itself stays dependency-free — Playwright is only needed to run the tests,
and is installed outside the repo. / 测试在 **Blink / Gecko / WebKit**(Safari 同引擎)三个引擎中
运行布局断言。站点本身仍无依赖,Playwright 只用于跑测试,装在仓库之外。

```bash
mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm i playwright
npx playwright install chromium firefox webkit

cd /path/to/presentink.github.io
python3 serve.py &
PW_HOME=/tmp/pw node tests/cross-browser.mjs
```

It checks, at 8 window widths: no horizontal overflow · the two columns never stack · cells stay
square and shrink as the window narrows · the grid fills to the text height · no image sits above
its highlight · resizing is idempotent · hover linking and the click-to-overlay both work. It also
prints the column/cell/row numbers per engine side by side, so an engine-specific layout
difference shows up immediately. / 在 8 个窗口宽度下检查:无横向溢出、两栏不塌陷、格子保持正方并随窗口缩小、
网格填满至文字高度、图片不出现在关键词上方、缩放可重入、双向联动与点击浮层可用;并逐引擎并排打印
列数/格子/行数,引擎差异会立即显现。

## Docs / 文档

- [`CORE_FEATURE.md`](CORE_FEATURE.md) — the core text ↔ image linking feature. / 核心图文联动功能。
- [`REFACTOR_PLANS.md`](REFACTOR_PLANS.md) — simpler, cross-browser rebuild plans. / 更简洁、跨浏览器的重构方案。
- [`prototypes/`](prototypes/) — three visual directions for that feature. / 该功能的三种视觉方向原型。
- [`IMPROVEMENTS.md`](IMPROVEMENTS.md) — prioritized TODO list. / 改进清单。
</content>
