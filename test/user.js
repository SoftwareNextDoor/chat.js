var should = require('should')
  , User = require('../lib/user.js')
  , user
  ;

beforeEach(function () {
  user = new User();
});

test('It can be represented as a json object', function () {
  user.toJson().should.be.a('string');
  user.toJson().should.match(/\{.*\}/);
});

test('It only updates attributes present on the defaultValues keys', function () {
  var newAttributes = { status: 'online'
                       , admin: true
                       , nickname: 'Alan'};
  User.update(user, newAttributes);

  user.should.not.have.key('status');
  user.should.not.have.key('admin');
  user.nickname.should.equal('Alan');
});
