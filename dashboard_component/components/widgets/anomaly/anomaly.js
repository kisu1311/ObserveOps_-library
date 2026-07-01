/* ════════════════════════════════════════════════════════════════════════
   widgets · anomaly — AI/ML anomaly-detection renderer (registers OOW.anomaly)

   A pure, deterministic renderer for the dashboard's anomaly widget. Registered
   on the global OOW registry so widgets/auto-mount.js can mount it declaratively
   from markup — no inline scripts, no DOM ids:

       <div class="oo-anomaly" data-widget="anomaly" data-seed="51"
            style="width:340px;height:180px"></div>

   It draws a seeded time-series as a smooth cubic-bezier line, wraps it in a
   shaded confidence band (learned baseline ± `band`), adds a faint dashed mean
   baseline, and flags any sample whose deviation breaches the band as a red dot
   inside a soft pulsing ring.

   opts (all optional, coerced from data-* by auto-mount):
     seed       number   PRNG seed → identical output every load        (default 51)
     color      string   a SVAR key ('blue'|'purple'|'teal'|…) or a hex (default blue)
     band       number   half-width of the confidence band, value units (default 14)
     lw         number   line stroke width                              (default 2)
     threshold  number   anomaly sensitivity 0..1, higher = fewer flags (default .9)

   The series colour is injected as generated SVG data (band fill + line stroke);
   the band opacity, baseline and the always-red anomaly markers are themed by
   anomaly.css from design tokens. Depends only on utils globals (series,
   smoothPath, rng, SVAR) — small local fallbacks keep the partial renderable if
   utils are not yet on the page. Output is a single <svg> scaled to the mount.
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

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function render(opts) {
    opts = opts || {};
    var seed = +opts.seed || 51;
    var band = (opts.band != null && !isNaN(opts.band)) ? +opts.band : 14;
    var lw = +opts.lw || 2;
    var thr = (opts.threshold != null && !isNaN(opts.threshold)) ? +opts.threshold : .9;
    var color = opts.color;
    color = (color && _SVAR[color]) ? _SVAR[color] : (color || _SVAR.blue);

    var W = 600, H = 280, P = 24, n = 40;
    var data = _series(seed, n, 30, 70);
    var X = function (i) { return P + i * (W - 2 * P) / (n - 1); };
    var Y = function (v) { return H - P - clamp(v, 0, 100) / 100 * (H - 2 * P); };
    var pts = data.map(function (v, i) { return [X(i), Y(v)]; });

    // mean baseline
    var mean = data.reduce(function (a, b) { return a + b; }, 0) / n;
    var my = Y(mean);

    // confidence band: smooth upper edge, straight lower edge back (reversed)
    var up = data.map(function (v, i) { return [X(i), Y(v + band)]; });
    var dn = data.map(function (v, i) { return [X(i), Y(v - band)]; });
    var bandPath = _smooth(up) + ' L ' +
      dn.slice().reverse().map(function (p) { return p[0] + ' ' + p[1]; }).join(' L ') + ' Z';

    var g = '<path class="oo-anomaly__band" d="' + bandPath + '" fill="' + color + '"/>';
    g += '<line class="oo-anomaly__baseline" x1="' + P + '" y1="' + my + '" x2="' + (W - P) + '" y2="' + my + '"/>';
    g += '<path class="oo-anomaly__line" d="' + _smooth(pts) + '" stroke="' + color + '" stroke-width="' + lw + '"/>';

    // anomalies — samples flagged by the detector, drawn above the trend
    var r = _rng(seed + 9);
    data.forEach(function (v, i) {
      if (r() > thr) {
        var yy = Y(v + 22);
        g += '<circle class="oo-anomaly__ring" cx="' + X(i) + '" cy="' + yy + '" r="9"/>' +
          '<circle class="oo-anomaly__dot" cx="' + X(i) + '" cy="' + yy + '" r="4.5"/>';
      }
    });

    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' + g + '</svg>';
  }

  OOW.anomaly = function (mountEl, opts) {
    if (!mountEl) return;
    if (!mountEl.classList.contains('oo-anomaly')) mountEl.classList.add('oo-anomaly');
    if (!mountEl.hasAttribute('role')) mountEl.setAttribute('role', 'img');
    mountEl.innerHTML = render(opts || {});
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = { render: render };
})();
