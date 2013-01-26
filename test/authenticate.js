var should = require('should')
    , request = require('request')
    , app = require('../app/app')
    , uri = 'http://localhost:3000/'
    , cm = require('../lib/authenticators/cookie_monster')

cm.db.flushdb();

suite('cookie monster authentication');

test('sets a cookie for every new user', function (done) {
  request(uri, function (error, res, body) {
    res.should.have.header('set-cookie');
    done()
  })
});

