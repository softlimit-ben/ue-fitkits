const {sql} = require('@databases/pg');
const db = require('./database');

const setupTable = async function() {
  await db.query(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL NOT NULL PRIMARY KEY,
      fitkit TEXT NOT NULL,
      token TEXT NOT NULL,
      domain TEXT NOT NULL,
      UNIQUE(domain)
    )
  `);

  // await db.dispose();
}

module.exports = setupTable;
