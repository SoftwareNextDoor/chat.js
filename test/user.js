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

//client.on('ready', function () {

  //test('It creates a new user if it doesnt exists', function (done) {

    //User.getFromSession(session, {
      //ready: function (user) {
        //user.should.have.ownProperty('name');
        //done();
      //}
    //});

  //});


  //test('It updates the user', function () {

    //User.getFromSession(session, {
      //ready: function (user) {
        //user.notifications.should.not.be.ok;
        //user.update({ notifications: false });
      //}
    //});
  //});

  ////test('on find', function (done) {
    ////user.on('created', function (u) {
      ////user.emit('find', u.id);
    ////})

    ////user.on('found', function (u) {
      ////u.should.be.a('object');
      ////u.should.have.ownProperty('id');
      ////done();
    ////});

    ////user.emit('create');
  ////});

  ////test('on findAll', function(done){
    ////user.on('foundAll', function (users) {
      ////users.should.be.an.instanceOf(Array);
      ////users.length.should.be.above(0);
      ////users[0].should.have.ownProperty('name');
      ////done();
    ////});

    ////user.on('created', function () {
      ////user.emit('findAll');
    ////});

    ////user.emit('create');

  ////});

  ////test('on update', function (done) {
    ////user.on('created', function (u) {
      ////u.notifications.should.be.true;
      ////u.should.have.ownProperty('id');
      ////user.emit('update', { notifications: false });
    ////});

    ////user.on('updated', function (u) {
      ////u.notifications.should.be.false;
      ////u.should.have.ownProperty('id');
      ////done();
    ////});

    ////user.emit('create');
  ////});

//});
