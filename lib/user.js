var db = require('./db_configurator').client
  , Message = require('./message.js')
  ;

function User(attributes) {
  attributes = attributes || {};
  this.id = attributes.id || null;
  this.name = attributes.name || randomName()
  this.status = attributes.status || 'online';

  if ('undefined' === typeof attributes.notifications) {
    this.notifications = true;
  } else {
    this.notifications = attributes.notifications;
  }
}

User.prototype.save = function(callback){
  var self = this;
  callback = callback || function(){};
  if (self.id === null) {
    generateId(function(id){
      self.id = id;
      set(id, self, callback);
    });
  } else {
    set(self.id, self, callback);
  }
}

User.prototype.update = function (attrs, callback) {
  _merge(this, attrs);
  this.save(callback);
};

User.prototype.goOnline = function () {
  this.status = 'online';
  this.save();
};

User.prototype.goOffline = function () {
  this.status = 'offline';
  this.save();
};

function create(callback) {
  new User().save(callback);
};
exports.create = create;

function find(uid, callback) {
  var key = 'user:' + uid;
  db.get(key, function (error, reply) {
    if (error) throw error;
    var jsonu = JSON.parse(reply);
    var u = new User(jsonu);
    reply && callback(u);
    reply || callback(reply);
  });
};
exports.find = find;

exports.findWithSession = function (session, callback) {
  if ('undefined' === typeof session.uid) {
    create(function(user){
      session.uid = user.id
      session.save();
      callback(user);
    });
  } else {
    find(session.uid, function (user) {
      callback(user);
    });
  }
};

exports.findAll = function (callback) {
  db.keys('user:*', function (error, keys) {
    db.mget(keys, function (error, users) {
      var result = [];
      users.forEach(function (user) {
        result.push(JSON.parse(user));
      });
      callback(result);
    })
  });
};

function set(id, object, callback) {
  db.set('user:' + id, JSON.stringify(object), function (error, reply) {
    if (error) throw error;
    reply && callback(object);
  });
}

function randomName() {
  return 'Sin Nombre ' + new Date().getMilliseconds();
};

function generateId(callback) {
  db.incr('userId', function (error, reply) {
    if (error) throw error;
    reply && callback(reply);
  });
}

function _merge(target, attributes) {
  if ('object' !== typeof attributes) return target;
  for(var attr in attributes){
    if (target.hasOwnProperty(attr)) {
      target[attr] = attributes[attr];
    }
  };
  return target;
}
