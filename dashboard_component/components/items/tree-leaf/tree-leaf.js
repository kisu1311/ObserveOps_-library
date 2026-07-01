/* tree-leaf — favourite-star toggle + single-select leaf selection.
   Self-contained: one document-level click listener, bound once and guarded.
   • Clicking the star toggles its aria-pressed (favourite) without selecting the
     row. • Clicking elsewhere on a leaf selects it, clearing aria-selected from
     sibling leaves in the same tree / group. No monolith globals. */
(function () {
  if (window.__oo_tree_leaf) return;
  window.__oo_tree_leaf = true;

  document.addEventListener('click', function (e) {
    // 1) star favourite toggle — takes priority and never selects the row
    var star = e.target.closest('.oo-tree-leaf__star');
    if (star) {
      if (star.disabled || star.getAttribute('aria-disabled') === 'true') return;
      var fav = star.getAttribute('aria-pressed') !== 'true';
      star.setAttribute('aria-pressed', fav ? 'true' : 'false');
      star.classList.toggle('is-fav', fav);
      var label = star.getAttribute('aria-label');
      if (label) {
        star.setAttribute('aria-label',
          fav ? label.replace(/^Add /, 'Remove ').replace(/ to favourites$/, ' from favourites')
              : label.replace(/^Remove /, 'Add ').replace(/ from favourites$/, ' to favourites'));
      }
      return;
    }

    // 2) leaf single-select within its tree / group
    var leaf = e.target.closest('.oo-tree-leaf');
    if (!leaf) return;
    if (leaf.classList.contains('is-disabled') || leaf.getAttribute('aria-disabled') === 'true') return;

    var scope = leaf.closest('[role="tree"], [role="group"], .oo-tree-leaf-group') || leaf.parentNode;
    scope.querySelectorAll('.oo-tree-leaf').forEach(function (l) {
      var on = l === leaf;
      l.classList.toggle('is-active', on);
      l.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  });
})();
