import {DEFAULT_SETTINGS, validateSettings} from './generator.js';
export function cleanSettings(value) {
  try {
    validateSettings(value);
    return Object.fromEntries(Object.keys(DEFAULT_SETTINGS).map(key => [key, value[key]]));
  } catch { return {...DEFAULT_SETTINGS}; }
}
export async function loadSettings() {
  const {settings} = await chrome.storage.local.get('settings');
  return cleanSettings(settings);
}
export async function saveSettings(settings) {
  await chrome.storage.local.set({settings: cleanSettings(settings)});
}
