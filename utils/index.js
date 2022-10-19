const hasher = require('./hasher');
const log = console;

module.exports = {
    log,
    hasher,
    crypt: require('./crypt'),
    jwt: require('./jwt')
};
