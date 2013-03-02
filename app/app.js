// Set db according to environment.
var dbConfigurator = require('../lib/db_configurator.js')

var express = require('express')
    , app = express()
    , httpServer = require('http').createServer(app)
    , cookieParser = express.cookieParser('secret')
    , redisStore = require('connect-redis')(express)
    , sessionStore = new redisStore({db: dbConfigurator.selectedDB})
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
  User.emit('find', session.uid);

  User.on('notFound', function () { User.emit('create'); })
  User.on('created', function (user) {
    session.uid = user.id;
    session.save();
    User.emit('found', user);
  });

  User.on('found', function (user) {
    console.log(user);

    socket.emit('user', user);
    io.sockets.emit('userJoined', new Message(user.name, ' ha ingresado.'));

    socket.on('setNotifications', function (bool) {
      User.emit('update', user, { notifications: bool });
    });

    socket.on('setName', function (name) {
      User.emit('update', user, { name: name });
    });

    User.on('updated', function (user) {
      socket.emit('user', user);
      User.emit('findAll');
    });

    socket.on('newMessage', function (message) {
      var msg = new Message(user.name, message);
      msg.save(function (msg){
        console.log(msg);
        io.sockets.emit('newMessage', msg);
      });
    });

    Message.last(5, function (messages) {
      socket.emit('recentMessages', messages);
    });

    socket.on('getUser', function () {
      socket.emit('user', user);
    });

    socket.on('disconnect', function () {
      User.emit('update', user, {status: 'offline'});
    });

    User.emit('findAll');

    User.on('foundAll', function (users) {
      io.sockets.emit('userList', users);
    });
  });

  User.on('error', function(error){ throw error });

});

httpServer.listen(3000);
console.log('Application listening on 3000');

module.exports = app;
