var express = require('express')
  , redisStore = require('connect-redis')(express)
  , app = express()
  , User = require('./user.js')
  , ChatSession;

app.use( express.cookieParser('secret') );
app.use( express.session({  store: new redisStore(),
                            secret: 'octocat from github' }) );
app.use( express.bodyParser() );

ChatSession = function (req, res, next) {
  var session = req.session
  if ('undefined' === typeof session.user) session.user = new User();
  next();
};

app.use(ChatSession);

module.exports = app;
