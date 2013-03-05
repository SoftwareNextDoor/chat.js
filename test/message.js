var Message = require('../lib/message.js')
  , db = require('../lib/db_configurator').client
  , should = require('should');

suite('Message');

beforeEach(function () {
  db.flushdb();
});

test('returns last N messages', function (done) {
  var n = 5;

  for (var i = 0; i < n; i += 1) {
    Message.create({sender: 'RadioHead', body: 'Rocks'});
  };

  Message.last(n, function (messages) {
    messages.length.should.eql(n);
    done();
  })
});
