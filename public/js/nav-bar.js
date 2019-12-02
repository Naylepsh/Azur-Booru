/* scripts for handling navbar related operations */

const mobileMenu = document.getElementsByClassName('mobile-menu')[0];
const navBar = document.querySelector('nav');

function toggleMobileMenu(_) {
  mobileMenu.classList.toggle('enabled-menu-element');
  navBar.classList.toggle('extending-element');
}

const toggler = document.getElementById('mobile-menu-toggler');
toggler.addEventListener('click', toggleMobileMenu);