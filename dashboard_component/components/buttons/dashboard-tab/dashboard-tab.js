/* dashboard-tab · selection behaviour
   Single-select segmented tablist: clicking (or arrow-keying onto) a segment
   selects it and deselects its siblings within the SAME group, updating both
   .is-active and aria-selected plus a roving tabindex.
   Self-contained: document-level delegation bound once, no monolith globals.
   Consumers listen for the bubbling 'oo-dashboard-tab-change' event to swap
   their own view:  group.addEventListener('oo-dashboard-tab-change',
                      e => showView(e.detail.tab));  // e.detail.tab = data-tab */
(function () {
  if (window.__oo_dashboard_tab) return;
  window.__oo_dashboard_tab = true;

  function select(opt) {
    var group = opt.closest('.oo-dashboard-tab');
    if (!group) return;
    var opts = group.querySelectorAll('.oo-dashboard-tab__opt');
    for (var i = 0; i < opts.length; i++) {
      var active = opts[i] === opt;
      opts[i].classList.toggle('is-active', active);
      opts[i].setAttribute('aria-selected', String(active));
      opts[i].setAttribute('tabindex', active ? '0' : '-1');
    }
    group.dispatchEvent(new CustomEvent('oo-dashboard-tab-change', {
      bubbles: true,
      detail: { tab: opt.getAttribute('data-tab'), el: opt }
    }));
  }

  function disabled(opt) {
    return opt.disabled || opt.classList.contains('is-disabled');
  }

  document.addEventListener('click', function (e) {
    var opt = e.target.closest('.oo-dashboard-tab__opt');
    if (!opt || disabled(opt)) return;
    if (opt.getAttribute('aria-selected') !== 'true') select(opt);
  });

  /* roving arrow-key navigation within a tablist */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var opt = e.target.closest('.oo-dashboard-tab__opt');
    if (!opt) return;
    var group = opt.closest('.oo-dashboard-tab');
    if (!group) return;
    var opts = Array.prototype.filter.call(
      group.querySelectorAll('.oo-dashboard-tab__opt'),
      function (o) { return !disabled(o); }
    );
    var i = opts.indexOf(opt);
    if (i === -1) return;
    e.preventDefault();
    var step = e.key === 'ArrowRight' ? 1 : -1;
    var next = opts[(i + step + opts.length) % opts.length];
    next.focus();
    select(next);
  });
})();
