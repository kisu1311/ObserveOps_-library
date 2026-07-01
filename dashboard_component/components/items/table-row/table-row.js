/* table-row · selectable rows — single-select within each table.
   Self-contained, document-level delegation, bound once. No monolith globals. */
(function () {
  if (window.__oo_table_row) return;
  window.__oo_table_row = true;

  function isDisabled(row) {
    return row.getAttribute('aria-disabled') === 'true' ||
           row.classList.contains('is-disabled');
  }

  function select(row) {
    if (isDisabled(row)) return;
    var table = row.closest('.oo-table-row');
    if (!table) return;
    // single-select: clear siblings within the owning table
    table.querySelectorAll('.oo-table-row__row--clickable[aria-selected="true"]')
      .forEach(function (r) { if (r !== row) r.setAttribute('aria-selected', 'false'); });
    var on = row.getAttribute('aria-selected') === 'true';
    row.setAttribute('aria-selected', on ? 'false' : 'true');
  }

  document.addEventListener('click', function (e) {
    var row = e.target.closest('.oo-table-row__row--clickable');
    if (row) select(row);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    var row = e.target.closest && e.target.closest('.oo-table-row__row--clickable');
    if (!row) return;
    e.preventDefault();
    select(row);
  });
})();
