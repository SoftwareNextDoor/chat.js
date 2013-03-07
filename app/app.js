// Set db according to environment.
var dbConfigurator = require('../lib/db_configurator.js')

var express = require('express')
    , app = express()
    , httpServer = require('http').createServer(app)
    , cookieParser = express.cookieParser('secret')
    , redisStore = require('connect-redis')(express)
    , sessionStore = new redisStore({db: dbConfigurator.selectedDB})
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


var User = require('../lib/user')
    , UserWithSession = require('../lib/user_with_session')
    , Message = require('../lib/message')
    ;

var io = require('socket.io').listen(httpServer);

var SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);


sessionSockets.on('connection', function (err, socket, session) {

  UserWithSession.find(session, function (user) {
    user.update({status: 'online'});

    socket.emit('user', user);

    socket.on('update', function (attributes) {
      user.update(attributes);
      User.findAll(function (users) {
        io.sockets.emit('userList', users);
      });
    });

    socket.on('getUser', function () {
      socket.emit('user', user);
    });

    Message.build({sender: user.name, body: ' ha ingresado'}, function (msg) {
      io.sockets.emit('userJoined', msg);
    })

    socket.on('newMessage', function (message) {
      Message.create({sender: user.name, body: message}, function (msg) {
        io.sockets.emit('newMessage', msg);
      })
    });

    User.findAll(function (users) {
      io.sockets.emit('userList', users);
    });

    socket.on('disconnect', function () {
      user.update({status: 'offline'});
      Message.build({sender: user.name, body: ' se ha ido.'}, function (msg) {
        io.sockets.emit('userJoined', msg);
      })
      User.findAll(function (users) {
        io.sockets.emit('userList', users);
      });
    });

  });

  Message.last(10, function (messages) {
    socket.emit('recentMessages', messages);
  });


});

httpServer.listen(3000);
console.log('Application listening on 3000');

module.exports = app;
