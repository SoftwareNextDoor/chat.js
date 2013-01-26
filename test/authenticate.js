var should = require('should')
    , request = require('request')
    , app = require('../app/app')
    , uri = 'http://localhost:3000/authenticate'
    , cm = require('../lib/authenticators/cookie_monster')

suite('cookie monster authentication');

test('it sends the authentication uuid as a cookie', function () {
  cm.db.flushdb();

  request(uri, function (error, res, body) {
    res.should.have.header('set-cookie');
    res.headers['set-cookie'].should.match(
      /user_id=[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  })
});

test('once authenticated, it sends the user info as json', function (done) {
  cm.db.flushdb();

  request(uri, function (error, res, body) {
    request({
        uri: uri
        , cookie: request.cookie(res.headers['set-cookie'][0])}
      , function (error, res, body) {
        should.not.exist(res.headers['set-cookie'])
        res.should.json
        done();
    })
  });
});
