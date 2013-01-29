module.exports = function (req, res, next) {
  if (req.session.user === undefined){
    req.session.user = new User();
  }

  if (req.url === '/user') { // POST
    req.session.user.update(req.body);
  }

  next();
};

var User = function () {
  this.nickname = 'Sin Nombre ' + new Date().getMilliseconds()
  this.status = 'online'
}

User.attributes = {
  nickname: ''
  , status: ''
};

User.prototype.update = function (data) {
  for (var attr in User.attributes){
    if (data[attr] !== undefined) {
      this[attr] = data[attr]
    }
  }
}
