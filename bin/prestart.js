// const m = require('module-alias');
import { addAliases } from 'module-alias';
import path from 'path';

const __dirname = path.resolve();
export const setupAlias = () => {
    addAliases({
        '@root': __dirname,
        '@app': __dirname + '/app',
        '@config': __dirname + '/config',
        '@store': __dirname + '../store',
        '@utils': __dirname + '../utils'
    });
};
