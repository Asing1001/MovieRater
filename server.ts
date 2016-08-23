import * as http from "http";
import * as url from "url";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';
import crawler from './crawler/yahooCrawler';
 
const app = express();  
const staticRoot = path.join( __dirname,'../dist/');  
app.set('port', (process.env.PORT || 3000));  
app.get('/test', (req, res) => {
  res.send({test:'test123'});
});

crawler();
// app.get('/api/movies', (req,res)=>{
//     db.getUser(req.params.userid, user => {
//         res.render('user', {
//             title: user._id,
//             username: user._id,
//             boards: user.boards
//        });
//     });
// });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(staticRoot));
app.listen(app.get('port'), function() {  
    console.log('app running on port', app.get('port'));
});