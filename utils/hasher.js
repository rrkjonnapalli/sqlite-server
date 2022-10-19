const bcrypt = require('bcrypt');


const salt = bcrypt.genSaltSync(10);

module.exports = {
  hash: (pwd) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(pwd, salt, (e, h) => {
        if (e) {
          return reject(e);
        }
        return resolve(h);
      });
    });
  },
  compare: (pwd, hash) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(pwd, hash, (e, status) => {
        if (e) {
          return reject(e);
        }
        resolve(status);
      });
    });
  }
};
