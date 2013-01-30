var express = require('express')
    , app = express()
    , server = app.listen(3000)
    , io = require('socket.io').listen(server)
    , redisStore = require('connect-redis')(express)
    , chat_session = require('../lib/chat_session');

app.disable('x-powered-by');

app.configure(function(){
  app.engine('.jade', require('jade').__express);
  app.set('views engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use('/assets', express.static(__dirname + '/assets'));
  app.use(chat_session);
});

app.get('/', function (req, res) {
  res.render('index.jade');
});


console.log('Application listening on 3000');

module.exports = app;
