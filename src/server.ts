import * as http from "http";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';
import * as graphqlHTTP from 'express-graphql';
import { crawlYahooRange } from './crawler/yahooCrawler';
import { crawlImdb } from './crawler/imdbCrawler';
import { crawlPtt } from './crawler/pttCrawler';
import { db } from './data/db';
import { initScheduler } from './backgroundService/scheduler';
import schema from './data/schema';
import { systemSetting } from './configs/systemSetting';
import * as React from 'react';
import { renderToString } from 'react-dom/server'
import * as Router from 'react-router';
import * as swig from 'swig';
import routes from './app/routes';
import cacheManager from './data/cacheManager';
import * as favicon from 'serve-favicon';

const app = express();

app.get('/api/test', (req, res) => {
  res.send('test!');
});
app.get('/api/crawlerStatus', (req, res) => {
  db.getDocument({ name: "crawlerStatus" }, "configs").then(c => res.send(c));
});
app.get('/api/yahooMovies', (req, res) => {
  db.getCollection("yahooMovies").then(yahooMovies => {
    res.send(yahooMovies);
  });
});
app.get('/api/pttPages', (req, res) => {
  db.getCollection("pttPages").then(pages => {
    res.send(pages);
  });
});

db.openDbConnection(systemSetting.dbUrl)
  .then(() => {
    cacheManager.init()
    initScheduler();
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const staticRoot = path.join(__dirname, 'public/');
app.use('/public', express.static(staticRoot));
app.use(favicon(path.join(__dirname, 'public', 'image', 'favicon.ico')));
app.use('/graphql', graphqlHTTP({ schema: schema, pretty: true, graphiql: true }))

app.use(function (req, res) {
  Router.match({ routes: routes, location: req.url }, function (err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      //for material-ui auto prefixer
      global.navigator = { userAgent: req.headers['user-agent'] };
      var html = renderToString(React.createElement(Router.RouterContext, renderProps));
      var page = swig.renderFile(path.join(__dirname, 'index.html'), { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});


let port = process.env.PORT || 3003;
app.listen(port, function () {
  console.log('app running on port', port);
});