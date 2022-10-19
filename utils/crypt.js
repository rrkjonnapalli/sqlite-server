const crypto = require('node:crypto')
const { JWT_PL_SECRET, JWT_SALT, JWT_SECRET } = require('@config');
const IV_LENGTH = 16;

const CIPHER_KEY = crypto.pbkdf2Sync(JWT_PL_SECRET, JWT_SALT, 65536, 16, 'sha1');

const encrypt = (data) => {
  const payload = JSON.stringify(data);
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-128-cbc', CIPHER_KEY, iv);
  let encrypted = cipher.update(payload);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return Buffer.concat([iv, encrypted]).toString('base64');
};

const decrypt = (data) => {
  let buff = Buffer.from(data, 'base64');
  let iv = buff.subarray(0, IV_LENGTH);
  let encryptedText = buff.subarray(IV_LENGTH, buff.length);
  let decipher = crypto.createDecipheriv('aes-128-cbc', CIPHER_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  const payload = Buffer.concat([decrypted, decipher.final()]).toString();
  return JSON.parse(payload);
};


module.exports = {
  encrypt,
  decrypt
}
