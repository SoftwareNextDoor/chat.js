var db = require('./db_configurator').client,
    util = require('util'),
    EventEmitter = require('events').EventEmitter;


function UserManager() {
  EventEmitter.call(this);
}

util.inherits(UserManager, EventEmitter);

exports = module.exports = new UserManager();


function User(id) {
  this.id = id + '';
  this.name = 'Sin Nombre ' + new Date().getMilliseconds();
  this.status = 'online';
  this.notifications = true;
}

exports.on('find', function (uid) {
  db.get('user:' + uid, function (error, user) {
    if (error) throw error
    user && exports.emit('found', JSON.parse(user));
    user || exports.emit('notFound');
  });
})

exports.on('findAll', function () {

  db.keys('user:*', function (error, keys) {
    if (error) throw error;
    db.mget(keys, function (error, users) {
      var usersAsObjects = [];
      users.forEach(function (user, index) {
        usersAsObjects[index] = JSON.parse(user);
      });
      exports.emit('foundAll', usersAsObjects);
    });

  });

});

function merge(target, attributes) {
  if ('object' !== typeof attributes) return target;
  for(var attr in target){
    if (attr !== 'id') target[attr] = attributes[attr];
  };
  return target;
}

exports.on('update', function (user, attributes) {
  merge(user, attributes);

  db.set('user:' + user.id, JSON.stringify(user), function (error, reply) {
    if (error) throw error;
    reply && exports.emit('updated', user);
  });
});

exports.on('create', function () {
  exports.emit('generateUid');
  exports.on('UidReady', function (uid) {
    var user = new User(uid);
    db.set('user:' + uid, JSON.stringify(user), function (error, reply) {
      if (error) throw error;
      reply && exports.emit('created', user);
      reply || exports.emit('error');
    });
  })
});

exports.on('generateUid', function () {
  db.incr('userID', function (error, id) {
    if(error)  throw error;
    exports.emit('UidReady', id);
  });
});
