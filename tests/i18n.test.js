import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {t, localizeDocument} from '../extension/i18n.js';
const read = async path => readFile(new URL('../extension/' + path, import.meta.url), 'utf8');
const en = JSON.parse(await read('_locales/en/messages.json'));
const zh = JSON.parse(await read('_locales/zh_CN/messages.json'));
const html = await read('popup.html');
const script = await read('popup.js');
function mockI18n(locale) {
  const messages = locale === 'zh-CN' ? zh : en;
  globalThis.chrome = {i18n: {getMessage(key, value) {return messages[key]?.message.replace('$1', value ?? '') ?? '';}}};
}
test('各语言词条完整，动态消息及静态标签均有翻译', () => {
  assert.deepEqual(Object.keys(zh).sort(), Object.keys(en).sort());
  const keys = [...html.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g), ...script.matchAll(/t\('([^']+)'/g)].map(match => match[1]);
  keys.push('invalidLength', 'invalidTypes', 'noTypes');
  for (const key of keys) {
    assert.ok(en[key]?.message, `Missing English: ${key}`);
    assert.ok(zh[key]?.message, `Missing Chinese: ${key}`);
  }
  assert.doesNotMatch(html + script, /[\u4e00-\u9fff]/);
});
test('Manifest 声明英文回退且名称和描述可本地化', async () => {
  const manifest = JSON.parse(await read('manifest.json'));
  assert.equal(manifest.default_locale, 'en');
  for (const value of [manifest.name, manifest.description, manifest.action.default_title]) {
    const key = value.match(/^__MSG_(.+)__$/)?.[1];
    assert.ok(en[key]);
    assert.ok(zh[key]);
  }
});
for (const locale of ['en', 'zh-CN', 'fr']) {
  test(`消息和 DOM 本地化：${locale}`, () => {
    mockI18n(locale);
    const isChinese = locale === 'zh-CN';
    assert.equal(t('characterCount', '48'), isChinese ? '48 位字符' : '48 characters');
    const element = {dataset: {i18n: 'password'}};
    const count = {dataset: {i18n: 'characterCount', i18nCount: '4'}};
    const aria = {dataset: {i18nAriaLabel: 'result'}, setAttribute(name, value) {this[name] = value;}};
    const root = {documentElement: {}, querySelectorAll(selector) {return selector === '[data-i18n]' ? [element, count] : [aria];}};
    localizeDocument(root);
    assert.equal(root.documentElement.lang, isChinese ? 'zh-CN' : 'en');
    assert.equal(element.textContent, isChinese ? '密码' : 'Password');
    assert.equal(count.textContent, isChinese ? '4 位字符' : '4 characters');
    assert.equal(aria['aria-label'], isChinese ? '生成结果' : 'Generated result');
    delete globalThis.chrome;
  });
}
test('刷新按钮只放大图标，不放大本地化文字', async () => {
  const css = await read('popup.css');
  assert.doesNotMatch(css, /\.secondary span\s*\{/);
  assert.match(css, /\.secondary span\[aria-hidden\]\s*\{[^}]*font-size:\d+px/);
  assert.match(html, /id="refresh"[^>]*><span aria-hidden="true">↻<\/span> <span data-i18n="refresh">/);
});
test('长度输入框两侧提供可本地化的加减按钮', () => {
  for (const [id, key] of [['length-down', 'decreaseLength'], ['length-up', 'increaseLength']]) {
    assert.match(html, new RegExp(`id="${id}"[^>]*aria-controls="length"[^>]*data-i18n-aria-label="${key}"`));
  }
  assert.match(html, /id="length-down"[^>]*>−<\/button><input id="length"[^>]*><button type="button" id="length-up"/);
});
