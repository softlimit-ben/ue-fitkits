const query = `
  mutation commitEdit($id: ID!) {
    orderEditCommit(id: $id, notifyCustomer: false, staffNote: "FitKits Added") {
      order {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const closeOrder = async function(id, accessToken, shop){
  console.log('CLOSEORDER', id);
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

module.exports = closeOrder;
