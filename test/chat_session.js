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

test('It gives a session', function (done) {
  request(app)
    .get('/')
    .end(function (error, res) {
      if (error) throw error;
      res.body.should.be.an.instanceOf(Object)
      res.body.nickname.should.be.a('string');
      done();
    });
});
