// Set db according to environment.
require('../lib/db_manager.js').configure();

var express = require('express')
    , app = express()
    , httpServer = require('http').createServer(app)
    , cookieParser = express.cookieParser('secret')
    , redisStore = require('connect-redis')(express)
    , sessionStore = new redisStore()
    ;

var User = require('../lib/user.js')
    , Message = require('../lib/message.js').Message
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


sessionSockets.on('connection', function (err, socket, session) {

  var user = new User.WithSession(session);

  user.on('ready', function (u) {
    console.log(u);
  })

  socket.emit('user', session.user);

  Message.last(5, function (messages) {
    socket.emit('recentMessages', messages);
  });

  io.sockets.emit('userJoined', new Message(session.user.name, ' ha ingresado.'));

  User.all(function (users) {
    io.sockets.emit('userList', users);
  });

  socket.on('setNotifications', function (bool) {
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
    var msg = new Message(session.user.name, message);
    msg.save(function (msg){
      console.log(msg);
      io.sockets.emit('newMessage', msg);
    });
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
