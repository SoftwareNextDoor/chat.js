var cm = require('../lib/authenticators/cookie_monster')
    , cookie_utils = require('cookie');

module.exports = function(req, res, next){
  var cookies = req.headers['cookie']
      , cookie;

  if ( cookies === undefined) {
    res.cookie('user_id', cm.allocate());
    next();
  } else {
    cookie = cookie_utils.parse(cookies);
    cm.get(cookie.user_id, function (error, record) {
      res.json(record);
    })
  }
}
