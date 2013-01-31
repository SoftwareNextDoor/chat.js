var express = require('express')
    , app = express()
    , httpServer = require('http').createServer(app)
    , chat_session = require('../lib/chat_session');

require('../lib/socket')(httpServer); // socket-io configuration

app.disable('x-powered-by');

app.configure(function(){
  app.engine('.jade', require('jade').__express);
  app.set('views engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use('/assets', express.static(__dirname + '/assets'));
  app.use(chat_session);
});

app.get('/', function (req, res) {
  res.render('index.jade');
});


httpServer.listen(3000);
console.log('Application listening on 3000');

module.exports = app;
