var KEY = '45762302';
var SECRET_KEY = '6d7cc47c70ec7a22a970d56835a043e04c12847c';

var express = require('express');
var bodyParser = require('body-parser');
var OpenTok = require('opentok'),
    opentok = new OpenTok(KEY, SECRET_KEY);
var path    = require("path");
var mongoose = require('mongoose');
var Videocall = require('./models/videocall');

var app = express();

mongoose.connect('mongodb://localhost:27017/beerlocker');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

var router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'API'});
});

var videocallsRoute = router.route('/videos');

// ROUTE - create a session, return session and token
videocallsRoute.post(function(req, res) {

  //create sessionId
  opentok.createSession(function(err, session) {

    if (err) return console.log(err);

    var video = new Videocall();
    video.name = req.body.name;
    video.sessionId = session.sessionId;
    video.tokenId = session.generateToken();

    video.save(function(err) {
      if (err) {
        res.send(err);
      }

      res.json({ message: 'New session added!', data: video });
    });
  });
});

// ROUTE - takes a code, and returns session and token
var videocallRoute = router.route('/videos/:video_name');
videocallRoute.get(function(req, res) {
  Videocall.findOne({ name: req.params.video_name }, function(err, video) {
    if (err) {
      res.send(err);
    }

    res.json(video);
  });
});

app.use('/api', router);

//Start the server
app.listen(port);

console.log('Server running on port ' + port);
