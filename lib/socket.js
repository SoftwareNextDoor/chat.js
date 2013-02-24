var User = require('../lib/user')
  , _ = require('underscore')
  , socketio = require('socket.io')
  , RedisStore = require('socket.io/lib/stores/redis')
  , redis  = require('socket.io/node_modules/redis')
  , pub    = redis.createClient()
  , client = redis.createClient();
  ;

module.exports = function (httpServer) {
  io = socketio.listen(httpServer);

  io.configure(function () {
    io.set('log level', 0);

    io.set('store', new RedisStore({
      redisPub : pub
      , redisClient : client
    }));


    //io.set('authorization', function (hsd, fn) {
      ////console.log(hsd)
      //fn()
    //})

  });

  io.sockets.on('connection', function (socket) {
    socket.emit('setup', {nickname: 'wooot'});

    User.all(function (users) {
      socket.emit('all_users', users);
    });
  });
}

