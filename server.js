// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  ,Twit = require('twit')
  ,sentiment = require('sentiment')
  , io = require('socket.io').listen(server);

server.listen(8080);
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
res.sendFile(__dirname + '/index.html');
});

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


 var stream = T.stream('statuses/filter', { track: watchList })
 //var stream = T.stream('statuses/filter', { locations: sanFrancisco })

  stream.on('tweet', function (tweet) {
    // console.log(tweet);
    var result_s = sentiment(tweet.text);
    //console.log(result_s);
    io.sockets.emit('stream',tweet);
    io.sockets.emit('sentiment',result_s);
  });
 });