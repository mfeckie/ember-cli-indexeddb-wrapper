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

var setThingStore = function (service) {
  return service.set('objectStores', [{name: 'things'}]);
};

var resolvePlaceholder = function () {};

test('Creates a DB', function(assert) {

  return service.getConnection().then(function(conn) {
    assert.equal(conn.name, 'ember-idb');
    conn.close();
  });

});

test('Creates an object store', function (assert) {
  setThingStore(service);

  return service.getConnection().then(function(conn) {
    assert.ok(conn.objectStoreNames.contains('things'));
    conn.close();
  });

});

test('Creates multiple object stores', function (assert) {
  assert.expect(2);
  service.set('objectStores',  [
    {name: 'things'},
    {name: 'otherThings'}
    ]);

  return service.getConnection().then(function(conn) {
    assert.ok(conn.objectStoreNames.contains('things'));
    assert.ok(conn.objectStoreNames.contains('otherThings'));
    conn.close();
  });
});

test('Can create stores with indexes', function (assert){
  service.set('objectStores', [
      {
        name: 'indexedThings',
        indexes: [{key: 'name', options: {unique: true}}]
      }
    ]);

  var testObjects = [
    {name: 'Lynda Carter', alias: 'Wonder Woman'},
    {name: 'Lynda Carter', alias: 'Batman'}
    ];
  return service.save('indexedThings', testObjects).then(resolvePlaceholder, function (msg) {
    assert.equal(msg.name, 'ConstraintError');
  });
});

test('Add an object to the store', function(assert) {
  setThingStore(service);
  var testObject = {name: 'Lynda Carter', alias: 'Wonder Woman'};
  return service.save('things', testObject).then(function(outcome){
    assert.ok(outcome);
  });
});

test('Retrieves an object from the store', function(assert) {
  setThingStore(service);
  var testObject = {name: 'Lynda Carter', alias: 'Wonder Woman'};
  return service.save('things', testObject).then(function () {
    service.getOne('things', 1)
    .then(function(wonderWoman) {
      assert.deepEqual(testObject, wonderWoman);
    });
  });
});

test('Rejects promise when no object is found', function(assert) {
  setThingStore(service);
  return service.getOne('things', 1).then(resolvePlaceholder, function (msg) {
    assert.equal(msg, 'Record with id 1 not found');
  });
});

test('Updates an existing record', function (assert) {
  assert.expect(2);
  setThingStore(service);
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
  setThingStore(service);
  var testObject = {name: 'Lynda Carter', alias: 'Wonder Woman'};
  return service.save('things', testObject).then(function(){
    service.deleteItem('things', 1).then(function(outcome) {
      assert.ok(outcome);
    });
  });
});

test('Saves many', function (assert) {
  assert.expect(2);
  setThingStore(service);
  var testObjects = [
    {name: 'Lynda Carter', alias: 'Wonder Woman'},
    {name: 'Jean Grey', alias: 'Phoenix'}
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

test('Retrieves many', function (assert) {
  setThingStore(service);
  var testObjects = [
    {name: 'Lynda Carter', alias: 'Wonder Woman'},
    {name: 'Jean Grey', alias: 'Phoenix'}
    ];
  return service.save('things', testObjects).then(function(){
    service.getAll('things')
    .then(function (result) {
      assert.deepEqual(result, testObjects);
    });
  });
});

test('Retrieves objects by index', function (assert){
  service.set('objectStores', [{name: 'superheroes', indexes: [
    {key: 'alias', options: {}}
  ]}]);
  var testObjects = [
    {name: 'Jean Grey', alias: 'Phoenix'},
    {name: 'Lynda Carter', alias: 'Wonder Woman'},
    {name: 'Jean Grey-Summers', alias: 'Phoenix'},
    {alias: 'Phoenix'}
  ];
  return service.save('superheroes', testObjects).then(function() {
    service.getByIndex('superheroes', 'alias', 'Phoenix')
    .then(function(records) {
      assert.deepEqual(records, [testObjects[0], testObjects[2], testObjects[3]]);
    });
  });
});

test('get one by index', function (assert){
  service.set('objectStores', [{name: 'superheroes', indexes: [
    {key: 'alias', options: {}}
  ]}]);
  var testObjects = [
    {name: 'Jean Grey', alias: 'Phoenix'},
    {name: 'Lynda Carter', alias: 'Wonder Woman'},
    {name: 'Jean Grey-Summers', alias: 'Phoenix'}
  ];
  return service.save('superheroes', testObjects).then(function() {
    service.getOneByIndex('superheroes', 'alias', 'Phoenix')
    .then(function(record) {
      assert.deepEqual(record, testObjects[0]);
    });
  });
});

test('get one by index when object does not exist', function (assert){
  service.set('objectStores', [{name: 'superheroes', indexes: [
    {key: 'alias', options: {}}
  ]}]);
  var testObjects = [
    {name: 'Jean Grey', alias: 'Phoenix'},
    {name: 'Lynda Carter', alias: 'Wonder Woman'}
  ];
  return service.save('superheroes', testObjects).then(function() {
    service.getOneByIndex('superheroes', 'alias', 'Cyclops')
    .then(resolvePlaceholder, function () {
      assert.ok(true);
    });
  });
});

test('Get or create by index when object does not exist', function (assert){
  service.set('objectStores', [{name: 'superheroes', indexes: [
    {key: 'alias', options: {}}
  ]}]);
  return service.getOrCreateByIndex('superheroes', 'alias', 'Cyclops')
  .then(function (result) {
    assert.deepEqual(result, {alias: 'Cyclops'});
  });
});

test('Get or create by index with custom object', function (assert){
  service.set('objectStores', [{name: 'superheroes', indexes: [
    {key: 'alias', options: {}}
  ]}]);
  var customObject = {name: 'Scott Summers', alias: 'Cyclops'};
  return service.getOrCreateByIndex('superheroes', 'alias', 'Cyclops', customObject)
  .then(function (result) {
    assert.deepEqual(result, customObject);
  });
});

test('Get or create by index when object does exist', function (assert){
  service.set('objectStores', [{name: 'superheroes', indexes: [
    {key: 'alias', options: {}}
  ]}]);
  var testObjects = [
    {name: 'Lynda Carter', alias: 'Wonder Woman'}
  ];
  return service.save('superheroes', testObjects).then(function() {
    service.getOrCreateByIndex('superheroes', 'alias', 'Wonder Woman')
    .then(function (result) {
      assert.deepEqual(result, testObjects[0]);
    });
  });
});

test('Update by index', function (assert){
  service.set('objectStores', [{name: 'superheroes', indexes: [
    {key: 'alias', options: {}}
  ]}]);
  var testObject = {name: 'Jean Grey', alias: 'Phoenix'};
  var replacementObject = {name: 'Jean Grey-Summers', alias: 'Phoenix'};
  return service.save('superheroes', testObject).then(function () {
    service.updateByIndex('superheroes', 'alias', 'Phoenix', replacementObject)
    .then(function () {
      service.getOneByIndex('superheroes', 'alias', 'Phoenix')
      .then(function (result) {
        assert.deepEqual(result, replacementObject);
      });
    });
  });
});

test('Update by index when object does not exist', function (assert){
  service.set('objectStores', [{name: 'superheroes', indexes: [
    {key: 'alias', options: {}}
  ]}]);
  var testObject = {name: 'Jean Grey', alias: 'Phoenix'};
  var replacementObject = {name: 'Jean Grey-Summers', alias: 'Phoenix'};
  return service.save('superheroes', testObject).then(function () {
    service.updateByIndex('superheroes', 'alias', 'Cyclops', replacementObject)
    .then(resolvePlaceholder, function () {
      assert.ok(true);
    });
  });
});
