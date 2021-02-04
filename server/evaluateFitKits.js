import getOrder from "./orders/getOrder";
import openOrder from "./orders/openOrder";
import updateFitKits from "./orders/updateFitKits";
import closeOrder from "./orders/closeOrder";

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

const FitKitsNotNeeded = () => {
  let err = new Error();
  err.name = 'FitKitsNotNeeded';
  return err;
};

const evaluateFitKits = function(ctx, accessToken){
    let webhook = ctx.state.webhook;
    let orderId = webhook.payload.admin_graphql_api_id;
    let shop = webhook.domain;

    const FITKIT_ID = db.get('shops')
      .find({ id: shop })
      .value().fitkit;

    //get original order to check FitKit quantity
    let order = getOrder(orderId, accessToken, shop);
    let needsFitKits = 0;
    order.then( res => {
      let monitorQty = 0;
      let fitKitExisting = 0;
      res.data.order.lineItems.edges.forEach( item => {
          let quantity = item.node.quantity;
          let type = item.node.product.productType;
          item.node.variant.id == FITKIT_ID ? fitKitExisting += quantity : null;
          type == 'Monitor' || type == 'Monitor-Hidden' ? monitorQty += quantity : null;
      })

      needsFitKits = monitorQty - fitKitExisting;

      //break if no fitkits needed
      if(needsFitKits == 0) throw FitKitsNotNeeded();
      return needsFitKits;
    })
    .then( count => {
      //open order so we can make changes and get calculatedOrder ID
      return openOrder(orderId, accessToken, shop);
    })
    .then( res => {
      //update calculated order with fitkits
      let calculatedOrder = res.data.orderEditBegin.calculatedOrder.id
      return updateFitKits({ id: calculatedOrder, quantity: needsFitKits, variantId: FITKIT_ID}, accessToken, shop);
    })
    .then( res => {
      //close order
      let updatedOrder = res.data.orderEditAddVariant.calculatedOrder.id;
      return closeOrder(updatedOrder, accessToken, shop);
    })
    .then( res => {
      return res;
    })
    .catch(function(error) {
        console.log('Caught!', error);
    });
}

module.exports = evaluateFitKits;
