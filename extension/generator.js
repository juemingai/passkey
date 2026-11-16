export const CHARSETS = Object.freeze({
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?',
});
export const DEFAULT_SETTINGS = Object.freeze({length: 16, uppercase: true, lowercase: true, digits: true, symbols: true});
export class ValidationError extends Error {
  constructor(code) { super(code); this.code = code; }
}
export function validateSettings(settings) {
  if (!settings || !Number.isInteger(settings.length) || settings.length < 4 || settings.length > 128) {
    throw new ValidationError('invalidLength');
  }
  if (Object.keys(CHARSETS).some(key => typeof settings[key] !== 'boolean')) throw new ValidationError('invalidTypes');
  if (!Object.keys(CHARSETS).some(key => settings[key])) throw new ValidationError('noTypes');
  return settings;
}
// Reject the incomplete final bucket instead of introducing modulo bias.
function randomString(length, alphabet, random) {
  const limit = 256 - (256 % alphabet.length);
  let result = '';
  const bytes = new Uint8Array(Math.max(32, length * 2));
  while (result.length < length) {
    random(bytes);
    for (const byte of bytes) {
      if (byte < limit) result += alphabet[byte % alphabet.length];
      if (result.length === length) break;
    }
  }
  return result;
}
const secureRandom = bytes => globalThis.crypto.getRandomValues(bytes);
export function generatePassword(settings = DEFAULT_SETTINGS, random = secureRandom) {
  validateSettings(settings);
  const groups = Object.entries(CHARSETS).filter(([key]) => settings[key]).map(([, value]) => value);
  let result;
  do { result = randomString(settings.length, groups.join(''), random); }
  while (!groups.every(group => [...result].some(char => group.includes(char))));
  return result;
}
export function generateApiKey(random = secureRandom) {
  return 'sk-' + randomString(48, CHARSETS.uppercase + CHARSETS.lowercase + CHARSETS.digits, random);
}
