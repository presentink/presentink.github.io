/**
 * Cross-browser layout tests for the text <-> image linked narrative.
 *
 * Runs the same assertions in Blink (Chromium), Gecko (Firefox) and WebKit — the engine
 * Safari uses — so the layout can be checked on all three without opening a browser.
 *
 * The site itself stays dependency-free; Playwright is only needed to RUN these tests:
 *
 *     mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm i playwright
 *     npx playwright install chromium firefox webkit
 *     python3 serve.py &                                  # from the repo root
 *     PW_HOME=/tmp/pw node tests/cross-browser.mjs
 *
 * Optional: TARGET=/prototypes/2-filled-grid.html (default) or TARGET=/ to test the live page.
 */
import { createRequire } from 'module';

const PW_HOME = process.env.PW_HOME;
const require = createRequire(PW_HOME ? `${PW_HOME}/noop.js` : import.meta.url);
const { chromium, firefox, webkit } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:8000';
const TARGET = process.env.TARGET || '/prototypes/2-filled-grid.html';
const URL = BASE + TARGET;

const WIDTHS = [1600, 1280, 1024, 820, 640, 560, 414, 375];
const ENGINES = [['chromium (Blink)', chromium], ['firefox (Gecko)', firefox], ['webkit (Safari)', webkit]];

/* ------------------------------------------------------------------ *
 * Collected inside the page. Returns everything the assertions need.
 * ------------------------------------------------------------------ */
const collect = () => {
  const de = document.documentElement;
  const FIG = document.querySelector('.fig') ? '.fig' : '.thumb';
  const sections = [...document.querySelectorAll('.section')].map((sec, i) => {
    const text = sec.querySelector('.section-text');
    const grid = sec.querySelector('.section-images');
    const cs = getComputedStyle(grid);
    const cols = cs.gridTemplateColumns.split(' ').filter(Boolean).length;
    const cells = [...grid.children];
    const tr = text.getBoundingClientRect();
    const gr = grid.getBoundingClientRect();
    const cellBox = cells.length ? cells[0].getBoundingClientRect() : null;

    // How far is each linked image from the row its highlight sits in?
    // `nth` is the image's position in that highlight's list: a highlight carrying
    // three images unavoidably stacks the 2nd and 3rd a row or two further down.
    const drifts = [];
    sec.querySelectorAll('.hl[data-link]').forEach(hl => {
      const hy = hl.getBoundingClientRect().top;
      (hl.dataset.link || '').split(/\s+/).filter(Boolean).forEach((id, nth) => {
        const fig = document.getElementById(id);
        if (!fig || !grid.contains(fig)) return;
        drifts.push({ id, nth, drift: Math.round(fig.getBoundingClientRect().top - hy) });
      });
    });

    return {
      chapter: i + 1,
      cols,
      cells: cells.length,
      rows: Math.ceil(cells.length / cols),
      cell: cellBox ? Math.round(cellBox.width) : 0,
      cellSquare: cellBox ? Math.abs(cellBox.width - cellBox.height) <= 1 : true,
      textTop: Math.round(tr.top), textBottom: Math.round(tr.bottom),
      gridTop: Math.round(gr.top), gridBottom: Math.round(gr.bottom),
      gridLeft: Math.round(gr.left), textRight: Math.round(tr.right),
      drifts,
    };
  });
  return {
    innerWidth: window.innerWidth,
    scrollWidth: de.scrollWidth,
    sections,
  };
};

/* ------------------------------------------------------------------ */
const failures = [];
const fail = (engine, width, msg) => failures.push(`[${engine} @ ${width}px] ${msg}`);

async function runEngine(name, launcher) {
  const browser = await launcher.launch();
  const page = await browser.newPage();
  const rows = [];

  await page.goto(URL, { waitUntil: 'load' });

  let prevCell = Infinity;

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 1000 });
    await page.waitForTimeout(150);          // let ResizeObserver settle
    const m = await page.evaluate(collect);
    const ch1 = m.sections[0];

    /* 1. no horizontal overflow */
    if (m.scrollWidth > m.innerWidth + 1)
      fail(name, width, `horizontal overflow: scrollWidth ${m.scrollWidth} > innerWidth ${m.innerWidth}`);

    for (const s of m.sections) {
      /* 2. the two columns must never stack — the grid stays to the right of the text */
      if (s.gridLeft < s.textRight - 1)
        fail(name, width, `ch.${s.chapter}: image column stacked below/overlapping text `
          + `(gridLeft ${s.gridLeft} < textRight ${s.textRight})`);

      /* 3. cells stay square */
      if (!s.cellSquare) fail(name, width, `ch.${s.chapter}: cells are not square`);

      /* 4. the grid must REACH the text's bottom — that is the filled-to-text-height
             design. Overshooting is the accepted cost of never placing an image above its
             phrase: a chapter whose last phrase carries several images grows extra rows.
             Falling short is the real defect, so it gets the tight bound. */
      const rowH = s.cell + 8;
      const over = s.gridBottom - s.textBottom;
      if (over < -rowH * 0.5)
        fail(name, width, `ch.${s.chapter}: grid falls ${-over}px short of the text `
          + `(more than half a row of ${Math.round(rowH)}px)`);
      if (over > rowH * 2.5)
        fail(name, width, `ch.${s.chapter}: grid overshoots text by ${over}px `
          + `(> 2.5 rows of ${Math.round(rowH)}px — more than capacity can justify)`);

      /* 5a. an image may sit at most HALF a row above its highlight. The phrase snaps to
             the nearest row, so half a row is the mathematical worst case; anything beyond
             it means the collision handler pushed the image up, showing the artwork before
             the sentence that introduces it. (This bound was 1.15 rows while the rule
             rounded down — rounding down biased every image upward by up to a full row.) */
      const above = s.drifts.filter(d => d.drift < -rowH * 0.6);
      if (above.length) {
        const w = above.reduce((a, b) => (a.drift < b.drift ? a : b));
        fail(name, width, `ch.${s.chapter}: ${above.length} image(s) placed ABOVE their `
          + `highlight (worst ${w.id} at ${w.drift}px, row ${Math.round(rowH)}px)`);
      }

      /* 5b. downward drift is allowed only as far as stacking requires: the nth image on
             a highlight is necessarily n rows lower, plus half a row of rounding and half
             a row of slack for the collision push-down. */
      // Allowance: nth rows of stacking within one phrase, half a row of rounding, half
      // a row of slack — plus, in ONE-column mode only, another half row, because with a
      // single slot per row two phrases landing in the same row structurally force the
      // second image down. Measured worst case is 1.28 rows (img_2_4a @560px); the
      // two-column bound stays tight (observed margin 0.6+ rows at every width).
      const allowance = d => rowH * (d.nth + 1.1 + (s.cols === 1 ? 0.5 : 0));
      const below = s.drifts.filter(d => d.drift > allowance(d));
      if (below.length) {
        // report the biggest overshoot of its OWN allowance, not the biggest raw drift
        const w = below.reduce((a, b) =>
          (a.drift - allowance(a) > b.drift - allowance(b) ? a : b));
        fail(name, width, `ch.${s.chapter}: ${below.length} image(s) drifted too far below `
          + `their highlight (worst ${w.id} at +${w.drift}px, allowed `
          + `${Math.round(allowance(w))}px, row ${Math.round(rowH)}px)`);
      }
    }

    /* 6. cells must shrink (never grow) as the window narrows */
    if (ch1.cell > prevCell + 1)
      fail(name, width, `cell grew as the window narrowed: ${prevCell}px -> ${ch1.cell}px`);
    prevCell = ch1.cell;

    rows.push({ width, cols: ch1.cols, cell: ch1.cell, rows: ch1.rows, cells: ch1.cells });
  }

  /* 7. resize must be idempotent — going away and coming back gives the same layout */
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.waitForTimeout(150);
  const before = (await page.evaluate(collect)).sections.map(s => s.cells).join(',');
  for (const w of [700, 1500, 420, 1100, 1280]) {
    await page.setViewportSize({ width: w, height: 1000 });
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(200);
  const after = (await page.evaluate(collect)).sections.map(s => s.cells).join(',');
  if (before !== after)
    fail(name, 1280, `layout not idempotent across resizes: cells ${before} -> ${after}`);

  /* 8. bidirectional linking still works */
  // `.hover()` scrolls the target into view, and that scroll moves whatever sits under
  // the cursor — so a naive hover-then-assert races the scroll and fails at random in
  // whichever engine scrolled furthest. Settle the scroll first, then confirm the
  // pointer really is over the element before asserting on it.
  const hoverStable = async locator => {
    for (let i = 0; i < 3; i++) {
      await locator.scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
      await locator.hover();
      await page.waitForTimeout(120);
      if (await locator.evaluate(e => e.matches(':hover'))) return true;
    }
    return false;
  };

  const hl = page.locator('.hl[data-link]').first();
  const linkId = (await hl.getAttribute('data-link')).split(/\s+/)[0];
  if (!await hoverStable(hl)) fail(name, 1280, 'could not settle the pointer on a highlight');
  const figLinked = await page.locator(`#${linkId}`).evaluate(e => e.classList.contains('linked'));
  if (!figLinked) fail(name, 1280, 'hovering a highlight did not light up its image');

  if (!await hoverStable(page.locator(`#${linkId}`)))
    fail(name, 1280, 'could not settle the pointer on an image');
  const hlActive = await hl.evaluate(e => e.classList.contains('active'));
  if (!hlActive) fail(name, 1280, 'hovering an image did not light up its highlight');

  /* 9. clicking a HIGHLIGHT opens the overlay */
  const isOpen = () => page.evaluate(() => {
    const o = document.querySelector('.overlay');
    if (!o) return false;
    // prototype marks it .open; the live page toggles .visible + display:flex
    return o.classList.contains('open') || o.classList.contains('visible');
  });
  const closeOverlay = async () => {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
  };

  await hl.click();
  await page.waitForTimeout(300);
  if (!await isOpen()) fail(name, 1280, 'clicking a highlight did not open the overlay');
  await closeOverlay();

  /* 10. clicking the IMAGE must do the same — a figure is as clickable as its phrase */
  await page.locator(`#${linkId}`).click();
  await page.waitForTimeout(300);
  if (!await isOpen()) fail(name, 1280, 'clicking a linked image did not open the overlay');
  await closeOverlay();

  /* 11. ...including an image that no highlight points at */
  const orphan = await page.evaluate(() => {
    const linked = new Set();
    document.querySelectorAll('.hl[data-link]').forEach(h =>
      h.dataset.link.split(/\s+/).filter(Boolean).forEach(i => linked.add(i)));
    const sel = document.querySelector('.fig') ? '.fig[data-caption]' : '.thumb[data-caption]';
    const f = [...document.querySelectorAll(sel)]
      .find(x => x.querySelector('img') && !linked.has(x.id) && x.id);
    return f ? f.id : null;
  });
  if (orphan) {
    await page.locator(`#${orphan}`).click();
    await page.waitForTimeout(300);
    if (!await isOpen())
      fail(name, 1280, `clicking unlinked image #${orphan} did not open the overlay`);
    await closeOverlay();
  }

  await browser.close();
  return rows;
}

/* ------------------------------------------------------------------ */
const results = {};
for (const [name, launcher] of ENGINES) {
  process.stdout.write(`running ${name} ... `);
  try {
    results[name] = await runEngine(name, launcher);
    console.log('done');
  } catch (err) {
    console.log('ERROR');
    fail(name, 0, `threw: ${err.message}`);
  }
}

/* ---- report: per-width numbers side by side ---- */
console.log('\nChapter I layout, by engine (cols / cell px / rows)\n');
const names = Object.keys(results);
console.log('  width  ' + names.map(n => n.padEnd(22)).join(''));
let disagreements = 0;
for (let i = 0; i < WIDTHS.length; i++) {
  const cellsAt = names.map(n => results[n]?.[i]).filter(Boolean);
  const line = names.map(n => {
    const r = results[n]?.[i];
    return (r ? `${r.cols} col · ${r.cell}px · ${r.rows} rows` : '—').padEnd(22);
  }).join('');
  const same = cellsAt.every(r =>
    r.cols === cellsAt[0].cols && Math.abs(r.cell - cellsAt[0].cell) <= 2);
  if (!same) disagreements++;
  console.log(`  ${String(WIDTHS[i]).padStart(5)}  ${line}${same ? '' : '  <-- ENGINES DISAGREE'}`);
}

console.log('');
if (disagreements)
  console.log(`WARNING: engines disagree on ${disagreements} width(s) — see rows marked above.`);
else
  console.log('All engines agree on column count and cell size at every width.');

if (failures.length) {
  console.log(`\nFAILED — ${failures.length} assertion(s):\n`);
  failures.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('\nPASSED — all assertions hold in Blink, Gecko and WebKit.');
