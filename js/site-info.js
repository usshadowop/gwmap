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
