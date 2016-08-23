import * as http from "http";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';
import crawler from './crawler/yahooCrawler';
import {db} from './db';

const app = express();
const staticRoot = path.join(__dirname, 'public/');

app.set('port', (process.env.PORT || 3000));
app.get('/test', (req, res) => {
  res.send('test!');
});
app.get('/movies', (req, res) => {
  db.getCollection("movies").then(movies => {
    res.send(movies);
  });
});

db.openDbConnection().then((db)=>{
  crawler();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(staticRoot));
app.listen(app.get('port'), function () {
  console.log('app running on port', app.get('port'));
});