var should = require('should')
  , app = require('../app/app.js')
  , ioc = require('socket.io-client')
  , socket;

before(function () {
  socket = ioc.connect('http://localhost:3000');
});

test('recognizes socket client js', function (done) {
  socket.on('setup', function (data) {
    data.should.have.keys('nickname');
    done();
  });
});
