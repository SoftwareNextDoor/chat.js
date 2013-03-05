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


//var db = require('./db_configurator').client;


//exports.getFromSession = function (session, events) {

  //var defaultEvents = {
    //notDefined: function () { console.log('notDefined'); },
    //ready: function () { console.log('ready'); }
  //}

  //_merge(events, defaultEvents);

  //if ('undefined' === typeof session.user) {
    //session.user = new User();
    //session.save();
    //events.ready(session.user);
  //} else {
    //events.ready(session.user);
  //};


  //function User() {
    //this.name = 'Sin Nombre ' + new Date().getMilliseconds();
    //this.status = 'online';
    //this.notifications = true;
  //}

  //User.prototype.update = function (attributes) {
    //_merge(this, attributes);
    //session.save();
  //};
//};


//function _merge(target, attributes) {
  //if ('object' !== typeof attributes) return target;
  //for(var attr in attributes){
    //if (!target.hasOwnProperty(attr)) {
      //target[attr] = attributes[attr];
    //}
  //};
  //return target;
//}

////var db = require('./db_configurator').client,
    ////util = require('util'),
    ////EventEmitter = require('events').EventEmitter;

////exports.withSession = withSession;

////function withSession(session) {
  ////EventEmitter.call(this);

  ////var self = this
    ////, activeUser = null;

  ////this.on('find', function () {
    ////if ('undefined' === typeof session.uid) {
      ////self.emit('notFound');
    ////} else {
      ////if (activeUser) return self.emit('found', activeUser);
      ////db.get('user:' + session.uid, function (error, user) {
        ////if (error) throw error
        ////activeUser = JSON.parse(user);
        ////user && self.emit('found', activeUser);
      ////});
    ////}
  ////});

  ////this.on('create', function () {
    ////self.emit('generateUid');
    ////self.on('UidReady', function (uid) {
      ////var user = new User(uid);
      ////db.set('user:' + uid, JSON.stringify(user), function (error, reply) {
        ////if (error) throw error;
        ////if (reply) {
          ////session.uid = user.id
          ////session.save();
          ////activeUser = user;
          ////self.emit('created', user)
        ////} else { self.emit('error'); }
      ////});
    ////})
  ////});


  ////this.on('findAll', function () {
    ////db.keys('user:*', function (error, keys) {
      ////if (error) throw error;
      ////db.mget(keys, function (error, users) {
        ////var usersAsObjects = [];
        ////users.forEach(function (user, index) {
          ////usersAsObjects[index] = JSON.parse(user);
        ////});
        ////self.emit('foundAll', usersAsObjects);
      ////});
    ////});
  ////});


  ////this.on('update', function (attributes) {
    ////self.once('found', function (user) {
      ////_merge(user, attributes);

      ////db.set('user:' + user.id, JSON.stringify(user), function (error, reply) {
        ////if (error) throw error;
        ////reply && self.emit('updated', user);
      ////});
    ////});

    ////self.emit('find');
  ////});

  ////this.on('generateUid', function () {
    ////db.incr('userID', function (error, id) {
      ////if(error)  throw error;
      ////self.emit('UidReady', id);
    ////});
  ////});

////}

////util.inherits(withSession, EventEmitter);


