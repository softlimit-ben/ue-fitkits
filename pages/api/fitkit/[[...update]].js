import updateShopWithFitKit from '../../../db/updateShopWithFitKit';
import getShop from '../../../db/getShop';

export default (req, res) => {
  const { query: { update }, } = req;
  switch (req.method) {
    case 'GET':
      let domain = update[0] + '.myshopify.com';

      if(update.length == 1){
        //just getting the fitkit from shop DB value
        let shop = getShop(domain);
        shop.then( data => res.status(200).json(data.fitkit))
        .catch((err) => {
          console.error(err);
          process.exit(1);
        });
      } else {
        //updating the fitkit value in shop DB
        res.status(200).json(update);
        let result = updateShopWithFitKit(domain,update[1]);
      }

      break
    default:
      res.status(405).end() //Method Not Allowed
      break
  }
}
