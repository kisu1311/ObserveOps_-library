/* counter-picker · behaviour
   Self-contained, document-level delegation, bound once. No monolith globals.
   - Clicking a counter row single-selects it within its own picker (toggles
     .is-on + aria-pressed). - Typing in the search field filters the rows by
     their data-label (falls back to text content). */
(function () {
  if (window.__oo_counter_picker) return;
  window.__oo_counter_picker = true;

  // single-select a counter row
  document.addEventListener('click', function (e) {
    var opt = e.target.closest('.oo-counter-picker__opt');
    if (!opt || opt.disabled || opt.getAttribute('aria-disabled') === 'true') return;
    var picker = opt.closest('.oo-counter-picker');
    if (!picker) return;
    picker.querySelectorAll('.oo-counter-picker__opt').forEach(function (o) {
      var on = o === opt;
      o.classList.toggle('is-on', on);
      o.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  });

  // filter the list as the search field is typed
  document.addEventListener('input', function (e) {
    var input = e.target;
    if (!input.closest('.oo-counter-picker__search') || input.tagName !== 'INPUT') return;
    var picker = input.closest('.oo-counter-picker');
    if (!picker) return;
    var q = input.value.trim().toLowerCase();
    picker.querySelectorAll('.oo-counter-picker__opt').forEach(function (o) {
      var label = (o.getAttribute('data-label') || o.textContent || '').toLowerCase();
      o.hidden = q !== '' && label.indexOf(q) === -1;
    });
  });
})();
