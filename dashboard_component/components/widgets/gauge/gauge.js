/* ════════════════════════════════════════════════════════════════════════
   widgets · gauge — renderer OOW.gauge(mountEl, opts)
   Draws a 180° semicircular progress gauge: muted track arc, coloured value
   arc (sweep ∝ value 0–100), centred mono value + caption.
   Deterministic from opts.seed (via series); pure — depends only on utils
   globals (series, esc). Registers on the shared OOW registry; auto-mount.js
   instantiates any [data-widget="gauge"] mount.

   opts:
     seed   number  PRNG seed for the mocked value (default 5)
     value  number  explicit 0–100 value (overrides seed)
     label  string  caption under the value (default '% Avg CPU')
     color  string  token name (teal|red|orange|yellow|green|blue|purple)
                    or 'auto' for value-threshold severity colouring
   No monolith globals, no DOM ids. Guarded against double-registration.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  window.OOW = window.OOW || {};
  if (window.OOW.gauge) return;

  var NAMED = { teal: 1, red: 1, orange: 1, yellow: 1, green: 1, blue: 1, purple: 1 };

  window.OOW.gauge = function (mount, opts) {
    opts = opts || {};
    var e = (typeof esc === 'function') ? esc : function (s) { return String(s); };

    var seed = (opts.seed != null) ? +opts.seed : 5;
    var val = (opts.value != null)
      ? +opts.value
      : (typeof series === 'function' ? Math.round(series(seed, 1, 30, 92)[0]) : 60);
    val = Math.max(0, Math.min(100, val));

    var label = (opts.label != null) ? String(opts.label) : '% Avg CPU';

    var fill;
    if (opts.color === 'auto') {
      fill = val >= 85 ? 'var(--red)' : val >= 70 ? 'var(--orange)' : 'var(--green)';
    } else if (opts.color && NAMED[opts.color]) {
      fill = 'var(--' + opts.color + ')';
    } else {
      fill = 'var(--teal)';
    }

    var R = 80, circ = Math.PI * R, off = circ * (1 - val / 100);
    var d = 'M 30 110 A ' + R + ' ' + R + ' 0 0 1 190 110';

    mount.style.setProperty('--oo-gauge-fill', fill);
    mount.setAttribute('role', 'img');
    mount.setAttribute('aria-label', 'Gauge: ' + val + ' ' + label);

    mount.innerHTML =
      '<svg class="oo-gauge__svg" viewBox="0 0 220 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
        '<path class="oo-gauge__track" d="' + d + '"/>' +
        '<path class="oo-gauge__fill" d="' + d + '" stroke-dasharray="' + circ.toFixed(2) +
          '" stroke-dashoffset="' + circ.toFixed(2) + '"/>' +
        '<text class="oo-gauge__value" x="110" y="104" text-anchor="middle">' + val + '</text>' +
        '<text class="oo-gauge__label" x="110" y="126" text-anchor="middle">' + e(label) + '</text>' +
      '</svg>';

    // draw-in: start empty, settle to the target on the next frame (CSS transitions it)
    var arc = mount.querySelector('.oo-gauge__fill');
    if (arc) requestAnimationFrame(function () { arc.style.strokeDashoffset = off.toFixed(2); });
  };
})();
