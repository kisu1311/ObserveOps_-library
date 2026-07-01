/* ════════════════════════════════════════════════════════════════════════
   widgets · map — OOW.map pure renderer (stylised geo distribution map)
   Registers on the shared OOW registry; auto-mount.js calls it for every
   [data-widget="map"] mount, passing data-* attributes as opts:
       <div class="oo-map" data-widget="map" data-seed="71" data-points="11"></div>
   Emits an inline <svg>: a tokenised plate, a faint coordinate grid, and N
   severity-coloured data points, each a soft halo + solid dot grouped so the CSS
   can pulse / hover them. Deterministic from opts.seed via the shared rng() util;
   point fills come from the shared severity palette (SVAR) — the only palette
   hexes here are those generated SVG data fills. The plate, grid stroke, hover
   outline and disabled wash are applied by map.css from design tokens.
   Dependencies: utils/rng.js (rng), utils/colors.js (SVAR), widgets/auto-mount.js.
   ════════════════════════════════════════════════════════════════════════ */
window.OOW = window.OOW || {};
OOW.map = function (mount, opts) {
  opts = opts || {};
  var seed = +opts.seed || 31;
  var points = +opts.points || 11;
  var W = 360, H = 220, GX = 45, GY = 44;

  // shared globals, with safe fallbacks so the partial renders in isolation
  var SV = (typeof SVAR !== 'undefined' && SVAR)
    ? SVAR : { green: '#2cc76a', yellow: '#f5c400', orange: '#f47c22', red: '#e05050' };
  var rand = (typeof rng === 'function')
    ? rng(seed)
    : (function () { var s = seed % 2147483647; if (s <= 0) s += 2147483646;
        return function () { return (s = s * 16807 % 2147483647) / 2147483647; }; })();

  var cols = [SV.green, SV.yellow, SV.orange, SV.red];
  var names = ['Healthy', 'Warning', 'Major', 'Critical'];

  // plate + faint coordinate grid (colours come from CSS classes / tokens)
  var g = '<rect class="oo-map__plate" x="0" y="0" width="' + W + '" height="' + H + '" rx="8"/>';
  var i;
  for (i = 1; i * GX < W; i++)
    g += '<line class="oo-map__grid" x1="' + (i * GX) + '" y1="0" x2="' + (i * GX) + '" y2="' + H + '"/>';
  for (i = 1; i * GY < H; i++)
    g += '<line class="oo-map__grid" x1="0" y1="' + (i * GY) + '" x2="' + W + '" y2="' + (i * GY) + '"/>';

  // severity-coloured data points with halos (fills = generated SVG data)
  for (i = 0; i < points; i++) {
    var x = (30 + rand() * 300).toFixed(1);
    var y = (25 + rand() * 170).toFixed(1);
    var rad = 4 + rand() * 8;
    var k = Math.floor(rand() * 4);
    var c = cols[k];
    g += '<g class="oo-map__pt"><title>' + names[k] + ' location</title>'
      + '<circle class="oo-map__halo" cx="' + x + '" cy="' + y + '" r="' + (rad + 5).toFixed(1) + '" fill="' + c + '"/>'
      + '<circle class="oo-map__dot" cx="' + x + '" cy="' + y + '" r="' + rad.toFixed(1) + '" fill="' + c + '"/></g>';
  }

  var label = (mount.getAttribute('aria-label') || 'Geographic distribution map')
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  mount.innerHTML =
    '<svg class="oo-map__svg" viewBox="0 0 ' + W + ' ' + H + '" ' +
    'preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + label + '">' +
    g + '</svg>';
};
