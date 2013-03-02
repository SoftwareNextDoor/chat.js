var dbConfigurator = require('../lib/db_configurator')
  , client = dbConfigurator.client
  , User = require('../lib/user.js')
  , should = require('should')
  , session = { save: function(){} }
  ;

suite('User');

beforeEach(function(){
  client.flushdb();
});

client.on('ready', function () {

  test('on notFound', function (done) {
    User.emit('find', 123123123);
    User.once('notFound', function () {
      done();
    });
  });

  test('on create', function (done) {
    User.emit('create');
    User.once('created', function (user) {
      user.should.be.a('object');
      user.should.have.ownProperty('name');
      done();
    })
  });

  test('on find', function (done) {
    User.emit('create');

    User.once('created', function (user) {
      User.emit('find', user.id);
    })

    User.once('found', function (user) {
      user.should.be.a('object');
      done();
    });
  });

  test('on findAll', function(done){
    User.emit('create');
    User.once('created', function () {
      User.emit('create');
    });

    User.once('created', function () {
      User.emit('findAll');
      User.once('foundAll', function (users) {
        users.should.be.an.instanceOf(Array);
        users.length.should.be.above(0);
        users[0].should.have.ownProperty('name');
        done();
      });
    });
  });

  test('on update', function (done) {
    User.emit('create');
    User.once('created', function (user) {
      user.notifications.should.be.true;
      User.emit('update', user, { notifications: false });
      User.once('updated', function (user) {
        user.notifications.should.be.false;
        done();
      });
    })
  });

});
