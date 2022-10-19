require('module-alias')();
const { store, setupModels } = require('@store');
const { log } = require('@utils');
const { CartesianProduct } = require('js-combinatorics');
const ACL_DATA = require('./defaults.json');

const composer = (keys, combinations) => {
  let data = [];
  for (let item of combinations) {
    let o = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      o[key] = item[i];
    }
    data.push(o);
  }
  return data;
}

const transform = async (data) => {
  for (let i = 0; i < data.length; i++) {
    let doc = data[i];
    let keys = Object.keys(doc).filter(k => doc.hasOwnProperty(k));
    for await (let k of keys) {
      const v = doc[k];
      if (typeof v === 'object' && v.$lookup) {
        doc.$lookup = true;
        const { model, ...where } = v.$lookup;
        doc[k] = await store.read(model, { where, attributes: ['id'] });
        doc[k] = doc[k].map(item => item.id);
      }
    }
    if (doc.$lookup) {
      let seed = [];
      keys.forEach((k) => {
        const v = doc[k];
        if (Array.isArray(v)) {
          seed.push(v);
        } else {
          seed.push([v]);
        }
      });
      const combinations = new CartesianProduct(...seed);
      data[i] = composer(keys, combinations);
    }
  }
  return data;
};

const createErrorHandler = (model, e) => {
  if (e.code !== 'SQLITE_UNQ_ERROR') {
    throw e;
  }
};

const setupACL = async () => {
  const { roles, resources, roleperms } = ACL_DATA;
  const data = [
    { model: 'Role', data: roles },
    { model: 'ResourcePerm', data: resources },
    { model: 'RolePerm', data: roleperms }
  ];
  for await (let item of data) {
    const { model, data: input } = item;
    const data = await transform(input);
    const actions = data.map(async (record) => {
      if (Array.isArray(record)) {
        const subActions = record.map((doc) => {
          return store.create(model, { doc }).catch((e) => createErrorHandler(model, e));
        });
        return Promise.all(subActions);
      }
      return store.create(model, { doc: record }).catch((e) => createErrorHandler(model, e));
    });
    await Promise.all(actions).catch((e) => {
      log.error('Error while initializing acls', e);
    });
  }
};

module.exports = {
  setupACL
};

if (require.main === module) {
  setupModels({ sync: true }).then(() => {
    return setupACL()
  });
}
