"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const graphqlHTTP = require("express-graphql");
const db_1 = require("./data/db");
const scheduler_1 = require("./backgroundService/scheduler");
const schema_1 = require("./data/schema");
const React = require("react");
const server_1 = require("react-dom/server");
const Router = require("react-router");
const swig = require("swig");
const routes_1 = require("./app/routes");
const cacheManager_1 = require("./data/cacheManager");
const favicon = require("serve-favicon");
const compression = require("compression");
const systemSetting_1 = require("./configs/systemSetting");
db_1.db.openDbConnection().then(cacheManager_1.default.init).then(scheduler_1.initScheduler);
const app = express();
app.use(compression());
app.get('/api/test', (req, res) => {
    res.send('test!');
});
app.get('/api/crawlerStatus', (req, res) => {
    db_1.db.getDocument({ name: "crawlerStatus" }, "configs").then(c => res.send(c));
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const staticRoot = path.join(__dirname, 'public/');
app.use('/public', express.static(staticRoot));
app.use('/service-worker.js', express.static(staticRoot + 'bundles/service-worker.js'));
app.use(favicon(path.join(__dirname, 'public', 'favicons', 'favicon.ico')));
app.use('/graphql', graphqlHTTP({ schema: schema_1.default, pretty: systemSetting_1.systemSetting.enableGraphiql, graphiql: systemSetting_1.systemSetting.enableGraphiql, }));
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
            var page = swig.renderFile(staticRoot + 'bundles/index.html', { html: html });
            res.status(200).send(page);
        }
        else {
            res.status(404).send('Page Not Found');
        }
    });
});
let port = process.env.PORT || 3003;
app.listen(port, function () {
    console.log('app running on port', port);
});
//# sourceMappingURL=server.js.map