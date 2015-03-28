import {
  moduleFor,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleFor('service:indexeddb-store', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
  beforeEach: function () {
    indexedDB.deleteDatabase('ember-idb');
  },
  afterEach: function () {
    QUnit.stop();
    indexedDB.deleteDatabase('ember-idb');
    QUnit.start();
  }
});

test('Creates a DB', function(assert) {

  var service = this.subject();

  return service.getConnection().then(function(conn) {
    assert.equal(conn.name, 'ember-idb');
    conn.close();
  });

});

test('Creates an object store', function (assert) {
  var service = this.subject();
  service.set('objectStores', ['things']);

  return service.getConnection().then(function(conn) {
    assert.ok(conn.objectStoreNames.contains('things'));
    conn.close();
  });

});

test('Creates multiple object stores', function (assert) {
  assert.expect(2);
  var service = this.subject();
  service.set('objectStores',  ['things', 'otherThings']);

  return service.getConnection().then(function(conn) {
    assert.ok(conn.objectStoreNames.contains('things'));
    assert.ok(conn.objectStoreNames.contains('otherThings'));
    conn.close();
  });

});

test('Add an object to the store', function(assert) {
  var service = this.subject();
  service.set('objectStores', ['things']);
  var testObject = {name: 'Lynda Carter', alias: 'Wonder Woman'};
  return service.save('things', testObject).then(function(outcome){
    assert.ok(outcome);
  });
});

test('Retreives an object from the store', function(assert) {
  var service = this.subject();
  service.set('objectStores', ['things']);
  var testObject = {name: 'Lynda Carter', alias: 'Wonder Woman'};
  return service.save('things', testObject).then(function () {
    service.retreive('things', 1).then(function(wonderWoman) {
      assert.deepEqual(testObject, wonderWoman);
    });
  });
});

test('Rejects promise when no object is found', function(assert) {
  var service = this.subject();
  service.set('objectStores', ['things']);
  var resolve = function (thing) { console.log(thing);};
  return service.retreive('things', 1).then(resolve, function (msg) {
    assert.equal(msg, 'Record with id 1 not found');
  });
});
