// CookieMonster authentication method.
//
//
// It uses cookies and uuid V1 to try to give and identity to each client.
//
// The uuid will be the key in redis, and the value is a json sting that
// has the user characteristics such as nickname or status.

var uuid = require('node-uuid')
    , redis = require('redis')
    , dbclient = redis.createClient();

var cm = module.exports;

cm.allocate = function () {
  var id = uuid.v1()
      , user = new User();

  dbclient.set(id, user.tojson());
  return id;
};

cm.set = function (key, value) {
  return dbclient.set(key, JSON.stringify(value) );
};

cm.get = function (key, cb) {
  return dbclient.get(key, function (error, record) {
    cb(error, JSON.parse(record));
  });
};

cm.db = dbclient;

var User = function(nickname){
  this.nickname = nickname || 'unamed'
}

User.prototype.tojson = function () {
  return JSON.stringify(this);   
};
