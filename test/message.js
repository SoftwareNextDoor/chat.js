var Message = require('../lib/message.js').Message
  , should = require('should');

test('builds a json-capable object', function () {
  var message = new Message('testacle', 'blah');

  message.toString().should.be.a('string');
});
