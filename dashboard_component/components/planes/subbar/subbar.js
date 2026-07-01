/* subbar · planes — self-contained behaviour for the dashboard sub-toolbar.
   Document-level click delegation, bound once and guarded. No monolith globals.
   - panel-toggle arrow flips its own aria-expanded (CSS rotates the chevron)
   - favourite star toggles aria-pressed (CSS recolours to --yellow)
   - range-pill clear (✕) removes the pill from the bar
   Each control lives inside an .oo-subbar root, keeping the partial isolated. */
(function () {
  if (window.__oo_subbar) return;
  window.__oo_subbar = true;

  document.addEventListener('click', function (e) {
    var arrow = e.target.closest('.oo-subbar__arrow');
    if (arrow && arrow.closest('.oo-subbar')) {
      var open = arrow.getAttribute('aria-expanded') === 'true';
      arrow.setAttribute('aria-expanded', String(!open));
      return;
    }

    var star = e.target.closest('.oo-subbar__star');
    if (star && star.closest('.oo-subbar')) {
      var on = star.getAttribute('aria-pressed') === 'true';
      star.setAttribute('aria-pressed', String(!on));
      star.classList.toggle('is-on', !on);
      return;
    }

    var clr = e.target.closest('.oo-subbar__clr');
    if (clr && clr.closest('.oo-subbar')) {
      var pill = clr.closest('.oo-subbar__pill');
      if (pill) pill.remove();
    }
  });
})();
