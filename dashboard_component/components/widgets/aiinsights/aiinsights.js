/* ════════════════════════════════════════════════════════════════════════
   widgets · aiinsights — AI Insights feed renderer (registers OOW.aiinsights)

   A pure, deterministic renderer for the dashboard's AI-insights widget.
   Registered on the global OOW registry so widgets/auto-mount.js can mount it
   declaratively from markup — no inline scripts, no DOM ids:

       <div class="oo-aiinsights" data-widget="aiinsights" data-seed="53"
            style="width:320px;height:220px"></div>

   It renders a role="list" <ul> of compact insight cards. Each card carries a
   coloured severity rail (--ins-sev), an uppercase "kind" label tinted by its
   category colour (--ins-kc), a right-aligned mono confidence value, a bold
   title and a muted one-line description. Both accent vars are emitted inline
   as var(--token) references, so aiinsights.css stays the single owner of
   presentation and nothing hardcodes palette hex.

   opts (all optional, coerced from data-* by auto-mount):
     seed   number   PRNG seed → identical confidence values every load (default 53)
     label  string   accessible name for the list                 (default 'AI insights feed')

   Confidence percentages are the only data driven off the seed, so output is
   deterministic. Depends only on utils globals (rng, esc) with small local
   fallbacks so the partial renders even before utils load.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var OOW = window.OOW = window.OOW || {};

  var _rng = (typeof rng === 'function') ? rng : function (seed) {
    var s = seed % 2147483647; if (s <= 0) s += 2147483646;
    return function () { return (s = s * 16807 % 2147483647) / 2147483647; };
  };
  var _esc = (typeof esc === 'function') ? esc : function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  // kind → its own label tint; sev → the left-rail severity token
  var ITEMS = [
    { kind: 'anomaly',    sev: '--red',    kc: '--purple2', title: 'Disk anomaly · DATASTORE-01',     desc: 'Usage 80.9% — 3.1σ above baseline' },
    { kind: 'forecast',   sev: '--orange', kc: '--orange',  title: 'sql-primary sessions trending up', desc: 'Will breach 350 in ~3h' },
    { kind: 'root cause', sev: '--blue',   kc: '--blue',    title: '6 alerts share one root cause',     desc: 'edge-fw-01 throughput saturation' },
    { kind: 'noise',      sev: '--green',  kc: '--green',   title: '38 flapping alerts suppressed',     desc: 'k8s-prod restarts grouped → 1 incident' }
  ];

  function render(opts) {
    opts = opts || {};
    var seed = opts.seed != null ? +opts.seed : 53;
    var label = opts.label || 'AI insights feed';
    var r = _rng(seed);

    var rows = ITEMS.map(function (it) {
      var conf = (80 + r() * 19).toFixed(0);
      return '<li class="oo-aiinsights__item" style="--ins-sev:var(' + it.sev + ');--ins-kc:var(' + it.kc + ')">'
        + '<div class="oo-aiinsights__head">'
        + '<span class="oo-aiinsights__type">' + _esc(it.kind) + '</span>'
        + '<span class="oo-aiinsights__conf">' + conf + '% conf</span>'
        + '</div>'
        + '<div class="oo-aiinsights__title">' + _esc(it.title) + '</div>'
        + '<div class="oo-aiinsights__desc">' + _esc(it.desc) + '</div>'
        + '</li>';
    }).join('');

    return '<ul class="oo-aiinsights__list" role="list" aria-label="' + _esc(label) + '">' + rows + '</ul>';
  }

  OOW.aiinsights = function (mountEl, opts) {
    if (!mountEl) return;
    if (!mountEl.classList.contains('oo-aiinsights')) mountEl.classList.add('oo-aiinsights');
    mountEl.innerHTML = render(opts || {});
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = { render: render };
})();
