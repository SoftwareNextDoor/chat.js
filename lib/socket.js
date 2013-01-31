function initSocket(httpServer){

  var io = require('socket.io').listen(httpServer);

  io.sockets.on('connection', function (s) {
    s.emit('setup', {nickname: 'test'});
  });
}

module.exports = initSocket;
