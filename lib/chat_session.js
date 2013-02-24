var express = require('express')
  , redisStore = require('connect-redis')(express)
  , app = express()
  , User = require('./user.js')
  , ChatSession;

ChatSession = function (req, res, next) {
  var session = req.session
  if ('undefined' === typeof session.user) session.user = new User();
  next();
};

app.use(ChatSession);

module.exports = app;
