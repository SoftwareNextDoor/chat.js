exports = module.exports = {}

exports.Message = Message;

var db_key = 'messages'
  , redis = require('redis').createClient()
  , _ = require('underscore')


function Message(sender, body) {
  this.time = new Date();
  this.sender = sender;
  this.body = body;
}

Message.last = function (range, callback) {
  var range = range || 5;

  redis.lrange( db_key , -range, -1, function (error, messages) {
    if (!_(messages).isEmpty()) {
      callback( Message.parse(messages) );
    }
  });
};

Message.parse = function (messages) {
  if (_.isArray(messages)){
    return _.map(messages, function (m) {
      return JSON.parse(m);
    });
  } else {
    return JSON.parse(messages);
  }
};


Message.prototype.__proto__ = require('./jsonify.js');

Message.prototype.save = function (callback) {
  var self = this;
  redis.rpush(db_key, this, function (error, _) {
    if (error) throw error;
    callback(self);
  });
}
