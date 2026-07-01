/* insight-card · behaviour: self-dismiss
   The Add-as-widget / Investigate actions are host-driven; the only behaviour
   the card owns is dismissing itself. Document-level delegation, bound once and
   guarded. No monolith globals referenced. */
(function () {
  if (window.__oo_insight_card) return;
  window.__oo_insight_card = true;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-oo-dismiss]');
    if (!btn) return;
    var card = btn.closest('.oo-insight-card');
    if (!card) return;

    card.classList.add('is-dismissing');
    var remove = function () { card.remove(); };
    card.addEventListener('transitionend', remove, { once: true });
    // fallback in case no transition fires (reduced-motion / display:none host)
    setTimeout(remove, 300);
  });
})();
