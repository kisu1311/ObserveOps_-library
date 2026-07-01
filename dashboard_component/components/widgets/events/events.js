/* ════════════════════════════════════════════════════════════════════════
   events · widgets renderer — OOW.events (vertical event timeline)
   Registers a pure, deterministic renderer on the global OOW registry.
   auto-mount.js scans [data-widget="events"] and calls OOW.events(el, opts),
   where opts are the coerced data-* attributes:
       data-seed   : number  PRNG seed (deterministic timestamps)   default 47
   Output is a role="list" <ul> of up to 8 rows: a coloured left rail + dot,
   an event description and a mono timestamp. Row accents cycle through the
   severity tokens (teal/blue/orange/purple/green) via an inline --ev-c var.
   Dependencies (globals): rng(), esc(). Styling lives in events.css.
   ════════════════════════════════════════════════════════════════════════ */
window.OOW = window.OOW || {};
window.OOW.events = function (mountEl, opts) {
  opts = opts || {};
  var seed = opts.seed != null ? +opts.seed : 47;
  var r = rng(seed);

  var evs = ['Monitor added', 'Policy triggered', 'Threshold updated', 'Maintenance started',
    'User login', 'Config changed', 'Alert cleared', 'Agent reconnected'];
  var cols = ['teal', 'blue', 'orange', 'purple', 'green'];

  var rows = evs.map(function (e, i) {
    var tok = cols[i % cols.length];
    var hh = (8 + i).toString().padStart(2, '0');
    var mm = (r() * 59).toFixed(0).padStart(2, '0');
    var label = '26-06-10 ' + hh + ':' + mm;
    return '<li class="oo-events__item" style="--ev-c:var(--' + tok + ')">'
      + '<span class="oo-events__dot" aria-hidden="true"></span>'
      + '<div class="oo-events__body">'
      + '<div class="oo-events__desc" title="' + esc(e) + '">' + esc(e) + '</div>'
      + '<time class="oo-events__time mono" datetime="2026-06-10T' + hh + ':' + mm + '">'
      + label + '</time>'
      + '</div></li>';
  }).join('');

  mountEl.classList.add('oo-events');
  mountEl.setAttribute('role', 'group');            // labelable container for aria-label
  if (!mountEl.getAttribute('aria-label')) mountEl.setAttribute('aria-label', 'Recent events');
  // role="list" on the <ul> restores list semantics that list-style:none strips in WebKit
  mountEl.innerHTML = '<ul class="oo-events__list" role="list">' + rows + '</ul>';
};
