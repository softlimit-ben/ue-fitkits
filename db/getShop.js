const db = require('./database');
const {sql} = require('@databases/pg');

const getShop = async function(domain){
  console.log('GETSHOP',domain);
  const users = await db.query(sql`
    SELECT * FROM users
    WHERE domain=${domain}
  `);
  if (users.length === 0) {
    return null;
  }
  return users[0];
}

module.exports = getShop;
