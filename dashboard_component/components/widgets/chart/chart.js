/* ════════════════════════════════════════════════════════════════════════
   widgets · chart — time-series renderer (registers OOW.chart + OOW.line)

   A pure, deterministic renderer for the dashboard's line/area/bar charts.
   Registered on the global OOW registry so widgets/auto-mount.js can mount it
   declaratively from markup — no inline scripts, no DOM ids:

       <div class="oo-chart" data-widget="chart" data-style="area" data-seed="7"
            style="width:320px;height:180px"></div>

   opts (all optional, coerced from data-* by auto-mount):
     seed   number   PRNG seed → identical output every load          (default 7)
     style  string   area | line | bar | sbar | hbar | sarea | sline  (default area)
     color  string   a SVAR key ('teal'|'blue'|'purple'|…) or a hex   (default teal)
     lw     number   line stroke width                                (default 2)
     points boolean  draw a dot at each sample                        (default false)
     multi  array    [{data:[…], color:'#hex'}, …] for overlaid series

   Depends only on utils globals (series, smoothPath, SVAR) — small local
   fallbacks keep the partial renderable if utils are not yet on the page.
   Output is a single <svg> scaled to the mount; grid + axis labels carry
   oo-chart__* classes so chart.css themes them from tokens.
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
  var _SVAR = (typeof SVAR === 'object' && SVAR)
    ? SVAR
    : { teal: '#14b8a6', blue: '#008cff', purple: '#8c5bd8', orange: '#f47c22', green: '#2cc76a', red: '#e05050', yellow: '#f5c400' };

  var uid = 0; // unique gradient ids across every mount on the page

  function render(opts) {
    opts = opts || {};
    var style = opts.style || 'area';
    var seed = +opts.seed || 7;
    var lw = +opts.lw || 2;
    var points = opts.points === true || opts.points === 'true';
    var color = opts.color;
    color = (color && _SVAR[color]) ? _SVAR[color] : (color || _SVAR.teal);
    var multi = Array.isArray(opts.multi) ? opts.multi : [];

    var W = 600, H = 300, P = 26;
    var datasets = multi.length ? multi : [{ data: _series(seed, 26, 5, 95), color: color }];
    var max = 0;
    datasets.forEach(function (d) { d.data.forEach(function (v) { if (v > max) max = v; }); });
    max = Math.ceil((max * 1.05) / 10) * 10 || 100;

    var n0 = datasets[0].data.length;
    var X = function (i) { return P + i * (W - P * 2) / (n0 - 1); };
    var Y = function (v) { return H - P - v / max * (H - P * 2); };
    var g = '';

    // grid
    for (var i = 0; i <= 4; i++) {
      var gy = P + i * (H - P * 2) / 4;
      g += '<line class="oo-chart__grid" x1="' + P + '" y1="' + gy + '" x2="' + (W - P) + '" y2="' + gy + '"/>';
    }

    if (style === 'bar' || style === 'sbar') {
      var bw = (W - P * 2) / n0 * .6;
      datasets[0].data.forEach(function (v, j) {
        var x = X(j) - bw / 2, y = Y(v);
        g += '<rect class="oo-chart__bar" x="' + x + '" y="' + y + '" width="' + bw + '" height="' + (H - P - y) +
          '" rx="2" fill="' + (datasets[0].color || color) + '"' + (style === 'sbar' ? ' opacity=".9"' : '') + '/>';
      });
    } else if (style === 'hbar') {
      var data = datasets[0].data.slice(0, 8);
      var bh = (H - P * 2) / data.length * .62;
      var mx = Math.max.apply(null, data);
      data.forEach(function (v, j) {
        var y = P + j * (H - P * 2) / data.length + 4;
        var w = v / mx * (W - P * 2);
        g += '<rect class="oo-chart__bar" x="' + P + '" y="' + y + '" width="' + w + '" height="' + bh +
          '" rx="2" fill="' + (datasets[0].color || color) + '"/>';
      });
    } else {
      var fill = (style === 'area' || style === 'sarea');
      datasets.forEach(function (ds) {
        var c = ds.color || color;
        var pts = ds.data.map(function (v, j) { return [X(j), Y(v)]; });
        var path = _smooth(pts);
        if (fill) {
          var id = 'oo-chart-g' + (++uid);
          g += '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="' + c + '" stop-opacity=".55"/>' +
            '<stop offset="1" stop-color="' + c + '" stop-opacity=".02"/></linearGradient></defs>';
          g += '<path d="' + path + ' L ' + X(pts.length - 1) + ' ' + (H - P) + ' L ' + P + ' ' + (H - P) + ' Z" fill="url(#' + id + ')"/>';
        }
        g += '<path class="oo-chart__line" d="' + path + '" fill="none" stroke="' + c + '" stroke-width="' + lw + '"/>';
        if (points) ds.data.forEach(function (v, j) {
          g += '<circle class="oo-chart__pt" cx="' + X(j) + '" cy="' + Y(v) + '" r="2.6" fill="' + c + '"/>';
        });
      });
    }

    // y labels (assumes a 0–max percentage scale)
    for (var k = 0; k <= 4; k++) {
      var ly = P + k * (H - P * 2) / 4;
      g += '<text class="oo-chart__lbl" x="' + (P - 6) + '" y="' + (ly + 3) + '" text-anchor="end">' +
        Math.round(max - k * max / 4) + '%</text>';
    }

    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' + g + '</svg>';
  }

  OOW.chart = function (mountEl, opts) {
    if (!mountEl) return;
    if (!mountEl.classList.contains('oo-chart')) mountEl.classList.add('oo-chart');
    if (!mountEl.hasAttribute('role')) mountEl.setAttribute('role', 'img');
    mountEl.innerHTML = render(opts || {});
  };

  // convenience alias — a no-fill line chart
  OOW.line = function (mountEl, opts) {
    OOW.chart(mountEl, Object.assign({ style: 'line' }, opts || {}));
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = { render: render };
})();
