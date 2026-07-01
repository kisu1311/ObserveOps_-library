/* ════════════════════════════════════════════════════════════════════════
   widget · sankey — OOW.sankey(mountEl, opts) renderer
   Draws a dependency Sankey: 3 left source tiers fan out to 4 right
   destinations through translucent bezier flow ribbons coloured by source.
   Pure + deterministic: identical output for a given opts.seed (no real data).
   opts: { seed = 81 }.  Category colours emitted as var() fills so theme
   tokens stay the single source of truth.
   Depends only on the global rng() (utils/rng.js); falls back to a local
   Lehmer generator if rng() is absent so the file never throws standalone.
   auto-mount.js scans [data-widget="sankey"] and calls this.
   ════════════════════════════════════════════════════════════════════════ */
window.OOW = window.OOW || {};
window.OOW.sankey = function (mountEl, opts) {
  opts = opts || {};
  var seed = opts.seed != null ? opts.seed : 81;

  var C = ['var(--teal)', 'var(--blue)', 'var(--purple)', 'var(--orange)', 'var(--green)', 'var(--red)', 'var(--yellow)'];
  var L = ['Ingress', 'Firewall', 'App Tier'];
  var R = ['DB', 'Cache', 'External', 'Drop'];
  var lx = 40, rx = 280, W = 360, H = 250;

  var rand = (typeof rng === 'function')
    ? rng(seed)
    : (function (s) { s = s % 2147483647; if (s <= 0) s += 2147483646; return function () { return (s = s * 16807 % 2147483647) / 2147483647; }; })(seed);

  var g = '';

  // left source nodes + labels
  L.forEach(function (n, i) {
    var y = 30 + i * 70;
    g += '<rect class="oo-sankey__node" x="' + (lx - 14) + '" y="' + y + '" width="14" height="46" rx="2" fill="' + C[i] + '"/>'
      + '<text class="oo-sankey__label" x="' + (lx - 20) + '" y="' + (y + 26) + '" text-anchor="end">' + n + '</text>';
  });

  // right destination nodes + labels
  R.forEach(function (n, i) {
    var y = 20 + i * 56;
    g += '<rect class="oo-sankey__node" x="' + rx + '" y="' + y + '" width="14" height="38" rx="2" fill="' + C[i + 3] + '"/>'
      + '<text class="oo-sankey__label" x="' + (rx + 20) + '" y="' + (y + 22) + '">' + n + '</text>';
  });

  // flow ribbons (skip ~half for sparsity, weight = generated throughput)
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 4; j++) {
      if (rand() > 0.5) continue;
      var y0 = 30 + i * 70 + 23, y1 = 20 + j * 56 + 19, w = 2 + rand() * 9;
      g += '<path class="oo-sankey__flow" d="M ' + lx + ' ' + y0 + ' C 160 ' + y0 + ' 160 ' + y1 + ' ' + rx + ' ' + y1
        + '" fill="none" stroke="' + C[i] + '" stroke-width="' + w.toFixed(2) + '"/>';
    }
  }

  mountEl.innerHTML = '<svg class="oo-sankey__svg" viewBox="0 0 ' + W + ' ' + H
    + '" role="img" aria-label="Dependency flow from 3 source tiers to 4 destinations">' + g + '</svg>';
};
