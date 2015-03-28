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
      }

      openRequest.onerror = function (e) {
        reject(e.target);
      };
    });
  },
  _addObjectStores: function () {
    var self = this;
    return new Ember.RSVP.Promise((resolve, reject) => {
      var version = this.get('version') + 1;

      var openRequest = indexedDB.open(this.get('databaseNamespace', version));

      openRequest.onupgradeneeded = function (e) {
        var conn = e.target.result;
        self.objectStores.forEach(function(storeName){
          if (!conn.objectStoreNames.contains(storeName)) {
            return conn.createObjectStore(storeName);
          };
        });
      }

      openRequest.onsuccess = function (e) {
        e.target.result.close();
        self.set('version', version);
        resolve();
      }

      openRequest.onerror = function (e) {
        console.log('onerror', e);
        reject(e);
      }

    })
  }
});
