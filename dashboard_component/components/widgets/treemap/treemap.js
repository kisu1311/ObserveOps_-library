/* ════════════════════════════════════════════════════════════════════════
   widgets · treemap — OOW.treemap renderer (squarified treemap of 6 cells)
   Registers a pure, deterministic renderer on the global OOW registry; the
   declarative mount (<div class="oo-treemap" data-widget="treemap" …>) is
   filled by auto-mount.js, which calls OOW.treemap(mountEl, opts) with data-*.
       opts.seed    number   data seed (deterministic)            default 29
       opts.values  boolean  draw the metric value under labels   default true
       opts.label   string   accessible name for the chart        default 'Treemap'
   Cell sizes come from the shared util series() (utils/series.js → rng.js);
   layout is a squarified treemap (Bruls et al.) so rectangles stay near-square.
   Fills resolve from CSS tokens (style="fill:var(--teal)" …) — no palette hex
   is hardcoded here. Falls back to flat data if series() is unavailable.
   ════════════════════════════════════════════════════════════════════════ */
window.OOW = window.OOW || {};
(function () {
  var TOKENS = ['--teal', '--blue', '--purple', '--orange', '--green', '--red'];
  var NAMES = ['Server', 'Network', 'Cloud', 'DB', 'Apps', 'Storage'];
  var W = 360, H = 250, GAP = 2;

  /* squarified treemap layout → array of {x,y,w,h} indexed like `areas` */
  function squarify(areas, X, Y, BW, BH) {
    var total = areas.reduce(function (a, b) { return a + b; }, 0) || 1;
    var scale = (BW * BH) / total;
    var items = areas.map(function (a, i) { return { a: a * scale, i: i }; });
    var rects = [];
    var x = X, y = Y, w = BW, h = BH, i = 0;

    function worst(row, side) {
      var sum = 0, mn = Infinity, mx = 0, k;
      for (k = 0; k < row.length; k++) {
        var v = row[k].a; sum += v;
        if (v < mn) mn = v; if (v > mx) mx = v;
      }
      var s2 = sum * sum, side2 = side * side;
      return Math.max(side2 * mx / s2, s2 / (side2 * mn));
    }

    while (i < items.length) {
      var side = Math.min(w, h);
      var row = [items[i]], j = i + 1;
      while (j < items.length && worst(row.concat([items[j]]), side) <= worst(row, side)) {
        row.push(items[j]); j++;
      }
      var rowSum = row.reduce(function (s, it) { return s + it.a; }, 0), k;
      if (h <= w) {                 // h is the shorter side → vertical column on the left
        var colW = rowSum / h, cy = y;
        for (k = 0; k < row.length; k++) {
          var rh = row[k].a / colW;
          rects[row[k].i] = { x: x, y: cy, w: colW, h: rh };
          cy += rh;
        }
        x += colW; w -= colW;
      } else {                      // w is the shorter side → horizontal row on top
        var rowH = rowSum / w, cx = x;
        for (k = 0; k < row.length; k++) {
          var rw = row[k].a / rowH;
          rects[row[k].i] = { x: cx, y: y, w: rw, h: rowH };
          cx += rw;
        }
        y += rowH; h -= rowH;
      }
      i = j;
    }
    return rects;
  }

  OOW.treemap = function (mountEl, opts) {
    opts = opts || {};
    var seed = (opts.seed == null) ? 29 : opts.seed;
    var showVals = opts.values !== false;
    var label = opts.label || 'Treemap';

    var gen = (typeof series === 'function')
      ? series
      : function (s, n, lo, hi) { var a = [], i; for (i = 0; i < n; i++) a.push((lo + hi) / 2); return a; };
    var sizes = gen(seed, 6, 1, 6);
    var rects = squarify(sizes, 0, 0, W, H);

    var cells = '';
    for (var i = 0; i < rects.length; i++) {
      var rc = rects[i];
      var rx = rc.x + GAP, ry = rc.y + GAP;
      var rw = Math.max(0, rc.w - GAP * 2), rh = Math.max(0, rc.h - GAP * 2);
      var cx = rx + rw / 2, cyc = ry + rh / 2;
      var roomLabel = rw > 44 && rh > 22;
      var roomVal = showVals && rw > 44 && rh > 40;
      var val = Math.round(sizes[i] * 14);

      var txt = '';
      if (roomLabel) {
        var ly = roomVal ? cyc - 4 : cyc + 4;
        txt += '<text class="oo-treemap__label" x="' + cx.toFixed(1) + '" y="' + ly.toFixed(1)
          + '" text-anchor="middle" dominant-baseline="middle">' + NAMES[i] + '</text>';
      }
      if (roomVal) {
        txt += '<text class="oo-treemap__value" x="' + cx.toFixed(1) + '" y="' + (cyc + 13).toFixed(1)
          + '" text-anchor="middle" dominant-baseline="middle">' + val + '</text>';
      }

      cells += '<g class="oo-treemap__cell" role="listitem">'
        + '<rect class="oo-treemap__rect" x="' + rx.toFixed(1) + '" y="' + ry.toFixed(1)
        + '" width="' + rw.toFixed(1) + '" height="' + rh.toFixed(1) + '" rx="5"'
        + ' style="fill:var(' + TOKENS[i] + ')"></rect>'
        + '<title>' + NAMES[i] + ' · ' + val + '</title>'
        + txt + '</g>';
    }

    mountEl.innerHTML = '<svg class="oo-treemap__svg" viewBox="0 0 ' + W + ' ' + H
      + '" preserveAspectRatio="none" role="img" aria-label="' + label
      + ' across ' + NAMES.length + ' categories"><g role="list">' + cells + '</g></svg>';
  };
})();
