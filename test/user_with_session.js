var should = require('should')
  , UserWithSession = require('../lib/user_with_session.js')
  ;

suite('UserWithSession');

var session = { save: function(){} }; // Session Stub

test('It yields a user either exists or not', function (done) {
  UserWithSession.find(session, function (user) {
    user.should.have.ownProperty('name');
    done();
  })
});
