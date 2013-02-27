var express = require('express')
    , app = express()
    , httpServer = require('http').createServer(app)

    , cookieParser = express.cookieParser('secret')
    , redisStore = require('connect-redis')(express)
    , sessionStore = new redisStore()
    , User = require('../lib/user.js')
    , redis = require('redis').createClient()
    , _ = require('underscore')
    ;


app.disable('x-powered-by');

app.configure(function(){
  app.engine('.jade', require('jade').__express);
  app.set('views engine', 'jade');
  app.set('views', __dirname + '/views');

  app.use(express.favicon());
  app.use('/assets', express.static(__dirname + '/assets'));

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(cookieParser);
  app.use(express.session({store: sessionStore}));
});

app.get('/', function (req, res) {
  res.render('index.jade');
});


var io = require('socket.io').listen(httpServer);

var SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

var setUserSession = function (session) {
  if (_(session).isUndefined()) return {}
  if (_(session.user).isUndefined()) {
    session.user = new User();
  }
  session.user.status = 'online'
  session.save();
};

sessionSockets.on('connection', function (err, socket, session) {
  setUserSession(session);

  socket.emit('user', session.user);

  redis.lrange('messages', -5, -1, function (error, reply) {
    if (!_(reply).isEmpty()) {
      socket.emit('recentMessages', _(reply).map(function (msg) {
        return JSON.parse(msg);
      }));
    }
  });

  io.sockets.emit('userJoined', {body: session.user.name + ' se ha unido al chat. :)'});

  User.all(function (users) {
    io.sockets.emit('userList', users);
  });

  socket.on('setNotifications', function (bool) {
    console.log('changed to: ', bool);
    session.user.notifications = bool;
    session.save();
  });

  socket.on('setName', function (name) {
    session.user.name = name
    session.save();
    socket.emit('user', session.user);
    User.all(function (users) {
      io.sockets.emit('userList', users);
    });
  });

  socket.on('newMessage', function (message) {
    var msg = {sender: session.user.name, body: message};
    io.sockets.emit('newMessage', msg);

    var msgString = JSON.stringify(msg);
    redis.rpush('messages', msgString);

  });

  socket.on('getUser', function () {
    socket.emit('user', session.user);
  });

  socket.on('disconnect', function () {
    session.user.status = 'offline'
    session.save();
    User.all(function (users) {
      io.sockets.emit('userList', users);
    });
  });

});

httpServer.listen(3000);
console.log('Application listening on 3000');

module.exports = app;
