/* ════════════════════════════════════════════════════════════════════════
   widgets · heatmap — OOW.heatmap pure renderer (hexagonal severity grid)
   Registers on the shared OOW registry; auto-mount.js calls it for every
   [data-widget="heatmap"] mount, passing data-* attributes as opts.
       <div class="oo-heatmap" data-widget="heatmap"
            data-seed="21" data-cols="14" data-rows="7"></div>
   Deterministic from opts.seed via the shared rng() util; cell fills come from
   the shared 5-step SEVS scale (green→red). The inter-cell gap stroke + hover
   outline are applied by heatmap.css from design tokens, so this renderer emits
   no palette hex of its own beyond the SEVS data fills.
   Dependencies: utils/rng.js (rng), utils/colors.js (SEVS), widgets/auto-mount.js.
   ════════════════════════════════════════════════════════════════════════ */
window.OOW = window.OOW || {};
OOW.heatmap = function (mount, opts) {
  opts = opts || {};
  var seed = +opts.seed || 21;
  var cols = +opts.cols || 14;
  var rows = +opts.rows || 7;

  // shared globals, with safe fallbacks so the partial renders in isolation
  var SEV = (typeof SEVS !== 'undefined' && SEVS)
    ? SEVS : ['#2cc76a', '#7ec850', '#f5c400', '#f47c22', '#e05050'];
  var rand = (typeof rng === 'function')
    ? rng(seed)
    : (function () { var s = seed % 2147483647; if (s <= 0) s += 2147483646;
        return function () { return (s = s * 16807 % 2147483647) / 2147483647; }; })();

  var hw = 26, hh = 23, cells = '';
  for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
    var cx = x * hw + (y % 2) * hw / 2 + 16;
    var cy = y * hh * 0.86 + 16;
    // top rows skew hotter; product() bias clusters severity like the live grid
    var idx = Math.min(4, Math.floor(rand() * rand() * 5 + (y < 1 ? 3 : 0)));
    var pts = [];
    for (var k = 0; k < 6; k++) {
      var a = Math.PI / 180 * (60 * k - 30);
      pts.push((cx + hw / 2 * Math.cos(a)).toFixed(1) + ',' + (cy + hw / 2 * Math.sin(a)).toFixed(1));
    }
    cells += '<polygon points="' + pts.join(' ') + '" fill="' + SEV[idx] +
      '"><title>severity ' + (idx + 1) + ' of 5</title></polygon>';
  }

  var vw = cols * hw + hw, vh = rows * hh * 0.86 + hw;
  var label = (mount.getAttribute('aria-label') || ('Severity heat map, ' + cols + ' by ' + rows + ' grid'))
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  mount.innerHTML =
    '<svg class="oo-heatmap__svg" viewBox="0 0 ' + vw + ' ' + vh + '" ' +
    'preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + label + '">' +
    cells + '</svg>';
};
