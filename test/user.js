var dbManager = require('../lib/db_manager.js')
  , client = dbManager.client
  , User = require('../lib/user.js')

  , should = require('should')
  , session = { save: function(){} }
  ;

dbManager.configure();

suite('User');

client.on('ready', function () {

  beforeEach(function(){
    client.flushdb();
  });

  afterEach(function () {
    client.flushdb();
  })

  test('.find', function (done) {
    client.hset('user:4', 'name', 'test', function (error, reply) {
      User.find(4, function (user) {
        user.name.should.equal('test');
        done();
      });
    });
  });

});
