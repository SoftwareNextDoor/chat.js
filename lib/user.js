module.exports = User;

var dbClient = require('./db_manager').client
    , _ = require('underscore')
    , util = require('util')
    , EventEmitter = require('events').EventEmitter
    ;

function User() {
  EventEmitter.call(this);
  this.name = 'Sin Nombre ' + new Date().getMilliseconds();
  this.status = 'online';
  this.notifications = true;
}

util.inherits(User, EventEmitter);

User.WithSession = function (session) {
  var uid = session.userId
    , self = this;

  if ('undefined' === typeof uid) {
    User.generateID(function (id) {
      session.userId = id;
      session.save();
    });
  }

  User.find(uid, function (user) {
    self.emit('ready', user);
  });

};

util.inherits(User.WithSession, User);

User.find = function (uid, callback) {
  dbClient.hgetall('user:' + uid, function (error, user) {
    if (error) throw error
    callback(user);
  });
};

User.generateID = function (callback) {
  dbClient.incr('userID', function (error, id) {
    callback(id);
  });
};

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
  dbClient.keys('sess:*', function (err, keys) {
    if (err) throw err;
    fn(keys);
  });
};

function get (keys, fn) {
  dbClient.mget(keys, function (err, users) {
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
