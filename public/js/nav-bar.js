/* scripts for handling navbar related operations */

const mobileMenu = document.getElementsByClassName('mobile-menu')[0];

function toggleMobileMenu(data) {
  mobileMenu.classList.toggle('disabled');
}

const toggler = document.getElementById('mobile-menu-toggler');
toggler.addEventListener('click', toggleMobileMenu);