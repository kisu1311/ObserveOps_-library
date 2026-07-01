/* range-slider — keeps each slider's value-box and teal fill in sync.
   Self-contained: document-level 'input' delegation bound once and guarded,
   plus a one-time init pass so the fill/value are correct before any drag.
   No monolith globals. Consumers can listen for the native 'input' event. */
(function () {
  if (window.__oo_range_slider) return;
  window.__oo_range_slider = true;

  function sync(input) {
    var min = parseFloat(input.min) || 0;
    var max = input.max === '' ? 100 : parseFloat(input.max);
    var val = parseFloat(input.value) || 0;
    var pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
    input.style.setProperty('--oo-range-fill', pct + '%');

    var host = input.closest('.oo-range-slider');
    var box = host && host.querySelector('.oo-range-slider__sv');
    if (box) box.textContent = input.value;
  }

  document.addEventListener('input', function (e) {
    var input = e.target.closest && e.target.closest('.oo-range-slider__input');
    if (input) sync(input);
  });

  function init() {
    document.querySelectorAll('.oo-range-slider__input').forEach(sync);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
