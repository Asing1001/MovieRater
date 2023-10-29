import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as graphqlHTTP from 'express-graphql';
import * as React from 'react';
import { StaticRouter } from 'react-router-dom';
import * as swig from 'swig';
import * as favicon from 'serve-favicon';
import * as apicache from 'apicache';
import App from './app/components/app';
import cacheManager from './data/cacheManager';
import { systemSetting } from './configs/systemSetting';
import { Mongo } from './data/db';
import { initScheduler } from './backgroundService/scheduler';
import schema from './data/schema';
import { renderToStringWithData, ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import { createLocalInterface } from 'apollo-local-query';
import * as graphql from 'graphql';
import * as redis from 'redis';
import { updateImdbInfo } from './task/imdbTask';
import { checkTaskTriggerKeyInHeader } from './helper/taskTriggerAuthorityHandler';

Mongo.openDbConnection().then(cacheManager.init).then(initScheduler);

const app = express();

app.get('/api/test', (req, res) => {
  res.send('test!');
});

app.get('/api/crawlerStatus', (req, res) => {
  Mongo.getDocument({ name: 'crawlerStatus' }, 'configs').then((c) => res.send(c));
});

app.get('/api/cache/index', (req, res) => {
  res.json(apicache.getIndex());
});

app.post('/api/imdbTask', checkTaskTriggerKeyInHeader, (req, res) => {
  updateImdbInfo();
  res.send('Task start!');
});

//static content
const staticRoot = path.join(__dirname, 'public/');
app.use('/public', express.static(staticRoot, { maxAge: '7d' }));
app.use('/service-worker.js', express.static(staticRoot + 'bundles/service-worker.js', { maxAge: '7d' }));

const rootFiles = ['robots.txt', 'sitemap.xml', 'ads.txt'];
rootFiles.forEach((fileName) => {
  app.use('/' + fileName, express.static(staticRoot + fileName));
});

app.use(favicon(path.join(__dirname, 'public', 'favicons', 'favicon.ico')));
app.use(bodyParser.json());
app.use(
  '/graphql',
  graphqlHTTP({ schema: schema, pretty: systemSetting.enableGraphiql, graphiql: systemSetting.enableGraphiql })
);

//request below will be cache
const redisClient = redis
  .createClient(systemSetting.redisUrlForApiCache)
  .on('error', (err) => console.log('Error ' + err));
const basicCacheOption = {
  debug: true,
  enabled: systemSetting.isProduction,
  redisClient,
  statusCodes: {
    include: [200],
  },
};
const basicCache = apicache.options(basicCacheOption).middleware('1 hour');
app.use(basicCache, function (req, res, next) {
  global.navigator = { userAgent: req.headers['user-agent'] };
  global.document = {
    title: 'Movie Rater',
    meta: {
      description: '24小時不斷更新IMDB, YAHOO, PTT電影評價、電影時刻表，一目了然讓你不再踩雷！',
      image: '/public/favicons/android-chrome-384x384.png',
    },
  };

  const client = new ApolloClient({
    ssrMode: true,
    networkInterface: createLocalInterface(graphql, schema),
  });

  const context = {};

  const app = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </ApolloProvider>
  );

  renderToStringWithData(app).then(
    (content) => {
      const initialState = { apollo: client.getInitialState() };
      const page = swig.renderFile(staticRoot + 'bundles/index.html', {
        title: global.document.title,
        meta: global.document.meta,
        html: content,
        apolloState: `window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(/</g, '\\u003c')};`,
      });
      res.status(context['status'] || 200).send(page);
    },
    (error) => next(error)
  );
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something went wrong ! Error: ' + err.message);
});

let port = process.env.PORT || 3003;
app.listen(port, function () {
  console.log('app running on port', port);
});
