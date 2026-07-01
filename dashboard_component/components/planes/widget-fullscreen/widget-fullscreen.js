/* widget-fullscreen · planes — self-contained expand/collapse behaviour.
   Document-level delegation, bound once and guarded. No monolith globals.
   - [data-oo-wfs-open] expands the .oo-widget-fullscreen inside its stage
   - [data-oo-wfs-close] (the ✕ control) collapses its nearest modal
   - clicking the scrim itself (not the card) collapses it
   - Escape collapses the most recently opened modal
   Mirrors the live fullscreenWidget()/closeFullscreen() pair, isolated. */
(function () {
  if (window.__oo_widget_fullscreen) return;
  window.__oo_widget_fullscreen = true;

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-oo-wfs-open]');
    if (opener) {
      var scope = opener.closest('.oo-widget-fullscreen-stage') || document;
      var modal = scope.querySelector('.oo-widget-fullscreen');
      if (modal) modal.classList.add('is-open');
      return;
    }

    var closer = e.target.closest('[data-oo-wfs-close]');
    if (closer) {
      var owned = closer.closest('.oo-widget-fullscreen');
      if (owned) owned.classList.remove('is-open');
      return;
    }

    // backdrop click — only when the scrim element itself is the target
    if (e.target.classList && e.target.classList.contains('oo-widget-fullscreen')) {
      e.target.classList.remove('is-open');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelectorAll('.oo-widget-fullscreen.is-open');
    if (open.length) open[open.length - 1].classList.remove('is-open');
  });
})();
