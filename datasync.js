const express = require('express');
const bodyParser = require('body-parser');

const initRoutes = require('./datasync/v1/routes');

module.exports = (dependencies) => {
  const routes = initRoutes(dependencies);

  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use('/v1', routes);

  return app;
};
