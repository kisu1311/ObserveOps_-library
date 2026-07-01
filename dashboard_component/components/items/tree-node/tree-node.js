/* tree-node · collapse / expand behaviour
   Clicking a category row toggles its node open: .is-open on the wrapper flips
   the children container's visibility and rotates the caret, while aria-expanded
   on the row button is kept in sync for assistive tech.
   Self-contained: document-level delegation bound once, no monolith globals.
   The row is a real <button>, so Enter/Space activate it natively.
   Consumers can listen for the bubbling 'oo-tree-node-toggle' event:
     node.addEventListener('oo-tree-node-toggle', e => loadKids(e.detail.open)); */
(function () {
  if (window.__oo_tree_node) return;
  window.__oo_tree_node = true;

  document.addEventListener('click', function (e) {
    var row = e.target.closest('.oo-tree-node__row');
    if (!row || row.disabled || row.classList.contains('is-disabled')) return;

    var node = row.closest('.oo-tree-node');
    if (!node) return;

    var open = !node.classList.contains('is-open');
    node.classList.toggle('is-open', open);
    row.setAttribute('aria-expanded', String(open));

    node.dispatchEvent(new CustomEvent('oo-tree-node-toggle', {
      bubbles: true,
      detail: { open: open, el: node }
    }));
  });
})();
