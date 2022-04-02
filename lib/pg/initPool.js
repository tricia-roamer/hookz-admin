const { Pool } = require('pg');

const { DATABASE_URL } = process.env;

module.exports = max => new Pool({
  max: parseInt(max, 10),
  connectionString: DATABASE_URL,
});
