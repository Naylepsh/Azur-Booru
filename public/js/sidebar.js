/* scripts for handling sidebar related operations */

const sections = document.querySelectorAll('.sidebar > section');

function collapseSidebarSubcontent() {
  for (const section of sections) {
    toggleSectionVisiblity(section);
  }
}

function toggleSectionVisiblity(section) {
  for (const elem of section.querySelector('ul').querySelectorAll('div')) {
    elem.classList.toggle('disabled');
  }
}

function makeSectionsClickable() {
  for (const section of sections) {
    const sectionHeader = section.getElementsByClassName('sidebar-section-name')[0];
    sectionHeader.addEventListener('click', () => toggleSectionVisiblity(section));
  }
}

collapseSidebarSubcontent();
makeSectionsClickable();
