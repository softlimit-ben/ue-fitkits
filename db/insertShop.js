const db = require('./database');
const {sql} = require('@databases/pg');
import getShop from './getShop';

const insertShop = async function(domain, token){
  console.log('INSERT/UPDATE SHOP', domain, token);
  //fitkit isn't ready yet, has to be added in dashboard
  let fitkit = '';

  //check if SHOP exists ie, a re-install and update
  let shopExists = getShop(domain);
  // console.log(shopExists);
  shopExists.then( async res => {
    if(res){
      //update
      await db.query(sql`
        UPDATE users
        SET token=${token}
        WHERE domain=${domain}
      `);
    } else {
      //insert
      await db.query(sql`
        INSERT INTO users (domain, token, fitkit)
        VALUES (${domain}, ${token}, ${fitkit})
      `);
    }
  })
}

module.exports = insertShop;
