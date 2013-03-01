exports = module.exports = {};

var redis = require('redis')
  , client = redis.createClient();

exports.client = client;

var environments = {
  production: 0,
  development: 1,
  test: 2
};

exports.configure = function () {
  client.select(environments[process.env.NODE_ENV]);
}
