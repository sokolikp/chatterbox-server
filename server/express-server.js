/* Import node's http module: */
var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var port = 3000;

var messages = [];
app.use(express.static(__dirname + '/../client'));
app.use(bodyParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res, next){
  res.sendfile(__dirname + '/../client/index.html');
});

app.get('/classes/messages', function(req, res, next){
  res.send(JSON.stringify({results: messages}));
  next();
});

app.post('/classes/messages', function(req, res, next) {
  // console.log('post', req.body);
  messages.push(req.body);
  res.send('POST request to classes/messages');
  next();
});

app.listen(port);


