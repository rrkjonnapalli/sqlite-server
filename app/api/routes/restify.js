const { Router } = require('express');
const { log } = require('@utils');
const router = Router({ mergeParams: true });

const { definitions, store } = require('@store');

for (let definition of definitions) {
  const { modelName, options } = definition;
  const { tableName } = options;
  const modelRouter = Router({ mergeParams: true });

  log.debug(`Setting up model routes for model ${modelName}`);

  modelRouter.route('/count').get(async (req, res, next) => {
    const { where: query = '{}' } = req.query;
    try {
      const where = JSON.parse(query);
      const count = await store.count(modelName, { where });
      log.debug('COUNT', count);
      res.send({ count });
    } catch (error) {
      next(error);
    }
  });

  modelRouter.route('/:id').all((req, res, next) => {
    const { id: ID } = req.params;
    const id = Number(ID);
    if (isNaN(id)) {
      const e = new Error('Invalid id parameter');
      e.status = 400;
      return next(e);
    }
    return next();
  }).get(async (req, res, next) => {
    const { id: ID } = req.params;
    try {
      const id = Number(ID);
      if (isNaN(id)) {
        return next();
      }
      const record = await store.read(modelName, { where: { id }, findOne: true });
      log.debug('GET /:id', record);
      if (!record) {
        const e = new Error(`${modelName} record not found`);
        e.status = 404;
        return next(e);
      }
      res.send(record);
    } catch (error) {
      next(error);
    }
  }).patch(async (req, res, next) => {
    const { id: ID } = req.params;
    const update = req.body;
    const id = Number(ID);
    try {
      const result = await store.update(modelName, {
        update,
        where: { id }
      });
      log.debug('PATCH /:id', result);
      const updated = Array.isArray(result) ? result.pop() : result;
      if (updated === 0) {
        const e = new Error(`${modelName} record not updated`);
        e.status = 404;
        return next(e);
      }
      res.send({ updated });
    } catch (error) {
      next(error);
    }
  }).delete(async (req, res, next) => {
    const { id: ID } = req.params;
    const id = Number(ID);
    try {
      const result = await store.remove(modelName, {
        where: { id }
      });
      log.debug('DELETE /:id', result);
      if (result === 0) {
        const e = new Error(`${modelName} record not found`);
        e.status = 404;
        return next(e);
      }
      res.send({ deleted: result });
    } catch (error) {
      next(error);
    }
  });

  modelRouter.route('/').post(async (req, res, next) => {
    const data = req.body;
    try {
      const result = await store.create(modelName, { doc: data });
      log.debug('POST', result);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }).get(async (req, res, next) => {
    const { where: query = '{}' } = req.query;
    try {
      const where = JSON.parse(query);
      const data = await store.read(modelName, { where });
      res.send(data);
    } catch (error) {
      next(error);
    }
  });

  router.use(`/${tableName}`, modelRouter);
}

module.exports = router;
