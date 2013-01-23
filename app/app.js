var express = require('express'),
  app = express();

app.use('/', require('../lib/authenticate'));

module.exports = app.listen(3000);
