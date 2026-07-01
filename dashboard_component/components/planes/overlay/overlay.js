/* overlay · planes — self-contained backdrop open/close behaviour.
   Document-level delegation, bound once and guarded. No monolith globals.
   - [data-oo-overlay-open] opens the .oo-overlay inside its .oo-overlay-stage
   - [data-oo-overlay-close] (✕ / footer buttons) closes its nearest overlay
   - clicking the scrim itself (not the dialog box) dismisses it
   - Escape closes the most recently opened overlay
   Each control resolves to an .oo-overlay root, keeping the partial isolated. */
(function () {
  if (window.__oo_overlay) return;
  window.__oo_overlay = true;

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-oo-overlay-open]');
    if (opener) {
      var scope = opener.closest('.oo-overlay-stage') || document;
      var ov = scope.querySelector('.oo-overlay');
      if (ov) ov.classList.add('is-open');
      return;
    }

    var closer = e.target.closest('[data-oo-overlay-close]');
    if (closer) {
      var owned = closer.closest('.oo-overlay');
      if (owned) owned.classList.remove('is-open');
      return;
    }

    // backdrop click — only when the scrim element itself is the target
    if (e.target.classList && e.target.classList.contains('oo-overlay')) {
      e.target.classList.remove('is-open');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelectorAll('.oo-overlay.is-open');
    if (open.length) open[open.length - 1].classList.remove('is-open');
  });
})();
