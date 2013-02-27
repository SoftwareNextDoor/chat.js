var _ = require('underscore')
  , db = require('redis').createClient();

var defaultValues = {
  'name': 'Sin Nombre ' + new Date().getMilliseconds()
  , 'status': 'online'
  , 'notifications': true
}

var User = function () {
  _.extend(this, defaultValues);
}

User.defaultValues = defaultValues;

User.update = function (user, attributes) {
  _.extend( user, filterAttributes(attributes) )
  return toJson(user);
}

function filterAttributes(attributes) {
 return _.pick( attributes, _.keys(defaultValues));
}

User.all = function (fn) {
  allKeys(function (keys) {
    get(keys, fn)
  });
};

function allKeys (fn) {
  db.keys('sess:*', function (err, keys) {
    if (err) throw err;
    fn(keys);
  });
};

function get (keys, fn) {
  db.mget(keys, function (err, users) {
    fn(_.map(users, asJson));
  })
};

function asJson (object){
  while ('string' === typeof object)
    object = JSON.parse(object);
  // XXX: Refactor this shit.
  return _.first(_.values(_.pick(object, 'user')));
}

User.prototype.toJson = toJson;

function toJson(object) {
  return JSON.stringify(object || this);
}

module.exports = User;
