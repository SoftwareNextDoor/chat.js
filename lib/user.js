
var _ = require('underscore')

var defaultValues = {
  'nickname': 'Sin Nombre ' + new Date().getMilliseconds()
}

var User = exports = module.exports = exports = function () {
  _.extend(this, defaultValues);
}

User.update = function (user, attributes) {
  _.extend( user,
           _.pick( attributes,
                  _.keys(defaultValues)));
  return toJson(user);
}

User.prototype.toJson = toJson;

function toJson(object) {
  return JSON.stringify(object || this);
}
