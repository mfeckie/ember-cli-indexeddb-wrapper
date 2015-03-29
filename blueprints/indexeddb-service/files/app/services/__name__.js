import IndexedDBStore from 'ember-cli-indexeddb-wrapper/services/indexeddb-store';

/*
    Any time you update your objectStores property, increment version to
    trigger creation of the new stores

*/

export default IndexedDBStore.extend({
  // Override these properties to customise for your application
  // databaseNamespace: '',
  // version: 1,
  // objectStores: []
});
