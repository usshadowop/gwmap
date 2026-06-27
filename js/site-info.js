// Floating "contact" envelope in the bottom-right corner, shared across every
// page (this script loads on all of them). Built in JS so there's one source of
// truth rather than the same markup copied into each HTML shell.
const mailFab = document.createElement('a');
mailFab.className = 'mail-fab';
mailFab.href = 'mailto:jon@warhammerstores.com';
mailFab.setAttribute('aria-label', 'Email us');
mailFab.title = 'Email us';
mailFab.innerHTML =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<rect x="2" y="4" width="20" height="16" rx="2"></rect>' +
  '<path d="m2 6 10 7 10-7"></path></svg>';
document.body.appendChild(mailFab);

const siteInfoLink = document.getElementById('site-info-link');
const siteInfoModal = document.getElementById('site-info-modal');
const siteInfoClose = document.getElementById('site-info-close');

siteInfoLink.addEventListener('click', (e) => {
  e.preventDefault();
  siteInfoModal.hidden = false;
});

siteInfoClose.addEventListener('click', () => {
  siteInfoModal.hidden = true;
});

siteInfoModal.addEventListener('click', (e) => {
  if (e.target === siteInfoModal) {
    siteInfoModal.hidden = true;
  }
});
