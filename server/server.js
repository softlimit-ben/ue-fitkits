import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');

import setupTable from '../db/setupTable';
import getShop from '../db/getShop';
import insertShop from '../db/insertShop';

//initialize DB table if empty
setupTable().catch((err) => {
  console.error(err);
  process.exit(1);
});

import evaluateFitKits from './evaluateFitKits';

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES, HOST } = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],
      accessMode: 'offline',
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken } = ctx.session;

        // Add the token
        // console.log('SAVE TO JSON DB', shop, accessToken)

        insertShop(shop, accessToken).catch((err) => {
          console.error(err);
          process.exit(1);
        });

        const registration = await registerWebhook({
          address: `${HOST}/webhooks/orders/create`,
          topic: 'ORDERS_CREATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.July20
        });

        if (registration.success) {
          console.log('Successfully registered webhook!');
        } else {
          console.log('Failed to register webhook', registration.result);
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}`);
      },
    })
  );
  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET });

  router.post('/webhooks/orders/create', webhook, (ctx) => {
    let shop = getShop(ctx.state.webhook.domain);
    shop.then( shopData => {
      let accessToken = shopData.token;
      accessToken ? evaluateFitKits(ctx, accessToken, shopData): null;
    })
  });


  server.use(
    graphQLProxy({
      version: ApiVersion.July20,
    })
  );
  router.get("(.*)", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
