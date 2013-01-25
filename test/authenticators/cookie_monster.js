var should = require('should')
    , cm = require('../../lib/authenticators/cookie_monster');

cm.db.flushdb();

test('It allocates new unnamed users', function () {
  var id = cm.allocate();

  var record = cm.get(id, function (error, record) {
    record.should.exist
    record.should.be.instanceOf(Object);
  });
});
