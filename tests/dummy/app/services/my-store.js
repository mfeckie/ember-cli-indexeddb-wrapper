import IndexedDBStore from 'indexeddb-wrapper/services/indexeddb-store';

export default IndexedDBStore.extend({
  databaseNamespace: 'stuff',
  version: 1,
  objectStores: ['superheroes']
});
