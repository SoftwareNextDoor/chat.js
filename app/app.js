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
  app.use(express.session({ store: sessionStore,
                            cookie: { maxAge: 24 * 14 * 60 * 60 * 1000 }
                          })
         );
});

app.get('/', function (req, res) {
  res.render('index.jade');
});


var io = require('socket.io').listen(httpServer)
    , Message = require('../lib/message')
    , User = require('../lib/user')
    , Messenger = require('../lib/messenger')(io)
    , SessionSockets = require('session.socket.io')
    , sessionSockets = new SessionSockets(io, sessionStore, cookieParser)
    ;


sessionSockets.on('connection', function (err, socket, session) {

  User.findWithSession(session, function (user) {
    Messenger.connect(user, socket);

    socket.on('user:update', function (attributes) {
      if (attributes.hasOwnProperty('name')) {
        io.sockets.emit('users:change', user);
        Messenger.notice(socket, user.name + ' ahora se llama ' + attributes.name);
      }
      user.update(attributes);
    });

    socket.on('message:new', function (message) {
      Messenger.talk(user, message);
    });

    socket.on('disconnect', function () {
      Messenger.disconnect(user, socket);
    });

  });
});

httpServer.listen(3000);
console.log('Application listening on 3000');

module.exports = app;
