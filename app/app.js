var express = require('express')
    , app = express()
    , httpServer = require('http').createServer(app)

    , cookieParser = express.cookieParser('secret')
    , redisStore = require('connect-redis')(express)
    , sessionStore = new redisStore()
    , User = require('../lib/user.js')
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
  return session.user;
};

sessionSockets.on('connection', function (err, socket, session) {
  var user = setUserSession(session);

  socket.emit('user', user);
  socket.emit('recentMessages', [{sender: 'user', body: 'junaga'}]);

  io.sockets.emit('userJoined', {body: user.name + 'se ha unido al chat. :)'});

  User.all(function (users) {
    socket.emit('userList', users);
  });

  socket.on('setNotifications', function (bool) {
    console.log('changed to: ', bool);
    session.user.notifications = bool;
    session.save();
  });

  socket.on('setName', function (name) {
    session.user['name'] = name
    session.save();
    socket.emit('user', session.user);
    User.all(function (users) {
      io.sockets.emit('userList', users);
    });
  });

  socket.on('newMessage', function (message) {
    io.sockets.emit('newMessage', {sender: user.name, body: message});
  });

  socket.on('getUser', function () {
    socket.emit('user', user);
  })

});

httpServer.listen(3000);
console.log('Application listening on 3000');

module.exports = app;
