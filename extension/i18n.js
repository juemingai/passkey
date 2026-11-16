export function t(key, substitutions) {
  return chrome.i18n.getMessage(key, substitutions);
}
export function localizeDocument(root = document) {
  root.documentElement.lang = t('documentLanguage');
  root.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = t(element.dataset.i18n, element.dataset.i18nCount);
  });
  root.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
  });
}
