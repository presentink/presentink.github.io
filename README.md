# presentink.github.io
Yufan Wang's Art Portfolio

A static, dependency-free portfolio site hosted on GitHub Pages. The whole site is `index.html`.

## Run locally / 本地运行

No build step. Serve the folder so relative paths and image loading behave like production.
无需构建。以本地服务器打开,使相对路径与图片加载和线上一致:

```bash
python3 -m http.server 8000
```

Then open / 然后打开:

- Site / 主站: <http://localhost:8000/>
- Prototypes / 原型:
  - <http://localhost:8000/prototypes/1-anchored-whitespace.html>
  - <http://localhost:8000/prototypes/2-filled-grid.html>
  - <http://localhost:8000/prototypes/3-css-sidenotes.html>

## Docs / 文档

- [`CORE_FEATURE.md`](CORE_FEATURE.md) — the core text ↔ image linking feature. / 核心图文联动功能。
- [`REFACTOR_PLANS.md`](REFACTOR_PLANS.md) — simpler, cross-browser rebuild plans. / 更简洁、跨浏览器的重构方案。
- [`prototypes/`](prototypes/) — three visual directions for that feature. / 该功能的三种视觉方向原型。
- [`IMPROVEMENTS.md`](IMPROVEMENTS.md) — prioritized TODO list. / 改进清单。
</content>
