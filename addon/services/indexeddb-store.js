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

        var storeRequest = objectStore.add(object);

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
  retreive: function(storeName, id) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.getConnection().then(function(db) {
        var transaction = db.transaction([storeName], 'readonly');

        var objectStore = transaction.objectStore(storeName);

        var findRequest = objectStore.get(id);

        findRequest.onsuccess = function (e) {
          var result = e.target.result;
          if (result !== undefined) {
            resolve(result);
          } else {
            reject(`Record with id ${id} not found`);
          }
          db.close();
        };

        findRequest.onerror = function (e) {
          console.log('Retreive error', e);
          db.close();
        };
      });
    });
  },
  deleteItem: function(storeName, id) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.getConnection().then(function(db) {
        var transaction = db.transaction([storeName], 'readwrite');

        var objectStore = transaction.objectStore(storeName);

        var deleteRequest = objectStore.delete(id);

        deleteRequest.onsuccess = function () {
          resolve(true);
          db.close();
        };

        deleteRequest.onerror = function (e) {
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
      console.log('onerror', e);
    };

  }
});
