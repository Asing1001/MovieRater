import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';
import * as graphqlHTTP from 'express-graphql';
import * as React from 'react';
import { StaticRouter } from 'react-router-dom';
import * as swig from 'swig';
import * as favicon from 'serve-favicon';
import * as compression from 'compression';
import * as apicache from 'apicache';
import * as device from 'express-device';
import App from './app/components/app';
import cacheManager from './data/cacheManager';
import { systemSetting } from './configs/systemSetting';
import forceSSL from './helper/forceSSL';
import { db } from './data/db';
import { initScheduler } from './backgroundService/scheduler';
import schema from './data/schema';
import { renderToStringWithData, ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import { createLocalInterface } from 'apollo-local-query';
import * as graphql from 'graphql';
import * as redis from 'redis';

db.openDbConnection().then(cacheManager.init).then(initScheduler);

const app = express();
app.use(forceSSL());
app.use(compression());

app.get('/api/test', (req, res) => {
  res.send('test!');
});

app.get('/api/crawlerStatus', (req, res) => {
  db.getDocument({ name: "crawlerStatus" }, "configs").then(c => res.send(c));
});

app.get('/api/cache/index', (req, res) => {
  res.json(apicache.getIndex())
})

//static content
const staticRoot = path.join(__dirname, 'public/');
app.use('/public', express.static(staticRoot, { maxAge: '1d' }));
app.use('/service-worker.js', express.static(staticRoot + 'bundles/service-worker.js', { maxAge: '1d' }));
app.use(favicon(path.join(__dirname, 'public', 'favicons', 'favicon.ico')));


//request below will be cache
// app.use(device.capture());
const redisClient = redis.createClient(process.env.REDIS_URL).on("error", function (err) {
  console.log("Error " + err);
});
const basicCacheOption = { debug: true, enabled: systemSetting.isProduction || true, redisClient };
const basicCache = apicache.options(basicCacheOption).middleware('1 hour');
const graphqlCache = apicache.newInstance({ ...basicCacheOption, appendKey: ["cacheKey"] }).middleware('1 hour');
app.use(bodyParser.json());
app.use('/graphql', (req, res, next) => {
  req['cacheKey'] = req.body.operationName + (req.body.variables ? req.body.variables[Object.keys(req.body.variables)[0]] : '');
  next();
})
app.use('/graphql', graphqlCache, graphqlHTTP({ schema: schema, pretty: systemSetting.enableGraphiql, graphiql: systemSetting.enableGraphiql, }))

app.use(basicCache, function (req, res) {
  global.navigator = { userAgent: req.headers['user-agent'] };

  const client = new ApolloClient({
    ssrMode: true,
    networkInterface: createLocalInterface(graphql, schema),
  });

  const context = {
    //device : req["device"].type
  }

  const app = (
    <ApolloProvider client={client}>
      <StaticRouter
        location={req.url}
        context={context}
      >
        <App />
      </StaticRouter>
    </ApolloProvider>
  );

  renderToStringWithData(app).then(content => {
    const initialState = { apollo: client.getInitialState() };
    const page = swig.renderFile(staticRoot + 'bundles/index.html',
      {
        html: content,
        apolloState: `<script>window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(/</g, '\\u003c')};</script>`
      });
    res.status(200).send(page);
  });
});


let port = process.env.PORT || 3003;
app.listen(port, function () {
  console.log('app running on port', port);
});