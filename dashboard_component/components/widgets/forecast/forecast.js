/* ════════════════════════════════════════════════════════════════════════
   widgets · forecast — predictive renderer (registers OOW.forecast)

   A pure, deterministic renderer for the dashboard's capacity / predictive
   forecast widget. Registered on the global OOW registry so
   widgets/auto-mount.js can mount it declaratively from markup — no inline
   scripts, no DOM ids:

       <div class="oo-forecast" data-widget="forecast" data-seed="61"
            style="width:320px;height:180px"></div>

   It draws, over a token-themed gridline backdrop:
     • a solid line of observed history,
     • a dashed line projecting the forecast horizon,
     • a confidence cone that widens with the horizon (uncertainty grows),
     • a dashed vertical separator marking "now" (observed | forecast),
     • a marker dot where the solid line hands off to the projection.

   opts (all optional, coerced from data-* by auto-mount):
     seed   number   PRNG seed → identical output every load        (default 61)
     color  string   a SVAR key ('teal'|'blue'|'orange'|…) or a hex (default teal)
     n      number   count of observed history samples              (default 30)
     fc     number   count of forecast (projected) samples          (default 12)

   Depends only on utils globals (rng, series, smoothPath, SVAR) — small local
   fallbacks keep the partial renderable if utils are not yet on the page.
   Output is a single <svg> scaled to the mount; grid/axis/separator/cone carry
   oo-forecast__* classes so forecast.css themes them from tokens.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var OOW = window.OOW = window.OOW || {};

  var _rng = (typeof rng === 'function') ? rng : function (seed) {
    var s = seed % 2147483647; if (s <= 0) s += 2147483646;
    return function () { return (s = s * 16807 % 2147483647) / 2147483647; };
  };
  var _series = (typeof series === 'function') ? series : function (seed, n, lo, hi) {
    var r = _rng(seed), a = [], v = (lo + hi) / 2;
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
  var _SVAR = (typeof SVAR === 'object' && SVAR)
    ? SVAR
    : { teal: '#14b8a6', blue: '#008cff', purple: '#8c5bd8', orange: '#f47c22', green: '#2cc76a', red: '#e05050', yellow: '#f5c400' };

  function clamp(v) { return Math.max(2, Math.min(98, v)); }

  function render(opts) {
    opts = opts || {};
    var seed = +opts.seed || 61;
    var n = +opts.n || 30;
    var fc = +opts.fc || 12;
    var color = opts.color;
    color = (color && _SVAR[color]) ? _SVAR[color] : (color || _SVAR.teal);

    var W = 600, H = 300, P = 26;
    var X = function (i) { return P + i * (W - P * 2) / (n + fc - 1); };
    var Y = function (v) { return H - P - v / 100 * (H - P * 2); };

    var data = _series(seed, n, 30, 70);
    var hist = data.map(function (v, i) { return [X(i), Y(v)]; });
    var join = hist[n - 1];

    // forecast random-walk continues from the last observed value
    var r = _rng(seed + 4), v = data[n - 1], fdata = [];
    for (var i = 0; i < fc; i++) { v = clamp(v + (r() - .45) * 6); fdata.push(v); }
    var fpts = fdata.map(function (vv, i) { return [X(n + i), Y(vv)]; });

    // confidence band — widens with the horizon (uncertainty grows downrange)
    var upper = fdata.map(function (vv, i) { return [X(n + i), Y(clamp(vv + 4 + i * 1.2))]; });
    var lower = fdata.map(function (vv, i) { return [X(n + i), Y(clamp(vv - 4 - i * 1.2))]; });
    var cone = _smooth([join].concat(upper)) + ' L '
      + lower.slice().reverse().map(function (p) { return p[0] + ' ' + p[1]; }).join(' L ')
      + ' L ' + join[0] + ' ' + join[1] + ' Z';

    var g = '';

    // gridline backdrop
    for (var k = 0; k <= 4; k++) {
      var gy = P + k * (H - P * 2) / 4;
      g += '<line class="oo-forecast__grid" x1="' + P + '" y1="' + gy + '" x2="' + (W - P) + '" y2="' + gy + '"/>';
    }

    // confidence cone, then observed line, then dashed projection
    g += '<path class="oo-forecast__cone" d="' + cone + '" fill="' + color + '"/>';
    g += '<path class="oo-forecast__hist" d="' + _smooth(hist) + '" stroke="' + color + '"/>';
    g += '<path class="oo-forecast__fc" d="' + _smooth([join].concat(fpts)) + '" stroke="' + color + '"/>';

    // "now" separator + handoff marker
    g += '<line class="oo-forecast__sep" x1="' + X(n - 1) + '" y1="' + P + '" x2="' + X(n - 1) + '" y2="' + (H - P) + '"/>';
    g += '<circle class="oo-forecast__now" cx="' + join[0] + '" cy="' + join[1] + '" r="3.4" fill="' + color + '"/>';

    // y labels (0–100% scale)
    for (var j = 0; j <= 4; j++) {
      var ly = P + j * (H - P * 2) / 4;
      g += '<text class="oo-forecast__lbl" x="' + (P - 6) + '" y="' + (ly + 3) + '" text-anchor="end">' + (100 - j * 25) + '%</text>';
    }

    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' + g + '</svg>';
  }

  OOW.forecast = function (mountEl, opts) {
    if (!mountEl) return;
    if (!mountEl.classList.contains('oo-forecast')) mountEl.classList.add('oo-forecast');
    if (!mountEl.hasAttribute('role')) mountEl.setAttribute('role', 'img');
    mountEl.innerHTML = render(opts || {});
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = { render: render };
})();
