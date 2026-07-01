/* ════════════════════════════════════════════════════════════════════════
   topn · widgets renderer — OOW.topn (horizontal Top-N bar list)
   Registers a pure, deterministic renderer on the global OOW registry.
   auto-mount.js scans [data-widget="topn"] and calls OOW.topn(el, opts),
   where opts are the coerced data-* attributes:
       data-seed   : number  PRNG seed (deterministic bars)        default 11
       data-color  : token   bar accent token name (teal|blue|…)   default teal
       data-unit   : string  optional value suffix (e.g. "ms")     default ""
   Output is a role="list" of up to 8 rows: name + proportional bar + value.
   Dependencies (globals): series() [→ rng()], esc(). Styling lives in topn.css.
   ════════════════════════════════════════════════════════════════════════ */
window.OOW = window.OOW || {};
window.OOW.topn = function (mountEl, opts) {
  opts = opts || {};
  var seed = opts.seed != null ? +opts.seed : 11;
  var colorTok = (typeof opts.color === 'string' && opts.color) ? opts.color : 'teal';
  var unit = (opts.unit != null && opts.unit !== '') ? String(opts.unit) : '';

  var names = ['zimbra-server', 'YASH | APM', 'xen71master', 'worker2', 'worker1', 'win-server154', 'core-router', 'db-primary'];
  var data = series(seed, names.length, 20, 100).sort(function (a, b) { return b - a; });
  var mx = Math.max.apply(null, data);

  var rows = names.map(function (n, i) {
    var w = (data[i] / mx * 100).toFixed(1);
    var v = data[i].toFixed(0);
    var label = v + (unit ? ' ' + unit : '');
    return '<div class="oo-topn__row" role="listitem">'
      + '<div class="oo-topn__name" title="' + esc(n) + '">' + esc(n) + '</div>'
      + '<div class="oo-topn__track"><div class="oo-topn__bar" style="width:' + w + '%"></div></div>'
      + '<div class="oo-topn__val mono" aria-label="' + esc(label) + '">' + v
      + (unit ? '<span class="oo-topn__unit">' + esc(unit) + '</span>' : '') + '</div>'
      + '</div>';
  }).join('');

  mountEl.classList.add('oo-topn');
  mountEl.style.setProperty('--topn-c', 'var(--' + colorTok + ')');
  mountEl.setAttribute('role', 'list');
  if (!mountEl.getAttribute('aria-label')) mountEl.setAttribute('aria-label', 'Top N');
  mountEl.innerHTML = rows;
};
