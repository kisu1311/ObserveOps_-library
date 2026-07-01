/* style-chooser · single-select group behaviour
   Clicking a button selects it within its OWN .oo-style-chooser group and
   deselects the siblings (aria-pressed + .is-on stay in sync). Native <button>
   gives Enter/Space activation for free.
   Self-contained: document-level delegation, bound once, no monolith globals.
   Consumers listen for the bubbling 'oo-style-change' event:
     group.addEventListener('oo-style-change', e => e.detail.style); */
(function () {
  if (window.__oo_style_chooser) return;
  window.__oo_style_chooser = true;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.oo-style-chooser__btn');
    if (!btn || btn.disabled || btn.classList.contains('is-disabled')) return;
    var group = btn.closest('.oo-style-chooser');
    if (!group) return;

    group.querySelectorAll('.oo-style-chooser__btn').forEach(function (b) {
      var sel = b === btn;
      b.setAttribute('aria-pressed', String(sel));
      b.classList.toggle('is-on', sel);
    });

    group.dispatchEvent(new CustomEvent('oo-style-change', {
      bubbles: true,
      detail: { style: btn.dataset.style || null, button: btn }
    }));
  });
})();
