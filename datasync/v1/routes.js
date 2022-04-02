const express = require('express');
const { catchError } = require('./handlers/errorHandler');
const initTrackingHandler = require('./handlers/trackingHandler');

const initDatasyncController = require('./controllers/datasyncController');

module.exports = ({ pool, appSecret }) => {
  const router = express.Router();
  const track = initTrackingHandler();

  const {
    subscription,
  } = initDatasyncController({ pool, appSecret });

  router.post(
    '/subscription',
    catchError(track(subscription, 'post_subscription')),
  );

  router.get(
    '/subscription',
    catchError(track(subscription, 'get_subscription')),
  );

  return router;
};
