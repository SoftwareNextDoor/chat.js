var should = require('should')
    , request = require('request')
    , app = require('../app/app')
    , uri = 'http://localhost:3000/'

suite('User info')

test('spits user info', function (done) {
  request(uri, function (error, res, body) {
    console.log(res.headers);
    request({
      uri: uri + 'user'
      //, cookie: request.cookie(res.headers['set-cookie'])
    }, function (error, res, body) {
      console.log(body);
      res.should.json
      done();
    })
    
  })
})
