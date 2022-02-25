const query = `
  mutation fulfillmentOrderReleaseHold($id: ID!) {
    fulfillmentOrderReleaseHold(id: $id) {
      fulfillmentOrder {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const releaseHold = async function(id, accessToken, shop){
  console.log('RELEASE HOLD', id);
  const response = await fetch(`https://${shop}/admin/api/2022-01/graphql.json`, {
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

module.exports = releaseHold;
