document.documentElement.lang = chrome.i18n.getUILanguage();
document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = chrome.i18n.getMessage(el.dataset.i18n); });
document.getElementById('open').onclick = () =>
  chrome.tabs.create({ url: 'chrome://settings/content/autoPictureInPicture' }).catch(() => chrome.tabs.create({ url: 'chrome://settings/content' }));
