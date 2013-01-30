var should = require('should')
    , express = require('express')
    , request = require('supertest')
    , chat_session = require('../lib/chat_session');

function attachSession(req, res) {
  res.json(req.session.user);
};

var app;

before(function () {
  app = express()
    .use(chat_session)
    .use(attachSession);
});

test('It gives a user session the first time', function (done) {
  request(app)
    .get('/')
    .end(function (error, res) {
      if (error) throw error;
      res.body.should.have.key('nickname');
      done();
    });
});
