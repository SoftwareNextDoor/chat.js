var express = require('express')
    , app = express()
    , authenticate = require('../lib/authenticate');

app.engine('.jade', require('jade').__express);

app.set('views engine', 'jade');
app.set('views', __dirname + '/views');
app.use('/assets', express.static(__dirname + '/assets'));

app.use(express.cookieParser('secret'));
app.use(authenticate.set);
app.use('/user', authenticate.query);

app.get('/', function (req, res) {
  res.render('index.jade');
});


app.listen(3000);
console.log('Application listening on 3000');

module.exports = app;
