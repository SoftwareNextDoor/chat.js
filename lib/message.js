var db = require('../lib/db_configurator').client
    , key = 'messages';

function Message(attributes) {
  attributes = attributes || {};
  this.time = new Date();
  this.sender = attributes.sender || null;
  this.body = attributes.body || null;

  if (this.body === null){
    this.type = 'empty'
  } else if (this.sender === null) {
    this.type = 'notice';
  } else {
    this.type = 'conversation';
  }
}

exports.last = function (range, callback) {
  range = range || 5;
  get(range, callback);
};

exports.create = function (attributes, callback) {
  new Message(attributes).save(callback || function(){})
};

exports.build = function (attrs, callback) {
  return new Message(attrs);
};

exports.notice = function (text) {
  return new Message({body: text});
};

exports.count = function (callback) {
  db.llen(key, function (error, reply) {
    if (error) throw error;
    callback(reply);
  });
};

Message.prototype.save = function (callback) {
  set(this, callback);
}

function get(amount, callback) {
  db.lrange( key , -amount, -1, function (error, messages) {
    var results = [];
    messages.forEach(function (message) {
      results.push(JSON.parse(message));
    });
    callback(results);
  });
}

function set(object, callback) {
  db.rpush( key , JSON.stringify(object), function (error, reply) {
    if (error) throw error;
    reply && callback(object);
    reply || callback(null);
  });
}
