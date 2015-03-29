import Ember from 'ember';

export default Ember.Service.extend({
  databaseNamespace: 'ember-idb',
  version: 1,
  objectStores: [],
  init: function() {
    this._addObjectStores();
  },
  getConnection: function () {
    return new Ember.RSVP.Promise((resolve, reject) => {

      var openRequest = indexedDB.open(this.get('databaseNamespace'), this.get('version'));

      openRequest.onsuccess = function (e) {
        resolve(e.target.result);
      };

      openRequest.onerror = function (e) {
        reject(e.target);
      };
    });
  },
  save: function (storeName, object) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.getConnection().then(function(db) {

        var transaction = db.transaction([storeName], 'readwrite');

        var objectStore = transaction.objectStore(storeName);

        if(Array.isArray(object)) {
          object.forEach(function(item) {
            objectStore.add(item);
          });
        } else {
          objectStore.add(object);
        }

        transaction.oncomplete = function () {
          resolve(true);
          db.close();
        };


        transaction.onerror = function (e) {
          console.log('Store error', e);
          reject();
          db.close();
        };

      });
    });
  },
  update: function(storeName, id, object) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.getConnection().then(function(db) {

        var transaction = db.transaction([storeName], 'readwrite');

        var objectStore = transaction.objectStore(storeName);

        var storeRequest = objectStore.put(object, id);

        storeRequest.onsuccess = function () {
          resolve(true);
          db.close();
        };

        storeRequest.onerror = function (e) {
          console.log('Store error', e);
          reject();
          db.close();
        };

      });
    });
  },
  getOne: function(storeName, id) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.getConnection().then(function(db) {
        var transaction = db.transaction([storeName], 'readonly');

        var objectStore = transaction.objectStore(storeName);

        var findRequest = objectStore.get(id);
        var record;

        findRequest.onsuccess = function (e) {
          var result = e.target.result;
          if (result !== undefined) {
            record = result;
          } else {
            reject(`Record with id ${id} not found`);
          }
          db.close();
        };

        findRequest.onerror = function (e) {
          console.log('Retreive error', e);
          db.close();
        };

        transaction.oncomplete = function () {
          resolve(record);
          db.close();
        };

      });
    });
  },
  getAll: function (storeName) {
    return new Ember.RSVP.Promise((resolve, reject) =>{
      this.getConnection().then(function(db) {
        var transaction = db.transaction([storeName], 'readonly');

        var objectStore = transaction.objectStore(storeName);

        var records = [];

        var iterator = objectStore.openCursor();

        iterator.onsuccess = function(e) {
          var cursor = e.target.result;
          if (cursor) {
            records.push(cursor.value);
            cursor.continue();
          } else {
            resolve(records);
            db.close();
          }
        };

        iterator.onerror = function () {
          reject();
        };

      });
    });
  },
  deleteItem: function(storeName, id) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.getConnection().then(function(db) {
        var transaction = db.transaction([storeName], 'readwrite');

        var objectStore = transaction.objectStore(storeName);

        objectStore.delete(id);

        transaction.oncomplete = function () {
          resolve(true);
          db.close();
        };

        transaction.onerror = function (e) {
          console.log('Delete error', e);
          reject(e);
          db.close();
        };

      });
    });
  },
  _addObjectStores: function () {
    var self = this;
    var version = self.get('version');

    var openRequest = indexedDB.open(self.get('databaseNamespace'), version);


    openRequest.onupgradeneeded = function (e) {
      var db = e.target.result;
      self.objectStores.forEach(function(storeName){
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { autoIncrement : true });
        }
      });
    };

    openRequest.onsuccess = function (e) {
      e.target.result.close();
    };

    openRequest.onerror = function (e) {
      console.error(e);
    };
  }
});
