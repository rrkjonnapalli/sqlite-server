const { models } = require('./connection');
const { Op } = require('sequelize');

const opMap = {
  $in: Op.in,
  $eq: Op.eq,
  $gt: Op.gt,
  $gte: Op.gte,
  $lt: Op.lt,
  $lte: Op.lte,
  $not: Op.not,
  $nin: Op.notIn,
  $or: Op.or,
  $and: Op.and
};

const getKey = (k) => {
  if (opMap.hasOwnProperty(k)) {
    return opMap[k];
  }
  return k;
};

const listXform = (list, method) => {
  return list.map((item) => {
    if (Array.isArray(item)) {
      return listXform(item, method);
    } else if (item === null) {
      // ignore
    } else if (typeof item === 'object') {
      return method(item);
    } else {
      return item;
    }
  });
}

const whereXform = (o) => {
  let result = {};
  const keys = Object.keys(o).filter(k => o.hasOwnProperty(k));
  for (const k of keys) {
    const v = o[k];
    const key = getKey(k);
    let value = null;
    if (Array.isArray(v)) {
      value = listXform(v, whereXform);
    } else if (typeof v === null) {
      // ignore
    } else if (typeof v === 'object') {
      value = whereXform(v);
    } else {
      value = v;
    }
    result[key] = value;
  }
  return result;
};

const xform = (o, type) => {
  switch (type) {
    case 'where':
      return whereXform(o);
    case 'populate':
      return populateXform(o);
    case 'model':
      return models[o];
    default:
      return o;
  }
};

const populateXform = (o) => {
  let result = [];
  for (let item of o) {
    let e = {};
    const keys = ['model', 'as', 'where', 'populate', 'attributes'];
    for (let key of keys) {
      const v = item[key];
      if (v !== undefined) {
        e[key] = xform(v, key);
      }
    }
    result.push(e);
  }
  return result;
}

const create = async (model, opts) => {
  const Model = models[model];
  const { doc } = opts;
  try {
    const result = await Model.create(doc);
    return result;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const e = error.errors.pop();
      e.status = 400;
      e.code = 'SQLITE_UNQ_ERROR';
      throw e;
    }
    throw error;
  }
}

const getWhereAndInclude = (opts = {}) => {
  const { where = {}, populate = [] } = opts;
  return {
    where: whereXform(where),
    include: populateXform(populate)
  };
}

const read = (model, opts) => {
  const Model = models[model];
  const { where, include } = getWhereAndInclude(opts);
  const { attributes, findOne, raw = true } = opts || {};
  const method = findOne ? 'findOne' : 'findAll';
  const js = (o) => JSON.stringify(o, null, 2);
  return Model[method]({
    where,
    attributes,
    include,
    raw
  });
};

const update = async (model, opts) => {
  const Model = models[model];
  const { where, include } = getWhereAndInclude(opts);
  const { update } = opts || {};
  try {
    const result = await Model.update(update, {
      where,
      include
    });
    return result;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const e = error.errors.pop();
      e.status = 400;
      e.code = 'UNQ_ERROR';
      throw e;
    }
    throw error;
  }
}

const remove = (model, opts) => {
  const Model = models[model];
  const { where, include } = getWhereAndInclude(opts);
  return Model.destroy({ where, include });
};

const count = (model, opts) => {
  const Model = models[model];
  const { where, include } = getWhereAndInclude(opts);
  return Model.count({ where, include });
}

module.exports = {
  create,
  read,
  update,
  remove,
  count
}
