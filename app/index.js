const { log } = require('@utils');
const express = require('express');
const api = require('./api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use((req, res, next) => {
  const e = new Error('Method not allowed');
  e.status = 405;
  next(e);
});

app.use((err, req, res, next) => {
  log.error(err);
  const status = err.status || 500;
  res.status(status).send({
    error: true,
    message: err.message,
    cause: err.cause
  });
});

module.exports = app;
