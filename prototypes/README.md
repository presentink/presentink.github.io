# Prototypes & the frozen "before" page
# 原型与改造前页面存档

The rewrite of the text ↔ image linked narrative is **finished and shipped into `index.html`**
(2026-08-23). What lives here now is the decision trail: the page as it was before, and the three
visual directions that were tried.
图文联动叙事的重构**已完成并合入 `index.html`**(2026-08-23)。本目录保存的是决策过程:改造前的页面,
以及当时试过的三个视觉方向。

See [`../REFACTOR_PLANS.md`](../REFACTOR_PLANS.md) for the full write-up, including the two claims
in it that testing disproved. / 完整记录(含其中被实测证伪的两处论断)见 `../REFACTOR_PLANS.md`。

## Files / 文件

| File | What it is |
|---|---|
| `0-original-index.html` | **The frozen "before" page.** A copy of `index.html` as it was prior to the rewrite, for side-by-side comparison. Behaviour untouched; only relative asset paths were rewritten (`./` → `../`) so it renders from this folder. **Do not develop here.** / **改造前页面存档。** 行为未改,仅把相对资源路径改为 `../`。**请勿在此开发。** |
| `2-filled-grid.html` | The prototype that became the shipped design. Kept because it runs standalone with a live readout of window width / column count / cell size / row count — handy for inspecting the algorithm without the hero and gallery in the way. / 最终采用方案的原型。保留是因为它可独立运行,且带实时读数(窗口宽度 / 列数 / 格子边长 / 行数),便于在没有首屏和轮播干扰的情况下观察算法。 |
| `1-anchored-whitespace.html` | ❌ Rejected. Anchors each image to its phrase and drops the grid. / 已否决:锚定到关键词但放弃网格。 |
| `3-css-sidenotes.html` | ❌ Rejected. Zero-JS margin notes; figures overlap the text at narrow widths. / 已否决:零 JS 页边注,窄屏下压住正文。 |
| `sample.js` | Chapter text, highlights and image config, auto-extracted from `index.html`. Shared by prototypes 1–3. / 从 `index.html` 自动提取的章节正文、关键词与图片配置,供三个原型共用。 |
| `base.css` | Design tokens and typography copied from `index.html`, so a prototype differs only in its layout algorithm. / 从 `index.html` 复制的设计变量与排版,使原型之间只在布局算法上有差别。 |
| `linking.js` | The two invariants: bidirectional hover linking + click-to-overlay. / 两条不变量:双向 hover 联动 + 点击浮层。 |

## Why 2 won / 为什么选 2

The image column is not decoration that happens to sit beside the text. **The grid filling to the
text height, the cell size changing with the window, and the empty cells are the design** — the
blank squares are narrative rhythm, because not every passage needs an image. Prototypes 1 and 3
both drop the grid, so both were rejected as soon as they were seen next to the real site.
图栏不是"恰好摆在文字旁边的装饰"。**网格填满至文字高度、格子随窗口变化、空格子的存在,三者就是设计本身** ——
空方格是叙事节奏,因为并非每段话都需要配图。原型 1 和 3 都放弃了网格,一与线上站并排就被否决。

## Viewing / 查看

```bash
python3 ../serve.py          # from the repo root / 在仓库根目录运行
```

- After  / 改造后: <http://localhost:8000/>
- Before / 改造前: <http://localhost:8000/prototypes/0-original-index.html>
- Prototype 2 / 原型 2: <http://localhost:8000/prototypes/2-filled-grid.html>

`serve.py` disables caching — plain `http.server` lets Safari keep serving a stale `base.css`.
`serve.py` 禁用了缓存;用普通 `http.server` 时 Safari 会一直加载旧的 `base.css`。

In each: **hover** a highlighted phrase (or an image) to see the link light up both ways; **click**
either one to open the overlay. **Resize the window** to confirm the grid tracks the text.
每个页面里:**悬停**关键词或图片看双向点亮;**点击**任一侧打开浮层;**缩放窗口**验证网格跟随文字。
