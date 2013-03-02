var redis = require('redis')
  , client = redis.createClient();

var environments = {
  production: 0,
  development: 1,
  test: 2
};

var selectedDB = environments[process.env.NODE_ENV];

client.select(selectedDB);

exports.selectedDB = selectedDB;
exports.client = client;
