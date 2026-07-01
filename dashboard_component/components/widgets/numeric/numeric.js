/* numeric · widgets — renderer for the OOW registry (called by auto-mount.js)
   OOW.numeric(mountEl, opts) fills a [data-widget="numeric"] mount with a 3×2
   grid of KPI boxes. Deterministic from opts.seed. Depends only on the utils
   global series(seed,n,lo,hi); ships a tiny local fallback so the card still
   renders if utils are absent. No monolith globals. */
(function () {
  window.OOW = window.OOW || {};

  // Mix a small / sequential seed into a large, well-distributed one. The utils
  // MINSTD rng yields a near-linear tiny first value for small seeds, so calling
  // series(seed+i) for i=0..5 collapses every KPI cell to the same number — hash
  // first to keep cells (and seeds) distinct. Deterministic.
  function hashSeed(seed) {
    let s = (((seed | 0) * 2654435761) ^ 0x9e3779b9) >>> 0;
    s = (s ^ (s >>> 15)) >>> 0;
    return s % 2147483647 || 1;
  }

  // Local deterministic fallback mirroring utils/series.js (seed-stable).
  function fallbackSeries(seed, n, lo, hi) {
    // scramble the seed so small/sequential seeds don't collapse to one value
    let s = ((seed * 2654435761) ^ 0x9e3779b9) % 2147483647;
    if (s <= 0) s += 2147483646;
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    r(); r();                       // warm-up to shed seed bias
    const out = []; let v = (lo + hi) / 2;
    for (let i = 0; i < n; i++) {
      v += (r() - .5) * (hi - lo) * .5;
      v = Math.max(lo, Math.min(hi, v));
      out.push(v);
    }
    return out;
  }

  const CELLS = [
    ['CPU', '%', 'teal'], ['Memory', '%', 'blue'], ['Disk', '%', 'orange'],
    ['Network', 'Mb', 'green'], ['Latency', 'ms', 'purple'], ['Errors', '/m', 'red']
  ];

  // Prefer the utils global series(); fall back locally if it is absent OR
  // throws (e.g. its own rng dependency is not loaded in a partial harness).
  function sample(seed) {
    if (typeof series === 'function') {
      try { return series(hashSeed(seed), 1, 5, 95)[0]; } catch (e) { /* fall through */ }
    }
    return fallbackSeries(seed, 1, 5, 95)[0];
  }

  OOW.numeric = function (mountEl, opts) {
    opts = opts || {};
    const seed = opts.seed != null ? opts.seed : 13;
    if (!mountEl.classList.contains('oo-numeric')) mountEl.classList.add('oo-numeric');
    if (opts.compact) mountEl.classList.add('oo-numeric--compact');

    mountEl.innerHTML = CELLS.map(function (c, i) {
      const v = Math.round(sample(seed + i));
      return '<div class="oo-numeric-cell oo-numeric-cell--' + c[2] + '">' +
        '<span class="oo-numeric-label">' + c[0] + '</span>' +
        '<span class="oo-numeric-value">' + v +
        '<span class="oo-numeric-unit">' + c[1] + '</span></span>' +
        '</div>';
    }).join('');
  };
})();
