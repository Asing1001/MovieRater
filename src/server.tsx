import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';
import * as graphqlHTTP from 'express-graphql';
import * as React from 'react';
import { StaticRouter } from 'react-router-dom';
import * as swig from 'swig';
import * as favicon from 'serve-favicon';
// import * as compression from 'compression';
import * as apicache from 'apicache';
import * as device from 'express-device';
import App from './app/components/app';
import cacheManager from './data/cacheManager';
import { systemSetting } from './configs/systemSetting';
import { db } from './data/db';
import { initScheduler } from './backgroundService/scheduler';
import schema from './data/schema';
import { renderToStringWithData, ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import { createLocalInterface } from 'apollo-local-query';
import * as graphql from 'graphql';
import * as redis from 'redis';

db.openDbConnection().then(cacheManager.init).then(initScheduler);

const app = express();
// app.use(compression());

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
app.use('/public', express.static(staticRoot, { maxAge: '7d' }));
app.use('/service-worker.js', express.static(staticRoot + 'bundles/service-worker.js', { maxAge: '7d' }));
app.use('/robots.txt', express.static(staticRoot + 'robots.txt'));
app.use(favicon(path.join(__dirname, 'public', 'favicons', 'favicon.ico')));


//request below will be cache
// app.use(device.capture());
const redisClient = redis.createClient(systemSetting.redisUrlForApiCache).on("error", err => console.log("Error " + err));
redisClient.flushall((err, result) => console.log('redisClient.flushall result:', result));
const basicCacheOption = {
  debug: true, enabled: systemSetting.isProduction, redisClient,
  statusCodes: {
    include: [200],
  }
};
const basicCache = apicache.options(basicCacheOption).middleware('1 hour');
const graphqlCache = apicache.newInstance({ ...basicCacheOption, appendKey: ["cacheKey"] }).middleware('1 hour');
app.use(bodyParser.json());
app.use('/graphql', (req, res, next) => {
  req['cacheKey'] = req.body.operationName + (req.body.variables ? req.body.variables[Object.keys(req.body.variables)[0]] : '');
  next();
})
app.use('/graphql', graphqlCache, graphqlHTTP({ schema: schema, pretty: systemSetting.enableGraphiql, graphiql: systemSetting.enableGraphiql, }))

app.use(basicCache, function (req, res, next) {
  global.navigator = { userAgent: req.headers['user-agent'] };
  global.document = {
    title: "Movie Rater",
    meta: {
      description: "蒐集了IMDB, YAHOO, PTT的電影評價，一目了然讓你不再踩雷",
      image: "/public/favicons/android-chrome-384x384.png"
    }
  };

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
        title: global.document.title,
        meta: global.document.meta,
        html: content,
        apolloState: `<script>window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(/</g, '\\u003c')};</script>`
      });
    res.status(context["status"] || 200).send(page);
  }, error => next(error));
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something went wrong ! Error: " + err.message);
});

let port = process.env.PORT || 3003;
app.listen(port, function () {
  console.log('app running on port', port);
});