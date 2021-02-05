const { DATABASE_URL } = process.env;

const createConnectionPool = require('@databases/pg');

const db = createConnectionPool({
  connectionString: DATABASE_URL
});
module.exports = db;
