if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); } // eslint-disable-line global-require
process.env.TZ = 'UCT';

const {
  MAX_CONNECTIONS,
  // APP_PORT,
  API_PORT,
  DATASYNC_API_PORT,
  SECRET,
} = process.env;

// Db Connection POOLS
const initPool = require('./lib/pg/initPool');

const pool = initPool(MAX_CONNECTIONS);

// API
const api = require('./api')({ pool, appSecret: SECRET });

api.set('port', API_PORT || 8081);

const apiServer = api.listen(api.get('port'), () => {
  console.log(`API running on → http://localhost:${apiServer.address().port}`);
});

// datasync
const datasync = require('./datasync')({ pool, appSecret: SECRET });

datasync.set('port', DATASYNC_API_PORT || 8082);

const datasyncServer = datasync.listen(datasync.get('port'), () => {
  console.log(`DATASYNC running on → http://localhost:${datasyncServer.address().port}`);
});
