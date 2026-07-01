/* ════════════════════════════════════════════════════════════════════════
   toggle-switch · fields — role=switch behaviour (collision-free)
   Document-level delegation, bound once and guarded against double-binding.
   Flips [aria-checked] on any .oo-toggle and keeps its ON/OFF state label in
   sync. Self-contained: no monolith globals, no element IDs.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.__oo_toggle_switch) return;
  window.__oo_toggle_switch = true;

  function flip(el) {
    if (el.disabled || el.classList.contains('is-disabled')) return;
    var on = el.getAttribute('aria-checked') !== 'true';
    el.setAttribute('aria-checked', on ? 'true' : 'false');
    var state = el.querySelector('.oo-toggle__state');
    if (state) state.textContent = on ? 'ON' : 'OFF';
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('.oo-toggle');
    if (el) flip(el);
  });

  /* Space / Enter activation for switches rendered on a non-button element.
     A native <button> already synthesises a click for these keys, so skip it
     there to avoid a double toggle. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    var el = e.target.closest('.oo-toggle');
    if (!el || el.tagName === 'BUTTON') return;
    e.preventDefault();
    flip(el);
  });
})();
