var should = require('should')
    , express = require('express')
    , request = require('supertest')
    , redisStore = require('connect-redis')(express)
    , chat_session = require('../lib/chat_session');

function attachSession(req, res) {
  res.json(req.session.user)
};

var app;

before(function () {
  app = express();
  app.use(express.cookieParser('secret'))
    .use(express.session({
      store: new redisStore(),
      secret: 'octocat from github'
    }))
    .use(express.bodyParser())
    .use(chat_session)
    .use(attachSession);
})

test('persists user information', function (done) {
  request(app)
    .get('/')
    .end(function (error, res) {
      if (error) throw error;
      res.body.should.have.property('nickname')
      done();
    })
});

test('modifies session information', function (done) {
  request(app)
    .post('/user')
    .send({nickname: 'scar face'})
    .end(function (err, res) {
      res.body.nickname.should.equal('scar face');
      done();
    });
});
