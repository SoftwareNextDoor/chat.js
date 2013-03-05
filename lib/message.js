var db = require('../lib/db_configurator').client;

function Message(attrs) {
  attrs = attrs || {};
  this.time = new Date();
  this.sender = attrs.sender || '';
  this.body = attrs.body || '';
}

exports.last = function (range, callback) {
  range = range || 5;
  get(range, callback);
};

exports.create = function (attrs, callback) {
  new Message(attrs).save(callback || function(){})
};

exports.build = function (attrs, callback) {
  callback(new Message(attrs));
};

Message.prototype.save = function (callback) {
  set(this, callback);
}


var key = 'messages'

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
