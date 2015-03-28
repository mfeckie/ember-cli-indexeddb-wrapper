import Ember from 'ember';

// var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

export default Ember.Service.extend({
  databaseNamespace: 'ember-idb',
  version: 1,
  createDB: function () {

      var openRequest = indexedDB.open(this.get('databaseNamespace'), 1);

      openRequest.onupgradeneeded = function (e) {
        console.log('Upgrading');
      };

      openRequest.onsuccess = function (e) {
      }

      openRequest.error = function (e) {
      };
  },
  getConnection: function () {
    return new Ember.RSVP.Promise((resolve, reject) => {

      var openRequest = indexedDB.open(this.get('databaseNamespace'), this.get('version'));

      openRequest.onsuccess = function (e) {
        resolve(e.target.result);
      }

      openRequest.onerror = function (e) {
        reject(e.target);
      };
    });
  },
  addObjectStore: function (storeName) {
    var self = this;
    return new Ember.RSVP.Promise((resolve, reject) => {
      var version = this.get('version') + 1;

      var openRequest = indexedDB.open(this.get('databaseNamespace', version));
      
      openRequest.onupgradeneeded = function (e) {
        var conn = e.target.result;
        if (!conn.objectStoreNames.contains(storeName)) {
          conn.createObjectStore(storeName);
        };
      }

      openRequest.onsuccess = function (e) {
        self.set('version', version);

        e.target.result.close();
        resolve();
      };

      openRequest.onerror = function (e) {
        console.log('onerror');
        reject(e);
      }

    })
  }
});
