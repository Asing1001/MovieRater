import * as http from "http";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';
import * as graphqlHTTP from 'express-graphql';
import {crawlYahoo} from './crawler/yahooCrawler';
import {db} from './db';
import schema from './schema';
import {systemSetting} from './configs/systemSetting'; 


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

db.openDbConnection(systemSetting.dbUrl).then((db)=>{
  return crawlYahoo();
}).then(()=>console.log('crawler done'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(staticRoot));

app.use('/graphql', graphqlHTTP({ schema: schema, pretty: true, graphiql: true }))

app.listen(app.get('port'), function () {
  console.log('app running on port', app.get('port'));
});