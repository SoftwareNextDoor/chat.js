//var should = require('should')
  //, User = require('../lib/user.js')
  //, db = require('redis').createClient()
  //, _ = require('underscore')
  //, user
  //;

//beforeEach(function () {
  //db.flushdb();
  //user = new User();
//});

//test('It can be represented as a json object', function () {
  //user.toJson().should.be.a('string');
  //user.toJson().should.match(/\{.*\}/);
//});

//test('It only updates attributes present on the defaultValues keys', function () {
  //var newAttributes = { status: 'online'
                       //, admin: true
                       //, nickname: 'Alan'};
  //User.update(user, newAttributes);

  //var nonExistent = _.omit(newAttributes, _.keys(User.defaultValues));

  //user.should.not.have.keys(nonExistent);
  //user.nickname.should.equal('Alan');
//});

//test('Returns all users as Json objects', function (done) {
  //db.set('sess:blahblah', JSON.stringify({test: 'data'}));
  //User.all(function (results) {
    //results.should.be.an.instanceOf(Array);
    //results[0].should.be.an.instanceOf(Object);
    //done();
  //})
//});
