import {
  moduleFor,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleFor('service:indexeddb-store', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
  beforeEach: function () {

    var conn = indexedDB.deleteDatabase('ember-idb');

  }
});

test('Creates a DB', function(assert) {
  assert.expect(1);

  var service = this.subject();

  return service.getConnection().then(function(conn) {
    assert.equal(conn.name, 'ember-idb');
    conn.close();
  });

});

test('Creates an object store', function (assert) {
  assert.expect(1);
  var service = this.subject();
  return service.addObjectStore('things').then(function () {
    return service.getConnection().then(function(conn) {
      assert.ok(conn.objectStoreNames.contains('things'));
      conn.close();
    });
  });
});
