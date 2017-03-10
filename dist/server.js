"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var graphqlHTTP = require("express-graphql");
var db_1 = require("./data/db");
var scheduler_1 = require("./backgroundService/scheduler");
var schema_1 = require("./data/schema");
var React = require("react");
var server_1 = require("react-dom/server");
var Router = require("react-router");
var swig = require("swig");
var routes_1 = require("./app/routes");
var cacheManager_1 = require("./data/cacheManager");
var favicon = require("serve-favicon");
var app = express();
app.get('/api/test', function (req, res) {
    res.send('test!');
});
app.get('/api/crawlerStatus', function (req, res) {
    db_1.db.getDocument({ name: "crawlerStatus" }, "configs").then(function (c) { return res.send(c); });
});
app.get('/api/yahooMovies', function (req, res) {
    db_1.db.getCollection("yahooMovies").then(function (yahooMovies) {
        res.send(yahooMovies);
    });
});
app.get('/api/pttPages', function (req, res) {
    db_1.db.getCollection("pttPages").then(function (pages) {
        res.send(pages);
    });
});
db_1.db.openDbConnection()
    .then(function () {
    cacheManager_1.default.init();
    scheduler_1.initScheduler();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var staticRoot = path.join(__dirname, 'public/');
app.use('/public', express.static(staticRoot));
app.use(favicon(path.join(__dirname, 'public', 'image', 'favicon.ico')));
app.use('/graphql', graphqlHTTP({ schema: schema_1.default, pretty: true, graphiql: true }));
app.use(function (req, res) {
    Router.match({ routes: routes_1.default, location: req.url }, function (err, redirectLocation, renderProps) {
        if (err) {
            res.status(500).send(err.message);
        }
        else if (redirectLocation) {
            res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
        }
        else if (renderProps) {
            //for material-ui auto prefixer
            global.navigator = { userAgent: req.headers['user-agent'] };
            var html = server_1.renderToString(React.createElement(Router.RouterContext, renderProps));
            var page = swig.renderFile(path.join(__dirname, 'index.html'), { html: html });
            res.status(200).send(page);
        }
        else {
            res.status(404).send('Page Not Found');
        }
    });
});
var port = process.env.PORT || 3003;
app.listen(port, function () {
    console.log('app running on port', port);
});
//# sourceMappingURL=server.js.map