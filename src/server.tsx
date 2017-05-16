import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';
import * as graphqlHTTP from 'express-graphql';
import * as React from 'react';
import { match, RouterContext } from 'react-router';
import * as swig from 'swig';
import * as favicon from 'serve-favicon';
import * as compression from 'compression';
import routes from './app/routes';
import cacheManager from './data/cacheManager';
import { systemSetting } from './configs/systemSetting';
import forceSSL from './helper/forceSSL';
import { db } from './data/db';
import { initScheduler } from './backgroundService/scheduler';
import schema from './data/schema';
import { renderToStringWithData, ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import { createLocalInterface } from 'apollo-local-query';
import * as graphql from 'graphql';

db.openDbConnection().then(cacheManager.init).then(initScheduler);

const app = express();
app.use(compression());
app.use(forceSSL());

app.get('/api/test', (req, res) => {
  res.send('test!');
});

app.get('/api/crawlerStatus', (req, res) => {
  db.getDocument({ name: "crawlerStatus" }, "configs").then(c => res.send(c));
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const staticRoot = path.join(__dirname, 'public/');
app.use('/public', express.static(staticRoot));
app.use('/service-worker.js', express.static(staticRoot + 'bundles/service-worker.js'));
app.use(favicon(path.join(__dirname, 'public', 'favicons', 'favicon.ico')));
app.use('/graphql', graphqlHTTP({ schema: schema, pretty: systemSetting.enableGraphiql, graphiql: systemSetting.enableGraphiql, }))

app.use(function (req, res) {
  match({ routes: routes, location: req.url }, function (err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      //for material-ui auto prefixer
      global.navigator = { userAgent: req.headers['user-agent'] };

      const client = new ApolloClient({
        ssrMode: true,
        // Remember that this is the interface the SSR server will use to connect to the
        // API server, so we need to ensure it isn't firewalled, etc
        networkInterface: createLocalInterface(graphql, schema),
      });

      const app = (
        <ApolloProvider client={client}>
          <RouterContext {...renderProps} />
        </ApolloProvider>
      );

      renderToStringWithData(app).then(html => {
        var page = swig.renderFile(staticRoot + 'bundles/index.html', { html: html });
        res.status(200).send(page);
      });

    } else {
      res.status(404).send('Page Not Found')
    }
  });
});


let port = process.env.PORT || 3003;
app.listen(port, function () {
  console.log('app running on port', port);
});