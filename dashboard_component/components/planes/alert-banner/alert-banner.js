/* alert-banner · dismiss behaviour
   Document-level delegation, bound once. Clicking the dismiss button collapses
   the banner (CSS .is-dismissing transition) then hides it. Self-contained:
   no monolith globals, no element ids. */
(function () {
  if (window.__oo_alert_banner) return;
  window.__oo_alert_banner = true;

  document.addEventListener('click', function (e) {
    var x = e.target.closest('.oo-alert-banner__x');
    if (!x || x.disabled) return;
    var banner = x.closest('.oo-alert-banner');
    if (!banner) return;

    banner.classList.add('is-dismissing');
    var done = function () { banner.hidden = true; };
    banner.addEventListener('transitionend', done, { once: true });
    // fallback if no transition fires
    setTimeout(done, 250);
  });
})();
