# Prototypes — Text ↔ Image Linking, three visual directions
# 原型 —— 图文联动的三种视觉方向

Three self-contained prototypes of the core feature (see [`../CORE_FEATURE.md`](../CORE_FEATURE.md)
and [`../REFACTOR_PLANS.md`](../REFACTOR_PLANS.md)). All three share the **same content** and the
**same interaction layer** (`linking.js`), so they differ **only** in the alignment algorithm — pick
by which visual you prefer.
核心功能的三个自包含原型(见上两份文档)。三者共用**相同内容**与**相同交互层**(`linking.js`),
**只**在对齐算法上不同——按你想要的视觉挑选。

## How to view / 如何查看

Serve the repo root (relative image paths need a server):
以本地服务器打开(相对图片路径需要服务器):

```bash
python3 -m http.server 8000
# then open / 然后打开:
#   http://localhost:8000/prototypes/1-anchored-whitespace.html
#   http://localhost:8000/prototypes/2-filled-grid.html
#   http://localhost:8000/prototypes/3-css-sidenotes.html
```

In each: **hover** a highlighted phrase (or an image) to see the link light up both ways; **click**
to open the overlay (arrows / Esc / ← →). **Resize the window** to confirm alignment holds.
每个页面里:**悬停**关键词或图片看双向点亮;**点击**打开浮层(方向键/Esc);**缩放窗口**验证对齐。

## Comparison / 对比

| | 1 · Anchored (whitespace) | 2 · Filled grid | 3 · CSS sidenotes |
|---|---|---|---|
| Visual / 视觉 | Image precisely beside its phrase, gaps between / 精确贴词,间留白 | Full square mosaic aligned to text / 填满方块网格 | Margin figures (Tufte) / 页边配图 |
| Tech / 技术 | `offsetTop` + `ResizeObserver` | simplified grid + 1 observer / 简化网格 | **pure CSS**, zero layout JS |
| JS lines / JS 行数 | ~40 | ~70 | 0 for layout / 布局 0 |
| Forced reflows / 强制重排 | 0 | 0 | 0 |
| Cross-browser / 跨浏览器 | ✅ universal | ✅ universal | ✅ universal |
| Alignment precision / 精度 | exact to phrase / 精确到词 | row bucket / 行级 | in-flow position / 流内位置 |
| Collision handling / 避让 | auto (push down) / 自动下推 | auto (row overflow) / 自动溢出 | ⚠️ none — may overlap / 无,可能重叠 |
| vs current site / 对比现状 | replaces ~500 lines / 替代约 500 行 | same look, far simpler / 同款更简 | simplest, new aesthetic / 最简,新风格 |

All three replace the current implementation's ~57 forced reflows and Safari page-reload hack.
三者都取消了当前实现的约 57 次强制重排与 Safari 整页刷新 hack。

## Shared files / 共享文件

- `sample.js` — sample chapters (real text + real images), the single source of truth. / 样例内容,单一数据源。
- `base.css` — text / highlight / figure / overlay styling. / 基础样式。
- `linking.js` — the two invariants: bidirectional hover linking + overlay lightbox. / 两条不变量:双向联动 + 灯箱。

## Not included (intentionally) / 有意未包含

These prototypes demonstrate the alignment + linking only. A production rewrite would still add:
`loading="lazy"` everywhere, compressed WebP images, SEO/OG meta, and removal of debug code — see
[`../IMPROVEMENTS.md`](../IMPROVEMENTS.md).
原型只演示对齐与联动。正式重写还需:全站懒加载、压缩 WebP、SEO/OG、清理调试代码——见 `../IMPROVEMENTS.md`。
</content>
