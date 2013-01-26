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

// allocate
//
// will generate a uuid to save it in redis with an empty user
// object as value.
//
//  "users:{superlonguuid}" => {} //user object as json string
//
// Returns the generated uuid
cm.allocate = function () {
  var id = uuid.v1()
      , user = new User();

  dbclient.set(id, user.tojson());
  return id;
};

// set
//
// Proxy method that automatically converts an object into a Json
// string.
//
// If you want the normal redis behaviour, use cm.db.get()
cm.set = function (key, value) {
  return dbclient.set(key, JSON.stringify(value) );
};

// get
//
// Proxy method that will parse the saved string into a JS object.
cm.get = function (key, cb) {
  return dbclient.get(key, function (error, record) {
    cb(error, JSON.parse(record));
  });
};

// Expose the dbclient if some weird operations need to be made.
cm.db = dbclient;


// WIP of user class.
var User = function(nickname){
  this.nickname = nickname || 'unamed'
}

User.prototype.tojson = function () {
  return JSON.stringify(this);   
};
