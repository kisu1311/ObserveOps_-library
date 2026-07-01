/* mini-pill · single-select segmented-control behaviour
   Click a pill → it becomes aria-pressed="true" and every sibling pill in the
   same .oo-mini-pill group becomes aria-pressed="false".
   Self-contained: document-level delegation, bound once, no monolith globals.
   Consumers can listen for the bubbling 'oo-mini-pill-change' event:
   group.addEventListener('oo-mini-pill-change', e => e.detail.value). */
(function () {
  if (window.__oo_mini_pill) return;
  window.__oo_mini_pill = true;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.oo-mini-pill__btn');
    if (!btn || btn.disabled || btn.classList.contains('is-disabled')) return;

    var group = btn.closest('.oo-mini-pill');
    if (!group || group.classList.contains('is-disabled')) return;
    if (btn.getAttribute('aria-pressed') === 'true') return;

    group.querySelectorAll('.oo-mini-pill__btn').forEach(function (p) {
      p.setAttribute('aria-pressed', String(p === btn));
    });

    group.dispatchEvent(new CustomEvent('oo-mini-pill-change', {
      bubbles: true,
      detail: { value: btn.textContent.trim(), button: btn }
    }));
  });
})();
