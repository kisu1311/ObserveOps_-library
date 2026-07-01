/* noc-wallboard · behaviour (self-contained, no monolith globals)
   Two interactions, both via one guarded document-level click delegate:
     1. KPI severity filter  — clicking a [data-oo-noc-filter] counter single-selects
        a severity within its own wallboard and dims every tile that does not match
        (clicking the active one again clears the filter and un-dims all tiles).
     2. Ticker pause / play   — toggles .is-ticker-paused on the wallboard root, which
        CSS uses to pause the marquee and swap the button glyph.
   Each board is scoped via .closest('.oo-noc-wallboard') so multiple boards on a page
   never interfere. */
(function () {
  if (window.__oo_noc_wallboard) return;
  window.__oo_noc_wallboard = true;

  function applyFilter(board, severity) {
    board.querySelectorAll('.oo-noc-wallboard__tile[data-severity]').forEach(function (tile) {
      if (tile.classList.contains('is-disabled') || tile.disabled) return;
      var match = !severity || tile.getAttribute('data-severity') === severity;
      tile.classList.toggle('is-dimmed', !match);
    });
  }

  document.addEventListener('click', function (e) {
    var board = e.target.closest('.oo-noc-wallboard');
    if (!board) return;

    /* ── ticker pause / play ─────────────────────────────── */
    var pause = e.target.closest('.oo-noc-wallboard__ticker-pause');
    if (pause && board.contains(pause)) {
      var paused = board.classList.toggle('is-ticker-paused');
      pause.setAttribute('aria-pressed', String(paused));
      pause.setAttribute('aria-label', paused ? 'Resume alert ticker' : 'Pause alert ticker');
      return;
    }

    /* ── KPI severity filter ─────────────────────────────── */
    var kpi = e.target.closest('[data-oo-noc-filter]');
    if (kpi && board.contains(kpi) && !kpi.disabled) {
      var wasOn = kpi.getAttribute('aria-pressed') === 'true';
      board.querySelectorAll('[data-oo-noc-filter]').forEach(function (b) {
        b.setAttribute('aria-pressed', 'false');
      });
      if (wasOn) {
        applyFilter(board, null); // clicking the active filter clears it
      } else {
        kpi.setAttribute('aria-pressed', 'true');
        applyFilter(board, kpi.getAttribute('data-oo-noc-filter'));
      }
    }
  });
})();
