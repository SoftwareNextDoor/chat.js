var Message = require('../lib/message.js').Message
  , should = require('should');

suite('Message');

test('builds a json-capable object', function () {
  var message = new Message('testacle', 'blah');

  message.toString().should.be.a('string');
});
