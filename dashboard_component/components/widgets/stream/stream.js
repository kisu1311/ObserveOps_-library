/* ════════════════════════════════════════════════════════════════════════
   widgets · stream — stacked streamgraph renderer (registers OOW.stream)

   A pure, deterministic renderer for the dashboard's "Traffic Streamgraph".
   Registered on the global OOW registry so widgets/auto-mount.js can mount it
   declaratively from markup — no inline scripts, no DOM ids:

       <div class="oo-stream" data-widget="stream" data-seed="25"
            style="width:480px;height:200px"></div>

   It draws `bands` seeded series (4 by default) that accumulate into stacked,
   translucent flow bands. The total stacked height is measured once to derive a
   single stable y-scale shared by every band (so the layers nest cleanly), then
   each band is closed between its lower (pre-stack) and upper (post-stack) edges
   with a smooth cubic-bezier top.

   opts (all optional, coerced from data-* by auto-mount):
     seed    number   PRNG seed → identical output every load   (default 25)
     points  number   samples along the x-axis                  (default 24)
     bands   number   stacked series, capped at the palette size (default 4)

   Per-series colours are emitted as var() token fills, so theme tokens stay the
   single source of truth and the partial hardcodes no palette hex. Depends only
   on the shared series / smoothPath utils; small local fallbacks keep the file
   renderable standalone if utils are not yet on the page.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var OOW = window.OOW = window.OOW || {};

  var _series = (typeof series === 'function') ? series : function (seed, n, lo, hi) {
    var s = seed % 2147483647; if (s <= 0) s += 2147483646;
    var r = function () { return (s = s * 16807 % 2147483647) / 2147483647; };
    var a = [], v = (lo + hi) / 2;
    for (var i = 0; i < n; i++) { v += (r() - .5) * (hi - lo) * .5; v = Math.max(lo, Math.min(hi, v)); a.push(v); }
    return a;
  };
  var _smooth = (typeof smoothPath === 'function') ? smoothPath : function (pts) {
    if (pts.length < 2) return '';
    var d = 'M ' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var x0 = pts[i][0], y0 = pts[i][1], x1 = pts[i + 1][0], y1 = pts[i + 1][1], cx = (x0 + x1) / 2;
      d += ' C ' + cx + ' ' + y0 + ' ' + cx + ' ' + y1 + ' ' + x1 + ' ' + y1;
    }
    return d;
  };

  // token-driven category palette — one fill per stacked band
  var PALETTE = ['var(--teal)', 'var(--blue)', 'var(--purple)', 'var(--orange)', 'var(--green)', 'var(--red)', 'var(--yellow)'];

  function render(opts) {
    opts = opts || {};
    var seed = opts.seed != null ? +opts.seed : 25;
    var n = +opts.points || 24; if (n < 2) n = 24;
    var bands = +opts.bands || 4;
    if (bands < 1) bands = 4;
    if (bands > PALETTE.length) bands = PALETTE.length;
    var W = 600, H = 280, pad = 8;

    // one seeded series per band (deterministic from seed)
    var sets = [], k;
    for (k = 0; k < bands; k++) sets.push(_series(seed + k * 5, n, 10, 40));

    // total stacked height at each sample → a single stable y-scale for all bands
    var mx = 120, i;
    for (i = 0; i < n; i++) {
      var t = 0; for (k = 0; k < bands; k++) t += sets[k][i];
      if (t > mx) mx = t;
    }
    var X = function (ix) { return ix * W / (n - 1); };
    var Y = function (y) { return H - y / mx * H * 0.92 - pad; };

    var stack = []; for (i = 0; i < n; i++) stack[i] = 0;
    var g = '';
    for (k = 0; k < bands; k++) {
      var s = sets[k], lower = [], upper = [];
      for (i = 0; i < n; i++) lower.push([X(i), Y(stack[i])]);   // band floor (pre-stack)
      for (i = 0; i < n; i++) stack[i] += s[i];
      for (i = 0; i < n; i++) upper.push([X(i), Y(stack[i])]);   // band ceiling (post-stack)
      var d = _smooth(lower);
      for (i = upper.length - 1; i >= 0; i--) d += ' L ' + upper[i][0].toFixed(2) + ' ' + upper[i][1].toFixed(2);
      d += ' Z';
      g += '<path class="oo-stream__band" d="' + d + '" fill="' + PALETTE[k] + '"/>';
    }

    return '<svg class="oo-stream__svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' + g + '</svg>';
  }

  OOW.stream = function (mountEl, opts) {
    if (!mountEl) return;
    if (!mountEl.classList.contains('oo-stream')) mountEl.classList.add('oo-stream');
    if (!mountEl.hasAttribute('role')) mountEl.setAttribute('role', 'img');
    if (!mountEl.hasAttribute('aria-label')) mountEl.setAttribute('aria-label', 'Stacked traffic streamgraph');
    mountEl.innerHTML = render(opts || {});
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = { render: render };
})();
