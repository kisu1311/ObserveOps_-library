/* ════════════════════════════════════════════════════════════════════════
   widgets · pie — OOW.pie renderer (pie + donut distribution chart)
   Registers a pure, deterministic renderer on the global OOW registry; the
   declarative mount (<div class="oo-pie" data-widget="pie" …>) is filled by
   auto-mount.js, which calls OOW.pie(mountEl, opts) with the data-* attrs.
       opts.seed   number   data seed (deterministic)        default 9
       opts.donut  boolean  donut hole + center total        default true
       opts.legend boolean  show value legend                default true
       opts.label  string   center caption / aria label      default 'Total'
   Slice fills + swatch colors come from CSS tokens (var(--teal) …), so the
   renderer hardcodes no palette hexes. Depends only on the shared util
   series() (utils/series.js → utils/rng.js); falls back to flat data if absent.
   ════════════════════════════════════════════════════════════════════════ */
window.OOW = window.OOW || {};
(function () {
  var TOKENS = ['--teal', '--blue', '--purple', '--orange', '--green'];
  var NAMES = ['Compute', 'Storage', 'Network', 'Database', 'Cache'];

  function polar(cx, cy, R, a) { return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; }

  OOW.pie = function (mountEl, opts) {
    opts = opts || {};
    var seed = (opts.seed == null) ? 9 : opts.seed;
    var donut = opts.donut !== false;          // donut by default
    var legend = opts.legend !== false;        // legend by default
    var label = opts.label || 'Total';

    var gen = (typeof series === 'function')
      ? series
      : function (s, n, lo, hi) { var a = [], i; for (i = 0; i < n; i++) a.push((lo + hi) / 2); return a; };
    var data = gen(seed, 5, 10, 50);
    var tot = data.reduce(function (a, b) { return a + b; }, 0) || 1;

    var cx = 110, cy = 100, R = 78, r = donut ? 46 : 0;
    var a0 = -Math.PI / 2, slices = '', i, a1, p0, p1, large, pct;

    for (i = 0; i < data.length; i++) {
      a1 = a0 + data[i] / tot * Math.PI * 2;
      p0 = polar(cx, cy, R, a0);
      p1 = polar(cx, cy, R, a1);
      large = (a1 - a0) > Math.PI ? 1 : 0;
      pct = Math.round(data[i] / tot * 100);
      slices += '<path class="oo-pie__slice" style="fill:var(' + TOKENS[i] + ')"'
        + ' d="M ' + cx + ' ' + cy + ' L ' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1)
        + ' A ' + R + ' ' + R + ' 0 ' + large + ' 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' Z">'
        + '<title>' + NAMES[i] + ' · ' + pct + '%</title></path>';
      a0 = a1;
    }

    var center = '';
    if (donut) {
      center = '<circle class="oo-pie__hole" cx="' + cx + '" cy="' + cy + '" r="' + r + '"></circle>'
        + '<text class="oo-pie__value" x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle">' + Math.round(tot) + '</text>'
        + '<text class="oo-pie__caption" x="' + cx + '" y="' + (cy + 15) + '" text-anchor="middle">' + label + '</text>';
    }

    var chart = '<div class="oo-pie__chart">'
      + '<svg class="oo-pie__svg" viewBox="0 0 220 200" role="img" aria-label="'
      + label + ' distribution across ' + data.length + ' categories">'
      + '<g class="oo-pie__slices">' + slices + '</g>' + center + '</svg></div>';

    var leg = '';
    if (legend) {
      leg = '<ul class="oo-pie__legend">';
      for (i = 0; i < data.length; i++) {
        pct = Math.round(data[i] / tot * 100);
        leg += '<li class="oo-pie__legend-item">'
          + '<span class="oo-pie__swatch" style="background:var(' + TOKENS[i] + ')"></span>'
          + '<span class="oo-pie__legend-name">' + NAMES[i] + '</span>'
          + '<span class="oo-pie__legend-val">' + pct + '%</span></li>';
      }
      leg += '</ul>';
    }

    mountEl.innerHTML = chart + leg;
  };
})();
