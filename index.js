const { createServer } = require('http');
require('module-alias')();
const { log } = require('@utils');
const app = require('@app');
const { PORT, SQLITE_SYNC } = require('@config');
const { setupModels } = require('@store');

const server = createServer(app);

let listener = null;

const addServerListners = () => {
    listener.on('listening', () => {
        log.info('Server listening on port - %d', PORT);
    });
    listener.on('error', (e) => {
        log.error('Error while listening to server', e);
    });
};

const initialize = () => {
    return setupModels({ sync: SQLITE_SYNC });
}

initialize().then(() => {
    listener = server.listen(PORT);
    addServerListners();
});

