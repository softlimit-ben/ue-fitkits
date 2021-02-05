import updateShopWithFitKit from '../../../db/updateShopWithFitKit';
import getShop from '../../../db/getShop';

export default async function(req, res) {
  const { query: { update }, } = req;
  return new Promise((resolve, reject) => {
    let domain = update[0] + '.myshopify.com';
    if(update.length == 1){
      //just getting the fitkit from shop DB value
      getShop(domain).then(response => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'max-age=180000');
        // console.log(response.fitkit);
        res.end(JSON.stringify(response.fitkit))
        resolve();
      })
      .catch(error => {
        res.json(error);
        res.status(405).end();
        return resolve(); //in case something goes wrong in the catch block
      });
    } else {
      //updating the fitkit value in shop DB
      res.status(200).json(update);
      let result = updateShopWithFitKit(domain,update[1]);
    }
  });
};
