// Shared across all prototypes: the two INVARIANTS that must never change —
//   (1) bidirectional hover linking (text .hl  <->  figure)
//   (2) click-to-open overlay / lightbox
// Prototypes differ ONLY in their alignment algorithm; this file is identical for all.
(function () {
  let overlay, stage, capEl, figs = [], idx = 0;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML =
      '<button class="ov-close" aria-label="close">×</button>' +
      '<button class="ov-nav ov-prev" aria-label="previous">‹</button>' +
      '<div class="ov-stage"></div>' +
      '<button class="ov-nav ov-next" aria-label="next">›</button>' +
      '<div class="ov-cap"></div>';
    document.body.appendChild(overlay);
    stage = overlay.querySelector('.ov-stage');
    capEl = overlay.querySelector('.ov-cap');
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.querySelector('.ov-close').onclick = close;
    overlay.querySelector('.ov-prev').onclick = () => nav(-1);
    overlay.querySelector('.ov-next').onclick = () => nav(1);
    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') nav(-1);
      if (e.key === 'ArrowRight') nav(1);
    });
  }

  function refresh() { figs = Array.from(document.querySelectorAll('.fig[data-caption]')); }
  function render() {
    const f = figs[idx], cap = f.dataset.caption || '';
    capEl.textContent = cap;
    const im = f.querySelector('img');
    stage.innerHTML = im ? '<img src="' + im.src + '" alt="' + cap + '">'
                         : '<div class="ov-ph">' + cap + '</div>';
  }
  function open(el) { refresh(); idx = Math.max(0, figs.indexOf(el)); render(); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  function nav(d) { idx = (idx + d + figs.length) % figs.length; render(); }

  function initLinking() {
    if (!overlay) buildOverlay();
    document.querySelectorAll('.hl').forEach(hl => {
      const ids = (hl.dataset.link || '').split(/\s+/).filter(Boolean);
      const targets = ids.map(i => document.getElementById(i)).filter(Boolean);
      const on = () => { hl.classList.add('active'); targets.forEach(t => t.classList.add('linked')); };
      const off = () => { hl.classList.remove('active'); targets.forEach(t => t.classList.remove('linked')); };
      hl.addEventListener('mouseenter', on);
      hl.addEventListener('mouseleave', off);
      hl.addEventListener('click', e => {
        e.preventDefault();
        const real = targets.find(t => t.querySelector('img')) || targets[0];
        if (real) open(real);
      });
      targets.forEach(t => {
        t.addEventListener('mouseenter', on);
        t.addEventListener('mouseleave', off);
      });
    });
  }

  // Public API used by each prototype
  window.PInk = { initLinking, openOverlay: open, refreshOverlay: refresh };
})();
