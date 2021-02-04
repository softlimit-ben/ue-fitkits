const db = require('./database');
const {sql} = require('@databases/pg');

const updateShopWithFitKit = async function(domain, fitkit){
  return await db.query(sql`
    UPDATE users
    SET fitkit=${fitkit}
    WHERE domain=${domain}
  `);
}

module.exports = updateShopWithFitKit;
