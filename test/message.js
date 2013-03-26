var Message = require('../lib/message.js')
  , db = require('../lib/db_configurator').client
  , should = require('should')
  , user = {};

suite('Message');

beforeEach(function () {
  db.flushdb();
});

test('creates a persisted message', function (done) {
  // This level of nesting makes me sick!
  Message.count(function (count) {
    Message.create({user: user}, function () {
      Message.count(function (count2) {
        count2.should.be.greaterThan(count);
        done();
      });
    });
  });
});

test('builds a message that wont persist', function (done) {
  Message.count(function (count) {
    Message.build();
    Message.count(function (count2) {
      count.should.be.eql(count2);
      done();
    });
  });
});

test('returns last N messages', function (done) {
  var n = 2;

  for (var i = 0; i < n; i += 1)
    Message.create();

  Message.last(n, function (messages) {
    messages.length.should.eql(n);
    done();
  })
});

test('It has a type depending on given attributes',function () {
  // We're looking to have an adversitement type, but we're still unclear.
  var m = Message.build();
  m.type.should.eql('empty');

  m = Message.build({body: 'Radiohead'});
  m.type.should.eql('notice');

  m = Message.build({sender: 'Blud', body: 'Reckoner'});
  m.type.should.eql('conversation');
});
