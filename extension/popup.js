import {DEFAULT_SETTINGS, generatePassword, generateApiKey, validateSettings} from './generator.js';
import {loadSettings, saveSettings} from './settings.js';
const $ = id => document.getElementById(id);
const checkboxes = [...document.querySelectorAll('input[type=checkbox]')];
const tabs = [...document.querySelectorAll('[role=tab]')];
let mode = 'password';
let ready = false;
let feedbackTimer;
let lastMessage = '';
let saveQueue = Promise.resolve();
function settings() {
  return {length: $('length').valueAsNumber, ...Object.fromEntries(checkboxes.map(input => [input.name, input.checked]))};
}
function clearFeedback() { clearTimeout(feedbackTimer); $('feedback').textContent = ''; }
function report(message, failed = false) {
  clearFeedback();
  if (message === lastMessage) message += '\u00a0';
  lastMessage = message;
  $('feedback').dataset.error = String(failed);
  $('feedback').textContent = message;
  feedbackTimer = setTimeout(clearFeedback, 2500);
}
function generate() {
  clearFeedback();
  $('length-error').textContent = '';
  $('length').removeAttribute('aria-invalid');
  $('result').textContent = '';
  $('copy').disabled = $('refresh').disabled = true;
  if (!ready) return;
  try {
    const options = settings();
    if (mode === 'password') validateSettings(options);
    $('result').textContent = mode === 'password' ? generatePassword(options) : generateApiKey();
    $('result-meta').textContent = `${mode === 'password' ? options.length : 51} 位字符`;
    $('copy').disabled = $('refresh').disabled = false;
  } catch (error) {
    $('result-meta').textContent = '等待有效设置';
    if (mode === 'password') {
      $('length-error').textContent = error.message;
      $('length').setAttribute('aria-invalid', 'true');
    } else report('生成失败，请重新打开插件。', true);
  }
}
function changed() {
  generate();
  try {
    const snapshot = {...validateSettings(settings())};
    $('length-range').value = snapshot.length;
    saveQueue = saveQueue.then(() => saveSettings(snapshot)).then(() => {
      $('storage-note').textContent = '';
    }).catch(() => { $('storage-note').textContent = '设置无法保存，本次仍可正常生成。'; });
  } catch { /* Invalid input is shown inline and never persisted. */ }
}
$('length').addEventListener('input', changed);
$('length-range').addEventListener('input', () => { $('length').value = $('length-range').value; changed(); });
checkboxes.forEach(input => input.addEventListener('change', () => {
  if (!checkboxes.some(item => item.checked)) {
    input.checked = true;
    $('selection-note').textContent = '请至少保留一种字符类型。';
    return;
  }
  $('selection-note').textContent = '每种已选字符都会至少出现一次。';
  changed();
}));
function selectTab(tab) {
  mode = tab.dataset.mode;
  tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
  $('password-panel').hidden = mode !== 'password';
  $('api-panel').hidden = mode !== 'api';
  $('result-label').textContent = mode === 'password' ? '你的新密码' : '你的新 API Key';
  $('copy').textContent = mode === 'password' ? '复制密码' : '复制 API Key';
  generate();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = tabs[1 - index];
    if (event.key === 'Home') next = tabs[0];
    if (event.key === 'End') next = tabs.at(-1);
    if (next) { event.preventDefault(); next.focus(); selectTab(next); }
  });
});
$('refresh').addEventListener('click', generate);
async function copy() {
  const text = $('result').textContent;
  if (!text || $('copy').disabled) return;
  try { await navigator.clipboard.writeText(text); report('已复制到剪贴板'); }
  catch { report('复制失败，请选中结果手动复制。', true); }
}
if ('CommandEvent' in window) {
  document.addEventListener('command', event => { if (event.command === '--copy' && event.target === $('result')) copy(); }, true);
} else $('copy').addEventListener('click', copy);
async function init() {
  let saved = {...DEFAULT_SETTINGS};
  try { saved = await loadSettings(); }
  catch { $('storage-note').textContent = '无法读取设置，已使用默认值；设置可能无法保存。'; }
  $('length').value = $('length-range').value = saved.length;
  checkboxes.forEach(input => { input.checked = saved[input.name]; });
  ready = true;
  generate();
}
init();
