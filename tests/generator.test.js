import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARSETS, DEFAULT_SETTINGS, ValidationError, generatePassword, generateApiKey} from '../extension/generator.js';
import {cleanSettings, loadSettings, saveSettings} from '../extension/settings.js';
const keys = Object.keys(CHARSETS);
for (let mask = 1; mask < 16; mask++) {
  test(`字符组合 ${mask}：长度、覆盖及字符范围`, () => {
    const flags = Object.fromEntries(keys.map((key, i) => [key, Boolean(mask & (1 << i))]));
    const groups = keys.filter(key => flags[key]).map(key => CHARSETS[key]);
    for (const length of [4, 16, 128]) {
      const result = generatePassword({length, ...flags});
      assert.equal(result.length, length);
      assert.ok([...result].every(char => groups.join('').includes(char)));
      for (const group of groups) assert.ok([...result].some(char => group.includes(char)));
    }
  });
}
test('默认设置和 API Key 格式', () => {
  assert.equal(generatePassword().length, 16);
  assert.match(generateApiKey(), /^sk-[A-Za-z0-9]{48}$/);
});
test('拒绝无效长度和字符开关', () => {
  for (const length of [0, 3, 129, 4.5, NaN, Infinity, '16', null]) {
    assert.throws(() => generatePassword({...DEFAULT_SETTINGS, length}), ValidationError);
  }
  assert.throws(() => generatePassword({length: 16, uppercase: false, lowercase: false, digits: false, symbols: false}), ValidationError);
  assert.throws(() => generatePassword({...DEFAULT_SETTINGS, digits: 'true'}), ValidationError);
});
test('索引采样丢弃超出完整桶的字节', () => {
  let calls = 0;
  const result = generateApiKey(bytes => { bytes.fill(calls++ === 0 ? 255 : 61); });
  assert.equal(calls, 2);
  assert.equal(result, 'sk-' + '9'.repeat(48));
});
test('整串重新采样以满足全部字符类型', () => {
  let calls = 0;
  const result = generatePassword({length: 4, uppercase: true, lowercase: true, digits: true, symbols: true}, bytes => {
    bytes.fill(0);
    if (calls++ > 0) bytes.set([0, 26, 52, 62]);
  });
  assert.equal(result, 'Aa0!');
  assert.equal(calls, 2);
});
test('损坏设置恢复默认，合法设置仅保留偏好字段', () => {
  for (const value of [undefined, null, {}, {length: 999}]) assert.deepEqual(cleanSettings(value), DEFAULT_SETTINGS);
  const clean = cleanSettings({...DEFAULT_SETTINGS, length: 28, password: 'secret', apiKey: 'secret'});
  assert.deepEqual(clean, {...DEFAULT_SETTINGS, length: 28});
});
test('存储适配器只读写设置并传递存储失败', async () => {
  let written;
  globalThis.chrome = {storage: {local: {
    get: async () => ({settings: {...DEFAULT_SETTINGS, length: 32}}),
    set: async value => { written = value; },
  }}};
  assert.equal((await loadSettings()).length, 32);
  await saveSettings({...DEFAULT_SETTINGS, password: 'secret'});
  assert.deepEqual(written, {settings: DEFAULT_SETTINGS});
  chrome.storage.local.get = async () => { throw new Error('unavailable'); };
  await assert.rejects(loadSettings(), /unavailable/);
  delete globalThis.chrome;
});
