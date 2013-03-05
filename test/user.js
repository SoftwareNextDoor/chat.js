var db = require('../lib/db_configurator').client
  , User = require('../lib/user.js')
  , should = require('should')
  ;

suite('User');

beforeEach(function(){
  db.flushdb();
});

test('finds users by ID', function(done){
  User.create(function (user) {
    User.find(user.id, function (user) {
      user.should.have.ownProperty('id');
      done();
    });
  });
});

test('yields null when not found', function (done) {
  User.find(123123123, function (user) {
    should.not.exist(user);
    done();
  });
});
