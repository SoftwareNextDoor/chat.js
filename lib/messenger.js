var Message = require('./message')
  , User = require('./user')
  ;

module.exports = function (io) {
  var io = io;

  this.connect = function(user, socket) {
    user.goOnline();
    socket.emit('user:online', user);
    socket.broadcast.emit('message:notice', Message.notice(user.name + ' ha ingresado.'))
    User.findAll(function (users) { io.sockets.emit('user:all', users); });
    Message.last(10, function (messages) { socket.emit('message:recent', messages); });
  }

  this.disconnect = function(user, socket) {
    user.goOffline();
    socket.broadcast.emit('message:notice', Message.notice(user.name + ' se ha ido.'));
    io.sockets.emit('users:change', user);
  }

  this.notice = function (socket, text) {
    var msg = Message.build({body: text});
    socket.broadcast.emit('message:new', msg);
  };

  this.talk = function (user, message) {
    Message.create({ sender: user.name, body: message}, function (msg) {
      io.sockets.emit('message:notice', msg);
    });
  };

  return this;
};

