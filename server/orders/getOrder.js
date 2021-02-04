const query = `
  query order($id: ID!){
    order(id: $id) {
      lineItems(first:50) {
        edges {
          node {
            id
            quantity
            variant {
              id
            }
            product {
              productType
            }
          }
        }
      }
    }
  }
`;

const getOrder = async function(id, accessToken, shop){
  console.log('GETORDER',id);
  const response = await fetch(`https://${shop}/admin/api/2020-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({
      query,
      variables: {
        id
      }
    })
  });

  try {
    const responseJson = await response.json();
    return responseJson;
  } catch(err) {
    return err
  }
}

module.exports = getOrder;
