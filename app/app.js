var express = require('express')
    , app = express()
    , redisStore = require('connect-redis')(express)
    , chat_session = require('../lib/chat_session');

app.configure(function(){
  app.engine('.jade', require('jade').__express);
  app.set('views engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use('/assets', express.static(__dirname + '/assets'));

  app.use(express.bodyParser());
  app.use(express.cookieParser('secret'));
  app.use(express.session({
    store: new redisStore(),
    secret: 'octocat from github'
  }));
  app.use(chat_session);
});

app.get('/', function (req, res) {
  res.render('index.jade');
});


app.listen(3000);
console.log('Application listening on 3000');

module.exports = app;
