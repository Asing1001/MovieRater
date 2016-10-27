import * as http from "http";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';
import * as graphqlHTTP from 'express-graphql';
import {crawlYahooRange} from './crawler/yahooCrawler';
import {crawlImdb} from './crawler/imdbCrawler';
import {crawlPtt} from './crawler/pttCrawler';
import {db} from './data/db';
import {initScheduler} from './backgroundService/scheduler'; 
import schema from './data/schema';
import {systemSetting} from './configs/systemSetting'; 
import * as React from 'react';
import { renderToString } from 'react-dom/server'
import * as Router from 'react-router'; 
import * as swig from 'swig';
import routes from './app/routes';

const app = express();
const staticRoot = path.join(__dirname, 'public/');

app.set('port', (process.env.PORT || 3000));
app.get('/test', (req, res) => {
  res.send('test!');
});
app.get('/yahooMovies', (req, res) => {
  db.getCollection("yahooMovies").then(yahooMovies => {
    res.send(yahooMovies);
  });
});
app.get('/pttPages', (req, res) => {
  db.getCollection("pttPages").then(pages => {
    res.send(pages);
  });
});
app.get('/imdbMovies', (req, res) => {
  db.getCollection("imdbMovies").then(movies => {
    res.send(movies);
  });
});

db.openDbConnection(systemSetting.dbUrl)
//.then(crawlYahoo)
// .then(crawlPtt)
// .then(crawlImdb)
.then(initScheduler);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(staticRoot));

app.use('/graphql', graphqlHTTP({ schema: schema, pretty: true, graphiql: true }))

app.use(function(req, res) {
  Router.match({ routes: routes, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = renderToString(React.createElement(Router.RouterContext, renderProps));
      var page = swig.renderFile('./src/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

app.listen(app.get('port'), function () {
  console.log('app running on port', app.get('port'));
});