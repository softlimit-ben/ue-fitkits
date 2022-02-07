const query = `
  mutation orderEditAddVariant($id: ID!, $variantId: ID!, $quantity: Int!) {
    orderEditAddVariant(id: $id, variantId: $variantId, quantity: $quantity) {
      calculatedLineItem {
        id
      }
      calculatedOrder {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const updateFitKits = async (ctx, accessToken, shop) => {
  const id = ctx.id;
  const variantId = ctx.variantId;
  const quantity = ctx.quantity;
  console.log('ADDFITKITS', id, variantId, quantity);
  const response = await fetch(`https://${shop}/admin/api/2022-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({
      query,
      variables: {
        id,
        variantId,
        quantity
      }
    })
  })

  const responseJson = await response.json();
  return responseJson;
};

module.exports = updateFitKits;
