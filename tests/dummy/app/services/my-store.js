import IndexedDBStore from 'ember-cli-indexeddb-wrapper/services/indexeddb-store';

export default IndexedDBStore.extend({
  databaseNamespace: 'stuff',
  version: 1,
  objectStores: [{name: 'superheroes', indexes:[{key: 'name', options: {unique: true}}]}]
});
