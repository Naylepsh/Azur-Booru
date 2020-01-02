/* scripts for handling pagination related operations */

let nonActivePages = document.querySelectorAll('.non-active-page');

function togglePages(indexes) {
  const n = nonActivePages.length;
  const newIndexes = indexes.map( i => (i+n) % n );

  for (const i of newIndexes) {
    if (i > 0 && i <= n)
      nonActivePages[i].classList.toggle('hidden');
  }
}

let largeSize = window.matchMedia('(max-width: 1100px)');
let mediumSize = window.matchMedia('(max-width: 900px)');
const indexesToHideOnLarge = [1, -2];
const indexesToHideOnMedium = [2, -3];
if (mediumSize.matches) {
  togglePages(indexesToHideOnMedium);
}
if (largeSize.matches) {
  togglePages(indexesToHideOnLarge);
}

largeSize.addListener( _ => togglePages(indexesToHideOnLarge));
mediumSize.addListener(_ => togglePages(indexesToHideOnMedium));