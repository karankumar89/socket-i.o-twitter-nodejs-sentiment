// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  ,Twit = require('twit')
  ,sentiment = require('sentiment')
  , io = require('socket.io').listen(server)
  , mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/');

// This is our mongoose model for todos
var db = mongoose.connection;
server.listen(8080);
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
res.sendFile(__dirname + '/index.html');
});

app.get("/todos.json", function (req, res) {
    ToDo.find({}, function (err, toDos) {
  res.json(toDos);
    });
});

//mongoosedb
db.on('error', function (err) {
console.log('connection error', err);
});
db.once('open', function () {
console.log('connected.');
});

var Schema = mongoose.Schema;
var tweetSchema = new Schema({
id    : Number, 
score : String,
tweet : String
});

var tweetScore = mongoose.model('tweetScore', tweetSchema);

//sentiment test
//var result_s = sentiment('What an asshole that guy is');
//console.log(result_s);

var watchList = ['yankees'];
var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ];

 var T = new Twit({
    consumer_key:         '6EbfWP6POkoMAXcLRw0T7z9v1'
  , consumer_secret:      '1J5AjylWEF41r4K6EiNjjfLR9qL2yT3EKf1VuYQvg3lF3Ay3Vf'
  , access_token:         '57700761-vj7z1FEPxOP08lmYF3DywJk7a7qOpN84RdhxmoUYw'
  , access_token_secret:  'dleHLmTUfQXjxK7VuJ8WstzjqodG47b8LAAW1gJckUI7l'
})

io.sockets.on('connection', function (socket) {
  console.log('Connected');

 var tweet_id = 0;
 var stream = T.stream('statuses/filter', { track: watchList })
 //var stream = T.stream('statuses/filter', { locations: sanFrancisco })

  stream.on('tweet', function (tweet) {

    // console.log(tweet);
    var result_s = sentiment(tweet.text);
    //console.log(result_s);
    tweet_id++;
    var newTweet = new tweetScore({
      id    : tweet_id,
      score : result_s.score,
      tweet : tweet.text
    });

    newTweet.save(function (err, data) {
    if (err) console.log(err);
    else console.log('Saved ', data );
    });

    io.sockets.emit('stream',tweet);
    io.sockets.emit('sentiment',result_s);
  });
 });