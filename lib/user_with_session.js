var User = require('./user');

exports.find = function (session, callback) {
  if ('undefined' === typeof session.uid) {
    User.create(function(user){
      session.uid = user.id
      session.save();
      callback(user);
    });
  } else {
    User.find(session.uid, function (user) {
      callback(user);
    });
  }
};
