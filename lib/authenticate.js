var cm = require('../lib/authenticators/cookie_monster')

exports.set = function(req, res, next){
  if (req.signedCookies.user === undefined){
    res.cookie('user', cm.allocate(), {signed: true});
  }
  next();
}

exports.query = function (req, res, next) {
  cm.get(req.signedCookies.user, function (error, record) {
    if (error) { res.redirect('/'); }
    return res.json(record);
  })
}
