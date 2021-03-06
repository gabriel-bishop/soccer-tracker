var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
const path = require('path');

require('./data/db')();

var app = express();

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'any string'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./dist/soccer-tracker'));
app.disable('etag');

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin",
  //   "http://localhost:4200");
  // res.header("Access-Control-Allow-Origin",
  //   "https://soccer-tracker.herokuapp.com","");

  var allowedOrigins = ['https://soccer-tracker.herokuapp.com', 'http://soccer-tracker.herokuapp.com', 'soccer-tracker.herokuapp.com', 'http://localhost:4200'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  next();
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname,'./dist/soccer-tracker/index.html'));
});

// app.use(express.static(path.join(__dirname, 'dist')));
//
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/dist/index.html'));
// });

const commentsService = require('./services/comments.service.server');
const dbService = require('./services/db.service.server');
const profileService = require('./services/profile.service.server');
const teamService = require('./services/team.service.server');
const followingService = require('./services/following.service.server');


commentsService(app);
dbService(app);
profileService(app);
teamService(app);
followingService(app);

app.listen(process.env.PORT || 5000);

