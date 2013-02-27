exports = module.exports = {}

// Take advantage of redis toString before it inserts.
exports.toString = function () {
  return JSON.stringify(this);
}
