const { PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT } = process.env;

const createConnectionPool = require('@databases/pg');

const db = createConnectionPool({
  connectionString: false,
  user: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  port: PGPORT,
  database: PGDATABASE
});
module.exports = db;
