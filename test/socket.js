var app = require('../app/app.js')
  , should = require('should')
  , io = require('socket.io-client')
  , host = 'http://localhost:3000'
  , client
  ;

suite('socket.io client');

// This tests assume the user is sending the session cookie to authenticate.
// Socket.io server is using authorization but we dont' know how
// to test that.
test('It receives data when connected', function (done) {
  client = io.connect(host);

  client.on('all_users', function (data) {
    data.should.be.an.instanceOf(Array);
  });

  client.on('setup', function (data) {
    data.should.have.keys('nickname');
    done();
  });
});
