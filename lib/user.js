var db = require('./db_configurator').client;

function User(attributes) {
  attributes = attributes || {};
  this.id = attributes.id || null;
  this.name = attributes.name || randomName()
  this.status = attributes.status || 'online';
  this.notifications = attributes.notifications || true;
}


User.prototype.save = function(callback){
  var self = this;
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
  this.save(callback || function(){});
};

exports.create = function (callback) {
  new User().save(callback);
};

exports.find = function (uid, callback) {
  var key = 'user:' + uid;
  db.get(key, function (error, reply) {
    if (error) throw error;
    reply && callback(new User(JSON.parse(reply)));
    reply || callback(reply);
  });
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
