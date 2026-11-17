(() => {
  const params = new URLSearchParams(location.search);
  const lang = params.get('lang') || 'en';
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `_locales/${lang}/messages.json`, false);
  xhr.send();
  const messages = JSON.parse(xhr.responseText);
  window.chrome = {
    i18n: {getMessage: (key, value) => (messages[key]?.message ?? '').replace('$1', value ?? '')},
    storage: {local: {get: async () => ({}), set: async () => {}}}
  };
  if (params.get('mode') === 'api') addEventListener('load', () => setTimeout(() => document.getElementById('api-tab').click(), 50));
})();
