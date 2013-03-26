var db = require('../lib/db_configurator.js').client
  , User = require('../lib/user.js')
  , should = require('should')
  ;

suite('User');

beforeEach(function(){
  db.flushdb();
});

test('.find seeks users by id', function(done){
  User.create(function (user) {
    User.find(user.id, function (user) {
      user.should.have.ownProperty('id');
      done();
    });
  });
});

test('.findWithSession seeks by using session uid', function (done) {
  User.create(function (user) {
    User.findWithSession({uid: user.id}, function (user) {
      should.exist(user);
      done();
    })
  });
});

test('.findWithSession returns new user with no uid in session', function (done) {
  User.findWithSession({save: function(){}}, function (user) {
    should.exist(user);
    done();
  });
});

test('yields null when not found', function (done) {
  User.find(123123123, function (user) {
    should.not.exist(user);
    done();
  });
});
