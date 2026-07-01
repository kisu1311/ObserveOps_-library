/* subbar-arrow · panel-toggle behaviour
   Flips the button's own aria-expanded (closed ⇄ open) so the chevron rotates.
   Self-contained: document-level delegation, bound once, no monolith globals.
   Consumers can listen for the bubbling 'oo-subbar-toggle' event to show/hide
   their own panel: el.addEventListener('oo-subbar-toggle', e => e.detail.open). */
(function () {
  if (window.__oo_subbar_arrow) return;
  window.__oo_subbar_arrow = true;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.oo-subbar-arrow');
    if (!btn || btn.disabled || btn.classList.contains('is-disabled')) return;
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.dispatchEvent(new CustomEvent('oo-subbar-toggle', {
      bubbles: true,
      detail: { open: !open }
    }));
  });
})();
