import {
  module,
  test
} from 'qunit';

import IndexedDBStore from 'ember-cli-indexeddb-wrapper/services/indexeddb-store';

var service;

module('indexeddb-store', {
  beforeEach: function () {
    indexedDB.deleteDatabase('ember-idb');
    service = IndexedDBStore.create();
  },
  afterEach: function () {
    QUnit.stop();
    indexedDB.deleteDatabase('ember-idb');
    QUnit.start();
  }
});

test('Creates a DB', function(assert) {

  return service.getConnection().then(function(conn) {
    assert.equal(conn.name, 'ember-idb');
    conn.close();
  });

});

test('Creates an object store', function (assert) {
  service.set('objectStores', ['things']);

  return service.getConnection().then(function(conn) {
    assert.ok(conn.objectStoreNames.contains('things'));
    conn.close();
  });

});

test('Creates multiple object stores', function (assert) {
  assert.expect(2);
  service.set('objectStores',  ['things', 'otherThings']);

  return service.getConnection().then(function(conn) {
    assert.ok(conn.objectStoreNames.contains('things'));
    assert.ok(conn.objectStoreNames.contains('otherThings'));
    conn.close();
  });

});

test('Add an object to the store', function(assert) {
  service.set('objectStores', ['things']);
  var testObject = {name: 'Lynda Carter', alias: 'Wonder Woman'};
  return service.save('things', testObject).then(function(outcome){
    assert.ok(outcome);
  });
});

test('Retreives an object from the store', function(assert) {
  service.set('objectStores', ['things']);
  var testObject = {name: 'Lynda Carter', alias: 'Wonder Woman'};
  return service.save('things', testObject).then(function () {
    service.getOne('things', 1).then(function(wonderWoman) {
      assert.deepEqual(testObject, wonderWoman);
    });
  });
});

test('Rejects promise when no object is found', function(assert) {
  service.set('objectStores', ['things']);
  var resolve = function (thing) { };
  return service.getOne('things', 1).then(resolve, function (msg) {
    assert.equal(msg, 'Record with id 1 not found');
  });
});

test('Updates an exisiting record', function (assert) {
  assert.expect(2);
  service.set('objectStores', ['things']);
  var testObject = {name: 'Lynda Carter', alias: 'Wonder Woman'};
  return service.save('things', testObject).then(function(){
    testObject.status = 'alive';
    service.update('things',1,testObject).then(function(outcome) {
      assert.ok(outcome);
      service.getOne('things', 1).then(function(result) {
        assert.deepEqual(result, testObject);
      });
    });
  });
});

test('Deletes a record', function (assert) {
  service.set('objectStores', ['things']);
  var testObject = {name: 'Lynda Carter', alias: 'Wonder Woman'};
  return service.save('things', testObject).then(function(){
    service.deleteItem('things', 1).then(function(outcome) {
      assert.ok(outcome);
    });
  });
});

test('Saves many', function (assert) {
  assert.expect(2);
  service.set('objectStores', ['things']);
  var testObjects = [
    {name: 'Lynda Carter', alias: 'Wonder Woman'},
    {name: 'Jean Grey', alias: 'Storm'}
    ];

  return service.save('things', testObjects).then(function(){
    service.getOne('things', 1).then(function (result) {
      assert.deepEqual(result, testObjects[0]);

      service.getOne('things', 2).then(function (result) {
        assert.deepEqual(result, testObjects[1]);
      });

    });
  });

});

test('Retreives many', function (assert) {
  service.set('objectStores', ['things']);
  var testObjects = [
    {name: 'Lynda Carter', alias: 'Wonder Woman'},
    {name: 'Jean Grey', alias: 'Storm'}
    ];
  return service.save('things', testObjects).then(function(){
    service.getAll('things').then(function (result) {
      assert.deepEqual(result, testObjects);
    });
  });
});
