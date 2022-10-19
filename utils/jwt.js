if (require.main === module) {
  require('module-alias')();
}
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('@config');
const { encrypt, decrypt } = require('./crypt');

const sign = (payload, opts = {}) => {
  const expiresAt = Date.now() + (isNaN(opts.expiresIn) ? 60000 : (opts.expiresIn * 60 * 1000));
  const token = jwt.sign({
    sub: payload,
    exp: expiresAt
  }, JWT_SECRET);
  return token;
};

const decode = (...args) => {
  return jwt.decode(...args);
};

const verify = (...args) => {
  return jwt.verify(...args);
};

const encryptAndSign = (user, opts) => {
  const payload = encrypt(user);
  return sign(payload, opts);
};

const verifyAndDecrypt = (token) => {
  return new Promise((resolve, reject) => {
    verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        return reject(err);
      }
      try {
        const data = decrypt(payload.sub);
        resolve(data);
      } catch (error) {
        return reject(error);
      }
    });
  });
}


module.exports = {
  sign,
  decode,
  verify,
  encryptAndSign,
  verifyAndDecrypt
};

