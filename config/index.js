const SQLITE_DB_PATH = process.env.SQLITE_DB_PATH || '/home/rjonnapalli/non-work/demo-poc/universal-poc/server/data/db.db'
const PORT = process.env.PORT || 3090;
const SQLITE_SYNC = process.env.SQLITE_SYNC === 'true';
const JWT_PL_SECRET = process.env.JWT_PL_SECRET || 'myplsecret';
const JWT_SALT = process.env.JWT_SALT || 'myjwtsalt';
const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';
const SQLITE_LOG = process.env.SQLITE_LOG || false;

module.exports = {
    SQLITE_DB_PATH,
    PORT,
    SQLITE_SYNC,
    SQLITE_LOG,
    JWT_PL_SECRET,
    JWT_SALT,
    JWT_SECRET
};
